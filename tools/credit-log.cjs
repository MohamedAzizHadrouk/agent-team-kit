#!/usr/bin/env node
// Wakil – credit usage log: usage/credits.jsonl (private, git-ignored).
// ONE JSON LINE PER PROMPT (main-session turn) and per sub-agent run, with the tool, the provider, the model, the tokens
// and the credits (ACU, formula of usage/registry.json in effect at that date). Wakil Desktop reads ONLY this file to
// show credits, percentages and the cost of every prompt, session, project, task, entity and agent.
//
// Written automatically after every prompt by hooks (Claude Code Stop/SubagentStop, Codex notify, Cursor stop) and on
// demand by `sync` (catch-up of everything the local logs hold that the file does not). Append-only: a line whose usage
// changed later is re-written with the same id and rev+1 – readers keep the LAST line of each id.
//
//   node tools/credit-log.cjs sync [--tool claude|codex|all] [--quiet]
//   node tools/credit-log.cjs hook --tool claude|codex|cursor            (payload on stdin, or last argv for Codex)
//   node tools/credit-log.cjs add --tool cursor [--model m] [--credits N | --requests N | --input --output --cached]
//        [--project <entity>/<project|none>] [--task T-001] [--agent ui-ux] [--prompt "…"] [--date YYYY-MM-DD] --source-tool claude|cursor|codex
//   node tools/credit-log.cjs show [--last 20]
//   node tools/credit-log.cjs report [--provider id | --subscription id] [--from YYYY-MM-DD] [--to YYYY-MM-DD]
//        [--by prompt|session|project|task|entity|agent|model|provider|day] [--json]
'use strict'
const fs = require('fs')
const path = require('path')
const os = require('os')

const ROOT = process.env.WAKIL_ROOT ? path.resolve(process.env.WAKIL_ROOT) : path.resolve(__dirname, '..')
const FILE = path.join(ROOT, 'usage', 'credits.jsonl')
const PENDING = path.join(ROOT, 'usage', '.credits-pending.json') // Cursor: prompt text waiting for its stop event
const REGISTRY = path.join(ROOT, 'usage', 'registry.json')
const LINE_VERSION = 1
const PROMPT_CHARS = 200

class UserError extends Error {}
const fail = (m) => { throw new UserError(m) }
const pad = (n) => String(n).padStart(2, '0')
const ymdLocal = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
const localDay = (iso) => (/^\d{4}-\d{2}-\d{2}$/.test(iso) ? iso : ymdLocal(new Date(iso)))
const today = () => ymdLocal(new Date())

// ---------- registry (read-only here) ----------
const DEFAULT_ACU = { version: 1, from: '2000-01-01', weights: { input: 1, output: 2, cached: 0.25, overhead: 0.5 }, multipliers: [], defaultMultiplier: 1, estimation: [] }
function loadRegistry() {
  try {
    const r = JSON.parse(fs.readFileSync(REGISTRY, 'utf8'))
    r.providers = r.providers || []
    r.subscriptions = r.subscriptions || []
    r.acu = r.acu && r.acu.length ? r.acu : [DEFAULT_ACU]
    r.settings = r.settings || { baseCurrency: 'USD', fx: {} }
    return r
  } catch {
    return { providers: [], subscriptions: [], acu: [DEFAULT_ACU], settings: { baseCurrency: 'USD', fx: {} } }
  }
}
const acuAt = (reg, day) => [...reg.acu].sort((a, b) => a.version - b.version).filter((v) => v.from <= day).pop() || reg.acu[0]
function multiplierFor(model, cfg) {
  const m = String(model || '').toLowerCase()
  let best
  for (const x of cfg.multipliers || []) if (m.startsWith(x.match.toLowerCase()) && (!best || x.match.length > best.match.length)) best = x
  return best ? best.value : cfg.defaultMultiplier ?? 1
}
/** Same formula as Wakil Desktop: Σ per model [(I×Wi + O×Wo + C×Wc) × M + R × requests] – tokens / 1000. */
function creditsOf(byModel, cfg) {
  const w = cfg.weights
  let acu = 0
  for (const [model, t] of Object.entries(byModel)) {
    const I = (t.input + t.cacheWrite5m + t.cacheWrite1h) / 1000
    const total = t.input + t.output + t.cacheWrite5m + t.cacheWrite1h + t.cacheRead
    const requests = t.requestsUnknown ? 1 : t.requests || (total > 0 ? 1 : 0)
    acu += (I * w.input + (t.output / 1000) * w.output + (t.cacheRead / 1000) * w.cached) * multiplierFor(model, cfg) + w.overhead * requests
  }
  return Math.round(acu * 1000) / 1000
}
function estimatedCredits(requests, keys, cfg) {
  let best
  for (const key of keys) {
    if (!key) continue
    const k = String(key).toLowerCase()
    for (const e of cfg.estimation || []) if (k.startsWith(e.match.toLowerCase()) && (!best || e.match.length > best.match.length)) best = e
  }
  return best ? Math.round(requests * best.acuPerRequest * 1000) / 1000 : null
}
function providerFor(reg, tool, model) {
  const integ = tool === 'claude' ? 'claude-code-logs' : tool === 'codex' ? 'codex-logs' : null
  const p = integ && reg.providers.find((x) => x.integration === integ)
  if (p) return p.id
  if (tool === 'cursor') return (reg.providers.find((x) => x.id === 'cursor') || {}).id || 'cursor'
  if (tool === 'claude' || /^claude/i.test(model || '')) return 'anthropic'
  if (tool === 'codex' || /^(gpt|o\d|codex)/i.test(model || '')) return 'openai'
  return tool
}

