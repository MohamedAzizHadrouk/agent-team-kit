---
description: Add or update people in a client's PEOPLE.md (work contacts only)
argument-hint: <client-slug> + pasted list (name, role, department, team, work email)
---
# /add-people – Add or update people

Act as the **project-lead** (`.claude/agents/project-lead.md`). Arguments: `$ARGUMENTS`

## Purpose
Keep the client's people list up to date, so tasks and reviews can be assigned by name and email drafts reach the
right person.

## Arguments
| Argument | Required | Values | Default |
|---|---|---|---|
| `<client-slug>` | yes | slug from the registry | – |
| `<list>` | yes | pasted lines in any format: name, role, department, team, work email | – |

## Preconditions
- `clients/<client>/PEOPLE.md` exists (else create it from the template).

## Steps
1. Parse each line. Match existing people by name (update) or add a new row.
2. Department / team: only if stated or obvious from the job title; otherwise `TODO`. Check they exist in ORG.md.
3. Columns: Name · Role · Department · Team · Work email · Trello username (`none (not invited)` unless known) ·
   Can be assignee · Can be reviewer.
4. If someone leads a team or department, update TEAM.md / DEPARTMENT.md / ORG.md (names only).
5. Log the change in PEOPLE.md › Changes (dated).

## Rules
- WORK contacts only. Refuse and drop: personal emails, phone numbers, addresses, ID numbers, salaries, health/family info.
- Never invent an email address. Ambiguous name → ask.
- PEOPLE.md is private (git-ignored); never copy emails to Trello or to specialist agents.

## Output
Added / updated / skipped rows (names only), and what is still TODO.

## Schedulable
No.

## Examples
- `/add-people acme` then paste: `Jane Doe – Head of Sales – Sales – jane.doe@acme.example`
