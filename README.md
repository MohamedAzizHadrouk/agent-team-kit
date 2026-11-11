# Agent Team Kit – your ecosystem in Claude Code

A ready-to-use setup for [Claude Code](https://claude.com/claude-code) that organises **your work and your life**:

- **Clients** – a small agent team (manager + UI/UX, dev, marketing, media) that runs your clients' tasks from
  Trello, prepares email drafts in Outlook, and asks you before anything important.
- **Personal ecosystem** – Claude learns who you are (profile), tracks your **skills and learning**
  (roadmaps, books, courses, resources, practice projects) and keeps you **up to date with the world**
  (daily news, trends and to-do, following your own preferences).

Clone it, run `/setup`, answer a few questions – you have your own ecosystem. Nothing personal is ever shared.

## Quick start
```bash
git clone <this-repo-url> my-ecosystem
cd my-ecosystem
claude --agent manager
```
Then type:
```
/setup
```
`/setup` checks your tools (git, Trello / Figma / GitHub connectors, Outlook), creates your private `ecosystem/`
folder, asks about you, and then offers to set up skills, news and your first client. You can stop any time and
continue with `/setup --resume`. Manual, step-by-step version: [SETUP.md](SETUP.md).

## What's inside
```
CLAUDE.md               shared rules for every agent (read first)
COMMANDS.md             catalog of all slash commands
SETUP.md                detailed manual setup
.claude/agents/         manager (main) + ui-ux, fullstack-devops, marketing, media, learning-coach, news-curator
.claude/commands/       one file per slash command
ecosystem/_templates/   skeletons for your personal ecosystem (shared)
clients/_templates/     skeletons for clients, Trello board spec, Butler rules, email templates (shared)
tools/outlook-draft.ps1 creates email DRAFTS in Outlook (never sends)
```
Your own data (created by the commands, **never committed**):
```
ecosystem/
  PROFILE.md                        who you are, goals, how Claude should work with you
  knowledge/SKILLS.md               skills you have · learning now · backlog
  knowledge/skills/<skill>/         SKILL.md (level, goal, roadmap, progress)
    resources/  books/  courses/    INDEX.md in each – real resources only
    projects/<project>/PROJECT.md   practice (academic) projects that prove a milestone
  news/PREFERENCES.md               what news and trends you want, and how
  news/2026/01/15/                  TODO.md · NEWS.md · TRENDS.md for that day
clients/<client>/                   one folder per client (company or individual)
clients/registry.md                 Trello boards → client
```

## Main commands
| Area | Commands |
|---|---|
| Start | `/setup` · `/profile` · `/list-commands` |
| Learning | `/skills` · `/learn <skill>` · `/add-resource` · `/skill-project` |
| News | `/news-preferences` · `/news` · `/todo` |
| Clients | `/onboard` · `/focus` · `/new-task` · `/plan-project` · `/process` · `/overview` · `/reply` |
| Maintenance | `/setup-trello` · `/schedule-local` · `/check-privacy` · `/new-command` |

Full list with arguments: [COMMANDS.md](COMMANDS.md).

### Examples
```
/learn "UX research"                      → skill folder, roadmap, real books/courses, first practice project
/add-resource ux-research book "<title>"  → added to that skill's books/INDEX.md
/news                                      → news/<today>/NEWS.md, TRENDS.md, TODO.md
/schedule-local "/news" 1d mon-fri 08:00   → your news every workday morning
/onboard company "Acme"                    → client folder + Trello boards
```

## How the agents work
- **manager** is the main agent: it talks to you, keeps the context, delegates and checks every result.
- Specialists never talk to you directly and never see other clients' or your personal data unless the brief needs it.
- Nothing is sent, published, bought, deployed or deleted without your approval. Emails are drafts you send yourself.
- No invented facts: resources, news and trends always come with real sources.

## Privacy
This repo shares only the **structure**. `.gitignore` keeps everything under `clients/` and `ecosystem/` (except
their `_templates/`) on your computer. Run `/check-privacy` before every commit or push.
Client data and personal data never mix.

## Requirements
- Claude Code (CLI or desktop app)
- Optional: Trello connector (client boards), Figma and GitHub connectors, Outlook desktop on Windows (email drafts)
