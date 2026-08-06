# Sprint History

**This file is intentionally a pointer, not a duplicate.** The real sprint-by-sprint history — every sprint from Foundation Recovery through Sprint 16, each with what was built and what was verified — lives in the "Sprint Checklist" table and per-sprint sections of `PROJECT_STATUS.md` at the repository root.

Read `../PROJECT_STATUS.md`. See `04_PROJECT_STATUS.md` in this folder for why this doc set points there instead of duplicating it.

**Quick index** (detail in the root file):

| Sprint | Scope |
|---|---|
| 1–2 + Foundation Recovery | Architecture, layouts, theme, consolidation |
| 3–4 | Homepage |
| 5 | About page |
| 6 | Menu system |
| 7 | Cart & checkout |
| 8 | Auth (local email/password) |
| 9 | Real backend: Express, MongoDB, models, routes |
| 10 | Reservations |
| 11 | Customer dashboard |
| 12 (+12.1) | Admin dashboard, stabilization patch |
| 13A–13C | AI: backend architecture, chat widget, admin AI dashboard |
| 14 | Performance, SEO, accessibility, caching |
| 15 | Docker, deployment, testing, production review |
| 16 | Enterprise integration completion: Google OAuth, Paystack, Google Maps, GA/Clarity, real SMTP verification |
| 17 | GSAP Animation Madness: cinematic homepage/menu/about motion, commerce flow polish, nav/transitions, expanded loading states |
| 17 Finalization | Disappearing-page regression root-caused and fixed (`PageTransition.tsx` entrance effect was keyed on a Next.js `children` reference that never actually changes identity across navigations — re-keyed on `pathname` instead), page-visibility and animation verification, unused animation code removed, no standalone artifact code confirmed |
