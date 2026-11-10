# CLIENT: <Legal / trade name>
Type: company            <!-- moral person -->
Slug: <client-slug>
Status: active
Created: <YYYY-MM-DD>

## Context map (read in this order)
| File | What it holds |
|---|---|
| `CLIENT.md` | this file – identity, business context, Trello, decisions log |
| `POSITION.md` | **the owner's position and role** in / with this company |
| `RULES.md` | rules of this company: approvals, confidentiality, how tasks, reviews and notifications work |
| `BRAND.md` | identity, tone, visual assets |
| `ORG.md` | structure: departments → teams, who leads what, what the owner manages |
| `PEOPLE.md` | employees (work contacts only) – **read by the Project Lead only** |
| `departments/<dept>/DEPARTMENT.md` | one per department; `teams/<team>/TEAM.md` inside |
| `projects/<project>/PROJECT.md` | one per project (independent of teams/departments) |
| `documents/INDEX.md` | company documents: what exists and where |

## Identity
- Legal name: TODO
- Trade name / brand name: TODO
- Legal form & country: TODO        <!-- do NOT store registration/tax ID numbers -->
- Sector / activity: TODO
- Size (employees, markets): TODO
- Website / existing channels: TODO

## Business context
- What they sell / offer: TODO
- Target audience(s): TODO
- Main competitors: TODO
- Goals (what success looks like, measurable): TODO
- Languages for deliverables: TODO
- Markets / countries: TODO

## Trello
- Command Center (private – owner + agents only): <Company> – Command Center · <URL>
- Team boards: listed in each TEAM.md and in clients/registry.md
- Trello workspace / plan: TODO (free plan → ~10 collaborators max per workspace)

## Departments and teams → see ORG.md

## Projects (independent: one team, several teams, departments or the whole company can work on one)
- <project-slug> – short description – status → projects/<project-slug>/PROJECT.md

## Decisions log
<!-- date – decision/answer – who said it -->