// ---------- attribution (entity / project / task) ----------
const norm = (s) => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const dirs = (p) => { try { return fs.readdirSync(p, { withFileTypes: true }).filter((d) => d.isDirectory() && !d.name.startsWith('_') && !d.name.startsWith('.')).map((d) => d.name) } catch { return [] } }
let ctxCache = null
function context() {
  if (ctxCache) return ctxCache
  const entities = dirs(path.join(ROOT, 'entities')).map((slug) => ({ slug, projects: dirs(path.join(ROOT, 'entities', slug, 'projects')) }))
  entities.push({ slug: 'personal', projects: dirs(path.join(ROOT, 'ecosystem', 'projects')) })
  return (ctxCache = { entities })
}
function attribute(text) {
  const t = String(text || '')
  const task = t.match(/TASK:\s*([\w.-]+)\/([\w.-]+)\/(T-\d+)/i)
  if (task) return { entity: task[1], project: task[2] === 'none' ? null : task[2], task: task[3].toUpperCase() }
  const { entities } = context()
  const client = (t.match(/client:\s*([\w.-]+)/i) || [])[1]
  const projRaw = (t.match(/project:\s*([\w.-]+)/i) || [])[1]
  const n = '-' + norm(t.slice(0, 600)) + '-'
  let ent = client ? entities.find((e) => e.slug.toLowerCase() === client.replace(/\.+$/, '').toLowerCase()) : null
  if (!ent) ent = entities.filter((e) => e.slug !== 'personal').find((e) => n.includes('-' + e.slug + '-'))
  if (!ent && /-(personal|personnel|perso)-/.test(n)) ent = entities.find((e) => e.slug === 'personal')
  if (!ent) return null
  let project = projRaw ? ent.projects.find((p) => p.toLowerCase() === projRaw.replace(/\.+$/, '').toLowerCase()) : null
  if (!project) project = [...ent.projects].sort((a, b) => b.length - a.length).find((p) => n.includes('-' + p + '-'))
  return { entity: ent.slug, project: project || null, task: null }
}

// ---------- local logs: Claude Code ----------
const emptyTokens = () => ({ input: 0, output: 0, cacheWrite5m: 0, cacheWrite1h: 0, cacheRead: 0, requests: 0 })
function addUsage(byModel, model, u) {
  if (!u || model === '<synthetic>') return
  const t = byModel[model || 'unknown'] || (byModel[model || 'unknown'] = emptyTokens())
  t.input += u.input_tokens || 0
  t.output += u.output_tokens || 0
  t.cacheRead += u.cache_read_input_tokens || 0
  const cc = u.cache_creation
  if (cc && (cc.ephemeral_5m_input_tokens || cc.ephemeral_1h_input_tokens)) {
    t.cacheWrite5m += cc.ephemeral_5m_input_tokens || 0
    t.cacheWrite1h += cc.ephemeral_1h_input_tokens || 0
  } else t.cacheWrite5m += u.cache_creation_input_tokens || 0
  t.requests += 1
}
const textOf = (c) => (typeof c === 'string' ? c : Array.isArray(c) ? c.filter((x) => x && x.type === 'text').map((x) => x.text).join('\n') : '')
function readJsonl(file) {
  const out = []
  let txt = ''
  try { txt = fs.readFileSync(file, 'utf8') } catch { return out }
  for (const line of txt.split('\n')) {
    if (!line.trim()) continue
    try { out.push(JSON.parse(line)) } catch {}
  }
  return out
}
const claudeLogDirs = () => {
  const base = path.join(os.homedir(), '.claude', 'projects')
  const enc = path.resolve(ROOT).replace(/[^A-Za-z0-9]/g, '-').toLowerCase()
  try { return fs.readdirSync(base).filter((n) => n.toLowerCase() === enc).map((n) => path.join(base, n)) } catch { return [] }
}

