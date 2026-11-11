---
description: Resume where you stopped last time – in general, or for a client, project, team or one of your skills
argument-hint: [client-slug [project|team|department] | skill <skill> | personal|news|todo|setup|profile] [--save "note"] [--list] [--no-focus]
---
# /wakil.resume – Pick up where I stopped

Act as the **manager** (`.claude/agents/manager.md`, section "Checkpoints"). Arguments: `$ARGUMENTS`

## Purpose
Tell the owner, in one short screen, **where they stopped last time** and **what the next step is**: in general
(the last thing worked on, client or personal), or for one client / project / team / department, or for one
skill or other personal area. With `--save`, record where they stop now so the next resume is exact.

## Arguments
| Argument | Required | Values | Default |
|---|---|---|---|
| `[scope]` | no | nothing · `<client-slug> [project\|team\|department]` · `skill <skill>` (or just `<skill>`) · `personal` · `news` · `todo` · `setup` · `profile` | nothing → the most recent checkpoint, client or personal |
| `--save ["note"]` | no | optional free-text note ("stopped at chapter 4, waiting for logo") | – |
| `--list` | no | show the latest checkpoints (scope + date + one-line next step), pick one | – |
| `--no-focus` | no | do not set the focus when resuming a client | the focus is set |

Name matching for `[scope]`: keywords (`skill`, `personal`, `news`, `todo`, `setup`, `profile`) first, then client
slugs (`clients/registry.md`), then skill slugs (`ecosystem/knowledge/skills/`), then projects / teams /
departments of the focused client. A name that matches more than one → ask which one; never guess.

## Preconditions
- For a client: the client is in `clients/registry.md`. For a skill: `ecosystem/knowledge/skills/<skill>/` exists.

## Where checkpoints live (see manager.md › Checkpoints)
- Client work → `clients/<client-slug>/.resume.md` (one section per scope: `client`, `project:<p>`, `team:<t>`, `department:<d>`).
- Personal work → `ecosystem/.resume.md` (one section per scope: `skill:<s>`, `news`, `todo`, `setup`, `profile`).
- Pointers for the general resume, slugs and dates only → `clients/.last.md` and `ecosystem/.last.md`.

## Steps
1. **`--save`** → work out the scope (argument, else the focus, else the last command's context; unclear → ask),
   write / update that scope's checkpoint (format in manager.md › Checkpoints) with the note, update the matching
   `.last.md` pointer, confirm in one line. Stop.
2. **`--list`** → read only the two `.last.md` pointers and the `.resume.md` section headers + "Next" lines
   (no other client files); show a numbered list, newest first, max 10, client and personal clearly separated;
   let the owner pick one, then continue with step 4 for it.
3. **No scope** → read `clients/.last.md` and `ecosystem/.last.md`, take the one with the newest date and use its
   scope. Neither exists → say so and fall back to `--list`-style options (focus, today's TODO, active skills).
4. **Load ONLY that scope** (golden rule 1 – one client at a time; personal and client data never mixed):
   - client scope: its `.resume.md` section, then CLIENT.md, POSITION.md, RULES.md and the PROJECT.md / TEAM.md /
     DEPARTMENT.md of the scope, plus the Command Center (and that team's board) read-only on Trello, filtered
     like `/wakil.overview`;
   - skill scope: its `.resume.md` section, SKILL.md (Roadmap + Progress log), the open `projects/*/PROJECT.md`;
   - news / todo: today's (or the latest) `news/YYYY/MM/DD/TODO.md`, open items carried over;
   - setup / profile: `SETUP-STATUS.md` / PROFILE.md TODO fields.
5. **No checkpoint for that scope** → rebuild it from what exists, and say "reconstructed": the newest entries of
   the Decisions log / Progress log / Log, the newest Trello card activity, and open TODO items. Never invent.
6. **Check what changed since the checkpoint**: new Trello comments / card moves, replies, new files – and whether
   the checkpoint's "Next" step is still valid (card moved, done, blocked). Flag anything stale.
7. Client scope and no `--no-focus` → set the focus (`clients/.focus.md`, as `/wakil.focus` does) to that scope.
8. Print the Output. Do not start the next step yourself – suggest the command for it.

## Rules
- READ-ONLY except: `--save` writes the checkpoint + pointer; step 7 writes `clients/.focus.md`. No Trello writes,
  no drafts, no other file changes.
- Client isolation: the general resume and `--list` may read the pointers and checkpoint headers of several
  clients (slugs, dates, next steps only); the detailed context is loaded for **one** scope only.
- Checkpoints and pointers hold no emails, contact details, secrets or ID numbers – names and slugs only.
  They are git-ignored (`clients/*`, `ecosystem/*`).
- Not the same as Claude Code's built-in `/resume` (which reopens an old chat); this one resumes the *work*.

## Output
1. **Resuming**: scope (client › project, or skill …) – last worked on `<YYYY-MM-DD HH:MM>` via `<command>` (or "reconstructed").
2. **Where you stopped**: 2–4 lines (what was done, the note if any).
3. **Changed since**: new comments, card moves, replies, files – or "nothing new".
4. **Waiting on you**: approvals, answers, drafts to send, TODO items (with card links).
5. **Next step**: one concrete action + the command to run (e.g. `/wakil.process acme`, `/wakil.skill-project python api --done`).
6. Focus set to … (client scopes only).

## Schedulable
No (interactive – it is about what *you* do next).

## Examples
- `/wakil.resume` – the last thing I worked on, client or personal
- `/wakil.resume acme` – where I stopped with this client
- `/wakil.resume acme brand-book` – a project (or a team / department) of the client
- `/wakil.resume skill python` · `/wakil.resume python`
- `/wakil.resume todo` · `/wakil.resume news` · `/wakil.resume setup`
- `/wakil.resume --list` – choose among the latest checkpoints
- `/wakil.resume --save "stopped at chapter 4, waiting for the new logo"` – bookmark now (uses the focus)
- `/wakil.resume acme brand-book --save` – bookmark a given scope
