---
description: Select the working context (client, department, team, project) so the next commands use it by default
argument-hint: <client-slug> [department] [team] [project] | --show | --clear
---
# /focus – Select the working context

Act as the **manager** (`.claude/agents/manager.md`). Arguments: `$ARGUMENTS`

## Purpose
Choose **one** client – and optionally one department, team and/or project inside it – load only that context,
and remember it so the following commands can leave out `<client-slug>` (and the project/team) and use the focus.

## Arguments
| Argument | Required | Values | Default |
|---|---|---|---|
| `<client-slug>` | no | slug from the registry | none → show a numbered list of clients to pick from |
| `[department]` | no | folder under `departments/` (companies only) | none |
| `[team]` | no | folder under `departments/<dept>/teams/` (department may be deduced from the team) | none |
| `[project]` | no | folder under `projects/` | none |
| `--show` | no | print the current focus, change nothing | – |
| `--clear` | no | delete the focus file | – |

Names after the client may be given in any order: each one is matched against the client's departments, teams
and projects. If a name matches more than one kind (e.g. a team and a project), ask which one.

## Preconditions
- The client is in `clients/registry.md`.
- Departments / teams exist only for `Type: company` clients.

## Steps
1. `--show` → read `clients/.focus.md` and print it (or "no focus set"). Stop.
   `--clear` → delete `clients/.focus.md`, confirm. Stop.
2. No client given → list the clients from `clients/registry.md` (slug + type) and ask the owner to pick one;
   then list that client's departments, teams (from `ORG.md` / `departments/`) and projects (`projects/`) and let
   the owner pick any of them or "whole client".
3. Validate every name against the client's folders. Unknown name → show the valid ones, ask; never guess.
4. Load the context – ONLY this client's folder:
   - always `CLIENT.md`, `POSITION.md`, `RULES.md`, `BRAND.md` (and `ORG.md` for companies);
   - department → `departments/<dept>/DEPARTMENT.md`;
   - team → `departments/<dept>/teams/<team>/TEAM.md`;
   - project → `projects/<project>/PROJECT.md` (+ list of `assets/`).
5. Write `clients/.focus.md` (overwrite):
   ```
   # Current focus
   client: <client-slug>
   type: company | individual
   department: <dept-slug | ->
   team: <team-slug | ->
   project: <project-slug | ->
   set: <YYYY-MM-DD HH:MM>
   ```
6. Print the summary (see Output).

## Rules
- One client at a time (golden rule 1): setting a new focus replaces the old one; never load two clients.
- Read-only for everything except `clients/.focus.md`: no Trello writes, no drafts, no other file writes.
- Do not read `PEOPLE.md` for the summary; never show emails.
- The focus file holds slugs only – no people, emails or other client data. It is git-ignored (`clients/*`).
- The focus is a **default**, not a lock: an explicit `<client-slug>` (or project/team) in any command wins
  for that command, and the focus file is not changed by it.
- If a focused folder no longer exists, say so and ask to re-focus instead of guessing.

## Output
1. **Focus**: client (type) › department › team › project.
2. **Owner's position** here (one line from POSITION.md: role, what they may approve).
3. **Key rules** from RULES.md (max 5 bullets).
4. **Scope**: goal / status of the focused project, team or department (2–4 lines).
5. **Next**: commands that will now use this focus by default (e.g. `/overview`, `/new-task <description>`).

## Schedulable
No (it sets an interactive default). Scheduled runs must always pass `<client-slug>` explicitly.

## Examples
- `/focus` – pick from a list
- `/focus acme`
- `/focus acme marketing` – a department
- `/focus acme ui-ux brand-book` – a team and a project
- `/focus --show`
- `/focus --clear`
