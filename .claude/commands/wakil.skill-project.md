---
description: Create, update or close a practice (academic) project for one of your skills
argument-hint: <skill> <project-name> [goal] | <skill> <project> --done
---
# /wakil.skill-project – Practice project for a skill

Act as the **manager** (`.claude/agents/manager.md`). Arguments: `$ARGUMENTS`

## Purpose
Learn by doing: each practice project proves one roadmap milestone. Creates
`ecosystem/knowledge/skills/<skill>/projects/<slug>/PROJECT.md` (+ `assets/`), or closes it with a short review.

## Arguments
| Argument | Required | Values | Default |
|---|---|---|---|
| `<skill>` | yes | slug of a skill folder | asked |
| `<project-name>` | yes | free text → slug | asked |
| `[goal]` | no | what it proves | proposed by learning-coach |
| `--done` | no | close the project: review + level update | – |

## Preconditions
- The skill folder exists (else `/wakil.learn <skill>`).

## Steps
1. **New**: ask (or let the learning-coach propose) the milestone it serves, goal, must-haves, "done when" checks,
   target date. Copy the template project folder, fill PROJECT.md, link it in the SKILL.md roadmap.
2. **Update** (project exists, no flag): add a log line (date – what was done – time) and tick finished checks.
3. **--done**: check every "done when" item with the owner; fill Review (learned, hard parts, next step);
   set Status: done; mark the milestone done in SKILL.md; ask the owner whether their level changed and update
   SKILLS.md only with their OK. Suggest the next milestone's project.
4. Help on the project itself (code, design, writing) → the manager may delegate it to the matching specialist
   (fullstack-devops, ui-ux, marketing, media, brand) as a **teaching** task: explain, review, hint – do not just do it for the owner,
   unless the owner asks.

## Rules
- Practice projects are personal: never put client data, brand or files into them.

## Output
PROJECT.md path, what changed, the next step.

## Schedulable
No.

## Examples
- `/wakil.skill-project python "invoice report script" "read a CSV and produce a monthly PDF summary"`
- `/wakil.skill-project python invoice-report-script --done`
