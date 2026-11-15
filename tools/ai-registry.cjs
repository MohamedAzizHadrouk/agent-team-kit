#!/usr/bin/env node
// Wakil – AI providers & subscriptions registry (command processing → validation → central registry).
// Used from ANY chat (Claude Code, Cursor, Codex) through /wakil.provider, /wakil.subscription, /wakil.usage.
// The registry is usage/registry.json (private, git-ignored). Wakil Desktop only reads it.
// Rules: every write is validated and logged (source tool, agent, original command); history is never overwritten
// (prices, budgets, billing models and ACU settings are versioned with a "from" date); financially significant or
// destructive actions need --yes (given only after the owner confirmed in the chat).
//
//   node tools/ai-registry.cjs <group> <action> [id] [--key value ...] --source-tool claude|cursor|codex [--agent manager] [--command "text"]
//   node tools/ai-registry.cjs help
'use strict'
const fs = require('fs')
const path = require('path')

const ROOT = process.env.WAKIL_ROOT ? path.resolve(process.env.WAKIL_ROOT) : path.resolve(__dirname, '..')
const FILE = path.join(ROOT, 'usage', 'registry.json')

const BILLING = ['fixed', 'payg', 'hybrid']
const FREQ = ['monthly', 'yearly', 'custom']
const STATUS = ['active', 'inactive', 'archived']
const TOOLS = ['claude', 'cursor', 'codex', 'other']
const INTEGRATION = ['claude-code-logs', 'codex-logs', 'manual', 'none']
const METHODS = ['exact', 'estimated', 'plan']
const CONFIDENCE = ['high', 'medium', 'low']
const DEFAULT_ACU = {
  version: 1,
  from: '2000-01-01',
  weights: { input: 1.0, output: 2.0, cached: 0.25, overhead: 0.5 },
  multipliers: [], // [{ match: 'claude-opus', value: 1.5 }] – longest prefix wins, default 1
  defaultMultiplier: 1.0,
  estimation: [], // [{ match: 'cursor', acuPerRequest: 3 }] – Mode 2: requests without tokens
  note: 'Initial defaults (spec v1).',
}

// ---------- io ----------
class UserError extends Error {}
const fail = (msg) => { throw new UserError(msg) }
const today = () => new Date().toISOString().slice(0, 10)
const slug = (s) => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

function load() {
  if (!fs.existsSync(FILE)) {
    return { version: 1, settings: { baseCurrency: 'USD', fx: {} }, providers: [], subscriptions: [], usage: [], acu: [DEFAULT_ACU], log: [] }
  }
  const r = JSON.parse(fs.readFileSync(FILE, 'utf8'))
  for (const k of ['providers', 'subscriptions', 'usage', 'log']) r[k] = r[k] || []
  r.settings = r.settings || { baseCurrency: 'USD', fx: {} }
  r.acu = r.acu && r.acu.length ? r.acu : [DEFAULT_ACU]
  return r
}
function save(reg) {
  fs.mkdirSync(path.dirname(FILE), { recursive: true })
  const tmp = FILE + '.tmp'
  fs.writeFileSync(tmp, JSON.stringify(reg, null, 2) + '\n')
  fs.renameSync(tmp, FILE) // atomic replace
}

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

// ---------- validators ----------
const num = (v, name, { min = 0 } = {}) => {
  if (v === undefined || v === true) fail(`--${name} needs a number`)
  const n = Number(String(v).replace(/[$€,\s]/g, ''))
  if (!Number.isFinite(n) || n < min) fail(`--${name} must be a number ≥ ${min} (got "${v}")`)
  return n
}
const oneOf = (v, list, name) => {
  if (!list.includes(v)) fail(`--${name} must be one of: ${list.join(', ')} (got "${v}")`)
  return v
}
const date = (v, name) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(v)) || isNaN(Date.parse(v))) fail(`--${name} must be a date YYYY-MM-DD (got "${v}")`)
  return v
}
const period = (v) => {
  if (!/^\d{4}-\d{2}$/.test(String(v))) fail(`--period must be YYYY-MM (got "${v}")`)
  return v
}
const currency = (v) => {
  const c = String(v || '').toUpperCase()
  if (!/^[A-Z]{3}$/.test(c)) fail(`--currency must be an ISO code like USD, EUR, TND (got "${v}")`)
  return c
}
const needYes = (opt, what) => {
  if (!opt.yes) fail(`${what} is a financially significant or destructive change: confirm with the owner, then re-run with --yes`)
}
const list = (v) => (v === undefined || v === true ? [] : String(v).split(',').map((s) => s.trim()).filter(Boolean))

