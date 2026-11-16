---
description: File locks – see which agent is editing which file, release a lock, or take one by hand (Codex, manual work) so two agents never edit the same file
argument-hint: [show] · release <path…> | --stale | --owner <id> | --all · take <path…> --owner <name> [--note "…"]
---
# /wakil.locks – File locks between agents

Act as the **manager** (`.claude/agents/manager/manager.md`). Arguments: `$ARGUMENTS`

## Purpose
Two agents must never edit the same file at the same time (two sub-agents, two Claude sessions, Claude and Cursor…).
Before every file edit a hook takes a **lock** on the file for the agent that edits it
(`tools/file-lock.cjs`, store `.wakil/locks/` – private, git-ignored). Any other agent that tries to edit that file
while the lock is alive is **refused** and told who holds it; it continues with other files or reports the file as
waiting. This command shows and manages those locks.

| Tool | Lock taken | Released |
|---|---|---|
| Claude Code (main agent and every sub-agent) | `PreToolUse` on Edit / Write / MultiEdit / NotebookEdit (`.claude/settings.json`) | `Stop` (main agent's turn ends) · `SubagentStop` (that sub-agent ends) |
| Cursor | `preToolUse` on Write (`.cursor/hooks.json`) | `stop` (turn ends) |
| Codex / manual work | `/wakil.locks take <path> --owner codex` (Codex has no pre-edit hook) | `/wakil.locks release <path>` |
| All | – | automatically after 15 min without an edit by the holder (`WAKIL_LOCK_TTL_MIN`) |

A sub-agent may take over a lock of **its own session's main agent** (the manager handed the file over); the main
agent cannot take a file back from a sub-agent that is still running. Files outside the ecosystem, `usage/` and
`.wakil/` are never locked. A hook error never blocks an edit (fail-open). Edits made through a shell command
(sed, scripts) are not covered – agents use the edit tools for files.

## Arguments
| Argument | Required | Values | Default |
|---|---|---|---|
| `show` | no | list every lock: file, holder (tool, agent, session), since, last edit, expired or not | `show` |
| `release <path…>` | no | free these files | – |
| `release --stale` | no | remove expired locks | – |
| `release --owner <id>` | no | free every lock of one holder (id prefix from `show --json`, e.g. `claude:<session>` or `cursor:<conversation>`) | – |
| `release --all` | no | free every lock | – |
| `take <path…> --owner <name>` | no | lock files by hand for a tool without hooks (Codex) or for your own manual work | – |

## Preconditions
- `tools/file-lock.cjs` exists. Paths are relative to the ecosystem root (or absolute inside it).

## Steps
1. `show` → `node tools/file-lock.cjs list`; print it as a table (🔒 alive · ⌛ expired).
2. `release …` → before releasing a **live** lock of another agent, say which agent holds it and ask the owner to
   confirm (that agent may still be writing the file); `--stale` needs no confirmation. Then
   `node tools/file-lock.cjs release …` and show the new list.
3. `take …` → `node tools/file-lock.cjs acquire <path…> --owner <name> [--note "…"]`; report refused files.

## Rules
- Never edit `.wakil/locks/` by hand – only through `tools/file-lock.cjs`.
- A refused edit is not an error to work around: never copy the file, edit it through a shell command or release the
  lock yourself to get past it. Report the file as waiting (`BLOCKED` if nothing else can be done) and name the holder.
- Locks hold paths and agent names only – no client data, no people.

## Output
The lock table (or what was released / taken) and the next step.

## Schedulable
`show` and `release --stale` – read-only or removing expired locks only.

## Examples
- `/wakil.locks`
- `/wakil.locks release --stale`
- `/wakil.locks release entities/acme/projects/website/index.html`
- `/wakil.locks take entities/acme/BRAND.md --owner codex --note "Codex refactor"`
