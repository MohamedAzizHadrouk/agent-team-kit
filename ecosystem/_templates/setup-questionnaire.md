# Setup questionnaire – the owner's ecosystem

Used by `/wakil.setup` and `/wakil.profile`. Ask 3–5 questions at a time, in the owner's language, each with a suggested default.
"I don't know yet" → `TODO`. "I'd rather not say" → leave it out. Never invent answers.
Never ask for or store: ID numbers, passwords, bank details, health details, other people's private data.

## A. You (→ PROFILE.md › Identity)
1. What should I call you? Which language(s) should I answer in?
2. Where are you (country / city) and what is your time zone? Usual work hours?

## B. Your work (→ PROFILE.md › Work, then `clients/` via /wakil.onboard)
3. What do you do? (employee, own company, freelance, agency, student…) – one line per role.
4. Which companies or clients do you work for? For each: company or individual? (each one becomes a client folder later)
5. Which tools do you use daily? (mail/Outlook, Trello, Figma, GitHub, calendar…)

## C. Your life areas and goals (→ PROFILE.md › Life areas, Goals, Values)
6. Which areas do you want help with? (work & clients · learning & skills · news & trends · planning & to-dos · personal projects · other)
7. Your main goals for this year? And in 3 years?
8. What matters to you / your interests – only what you want me to use?

## D. How I should work with you (→ PROFILE.md › How Claude should work with me)
9. Tone and answer length you prefer?
10. What must I always ask you before doing? (default: structural changes, sending, publishing, deleting, spending)
11. Daily rhythm you want? (e.g. morning news + to-do at 08:00, evening review)

## E. Next modules (each one is optional – run it now or later)
- Skills and learning → `/wakil.skills`, then `/wakil.learn <skill>` for each skill to learn
- News and trends → `/wakil.news-preferences`, then `/wakil.news`
- First client → `/wakil.onboard <company|individual> [name]`
- Trello → `/wakil.setup-trello --templates`
