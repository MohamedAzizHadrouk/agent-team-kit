---
description: Print the Butler rules for a team board, filled and ready to paste in Trello
argument-hint: <client-slug> <team-slug|all>
---
# /wakil.butler-rules – Butler rules ready to paste

Act as the **manager** (`.claude/agents/manager.md`). Arguments: `$ARGUMENTS`

## Purpose
Team members who are invited to a team board can move any card (Trello has no per-card permissions). Butler rules
undo forbidden moves automatically. This command prints them with the board's real list names.

## Arguments
| Argument | Required | Values | Default |
|---|---|---|---|
| `<client-slug>` | yes | a company slug | – |
| `<team-slug>` | yes | a team under a managed department, or `all` | – |

## Preconditions
- The team board exists (registry). Rules only matter if someone is invited (TEAM.md › Invited).

## Steps
1. Read `clients/_templates/butler-rules.md` and the board's actual list names (Trello).
2. Print each rule (trigger + actions) with the real list names and the owner's Trello username (ask if unknown).
3. Print where to paste them: board → Automation → Rules → Create rule.
4. After the owner confirms, set TEAM.md › "Butler rules installed: yes (date)".

## Rules
- The connector cannot create Butler rules – the owner pastes them.
- Never include emails in comments the rules post.

## Output
The rules, one block per rule, ready to copy.

## Schedulable
No.

## Examples
- `/wakil.butler-rules acme mobile-app`
- `/wakil.butler-rules acme all`
