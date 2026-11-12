# ENTITY: <Legal / trade name>
Type: company | association | club     <!-- organisation = moral person; keep ONE value -->
Slug: <entity-slug>
Status: active
Created: <YYYY-MM-DD>

## Context map (read in this order)
| File | What it holds |
|---|---|
| `ENTITY.md` | this file – identity, business context, Trello, decisions log |
| `POSITION.md` | **the owner's position and role** in / with this organisation |
| `RULES.md` | rules of this organisation: approvals, confidentiality, how tasks, reviews and notifications work |
| `BRAND.md` | identity, tone, visual assets |
| `ORG.md` | structure: departments → teams, who leads what, what the owner manages |
| `PEOPLE.md` | employees, board members, volunteers, coaches (work / role contacts only) – **read by the Manager only** |
| `departments/<dept>/DEPARTMENT.md` | one per department; `teams/<team>/TEAM.md` inside |
| `projects/<project>/PROJECT.md` | one per project (independent of teams/departments) |
| `documents/INDEX.md` | organisation documents: what exists and where |

## Identity
- Legal name: TODO
- Trade name / brand name: TODO
- Legal form & country: TODO        <!-- do NOT store registration/tax ID numbers -->
- Sector / activity: TODO
- Size (employees, markets): TODO
- Website / existing channels: TODO

## Association / club (only for Type: association or club – delete for companies)
- Purpose / mission (statutory object, in plain words): TODO
- Governance: board (bureau), general assembly, committees / sections – who decides what: TODO
- Members: approximate number and profile (NO member list, NO personal data here): TODO
- Activities / sports / disciplines and season or yearly calendar: TODO
- Federation / umbrella body / partners / sponsors: TODO
- Funding (membership fees, grants, sponsors, events) – amounts only if the owner gives them: TODO
- Minors involved: yes / no (yes → no photos, names or data of minors without written parental consent)

## Business context
- What they sell / offer: TODO
- Target audience(s): TODO
- Main competitors: TODO
- Goals (what success looks like, measurable): TODO
- Languages for deliverables: TODO
- Markets / countries: TODO

## Trello
- Command Center (private – owner + agents only): <Organisation> – Command Center · <URL>
- Team boards: listed in each TEAM.md and in entities/registry.md
- Trello workspace / plan: TODO (free plan → ~10 collaborators max per workspace)

## Departments and teams → see ORG.md

## Projects (independent: one team, several teams, departments or the whole organisation can work on one)
- <project-slug> – short description – status → projects/<project-slug>/PROJECT.md

## Decisions log
<!-- date – decision/answer – who said it -->
