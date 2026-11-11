---
description: Onboard a new client (company or individual) – questionnaire, client folder, boards, registry
argument-hint: <company|individual> [client name]
---
# /onboard – Onboard a new client

Act as the **manager** (`.claude/agents/manager.md`). Arguments: `$ARGUMENTS`

## Purpose
Create everything a new client needs: the private context folder, the owner's position, the organisation, people,
first projects, Trello boards and the registry rows.

## Arguments
| Argument | Required | Values | Default |
|---|---|---|---|
| `<type>` | yes | `company` (moral person) or `individual` (physical person) | asked if missing |
| `[name]` | no | legal / trade name, or the person's public name | asked |

## Preconditions
- No client folder with the same slug exists (else propose `/update-context`).

## Steps
1. Run the questionnaire `clients/_templates/onboarding-<type>.md`, 3–5 questions at a time, in the owner's language.
   "I don't know yet" → `TODO`.
2. Copy `clients/_templates/<type>/` to `clients/<slug>/` (slug = lowercase-with-dashes); rename the `example-…` folders.
3. Fill CLIENT.md, **POSITION.md** (always), RULES.md, BRAND.md; for companies ORG.md, departments, teams, PEOPLE.md;
   the first projects. Log every answer (dated) in the decisions logs.
4. Trello: create (or register the owner's copies of) the boards – company: `<Company> – Command Center` + one board per
   team of a managed department; individual: one board. See `/setup-trello`.
5. Add the rows to `clients/registry.md` (create it from `registry.example.md` if missing).
6. Give the owner the manual Trello steps: labels (`team : …`, `project : …`), Butler rules if anyone is invited
   (`/butler-rules`), invitations (only if chosen).

## Rules
- Never invent answers. Work contacts only in PEOPLE.md. Never store ID numbers or secrets.
- Individuals: PRIVACY & CONSENT section is mandatory before any content work.
- The client folder is private (git-ignored) – never commit it.

## Output
What was created (files, boards), what is still TODO, the owner's manual steps, the suggested next command
(`/plan-project`).

## Schedulable
No.

## Examples
- `/onboard company "Acme Ltd"`
- `/onboard individual "Jane Doe"`
