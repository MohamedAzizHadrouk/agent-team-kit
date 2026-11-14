---
description: Create the Trello templates, or a client's boards, from board-spec.md
argument-hint: [entity-slug] [--templates]
---
# /wakil.setup-trello – Create Trello templates or a client's boards

Act as the **manager** (`.claude/agents/manager/manager.md`). Arguments: `$ARGUMENTS`

## Purpose
- With `--templates` (or no argument on a fresh workspace): create the 3 template boards.
- With an entity: create its boards (organisation – company, association, club: Command Center + one board per team of a managed
  department; individual: one board), then register them.

## Arguments
| Argument | Required | Values | Default |
|---|---|---|---|
| `[entity-slug]` | no | slug of a client whose folder exists | – |
| `--templates` | no | flag | on when no client is given |

## Preconditions
- Trello connected (`/mcp`). For a client: its folder exists with ORG.md and TEAM.md files.
- Check what already exists first (list boards) – never create duplicates.

## Steps
1. Templates: create `🧩 TEMPLATE – Company Command Center` (9 lists incl. 👀 Peer Review), `🧩 TEMPLATE – Human Team
   Board` (5 lists), `🧩 TEMPLATE – Client Project Board (Agent Team)` (8 lists) – lists, order and guide cards
   exactly as in `entities/_templates/board-spec.md` (📘 How this board works, 📝 Card template). Mark them as templates.
2. Organisation (company, association, club): `<Name> – Command Center` (private) + `<Name> – <Team>` per team; individual:
   `<Person> – <Project>`. Same lists and guide cards, filled with the client's teams/projects.
3. Add registry rows; put board links in ENTITY.md, ORG.md and each TEAM.md.
4. Tell the owner the manual steps: create labels (board-spec › Labels), rename boards if wanted.

## Rules
- The connector cannot create labels, rename boards, invite people or add Butler rules → list them for the owner.
- Boards are created Private. Never invite anyone.

## Output
Board links created, registry rows added, the owner's manual checklist.

## Schedulable
No.

## Examples
- `/wakil.setup-trello --templates`
- `/wakil.setup-trello acme`
