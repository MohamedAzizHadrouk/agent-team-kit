# Entity & Project Registry (source of truth)
<!-- Copy this file to entities/registry.md (git-ignored – it contains your entities) and fill it. -->

The manager uses this table to know, for every Trello board, WHICH client it belongs to.
A board that is not listed here is never processed: the manager stops and asks.

- Board types:
  - `command-center` – organisation (company, association, club), private (owner + agents), ALL tasks; name `<Organisation> – Command Center`
  - `team` – organisation, one per human team of a managed department; name `<Organisation> – <Team>`
  - `individual` – individual client, single board per project; name `<Person> – <Project>`
- Entity type: `company`, `association`, `club` (organisations – moral persons) or `individual` (physical person).
- Status: `active`, `paused`, `archived`.
- Projects of organisations are NOT boards: they are `projects/<slug>/PROJECT.md`, referenced by the card's `Project:` line.
- Never put secrets or ID numbers here.

| Trello board (name · URL) | Board type | Entity slug | Entity type | Department / team slug (or project for individuals) | Status |
|---|---|---|---|---|---|
| _example: Acme – Command Center · https://trello.com/b/… | command-center | acme | company | – | active_ |

## Trello templates (never processed)
- 🧩 TEMPLATE – Company Command Center · <URL>
- 🧩 TEMPLATE – Human Team Board · <URL>
- 🧩 TEMPLATE – Client Project Board (Agent Team) – individual clients · <URL>

## Entities index (one line per entity)
- <slug> – <name> (company|association|club|individual, city) – sector – entities/<slug>/ENTITY.md
