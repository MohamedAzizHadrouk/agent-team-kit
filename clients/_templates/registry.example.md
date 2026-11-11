# Client & Project Registry (source of truth)
<!-- Copy this file to clients/registry.md (git-ignored – it contains your clients) and fill it. -->

The manager uses this table to know, for every Trello board, WHICH client it belongs to.
A board that is not listed here is never processed: the manager stops and asks.

- Board types:
  - `command-center` – company, private (owner + agents), ALL tasks; name `<Company> – Command Center`
  - `team` – company, one per human team of a managed department; name `<Company> – <Team>`
  - `individual` – individual client, single board per project; name `<Person> – <Project>`
- Client type: `company` (moral person) or `individual` (physical person).
- Status: `active`, `paused`, `archived`.
- Projects of companies are NOT boards: they are `projects/<slug>/PROJECT.md`, referenced by the card's `Project:` line.
- Never put secrets or ID numbers here.

| Trello board (name · URL) | Board type | Client slug | Client type | Department / team slug (or project for individuals) | Status |
|---|---|---|---|---|---|
| _example: Acme – Command Center · https://trello.com/b/… | command-center | acme | company | – | active_ |

## Trello templates (never processed)
- 🧩 TEMPLATE – Company Command Center · <URL>
- 🧩 TEMPLATE – Human Team Board · <URL>
- 🧩 TEMPLATE – Client Project Board (Agent Team) – individual clients · <URL>

## Clients index (one line per client)
- <slug> – <name> (company|individual, city) – sector – clients/<slug>/CLIENT.md
