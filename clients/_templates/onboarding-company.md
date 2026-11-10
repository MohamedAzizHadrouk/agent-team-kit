# Onboarding questionnaire – COMPANY (moral person)

Used by the project-lead. Ask in small groups (3–5 questions at a time), in the owner's language.
Accept "I don't know yet" → write `TODO`. Never invent answers.

## A. Identity (→ CLIENT.md)
1. Legal name and trade/brand name?
2. Country and legal form (SARL, SA, LLC…)? (Never collect tax/registration numbers.)
3. Sector and what exactly they sell or offer?
4. Existing website and social channels?

## B. Your position (→ POSITION.md)
5. What is your relationship with this company (employee, agency, freelancer, consultant…)?
6. Your job title, department, and who you report to?
7. What do you manage, what can you approve alone, and what needs someone else's approval?
8. Your work email and signature name (for notification email drafts)?

## C. Organisation (→ ORG.md, departments/, teams/)
9. Which departments exist? For each: what it does and who leads it.
10. Which departments do YOU manage (only those get Trello team boards and tasks)?
11. In each managed department: which teams, their responsibility and their lead?

## D. People (→ PEOPLE.md – work contacts only)
12. Who should be known (to be assignee or reviewer)? Name, role, department, team, work email.
13. Will anyone be invited to Trello team boards, or is everyone notified by email? (Free plan: ~10 collaborators.)

## E. Rules (→ RULES.md)
14. Who approves what (besides you)? Expected turnaround?
15. Reviews: who may review? If a reviewer asks for changes – back to the doer, or to you first?
16. Notifications: email drafts you send (default) or something else? Language and tone of internal emails?
17. Confidentiality level, things never to do or say, legal/regulatory constraints?

## F. Business & brand (→ CLIENT.md, BRAND.md)
18. Target audience, competitors, measurable goals, languages and markets?
19. Brand guide, logo files, colors, fonts, tone of voice? Existing Figma / design system?

## G. Projects (→ projects/<slug>/PROJECT.md – independent of teams)
20. Which projects first? Goal, scope, deadline, participants (teams / departments / whole company)?
21. Technical: existing repo, stack, hosting, domain owner, who owns the accounts?
22. Which one is the first priority?

## H. Documents (→ documents/INDEX.md)
23. Which company documents can you share (presentations, org chart, guides)? Which are confidential (location only)?

## After the answers
- Copy `clients/_templates/company/` to `clients/<slug>/` (rename the `example-…` folders) and fill only what was said.
- Create the boards (see board-spec.md): `<Company> – Command Center` + one `<Company> – <Team>` per team of a
  managed department – or register the boards the owner copied from the Trello templates.
- Add one registry row per board to `clients/registry.md` (create it from `registry.example.md` if missing).
- Tell the owner the manual Trello steps: labels (`team : …`, `project : …`), Butler rules (if anyone is invited),
  invitations (only if chosen), never invite staff to the Command Center.
- Summarize to the owner what is filled and what is still TODO, and ask the missing items.
