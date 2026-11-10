---
description: Show all available commands with their arguments and examples (COMMANDS.md)
argument-hint: [command-name]
---
# /list-commands – What can I ask?

Arguments: `$ARGUMENTS`

## Purpose
Show the command catalog, or the full details of one command.

## Arguments
| Argument | Required | Values | Default |
|---|---|---|---|
| `[command-name]` | no | a command name without `/` | – (show the whole catalog) |

## Preconditions
- `COMMANDS.md` exists at the repo root.

## Steps
1. No argument → read `COMMANDS.md` and show the catalog table grouped by category, plus the "Schedules" section.
2. With a name → read `.claude/commands/<name>.md` and show Purpose, Arguments, Examples and whether it is schedulable.
3. Unknown name → show the closest matches.

## Rules
- READ-ONLY.

## Output
The catalog, or one command's details.

## Schedulable
No.

## Examples
- `/list-commands`
- `/list-commands process`
