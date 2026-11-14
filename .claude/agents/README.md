# Agents – one folder per agent

```
.claude/agents/
  README.md                         <- this file (no frontmatter: not an agent)
  _templates/skill/SKILL.md         <- copy this to add a skill
  <agent>/
    <agent>.md                      <- the agent definition (frontmatter name + description; loaded by Claude Code)
    skills/
      INDEX.md                      <- catalog the agent reads first: category -> skill -> "use when" -> file
      <category>/<skill>/SKILL.md   <- one skill = one folder (+ optional references/, examples/, checklists)
```

Claude Code scans `.claude/agents/` **recursively** and identifies an agent only by the `name` field of its
frontmatter, so the folder layout does not change how agents are called (`claude --agent manager`, `/agents`).

**What makes agents different is their skills.** The agent `.md` holds the role and the hard rules;
the `skills/` folder holds the *how-to* for each kind of task, and grows over time.

## How an agent uses its skills (every task)
1. Read `skills/INDEX.md` of its own folder (never another agent's).
2. Classify the task from the brief / prompt (which category, which kind of deliverable), using the
   "Use when" keywords of each row.
3. Open only the matching `SKILL.md` files (usually 1–3) and follow them.
4. Priority when they conflict: `CLAUDE.md` golden rules > client RULES.md / BRAND.md > the agent's `.md` > skills.
5. Report the skills used on the `SKILLS USED:` line of the return format (or `none matched` + a suggested new skill).

## Add a skill (by hand)
1. Pick the agent and a category (existing folder or a new one, kebab-case: `seo`, `security`, `video`…).
2. Copy `_templates/skill/SKILL.md` to `<agent>/skills/<category>/<skill-slug>/SKILL.md` and fill it.
3. Add one row to `<agent>/skills/INDEX.md`. A skill that is not in the INDEX is not used.

## Rules for skill files
- **Never put `name:` or `description:` in a skill's frontmatter** – Claude Code would load it as an agent.
  Use the keys of the template (`skill`, `category`, `use-when`, …).
- Generic only: skills are shared in git – no client names, people, data or secrets (see CLAUDE.md › Privacy).
- Facts that change (platform specs, standards, prices) cite a source and a `last-checked` date;
  the agent re-checks them on the web when they are older than ~6 months and the tool allows it.
