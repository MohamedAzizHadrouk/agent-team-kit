---
description: Show, move or import local task files (tasks/) that mirror the Trello cards – used by the Kanban and token usage in Wakil Desktop
argument-hint: <entity-slug> <project|none> [<task-id> [show|status <new-status>|note "<text>"]] · --import <entity-slug> [project]
---
# /wakil.task – Local task files

Act as the **manager** (`.claude/agents/manager/manager.md`). Arguments: `$ARGUMENTS`

## Purpose
Keep one markdown file per task under `projects/<project>/tasks/` (or `entities/<slug>/tasks/` for tasks without a
project), mirroring the Trello card. Wakil Desktop reads these files to draw a **Kanban per project** and to show
**which agent worked on each task and how many tokens / how much credit it used**.

## Arguments
| Argument | Required | Values | Default |
|---|---|---|---|
| `<entity-slug>` | yes | slug from the registry (or the focus) | focus |
| `<project>` | yes | a folder under `projects/` or `none` | focus |
| `<task-id>` | no | `T-001`… | list the tasks |
| `show` · `status <new-status>` · `note "<text>"` | no | status: proposed, approved, in-progress, in-review, needs-changes, peer-review, awaiting-approval, blocked, done | `show` |
| `--import <entity-slug> [project]` | no | create / update task files from the Command Center cards | – |

## Preconditions
- `entities/_templates/task.md` exists (the task file format).
- For `--import`: the Trello connector is available and the entity has a board in `entities/registry.md`.

## Steps
1. No `<task-id>` → list the task files of the project: id, title, status, agent / assignee, priority.
2. `show` → print the task file (goal, criteria, status log, results).
3. `status <new-status>` → update `status:` and `updated:` in the frontmatter, add a line to **Status log**
   (`- <date> – <status> – <who / note>`). Moving to `approved` or `done` is the **owner's** decision: do it only when
   the owner asks in this command, and move the Trello card the same way.
4. `note "<text>"` → append the note to **Results & links** (dated).
5. `--import` → read the Command Center cards (all lists except archived) and, for each card of that project
   (or every project): find the task file whose `trello:` is the card URL; create it from `entities/_templates/task.md`
   if missing (next free `T-NNN`, `status` from the card's list, `agent` from the label / title prefix, assignee and
   reviewers from the card, goal and criteria from the description and checklist); otherwise update `status`,
   `title`, `updated`. Never delete a task file (a removed card → `status: done` or note "card archived").

## Rules
- `sync: local` tasks (from `/wakil.plan`) are changed in the file only – never create or move a Trello card for them.
  `sync: trello` tasks: move the card the same way (`--import` sets `sync: trello`).
- One card = one task file; the card URL goes in `trello:`. Names only (never emails), no secrets.
- Task ids are per project and never reused: `T-001`, `T-002`…
- Every specialist brief for a task starts with `TASK: <entity-slug>/<project|none>/<task-id>` (skill
  `delegation/write-brief`) – this is how token usage is linked to the task.

## Output
The list or the changed task (id, title, old → new status), and the Trello moves done or still to do.

## Schedulable
`--import` only (reads Trello, writes local files, never sends).

## Examples
- `/wakil.task acme website`
- `/wakil.task acme website T-004 show`
- `/wakil.task acme website T-004 status in-review`
- `/wakil.task acme none T-002 note "Draft sent to the owner for review"`
- `/wakil.task --import acme`
