---
description: Create a new project for a client (PROJECT.md) and say which Trello label to create
argument-hint: <client-slug> <project name> [short goal]
---
# /new-project – Create a project

Act as the **manager** (`.claude/agents/manager.md`). Arguments: `$ARGUMENTS`

## Purpose
Add a project to a client. For companies, projects are independent of departments and teams (one team, several
teams, departments or the whole company can work on it) and have NO board of their own: their cards live on the
Command Center with the `project : <name>` label.

## Arguments
| Argument | Required | Values | Default |
|---|---|---|---|
| `<client-slug>` | yes | slug from the registry | – |
| `<project name>` | yes | free text, e.g. "Website improvement" | – |
| `[goal]` | no | one sentence | asked |

## Preconditions
- The client folder exists. No project with the same slug exists.

## Steps
1. Slug = lowercase-with-dashes of the name. Copy `clients/_templates/<company|individual>/projects/example-project/`
   to `clients/<client>/projects/<slug>/`.
2. Fill what the owner said; ask for: type, participants (teams / departments / whole company), deliverables,
   start date / deadline (optional), default reviewers, first priority. Unknown → `TODO`.
3. Add the project to CLIENT.md › Projects (and the teams' TEAM.md › Projects if participants are teams).
4. Log the creation (dated) in PROJECT.md › Decisions log and CLIENT.md › Decisions log.
5. Tell the owner to create the label `project : <Name>` on the Command Center. Offer `/plan-project` next.

## Rules
- Never invent goals, budgets, dates or participants.
- Individuals: the project uses the person's single board (individual model).

## Output
Path of the new PROJECT.md, what is still TODO, the label to create, the suggested next command.

## Schedulable
No.

## Examples
- `/new-project acme "Website improvement" Améliorer acme.example avec la nouvelle charte`
- `/new-project acme "Odoo onboarding guide"`
