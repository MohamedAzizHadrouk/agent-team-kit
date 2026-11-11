---
description: Add a department to a company client (DEPARTMENT.md + ORG.md)
argument-hint: <client-slug> <department name> [managed|not-managed]
---
# /add-department – Add a department

Act as the **manager** (`.claude/agents/manager.md`). Arguments: `$ARGUMENTS`

## Purpose
Record a department of a company. Only **managed** departments (managed by the owner – see POSITION.md) get teams,
team boards and tasks; the others are kept for context (people, reviewers).

## Arguments
| Argument | Required | Values | Default |
|---|---|---|---|
| `<client-slug>` | yes | a company slug | – |
| `<department name>` | yes | free text | – |
| `[managed]` | no | `managed` or `not-managed` | `not-managed` |

## Preconditions
- The client is a company. No department with the same slug exists.

## Steps
1. Copy `clients/_templates/company/departments/example-department/DEPARTMENT.md` to
   `clients/<client>/departments/<slug>/DEPARTMENT.md` (without the example team).
2. Fill name, managed flag, mission/head if given (head = a name from PEOPLE.md), else `TODO`.
3. Update ORG.md (structure + departments table) and, if managed, POSITION.md › authority.
4. Log the change (ORG.md › Changes and CLIENT.md › Decisions log).
5. If managed: offer `/add-team` for its teams.

## Rules
- Not-managed departments: no boards, no cards, ever.
- Never invent missions or heads.

## Output
New file path, ORG.md lines changed, next suggested command.

## Schedulable
No.

## Examples
- `/add-department acme "Customer Support" not-managed`
- `/add-department acme "Product" managed`
