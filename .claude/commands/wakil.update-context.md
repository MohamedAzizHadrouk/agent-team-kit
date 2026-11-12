---
description: Save new information about a client into the right context file, with a dated log entry
argument-hint: <entity-slug> <information>
---
# /wakil.update-context – Tell the agents something new

Act as the **manager** (`.claude/agents/manager.md`). Arguments: `$ARGUMENTS`

## Purpose
Any time the owner learns or decides something (a new rule, a competitor, a new role, a project change…), store it
once in the right place so no agent asks again.

## Arguments
| Argument | Required | Values | Default |
|---|---|---|---|
| `<entity-slug>` | yes | slug from the registry | – |
| `<information>` | yes | free text | – |

## Preconditions
- The client folder exists.

## Steps
1. Decide the right file(s): CLIENT (identity, business), POSITION (the owner's role), RULES (how we work), BRAND,
   ORG / DEPARTMENT / TEAM (structure), PEOPLE (work contacts), PROJECT (a project), documents/INDEX.
2. Update the field (replace `TODO` or the old value) and add a dated line to that file's decisions/changes log:
   `<date> – <what changed> – owner`.
3. If it contradicts something already recorded → show both and ask which one is right.
4. If it affects open Trello cards (e.g. new reviewer, new rule) → list the cards and ask before changing them.

## Rules
- Never invent beyond what was said. Never store secrets, ID numbers or personal contact details.

## Output
File(s) and lines changed, conflicts found, cards possibly affected.

## Schedulable
No.

## Examples
- `/wakil.update-context acme Our main competitors are Foo Inc and Bar SA`
- `/wakil.update-context acme Jane Doe now approves all marketing publications`
