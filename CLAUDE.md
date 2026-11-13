# Agent Team – Shared Rules (read first, every agent)

This folder is the owner's ecosystem in Claude, with two sides:
- **Entities** (`entities/`): everyone the owner works for or with, on many projects –
  **organisations** (`company`, `association`, `club` – moral persons) and **individuals** (physical persons).
  An agency client is an entity; so is an association or club the owner belongs to or volunteers for.
  Entities and projects are added over time with `/wakil.add-entity`: nothing in this repo is hard-coded to one.
  **Wording:** in agents, commands and templates, "client" means any entity, and every rule written for a
  "company" applies to all organisation types (company, association, club) unless it says otherwise.
- **Personal ecosystem** (`ecosystem/`): who the owner is (PROFILE.md), their skills and learning (knowledge/),
  their personal brand (brand/ – `/wakil.brand`) and their daily news, trends and to-do (news/). Set up with `/wakil.setup`.
Anyone can clone this repo and run `/wakil.setup` to build their own ecosystem – nothing personal is shared.

## The team
| Agent | File | Role |
|---|---|---|
| manager | .claude/agents/manager.md | Orchestrator. Reads Trello, resolves client + project, delegates, reviews. Runs as the MAIN agent. |
| ui-ux | .claude/agents/ui-ux.md | Wireframes, mockups, design systems, graphics, UI handoff |
| fullstack-devops | .claude/agents/fullstack-devops.md | Frontend, backend, database, tests, CI/CD, deployment |
| marketing | .claude/agents/marketing.md | Social strategy + copy (Meta, Instagram, LinkedIn, TikTok...), SEO, GEO |
| media | .claude/agents/media.md | Post/carousel templates, video scripts, storyboards, simple videos |
| brand | .claude/agents/brand.md | Brand strategy, positioning, architecture, naming, voice, visual identity direction, guidelines, brand reviews |
| learning-coach | .claude/agents/learning-coach.md | Personal: learning roadmaps, real resources, practice projects, progress reviews |
| news-curator | .claude/agents/news-curator.md | Personal: daily news + trends from the owner's preferences, always with sources |

## Folder map
```
CLAUDE.md                        <- this file
README.md  SETUP.md              <- overview / detailed manual setup
.claude/agents/                  <- the 8 agents
ecosystem/                       <- PRIVATE, git-ignored except _templates/
  _templates/                    <- shared skeletons: PROFILE, SKILLS, skill folder, news preferences, day files
  PROFILE.md                     <- who the owner is, goals, how to work with them
  knowledge/SKILLS.md            <- skills I have / learning now / backlog
  knowledge/skills/<skill>/      <- SKILL.md + resources/ + books/ + courses/ + projects/<project>/
  news/PREFERENCES.md            <- news + trends preferences
  news/<YYYY>/<MM>/<DD>/         <- TODO.md, NEWS.md, TRENDS.md of that day
  brand/                         <- personal brand (/wakil.brand): BRAND.md, strategy/STRATEGY.md, assets/,
    channels/<channel>/          <- one folder per channel (instagram, tiktok, linkedin…): CHANNEL.md, CONTENT.md, content/
entities/
  registry.md                    <- maps every Trello board -> entity + board type (PRIVATE, git-ignored)
  _templates/                    <- shared: board-spec, Butler rules, email templates, onboarding, registry example
    organization/  individual/   <- skeleton folders copied for every new entity (organization = company | association | club)
  <entity-slug>/                 <- PRIVATE, git-ignored (one folder = one entity's whole context)
    ENTITY.md                    <- entry point: identity, type, context map, decisions log
    POSITION.md                  <- the owner's position / role / authority in or for this client
    RULES.md                     <- this client's rules (approvals, reviews, notifications, confidentiality)
    .resume.md                   <- checkpoints: where the owner stopped (per client / project / team) – /wakil.resume
    BRAND.md                     <- identity, tone, assets
    ORG.md                       <- organisations: departments (committees, sections) -> teams, what the owner manages
    PEOPLE.md                    <- employees / board / volunteers / collaborators, WORK contacts only (Manager only)
    departments/<dept>/DEPARTMENT.md            <- organisations only
      teams/<team>/TEAM.md                      <- teams of managed departments
    projects/<project>/PROJECT.md + assets/     <- independent of departments/teams
    documents/INDEX.md + files                  <- client documents (confidential ones: location only)
tools/outlook-draft.ps1          <- creates email DRAFTS in the owner's Outlook (never sends)
.claude/commands/wakil.<name>.md <- slash commands (/wakil.process, /wakil.overview, /wakil.new-task …) – one file per command
COMMANDS.md                      <- catalog of all commands, their arguments and schedules
```

