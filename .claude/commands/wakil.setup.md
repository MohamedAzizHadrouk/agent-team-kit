---
description: First-run guide – check the tools, create your private ecosystem, learn who you are, then set up skills, news and clients
argument-hint: [--resume] [--check-only]
---
# /wakil.setup – Set up your ecosystem

Act as the **manager** (`.claude/agents/manager/manager.md`). Arguments: `$ARGUMENTS`

## Purpose
Make this kit work for **whoever cloned it**: check what is installed, create the private `ecosystem/` folder from
`ecosystem/_templates/`, interview the owner so Claude understands them (work, life areas, goals, how to work
together), then offer the optional modules: skills & learning, news & trends, clients, Trello.

## Arguments
| Argument | Required | Values | Default |
|---|---|---|---|
| `--resume` | no | continue where the last setup stopped (reads `ecosystem/SETUP-STATUS.md`) | automatic if that file exists |
| `--check-only` | no | only run step 1 (tool check), change nothing | – |

## Preconditions
- Claude Code is started at the root of this repo (where `CLAUDE.md` is), ideally with `claude --agent manager`.

## Steps
1. **Tool check** (read-only) and report ✅/⚠️ for each, with the fix:
   - git repo (`git status`) · `.gitignore` contains the `entities/*` and `ecosystem/*` rules
   - agents loaded: manager, brand, ui-ux, fullstack-devops, marketing, media, learning-coach, news-curator
   - connectors (optional): Trello, Figma, GitHub – try a harmless read; missing → point to SETUP.md steps 2–3
   - Outlook drafts (optional, Windows): `tools/outlook-draft.ps1 -DryRun` with a scratchpad body file
   - web search available (needed by /wakil.news and /wakil.learn)
2. **Create the ecosystem** (only what is missing, never overwrite): copy `ecosystem/_templates/PROFILE.md`,
   `knowledge/SKILLS.md`, `news/PREFERENCES.md` into `ecosystem/` and create `knowledge/skills/` and `news/`.
   Write `ecosystem/SETUP-STATUS.md` (steps done / pending, dates).
3. **About you**: run `ecosystem/_templates/setup-questionnaire.md` sections A–D, 3–5 questions at a time, each
   with a suggested default. Fill `ecosystem/PROFILE.md`, log every answer (dated) in its change log.
   After each section, update SETUP-STATUS.md so the owner can stop and `/wakil.setup --resume` later.
4. **Modules** (section E): ask which ones to run now. For each "yes", run that command's steps in this session:
   `/wakil.skills` · `/wakil.news-preferences` · `/wakil.add-entity` (one per client named in B4) · `/wakil.setup-trello --templates`.
   "Later" → note it as pending in SETUP-STATUS.md.
5. **Optional automation**: offer `/wakil.schedule-local "/wakil.news" 1d mon-fri 08:00` (only after one manual `/wakil.news` run).
6. Run `/wakil.check-privacy` to confirm nothing personal is tracked by git.

## Rules
- Never invent answers; `TODO` for unknowns. Never ask for or store ID numbers, passwords, bank or health details.
- Everything written goes in `ecosystem/` or `entities/<slug>/` – both git-ignored. Never commit or push them.
- Never overwrite an existing PROFILE.md, SKILLS.md or PREFERENCES.md: update them field by field and log the change.
- If the owner shares the repo: the other person runs `/wakil.setup` in their own copy – their data never mixes with yours.

## Output
Tool check table · files created · what is filled / still TODO · modules done / pending · the next suggested command.

## Schedulable
No.

## Examples
- `/wakil.setup`
- `/wakil.setup --check-only`
- `/wakil.setup --resume`
