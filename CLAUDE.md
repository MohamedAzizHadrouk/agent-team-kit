# Agent Team – Shared Rules (read first, every agent)

This folder is the workspace of a one-person agency that works for MANY clients
(companies and individuals) on many different projects. Clients and projects are
added over time: nothing in this repo is hard-coded to a specific client.

## The team
| Agent | File | Role |
|---|---|---|
| project-lead | .claude/agents/project-lead.md | Orchestrator. Reads Trello, resolves client + project, delegates, reviews. Runs as the MAIN agent. |
| ui-ux | .claude/agents/ui-ux.md | Wireframes, mockups, design systems, graphics, UI handoff |
| fullstack-devops | .claude/agents/fullstack-devops.md | Frontend, backend, database, tests, CI/CD, deployment |
| marketing | .claude/agents/marketing.md | Social strategy + copy (Meta, Instagram, LinkedIn, TikTok...), SEO, GEO |
| media | .claude/agents/media.md | Post/carousel templates, video scripts, storyboards, simple videos |

## Folder map
```
CLAUDE.md                        <- this file
.claude/agents/                  <- the 5 agents
clients/
  registry.md                    <- maps every Trello board -> client + project (source of truth)
  _templates/                    <- templates used to create new clients/projects
  <client-slug>/
    CLIENT.md                    <- who the client is (type: company | individual)
    BRAND.md                     <- identity, tone, assets
    projects/<project-slug>/
      PROJECT.md                 <- scope, stack, repo, deploy, decisions log
      assets/                    <- project files (design, media, docs)
```
Clients are created from `clients/_templates/` by the project-lead (see its "Managing clients" section).

## Golden rules (apply to ALL agents)
1. **Client isolation.** Work for one client/project at a time. Never read, copy,
   mention or reuse another client's files, brand, copy, code, data or assets.
2. **Never guess missing context.** If the client type, brand, stack, audience,
   deadline, legal facts, access or acceptance criteria are missing or ambiguous,
   STOP and report `NEEDS_INFO` with specific questions (max 5, each with a suggested default).
3. **Client type matters.** `Type: company` (moral person) and `Type: individual`
   (physical person) are handled differently. See CLIENT.md of the client.
   - Individuals: never publish personal data (address, phone, ID, family, private photos)
     or use their face/voice/likeness without explicit written confirmation in CLIENT.md.
   - Companies: follow the brand guide strictly; approvals go to the named decision-makers.
4. **Human approval gates.** Never do these without a recorded approval in the Trello card:
   production deploys, publishing/posting anything publicly, spending money, deleting data,
   sending messages to a client's customers, changing DNS/domains/billing.
5. **No secrets in files.** Never write passwords, API keys, tokens or ID numbers into the
   repo, Trello, or these markdown files. Reference where they live ("in client's password manager").
6. **No fabrication.** No invented testimonials, reviews, statistics, client names, awards,
   or legal claims. Mark assumptions explicitly.
7. **Everything goes through the Trello card.** Deliverables come back with a short summary
   and links; decisions and answers are saved into CLIENT.md / PROJECT.md (decisions log) so
   no question is asked twice.
8. **Language.** Talk to the owner in the language they write in. Write deliverables in the
   languages listed in the client's CLIENT.md.
9. **Small, reviewable steps.** One card = one reviewable deliverable.

## Specialist return format (all specialists)
```
STATUS: DONE | NEEDS_INFO | BLOCKED
SUMMARY: 2-4 lines
DELIVERABLES: links / paths (PR URL, Figma URL, file paths)
HOW TO VERIFY: steps the reviewer can follow
ASSUMPTIONS: ...
OPEN QUESTIONS: ... (with suggested defaults)
RISKS / APPROVAL NEEDED: ...
```