## Commands
The owner drives the work with slash commands (see COMMANDS.md). When a command is used, follow its file's
Steps and Rules exactly; the detailed rules stay in manager.md. All commands are prefixed `wakil.` (e.g. `/wakil.process`). New commands use the same layout (`/wakil.new-command`) and generic examples only (no real client names – the files are shared).
Entities are created with `/wakil.add-entity <company|association|club|individual> [name]`, from
`entities/_templates/organization|individual/`, by the manager (see its "Managing clients" section).

## Privacy of this repo
The repo shares only the **structure** (agents, rules, templates, tools) so anyone can reuse it.
Everything under `entities/` except `_templates/` is git-ignored: client folders and `registry.md` stay on this
computer only. Never commit, push or paste client data, people, emails or documents anywhere else.
The same applies to `ecosystem/` (except `_templates/`): the owner's profile, skills, news and to-dos stay local.
Client data and personal data never mix (no client info in `ecosystem/`, no personal info in client files or cards).

## Trello model (details in entities/_templates/board-spec.md)
- **Organisation** (company, association, club) → one private `<Name> – Command Center` (owner + agents only)
  holding ALL tasks, agent AND human, where the owner approves everything; plus one `<Name> – <Team>` board per
  human team, synced by the manager.
- **Individual** → one board per client project (single-board model).
- Agent work is NEVER shown on team boards. Staff are invited only to their own team board (if at all), never to
  the Command Center. People who are not on Trello are notified by email drafts the owner sends.
- A task may belong to a project or to none; assignee and reviewers are chosen by name (PEOPLE.md);
  start / due dates are optional; reviewers review first, the owner has the last word.

## Golden rules (apply to ALL agents)
1. **Client isolation.** Work for one client at a time. Never read, copy,
   mention or reuse another client's files, brand, copy, code, data or assets.
2. **Never guess missing context.** If the client type, brand, stack, audience,
   deadline, legal facts, access or acceptance criteria are missing or ambiguous,
   STOP and report `NEEDS_INFO` with specific questions (max 5, each with a suggested default).
3. **Entity type matters.** Organisations (`Type: company | association | club`, moral persons) and
   `Type: individual` (physical persons) are handled differently. See ENTITY.md of the entity.
   - Individuals: never publish personal data (address, phone, ID, family, private photos)
     or use their face/voice/likeness without explicit written confirmation in ENTITY.md.
   - Organisations: follow the brand guide strictly; approvals go to the named decision-makers
     (for associations and clubs: the board / president or the person named in RULES.md).
   - Associations and clubs: never store or publish members' personal data; never publish photos, names or
     results of minors without written parental consent recorded in ENTITY.md.
4. **Human approval gates.** Never do these without a recorded approval in the Trello card:
   production deploys, publishing/posting anything publicly, spending money, deleting data,
   sending messages to a client's customers, changing DNS/domains/billing.
5. **No secrets in files.** Never write passwords, API keys, tokens or ID numbers into the
   repo, Trello, or these markdown files. Reference where they live ("in client's password manager").
6. **No fabrication.** No invented testimonials, reviews, statistics, client names, awards,
   or legal claims. Mark assumptions explicitly.
7. **Everything goes through the Trello card.** Deliverables come back with a short summary
   and links; decisions and answers are saved into the client's files (decisions logs) so
   no question is asked twice.
8. **Language.** Talk to the owner in the language they write in. Write deliverables in the
   languages listed in the client's ENTITY.md.
9. **Small, reviewable steps.** One card = one reviewable deliverable.
10. **People's data.** PEOPLE.md is read only by the manager. Specialists never receive emails
    or contact details; Trello cards name people but never show their emails. No email is ever sent by
    an agent: only drafts in the owner's Outlook, which the owner sends.
11. **Know the owner's position.** Read the client's POSITION.md: it says who the owner is there,
    what they manage and what they may approve. Never act beyond that authority.

## Specialist return format (all specialists)
```
STATUS: DONE | NEEDS_INFO | BLOCKED
SUMMARY: 2-4 lines
DELIVERABLES: links / paths (PR URL, Figma URL, file paths)
HOW TO VERIFY: steps the reviewer can follow
ASSUMPTIONS: ...
OPEN QUESTIONS: ... (with suggested defaults)
RISKS / APPROVAL NEEDED: ...
```