/** Main session file → prompts (turns) + sub-agent runs, in the same shape (and ids) as Wakil Desktop. */
function parseClaudeSession(file) {
  const sessionId = path.basename(file, '.jsonl')
  const recs = readJsonl(file)
  let title = ''
  const toolUses = {}
  const agentToTool = {}
  const inline = {}
  const turns = []
  let turn = null
  const seen = new Set()
  for (const r of recs) {
    if (r.type === 'custom-title' && r.customTitle) title = r.customTitle
    if (r.type === 'user' && r.message && !r.isSidechain) {
      const content = r.message.content
      const isToolResult = Array.isArray(content) && content.some((c) => c && c.type === 'tool_result')
      if (isToolResult) {
        const res = r.toolUseResult
        if (res && res.agentId) {
          const tr = content.find((c) => c && c.type === 'tool_result')
          if (tr) agentToTool[res.agentId] = tr.tool_use_id
        }
      } else if (!r.isMeta) {
        const text = textOf(content)
        if (text && !text.startsWith('<local-command') && !text.startsWith('<system-reminder')) {
          const cmd = text.match(/<command-name>\/?([^<]+)<\/command-name>/)
          const args = text.match(/<command-args>([\s\S]*?)<\/command-args>/)
          turn = { at: r.timestamp, text, prompt: (cmd ? `/${cmd[1]} ${args ? args[1] : ''}` : text).replace(/\s+/g, ' ').trim(), command: cmd ? cmd[1].trim() : null, byModel: {} }
          turns.push(turn)
        }
      }
    }
    if (r.type === 'assistant' && r.message) {
      for (const c of r.message.content || []) {
        if (c && c.type === 'tool_use' && (c.name === 'Agent' || c.name === 'Task') && c.input) {
          toolUses[c.id] = { subagentType: c.input.subagent_type || 'general-purpose', description: c.input.description || '', prompt: String(c.input.prompt || '') }
        }
      }
      if (!r.message.usage) continue
      const id = r.message.id || r.requestId || r.uuid
      const key = (r.isSidechain ? 'S' : 'M') + (r.agentId || '') + id
      if (seen.has(key)) continue
      seen.add(key)
      if (r.isSidechain && r.agentId) {
        const a = inline[r.agentId] || (inline[r.agentId] = { byModel: {}, start: r.timestamp })
        addUsage(a.byModel, r.message.model, r.message.usage)
      } else if (!r.isSidechain) {
        if (!turn) turns.push((turn = { at: r.timestamp, text: '', prompt: '(début de session)', command: null, byModel: {} }))
        addUsage(turn.byModel, r.message.model, r.message.usage)
      }
    }
  }
  const runs = []
  const subDir = path.join(path.dirname(file), sessionId, 'subagents')
  let subFiles = []
  try { subFiles = fs.readdirSync(subDir).filter((n) => /^agent-.+\.jsonl$/.test(n)) } catch {}
  const done = new Set()
  for (const n of subFiles) {
    const agentId = n.replace(/^agent-/, '').replace(/\.jsonl$/, '')
    const af = path.join(subDir, n)
    const byModel = {}
    const seenA = new Set()
    let start = null
    let firstPrompt = ''
    for (const r of readJsonl(af)) {
      if (r.timestamp && !start) start = r.timestamp
      if (r.type === 'user' && !firstPrompt) firstPrompt = textOf(r.message && r.message.content)
      if (r.type === 'assistant' && r.message && r.message.usage) {
        const id = r.message.id || r.requestId || r.uuid
        if (seenA.has(id)) continue
        seenA.add(id)
        addUsage(byModel, r.message.model, r.message.usage)
      }
    }
    let meta = {}
    try { meta = JSON.parse(fs.readFileSync(af.replace(/\.jsonl$/, '.meta.json'), 'utf8')) } catch {}
    const tu = toolUses[meta.toolUseId || agentToTool[agentId]] || {}
    runs.push({ id: agentId, at: start, agentType: meta.agentType || tu.subagentType || 'agent', description: meta.description || tu.description || '', prompt: tu.prompt || firstPrompt || '', byModel })
    done.add(agentId)
  }
  for (const [agentId, a] of Object.entries(inline)) {
    if (done.has(agentId)) continue
    const tu = toolUses[agentToTool[agentId]] || {}
    runs.push({ id: agentId, at: a.start, agentType: tu.subagentType || 'agent', description: tu.description || '', prompt: tu.prompt || '', byModel: a.byModel })
  }
  return { sessionId, title, turns, runs }
}

