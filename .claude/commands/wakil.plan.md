---
description: Plan work as structured markdown (plan file + task files) visible in the Wakil Desktop Kanban – never on Trello; then run it task by task
argument-hint: <entity-slug> <project|none> <goal> · approve <plan-id|task-ids> · run <plan-id|T-NNN|next|approved> · show [plan-id]
---
# /wakil.plan – Local plan (markdown only, no Trello)

Act as the **manager** (`.claude/agents/manager/manager.md`). Arguments: `$ARGUMENTS`

## Purpose
Break a request into a clear, ordered plan **without touching Trello**, even when the entity has boards. The plan is
a markdown plan file + one task file per step; Wakil Desktop shows it as a Kanban (filter by plan, phases, order,
dependencies, agent). The owner approves, then the agents execute it with `/wakil.plan run`.
The three modes: plain request = do it now (no plan) · `/wakil.plan` = local plan · `/wakil.plan.trello` = plan + Trello.

## Arguments
| Argument | Required | Values | Default |
|---|---|---|---|
| `<entity-slug>` | yes | slug from `entities/` (or the focus) | focus |
| `<project>` | yes | a folder under `projects/` or `none` | focus |
| `<goal>` | yes (create) | free text: what to achieve, constraints, deadline | – |
| `approve <plan-id \| T-…>` | no | owner approves the plan or some tasks | – |
| `run <plan-id \| T-NNN \| next \| approved>` | no | execute approved tasks (in order, respecting dependencies) | `next` |
| `show [plan-id]` | no | list plans / show one with task statuses | latest plan |

## Preconditions
- `entities/_templates/plan.md` and `entities/_templates/task.md` exist.
- For a project: `projects/<project>/PROJECT.md` exists (else propose `/wakil.new-project`).

## Steps
**Create (default)**
1. Read ENTITY, POSITION, RULES, BRAND, the PROJECT.md (if any) – only this entity's files. Missing facts → ask
   (max 5 questions, each with a suggested default) before planning.
2. Design the plan: 1–4 **phases**, small tasks (one task = one reviewable deliverable), **order**, **depends**,
   executor (🤖 specialist from `.claude/agents/` or 👤 person from PEOPLE.md – names only), estimate S/M/L,
   3–6 verifiable acceptance criteria each. First tasks collect inputs / validate the base.
3. Write `plans/PLAN-<YYYY-MM-DD>-<slug>.md` from `entities/_templates/plan.md` (`status: proposed`, `sync: local`)
   in `projects/<project>/` (or `entities/<entity>/plans/` for `none`).
4. Write one file per task in `tasks/` from `entities/_templates/task.md`: next free `T-NNN`, `status: proposed`,
   `sync: local`, `trello: -`, `plan: <plan-id>`, `phase`, `order`, `depends`, `agent` / `assignee`, `priority`,
   `estimate`, goal, deliverable, acceptance criteria, Status log `- <date> – proposed – manager`.
5. Show the plan as a table (order · task · executor · depends · estimate) and say: "visible in Wakil Desktop ›
   Projets › <project> › Kanban. Approve with `/wakil.plan approve <plan-id>`".
6. **Never** create or move a Trello card, label or checklist in this command.

**approve** – only when the owner says so: set `status: approved` on the plan and the chosen tasks (all if a plan id),
add `- <date> – approved – owner` to each Status log and to the plan's Approval & log.

**run** – execute approved tasks, lowest `order` first, skipping a task whose `depends` are not `done`:
1. Set the task to `in-progress` (Status log). Agent task → brief the specialist (skill `delegation/write-brief`)
   with first line `TASK: <entity>/<project>/<T-NNN>`; human task → tell the owner who must do what (no email
   unless asked). 2. Check the result against each acceptance criterion (manager.md › Step 4). 3. Pass → `awaiting-approval`
   with results in **Results & links**; fail → `needs-changes` and re-brief once, then ask the owner.
4. `next` runs one task; `approved` runs every runnable approved task (max 5 per run). The owner moves tasks to `done`
   (`/wakil.task … status done` or "ok, done").
Approval gates (CLAUDE.md rule 4) are confirmed in chat and written in the Status log.

**show** – list plans (id, status, tasks done/total) or one plan with its tasks by phase.

## Rules
- Local plans never go to Trello – not here, not in `/wakil.process`. To publish one later: `/wakil.plan.trello <entity> <project> --from <plan-id>`.
- Task ids are per project and never reused. Never delete a task file: cancelled → `status: done` + note "cancelled".
- One entity at a time; no other client's data in any file or brief.

## Output
The plan table and its path, or the tasks approved / run with their new status and results.

## Schedulable
`show` only.

## Examples
- `/wakil.plan acme website Refondre la page d’accueil et ajouter la page tarifs`
- `/wakil.plan acme none Préparer le dossier de candidature au salon`
- `/wakil.plan approve PLAN-2026-11-15-home-redesign`
- `/wakil.plan run next`
- `/wakil.plan run approved`
- `/wakil.plan show`
