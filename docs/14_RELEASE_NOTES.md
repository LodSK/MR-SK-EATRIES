# Release Notes

No version/release milestone has been formally tagged for this project yet — `PROJECT_STATUS.md`'s "Roadmap Status" section deliberately stops short of declaring one, since that's a product decision for the project owner, not something to assert from inside a status file.

## Sprint 17 — 2026-08-05 — GSAP Animation Madness

- **Added:** Cinematic homepage motion — hero steam/smoke drift, distinct stagger reveals per section, GSAP hover on meal cards, scroll-scrubbed testimonial parallax, animated newsletter success checkmark.
- **Added:** Menu grid smoothly re-flows (GSAP `Flip`) on filter/sort change instead of snapping; meal detail page gained a hero parallax-in and add-to-cart pulse.
- **Added:** About page's Journey Timeline now visually draws its connecting line as you scroll — the sprint's standout piece.
- **Added:** Real checkmark/cross draw-in animations on order confirmation and Paystack payment verification, replacing static icons and hard state cuts.
- **Added:** Navbar hides on scroll-down, reveals on scroll-up. Route transitions gained a real exit animation (previously entrance-only).
- **Added:** Route-level loading states expanded from 3 routes to 9+, including `/checkout`, `/cart`, `/reservations`, and group-level coverage for `/account/*` and `/admin/*`.
- **Fixed:** `useScrollReveal` now respects `prefers-reduced-motion`, matching its sibling hook.
- **Known gaps:** full cross-device/browser and reduced-motion-toggled-on visual QA across every animation wasn't performed this pass — see `PROJECT_STATUS.md`'s Sprint 17 section for the full disclosure, including a couple of deliberate, disclosed deviations from the original animation plan.

## Sprint 16 — 2026-08-05 — Enterprise Integration Completion

- **Added:** "Continue with Google" sign-in (OAuth 2.0, backend-driven redirect flow).
- **Added:** Real card payments via Paystack — checkout redirects to Paystack's hosted page; payment is verified server-side before an order is confirmed.
- **Added:** Google Maps embed on the Contact page.
- **Added:** Google Analytics and Microsoft Clarity tracking (env-gated — inactive unless real IDs are configured).
- **Fixed:** Confirmed real SMTP credentials are present and working (live-verified send) — email delivery, previously a known blocker, is functional.
- **Changed:** "card" orders now track `paymentStatus` separately from fulfillment `status`; the order confirmation email for card orders is sent on payment confirmation, not at order creation.
- **Known gaps:** the human-interactive legs of both new flows (Google's consent screen, Paystack's hosted checkout page) were not exercised in a live browser this sprint — see `PROJECT_STATUS.md`'s Sprint 16 section for the full disclosure. Paystack webhook delivery is implemented but has never received a live call (no public URL available in this environment).

## Sprint 15 — 2026-08-05 — Docker, Deployment, Testing, Production Review

See `PROJECT_STATUS.md` and `ENGINEERING_REPORT.md` for full detail — Docker/Compose/nginx, a real test suite built from zero, a production build/lint/audit pass, and the discovery (since resolved) that most of the codebase existed only in the uncommitted working tree.

## Sprints 1–14

See `12_SPRINT_HISTORY.md` and `PROJECT_STATUS.md` for the full per-sprint breakdown.
