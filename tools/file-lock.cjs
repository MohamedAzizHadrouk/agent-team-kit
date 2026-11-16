#!/usr/bin/env node
// Wakil – file locks: two agents never edit the same file at the same time.
//
// Before every file edit (Claude Code PreToolUse on Edit/Write/MultiEdit/NotebookEdit, Cursor preToolUse on Write/Delete)
// the hook takes a lock on the file for the agent that edits it. Another agent (another session, another sub-agent, Cursor,
// Codex) that tries to edit the same file while the lock is alive is refused, with the name of the holder, and is told to
// work on something else or wait. Locks are released when the holder's turn ends (Stop / SubagentStop / Cursor stop) and
// expire after a period without edits (default 15 min, WAKIL_LOCK_TTL_MIN).
//
// Store: .wakil/locks/<sha1 of the path>.json – one file per locked file, created atomically (no race between two
// agents), private and git-ignored. Only files inside this ecosystem are locked. A hook never blocks because of its own
// error (fail-open): a lock problem must never stop the owner's work.
//
//   node tools/file-lock.cjs hook --tool claude --event pre|stop|subagent-stop     (payload on stdin)
//   node tools/file-lock.cjs hook --tool cursor --event preToolUse|stop            (payload on stdin)
//   node tools/file-lock.cjs list [--json]
//   node tools/file-lock.cjs acquire <path…> --owner <name> [--note "…"]          (manual / Codex: say you work on a file)
//   node tools/file-lock.cjs release <path…> | --owner <id-prefix> | --stale | --all
'use strict'
const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

