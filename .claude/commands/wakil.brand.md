---
description: Build and run your personal brand – strategy, one folder per channel (Instagram, TikTok, LinkedIn…) with its content, ideas, plans and post drafts (ecosystem/brand/)
argument-hint: [--show] | --setup | --add-channel <name> [handle] | --stop-channel <channel> | <section> [info] | --ideas [channel] | --plan [weeks] [channel] | --draft <channel> <topic> | --asset <file|link> | --log <channel> <link> [result]
---
# /wakil.brand – Your personal brand

Act as the **manager** (`.claude/agents/manager/manager.md`). Arguments: `$ARGUMENTS`

## Purpose
Keep everything about the owner's **own** personal brand in one private folder, `ecosystem/brand/`, with **one
folder per channel**, and use it to produce ideas, plans and drafts – which the owner publishes personally.
```
ecosystem/brand/
  BRAND.md                       positioning, audience, story & bios, voice, visual identity, privacy, decisions log
  strategy/STRATEGY.md           goals, content pillars, role of each channel, repurposing, rhythm, reviews
  channels/INDEX.md              list of channels → folder, handle, rhythm, status
  channels/<channel>/            one per channel, created automatically by --add-channel
    CHANNEL.md                   profile, purpose, audience, formats, rules, metrics
    CONTENT.md                   ideas backlog, calendar, published log of THIS channel
    content/<YYYY-MM-DD>-<slug>/ one folder per post: post.md (+ visuals, script, video files)
  assets/INDEX.md                shared assets (logos, headshots, templates, CV, portfolio) + small files
```
Channel slug = lowercase name: `instagram`, `tiktok`, `linkedin`, `youtube`, `github`, `website`, `newsletter`…

## Arguments
| Argument | Required | Values | Default |
|---|---|---|---|
| (none) / `--show` | no | summary: brand, strategy, each channel (status, next posts), remaining TODOs | `--show` |
| `--setup` | no | full interview from `ecosystem/_templates/brand-questionnaire.md`; creates a folder per channel named | – |
| `--add-channel <name> [handle]` | no | create `channels/<slug>/` from the template and add it to `channels/INDEX.md` | – |
| `--stop-channel <channel>` | no | set the channel `stopped` (folder and content are kept) | – |
| `<section> [info]` | no | `positioning` · `audience` · `story` · `voice` · `visual` · `privacy` · `strategy` · `<channel>` + free text | none → ask that section's questions |
| `--ideas [channel]` | no | add 5–10 ideas to the backlog of one channel, or of every active channel | all active channels |
| `--plan [weeks] [channel]` | no | fill the calendar(s) from the backlog for the next N weeks, following each channel's rhythm | 2 weeks, all active |
| `--draft <channel> <topic>` | no | create `channels/<channel>/content/<YYYY-MM-DD>-<slug>/post.md` (+ visual / script brief) | – |
| `--asset <file\|link>` | no | file or index a shared asset; ask whether agents may use it | – |
| `--log <channel> <link> [result]` | no | add a published post to that channel's log and mark it published | – |

## Preconditions
- `ecosystem/` exists (else run `/wakil.setup`).
- `ecosystem/brand/` missing → copy `ecosystem/_templates/brand/` to `ecosystem/brand/` (never overwrite existing
  files) and propose `--setup`.
- A command naming a channel that has no folder → offer to create it (`--add-channel`) – never write content outside
  a channel folder.
- `--ideas`, `--plan`, `--draft` need at least: positioning, audience, voice, one pillar in STRATEGY.md and the
  channel `active`. Missing → ask for them first (or run `--setup`); never invent the brand.

## Steps
1. `--show` → 2–3 lines for BRAND.md and STRATEGY.md, one line per channel (status, rhythm, next planned post),
   remaining `TODO`s, suggested next step. Stop.
