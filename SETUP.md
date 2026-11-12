# Setup guide – Agent Team + Trello (about 20 minutes)

> **Fastest way:** open this folder in Claude Code (`claude --agent manager`) and type **`/wakil.setup`**. It checks the
> tools, builds your private `ecosystem/` (profile, skills, news) and guides you through the steps below.
> This file is the detailed manual version.

## What this kit contains
- CLAUDE.md (shared rules), the 7 agents, the personal ecosystem skeleton (`ecosystem/_templates/`), the entity system: `entities/_templates/` with an **organization** (company, association, club) and an
  **individual** skeleton folder (ENTITY, POSITION, RULES, BRAND, ORG, PEOPLE, departments, teams, projects,
  documents), board spec, Butler rules, email templates, onboarding questionnaires, registry example.
- `tools/outlook-draft.ps1` – creates email drafts in your Outlook (Windows, Outlook desktop). Never sends.
- **No client data.** Everything you add under `entities/` (except `_templates/`) is git-ignored and stays on your
  computer. Share the repo freely – your clients, people and documents are never committed.

## Trello templates (one time)
Ask the Manager: **"Create the Trello templates from board-spec.md"**. It creates:
- "🧩 TEMPLATE – Company Command Center" – private board of an organisation (company, association, club): ALL tasks (agent + human), you approve here
- "🧩 TEMPLATE – Human Team Board" – one per human team of an organisation: human tasks only
- "🧩 TEMPLATE – Client Project Board (Agent Team)" – single board for an individual client
each with its lists, a "📘 How this board works" card and a "📝 Card template" card. Then you add the labels (step 5).

## What you do (one time)

### 1. Put the kit on your computer and open it in Claude Code
1. Unzip `agent-team-kit` somewhere permanent (for example `~/agency`).
2. Open a terminal in that folder.
3. Make it a git repo (recommended, so you can see/undo every change the agents make to client files):
   `git init && git add -A && git commit -m "Agent team kit"`
   (Keep client CODE in separate repos, one per client. This folder holds only context and deliverables.)

