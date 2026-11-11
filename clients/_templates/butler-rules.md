# Butler rules for a Human Team Board (owner pastes them once per team board)

Where: open the team board → **Automation** (Butler, top-right) → **Rules** → **Create rule**.
Replace `@OWNER` with your Trello username and the list names if you changed them.
"by anyone except me" = anyone except the person who creates the rule (you).

The Manager acts with YOUR Trello account, so its moves count as "me" and are not reverted.

## Rule 1 – Only the owner/Manager can put cards in Done
Trigger: `when a card is moved into list "🏁 Done" by anyone except me`
Actions:
- `move the card to list "🔍 Ready for Review"`
- `post comment "⚠️ Only the owner can move a card to Done. Card moved back to Ready for Review. @OWNER"`

## Rule 2 – Only the owner/Manager can put cards in Needs Changes
Trigger: `when a card is moved into list "🔁 Needs Changes" by anyone except me`
Actions:
- `move the card to list "🔍 Ready for Review"`
- `post comment "⚠️ Only the owner can request changes. Card moved back. @OWNER"`

## Rule 3 – Only the owner/Manager can put cards in To Do
Trigger: `when a card is moved into list "📋 To Do" by anyone except me`
Actions:
- `move the card to list "🔄 In Progress"`
- `post comment "⚠️ Cards cannot be moved back to To Do. @OWNER"`

## Rule 4 – Team members do not create cards
Trigger: `when a card is added to the board by anyone except me`
Actions:
- `archive the card`
- `post comment "⚠️ New tasks are created by the owner on the Command Center. Card archived. @OWNER"`
(If you prefer to keep their ideas, replace "archive the card" with a move to a list you create called "💡 Suggestions".)

## Rule 5 – Members are assigned by the owner only
Trigger: `when a member is added to a card by anyone except me`
Actions:
- `post comment "⚠️ Only the owner assigns people. @OWNER please check."`
(Butler cannot reliably remove the added member; the Manager audit flags it too.)

## What Butler cannot check (the Manager audit covers it)
- A member moving **someone else's** card (or a card with no assignee).
- A move that skips a step (e.g. To Do → Ready for Review).
- Edits to title, description or checklist of a card.
The audit reverts the move when possible and comments tagging the person and the owner.

## Free plan
Butler runs are limited per month on the free plan. If the quota runs out, rules stop until next month;
the Manager audit still runs on every board processing.