// ---------- local logs: OpenAI Codex ----------
const codexHome = () => process.env.CODEX_HOME || path.join(os.homedir(), '.codex')
function listRollouts(dir, out = [], since = 0) {
  let entries = []
  try { entries = fs.readdirSync(dir, { withFileTypes: true }) } catch { return out }
  for (const e of entries) {
    const abs = path.join(dir, e.name)
    if (e.isDirectory()) listRollouts(abs, out, since)
    else if (/^rollout-.+\.jsonl$/.test(e.name)) {
      if (since) { try { if (fs.statSync(abs).mtimeMs < since) continue } catch { continue } }
      out.push(abs)
    }
  }
  return out
}
const inside = (cwd, root) => {
  if (!cwd) return false
  const a = path.resolve(cwd).toLowerCase()
  const b = path.resolve(root).toLowerCase()
  return a === b || a.startsWith(b + path.sep)
}
const CODEX_NOISE = /^(<environment_context>|<user_instructions>|<permissions|<turn_aborted>|<external_|# AGENTS\.md|<INSTRUCTIONS>)/
function codexTokens(byModel, model, u) {
  if (!u) return
  const t = byModel[model] || (byModel[model] = emptyTokens())
  const cached = u.cached_input_tokens || 0
  t.input += Math.max(0, (u.input_tokens || 0) - cached)
  t.cacheRead += cached
  t.cacheWrite5m += u.cache_write_input_tokens || 0
  t.output += u.output_tokens || 0
  t.requests += 1
}
function parseCodex(file) {
  const recs = readJsonl(file)
  const first = recs[0]
  const meta = first && first.type === 'session_meta' ? first.payload || {} : null
  if (!meta || !inside(meta.cwd, ROOT)) return null
  const sessionId = meta.id || meta.session_id || path.basename(file, '.jsonl')
  let model = meta.model || 'codex'
  let turn = null
  const turns = []
  const byTurn = new Map()
  const seen = new Set()
  let title = ''
  for (const r of recs) {
    const p = r.payload || {}
    if (r.type === 'turn_context') {
      if (p.model) model = p.model
      if (p.turn_id && !byTurn.has(p.turn_id)) {
        turn = { at: r.timestamp, text: '', prompt: '', command: null, byModel: {} }
        byTurn.set(p.turn_id, turn)
        turns.push(turn)
      } else if (p.turn_id) turn = byTurn.get(p.turn_id)
    }
    if (r.type === 'response_item' && p.type === 'message' && p.role === 'user') {
      const text = (p.content || []).filter((c) => c && (c.type === 'input_text' || c.type === 'text')).map((c) => c.text).join('\n').trim()
      if (text && !CODEX_NOISE.test(text)) {
        if (!turn) turns.push((turn = { at: r.timestamp, text: '', prompt: '', command: null, byModel: {} }))
        if (!turn.prompt) {
          turn.text = text
          turn.prompt = text.replace(/\s+/g, ' ')
          const cmd = text.match(/^[\/$](wakil[.-][\w-]+)/)
          if (cmd) turn.command = cmd[1].replace(/^wakil-/, 'wakil.')
          if (!title) title = turn.prompt.slice(0, 80)
        }
      }
    }
    if (r.type === 'token_usage_record' && p.usage) {
      const id = p.response_id || `${p.turn_id}:${r.ordinal}`
      if (seen.has(id)) continue
      seen.add(id)
      let t = (p.turn_id && byTurn.get(p.turn_id)) || turn
      if (!t) turns.push((t = turn = { at: r.timestamp, text: '', prompt: '(début de session)', command: null, byModel: {} }))
      codexTokens(t.byModel, model, p.usage)
    }
  }
  if (!seen.size) {
    const last = [...recs].reverse().find((r) => r.payload && r.payload.type === 'token_count' && r.payload.info)
    if (last) {
      const t = turns[turns.length - 1] || (turns.push({ at: last.timestamp, text: '', prompt: '(session)', command: null, byModel: {} }), turns[0])
      codexTokens(t.byModel, model, last.payload.info.total_token_usage)
      t.byModel[model].requestsUnknown = true
    }
  }
  const isChild = meta.thread_source && meta.thread_source !== 'user'
  if (isChild) {
    const byModel = {}
    for (const t of turns) for (const [m, tok] of Object.entries(t.byModel)) {
      const d = byModel[m] || (byModel[m] = emptyTokens())
      for (const k of Object.keys(d)) d[k] += tok[k] || 0
    }
    return {
      sessionId: meta.parent_thread_id || meta.parent_session_id || sessionId, title, turns: [],
      runs: [{ id: sessionId, at: meta.timestamp || (turns[0] && turns[0].at), agentType: meta.agent_name || meta.agent_role || meta.agent_type || meta.nickname || 'codex-subagent', description: title, prompt: turns.map((t) => t.text).join('\n\n'), byModel }],
    }
  }
  return { sessionId, title: meta.title || title, turns, runs: [] }
}

// ---------- lines ----------
function sumTokens(byModel) {
  const s = { input: 0, output: 0, cacheWrite: 0, cacheRead: 0, total: 0 }
  for (const t of Object.values(byModel)) {
    s.input += t.input
    s.output += t.output
    s.cacheWrite += t.cacheWrite5m + t.cacheWrite1h
    s.cacheRead += t.cacheRead
  }
  s.total = s.input + s.output + s.cacheWrite + s.cacheRead
  return s
}
const mainModel = (byModel) => Object.entries(byModel).sort((a, b) => sumTokens({ x: b[1] }).total - sumTokens({ x: a[1] }).total).map((e) => e[0])[0] || null
const requestsOf = (byModel) => Object.values(byModel).reduce((a, t) => a + (t.requestsUnknown ? 1 : t.requests || 0), 0)
const clip = (s) => String(s || '').replace(/\s+/g, ' ').trim().slice(0, PROMPT_CHARS)

function linesFromSession(tool, s, reg) {
  const out = []
  let focus = null
  for (const t of s.turns) {
    let attr = attribute(t.command ? t.prompt : t.text || t.prompt)
    if (attr && t.command === 'wakil.focus') focus = attr
    else if (!attr && focus) attr = focus
    if (!Object.keys(t.byModel).length) continue
    const day = localDay(t.at)
    const model = mainModel(t.byModel)
    out.push({
      v: LINE_VERSION, id: `${tool}:turn:${s.sessionId}:${t.at}`, at: t.at, tool, provider: providerFor(reg, tool, model), model, kind: 'prompt',
      session: s.sessionId, sessionTitle: s.title || '', agent: 'manager', entity: attr ? attr.entity : null, project: attr ? attr.project : null, task: attr ? attr.task : null,
      command: t.command, prompt: clip(t.prompt), tokens: sumTokens(t.byModel), byModel: t.byModel, requests: requestsOf(t.byModel),
      credits: creditsOf(t.byModel, acuAt(reg, day)), creditsMethod: 'exact', acuVersion: acuAt(reg, day).version, source: tool === 'codex' ? 'codex-logs' : 'claude-code-logs',
    })
  }
  for (const r of s.runs) {
    if (!r.at || !Object.keys(r.byModel).length) continue
    const attr = attribute(r.prompt)
    const day = localDay(r.at)
    const model = mainModel(r.byModel)
    out.push({
      v: LINE_VERSION, id: `${tool}:agent:${r.id}`, at: r.at, tool, provider: providerFor(reg, tool, model), model, kind: 'agent',
      session: s.sessionId, sessionTitle: s.title || '', agent: r.agentType, entity: attr ? attr.entity : null, project: attr ? attr.project : null, task: attr ? attr.task : null,
      command: null, prompt: clip(r.description || r.prompt), tokens: sumTokens(r.byModel), byModel: r.byModel, requests: requestsOf(r.byModel),
      credits: creditsOf(r.byModel, acuAt(reg, day)), creditsMethod: 'exact', acuVersion: acuAt(reg, day).version, source: tool === 'codex' ? 'codex-logs' : 'claude-code-logs',
    })
  }
  return out
}

/** Last line of every id (the file is append-only; a correction re-uses the id with rev+1). */
function readLog() {
  const byId = new Map()
  for (const l of readJsonl(FILE)) if (l && l.id) byId.set(l.id, l)
  return byId
}
const fingerprint = (l) => `${l.credits}|${l.tokens && l.tokens.total}|${l.requests}|${l.entity}|${l.project}|${l.task}`
function appendNew(lines) {
  if (!lines.length) return { added: 0, updated: 0 }
  const known = readLog()
  const out = []
  let added = 0
  let updated = 0
  for (const l of lines) {
    const prev = known.get(l.id)
    if (prev && fingerprint(prev) === fingerprint(l)) continue
    // keep the attribution the owner (or a former run) already gave, when the new pass finds none
    if (prev && !l.entity && prev.entity) Object.assign(l, { entity: prev.entity, project: prev.project, task: prev.task })
    if (prev && fingerprint(prev) === fingerprint(l)) continue
    l.rev = prev ? (prev.rev || 0) + 1 : 0
    l.loggedAt = new Date().toISOString()
    out.push(JSON.stringify(l))
    known.set(l.id, l)
    if (prev) updated++
    else added++
  }
  if (out.length) {
    fs.mkdirSync(path.dirname(FILE), { recursive: true })
    fs.appendFileSync(FILE, out.join('\n') + '\n')
  }
  return { added, updated }
}

function syncClaude(reg, onlyFile) {
  const files = onlyFile ? [onlyFile] : claudeLogDirs().flatMap((d) => { try { return fs.readdirSync(d).filter((n) => n.endsWith('.jsonl')).map((n) => path.join(d, n)) } catch { return [] } })
  const lines = []
  for (const f of files) {
    try { lines.push(...linesFromSession('claude', parseClaudeSession(f), reg)) } catch (e) { if (!onlyFile) console.error(`! ${path.basename(f)}: ${e.message}`) }
  }
  return lines
}
function syncCodex(reg, since = 0) {
  const lines = []
  for (const f of listRollouts(path.join(codexHome(), 'sessions'), [], since)) {
    try {
      const s = parseCodex(f)
      if (s) lines.push(...linesFromSession('codex', s, reg))
    } catch {}
  }
  return lines
}

// ---------- hooks ----------
function readPayload(tool, argv) {
  if (tool === 'codex') {
    const last = argv[argv.length - 1]
    try { return JSON.parse(last) } catch { return {} }
  }
  if (process.stdin.isTTY) return {}
  try { return JSON.parse(fs.readFileSync(0, 'utf8') || '{}') } catch { return {} }
}
function readPending() { try { return JSON.parse(fs.readFileSync(PENDING, 'utf8')) } catch { return {} } }
function writePending(p) {
  const keep = Object.fromEntries(Object.entries(p).filter(([, v]) => Date.now() - Date.parse(v.at) < 86400000)) // drop entries older than a day
  fs.mkdirSync(path.dirname(PENDING), { recursive: true })
  fs.writeFileSync(PENDING, JSON.stringify(keep))
}

function hook(opt, argv) {
  const tool = opt.tool
  const payload = readPayload(tool, argv)
  const reg = loadRegistry()
  if (tool === 'claude') {
    const file = payload.transcript_path && fs.existsSync(payload.transcript_path) ? payload.transcript_path : null
    appendNew(file ? syncClaude(reg, file) : syncClaude(reg))
    return
  }
  if (tool === 'codex') {
    appendNew(syncCodex(reg, Date.now() - 2 * 86400000)) // rollouts touched in the last 2 days
    return
  }
  if (tool === 'cursor') {
    // Cursor keeps no local token log: one line per generation, credits from the per-request estimate (acu estimation).
    const event = payload.hook_event_name || opt.event || ''
    const gen = payload.generation_id || payload.conversation_id || String(Date.now())
    if (event === 'beforeSubmitPrompt') {
      const p = readPending()
      p[gen] = { at: new Date().toISOString(), prompt: String(payload.prompt || '').slice(0, 4000), conversation: payload.conversation_id || null }
      writePending(p)
      process.stdout.write(JSON.stringify({ continue: true }))
      return
    }
    const p = readPending()
    const pend = p[gen] || {}
    delete p[gen]
    try { writePending(p) } catch {}
    if (payload.status && payload.status !== 'completed') { process.stdout.write('{}'); return }
    const at = pend.at || new Date().toISOString()
    const model = payload.model || null
    const cfg = acuAt(reg, localDay(at))
    const credits = estimatedCredits(1, [model, 'cursor'], cfg)
    const attr = attribute(pend.prompt || '')
    appendNew([{
      v: LINE_VERSION, id: `cursor:gen:${gen}`, at, tool: 'cursor', provider: providerFor(reg, 'cursor', model), model, kind: 'prompt',
      session: payload.conversation_id || pend.conversation || null, sessionTitle: '', agent: 'manager',
      entity: attr ? attr.entity : null, project: attr ? attr.project : null, task: attr ? attr.task : null,
      command: (String(pend.prompt || '').match(/^[\/$](wakil[.-][\w-]+)/) || [])[1] || null, prompt: clip(pend.prompt || '(prompt Cursor)'),
      tokens: null, byModel: null, requests: 1, credits, creditsMethod: credits === null ? 'unavailable' : 'estimated', acuVersion: cfg.version, source: 'cursor-hook',
    }])
    process.stdout.write('{}')
  }
}

// ---------- cost model (same as Wakil Desktop › Usage & crédits › Coûts) ----------
// For every subscription billing period: daily cost = period fee ÷ period days; cost to date = daily cost × days elapsed;
// 1 credit = cost to date ÷ credits consumed in the period; an element's cost = its credits × the credit cost.
const D = (s) => Date.parse(s + 'T12:00:00Z')
const addDays = (day, n) => new Date(D(day) + n * 86400000).toISOString().slice(0, 10)
const daysIncl = (a, b) => Math.round((D(b) - D(a)) / 86400000) + 1
function addMonths(day, n) {
  const [y, m, d] = day.split('-').map(Number)
  const first = new Date(Date.UTC(y, m - 1 + n, 1))
  const dim = new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth() + 1, 0)).getUTCDate()
  return `${first.getUTCFullYear()}-${pad(first.getUTCMonth() + 1)}-${pad(Math.min(d, dim))}`
}
const priceAt = (s, day) => [...(s.prices || [])].filter((p) => p.from <= day).sort((a, b) => a.from.localeCompare(b.from)).pop() || null
const stepMonths = (p) => (!p || p.frequency === 'monthly' ? 1 : p.frequency === 'yearly' ? 12 : Math.max(1, p.months || 1))
/** Declared periods (/wakil.billing-period) first, then periods derived from the start date and the price frequency. */
function periodsOf(s, until) {
  const declared = (s.periods || []).map((p) => ({ start: p.start, end: p.end, amount: p.amount, currency: p.currency || s.currency, source: 'declared' })).sort((a, b) => a.start.localeCompare(b.start))
  const out = []
  let cursor = s.startDate || ((s.prices || [])[0] || {}).from || (declared[0] && declared[0].start)
  if (!cursor) return declared
  for (let i = 0; i < 1200; i++) {
    const d = declared.find((x) => x.end >= cursor)
    if (d && d.start <= cursor) { out.push(d); cursor = addDays(d.end, 1); continue }
    if (cursor > until) break
    const p = priceAt(s, cursor)
    let end = addDays(addMonths(cursor, stepMonths(p)), -1)
    let amount = p ? p.amount : null
    if (d && d.start <= end) {
      // a derived period cut short by the next declared one is charged pro rata
      const full = daysIncl(cursor, end)
      end = addDays(d.start, -1)
      if (amount !== null) amount = (amount * daysIncl(cursor, end)) / full
    }
    out.push({ start: cursor, end, amount, currency: (p && p.currency) || s.currency, source: 'derived' })
    cursor = addDays(end, 1)
  }
  return out.concat(declared.filter((d) => !out.includes(d)))
}
function matchSub(reg, l) {
  const day = localDay(l.at)
  const c = reg.subscriptions.filter((s) => (!s.startDate || s.startDate <= day) && (s.usageSources || []).some((src) => src.tool === l.tool && (!src.models.length || src.models.some((p) => String(l.model || '').toLowerCase().startsWith(p.toLowerCase())))))
  const specific = (s) => (s.usageSources.some((src) => src.tool === l.tool && src.models.length) ? 1 : 0)
  return c.sort((a, b) => specific(b) - specific(a) || (a.status === 'active' ? -1 : 1) - (b.status === 'active' ? -1 : 1))[0] || null
}
function costModel(reg, lines, now = today()) {
  const periods = []
  const costOf = new Map()
  const bySub = new Map()
  for (const l of lines) {
    const s = matchSub(reg, l)
    if (!s) continue
    if (!bySub.has(s.id)) bySub.set(s.id, [])
    bySub.get(s.id).push(l)
  }
  for (const s of reg.subscriptions) {
    const ls = bySub.get(s.id) || []
    for (const p of periodsOf(s, now)) {
      const to = p.end < now ? p.end : now
      const inP = ls.filter((l) => { const d = localDay(l.at); return d >= p.start && d <= p.end })
      const days = daysIncl(p.start, p.end)
      const elapsed = p.start > now ? 0 : daysIncl(p.start, to)
      const fixed = p.amount ?? 0
      const variable = (s.expenses || []).filter((e) => e.kind === 'variable' && e.period === p.start.slice(0, 7)).reduce((a, e) => a + e.amount, 0)
      const daily = (fixed + variable) / days
      const costToDate = daily * elapsed
      const credits = inP.reduce((a, l) => a + (l.credits || 0), 0)
      const requests = inP.reduce((a, l) => a + (l.requests || 0), 0)
      const unit = credits > 0 ? 'credits' : 'requests'
      const units = unit === 'credits' ? credits : requests
      const perUnit = units > 0 ? costToDate / units : null
      for (const l of inP) costOf.set(l.id, perUnit === null ? 0 : (unit === 'credits' ? l.credits || 0 : l.requests || 0) * perUnit)
      periods.push({ subscription: s.id, name: s.name, provider: s.provider, ...p, days, elapsed, daily, costToDate, credits, requests, unit, perUnit, lines: inP.length })
    }
  }
  return { periods, costOf, subOf: (l) => matchSub(reg, l) }
}