function findProvider(reg, id) {
  const p = reg.providers.find((x) => x.id === id || x.id === slug(id) || x.name.toLowerCase() === String(id).toLowerCase())
  if (!p) fail(`Unknown provider "${id}". Known: ${reg.providers.map((x) => x.id).join(', ') || 'none'} (add it first: provider add --name …)`)
  return p
}
function findSub(reg, id) {
  const s = reg.subscriptions.find((x) => x.id === id || x.id === slug(id) || x.name.toLowerCase() === String(id).toLowerCase())
  if (!s) fail(`Unknown subscription "${id}". Known: ${reg.subscriptions.map((x) => x.id).join(', ') || 'none'}`)
  return s
}
const current = (history, at = today()) => [...(history || [])].filter((h) => h.from <= at).sort((a, b) => a.from.localeCompare(b.from)).pop()

// ---------- actions ----------
const actions = {
  'provider add'(reg, id, o) {
    const name = o.name || id
    if (!name || name === true) fail('provider add needs --name "<Provider>"')
    const pid = slug(o.id || name)
    if (reg.providers.some((p) => p.id === pid)) fail(`Provider "${pid}" already exists – use provider update`)
    const p = {
      id: pid, name: String(name), category: o.category || 'llm', description: o.description || '', website: o.website || '',
      integration: o.integration ? oneOf(o.integration, INTEGRATION, 'integration') : 'none',
      status: 'active', notes: o.notes || '', createdAt: today(), updatedAt: today(),
    }
    reg.providers.push(p)
    return { summary: `Provider ${p.name} (${p.id}) added – integration: ${p.integration}`, target: `provider:${p.id}` }
  },
  'provider update'(reg, id, o) {
    const p = findProvider(reg, id)
    const changes = []
    for (const k of ['name', 'category', 'description', 'website', 'notes']) if (o[k] !== undefined && o[k] !== true) { p[k] = String(o[k]); changes.push(k) }
    if (o.integration) { p.integration = oneOf(o.integration, INTEGRATION, 'integration'); changes.push('integration') }
    if (!changes.length) fail('Nothing to update (use --name, --category, --description, --website, --integration, --notes)')
    p.updatedAt = today()
    return { summary: `Provider ${p.id} updated: ${changes.join(', ')}`, target: `provider:${p.id}` }
  },
  'provider activate': (reg, id) => setStatus(findProvider(reg, id), 'active', 'provider'),
  'provider deactivate': (reg, id) => setStatus(findProvider(reg, id), 'inactive', 'provider'),
  'provider archive'(reg, id, o) { needYes(o, 'Archiving a provider'); return setStatus(findProvider(reg, id), 'archived', 'provider') },
  'provider remove'(reg, id, o) {
    const p = findProvider(reg, id)
    needYes(o, 'Removing a provider')
    if (reg.subscriptions.some((s) => s.provider === p.id)) fail(`Provider ${p.id} has subscriptions (history depends on it) – archive it instead: provider archive ${p.id} --yes`)
    reg.providers = reg.providers.filter((x) => x !== p)
    return { summary: `Provider ${p.id} removed (it had no subscriptions)`, target: `provider:${p.id}` }
  },
  'provider show'(reg, id) {
    const ps = id ? [findProvider(reg, id)] : reg.providers
    return { read: ps.map((p) => ({ ...p, subscriptions: reg.subscriptions.filter((s) => s.provider === p.id).map((s) => `${s.id} (${s.status})`) })) }
  },

  'sub add'(reg, id, o) {
    const name = o.name || id
    if (!name || name === true) fail('sub add needs --name "<Subscription>"')
    const provider = findProvider(reg, o.provider || fail('sub add needs --provider <provider-id>'))
    const sid = slug(o.id || name)
    if (reg.subscriptions.some((s) => s.id === sid)) fail(`Subscription "${sid}" already exists – use sub update / sub price`)
    const billing = oneOf(o.billing || 'fixed', BILLING, 'billing')
    const from = o.from ? date(o.from, 'from') : o.start ? date(o.start, 'start') : today()
    const [freq, months] = String(o.frequency || 'monthly').split(':')
    oneOf(freq, FREQ, 'frequency')
    const cur = currency(o.currency || reg.settings.baseCurrency || 'USD')
    if (billing !== 'payg' && o.price === undefined) fail(`A ${billing} subscription needs --price (the fixed fee per ${freq} period)`)
    const s = {
      id: sid, name: String(name), provider: provider.id, status: 'active',
      billing: [{ from, model: billing }],
      prices: billing === 'payg' && o.price === undefined ? [] : [{ from, amount: num(o.price, 'price'), currency: cur, frequency: freq, months: freq === 'custom' ? num(months, 'frequency months', { min: 1 }) : undefined }],
      budgets: o.budget !== undefined ? [{ from, monthly: num(o.budget, 'budget'), currency: cur }] : [],
      currency: cur,
      startDate: o.start ? date(o.start, 'start') : from,
      renewalDate: o.renewal ? date(o.renewal, 'renewal') : '',
      usageSources: o.tool ? [{ tool: oneOf(o.tool, TOOLS, 'tool'), models: list(o.models) }] : [],
      measurement: o.measurement ? oneOf(o.measurement, METHODS, 'measurement') : o.tool === 'claude' || o.tool === 'codex' ? 'exact' : 'plan',
      expenses: [], planUsage: [], notes: o.notes || '', createdAt: today(), updatedAt: today(),
    }
    reg.subscriptions.push(s)
    const p = s.prices[0]
    return { summary: `Subscription ${s.name} (${s.id}) added under ${provider.name} – ${billing}${p ? `, ${p.amount} ${p.currency}/${p.frequency}` : ''}${s.budgets[0] ? `, budget ${s.budgets[0].monthly} ${cur}/month` : ''}${s.usageSources[0] ? `, usage from ${s.usageSources[0].tool}` : ', no usage source'}`, target: `sub:${s.id}` }
  },
  'sub update'(reg, id, o) {
    const s = findSub(reg, id)
    const changes = []
    if (o.name && o.name !== true) { s.name = String(o.name); changes.push('name') }
    if (o.provider) { s.provider = findProvider(reg, o.provider).id; changes.push('provider') }
    if (o.notes !== undefined && o.notes !== true) { s.notes = String(o.notes); changes.push('notes') }
    if (o.start) { s.startDate = date(o.start, 'start'); changes.push('start') }
    if (o.renewal) { s.renewalDate = date(o.renewal, 'renewal'); changes.push('renewal') }
    if (o.currency) { s.currency = currency(o.currency); changes.push('currency (applies to new prices/expenses)') }
    if (o.measurement) { s.measurement = oneOf(o.measurement, METHODS, 'measurement'); changes.push('measurement') }
    if (o.tool) { s.usageSources = [{ tool: oneOf(o.tool, TOOLS, 'tool'), models: list(o.models) }]; changes.push('usage source') }
    else if (o.models) { if (!s.usageSources[0]) fail('Set --tool first'); s.usageSources[0].models = list(o.models); changes.push('models') }
    if (!changes.length) fail('Nothing to update (use --name, --provider, --tool, --models, --start, --renewal, --currency, --measurement, --notes; prices: sub price; budget: sub budget; billing model: sub billing)')
    s.updatedAt = today()
    return { summary: `Subscription ${s.id} updated: ${changes.join(', ')}`, target: `sub:${s.id}` }
  },
  'sub price'(reg, id, o) {
    const s = findSub(reg, id)
    needYes(o, 'Changing a subscription price')
    const from = o.from ? date(o.from, 'from') : today()
    const prev = current(s.prices, from)
    const [freq, months] = String(o.frequency || (prev ? prev.frequency : 'monthly')).split(':')
    oneOf(freq, FREQ, 'frequency')
    const entry = { from, amount: num(o.price, 'price'), currency: currency(o.currency || s.currency), frequency: freq, months: freq === 'custom' ? num(months || (prev && prev.months), 'frequency months', { min: 1 }) : undefined }
    s.prices = s.prices.filter((p) => p.from !== from).concat(entry).sort((a, b) => a.from.localeCompare(b.from))
    s.updatedAt = today()
    return { summary: `Price of ${s.id} from ${from}: ${entry.amount} ${entry.currency}/${freq}${prev ? ` (was ${prev.amount} ${prev.currency}/${prev.frequency} – kept in history)` : ''}`, target: `sub:${s.id}` }
  },
  'sub billing'(reg, id, o) {
    const s = findSub(reg, id)
    needYes(o, 'Changing a billing model')
    const model = oneOf(o.billing || o.model, BILLING, 'billing')
    const from = o.from ? date(o.from, 'from') : today()
    if (model !== 'payg' && !current(s.prices, from) && o.price === undefined) fail(`A ${model} subscription needs a fixed fee: add --price`)
    if (o.price !== undefined) actions['sub price'](reg, id, { ...o, yes: true, from })
    s.billing = s.billing.filter((b) => b.from !== from).concat({ from, model }).sort((a, b) => a.from.localeCompare(b.from))
    s.updatedAt = today()
    return { summary: `Billing model of ${s.id} from ${from}: ${model}`, target: `sub:${s.id}` }
  },
  'sub budget'(reg, id, o) {
    const s = findSub(reg, id)
    const from = o.from ? date(o.from, 'from') : today()
    const amount = o.budget === 'none' ? null : num(o.budget, 'budget')
    s.budgets = s.budgets.filter((b) => b.from !== from).concat({ from, monthly: amount, currency: currency(o.currency || s.currency) }).sort((a, b) => a.from.localeCompare(b.from))
    s.updatedAt = today()
    return { summary: amount === null ? `Budget of ${s.id} removed from ${from}` : `Monthly budget of ${s.id} from ${from}: ${amount} ${s.currency} (a budget is a limit, not an expense)`, target: `sub:${s.id}` }
  },
  // Billing periods: the real dates of each paid period (e.g. 2026-11-15 → 2026-12-14). Wakil Desktop computes, per
  // period: daily cost = fee ÷ days, cost to date = daily cost × days elapsed, 1 credit = cost to date ÷ credits used.
  // Without declared periods, periods are derived from the start date and the price frequency.
  'sub period'(reg, id, o) {
    const s = findSub(reg, id)
    s.periods = s.periods || []
    if (o.remove) {
      const start = date(o.remove, 'remove')
      needYes(o, 'Removing a billing period')
      const before = s.periods.length
      s.periods = s.periods.filter((p) => p.start !== start)
      if (s.periods.length === before) fail(`No period of ${s.id} starts on ${start}`)
      s.updatedAt = today()
      return { summary: `Billing period of ${s.id} starting ${start} removed`, target: `sub:${s.id}` }
    }
    const start = date(o.start || fail('sub period needs --start YYYY-MM-DD (first day of the paid period)'), 'start')
    const price = current(s.prices, start)
    const step = !price || price.frequency === 'monthly' ? 1 : price.frequency === 'yearly' ? 12 : Math.max(1, price.months || 1)
    const addMonths = (day, n) => {
      const [y, m, d] = day.split('-').map(Number)
      const f = new Date(Date.UTC(y, m - 1 + n, 1))
      const dim = new Date(Date.UTC(f.getUTCFullYear(), f.getUTCMonth() + 1, 0)).getUTCDate()
      return `${f.getUTCFullYear()}-${String(f.getUTCMonth() + 1).padStart(2, '0')}-${String(Math.min(d, dim)).padStart(2, '0')}`
    }
    const minusDay = (day) => new Date(Date.parse(day + 'T12:00:00Z') - 86400000).toISOString().slice(0, 10)
    const end = o.end ? date(o.end, 'end') : minusDay(addMonths(start, step))
    if (end < start) fail(`--end (${end}) is before --start (${start})`)
    if (o.amount !== undefined) needYes(o, 'Setting the amount paid for a period')
    const amount = o.amount !== undefined ? num(o.amount, 'amount') : price ? price.amount : fail(`${s.id} has no price in effect on ${start}: add --amount`)
    const cur = currency(o.currency || (price && price.currency) || s.currency)
    const overlap = s.periods.find((p) => p.start !== start && p.start <= end && p.end >= start)
    if (overlap) fail(`Overlaps the period ${overlap.start} → ${overlap.end} of ${s.id} (remove it first: sub period ${s.id} --remove ${overlap.start} --yes)`)
    const days = Math.round((Date.parse(end + 'T12:00:00Z') - Date.parse(start + 'T12:00:00Z')) / 86400000) + 1
    const entry = { start, end, amount, currency: cur, note: o.note && o.note !== true ? String(o.note) : '', at: today() }
    s.periods = s.periods.filter((p) => p.start !== start).concat(entry).sort((a, b) => a.start.localeCompare(b.start))
    s.updatedAt = today()
    return { summary: `Billing period of ${s.id}: ${start} → ${end} (${days} days), ${amount} ${cur} → ${(amount / days).toFixed(4)} ${cur}/day`, target: `sub:${s.id}` }
  },
  'sub periods'(reg, id) {
    const s = findSub(reg, id)
    return { read: { subscription: s.id, startDate: s.startDate, periods: s.periods || [], note: 'Periods not declared here are derived from the start date and the price frequency.' } }
  },
  'sub activate': (reg, id) => setStatus(findSub(reg, id), 'active', 'subscription'),
  'sub deactivate': (reg, id) => setStatus(findSub(reg, id), 'inactive', 'subscription'),
  'sub archive'(reg, id, o) { needYes(o, 'Archiving a subscription'); return setStatus(findSub(reg, id), 'archived', 'subscription') },
  'sub remove'(reg, id, o) {
    const s = findSub(reg, id)
    needYes(o, 'Removing a subscription')
    if (s.expenses.length || s.planUsage.length || reg.usage.some((u) => u.subscription === s.id) || (s.startDate && s.startDate < today())) {
      fail(`Subscription ${s.id} has expenses, usage or billing history (it started ${s.startDate}) – archive it instead: sub archive ${s.id} --yes`)
    }
    reg.subscriptions = reg.subscriptions.filter((x) => x !== s)
    return { summary: `Subscription ${s.id} removed (no history)`, target: `sub:${s.id}` }
  },
  'sub show'(reg, id) {
    const ss = id ? [findSub(reg, id)] : reg.subscriptions
    return {
      read: ss.map((s) => ({
        ...s,
        currentPrice: current(s.prices) || null,
        currentBilling: (current(s.billing) || {}).model,
        currentBudget: current(s.budgets) || null,
      })),
    }
  },
  'sub expense'(reg, id, o) {
    const s = findSub(reg, id)
    needYes(o, 'Recording an expense')
    const e = {
      period: period(o.period || today().slice(0, 7)),
      kind: oneOf(o.kind || 'variable', ['fixed', 'variable'], 'kind'),
      amount: num(o.amount, 'amount'),
      currency: currency(o.currency || s.currency),
      status: oneOf(o.status || 'actual', ['actual', 'reported'], 'status'), // actual = invoice / bank, reported = provider dashboard
      source: o.source || 'owner',
      note: o.note || '',
      at: today(),
    }
    // same period + kind + source replaces the previous figure (corrections), everything else is kept
    s.expenses = s.expenses.filter((x) => !(x.period === e.period && x.kind === e.kind && x.source === e.source)).concat(e)
    s.updatedAt = today()
    return { summary: `${e.status} ${e.kind} expense for ${s.id} ${e.period}: ${e.amount} ${e.currency} (source ${e.source})`, target: `sub:${s.id}` }
  },
  'sub plan-usage'(reg, id, o) {
    const s = findSub(reg, id)
    const r = {
      date: o.date ? date(o.date, 'date') : today(),
      metric: String(o.metric || fail('--metric needed, e.g. premium-requests, credits, usage-percent')),
      value: num(o.value, 'value'),
      limit: o.limit !== undefined ? num(o.limit, 'limit') : null,
      window: o.window || 'month',
      source: o.source || 'provider-dashboard',
      confidence: oneOf(o.confidence || 'high', CONFIDENCE, 'confidence'),
    }
    s.planUsage.push(r)
    s.updatedAt = today()
    return { summary: `Plan usage for ${s.id} on ${r.date}: ${r.metric} = ${r.value}${r.limit !== null ? ` / ${r.limit}` : ''}`, target: `sub:${s.id}` }
  },

  // Mode 2 / manual usage (e.g. Cursor, which keeps no local token log)
  'usage record'(reg, id, o) {
    const s = findSub(reg, id || o.subscription || fail('usage record needs the subscription id'))
    const project = String(o.project || '')
    if (project && !/^[\w.-]+\/[\w.-]+$/.test(project)) fail('--project must be <entity-slug>/<project-slug|none>')
    const exact = o.input !== undefined || o.output !== undefined
    const u = {
      id: `u-${Date.now().toString(36)}`,
      subscription: s.id,
      date: o.date ? date(o.date, 'date') : today(),
      project: project || null,
      task: o.task || null,
      agent: o.agent || null,
      model: o.model || null,
      category: o.category || null,
      requests: o.requests !== undefined ? num(o.requests, 'requests') : 1,
      tokens: exact ? { input: num(o.input ?? 0, 'input'), output: num(o.output ?? 0, 'output'), cached: num(o.cached ?? 0, 'cached') } : null,
      method: o.method ? oneOf(o.method, METHODS, 'method') : exact ? 'exact' : 'estimated',
      confidence: oneOf(o.confidence || (exact ? 'high' : 'low'), CONFIDENCE, 'confidence'),
      source: o.source || `${o['source-tool'] || 'chat'}-report`,
      note: o.note || '',
    }
    reg.usage.push(u)
    return { summary: `Usage recorded for ${s.id}: ${u.requests} request(s)${u.tokens ? `, ${u.tokens.input}/${u.tokens.output}/${u.tokens.cached} tokens` : ''}${u.project ? ` on ${u.project}` : ''} – ${u.method}, confidence ${u.confidence}`, target: `sub:${s.id}` }
  },
  'usage show'(reg) {
    return { read: { acu: reg.acu[reg.acu.length - 1], settings: reg.settings, manualUsage: reg.usage.length, subscriptions: reg.subscriptions.map((s) => `${s.id} (${s.status})`) } }
  },
  'acu show': (reg) => ({ read: reg.acu }),
  'acu set'(reg, id, o) {
    needYes(o, 'Changing the ACU formula')
    const prev = reg.acu[reg.acu.length - 1]
    const next = JSON.parse(JSON.stringify(prev))
    const changes = []
    for (const k of ['input', 'output', 'cached', 'overhead']) if (o[k] !== undefined) { next.weights[k] = num(o[k], k); changes.push(`${k}=${next.weights[k]}`) }
    if (o['default-multiplier'] !== undefined) { next.defaultMultiplier = num(o['default-multiplier'], 'default-multiplier', { min: 0.0001 }); changes.push(`default multiplier=${next.defaultMultiplier}`) }
    if (o.multiplier) {
      const [match, value] = String(o.multiplier).split('=')
      if (!match || value === undefined) fail('--multiplier must be <model-prefix>=<value>, e.g. claude-opus=1.5')
      next.multipliers = next.multipliers.filter((m) => m.match !== match)
      if (value !== 'none') next.multipliers.push({ match, value: num(value, 'multiplier', { min: 0.0001 }) })
      changes.push(`multiplier ${match}=${value}`)
    }
    if (o.estimate) {
      const [match, value] = String(o.estimate).split('=')
      if (!match || value === undefined) fail('--estimate must be <model-or-tool-prefix>=<ACU per request>, e.g. cursor=3')
      next.estimation = next.estimation.filter((m) => m.match !== match)
      if (value !== 'none') next.estimation.push({ match, acuPerRequest: num(value, 'estimate') })
      changes.push(`estimate ${match}=${value} ACU/request`)
    }
    if (!changes.length) fail('Nothing to change (use --input, --output, --cached, --overhead, --default-multiplier, --multiplier prefix=value, --estimate prefix=value)')
    next.version = prev.version + 1
    next.from = o.from ? date(o.from, 'from') : today()
    next.note = o.note || changes.join(', ')
    reg.acu.push(next)
    return { summary: `ACU formula v${next.version} from ${next.from}: ${changes.join(', ')} (v${prev.version} kept for history)`, target: `acu:v${next.version}` }
  },
  'settings set'(reg, id, o) {
    const changes = []
    if (o['base-currency']) { reg.settings.baseCurrency = currency(o['base-currency']); changes.push(`base currency ${reg.settings.baseCurrency}`) }
    for (const fx of list(o.fx)) {
      const [c, v] = fx.split('=')
      reg.settings.fx[currency(c)] = num(v, `fx ${c}`, { min: 0.000001 })
      changes.push(`1 ${currency(c)} = ${v} ${reg.settings.baseCurrency}`)
    }
    if (!changes.length) fail('Use --base-currency USD and/or --fx EUR=1.08,TND=0.32')
    return { summary: `Settings: ${changes.join(', ')}`, target: 'settings' }
  },
  'log show'(reg, id, o) {
    return { read: reg.log.slice(-(o.last ? num(o.last, 'last', { min: 1 }) : 20)) }
  },
}

