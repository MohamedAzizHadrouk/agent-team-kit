---
description: Check that no client data, people or emails would be committed or pushed to git
argument-hint: [--staged-only]
---
# /wakil.check-privacy – Is the repo safe to share?

Act as the **manager** (`.claude/agents/manager/manager.md`). Arguments: `$ARGUMENTS`

## Purpose
The repo shares only the structure (agents, commands, rules, templates, tools). Client data must never leave this
computer, and neither must the owner's personal ecosystem (`ecosystem/` except `_templates/`). Run this before
every commit or push.

## Arguments
| Argument | Required | Values | Default |
|---|---|---|---|
| `--staged-only` | no | flag | off – checks staged AND untracked-but-not-ignored files |

## Preconditions
- Run inside the repo.

## Steps
1. `git check-ignore` → `entities/registry.md` and every `entities/<slug>/` (except `_templates`) must be ignored;
   so must every path under `ecosystem/` except `ecosystem/_templates/`.
2. List the files that would be committed (`git diff --cached --name-only` + `git ls-files --others --exclude-standard`).
   Any path under `entities/` other than `entities/_templates/`, or under `ecosystem/` other than
   `ecosystem/_templates/` → ❌.
3. Scan those files for: names of registered client slugs and their people (from each PEOPLE.md), email addresses,
   Trello board/card links (`trello.com/b/…`, `trello.com/c/…`), phone numbers, tokens/keys patterns.
   Generic examples (`acme`, `example.com`, `Jane Doe`) are fine.
4. Also check git history: `git log --all --name-only -- entities/ ecosystem/` (outside `_templates`).

## Rules
- READ-ONLY. Never unstage, delete or rewrite history by itself – report and propose the fix.

## Output
✅ safe to commit/push, or ❌ with each problem (file, line, what was found) and the fix to apply.

## Schedulable
Yes. `claude -p "/wakil.check-privacy" --agent manager`

## Examples
- `/wakil.check-privacy`
- `/wakil.check-privacy --staged-only`