// ---------- commands ----------
function parseArgs(argv) {
  const pos = []
  const opt = {}
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a.startsWith('--')) {
      const [k, inline] = a.slice(2).split(/=(.*)/s)
      if (inline !== undefined) opt[k] = inline
      else if (i + 1 < argv.length && !argv[i + 1].startsWith('--')) opt[k] = argv[++i]
      else opt[k] = true
    } else pos.push(a)
  }
  return { pos, opt }
}
const num = (v, name) => {
  const n = Number(String(v).replace(/[,\s]/g, ''))
  if (v === undefined || v === true || !Number.isFinite(n) || n < 0) fail(`--${name} must be a number ≥ 0 (got "${v}")`)
  return n
}
const money = (v, cur) => (v === null || v === undefined ? '—' : `${Math.abs(v) < 0.01 && v !== 0 ? v.toPrecision(3) : v.toFixed(Math.abs(v) < 1 && v !== 0 ? 4 : 2)} ${cur}`)

const commands = {
  sync(opt) {
    const reg = loadRegistry()
    const tool = opt.tool || 'all'
    const lines = []
    if (tool === 'all' || tool === 'claude') lines.push(...syncClaude(reg))
    if (tool === 'all' || tool === 'codex') lines.push(...syncCodex(reg))
    const r = appendNew(lines)
    if (!opt.quiet) console.log(`✓ credit log: ${r.added} new line(s), ${r.updated} updated – ${readLog().size} prompt/agent line(s) in usage/credits.jsonl`)
  },
  hook(opt, argv) {
    if (!['claude', 'codex', 'cursor'].includes(opt.tool)) fail('hook needs --tool claude|codex|cursor')
    try { hook(opt, argv) } catch (e) { try { fs.appendFileSync(path.join(ROOT, 'usage', '.credits-hook-errors.log'), `${new Date().toISOString()} ${opt.tool} ${e.stack || e}\n`) } catch {} }
  },
  add(opt) {
    const tool = opt.tool || fail('add needs --tool cursor|claude|codex|other')
    if (!opt['source-tool']) fail('add needs --source-tool claude|cursor|codex (the chat that runs the command)')
    const reg = loadRegistry()
    const day = opt.date ? (/^\d{4}-\d{2}-\d{2}$/.test(opt.date) ? opt.date : fail('--date must be YYYY-MM-DD')) : today()
    const at = opt.date ? `${day}T12:00:00.000Z` : new Date().toISOString()
    const cfg = acuAt(reg, day)
    const model = opt.model && opt.model !== true ? String(opt.model) : null
    let byModel = null
    let credits = null
    let method = 'unavailable'
    const requests = opt.requests !== undefined ? num(opt.requests, 'requests') : 1
    if (opt.input !== undefined || opt.output !== undefined) {
      const cached = opt.cached !== undefined ? num(opt.cached, 'cached') : 0
      byModel = { [model || 'unknown']: { ...emptyTokens(), input: Math.max(0, num(opt.input ?? 0, 'input') - cached), output: num(opt.output ?? 0, 'output'), cacheRead: cached, requests } }
      credits = creditsOf(byModel, cfg)
      method = 'exact'
    } else if (opt.credits !== undefined) {
      credits = num(opt.credits, 'credits')
      method = 'declared'
    } else {
      credits = estimatedCredits(requests, [model, tool], cfg)
      method = credits === null ? 'unavailable' : 'estimated'
    }
    const proj = opt.project && opt.project !== true ? String(opt.project) : ''
    if (proj && !/^[\w.-]+\/[\w.-]+$/.test(proj)) fail('--project must be <entity-slug>/<project-slug|none>')
    const [entity, project] = proj ? proj.split('/') : [null, null]
    const line = {
      v: LINE_VERSION, id: `${tool}:manual:${Date.now().toString(36)}`, at, tool, provider: opt.provider && opt.provider !== true ? String(opt.provider) : providerFor(reg, tool, model), model, kind: 'manual',
      session: opt.session && opt.session !== true ? String(opt.session) : null, sessionTitle: '', agent: opt.agent && opt.agent !== true ? String(opt.agent) : 'manager',
      entity: entity || null, project: project && project !== 'none' ? project : null, task: opt.task && opt.task !== true ? String(opt.task).toUpperCase() : null,
      command: null, prompt: clip(opt.prompt && opt.prompt !== true ? opt.prompt : opt.note || '(déclaré en chat)'),
      tokens: byModel ? sumTokens(byModel) : null, byModel, requests, credits, creditsMethod: method, acuVersion: cfg.version, source: `${opt['source-tool']}-chat`,
    }
    appendNew([line])
    console.log(`✓ credit line added: ${tool} ${model || ''} – ${credits === null ? 'credits unknown (set an estimate: /wakil.usage acu estimate cursor=N)' : `${credits} credit(s) (${method})`}${proj ? ` on ${proj}` : ''}`)
  },
  show(opt) {
    const all = [...readLog().values()].sort((a, b) => a.at.localeCompare(b.at))
    const last = all.slice(-(opt.last ? num(opt.last, 'last') : 20))
    for (const l of last) console.log(`${l.at.slice(0, 16).replace('T', ' ')}  ${l.tool.padEnd(6)} ${String(l.model || '—').padEnd(20)} ${String(l.credits ?? '—').padStart(9)} cr  ${(l.entity ? `${l.entity}/${l.project || 'none'}` : '—').padEnd(26)} ${l.agent.padEnd(14)} ${l.prompt.slice(0, 60)}`)
    console.log(`${all.length} line(s) in usage/credits.jsonl`)
  },
  report(opt) {
    const reg = loadRegistry()
    const base = reg.settings.baseCurrency || 'USD'
    const from = opt.from && opt.from !== true ? opt.from : null
    const to = opt.to && opt.to !== true ? opt.to : null
    const lines = [...readLog().values()]
    const cm = costModel(reg, lines)
    const sel = lines.filter((l) => {
      const d = localDay(l.at)
      if (from && d < from) return false
      if (to && d > to) return false
      const s = cm.subOf(l)
      if (opt.subscription && (!s || s.id !== opt.subscription)) return false
      if (opt.provider && l.provider !== opt.provider) return false
      return true
    })
    const by = opt.by || 'project'
    const keyOf = {
      prompt: (l) => `${l.at.slice(0, 16)} ${l.prompt.slice(0, 50)}`, session: (l) => l.sessionTitle || l.session || '—', project: (l) => (l.entity ? `${l.entity}/${l.project || 'none'}` : 'non attribué'),
      task: (l) => (l.task ? `${l.entity}/${l.project || 'none'}/${l.task}` : '—'), entity: (l) => l.entity || 'non attribué', agent: (l) => l.agent, model: (l) => l.model || '—', provider: (l) => l.provider, day: (l) => localDay(l.at),
    }[by]
    if (!keyOf) fail('--by must be prompt|session|project|task|entity|agent|model|provider|day')
    const groups = new Map()
    for (const l of sel) {
      const k = keyOf(l)
      const g = groups.get(k) || { key: k, credits: 0, cost: 0, lines: 0 }
      g.credits += l.credits || 0
      g.cost += cm.costOf.get(l.id) || 0
      g.lines++
      groups.set(k, g)
    }
    const totalCredits = sel.reduce((a, l) => a + (l.credits || 0), 0)
    const rows = [...groups.values()].sort((a, b) => b.cost - a.cost || b.credits - a.credits)
    const periods = cm.periods.filter((p) => (!opt.subscription || p.subscription === opt.subscription) && (!opt.provider || p.provider === opt.provider) && (!from || p.end >= from) && (!to || p.start <= to) && p.start <= today())
    if (opt.json) { console.log(JSON.stringify({ periods, rows, totalCredits }, null, 2)); return }
    for (const p of periods) {
      console.log(`■ ${p.name} ${p.start} → ${p.end} (${p.days} j, ${p.source === 'declared' ? 'période saisie' : 'période déduite'})`)
      console.log(`  ${money(p.amount, p.currency)} ÷ ${p.days} j = ${money(p.daily, p.currency)}/jour × ${p.elapsed} j écoulés = ${money(p.costToDate, p.currency)}`)
      console.log(`  ${p.unit === 'credits' ? `${p.credits.toFixed(2)} crédits` : `${p.requests} requêtes (aucun crédit mesuré)`} → 1 ${p.unit === 'credits' ? 'crédit' : 'requête'} = ${p.perUnit === null ? '—' : money(p.perUnit, p.currency)}`)
    }
    console.log(`\nPar ${by} – ${sel.length} ligne(s), ${totalCredits.toFixed(2)} crédits${from || to ? ` (${from || '…'} → ${to || '…'})` : ''}`)
    for (const r of rows) console.log(`  ${r.key.slice(0, 60).padEnd(60)} ${r.credits.toFixed(2).padStart(10)} cr ${(totalCredits ? (r.credits / totalCredits) * 100 : 0).toFixed(1).padStart(6)} %  ${money(r.cost, base).padStart(14)}`)
  },
}

