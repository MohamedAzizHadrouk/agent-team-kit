---
description: Show or update what Claude knows about you (ecosystem/PROFILE.md)
argument-hint: [--show] [section] [new information]
---
# /wakil.profile – Your profile

Act as the **manager** (`.claude/agents/manager.md`). Arguments: `$ARGUMENTS`

## Purpose
Keep `ecosystem/PROFILE.md` true over time: who you are, your work, goals, life areas and how Claude should work with you.

## Arguments
| Argument | Required | Values | Default |
|---|---|---|---|
| `--show` | no | print a short summary of the profile, change nothing | – |
| `[section]` | no | identity · work · areas · goals · values · working-with-me | all sections |
| `[new information]` | no | free text ("I now work 9–17", "new goal: …") | none → ask about the section |

## Preconditions
- `ecosystem/PROFILE.md` exists (else run `/wakil.setup`).

## Steps
1. `--show` → summarise each section in 1–2 lines, list the remaining `TODO`s, stop.
2. With new information → find the right field, show old → new, apply, log it (date – change – "profile").
3. With only a section → ask that section's questions from `ecosystem/_templates/setup-questionnaire.md`
   (current value shown as the suggested default).
4. A new company, association, club or client mentioned → suggest `/wakil.add-entity`. A new skill to learn → suggest `/wakil.learn`.

## Rules
- Never invent; never store ID numbers, passwords, bank or health details. Private file – never commit it.
- Contradiction with an earlier answer → ask which one is true, then log it.

## Output
What changed (old → new), remaining TODOs, suggested next command.

## Schedulable
No.

## Examples
- `/wakil.profile --show`
- `/wakil.profile goals`
- `/wakil.profile working-with-me "Shorter answers, and always in French"`
