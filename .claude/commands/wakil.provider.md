---
description: Register or update an AI provider (Anthropic, OpenAI, Cursor, Google…) in the AI registry shown by Wakil Desktop
argument-hint: add|update|show|activate|deactivate|archive|remove [provider] [details in plain words]
---
# /wakil.provider – AI providers (ADD_PROVIDER, UPDATE_PROVIDER, …)

Act as the **manager** (`.claude/agents/manager/manager.md`). Arguments: `$ARGUMENTS`

## Purpose
Keep the list of AI providers in the central registry `usage/registry.json` (private, git-ignored). Wakil Desktop
reads it to build its Usage & credits dashboards and filters. Works the same from Claude Code, Cursor or Codex:
the chat only translates the owner's request into a call to `tools/ai-registry.cjs`, which validates, logs and writes.

## Arguments
| Argument | Required | Values | Default |
|---|---|---|---|
| action | yes | `add` · `update` · `show` · `activate` · `deactivate` · `archive` · `remove` (or the owner's words: "add Anthropic", "Cursor is no longer used"…) | `show` |
| provider | for all but `add`/`show` | provider id (`anthropic`, `openai`, `cursor`…) or name | – |
| details | no | name, category, website, description, integration, notes – in plain words | – |

**Integration** says where usage telemetry comes from – never claim more than is true:
`claude-code-logs` (Claude Code local logs) · `codex-logs` (Codex local logs) · `manual` (figures reported in chat,
e.g. Cursor) · `none` (no telemetry). Adding a provider does NOT connect any API.

## Preconditions
- Node.js is available (`node --version`).

## Steps
1. Map the request to one action (table in `tools/ai-registry.cjs help`): ADD_PROVIDER → `provider add`,
   UPDATE_PROVIDER → `provider update`, `activate` / `deactivate` / `archive` / `remove`, `show`.
2. Missing or ambiguous facts (exact name, integration) → ask (max 3 questions, each with a suggested default).
   Never invent a website or an integration.
3. `archive` and `remove` are destructive: say exactly what will change and wait for the owner's "yes"; then add `--yes`.
   `remove` is refused by the tool when subscriptions depend on the provider → propose `archive`.
4. Run, from the ecosystem root:
   `node tools/ai-registry.cjs provider <action> [<id>] [--name "…"] [--integration …] [--category …] [--website …] [--description "…"] [--notes "…"] --source-tool <claude|cursor|codex> --agent manager --command "<the owner's words>"`
   (`--source-tool` = the chat you are running in.)
5. Report the `✓` line (or the `✗` validation error and how to fix it). For `show`, summarise the JSON.

## Rules
- Only `tools/ai-registry.cjs` writes `usage/registry.json` – never edit the file by hand.
- Never invent telemetry, prices or plans. Never put API keys or passwords in the registry.
- History is never deleted: prefer `deactivate` / `archive`.

## Output
The validated change (one line) or the provider details, and "visible in Wakil Desktop › Usage & crédits".

## Schedulable
`show` only.

## Examples
- `/wakil.provider add Anthropic, integration claude-code-logs, website anthropic.com`
- `/wakil.provider add Cursor – usage reported manually`
- `/wakil.provider update openai integration codex-logs`
- `/wakil.provider deactivate google`
- `/wakil.provider show`
