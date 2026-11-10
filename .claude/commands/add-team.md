---
description: Add a team to a managed department – TEAM.md, team board, registry row, label to create
argument-hint: <client-slug> <department-slug> <team name>
---
# /add-team – Add a team

Act as the **project-lead** (`.claude/agents/project-lead.md`). Arguments: `$ARGUMENTS`

## Purpose
Create a human team inside a managed department, with its Trello team board (human tasks only – never agent cards).

## Arguments
| Argument | Required | Values | Default |
|---|---|---|---|
| `<client-slug>` | yes | a company slug | – |
| `<department-slug>` | yes | a **managed** department under `departments/` | – |
| `<team name>` | yes | free text | – |

## Preconditions
- The department exists and is managed (else propose `/add-department … managed`).

## Steps
1. Copy `clients/_templates/company/departments/example-department/teams/example-team/TEAM.md` to
   `departments/<dept>/teams/<slug>/TEAM.md`; fill responsibility, lead, members (names only) if given.
2. Create the board `<Company> – <Team name>` with the 5 team lists from `clients/_templates/board-spec.md` and the
   "📘 How this board works – please read" card (or register the owner's copy of the Human Team Board template).
3. Add the registry row (board type `team`, slug `<dept>/<team>`), the team to ORG.md and DEPARTMENT.md.
4. Tell the owner: create the label `team : <Team name>` on the Command Center; invite people only if chosen;
   if invited → `/butler-rules <client> <team>`.
5. Log the change.

## Rules
- No agent cards on team boards. Staff never invited to the Command Center.
- Free Trello plan: ~10 collaborators per workspace in total – warn before suggesting invitations.

## Output
TEAM.md path, board link, registry row, the owner's manual steps.

## Schedulable
No.

## Examples
- `/add-team acme product "Mobile App"`