function setStatus(entity, status, kind) {
  oneOf(status, STATUS, 'status')
  const before = entity.status
  entity.status = status
  entity.updatedAt = today()
  return { summary: `${kind} ${entity.id}: ${before} → ${status}`, target: `${kind === 'provider' ? 'provider' : 'sub'}:${entity.id}` }
}

const HELP = `Wakil AI registry – usage/registry.json
  provider add --name "Anthropic" [--integration claude-code-logs|codex-logs|manual|none] [--category] [--website] [--description] [--notes]
  provider update|show|activate|deactivate <id> · provider archive|remove <id> --yes
  sub add --provider <id> --name "Claude Pro" --billing fixed|payg|hybrid [--price 20 --currency USD --frequency monthly|yearly|custom:3]
          [--budget 50] [--start YYYY-MM-DD] [--renewal YYYY-MM-DD] [--tool claude|codex|cursor|other] [--models claude-,gpt-] [--measurement exact|estimated|plan]
  sub update <id> [--name --provider --tool --models --start --renewal --currency --measurement --notes]
  sub price <id> --price 25 [--currency] [--frequency] [--from DATE] --yes      (history kept)
  sub billing <id> --billing hybrid [--price] [--from] --yes                     (history kept)
  sub budget <id> --budget 50|none [--from]                                       (a budget is not an expense)
  sub expense <id> --period YYYY-MM --amount 12.4 --kind fixed|variable [--status actual|reported] [--source invoice] --yes
  sub plan-usage <id> --metric premium-requests --value 320 [--limit 500] [--date] [--source cursor-dashboard]
  sub period <id> --start YYYY-MM-DD [--end YYYY-MM-DD] [--amount 20 --yes] [--currency] · sub period <id> --remove START --yes · sub periods <id>
  sub activate|deactivate|show <id> · sub archive|remove <id> --yes
  usage record <sub-id> --project <entity>/<project> [--requests 3] [--model] [--category] [--input --output --cached] [--task T-004] [--agent ui-ux]
  usage show · acu show · acu set [--input 1 --output 2 --cached 0.25 --overhead 0.5] [--multiplier claude-opus=1.5] [--estimate cursor=3] --yes
  settings set --base-currency USD --fx EUR=1.08,TND=0.32 · log show [--last 20]
Every write needs --source-tool claude|cursor|codex (+ --agent, --command "<owner's words>").`

