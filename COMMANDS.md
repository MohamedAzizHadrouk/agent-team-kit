# Commands catalog

Type `/` in Claude Code to see them. Every command starts with `wakil.` (e.g. `/wakil.process`) and is one file in `.claude/commands/wakil.<name>.md` with the same
sections: **Purpose · Arguments · Preconditions · Steps · Rules · Output · Schedulable · Examples**.
Change a command by editing its file; add one with `/wakil.new-command`. Detailed rules live in
`.claude/agents/manager/manager.md` – command files point to its sections, so a rule changed there applies everywhere.

Notation: `<required>` · `[optional]` · `a|b` = one of. `<entity-slug>` = a client from `entities/registry.md`.
After `/wakil.focus`, a missing `<entity-slug>` (and project / team) is taken from the focus; an explicit one always wins.

## Personal ecosystem (`ecosystem/` – private)
| Command | Arguments | What it does | Schedulable |
|---|---|---|---|
| `/wakil.setup` | `[--resume] [--check-only]` | First-run guide: tool check, create `ecosystem/`, interview about you, then skills, news, clients, Trello | ❌ |
| `/wakil.profile` | `[--show] [section] [new information]` | Show or update what Claude knows about you (PROFILE.md) | ❌ |
| `/wakil.skills` | `[--show] [--review] [skill]` | Interview about your skills, or show / review learning progress (SKILLS.md) | `--show`, `--review` |
| `/wakil.learn` | `<skill> [goal]` | "I want to learn X": skill folder, level + goal, roadmap with real resources, first practice project | ❌ |
| `/wakil.add-resource` | `<skill> <book\|course\|resource> <title\|link> [notes]` | Add a book, course or resource to a skill | ❌ |
| `/wakil.skill-project` | `<skill> <project-name> [goal]` · `<skill> <project> --done` | Create, update or close a practice (academic) project | ❌ |
| `/wakil.news-preferences` | `[--show] [news\|trends\|general\|todo] [change]` | Interview or update your news & trends preferences | ❌ |
| `/wakil.news` | `[YYYY-MM-DD\|today] [--scope world\|local\|both] [--lang en,fr,ar] [--news-only\|--trends-only] [--refresh]` | Build `news/YYYY/MM/DD/`: TODO.md + one folder per language with `NEWS.world.md`, `NEWS.local.md`, `TRENDS.md` (master language researched, others translated) | ✅ |
| `/wakil.personal-project` | `add <name> [goal]` · `list` · `show <slug>` · `update <slug> <info>` · `status <slug> <status>` | Your personal projects in `ecosystem/projects/` (plan them with `/wakil.plan personal <slug> …`) | `list`, `show` |
| `/wakil.todo` | `show \| add <item> [--learning] \| done <n>` · `[date]` | Today's to-do list | `show` |
| `/wakil.brand` | `[--show]` · `--setup` · `--add-channel <name> [handle]` · `--stop-channel <channel>` · `<section> [info]` · `--ideas [channel]` · `--plan [weeks] [channel]` · `--draft <channel> <topic>` · `--asset <file\|link>` · `--log <channel> <link> [result]` | Your personal brand (`brand/`): strategy, one folder per channel with its content, ideas, plans, post drafts – you post | `--show`, `--ideas` |

## Daily work
| Command | Arguments | What it does | Schedulable |
|---|---|---|---|
| `/wakil.focus` | `[entity-slug] [department] [team] [project]` · `--show` · `--clear` | Select the working context; load only it and use it as the default client/project/team for the next commands | ❌ |
| `/wakil.resume` | `[entity-slug [project\|team\|department]] \| skill <skill> \| personal\|news\|todo\|setup\|profile` · `--save ["note"]` · `--list` · `[--no-focus]` | Where did I stop? Last checkpoint (in general, or for a client, project, team or skill), what changed since, what waits for you, the next step; `--save` bookmarks now | ❌ |
| `/wakil.process` | `<entity-slug\|all> [--dry-run]` | Full loop: audit team boards, sync comments into context, Peer Review, approved cards (agents + human dispatch), Needs Changes, Done, Blocked → report | ✅ |
| `/wakil.overview` | `<entity-slug> [project\|team]` | Read-only picture: what waits for you, what's blocked, what's in progress | ✅ |
| `/wakil.sync` | `<entity-slug>` | Only bring team-board work (comments, files, Ready for Review) back to the Command Center and the context | ✅ |
| `/wakil.reply` | `<entity-slug> <card> <pasted reply>` | Record an email reply (a person's result or a reviewer's ✅/🔁) on the right card | ❌ |

## Tasks & projects
Three ways to get work done – choose how much tracking you want. Entity / project default to the focus
(`/wakil.focus`); `--agent` chooses the agent (default `auto`: the manager picks the best one per task).

### 1 · Do it now (direct – no plan, no task file, no Trello)
| Command | Arguments | What it does | Schedulable |
|---|---|---|---|
| `/wakil.do` | `[<entity-slug\|personal> [project\|none]] [--agent <agent\|auto>] <request>` | Runs the request **now** with the chosen agent (or the best fit); result in the chat, usage still counted on the project | ❌ |
| *(plain request)* | – | Same as `/wakil.do` with `--agent auto` | – |

### 2 · Plan locally (project Kanban in Wakil Desktop – never Trello)
| Command | Arguments | What it does | Schedulable |
|---|---|---|---|
| `/wakil.plan` | `[<entity-slug> <project\|none>] [--agent <a>] <goal>` · `approve <plan-id\|T-…>` · `run <plan-id\|T-NNN\|next\|approved>` · `show` | **Local plan**: plan file + task files (phases, order, dependencies) in the project Kanban; approve, then run | `show` |
| `/wakil.task` | `<entity-slug> <project\|none> [<task-id> show\|status <s>\|note "…"]` · `--import <entity-slug>` | Show / move local task files (the Kanban cards) – also used for Trello twins | `--import` |

