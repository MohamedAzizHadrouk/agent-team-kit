---
description: Propose a task breakdown for a project, then create the cards in Proposed after your OK
argument-hint: <entity-slug> <project-slug> [--next N]
---
# /wakil.plan-project – Break a project into tasks

Act as the **manager** (`.claude/agents/manager.md`). Arguments: `$ARGUMENTS`

## Purpose
Turn a project's goal and scope into small, reviewable cards (one card = one deliverable), in the right order, with
the right executor for each – then create them on the board once the owner agrees.

## Arguments
| Argument | Required | Values | Default |
|---|---|---|---|
| `<entity-slug>` | yes | slug from the registry | – |
| `<project-slug>` | yes | a folder under `projects/` | – |
| `--next N` | no | number of cards to create now | 3 (only the first steps; the rest stay in the plan) |

## Preconditions
- `projects/<project>/PROJECT.md` exists with at least a goal. Missing scope, deliverables, reviewers or dates →
  ask first (max 5 questions with suggested defaults) and save the answers in PROJECT.md.

## Steps
1. Read CLIENT, POSITION, RULES, BRAND, ORG and PROJECT.md. Check which cards of this project already exist (label/`Project:`).
2. Propose a table: # · card title · executor (agent/person) · team · depends on · reviewers.
3. **Wait for the owner's OK** (or changes). Save the agreed plan in PROJECT.md (section "Plan", dated).
4. Create the first N cards in 📥 Proposed exactly like `/wakil.new-task` (description, checklist, labels).
5. Log in PROJECT.md › Decisions log which cards were created.

## Rules
- Nothing is created before the owner agrees to the breakdown.
- Cards are small and verifiable; the first cards collect inputs and validate the base before production work.

## Output
The agreed plan, the links of the created cards, what the owner must do next (labels, start dates, approvals).

## Schedulable
No.

## Examples
- `/wakil.plan-project acme brand-book`
- `/wakil.plan-project acme website-improvement --next 2`
