---
description: Read-only overview of a client – what waits for you, what is blocked, what is in progress
argument-hint: <entity-slug> [project-slug|team-slug]
---
# /wakil.overview – Where do things stand?

Act as the **manager** (`.claude/agents/manager.md`). Arguments: `$ARGUMENTS`

## Purpose
Give the owner a clear picture of a client, a project or a team **without changing anything**.

## Arguments
| Argument | Required | Values | Default |
|---|---|---|---|
| `<entity-slug>` | yes | slug from the registry | – |
| `[project-slug or team-slug]` | no | a folder name under `projects/` or `departments/*/teams/` | whole client |

## Preconditions
- The client is in `entities/registry.md`.

## Steps
1. Read the registry, ENTITY.md, ORG.md and the Command Center + team boards (read-only).
2. If a project is given: filter cards by the `project : …` label / `Project:` line. If a team: by `team : …` / `Team:`.
3. Group cards by list; for each card: title, executor (agent or person name), reviewers, start/due date, time in the list.
4. Flag: cards waiting for the owner (Proposed, Awaiting Final Approval, Blocked), cards stuck > 7 days, missing labels.

## Rules
- READ-ONLY: no Trello writes, no file writes, no drafts.
- Names only – never show emails.

## Output
1. **Needs you** (approve / answer / send) – with card links.
2. **In progress** – per project or team.
3. **Done recently** (last 7 days).
4. **Warnings** (stuck, missing labels, unknown people).

## Schedulable
Yes (e.g. every morning). `claude -p "/wakil.overview <client>" --agent manager`

## Examples
- `/wakil.overview acme`
- `/wakil.overview acme brand-book`
- `/wakil.overview acme ui-ux`
