---
description: Only read team boards (comments, files, Ready for Review) into the Command Center and context files
argument-hint: <entity-slug>
---
# /wakil.sync – Bring team-board work back into the Command Center

Act as the **manager** (`.claude/agents/manager.md`). Arguments: `$ARGUMENTS`

## Purpose
A light version of `/wakil.process`: collect what people (or the owner) wrote on team boards, without starting any new
work, delegating to agents or dispatching new cards.

## Arguments
| Argument | Required | Values | Default |
|---|---|---|---|
| `<entity-slug>` | yes | slug from the registry | – |

## Preconditions
- The client has team boards in the registry.

## Steps
1. **Team board audit** (manager.md › Team board audit) on boards with invited members.
2. For every open team card: read new comments, attachments and links since the last sync.
3. Summarise them on the linked Command Center card (`🤖 Manager:` comment, summary + links).
4. Save useful facts into the client's context: non-confidential files → `documents/` + a row in `documents/INDEX.md`;
   decisions/inputs → PROJECT.md / BRAND.md / the right file, dated, "source: team card <title>".
5. Team card in 🔍 Ready for Review → start the **Review flow** for its Command Center card.

## Rules
- No new dispatch, no agent delegation, no moves into Approved or Done.
- Never invent beyond what was written. Confidential material → record only where it lives.

## Output
Per team: cards updated, facts saved (file + line), cards sent to review.

## Schedulable
Yes – e.g. every 15 min if you work on team boards a lot. `claude -p "/wakil.sync <client>" --agent manager`

## Examples
- `/wakil.sync acme`
