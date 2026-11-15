---
description: Add or update an AI subscription (price, budget, billing model, dates, expenses, plan usage) in the AI registry shown by Wakil Desktop
argument-hint: add|update|price|billing|budget|expense|plan-usage|activate|deactivate|archive|remove|show [subscription] [details in plain words]
---
# /wakil.subscription – AI subscriptions & billing (ADD_SUBSCRIPTION, UPDATE_BILLING, SET_BUDGET, …)

Act as the **manager** (`.claude/agents/manager/manager.md`). Arguments: `$ARGUMENTS`

## Purpose
Register the owner's AI subscriptions and what they really cost, in `usage/registry.json`, so Wakil Desktop can
split every subscription's expense across the projects that consumed it. Works from Claude Code, Cursor or Codex:
"Add Claude Pro at $20/month", "Set Cursor monthly budget to $50", "Codex cost me 23 € in November".

## Arguments
| Argument | Required | Values | Default |
|---|---|---|---|
| action | yes | see the mapping below, or plain words | `show` |
| subscription | all but `add`/`show` | subscription id (`claude-pro`…) or name | – |
| details | no | provider, price, currency, frequency, billing model, budget, dates, usage source, period, amount… | – |

| Owner says / command | Tool call |
|---|---|
| ADD_SUBSCRIPTION "Add Claude Pro at $20/month" | `sub add --provider anthropic --name "Claude Pro" --billing fixed --price 20 --currency USD --frequency monthly --tool claude` |
| UPDATE_SUBSCRIPTION (name, provider, dates, usage source, notes) | `sub update <id> --…` |
| SET_SUBSCRIPTION_PRICE "now $25/month" | `sub price <id> --price 25 [--from YYYY-MM-DD] --yes` |
| UPDATE_BILLING "it is now hybrid" | `sub billing <id> --billing hybrid [--price] --yes` |
| SET_BUDGET "budget $50/month" | `sub budget <id> --budget 50` (`none` removes it) |
| record an actual / provider-reported charge | `sub expense <id> --period YYYY-MM --amount X --kind fixed\|variable --status actual\|reported --source invoice\|provider --yes` |
| plan-level usage (Cursor dashboard, credits, usage %) | `sub plan-usage <id> --metric premium-requests --value 320 --limit 500 --source cursor-dashboard` |
| ACTIVATE / DEACTIVATE_SUBSCRIPTION | `sub activate <id>` · `sub deactivate <id>` |
| archive / remove | `sub archive <id> --yes` · `sub remove <id> --yes` (refused when history exists) |
| GET_SUBSCRIPTION_DETAILS | `sub show [<id>]` |
| SET_BILLING_PERIOD "my period runs 15 Nov → 14 Dec" | use `/wakil.billing-period` (`sub period <id> --start … [--end …]`) |

**Billing models:** `fixed` (fixed fee per period) · `payg` (usage-based; the budget is only a limit) · `hybrid`
(fixed fee + variable charges). **Usage source** (`--tool claude|codex|cursor|other`, optional `--models claude-opus,claude-sonnet`)
says which measured usage belongs to this subscription. Claude Code and Codex usage is measured from local logs; Cursor has
no local token log → use `plan-usage` (Mode 3) or `/wakil.usage record` (Mode 2).

## Preconditions
- The provider exists (`/wakil.provider show`); if not, add it first (ask the owner).
- Node.js is available.

## Steps
1. Map the request to one action from the table. Convert amounts to numbers, keep the currency (`USD`, `EUR`, `TND`…).
2. Missing facts (price, currency, frequency, billing model, which tool's usage it covers) → ask (max 4 questions,
   each with a suggested default). Never guess a price, a plan or a charge.
3. **Confirmation**: price, billing-model, expense, archive and remove changes are financially significant – restate
   them in one line ("Claude Pro: $20 → $25/month from 2026-12-01, history kept – confirm?") and wait for "yes", then add `--yes`.
4. Run from the ecosystem root, adding `--source-tool <claude|cursor|codex> --agent manager --command "<the owner's words>"`:
   `node tools/ai-registry.cjs sub <action> [<id>] [--options]`
5. Report the `✓` line or the `✗` error (fix and retry once if it is a format issue, otherwise ask).

## Rules
- Only `tools/ai-registry.cjs` writes `usage/registry.json`; never hand-edit it.
- A budget is a limit, never an expense. An estimate is never recorded as `actual`.
- Prices, budgets and billing models are versioned with a `--from` date: changing the current value never rewrites the past.
- Never store card numbers, invoices' personal data, API keys or passwords – amounts and periods only.

## Output
The validated change (one line) or the subscription details (current price, billing model, budget, renewal, last expenses).

## Schedulable
`show` only.

## Examples
- `/wakil.subscription add Claude Pro $20/month, Anthropic, usage from Claude Code`
- `/wakil.subscription add Cursor Pro, Cursor, $20/month, budget $50, usage reported manually`
- `/wakil.subscription add Codex, OpenAI, $20/month, usage from Codex`
- `/wakil.subscription price claude-pro $25/month from 2026-12-01`
- `/wakil.subscription budget cursor-pro 50`
- `/wakil.subscription expense cursor-pro November 2026 variable $13.40 from the Cursor invoice`
- `/wakil.subscription plan-usage cursor-pro 320 of 500 premium requests`
- `/wakil.subscription show`
