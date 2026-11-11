# Trello board spec – 3 board types

| Client type | Boards |
|---|---|
| **Company** (moral person) | 1 × **Command Center** (private: owner + agents) + 1 × **Team board** per human team |
| **Individual** (physical person) | 1 × **Individual client board** (unchanged single-board model) |

Trello templates in the owner's workspace:
- `🧩 TEMPLATE – Company Command Center`
- `🧩 TEMPLATE – Human Team Board`
- `🧩 TEMPLATE – Client Project Board (Agent Team)` → used for **individual** clients

To start a board: open the template in Trello → ••• → "Copy board" (or "Create board from template"), rename it,
then tell the Manager the board URL so it is added to `clients/registry.md`.
The Manager can also create a board itself (it creates the lists; you then create the labels in Trello).

## Limits of the Trello connector (tell the owner when relevant)
It CAN: create boards, lists, cards, checklists, comments; move / archive cards and lists; attach existing labels; read activity.
It CANNOT: create workspaces, create/rename labels, rename boards, **assign members to cards**, invite people, create Butler rules.
→ The owner does those few clicks in the Trello UI.

---

## 1. Company Command Center  —  `<Company> – Command Center`
Visibility: **Private**. Members: the owner only (agents act through the owner's Trello connection). Never invite staff.
It holds **every** task of the company – agent tasks AND human tasks – and is the **only place where the owner approves**.

| # | List | Who moves cards INTO it |
|---|---|---|
| 1 | 📥 Proposed | Owner (or Manager drafting a card for the owner) |
| 2 | ✅ Approved – Ready | **Owner only** = start gate |
| 3 | 🔄 In Progress | Manager |
| 4 | 🔍 In Review | Manager (reviews agent work) |
| 5 | 🔁 Needs Changes | Owner / Manager |
| 5b | 👀 Peer Review | Manager – only tasks that have reviewers; review emails drafted |
| 6 | 🛑 Awaiting Final Approval | Manager – EVERY finished task (agent or human) stops here, after reviewers |
| 7 | ❓ Blocked – Needs Info | Manager |
| 8 | 🏁 Done | **Owner only** = final sign-off |

### Labels (owner creates them in Trello)
- Executor: `🤖 Agent` (any colour) · `👤 Human` (sky)
- Specialist (agent cards): blue = Dev · purple = UI/UX · green = Marketing · orange = Media
- Status: red = Urgent · yellow = Needs Info
- One label per team, named `team : <Team name>` (any free colour).
- One label per project, named `project : <Project name>` (any free colour) – filter by it to see a project across all teams.
- Team and project labels are per company: never keep them on the template board.

### People and notifications
- People are selected by **name** on the card (`Assignee:`, `Reviewers:`), matched to the client's `PEOPLE.md`.
- Nobody needs to be on Trello: people who are not invited are notified by **email drafts** prepared in the owner's
  Outlook (`tools/outlook-draft.ps1`, texts in `email-templates.md`). The owner clicks Send.
- Emails are never written on Trello cards – names only.

### Card title
- Agent: `[Dev]`, `[UI/UX]`, `[Marketing]`, `[Media]` + short task name
- Human: `[Human] <Team> – short task name`

### Card description (copy from the "📝 Card template" card)
```
Client: <client-slug>
Team: <team-slug>                         (who does it)
Project: <project-slug> | none            (optional)
Executor: Agent:<ui-ux|fullstack-devops|marketing|media> | Human
Assignee: <Name from PEOPLE.md>           (human tasks)
Reviewers: <Name>, <Name> | none | project default   (optional, one or more)
Goal:
Context / links:
Deliverable:
Constraints:
Language(s):
Priority:
Team card: (filled by the Manager – every human task)
Emails: (filled by the Manager – drafts prepared)
```
+ a checklist **Acceptance criteria** (verifiable items).
+ Trello **start date** and/or **due date** on the card (both optional).

---

## 2. Human Team Board  —  `<Company> – <Team name>`
Visibility: **Private**. Members: the owner (Admin) + the team members the owner CHOSE to invite (may be nobody).
Invite each person ONLY to their own team board → teams never see each other's work.
**Every approved human task of the team gets a copy here** (in 📋 To Do), even if nobody is invited: the owner can
open the team board, work on the card and post results (comments, files, links). The Manager reads those
comments every run, copies a summary to the Command Center card and saves the useful facts into the client's
context files. People who are not invited are notified by email drafts.
**No agent cards ever go on a team board**, and agent work is never mentioned there.

| List | Who may move cards INTO it |
|---|---|
| 📋 To Do | Manager only (posts tasks the owner approved on the Command Center) |
| 🔄 In Progress | The card's assignee (from To Do or Needs Changes) |
| 🔍 Ready for Review | The card's assignee (from In Progress) |
| 🔁 Needs Changes | Manager only (applies the owner's decision) |
| 🏁 Done | Manager only (applies the owner's decision) |

Team members must NOT: create cards, assign/unassign members, move another person's card, move a card into
To Do / Needs Changes / Done, or archive cards. Questions and progress go in **comments**.

Enforcement (Trello cannot block moves for normal members on any plan → we undo and flag):
1. **Butler rules** on each team board – see `butler-rules.md` (the owner pastes them once).
2. **Manager audit** on every run – reads the board activity, reverts forbidden moves and comments tagging the person.

### Labels
red = Urgent only (optional). No specialist labels, no agent labels.

### Card description (written by the Manager)
```
Client: <client-slug> · Team: <team-slug> · Project: <project-slug or none>
Assignee: @<trello-username>
Goal:
Deliverable:
Deadline:
How to work on this card: move it To Do → In Progress → Ready for Review. Comment your result (links/files).
Do not move it anywhere else – the owner decides Done / Needs Changes.
```
+ checklist **Acceptance criteria** (copied from the Command Center card).

---

## 3. Individual client board  —  `<Person> – <Project>`
Unchanged single-board model (lists in this order):
📥 Backlog → ✅ Ready → 🔄 In Progress → 🔍 In Review → 🔁 Needs Changes → 🛑 Awaiting Human Approval →
❓ Blocked – Needs Info → 🏁 Done.
Labels: blue = Dev · purple = UI/UX · green = Marketing · orange = Media · red = Urgent · yellow = Needs Info.

---

## Free-plan notes
- A free Trello workspace allows about **10 collaborators** in total across all its boards. Count the people before inviting.
  Above that: upgrade to Standard, or use one free workspace per team (created by the owner in the Trello UI).
- Butler has a monthly run quota on free – the Manager audit is the backup when the quota runs out.
- No "Observer" role on free → staff are Normal members of their own team board only.