const HELP = `Wakil credit log – usage/credits.jsonl (one line per prompt / sub-agent run, read by Wakil Desktop)
  sync [--tool claude|codex|all] [--quiet]        catch up every prompt of the local logs that is not in the file yet
  hook --tool claude|codex|cursor                  used by the hooks after every prompt (never prints errors)
  add --tool cursor [--model m] [--credits N | --requests N | --input --output --cached] [--project e/p] [--task T-001]
      [--agent a] [--prompt "…"] [--date YYYY-MM-DD] --source-tool claude|cursor|codex
  show [--last 20] · report [--provider id | --subscription id] [--from] [--to] [--by project|session|task|entity|agent|model|prompt|day] [--json]`

function main(argv) {
  const { pos, opt } = parseArgs(argv)
  const cmd = pos[0] || 'help'
  if (cmd === 'help') { console.log(HELP); return 0 }
  const fn = commands[cmd]
  if (!fn) fail(`Unknown command "${cmd}".\n${HELP}`)
  fn(opt, argv)
  return 0
}

if (require.main === module) {
  try {
    process.exitCode = main(process.argv.slice(2))
  } catch (e) {
    if (e instanceof UserError) {
      console.error(`✗ ${e.message}`)
      process.exitCode = 2
    } else throw e
  }
}
module.exports = { main, readLog, costModel, periodsOf, creditsOf, FILE }
