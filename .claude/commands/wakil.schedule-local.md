---
description: Schedule a command to run automatically on this computer (e.g. /wakil.process every 30 min on workdays)
argument-hint: "<command with arguments>" <interval> [days] [hours] | --list | --remove <name>
---
# /wakil.schedule-local – Run a command automatically on this computer

Act as the **manager** (`.claude/agents/manager.md`). Arguments: `$ARGUMENTS`

## Purpose
Run a schedulable command (marked "Schedulable: yes" in its file) on a timetable, **on this computer** – needed
because client folders are private (local only) and email drafts use the local Outlook.

## Arguments
| Argument | Required | Values | Default |
|---|---|---|---|
| `"<command>"` | yes | a schedulable command with its arguments, e.g. `"/wakil.process acme"` | – |
| `<interval>` | yes | `15m`, `30m`, `1h`, `daily 08:30` … | – |
| `[days]` | no | `mon-fri`, `every-day`, `mon,wed,fri` | `mon-fri` |
| `[hours]` | no | `08:00-18:00` | `08:00-18:00` |
| `--list` | – | show existing schedules | – |
| `--remove <name>` | – | delete a schedule (asks for confirmation) | – |

## Preconditions
- The command's file says "Schedulable: yes". Otherwise refuse and explain why.
- The computer stays on; Outlook desktop is open if the command prepares email drafts.

## Steps
1. Explain the plan in one line (command, timetable, cost: each run uses Claude usage even if nothing changed) and
   **wait for the owner's yes**.
2. Prefer the desktop app's local scheduled tasks if available; otherwise Windows Task Scheduler running:
   `claude -p "<command>" --agent manager` in the repo folder.
3. Unattended runs cannot ask for permission: tell the owner which tools must be allowed for the run
   (Trello MCP, PowerShell for `tools/outlook-draft.ps1`, file edits under `clients/`) and offer to set them up
   (`/permissions` in an interactive terminal, or `.claude/settings.local.json`).
4. Record the schedule in `COMMANDS.md` › Schedules (command, timetable, created date) – no client data in that line
   other than the slug.

## Rules
- Only "Schedulable: yes" commands. Never schedule anything that sends messages, publishes, deploys or deletes.
- Ask before creating, changing or removing a schedule.

## Output
The schedule created (name, command, timetable), how to pause or remove it, the permissions still to grant.

## Schedulable
No (it creates schedules).

## Examples
- `/wakil.schedule-local "/wakil.process acme" 30m mon-fri 08:00-18:00`
- `/wakil.schedule-local "/wakil.overview acme" "daily 08:30"`
- `/wakil.schedule-local --list`
