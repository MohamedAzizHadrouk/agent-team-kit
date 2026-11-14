---
skill: core-web-vitals
category: performance
use-when: slow site, performance, page speed, Lighthouse, LCP, INP, CLS, SEO technical, landing page build
inputs: URL or local build, framework
output: before/after metrics + list of changes
last-checked: 2026-11-13
---

# Core Web Vitals

## Goal
Make pages pass Google's Core Web Vitals ("good" at the 75th percentile of real visits).

| Metric | Measures | Good |
|---|---|---|
| LCP – Largest Contentful Paint | loading | ≤ 2.5 s |
| INP – Interaction to Next Paint | responsiveness | ≤ 200 ms |
| CLS – Cumulative Layout Shift | visual stability | ≤ 0.1 |

## Steps
1. Measure first: PageSpeed Insights (field + lab data) or Lighthouse in Chrome DevTools; note the numbers.
2. LCP: preload / prioritise the hero image (`fetchpriority="high"`), modern formats (AVIF/WebP), correct sizes,
   CDN, server response time, no render-blocking CSS/JS.
3. INP: split long JS tasks, defer third-party scripts, avoid heavy work in event handlers, reduce hydration.
4. CLS: width/height or aspect-ratio on images and embeds, reserve space for ads/banners, `font-display` strategy.
5. Re-measure and put before/after in the report.

## Pitfalls
- Optimising only the lab score; lazy-loading the LCP image; cookie banners that shift the layout.

## Sources
- web.dev – Web Vitals – https://web.dev/articles/vitals (checked 2026-11-13)
- PageSpeed Insights – https://pagespeed.web.dev/
