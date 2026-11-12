---
description: Add a new entity – an organisation (company, association, club) or an individual – questionnaire, folder, boards, registry
argument-hint: <company|association|club|individual> [name]
---
# /wakil.add-entity – Add a new organisation or individual

Act as the **manager** (`.claude/agents/manager.md`). Arguments: `$ARGUMENTS`

## Purpose
Add anyone the owner works for or with – a **company**, an **association**, a **club** (organisations, moral
persons) or an **individual** (physical person) – and create everything it needs: the private context folder in
`entities/<slug>/`, the owner's position there, the organisation, people, first projects, Trello boards and the
registry rows.

## Arguments
| Argument | Required | Values | Default |
|---|---|---|---|
| `<type>` | yes | `company`, `association`, `club` (organisations) or `individual` | asked if missing |
| `[name]` | no | legal / trade name of the organisation, or the person's public name | asked |

Type → template and questionnaire:
| Type | Template folder | Questionnaire | Trello model |
|---|---|---|---|
| `company` | `entities/_templates/organization/` | `onboarding-organization.md` (common + Company part) | Command Center + team boards |
| `association` | `entities/_templates/organization/` | `onboarding-organization.md` (common + Association part) | Command Center + team boards |
| `club` | `entities/_templates/organization/` | `onboarding-organization.md` (common + Club part) | Command Center + team boards |
| `individual` | `entities/_templates/individual/` | `onboarding-individual.md` | one board per project |

## Preconditions
- No folder `entities/<slug>/` with the same slug exists (else propose `/wakil.update-context` or `/wakil.focus`).
- `entities/registry.md` exists (else create it from `entities/_templates/registry.example.md`).

## Steps
1. Type missing or unknown → ask: "Company, association, club or individual?". Name missing → ask.
   Slug = lowercase-with-dashes of the name; show it and let the owner change it.
2. Run the questionnaire for the type, 3–5 questions at a time, in the owner's language.
   For organisations ask the common sections, then only the part of the chosen type.
   "I don't know yet" → `TODO`. Never invent answers.
3. Copy the template folder to `entities/<slug>/`; rename the `example-…` folders to the real slugs (or remove
   them if there is nothing yet).
4. Fill `ENTITY.md` (with `Type: <company|association|club|individual>`), **POSITION.md** (always – member,
   volunteer, board member, employee, freelancer… and what the owner may approve), `RULES.md`, `BRAND.md`;
   for organisations `ORG.md`, departments (committees / sections / poles for associations and clubs), teams,
   `PEOPLE.md`; the first projects. Log every answer (dated) in the decisions logs.
5. Trello (only if the owner wants boards now): organisation → `<Name> – Command Center` (private) + one
   `<Name> – <Team>` board per team of a managed department; individual → one board per project.
   See `/wakil.setup-trello`.
6. Add one row per board to `entities/registry.md` (entity type = the type above) and one line in its entities index.
7. Give the owner the manual Trello steps: labels (`team : …`, `project : …`), Butler rules if anyone is invited
   (`/wakil.butler-rules`), invitations (only if chosen; never on the Command Center).
8. Update the checkpoint (`entities/<slug>/.resume.md`, section `## entity`) and `entities/.last.md`.

## Rules
- Never invent answers. Work contacts only in PEOPLE.md. Never store ID numbers, registration numbers or secrets.
- Individuals: the PRIVACY & CONSENT section of ENTITY.md is mandatory before any content work.
- Associations and clubs: members' personal data (addresses, phones, birth dates, licences, minors' data) is never
  stored; only work/role contacts of the people the owner needs (board, coaches, volunteers) in PEOPLE.md.
- Entity folders are private (git-ignored) – never commit them. One entity at a time (golden rule 1).

## Output
What was created (files, boards, registry rows), what is still TODO, the owner's manual steps, and the suggested
next command (`/wakil.focus <slug>`, then `/wakil.plan-project` or `/wakil.new-project`).

## Schedulable
No.

## Examples
- `/wakil.add-entity company "Acme Ltd"`
- `/wakil.add-entity association "Green Hands"`
- `/wakil.add-entity club "City Runners"`
- `/wakil.add-entity individual "Jane Doe"`
