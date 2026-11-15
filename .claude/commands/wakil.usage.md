---
description: AI usage management – record usage that tools do not log (Cursor), configure ACU weights and model multipliers, currencies, and show the registry
argument-hint: record|acu|settings|show|log [details in plain words]
---
# /wakil.usage – Usage, ACU & currencies (GET_PROVIDER_USAGE, CONFIGURE_ACU, RECORD_USAGE)

Act as the **manager** (`.claude/agents/manager/manager.md`). Arguments: `$ARGUMENTS`

## Purpose
Wakil Desktop measures AI consumption in **ACU (AI Consumption Units)** and splits each subscription's expense across
projects in proportion to their ACU, **separately for every subscription**. This command manages what the app cannot
read by itself, through `tools/ai-registry.cjs` (validated, logged, versioned):

- **record** (Mode 2 – estimated, or exact when the chat knows the tokens): usage of a tool without local logs, e.g. Cursor.
- **acu**: weights, model multipliers and per-request estimates. Every change creates a new formula version; old
  versions stay so historical figures can be recalculated either way in the app.
- **settings**: base currency and exchange rates used to add up subscriptions in different currencies.
- **show / log**: current configuration and the change log (who changed what, from which chat).

ACU = (I×Wi + O×Wo + C×Wc) × M + R per request, with I = uncached input tokens/1000 (cache writes included),
O = output tokens/1000, C = cached (read) input tokens/1000, M = model multiplier, R = request overhead.
Defaults: Wi 1.0 · Wo 2.0 · Wc 0.25 · R 0.5 · M 1.0.

## Arguments
| Argument | Required | Values | Default |
|---|---|---|---|
| action | yes | `record` · `acu` · `settings` · `show` · `log` | `show` |
| details | no | plain words: subscription, project, requests, model, tokens, weights, multiplier, currency… | – |

| Owner says | Tool call |
|---|---|
| "In Cursor I did 6 requests on acme/website with sonnet" | `usage record cursor-pro --project acme/website --requests 6 --model claude-sonnet --task T-004` |
| "Output weight 3" / "Opus counts 1.5×" / "a Cursor request ≈ 4 ACU" | `acu set --output 3 --yes` · `acu set --multiplier claude-opus=1.5 --yes` · `acu set --estimate cursor=4 --yes` |
| "Amounts in EUR, 1 TND = 0.30 EUR" | `settings set --base-currency EUR --fx TND=0.30` |
| GET_PROVIDER_USAGE / "show my AI usage setup" | `usage show`, `acu show`, then point to Wakil Desktop › Usage & crédits for figures |
| "what changed?" | `log show --last 20` |

## Preconditions
- The subscription exists (`/wakil.subscription show`). Node.js is available.

## Steps
1. Map the request to one action from the table. A project is `<entity-slug>/<project-slug>` (or `<entity>/none`).
2. **record**: only figures the owner or the tool actually reported – never invent requests or tokens. Without tokens
   the record is `estimated` (ACU = requests × the per-request estimate); with tokens it is `exact`.
   In Cursor, the agent may record its own work at the end of a task (requests it made, model, task id) – say it is an estimate.
3. **acu** changes alter every allocation: restate the change, wait for "yes", add `--yes`.
4. Run from the ecosystem root with `--source-tool <claude|cursor|codex> --agent manager --command "<the owner's words>"`:
   `node tools/ai-registry.cjs <usage|acu|settings|log> <action> [...]`
5. Report the `✓` line. Figures (ACU, %, allocated expense) are computed and shown by Wakil Desktop, not by the chat.

## Rules
- Only `tools/ai-registry.cjs` writes `usage/registry.json`.
- Measured, estimated and plan-level data are never mixed up: always keep the method and confidence.
- ACU is a relative consumption unit, not money and not a provider credit balance.

## Output
The validated change, or the configuration summary.

## Schedulable
`show` and `log` only.

## Examples
- `/wakil.usage record cursor-pro acme/website 6 requests claude-sonnet task T-004`
- `/wakil.usage acu multiplier claude-opus=1.5`
- `/wakil.usage acu estimate cursor=4`
- `/wakil.usage settings base EUR, USD=0.92`
- `/wakil.usage show`
- `/wakil.usage log`
