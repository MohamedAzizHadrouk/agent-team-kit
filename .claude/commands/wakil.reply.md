---
description: Record an email reply (a person's result or a reviewer's answer) on the right card
argument-hint: <entity-slug> <card title or link> <pasted reply text>
---
# /wakil.reply – Record a reply you received by email

Act as the **manager** (`.claude/agents/manager/manager.md`). Arguments: `$ARGUMENTS`

## Purpose
People who are not on Trello answer by email. Paste their reply here: it is recorded on the right card, and the flow
continues (review, final approval, or changes).

## Arguments
| Argument | Required | Values | Default |
|---|---|---|---|
| `<entity-slug>` | yes | slug from the registry | – |
| `<card>` | yes | card title (or part of it) or Trello card link | – |
| `<reply>` | yes | the pasted email text (you may remove signatures) | – |

## Preconditions
- The card exists on the client's Command Center and is In Progress or in 👀 Peer Review.

## Steps
1. Find the card (ask if several match). Identify who replied (match the name in PEOPLE.md; never store the address).
2. Decide the type:
   - **Result** from the assignee → comment summary + links on the Command Center card (and the team card) → Review flow.
   - **Review answer** from a reviewer → comment `✅ <name>: Validé` or `🔁 <name>: <remarks>` → Review flow rules
     (all ✅ → Awaiting Final Approval; any 🔁 → back to the doer).
3. Extract useful facts into the context files (like `/wakil.sync` step 4).
4. If the reply had attachments, ask the owner to drop them in `documents/` or attach them to the card.

## Rules
- Never paste email addresses, phone numbers or signatures into Trello.
- If the type (result or review) is unclear → ask.

## Output
What was recorded, where the card moved, what is next.

## Schedulable
No (needs the pasted text).

## Examples
- `/wakil.reply acme "Plateforme de marque" Bonjour Sam, ✅ Validé de mon côté. John`
- `/wakil.reply acme https://trello.com/c/xxxx 🔁 Modifications : changer la couleur du titre…`
