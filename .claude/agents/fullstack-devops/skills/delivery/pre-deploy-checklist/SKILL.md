---
skill: pre-deploy-checklist
category: delivery
use-when: deploy, release, go live, staging, production, CI/CD, launch, migration
inputs: project, environments, approval status on the card
output: filled checklist in the PR / card comment
last-checked: 2026-11-13
---

# Pre-deploy checklist

## Goal
Ship safely and reversibly. Production needs a recorded approval on the Trello card (golden rule 4).

## Checklist
- [ ] Approval for production recorded on the card (otherwise: staging only, report `RISKS / APPROVAL NEEDED`).
- [ ] CI green: build, lint, tests; no high/critical dependency alerts.
- [ ] Database migration tested on a copy; backward compatible or with a rollback script; backup taken.
- [ ] Env vars / secrets present in the target environment (names only in docs, never values).
- [ ] Deployed and smoke-tested on staging / preview URL (main flows, login, forms, payments in test mode).
- [ ] Rollback plan written (previous release / tag, how long it takes).
- [ ] Monitoring: error tracking and uptime check on; who watches the first hour.
- [ ] Changelog / release notes in the PR; DNS, domains and billing untouched unless approved.

## Sources
- The Twelve-Factor App – https://12factor.net/ (checked 2026-11-13)
