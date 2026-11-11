# Commands catalog

Type `/` in Claude Code to see them. Each command is one file in `.claude/commands/<name>.md` with the same
sections: **Purpose · Arguments · Preconditions · Steps · Rules · Output · Schedulable · Examples**.
Change a command by editing its file; add one with `/new-command`. Detailed rules live in
`.claude/agents/manager.md` – command files point to its sections, so a rule changed there applies everywhere.

Notation: `<required>` · `[optional]` · `a|b` = one of. `<client-slug>` = a client from `clients/registry.md`.
After `/focus`, a missing `<client-slug>` (and project / team) is taken from the focus; an explicit one always wins.

## Personal ecosystem (`ecosystem/` – private)
| Command | Arguments | What it does | Schedulable |
|---|---|---|---|
| `/setup` | `[--resume] [--check-only]` | First-run guide: tool check, create `ecosystem/`, interview about you, then skills, news, clients, Trello | ❌ |
| `/profile` | `[--show] [section] [new information]` | Show or update what Claude knows about you (PROFILE.md) | ❌ |
| `/skills` | `[--show] [--review] [skill]` | Interview about your skills, or show / review learning progress (SKILLS.md) | `--show`, `--review` |
| `/learn` | `<skill> [goal]` | "I want to learn X": skill folder, level + goal, roadmap with real resources, first practice project | ❌ |
| `/add-resource` | `<skill> <book\|course\|resource> <title\|link> [notes]` | Add a book, course or resource to a skill | ❌ |
| `/skill-project` | `<skill> <project-name> [goal]` · `<skill> <project> --done` | Create, update or close a practice (academic) project | ❌ |
| `/news-preferences` | `[--show] [news\|trends\|general\|todo] [change]` | Interview or update your news & trends preferences | ❌ |
| `/news` | `[YYYY-MM-DD\|today] [--news-only\|--trends-only] [--refresh]` | Build `news/YYYY/MM/DD/` with NEWS.md, TRENDS.md, TODO.md | ✅ |
| `/todo` | `show \| add <item> [--learning] \| done <n>` · `[date]` | Today's to-do list | `show` |

## Daily work
| Command | Arguments | What it does | Schedulable |
|---|---|---|---|
| `/focus` | `[client-slug] [department] [team] [project]` · `--show` · `--clear` | Select the working context; load only it and use it as the default client/project/team for the next commands | ❌ |
| `/process` | `<client-slug\|all> [--dry-run]` | Full loop: audit team boards, sync comments into context, Peer Review, approved cards (agents + human dispatch), Needs Changes, Done, Blocked → report | ✅ |
| `/overview` | `<client-slug> [project\|team]` | Read-only picture: what waits for you, what's blocked, what's in progress | ✅ |
| `/sync` | `<client-slug>` | Only bring team-board work (comments, files, Ready for Review) back to the Command Center and the context | ✅ |
| `/reply` | `<client-slug> <card> <pasted reply>` | Record an email reply (a person's result or a reviewer's ✅/🔁) on the right card | ❌ |

## Tasks & projects
| Command | Arguments | What it does | Schedulable |
|---|---|---|---|
| `/new-task` | `<client-slug> <project\|none> <description>` | Draft a complete card in 📥 Proposed (team, executor, assignee, reviewers, criteria, labels) | ❌ |
| `/plan-project` | `<client-slug> <project> [--next N]` | Propose a task breakdown; after your OK create the first N cards in Proposed | ❌ |
| `/new-project` | `<client-slug> <name> [goal]` | Create PROJECT.md and say which `project : …` label to create | ❌ |

## Clients & organisation
| Command | Arguments | What it does | Schedulable |
|---|---|---|---|
| `/onboard` | `<company\|individual> [name]` | Questionnaire → client folder from template → boards → registry | ❌ |
| `/add-people` | `<client-slug>` + pasted list | Add / update PEOPLE.md (work contacts only) | ❌ |
| `/add-department` | `<client-slug> <name> [managed\|not-managed]` | DEPARTMENT.md + ORG.md | ❌ |
| `/add-team` | `<client-slug> <department> <team>` | TEAM.md + team board + registry row + label to create | ❌ |
| `/add-document` | `<client-slug> <file\|link\|text> [about] [--confidential]` | File + index a document and extract facts into the context | ❌ |
| `/update-context` | `<client-slug> <information>` | Save new info in the right file with a dated log entry | ❌ |

## Setup & maintenance
| Command | Arguments | What it does | Schedulable |
|---|---|---|---|
| `/setup` | see Personal ecosystem | Start here after cloning the repo | ❌ |
| `/setup-trello` | `[client-slug] [--templates]` | Create the Trello templates or a client's boards from board-spec.md | ❌ |
| `/butler-rules` | `<client-slug> <team\|all>` | Print the Butler rules ready to paste | ❌ |
| `/schedule-local` | `"<command>" <interval> [days] [hours]` · `--list` · `--remove <name>` | Run a schedulable command automatically on this computer | ❌ |
| `/check-privacy` | `[--staged-only]` | Check nothing private would be committed / pushed | ✅ |
| `/new-command` | `<name> <purpose>` | Create a new command file from the standard layout | ❌ |
| `/list-commands` | `[command-name]` | Show this catalog, or one command's details | ❌ |

**Schedulable ✅** = never needs you mid-run and never sends, publishes, deploys or deletes (email = drafts only).
Run one unattended with: `claude -p "/process <client-slug>" --agent manager` (or `"/news"`) – or set it up with `/schedule-local`.

## Built-in names to avoid
`/status`, `/schedule`, `/review`, `/help`, `/init`, `/config`, `/mcp`, `/agents`, `/permissions`, `/clear`,
`/compact`, `/model`, `/memory` already exist in Claude Code – that is why we use `/overview` and `/schedule-local`.

## Schedules
<!-- Filled by /schedule-local: name – command – timetable – created. Use client slugs only, no other client data. -->
- none yet