function main(argv) {
  const { pos, opt } = parseArgs(argv)
  if (!pos.length || pos[0] === 'help') {
    console.log(HELP)
    return 0
  }
  const group = pos[0] === 'subscription' ? 'sub' : pos[0]
  const key = `${group} ${pos[1] || 'show'}`
  const fn = actions[key]
  if (!fn) fail(`Unknown action "${pos.slice(0, 2).join(' ')}". Run: node tools/ai-registry.cjs help`)
  const reg = load()
  const res = fn(reg, pos[2], opt)
  if (res.read !== undefined) {
    console.log(JSON.stringify(res.read, null, 2))
    return 0
  }
  const tool = opt['source-tool']
  if (!tool) fail('Writes need --source-tool claude|cursor|codex (the chat that executed the command)')
  oneOf(tool, TOOLS, 'source-tool')
  reg.log.push({
    at: new Date().toISOString(),
    action: key.toUpperCase().replace(' ', '_'),
    target: res.target,
    summary: res.summary,
    sourceTool: tool,
    agent: opt.agent || 'manager',
    command: opt.command && opt.command !== true ? String(opt.command).slice(0, 500) : '',
  })
  save(reg)
  console.log(`✓ ${res.summary}`)
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
module.exports = { main, load, DEFAULT_ACU }
