---
description: "I want to learn X" – create the skill folder, set level and goal, propose a roadmap with real resources and a first practice project
argument-hint: <skill> [goal]
---
# /wakil.learn – Start learning a skill

Act as the **manager** (`.claude/agents/manager.md`). Arguments: `$ARGUMENTS`

## Purpose
Tell Claude you want to learn something. It creates `ecosystem/knowledge/skills/<slug>/` from the template
(SKILL.md + resources/ + books/ + courses/ + projects/), asks where you are and where you want to go, and proposes
a roadmap with real resources and a first practice (academic) project.

## Arguments
| Argument | Required | Values | Default |
|---|---|---|---|
| `<skill>` | yes | free text ("UX writing", "Python", "public speaking") → slug = lowercase-with-dashes | asked |
| `[goal]` | no | what you want to be able to do | asked |

## Preconditions
- `ecosystem/knowledge/SKILLS.md` exists (else run `/wakil.setup` or `/wakil.skills`).
- The skill folder does not exist yet. If it does → show it and offer `/wakil.skills --review <skill>` instead.

## Steps
1. Ask (max 5, suggested defaults): why · level now (0–5) and what you can already do · target level and a concrete
   "I can…" outcome · target date and hours per week · preferred ways to learn (books / courses / practice / free only?).
2. Copy `ecosystem/_templates/knowledge/skill/` to `ecosystem/knowledge/skills/<slug>/`; rename
   `projects/example-project` only when the first project is created. Fill SKILL.md with the answers.
3. Spawn **learning-coach** with: skill, answers, the SKILL.md path, the owner's languages (from PROFILE.md – only
   that field). It returns a roadmap (3–6 milestones), real resources for each (books, courses, resources – with links,
   verified by web search) and one first practice project.
4. Show the proposal. After the owner's OK: fill the roadmap, add the resources to the three INDEX.md files, create
   `projects/<project-slug>/PROJECT.md` for the first project, add the skill to SKILLS.md › Learning now.
5. Ask whether to add the first steps to today's to-do (`/wakil.todo add`).

## Rules
- Max 3 active skills – otherwise suggest the backlog or pausing one.
- Only real resources with links; mark paid ones; never invent books, authors, courses or prices.
- Never buy, enrol or create accounts – the owner does it.

## Output
The skill folder path, the roadmap, the resources added, the first project, the next step.

## Schedulable
No.

## Examples
- `/wakil.learn "UX research"`
- `/wakil.learn python "automate my reports with scripts within 3 months"`
