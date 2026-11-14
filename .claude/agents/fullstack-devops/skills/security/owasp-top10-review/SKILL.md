---
skill: owasp-top10-review
category: security
use-when: security review, auth, login, permissions, API, upload, payment, before merge or deploy, pentest prep, "is it secure"
inputs: repo / PR diff, stack, what data the app handles
output: findings table (risk, file:line, fix) + fixes in the PR
last-checked: 2026-11-13
---

# Security review against the OWASP Top 10:2025

## Goal
Check a change or an app against the 10 most critical web risks before it is merged or deployed.

## Steps – go through each category, note "OK / finding / n.a."
1. **A01 Broken Access Control** – every route and API checks the user's rights server-side; no IDOR (ids in URLs
   checked against the owner); deny by default; SSRF: validate outbound URLs (SSRF is now part of A01).
2. **A02 Security Misconfiguration** – no debug mode / default accounts in prod; security headers (CSP, HSTS,
   X-Content-Type-Options); CORS restricted; cloud buckets private.
3. **A03 Software Supply Chain Failures** – lockfile committed; `npm audit` / `pip-audit` / Dependabot clean of
   high/critical; no abandoned or typo-squatted packages; CI actions pinned; build from a trusted pipeline.
4. **A04 Cryptographic Failures** – HTTPS everywhere; passwords hashed with argon2id / bcrypt; no home-made crypto;
   secrets only in env / secret manager (golden rule 5).
5. **A05 Injection** – parameterised queries / ORM; output encoding against XSS; no `eval` / shell with user input.
6. **A06 Insecure Design** – abuse cases written for sensitive flows (reset password, payments); rate limits.
7. **A07 Authentication Failures** – MFA possible for admins; brute-force protection; secure session cookies
   (HttpOnly, Secure, SameSite); session invalidated on logout / password change.
8. **A08 Software or Data Integrity Failures** – signed / verified updates and webhooks; no unsafe deserialisation.
9. **A09 Security Logging and Alerting Failures** – auth failures and admin actions logged (no secrets / personal
   data in logs) and someone is alerted.
10. **A10 Mishandling of Exceptional Conditions** – errors fail closed, no stack traces to users, timeouts and
    partial failures handled.

## Output
| # | Category | Finding | Where (file:line) | Severity | Fix |
Fix critical/high in the same PR; list the rest under RISKS.

## Pitfalls
- Client-side checks only. Logging tokens or personal data. "We'll add auth later".

## Sources
- OWASP Top 10:2025 – https://owasp.org/Top10/2025/ (checked 2026-11-13)
- OWASP Cheat Sheet Series – https://cheatsheetseries.owasp.org/
