---
description: Plan work as structured markdown (visible in the Wakil Desktop Kanban) AND create one Trello card per task in Proposed
argument-hint: <entity-slug> <project|none> <goal> · --from <plan-id> (publish an existing local plan to Trello)
---
# /wakil.plan.trello – Plan in markdown + Trello cards

Act as the **manager** (`.claude/agents/manager/manager.md`). Arguments: `$ARGUMENTS`

## Purpose
Same plan as `/wakil.plan` (plan file + task files shown in the Wakil Desktop Kanban), **plus** one Trello card per task
on the entity's board, so the team workflow (approvals, team boards, reviews) runs through Trello as usual.

## Arguments
| Argument | Required | Values | Default |
|---|---|---|---|
| `<entity-slug>` | yes | slug from the registry (or the focus) | focus |
| `<project>` | yes | a folder under `projects/` or `none` | focus |
| `<goal>` | yes (new plan) | free text | – |
| `--from <plan-id>` | no | publish an existing local plan (`sync: local`) to Trello instead of creating a new plan | – |

## Preconditions
- The entity has a board in `entities/registry.md` (organisation: Command Center; individual: project board) and the
  Trello connector works in this chat. Otherwise stop and propose `/wakil.plan` (local only) or `/wakil.setup-trello`.
- `entities/_templates/plan.md`, `entities/_templates/task.md`, `entities/_templates/board-spec.md` exist.

## Steps
1. **New plan**: do Steps 1–4 of `/wakil.plan` (create), with `sync: trello` on the plan and every task.
   **`--from`**: open the plan and its tasks; refuse tasks already `done`; set `sync: trello`.
2. Show the plan table and **wait for the owner's OK** before creating anything on Trello.
3. For each task, in `order`: create the card in 📥 Proposed (or 📥 Backlog on an individual board) exactly like
   `/wakil.new-task` – title `[Dev|UI/UX|Marketing|Media|Brand] …` or `[Human] <Team> – …`, standard description
   (with `Task: T-NNN` and `Plan: <plan-id>`), the acceptance-criteria checklist, existing labels (executor,
   specialist, `team : …`, `project : …`). Write the card URL in the task file (`trello:`) and add
   `- <date> – card created – manager` to its Status log.
4. Add a line to the plan's Approval & log: `- <date> – published to Trello (<n> cards) – manager`.
5. Missing labels or lists → tell the owner which to create; never invent board structure.

## Rules
- Nothing is created on Trello before the owner agrees to the plan.
- Afterwards the card is the source of truth for status: `/wakil.process` and `/wakil.task` keep the task file in sync.
- Names only on Trello (never emails); no secrets; one entity at a time.

## Output
The plan table and path, the card links, and what the owner must do next (approve cards in Trello, labels, dates).

## Schedulable
No.

## Examples
- `/wakil.plan.trello acme website Refondre la page d’accueil et ajouter la page tarifs`
- `/wakil.plan.trello acme website --from PLAN-2026-11-15-home-redesign`