2. `--add-channel <name> [handle]` (also used by `--setup` and whenever the owner says "I'm now on X"):
   a. slug = lowercase name; folder exists → say so and show it (restart it if `stopped`). Stop.
   b. copy `ecosystem/_templates/brand-channel/` to `ecosystem/brand/channels/<slug>/` (CHANNEL.md, CONTENT.md,
      content/); replace `<Channel name>`, `<channel-slug>`, date; write the handle if given.
   c. add the row to `channels/INDEX.md` and the channel to STRATEGY.md › Role of each channel (role `TODO`).
   d. ask the CHANNEL.md › Profile questions (purpose, audience, language, rhythm, formats) – 3–5 at a time.
3. `--stop-channel` → Status `stopped` in CHANNEL.md and INDEX.md, log the date; keep the folder and its content.
4. `--setup` → run the questionnaire; for each channel named, do step 2; fill BRAND.md, STRATEGY.md, CHANNEL.md
   files; log each answer in the right decisions / change log.
5. `<section> [info]` → find the right field (a channel name → its CHANNEL.md), show old → new, apply, log it.
6. `--ideas` → brief the **marketing** agent with ONLY BRAND.md, STRATEGY.md and the channel's CHANNEL.md + CONTENT.md
   (+ today's `news/<YYYY>/<MM>/<DD>/TRENDS.md` if it exists). Ideas fit the channel's formats and the pillars; add
   them to that channel's backlog (status `idea`, date). Use STRATEGY.md › Repurposing rules for cross-channel ideas.
7. `--plan` → marketing spreads backlog ideas over each channel's rhythm and the pillars; show the plan; after the
   owner's OK write the calendar rows (status `planned`) in each channel's CONTENT.md.
8. `--draft <channel> <topic>` → create `content/<YYYY-MM-DD>-<slug>/post.md`: hook, body, call to action, hashtags,
   alt text – in the owner's voice and the channel's format (marketing). Visual / carousel / video → **media** adds
   the template, slides, script or storyboard in the same folder, using only assets marked "usable". Calendar row →
   `drafted`. Show it to the owner.
9. `--asset` → small file → `assets/`; big / external → location only; ask "may agents use it?" → INDEX.md.
10. `--log` → that channel's published log (+ calendar row `published`); results only as numbers the owner gives;
    ask for one lesson.
11. Update the checkpoint `ecosystem/.resume.md` section `## brand` and `ecosystem/.last.md`.

## Rules
- **Never publish, post, schedule, comment, follow or message** on any platform. Claude prepares; the owner posts.
- One folder per channel; each channel's content stays in its own folder. Stopping a channel never deletes it.
- No fabrication: no invented results, numbers, testimonials, clients, awards or certificates. Only facts from
  BRAND.md / STRATEGY.md / PROFILE.md or sources the owner gives. Mark assumptions.
- **Isolation**: never use an entity's private data, brand, confidential work or unpublished projects in personal
  content. Name a client / employer only if BRAND.md › Privacy allows it.
- Likeness: use the owner's face, voice or photos only from assets marked "usable". Never generate images of the owner.
- Never store passwords, login emails, ID numbers, home address or private phone. Private folder – never commit it.
- Specialists get only the brand files named above and the PROFILE.md fields they need (languages).

## Output
What changed (old → new) or what was produced (channel folder, ideas, plan, draft path), remaining TODOs, the
owner's next step (e.g. "review the draft, post it, then `/wakil.brand --log linkedin <link>`").

## Schedulable
`--show` and `--ideas` (read / backlog only). The others are interactive.

## Examples
- `/wakil.brand --setup`
- `/wakil.brand --add-channel instagram @my.handle`
- `/wakil.brand --add-channel tiktok`
- `/wakil.brand linkedin "Rhythm: 3 posts a week, carousels on Tuesday"`
- `/wakil.brand strategy "Main goal: 5 freelance inquiries per month by March"`
- `/wakil.brand --ideas instagram`
- `/wakil.brand --plan 4`
- `/wakil.brand --draft linkedin "What I learned building a design system"`
- `/wakil.brand --log linkedin https://www.linkedin.com/posts/… "1.2k views, 40 reactions"`
- `/wakil.brand --stop-channel tiktok`