### 2. Connect Trello to Claude Code
Add the Trello MCP server (URL from the connector directory: https://mcp.trello.com/v1), then authenticate:
```
claude mcp add --transport http trello https://mcp.trello.com/v1
claude          # then type /mcp and sign in to Trello when asked
```
(The exact flags can change between versions: if it fails, run `claude mcp add --help`.)

### 3. Connect Figma and GitHub (for the UI/UX and Dev agents)
Use `/mcp` inside Claude Code (or the plugin marketplace) to add the Figma and GitHub servers, and sign in.
The agents work without them but will be limited (no Figma files, no pull requests).

### 4. Check that the agents are loaded
Inside Claude Code type `/agents`. You should see: manager, ui-ux, fullstack-devops, marketing, media, learning-coach, news-curator.

### 5. Create the Trello labels (a few minutes – the connector cannot do this)
Do it on the TEMPLATE boards before copying them, so every new board inherits the labels.
- Company Command Center template: blue = Dev · purple = UI/UX · green = Marketing · orange = Media · red = Urgent ·
  yellow = Needs Info · 🤖 Agent (any colour, e.g. lime) · 👤 Human (sky). Team labels `team : <name>` are added on each company's own Command Center, NOT on the template.
- Human Team Board template: red = Urgent (optional, nothing else).
- Individual (Client Project Board) template: blue = Dev · purple = UI/UX · green = Marketing · orange = Media · red = Urgent · yellow = Needs Info.

### 5b. Butler rules on team boards
Butler rules are per board: after creating each team board, paste the rules from `entities/_templates/butler-rules.md`.
(Copying a board in Trello may or may not copy its rules – check the Automation panel.)

### 5c. Your private registry and email drafts
- Copy `entities/_templates/registry.example.md` to `entities/registry.md` (git-ignored) – or let the Manager do it.
- Email notifications: Outlook desktop must be installed and signed in on this Windows computer (any account type,
  including on-premises Exchange). Test without creating anything:
  `powershell -NoProfile -File tools/outlook-draft.ps1 -To you@company.com -Subject test -BodyFile <any .txt> -DryRun`

### 6. Start the Manager as the main agent
```
claude --agent manager
```
(If your version does not have `--agent`, start `claude` normally and say:
"Act as the manager agent defined in .claude/agents/manager.md and delegate to the other agents".)
The Manager must be the main agent because sub-agents cannot launch other sub-agents.

## First run (test with something harmless)
1. Run **`/wakil.add-entity <company|association|club|individual> [name]`** (or say "Add a new client / association / club"). It runs the matching questionnaire,
   creates `entities/<slug>/…` (teams + projects for organisations), creates or registers the boards in `entities/registry.md`.
2. Organisation: on the Command Center, create a small card in ✅ Approved – Ready, e.g. "[UI/UX] Homepage wireframe",
   labels 🤖 Agent + purple, with Goal + 3 acceptance criteria. Individual: same card in ✅ Ready.
3. Say: **"Process <client>"** (or "Process the board <name>").
4. Expected (organisation): card → In Progress → In Review → 🛑 Awaiting Final Approval → you move it to Done.
5. Test a human task: card `[Human] <Team> – …` with labels 👤 Human + `team : <name>`, `Executor: Human`, `Assignee: <name from PEOPLE.md>`.
   If the person is NOT on Trello: an email draft appears in your Outlook – send it; forward me their reply.
   If they are invited to their team board: the card appears there; assign them. Finished work → 👀 Peer Review (if reviewers) → 🛑 Awaiting Final Approval.
6. Deliberately test the "ask me" behaviour: create a card with an empty goal. It must go to Blocked with questions.

## Adding entities and projects later (dynamic)
- New entity: `/wakil.add-entity <company|association|club|individual> [name]`.
- New project / initiative for an existing client: say "New project for <client>: <description>".
- New team for an organisation: say "New team for <client>: <name> – <responsibility>" (creates TEAM.md + team board).
- New info about a client: just tell it; it updates ENTITY.md / BRAND.md / TEAM.md / PROJECT.md and logs the change.
- Archiving: say "Archive client <name>" → it sets Status: archived in the registry.

## Daily commands (full list: COMMANDS.md, or type `/wakil.list-commands`)
- `/wakil.process <client>` – the daily run · `/wakil.overview <client> [project|team]` – where things stand (read-only)
- `/wakil.new-task <client> <project|none> <description>` – draft a card · `/wakil.plan-project <client> <project>` – plan a project
- `/wakil.reply <client> <card> <pasted email>` – record an email answer · `/wakil.sync <client>` – read team boards only
- `/wakil.add-people`, `/wakil.add-document`, `/wakil.update-context` – keep the client context up to date
- `/wakil.check-privacy` before every commit/push

## Daily use (organisations: companies, associations, clubs)
- Write every task (agent or human) on the Command Center in 📥 Proposed (or `/wakil.new-task`) → move to ✅ Approved – Ready when complete.
- Run: `/wakil.process <client>` (or `/wakil.process all`).
- Assign people on new team-board cards (the connector cannot assign members).
- Approve everything in 🛑 Awaiting Final Approval: move to 🏁 Done or 🔁 Needs Changes (with a comment).
  The Manager applies your decision to the team board on the next run.
- Read the audit section of the report: forbidden moves by team members are reverted and listed there.
- Free plan: ~10 collaborators per workspace in total – invite each person only to their own team board.

## Daily use (individuals)
- You write cards in Backlog → move to Ready when complete. Approve items in "Awaiting Human Approval" yourself.

## Later: automation (after 1–2 weeks of manual runs)
- Run a schedulable command automatically with `/wakil.schedule-local "/wakil.process <client>" 30m mon-fri 08:00-18:00`
  (it runs `claude -p "/wakil.process <client>" --agent manager` on this computer). Test the command by hand first.
  Start with 30–60 min during working hours, not every minute (each run costs usage).
- Agent SDK / webhooks for real-time triggers: only if you need it.

## Good habits
- Fill ENTITY.md / BRAND.md properly: the agents are only as good as the context.
- Keep each card small and verifiable.
- Never put passwords or ID numbers in cards or files.
- Review every PR and every post before it goes live.

## Troubleshooting
- Agent not listed in /agents → check the folder is `.claude/agents/` at the root where you start `claude`.
- Trello tools missing → `/mcp` and re-authenticate.
- Manager can't delegate → make sure you started it as the main agent (step 6).
- A tool name differs (e.g. Agent vs Task) → run `/agents` and ask Claude to adapt the frontmatter of manager.md.
