---
description: Create and manage the owner's personal projects (not for a client) in ecosystem/projects/ – planned with /wakil.plan and shown in Wakil Desktop
argument-hint: add <name> [goal] · list · show <slug> · update <slug> <information> · status <slug> planning|active|paused|done
---
# /wakil.personal-project – Personal projects

Act as the **manager** (`.claude/agents/manager/manager.md`). Arguments: `$ARGUMENTS`

## Purpose
Give the owner's own projects (side projects, products in progress, learning projects, content, admin…) the same
structure as client projects – PROJECT.md, plans, tasks, assets, decisions log – but in the private personal
ecosystem, never mixed with client data. They appear in Wakil Desktop › Projets (filter "Personnels"), with their
Kanban and AI usage, and can be planned with `/wakil.plan personal <slug> <goal>` or done directly.

## Arguments
| Argument | Required | Values | Default |
|---|---|---|---|
| action | yes | `add` · `list` · `show` · `update` · `status` | `list` |
| `<name>` / `<slug>` | for all but `list` | project name (add) or its slug | – |
| `[goal]` / information | no | free text | asked |

## Preconditions
- `ecosystem/` exists (run `/wakil.setup` first) and `ecosystem/_templates/project/PROJECT.md` exists.

## Steps
**add**
1. Slug = lowercase name with dashes. If `ecosystem/projects/<slug>/` exists → stop and propose `show` / `update`.
2. Ask only what is missing (max 4 questions, each with a suggested default): goal, what "done" looks like, deadline,
   type. Use PROFILE.md only for context (time zone, languages) – never copy personal details into the project.
3. Create `ecosystem/projects/<slug>/PROJECT.md` from the template (`Client: personal`), plus empty `plans/`,
   `tasks/` and `assets/` folders. Decisions log: `- <date> – Project created – owner`.
4. If it trains a tracked skill, write `Linked skill:` with the actual skill path under `knowledge/skills/` (and mention it in that skill's SKILL.md).
5. Report the path and the next step: `/wakil.plan personal <slug> <goal>` (structured plan, no Trello) or just ask
   for the work directly.

**list** – every folder of `ecosystem/projects/`: name, status, open tasks, latest decision.
**show** – PROJECT.md summary + plans and tasks (by status).
**update** – save the information in the right section of PROJECT.md with a dated Decisions log line.
**status** – change `Status:` and log it.

## Rules
- Personal projects live only in `ecosystem/projects/` (private, git-ignored); client data never goes there and
  personal data never goes into `entities/`.
- Plans and tasks use the normal files (`plans/`, `tasks/`) and briefs start with `TASK: personal/<slug>/<T-NNN>`
  (direct requests: `Client: personal`, `Project: <slug>`), so usage is attributed to the project.
- No Trello by default: `/wakil.plan.trello` is used only if the owner names a board for this project.

## Output
The project path and summary, or the list of personal projects.

## Schedulable
`list` and `show` only.

## Examples
- `/wakil.personal-project add Wakil Desktop – visualiser mon écosystème`
- `/wakil.personal-project add Portfolio personnel, en ligne avant fin décembre`
- `/wakil.personal-project list`
- `/wakil.personal-project status portfolio-personnel active`
- `/wakil.plan personal portfolio-personnel Concevoir et publier la v1`
