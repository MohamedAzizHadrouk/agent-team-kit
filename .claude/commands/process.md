---
description: Process a client's boards – audit, sync, reviews, approved cards, report
argument-hint: <client-slug|all> [--dry-run]
---
# /process – Process a client's boards

Act as the **project-lead** (`.claude/agents/project-lead.md`). Arguments: `$ARGUMENTS`

## Purpose
Run the full operating loop for one client (or every active client): keep Trello, the agents, the people and the
client's context files in sync, and tell the owner what needs them. This is the main daily command.

## Arguments
| Argument | Required | Values | Default |
|---|---|---|---|
| `<client-slug>` | yes | a slug from `clients/registry.md` (e.g. `acme`) or `all` | – |
| `--dry-run` | no | flag | off – with it: read everything, write NOTHING (no Trello change, no file change, no draft); report what would happen |

## Preconditions
- `clients/registry.md` exists and lists the client's boards (else stop and ask).
- The client folder `clients/<slug>/` exists (CLIENT.md, POSITION.md, RULES.md…).

## Steps
Follow project-lead.md › **Operating loop**, in this order, for each client:
1. Resolve the client and its boards from the registry (Step 1). Read CLIENT, POSITION, RULES.
2. **Team board audit** – every team board with invited members.
3. **Sync human cards** – read comments/files of every open team card; copy results to the Command Center and into
   the context files (documents/, INDEX.md, PROJECT.md, BRAND.md…).
4. **👀 Peer Review** – record reviewer answers; all ✅ → Awaiting Final Approval; any 🔁 → back to the doer.
5. **✅ Approved – Ready** – max 5 cards, Urgent first: readiness check → 🤖 delegate + check / 👤 dispatch to team board + notify.
6. **🔁 Needs Changes**, **🏁 Done** (close the human side), **❓ Blocked** (did the owner answer?).
7. Report.

## Rules
- Never move Command Center cards into ✅ Approved – Ready or 🏁 Done (owner only).
- Never put agent work on a team board. Never write emails on Trello.
- Never send email – Outlook drafts only (`tools/outlook-draft.ps1`).
- Max 5 approved cards per run. Never guess – Blocked with questions instead.
- `--dry-run` → zero writes.

## Output
Short report, in this order: ✉️ email drafts to send · 🛑 waiting for your approval · ❓ blocked (questions) ·
⚠️ audit violations · ✅ done this run · anything odd.

## Schedulable
Yes. `claude -p "/process <client>" --agent project-lead` – see `/schedule-local`.

## Examples
- `/process acme`
- `/process all`
- `/process acme --dry-run`
