# Commands catalog

Type `/` in Claude Code to see them. Every command starts with `wakil.` (e.g. `/wakil.process`) and is one file in `.claude/commands/wakil.<name>.md` with the same
sections: **Purpose · Arguments · Preconditions · Steps · Rules · Output · Schedulable · Examples**.
Change a command by editing its file; add one with `/wakil.new-command`. Detailed rules live in
`.claude/agents/manager.md` – command files point to its sections, so a rule changed there applies everywhere.

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
| `/wakil.news` | `[YYYY-MM-DD\|today] [--news-only\|--trends-only] [--refresh]` | Build `news/YYYY/MM/DD/` with NEWS.md, TRENDS.md, TODO.md | ✅ |
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
| Command | Arguments | What it does | Schedulable |
|---|---|---|---|
| `/wakil.new-task` | `<entity-slug> <project\|none> <description>` | Draft a complete card in 📥 Proposed (team, executor, assignee, reviewers, criteria, labels) | ❌ |
| `/wakil.plan-project` | `<entity-slug> <project> [--next N]` | Propose a task breakdown; after your OK create the first N cards in Proposed | ❌ |
| `/wakil.new-project` | `<entity-slug> <name> [goal]` | Create PROJECT.md and say which `project : …` label to create | ❌ |

## Entities (organisations & individuals)
| Command | Arguments | What it does | Schedulable |
|---|---|---|---|
| `/wakil.add-entity` | `<company\|association\|club\|individual> [name]` | Add an organisation (company, association, club) or an individual: questionnaire → `entities/<slug>/` from template → boards → registry | ❌ |
| `/wakil.add-people` | `<entity-slug>` + pasted list | Add / update PEOPLE.md (work contacts only) | ❌ |
| `/wakil.add-department` | `<entity-slug> <name> [managed\|not-managed]` | DEPARTMENT.md + ORG.md | ❌ |
| `/wakil.add-team` | `<entity-slug> <department> <team>` | TEAM.md + team board + registry row + label to create | ❌ |
| `/wakil.add-document` | `<entity-slug> <file\|link\|text> [about] [--confidential]` | File + index a document and extract facts into the context | ❌ |
| `/wakil.update-context` | `<entity-slug> <information>` | Save new info in the right file with a dated log entry | ❌ |

## Setup & maintenance
| Command | Arguments | What it does | Schedulable |
|---|---|---|---|
| `/wakil.setup` | see Personal ecosystem | Start here after cloning the repo | ❌ |
| `/wakil.setup-trello` | `[entity-slug] [--templates]` | Create the Trello templates or a client's boards from board-spec.md | ❌ |
| `/wakil.butler-rules` | `<entity-slug> <team\|all>` | Print the Butler rules ready to paste | ❌ |
| `/wakil.schedule-local` | `"<command>" <interval> [days] [hours]` · `--list` · `--remove <name>` | Run a schedulable command automatically on this computer | ❌ |
| `/wakil.check-privacy` | `[--staged-only]` | Check nothing private would be committed / pushed | ✅ |
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
