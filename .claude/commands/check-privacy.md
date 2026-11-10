---
description: Check that no client data, people or emails would be committed or pushed to git
argument-hint: [--staged-only]
---
# /check-privacy – Is the repo safe to share?

Act as the **project-lead** (`.claude/agents/project-lead.md`). Arguments: `$ARGUMENTS`

## Purpose
The repo shares only the structure (agents, commands, rules, templates, tools). Client data must never leave this
computer. Run this before every commit or push.

## Arguments
| Argument | Required | Values | Default |
|---|---|---|---|
| `--staged-only` | no | flag | off – checks staged AND untracked-but-not-ignored files |

## Preconditions
- Run inside the repo.

## Steps
1. `git check-ignore` → `clients/registry.md` and every `clients/<slug>/` (except `_templates`) must be ignored.
2. List the files that would be committed (`git diff --cached --name-only` + `git ls-files --others --exclude-standard`).
   Any path under `clients/` other than `clients/_templates/` → ❌.
3. Scan those files for: names of registered client slugs and their people (from each PEOPLE.md), email addresses,
   Trello board/card links (`trello.com/b/…`, `trello.com/c/…`), phone numbers, tokens/keys patterns.
   Generic examples (`acme`, `example.com`, `Jane Doe`) are fine.
4. Also check git history for client folders: `git log --all --name-only -- clients/` (outside `_templates`).

## Rules
- READ-ONLY. Never unstage, delete or rewrite history by itself – report and propose the fix.

## Output
✅ safe to commit/push, or ❌ with each problem (file, line, what was found) and the fix to apply.

## Schedulable
Yes. `claude -p "/check-privacy" --agent project-lead`

## Examples
- `/check-privacy`
- `/check-privacy --staged-only`
