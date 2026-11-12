# Onboarding questionnaire – ORGANISATION (company, association, club – moral person)

Used by the manager (`/wakil.add-entity <company|association|club> [name]`). Ask in small groups (3–5 questions at a
time), in the owner's language. Accept "I don't know yet" → write `TODO`. Never invent answers.
Ask sections A–H for every organisation, then ONLY the part of its type (I, J or K).
In the questions, "departments" means departments (company), committees / poles (association) or sections (club).

## A. Identity (→ ENTITY.md)
1. Legal name and trade/brand name (or usual short name)?
2. Country and legal form (SARL, SA, LLC, non-profit association, sports club…)? (Never collect tax/registration numbers.)
3. Sector / field and what exactly they offer or do?
4. Existing website and social channels?

## B. Your position (→ POSITION.md)
5. What is your relationship with this organisation (employee, agency, freelancer, consultant, member, volunteer,
   board member, coach…)?
6. Your title / role, your department (committee, section), and who you report to?
7. What do you manage, what can you approve alone, and what needs someone else's approval?
8. Your work email and signature name (for notification email drafts)?

## C. Organisation (→ ORG.md, departments/, teams/)
9. Which departments (committees, sections) exist? For each: what it does and who leads it.
10. Which ones do YOU manage (only those get Trello team boards and tasks)?
11. In each managed one: which teams, their responsibility and their lead?

## D. People (→ PEOPLE.md – work / role contacts only)
12. Who should be known (to be assignee or reviewer)? Name, role, department, team, work email.
13. Will anyone be invited to Trello team boards, or is everyone notified by email? (Free plan: ~10 collaborators.)

## E. Rules (→ RULES.md)
14. Who approves what (besides you)? Expected turnaround?
15. Reviews: who may review? If a reviewer asks for changes – back to the doer, or to you first?
16. Notifications: email drafts you send (default) or something else? Language and tone of internal emails?
17. Confidentiality level, things never to do or say, legal/regulatory constraints?

## F. Audience & brand (→ ENTITY.md, BRAND.md)
18. Target audience, competitors (or similar organisations), measurable goals, languages and markets / area?
19. Brand guide, logo files, colors, fonts, tone of voice? Existing Figma / design system?

## G. Projects (→ projects/<slug>/PROJECT.md – independent of teams)
20. Which projects first? Goal, scope, deadline, participants (teams / departments / whole organisation)?
21. Technical: existing repo, stack, hosting, domain owner, who owns the accounts?
22. Which one is the first priority?

## H. Documents (→ documents/INDEX.md)
23. Which documents can you share (presentations, org chart, statutes, guides)? Which are confidential (location only)?

## I. Company only (→ ENTITY.md › Business context)
24. What do they sell, to whom, main competitors, size (employees, markets)?

## J. Association only (→ ENTITY.md › Association / club)
24. Mission / statutory object in plain words? Who is it for (beneficiaries)?
25. Governance: board (president, secretary, treasurer…), general assembly, committees – who decides what?
26. Members and volunteers: roughly how many, what profile? (No member lists or personal data.)
27. Main activities, events and yearly calendar? Partners, federation or umbrella body?
28. Funding: membership fees, grants, sponsors, fundraising events? Any rules from funders (logos, reporting)?
29. Are minors or vulnerable people involved? (→ strict no-photo / no-data rule without written consent.)

## K. Club only (→ ENTITY.md › Association / club)
24. Sport / activity / discipline(s) and level (leisure, competition, league)?
25. Sections and teams, coaches / instructors, and the season calendar (training, matches, tournaments)?
26. Governance: board, general assembly, federation membership?
27. Members: roughly how many, age groups? (No member lists, licences or personal data.)
28. Funding: membership fees, sponsors, events, grants? Sponsor obligations (logos, posts)?
29. Are minors involved? (→ no photos, names or results of minors without written parental consent.)

## After the answers
- Copy `entities/_templates/organization/` to `entities/<slug>/` (rename the `example-…` folders), set
  `Type: company | association | club` in ENTITY.md (one value), delete the section that does not apply,
  and fill only what was said.
- Create the boards (see board-spec.md): `<Organisation> – Command Center` + one `<Organisation> – <Team>` per team
  of a managed department – or register the boards the owner copied from the Trello templates.
- Add one registry row per board to `entities/registry.md` (create it from `registry.example.md` if missing).
- Tell the owner the manual Trello steps: labels (`team : …`, `project : …`), Butler rules (if anyone is invited),
  invitations (only if chosen), never invite staff, members or volunteers to the Command Center.
- Summarize to the owner what is filled and what is still TODO, and ask the missing items.
