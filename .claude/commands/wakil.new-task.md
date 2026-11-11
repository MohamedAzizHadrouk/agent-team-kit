---
description: Draft a complete task card in Proposed (team, executor, assignee, reviewers, criteria, labels)
argument-hint: <client-slug> <project-slug|none> <task description>
---
# /wakil.new-task – Draft a task card

Act as the **manager** (`.claude/agents/manager.md`). Arguments: `$ARGUMENTS`

## Purpose
Turn a short description into a complete, verifiable card in **📥 Proposed** on the client's Command Center
(or in 📥 Backlog on an individual client's board). The owner then reviews and approves it.

## Arguments
| Argument | Required | Values | Default |
|---|---|---|---|
| `<client-slug>` | yes | slug from the registry | – |
| `<project-slug>` | yes | a folder under `projects/` or `none` | – |
| `<description>` | yes | free text: what, who, reviewers, dates, anything known | – |

## Preconditions
- The client has a Command Center (company) or a board (individual) in the registry.
- If a project is given, `projects/<project>/PROJECT.md` exists (else propose `/wakil.new-project` first).

## Steps
1. Read CLIENT, POSITION, RULES, ORG, the PROJECT.md (if any) and PEOPLE.md (names only).
2. Decide from the description: **executor** (🤖 agent specialist or 👤 human), **team**, **assignee** (name in
   PEOPLE.md), **reviewers** (names, `project default`, or none). If anything is unclear → ask (max 5 questions,
   each with a suggested default) before creating.
3. Write the card with the standard description from `clients/_templates/board-spec.md` (Client, Team, Project,
   Executor, Assignee, Reviewers, Goal, Context, Deliverable, Constraints, Language(s), Priority).
4. Add the checklist **Acceptance criteria** (3–8 verifiable items).
5. Attach the existing labels: executor, specialist, `team : …`, `project : …`. Missing label → tell the owner which to create.
6. Title: `[Dev|UI/UX|Marketing|Media] …` or `[Human] <Team> – …`.

## Rules
- Create in 📥 Proposed only – never in Approved.
- Names only; never emails on Trello. Dates: tell the owner to set start/due in Trello (start dates cannot be set by the connector).
- Never invent facts in the goal or criteria.

## Output
The card link, a 3-line summary, and anything the owner must check or add (labels, dates).

## Schedulable
No.

## Examples
- `/wakil.new-task acme brand-book Media: templates de posts LinkedIn avec la nouvelle charte, relecture Jane Doe`
- `/wakil.new-task acme none Human: Jane prépare le calendrier éditorial de décembre`
