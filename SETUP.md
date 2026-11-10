# Setup guide – Agent Team + Trello (about 20 minutes)

## What is already done for you
- Trello: a board named "🧩 TEMPLATE – Client Project Board (Agent Team)" exists in your Trello workspace,
  with the 8 lists, a "How this board works" card and a "Card template" card (with an acceptance-criteria checklist).
- This kit: CLAUDE.md, the 5 agents, the dynamic client system (registry + templates + questionnaires).

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
Inside Claude Code type `/agents`. You should see: project-lead, ui-ux, fullstack-devops, marketing, media.

### 5. Name the Trello labels (1 minute – the connector cannot do this)
Open the template board in Trello → Labels. Rename the 6 colors:
blue = Dev · purple = UI/UX · green = Marketing · orange = Media · red = Urgent · yellow = Needs Info.
Do this on the TEMPLATE board before you copy it, so every new client board inherits the names.

### 6. Start the Project Lead as the main agent
```
claude --agent project-lead
```
(If your version does not have `--agent`, start `claude` normally and say:
"Act as the project-lead agent defined in .claude/agents/project-lead.md and delegate to the other agents".)
The Project Lead must be the main agent because sub-agents cannot launch other sub-agents.

## First run (test with something harmless)
1. Tell it: **"Onboard a new client"**. It asks "company or individual?" and runs the matching questionnaire,
   creates `clients/<slug>/…`, and adds the board to `clients/registry.md`.
2. In Trello: copy the template board → rename it "<Client> – <Project>" → tell the Project Lead the board name.
3. Create a small card in Ready, e.g. "[UI/UX] Homepage wireframe", with Goal + 3 acceptance criteria.
4. Say: **"Process the board <name>"**.
5. Expected: card → In Progress → In Review → Done (or → Blocked – Needs Info with questions if something is missing).
6. Deliberately test the "ask me" behaviour: create a card with an empty goal. It must go to Blocked with questions.

## Adding clients and projects later (dynamic)
- New client: say "Onboard a new client" (company or individual).
- New project for an existing client: say "New project for <client>: <description>".
- New info about a client: just tell it; it updates CLIENT.md / BRAND.md / PROJECT.md and logs the change.
- Archiving: say "Archive client <name>" → it sets Status: archived in the registry.

## Daily use
- You write cards in Backlog → move to Ready when complete.
- Run: "Process the boards" (or one board by name).
- Approve items in "Awaiting Human Approval" yourself (production deploys, publishing posts, spending).

## Later: automation (after 1–2 weeks of manual runs)
- Run it on a schedule, e.g. a cron job or scheduled task calling: `claude -p "Process all client boards" --agent project-lead`
  (test the exact command by hand first). Start hourly during working hours, not every minute (cost).
- Agent SDK / webhooks for real-time triggers: only if you need it.

## Good habits
- Fill CLIENT.md / BRAND.md properly: the agents are only as good as the context.
- Keep each card small and verifiable.
- Never put passwords or ID numbers in cards or files.
- Review every PR and every post before it goes live.

## Troubleshooting
- Agent not listed in /agents → check the folder is `.claude/agents/` at the root where you start `claude`.
- Trello tools missing → `/mcp` and re-authenticate.
- Project Lead can't delegate → make sure you started it as the main agent (step 6).
- A tool name differs (e.g. Agent vs Task) → run `/agents` and ask Claude to adapt the frontmatter of project-lead.md.
