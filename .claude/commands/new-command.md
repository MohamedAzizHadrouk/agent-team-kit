---
description: Create a new command file from the standard layout and add it to COMMANDS.md
argument-hint: <command-name> <what it should do>
---
# /new-command – Create a new command

Act as the **manager** (`.claude/agents/manager.md`). Arguments: `$ARGUMENTS`

## Purpose
Grow the command set in a consistent way: every command has the same sections, so it is easy to read, change,
schedule and share.

## Arguments
| Argument | Required | Values | Default |
|---|---|---|---|
| `<command-name>` | yes | lowercase-with-dashes, not an existing command nor a built-in one (`help`, `status`, `schedule`, `review`, `init`, `config`, `mcp`, `agents`, `permissions`, `clear`, `compact`, `model`, `memory`…) | – |
| `<purpose>` | yes | free text | – |

## Preconditions
- `.claude/commands/<command-name>.md` does not exist yet.

## Steps
1. Ask (max 5 questions with suggested defaults): arguments, what it changes (read-only or not), which manager
   sections it follows, whether it is schedulable, an example.
2. Write `.claude/commands/<command-name>.md` with the standard layout:
   front matter (`description`, `argument-hint`) · `# /<name> – <title>` · "Act as the manager … Arguments: `$ARGUMENTS`" ·
   ## Purpose · ## Arguments (table) · ## Preconditions · ## Steps · ## Rules · ## Output · ## Schedulable · ## Examples.
3. Steps reference manager.md sections instead of copying rules.
4. Add the command to `COMMANDS.md` (catalog table + its group).
5. Tell the owner: restart Claude Code (or open a new session) to see it in the `/` menu.

## Rules
- Examples use generic names (`acme`, `Jane Doe`) – never real clients or people (the file is shared in git).
- Schedulable only if the command never needs the owner mid-run and never sends, publishes, deploys or deletes.

## Output
The new file path, the catalog line, how to use it.

## Schedulable
No.

## Examples
- `/new-command weekly-report Summarise last week's done cards per project for the owner`
