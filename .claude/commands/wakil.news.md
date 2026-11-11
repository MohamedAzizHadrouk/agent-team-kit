---
description: Build the day's folder news/YYYY/MM/DD with NEWS.md, TRENDS.md and TODO.md, following your preferences
argument-hint: [YYYY-MM-DD|today] [--news-only|--trends-only] [--refresh]
---
# /wakil.news – Daily news, trends and to-do

Act as the **manager** (`.claude/agents/manager.md`). Arguments: `$ARGUMENTS`

## Purpose
Keep the owner up to date with the world: one folder per day, `ecosystem/news/<YYYY>/<MM>/<DD>/`, holding
`NEWS.md` (what happened), `TRENDS.md` (what is growing) and `TODO.md` (today's tasks), built from
`ecosystem/news/PREFERENCES.md`.

## Arguments
| Argument | Required | Values | Default |
|---|---|---|---|
| `[date]` | no | `YYYY-MM-DD` or `today` | today (owner's time zone from PROFILE.md) |
| `--news-only` / `--trends-only` | no | build only one of the two files | both |
| `--refresh` | no | rebuild files that already exist for that day | existing files are kept |

## Preconditions
- `ecosystem/news/PREFERENCES.md` is filled (no `TODO` in General and News) – else run `/wakil.news-preferences`.
- Web search is available.

## Steps
1. Create `ecosystem/news/<YYYY>/<MM>/<DD>/` if missing.
2. **TODO.md** (from `ecosystem/_templates/news/day/TODO.md`), unless it exists: if PREFERENCES says so, carry over the
   unticked items of the most recent previous day and add the next step of each active skill (knowledge/SKILLS.md).
3. Spawn **news-curator** with: the date, the full PREFERENCES.md text, the owner's languages and region (from
   PROFILE.md – only those fields), the paths of the last 7 days' TRENDS.md (to spot repeats), and the two output
   paths. It writes NEWS.md and TRENDS.md from the templates in `ecosystem/_templates/news/day/`.
4. Check the result: every item has a source link + publication date, no item older than 48 h in NEWS.md (unless
   marked), no "never" topic, length as preferred. Fix or ask the curator to fix.
5. Report: the "In 30 seconds" lines, the top trends, today's to-do count, the folder path.

## Rules
- No invented facts, quotes or numbers; sources disagree → say so. Summaries in our own words, no long quotes.
- Never post, share or send the news anywhere. Never open paywalled content by bypassing it.
- Past date → only build what can still be found for that date and say it is a reconstruction.

## Output
Folder path, the 30-second summary, top trends, to-do items carried over.

## Schedulable
Yes – read-only web + local files, never sends. Example: `/wakil.schedule-local "/wakil.news" 1d mon-fri 08:00`.

## Examples
- `/wakil.news`
- `/wakil.news 2026-01-15 --trends-only`
- `/wakil.news today --refresh`
