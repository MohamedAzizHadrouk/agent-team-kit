# Trello board spec – one board per client project

Board name: `<Client> – <Project>`   (e.g. "Acme Ltd – Website")
Template board already in your Trello workspace: "🧩 TEMPLATE – Client Project Board (Agent Team)"
→ Easiest way to start a new client project: in Trello, open the template board → ••• menu → "Copy board"
  (or "Create board from template"), rename it, and add it to clients/registry.md.

## Lists (in this order)
1. 📥 Backlog
2. ✅ Ready                – cards complete enough to execute (the Project Lead reads this list)
3. 🔄 In Progress
4. 🔍 In Review
5. 🔁 Needs Changes
6. 🛑 Awaiting Human Approval   – deploys, publishing, spending, deletion
7. ❓ Blocked – Needs Info      – the Project Lead asks questions in a comment here
8. 🏁 Done

## Labels (rename the 6 default colors once, on each board / in the template before copying)
- blue = Dev · purple = UI/UX · green = Marketing · orange = Media · red = Urgent · yellow = Needs Info

## Card title convention
`[Dev]`, `[UI/UX]`, `[Marketing]` or `[Media]` + short task name.

## Card description fields
Client · Project · Task type · Goal · Context · Deliverable · Constraints · Acceptance criteria (checklist) · Deadline/Priority

## Limits of the Trello connector (tell the owner when relevant)
It can create boards, lists, cards, checklists, comments and move cards. It cannot create workspaces or create/rename labels.
If the Project Lead creates a board itself, it creates the 8 lists above and tells the owner to set the label names in Trello.
