---
description: Add a department (committee, section) to an organisation – company, association or club (DEPARTMENT.md + ORG.md)
argument-hint: <entity-slug> <department name> [managed|not-managed]
---
# /wakil.add-department – Add a department

Act as the **manager** (`.claude/agents/manager.md`). Arguments: `$ARGUMENTS`

## Purpose
Record a department (committee / pole / section) of an organisation (company, association, club). Only **managed** departments (managed by the owner – see POSITION.md) get teams,
team boards and tasks; the others are kept for context (people, reviewers).

## Arguments
| Argument | Required | Values | Default |
|---|---|---|---|
| `<entity-slug>` | yes | an organisation slug (company, association, club) | – |
| `<department name>` | yes | free text | – |
| `[managed]` | no | `managed` or `not-managed` | `not-managed` |

## Preconditions
- The entity is an organisation (`Type: company | association | club`). No department with the same slug exists.

## Steps
1. Copy `entities/_templates/organization/departments/example-department/DEPARTMENT.md` to
   `entities/<client>/departments/<slug>/DEPARTMENT.md` (without the example team).
2. Fill name, managed flag, mission/head if given (head = a name from PEOPLE.md), else `TODO`.
3. Update ORG.md (structure + departments table) and, if managed, POSITION.md › authority.
4. Log the change (ORG.md › Changes and ENTITY.md › Decisions log).
5. If managed: offer `/wakil.add-team` for its teams.

## Rules
- Not-managed departments: no boards, no cards, ever.
- Never invent missions or heads.

## Output
New file path, ORG.md lines changed, next suggested command.

## Schedulable
No.

## Examples
- `/wakil.add-department acme "Customer Support" not-managed`
- `/wakil.add-department acme "Product" managed`
