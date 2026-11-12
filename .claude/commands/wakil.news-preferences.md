---
description: Interview or update your news and trend preferences (news/PREFERENCES.md) used by /wakil.news
argument-hint: [--show] [news|trends|general|todo] [change]
---
# /wakil.news-preferences – Your news & trends preferences

Act as the **manager** (`.claude/agents/manager.md`). Arguments: `$ARGUMENTS`

## Purpose
Decide what the daily news engine looks for and how it reports: topics, regions, sources, languages, format,
length, trends areas, things to never show. Stored in `ecosystem/news/PREFERENCES.md`.

## Arguments
| Argument | Required | Values | Default |
|---|---|---|---|
| `--show` | no | print the current preferences, change nothing | – |
| `[section]` | no | `general` · `news` · `trends` · `todo` | all sections (interview) |
| `[change]` | no | free text ("add AI regulation as must", "no sports") | none → ask |

## Preconditions
- `ecosystem/news/PREFERENCES.md` exists (else copy it from `ecosystem/_templates/news/`).

## Steps
1. With a change → apply it to the right table/field, show old → new, log it.
2. Interview (3–5 questions at a time, suggested defaults taken from PROFILE.md – work, region, languages):
   - General: languages, regions, format, length, when, read or listen.
   - News: topics with priority must / nice / never; preferred and avoided sources; never-show list; always-tell-me list.
   - Trends: areas, kind of trends, link to skills? link to clients?
   - To-do: carry over open items? add learning steps?
3. Offer a test run: `/wakil.news`.

## Rules
- Linking trends to clients: only client **sectors** from their ENTITY.md, never confidential data, never one
  client's info in another's context.

## Output
The preferences summary (or the change), the next step.

## Schedulable
No.

## Examples
- `/wakil.news-preferences`
- `/wakil.news-preferences --show`
- `/wakil.news-preferences news "add 'AI regulation' as must, remove sports"`
