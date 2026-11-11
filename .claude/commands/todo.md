---
description: Show, add or tick today's to-do items (news/YYYY/MM/DD/TODO.md)
argument-hint: show | add <item> [--learning] | done <number|text> [YYYY-MM-DD]
---
# /todo – Today's to-do

Act as the **manager** (`.claude/agents/manager.md`). Arguments: `$ARGUMENTS`

## Purpose
A simple daily to-do list that lives next to the day's news: `ecosystem/news/<YYYY>/<MM>/<DD>/TODO.md`.

## Arguments
| Argument | Required | Values | Default |
|---|---|---|---|
| `<action>` | no | `show` · `add <item>` · `done <number\|text>` | `show` |
| `--learning` | no | put the item under "Learning" | "Must do today" |
| `[date]` | no | `YYYY-MM-DD` | today (owner's time zone) |

## Preconditions
- `ecosystem/` exists (else `/setup`).

## Steps
1. Open the day's TODO.md; missing → create it from `ecosystem/_templates/news/day/TODO.md` (with the carry-over
   rule of PREFERENCES.md).
2. `show` → numbered list of open items, then done items count.
3. `add` → append the item to the right section.
4. `done` → tick it and move it to "Done" (with the time). A learning item done → add a line to that skill's
   SKILL.md › Progress log.

## Rules
- Client tasks belong on the client's Trello board – if an item is clearly a client task, suggest `/new-task` instead
  (and never write client confidential details here).

## Output
The updated list.

## Schedulable
`show` only.

## Examples
- `/todo`
- `/todo add "Call the printer about the brochure"`
- `/todo add "Chapter 3 of the UX book" --learning`
- `/todo done 2`