const ROOT = process.env.WAKIL_ROOT ? path.resolve(process.env.WAKIL_ROOT) : path.resolve(__dirname, '..')
const DIR = path.join(ROOT, '.wakil', 'locks')
const TTL_MS = Math.max(1, Number(process.env.WAKIL_LOCK_TTL_MIN) || 15) * 60000
// never locked: logs and generated state written by the tools themselves
const SKIP = [/^usage\//, /^\.wakil\//, /^\.git\//, /(^|\/)node_modules\//]

const win = process.platform === 'win32'
/** Path relative to the ecosystem with "/" separators, or null when the file is outside it. */
function relOf(p) {
  if (!p || typeof p !== 'string') return null
  const abs = path.resolve(ROOT, p)
  const rel = path.relative(ROOT, abs)
  if (!rel || rel.startsWith('..') || path.isAbsolute(rel)) return null
  return rel.split(path.sep).join('/')
}
const keyOf = (rel) => crypto.createHash('sha1').update(win ? rel.toLowerCase() : rel).digest('hex').slice(0, 20)
const fileOf = (rel) => path.join(DIR, `${keyOf(rel)}.json`)
const read = (f) => { try { return JSON.parse(fs.readFileSync(f, 'utf8')) } catch { return null } }
const alive = (l) => l && Date.now() - Date.parse(l.heartbeat || l.since) < TTL_MS
const ago = (iso) => { const m = Math.round((Date.now() - Date.parse(iso)) / 60000); return m < 1 ? 'just now' : `${m} min ago` }
function all() {
  let names = []
  try { names = fs.readdirSync(DIR).filter((n) => n.endsWith('.json')) } catch {}
  return names.map((n) => ({ file: path.join(DIR, n), lock: read(path.join(DIR, n)) })).filter((x) => x.lock)
}

/** Take (or refresh) the lock. Returns null when granted, or the other holder's lock when refused. */
function acquire(rel, owner, extra = {}, canTake = () => false) {
  fs.mkdirSync(DIR, { recursive: true })
  const f = fileOf(rel)
  const now = new Date().toISOString()
  const mine = { path: rel, owner: owner.id, tool: owner.tool, agent: owner.agent, session: owner.session || null, since: now, heartbeat: now, edits: 1, ...extra }
  for (let i = 0; i < 3; i++) {
    try {
      fs.writeFileSync(f, JSON.stringify(mine), { flag: 'wx' }) // atomic: fails if another agent created it first
      return null
    } catch (e) {
      if (e.code !== 'EEXIST') throw e
    }
    const cur = read(f)
    if (cur && cur.owner === owner.id) {
      fs.writeFileSync(f, JSON.stringify({ ...cur, heartbeat: now, edits: (cur.edits || 0) + 1 }))
      return null
    }
    if (cur && alive(cur) && !canTake(cur)) return cur
    try { fs.unlinkSync(f) } catch {} // stale, unreadable or handed over: take it
  }
  return null
}
function releaseWhere(pred) {
  let n = 0
  for (const { file, lock } of all()) if (pred(lock)) { try { fs.unlinkSync(file); n++ } catch {} }
  return n
}

// ---------- hooks ----------
function readStdin() {
  if (process.stdin.isTTY) return Promise.resolve({})
  return new Promise((resolve) => {
    let buf = ''
    let done = false
    const end = () => { if (!done) { done = true; try { resolve(JSON.parse(buf.replace(/^﻿/, '').trim() || '{}')) } catch { resolve({}) } } }
    const t = setTimeout(end, 3000)
    process.stdin.setEncoding('utf8')
    process.stdin.on('data', (c) => { buf += c })
    process.stdin.on('end', () => { clearTimeout(t); end() })
    process.stdin.on('error', () => { clearTimeout(t); end() })
  })
}
/** Every file path a tool call is about to write (Claude: file_path / notebook_path; Cursor: path-like keys). */
function pathsOf(input) {
  const out = []
  const visit = (o, depth) => {
    if (!o || typeof o !== 'object' || depth > 3) return
    for (const [k, v] of Object.entries(o)) {
      if (typeof v === 'string' && /^(file_?path|notebook_?path|target_?file|path|filePath|targetFile|file)$/i.test(k)) out.push(v)
      else if (v && typeof v === 'object') visit(v, depth + 1)
    }
  }
  visit(input, 0)
  return [...new Set(out)]
}
const holderText = (l) => `${l.agent === 'main' ? 'the main agent' : `agent "${l.agent}"`} (${l.tool}${l.session ? `, session ${String(l.session).slice(0, 8)}` : ''}${l.task ? `, task ${l.task}` : ''})`
const refusal = (rel, l) =>
  `File locked: ${rel} is being edited by ${holderText(l)} since ${ago(l.since)} (last edit ${ago(l.heartbeat)}). ` +
  `Two agents must not edit the same file at the same time. Do not edit it now: continue with other files, or finish and report ` +
  `that this file is waiting. The lock is released when that agent's turn ends, or after ${TTL_MS / 60000} min without edits. ` +
  `The owner can free it with /wakil.locks release ${rel}.`

async function hook(opt) {
  const p = await readStdin()
  const tool = opt.tool
  const event = String(opt.event || p.hook_event_name || '')
  if (tool === 'claude') {
    const session = p.session_id || 'unknown'
    const agentKey = p.agent_id || 'main'
    const owner = { id: `claude:${session}:${agentKey}`, tool: 'claude', agent: p.agent_id ? p.agent_type || 'subagent' : p.agent_type || 'main', session }
    if (/^pre/i.test(event)) {
      for (const raw of pathsOf(p.tool_input)) {
        const rel = relOf(path.resolve(p.cwd || ROOT, raw))
        if (!rel || SKIP.some((re) => re.test(rel))) continue
        // a sub-agent may take over a lock of its OWN session's main agent: the manager delegated the file to it (hand-off,
        // not a conflict). The reverse is refused: the main agent waits for its sub-agent to finish.
        const handOff = (cur) => !!p.agent_id && cur.owner === `claude:${session}:main`
        const other = acquire(rel, owner, {}, handOff)
        if (other) {
          process.stdout.write(JSON.stringify({ hookSpecificOutput: { hookEventName: 'PreToolUse', permissionDecision: 'deny', permissionDecisionReason: refusal(rel, other) } }))
          return
        }
      }
      return // allowed: print nothing, the normal permission flow goes on
    }
    if (/subagent/i.test(event)) { if (p.agent_id) releaseWhere((l) => l.owner === owner.id); return }
    if (/stop/i.test(event)) { releaseWhere((l) => l.owner === `claude:${session}:main`); return }
    return
  }
  if (tool === 'cursor') {
    const conv = p.conversation_id || 'unknown'
    const owner = { id: `cursor:${conv}`, tool: 'cursor', agent: p.subagent_type || 'main', session: conv }
    if (/pretooluse/i.test(event)) {
      for (const raw of pathsOf(p.tool_input)) {
        const rel = relOf(path.resolve(p.cwd || (p.workspace_roots || [])[0] || ROOT, raw))
        if (!rel || SKIP.some((re) => re.test(rel))) continue
        const other = acquire(rel, owner)
        if (other) {
          const msg = refusal(rel, other)
          process.stdout.write(JSON.stringify({ continue: true, permission: 'deny', user_message: `Wakil: ${rel} is locked by ${holderText(other)}.`, agent_message: msg }))
          return
        }
      }
      process.stdout.write(JSON.stringify({ permission: 'allow' }))
      return
    }
    if (/stop/i.test(event)) releaseWhere((l) => l.owner === owner.id)
    process.stdout.write('{}')
  }
}

// ---------- commands ----------
function parseArgs(argv) {
  const pos = []
  const opt = {}
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a.startsWith('--')) {
      const k = a.slice(2)
      if (i + 1 < argv.length && !argv[i + 1].startsWith('--')) opt[k] = argv[++i]
      else opt[k] = true
    } else pos.push(a)
  }
  return { pos, opt }
}
function main(argv) {
  const { pos, opt } = parseArgs(argv)
  const cmd = pos[0] || 'list'
  if (cmd === 'hook') {
    const logErr = (e) => { try { fs.mkdirSync(DIR, { recursive: true }); fs.appendFileSync(path.join(DIR, '.errors.log'), `${new Date().toISOString()} ${opt.tool} ${opt.event} ${e.stack || e}\n`) } catch {} }
    return hook(opt).catch((e) => { logErr(e); if (opt.tool === 'cursor' && /pretooluse/i.test(String(opt.event))) process.stdout.write(JSON.stringify({ permission: 'allow' })) })
  }
  if (cmd === 'list') {
    const rows = all().map(({ lock }) => ({ ...lock, alive: alive(lock) })).sort((a, b) => a.path.localeCompare(b.path))
    if (opt.json) { console.log(JSON.stringify(rows, null, 2)); return }
    if (!rows.length) { console.log('No file is locked.'); return }
    for (const l of rows) console.log(`${l.alive ? '🔒' : '⌛'} ${l.path}  –  ${holderText(l)}  since ${ago(l.since)}, last edit ${ago(l.heartbeat)}${l.note ? `  · ${l.note}` : ''}${l.alive ? '' : '  (expired)'}`)
    return
  }
  if (cmd === 'acquire') {
    if (!opt.owner || opt.owner === true) throw new Error('acquire needs --owner <name> (e.g. codex, cursor, or your name)')
    const owner = { id: `manual:${opt.owner}`, tool: String(opt.owner), agent: String(opt.owner) }
    for (const p of pos.slice(1)) {
      const rel = relOf(p)
      if (!rel) { console.log(`✗ ${p}: outside the ecosystem, not locked`); continue }
      const other = acquire(rel, owner, opt.note ? { note: String(opt.note) } : {})
      console.log(other ? `✗ ${rel}: already locked by ${holderText(other)}` : `🔒 ${rel} locked for ${opt.owner}`)
    }
    return
  }
  if (cmd === 'release') {
    let n = 0
    if (opt.all) n = releaseWhere(() => true)
    else if (opt.stale) n = releaseWhere((l) => !alive(l))
    else if (opt.owner && opt.owner !== true) n = releaseWhere((l) => String(l.owner).startsWith(String(opt.owner)) || String(l.owner) === `manual:${opt.owner}`)
    else {
      const rels = pos.slice(1).map(relOf).filter(Boolean)
      if (!rels.length) throw new Error('release needs <path…>, --owner <id>, --stale or --all')
      for (const rel of rels) { try { fs.unlinkSync(fileOf(rel)); n++ } catch {} }
    }
    console.log(`✓ ${n} lock(s) released`)
    return
  }
  throw new Error(`Unknown command "${cmd}" – hook | list | acquire | release`)
}

if (require.main === module) {
  try {
    const r = main(process.argv.slice(2))
    if (r && r.then) r.catch(() => {})
  } catch (e) {
    console.error(`✗ ${e.message}`)
    process.exitCode = 2
  }
}
module.exports = { acquire, relOf, all }
