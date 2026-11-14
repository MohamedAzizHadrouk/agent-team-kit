---
skill: wcag-22-check
category: accessibility
use-when: accessibility, a11y, WCAG, contrast, keyboard, focus, screen reader, forms, login, touch targets, design review
inputs: screens / prototype / URL
output: checklist with pass / fail per item + fixes in the design
last-checked: 2026-11-13
---

# WCAG 2.2 AA check

## Core checks (levels A + AA)
- [ ] Text contrast ≥ 4.5:1 (large text ≥ 3:1); UI parts and focus indicators ≥ 3:1.
- [ ] Everything works with the keyboard; visible focus; logical focus order.
- [ ] Images have alt-text notes; icon-only buttons have labels.
- [ ] Form fields have visible labels; errors say what is wrong and how to fix it.
- [ ] Colour is never the only signal; text resizable to 200 %; content reflows at 320 px wide.
- [ ] Headings and landmarks structure; page language set (and RTL when Arabic is used).

## New in WCAG 2.2 (A / AA) – check explicitly
- [ ] **2.4.11 Focus Not Obscured (Minimum)** – sticky headers, cookie banners and chat widgets never fully hide the focused element.
- [ ] **2.5.7 Dragging Movements** – every drag action has a single-pointer alternative (buttons, tap).
- [ ] **2.5.8 Target Size (Minimum)** – targets ≥ 24×24 CSS px or enough spacing (house rule stays 44 px on mobile).
- [ ] **3.2.6 Consistent Help** – help / contact link in the same place on every page.
- [ ] **3.3.7 Redundant Entry** – never ask for the same information twice in a flow (prefill or let users pick).
- [ ] **3.3.8 Accessible Authentication (Minimum)** – no memory or puzzle test to log in; allow paste and password managers.

## Sources
- W3C – What's New in WCAG 2.2 – https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/ (checked 2026-11-13)
- WCAG 2.2 Quick Reference – https://www.w3.org/WAI/WCAG22/quickref/
