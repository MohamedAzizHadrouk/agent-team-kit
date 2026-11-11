---
description: Interview about your skills, or show your skills, learning progress and next steps (knowledge/SKILLS.md)
argument-hint: [--show] [--review] [skill]
---
# /wakil.skills – Your skills

Act as the **manager** (`.claude/agents/manager.md`). Arguments: `$ARGUMENTS`

## Purpose
Know what the owner can do and what they want to learn: fill and maintain `ecosystem/knowledge/SKILLS.md`
(skills I have, learning now, backlog) and show progress of the skills being learned.

## Arguments
| Argument | Required | Values | Default |
|---|---|---|---|
| `--show` | no | read-only summary of SKILLS.md + next step of each active skill | – |
| `--review` | no | progress review of active skills (delegated to learning-coach) | – |
| `[skill]` | no | a skill slug – limit show/review to it | all |
| none | – | interview mode | – |

## Preconditions
- `ecosystem/knowledge/SKILLS.md` exists (else copy it from `ecosystem/_templates/knowledge/` first).

## Steps
1. **Interview mode** (3–5 questions at a time, suggested defaults):
   - Your main skills (work, technical, creative, languages, soft skills)? Level 0–5 for each (scale in SKILLS.md)?
   - What do you want to learn or improve? Why? Priority? By when? How many hours a week?
   - How do you like to learn (books, video courses, practice projects, mentor)?
   Fill the three tables; log the change.
2. For each skill to learn **now** (max 3 active – suggest moving the rest to the backlog): offer `/wakil.learn <skill>`.
3. `--show` → table summary + each active skill's next roadmap step from its SKILL.md. Change nothing.
4. `--review` → spawn **learning-coach** with the paths of SKILLS.md and the active SKILL.md files (no other
   personal file). Relay its report: progress vs target date, what to do next, roadmap changes it proposes.
   Apply roadmap changes only after the owner says yes; log them in SKILL.md.

## Rules
- Levels are the owner's own assessment – never raise a level without the owner's OK.
- Never invent courses, certificates or achievements.

## Output
The skills tables (or the review), what changed, suggested `/wakil.learn` commands.

## Schedulable
`--show` and `--review` only (read-only; review proposals wait for the owner). Plain interview mode: no.

## Examples
- `/wakil.skills`
- `/wakil.skills --show`
- `/wakil.skills --review ui-design`
