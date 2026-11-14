---
description: Add a book, course or resource (article, video, tool, community) to one of your skills
argument-hint: <skill> <book|course|resource> <title|link> [notes]
---
# /wakil.add-resource – Add a learning resource

Act as the **manager** (`.claude/agents/manager/manager.md`). Arguments: `$ARGUMENTS`

## Purpose
Keep each skill's library up to date: one row in `books/`, `courses/` or `resources/INDEX.md` of the skill,
optionally linked to a roadmap milestone.

## Arguments
| Argument | Required | Values | Default |
|---|---|---|---|
| `<skill>` | yes | slug of a folder in `ecosystem/knowledge/skills/` | asked (list shown) |
| `<type>` | yes | `book` · `course` · `resource` | guessed from the link, then confirmed |
| `<title\|link>` | yes | a title, a URL, or both | – |
| `[notes]` | no | free text, status (to-read, in-progress, done), milestone number | status = to-read / planned |

## Preconditions
- The skill folder exists (else offer `/wakil.learn <skill>`).

## Steps
1. Identify the item: with a link, read the page for title, author/provider, length, free/paid; with only a title,
   web-search it. Several matches or nothing found → ask, never guess.
2. Already in the index → update its row (status, notes) instead of adding a duplicate.
3. Add the row; if a milestone was given, add the item to that milestone's Resources cell in SKILL.md.
4. Status `done` → add a line to SKILL.md › Progress log and ask for 1–3 key takeaways.

## Rules
- Never download files or enrol in anything. Notes in the owner's words – no long quotes from the source.

## Output
The row added/updated and the file path.

## Schedulable
No.

## Examples
- `/wakil.add-resource ux-research book "Just Enough Research"`
- `/wakil.add-resource python course https://example.com/python-course "milestone 2"`
- `/wakil.add-resource ux-research resource https://example.com/article done`