### 3 · Plan on Trello (same files + one card per task)
| Command | Arguments | What it does | Schedulable |
|---|---|---|---|
| `/wakil.plan.trello` | `[<entity-slug> <project\|none>] [--agent <a>] <goal>` · `--from <plan-id>` | **Trello plan**: the markdown plan + one card per task in 📥 Proposed (after your OK); `--from` publishes a local plan | ❌ |
| `/wakil.new-task` | `<entity-slug> <project\|none> <description>` | One single card in 📥 Proposed (team, executor, assignee, reviewers, criteria, labels) + its task file | ❌ |
| `/wakil.plan-project` | `<entity-slug> <project> [--next N]` | Older form of `/wakil.plan.trello` for a whole project | ❌ |

### Projects
| Command | Arguments | What it does | Schedulable |
|---|---|---|---|
| `/wakil.new-project` | `<entity-slug> <name> [goal]` | Create PROJECT.md and say which `project : …` label to create | ❌ |
| `/wakil.personal-project` | see Personal ecosystem | Your own projects (`personal` in the commands above) | – |

## Entities (organisations & individuals)
| Command | Arguments | What it does | Schedulable |
|---|---|---|---|
| `/wakil.add-entity` | `<company\|association\|club\|individual> [name]` | Add an organisation (company, association, club) or an individual: questionnaire → `entities/<slug>/` from template → boards → registry | ❌ |
| `/wakil.add-people` | `<entity-slug>` + pasted list | Add / update PEOPLE.md (work contacts only) | ❌ |
| `/wakil.add-department` | `<entity-slug> <name> [managed\|not-managed]` | DEPARTMENT.md + ORG.md | ❌ |
| `/wakil.add-team` | `<entity-slug> <department> <team>` | TEAM.md + team board + registry row + label to create | ❌ |
| `/wakil.add-document` | `<entity-slug> <file\|link\|text> [about] [--confidential]` | File + index a document and extract facts into the context | ❌ |
| `/wakil.update-context` | `<entity-slug> <information>` | Save new info in the right file with a dated log entry | ❌ |

## AI providers, subscriptions & usage (`usage/registry.json` – private)
| Command | Arguments | What it does | Schedulable |
|---|---|---|---|
| `/wakil.provider` | `add\|update\|show\|activate\|deactivate\|archive\|remove [provider] [details]` | AI providers in the registry (`usage/registry.json`) read by Wakil Desktop | `show` |
| `/wakil.subscription` | `add\|update\|price\|billing\|budget\|expense\|plan-usage\|activate\|deactivate\|archive\|remove\|show [sub] [details]` | AI subscriptions: price history, billing model, budget, actual expenses, plan usage | `show` |
| `/wakil.usage` | `record\|acu\|settings\|show\|log [details]` | Record usage tools do not log (Cursor), ACU weights / multipliers, currencies, change log | `show`, `log` |
| `/wakil.billing-period` | `<subscription> <start> [end] [amount]` · `show <subscription>` · `remove <subscription> <start>` | The real dates of each paid subscription period – the base of the cost of one credit | `show` |
| `/wakil.credits` | `sync\|add\|show\|report [details]` | Credit usage log `usage/credits.jsonl` (one line per prompt: provider, model, credits) and cost report per prompt, session, project, task, entity, agent | `sync`, `show`, `report` |

These commands work from Claude Code, Cursor and Codex. The registry is written only through `node tools/ai-registry.cjs` (validated, versioned, logged with the chat and agent); the credit log only through `node tools/credit-log.cjs` – automatically after every prompt by the hooks in `.claude/settings.json`, `.cursor/hooks.json` and `.codex/config.toml`.

## Setup & maintenance
| Command | Arguments | What it does | Schedulable |
|---|---|---|---|
| `/wakil.setup` | see Personal ecosystem | Start here after cloning the repo | ❌ |
| `/wakil.setup-trello` | `[entity-slug] [--templates]` | Create the Trello templates or a client's boards from board-spec.md | ❌ |
| `/wakil.butler-rules` | `<entity-slug> <team\|all>` | Print the Butler rules ready to paste | ❌ |
| `/wakil.schedule-local` | `"<command>" <interval> [days] [hours]` · `--list` · `--remove <name>` | Run a schedulable command automatically on this computer | ❌ |
| `/wakil.check-privacy` | `[--staged-only]` | Check nothing private would be committed / pushed | ✅ |
| `/wakil.sync-tools` | `[--check]` | Regenerate AGENTS.md, `.agents/skills`, `.cursor/agents`, `.codex/agents` so the agents, skills and commands work in Cursor and Codex | ✅ |
| `/wakil.new-command` | `<name> <purpose>` | Create a new command file from the standard layout | ❌ |
| `/wakil.list-commands` | `[command-name]` | Show this catalog, or one command's details | ❌ |

**Schedulable ✅** = never needs you mid-run and never sends, publishes, deploys or deletes (email = drafts only).
Run one unattended with: `claude -p "/wakil.process <entity-slug>" --agent manager` (or `"/wakil.news"`) – or set it up with `/wakil.schedule-local`.

## Built-in names to avoid
`/status`, `/schedule`, `/review`, `/help`, `/init`, `/config`, `/mcp`, `/agents`, `/permissions`, `/clear`,
`/compact`, `/model`, `/memory` already exist in Claude Code – the `wakil.` prefix keeps our commands apart from them (and we still avoid those names, e.g. `/wakil.overview`, `/wakil.schedule-local`).

## Schedules
<!-- Filled by /wakil.schedule-local: name – command – timetable – created. Use client slugs only, no other client data. -->
- none yet
