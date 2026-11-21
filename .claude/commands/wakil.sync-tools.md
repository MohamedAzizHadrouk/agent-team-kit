---
description: Regenerate the files Cursor and Codex read (AGENTS.md, .agents/skills, .cursor/agents, .codex/agents) from .claude/ and CLAUDE.md
argument-hint: [--check] [--global]
---
# /wakil.sync-tools – Make the ecosystem work in Cursor and Codex

Act as the **manager** (`.claude/agents/manager/manager.md`). Arguments: `$ARGUMENTS`

## Purpose
`.claude/` (agents, agent skills, commands) and `CLAUDE.md` are the single source of truth. This command mirrors them
for the other AI coding tools so the same agents, skills and commands work everywhere:

| Generated | Read by | Gives |
|---|---|---|
| `AGENTS.md` | Codex, Cursor (and most other agents) | shared rules, command table, agents, skills |
| `.agents/skills/wakil-<command>/` | Cursor (`/wakil-x`), Codex (`$wakil-x`) | every `/wakil.*` command |
| `.agents/skills/<agent>-<skill>/` | Cursor, Codex | the specialists' method skills |
| `.cursor/agents/<agent>.md` | Cursor | specialists as subagents |
| `.codex/agents/<agent>.toml` | Codex | specialists as custom agents |
| `.cursor/commands/wakil.<command>.md` | Cursor (`/wakil.x`) | every `/wakil.*` command, typed like in Claude Code |
| `.wakil/tools.json` | Wakil Desktop | what was generated and when |
| `~/.agents/skills/wakil-<command>/` (`--global`) | Codex, Cursor in **any** folder | the commands also in a project's code folder (pointers to this ecosystem) |

## Arguments
| Argument | Required | Values | Default |
|---|---|---|---|
| `--check` | no | only say whether the generated files are older than the sources | regenerate |
| `--global` | no | also install the commands for the owner's user, so they work when Cursor or Codex is opened on a sub-folder (e.g. a project's code repo) | only in the ecosystem root (already-installed global skills are refreshed) |

## Preconditions
- Node.js is installed (`node --version`).

## Steps
1. `--check` → compare `.wakil/tools.json` › `generatedAt` with the newest file in `.claude/agents`, `.claude/commands`
   and `CLAUDE.md`; report "in sync" or "out of date", then stop.
2. Otherwise run `node tools/sync-ai-tools.cjs` from the ecosystem root (add `--global` when asked).
3. Report its summary line (commands, subagents, skills, stale files removed) and remind the owner to commit the
   generated files with the source change.

## Rules
- Never edit generated files by hand: change the source in `.claude/` or `CLAUDE.md` and run this command again.
- Run it after every `/wakil.new-command`, new or changed agent, or new or changed skill.
- The script only deletes files it generated itself (listed in the previous `.wakil/tools.json`; for `--global`, only
  `~/.agents/skills/wakil-*` folders it generated for this ecosystem).
- The global skills hold the ecosystem's absolute path and live in the owner's home folder – never in the repo.
- After a sync: restart Cursor / start a new Codex session so they reload the commands.

## Output
The script's summary line and the list of changed files (`git status --short`).

## Schedulable
Yes – local files only, never sends.

## Examples
- `/wakil.sync-tools`
- `/wakil.sync-tools --check`
- `/wakil.sync-tools --global`
