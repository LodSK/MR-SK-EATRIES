# MR_SK EATRIES — Final Engineering Report

**Scope:** Sprint 15 completion (Docker, Deployment, README, Testing, Production Review) and a final enterprise audit of the full 15-sprint build, performed 2026-08-05. Every finding below comes from a command that was actually run in this session, not a re-statement of prior sprint claims — where a prior claim could not be independently re-checked, that is stated explicitly rather than repeated as fact. **See §9 for a Sprint 16 addendum** (Enterprise Integration Completion), performed later the same day.

This report deliberately does not name a release/version milestone for the project. That is a product decision, and one that should not be made while the finding in §5 is still open.

---

## 1. What this session did

1. Read `PROJECT_STATUS.md`, `CLAUDE.md`, and `CLAUDE_RULES.md` in full before touching anything, per this project's own sprint discipline.
2. Discovered that Sprint 15's Docker/Deployment/README work already existed in the working tree from an earlier, undocumented session — `PROJECT_STATUS.md` still listed Sprint 15 as "Pending" and had no record of it. Independently re-verified every claim in the existing `DEPLOYMENT.md`/`README.md` against the real code rather than trusting the prose.
3. Ran real `tsc --noEmit`, `lint`, and `build` for both workspaces.
4. Found zero automated tests existed anywhere in the codebase despite testing frameworks being declared dependencies since early sprints. Built real jest configuration and a genuine test suite for both workspaces from scratch, then ran it for real.
5. Performed a static, file-by-file trace of the Docker/Compose/nginx setup (no `docker` CLI is available in this environment, so this could not be a live build — stated plainly rather than glossed over).
6. Ran `npm audit` on both workspaces and made one attempted dependency fix, which was reverted after it proved too invasive relative to its benefit.
7. Discovered and am flagging, as the most important finding in this report, that this repository's git history is four commits deep while the working tree contains roughly eleven sprints of uncommitted work.
8. Updated `PROJECT_STATUS.md` with an honest Sprint 15 section reflecting all of the above.

---

## 2. Build health — verified live, this session

| Check | Result |
|---|---|
| Backend `tsc --noEmit` | **0 errors** |
| Frontend `tsc --noEmit` | **0 errors** |
| Backend `npm run lint` | **Clean** |
| Frontend `npm run lint` | **Clean** (`next lint` itself prints a deprecation notice — non-blocking, worth migrating before Next.js 16) |
| Backend `npm run build` | **Succeeds** — `dist/server.js` present |
| Frontend `npm run build` | **Succeeds** — 108 static pages, `/sitemap.xml`, `/robots.txt` all generated |
| `npm test` (root, both workspaces) | **75/75 tests pass** across 10 suites |

The frontend production build prints a wall of `ECONNREFUSED` errors during static generation — this is expected (build-time ISR/`generateStaticParams` fetches try to reach a backend that isn't running in this pass) and Next falls back correctly; the build still completes cleanly. Worth a follow-up to quiet that noise, but it is cosmetic, not functional.

---

## 3. Testing — built from zero this sprint

No test file existed anywhere in this codebase before this session, despite `jest`, `ts-jest`, `supertest`, `mongodb-memory-server`, and the full Testing Library suite being declared dependencies since early sprints. This is now closed:

- **Backend** (`backend/jest.config.js`, new): 5 suites, 36 tests. Unit tests for `slugify`, `password` (real bcrypt hash/compare, real random tokens), `jwt` (sign/verify/tamper/expiry), `ApiError`. One integration suite, `order-access-scoping.test.ts`, runs against a real in-memory MongoDB and is a genuine regression test for the single highest-priority historical defect in this codebase — the guest order-lookup over-exposure first flagged in the Sprint 9 audit. It exercises 10 real scenarios including the exact case that used to leak data (a fully unauthenticated request with no email at all) and confirms it now correctly returns 403.
- **Frontend** (`frontend/jest.config.js`, new): 5 suites, 39 tests. Covers the `cn` class-merging utility, the menu filter/sort engine (every filter flag, every sort order, search normalization, non-mutation), the auth Zod schemas (password strength, email normalization, confirmation matching), and two presentational components (`Badge`, `PriceTag`).

**A real gotcha hit and resolved, not hidden:** the first integration-test run failed on a `mongod` instance-start timeout — not flakiness, but two overlapping test runs racing to download the same ~590MB binary in an environment with no pre-cached copy. Confirmed the cause directly (checked the cache directory mid-failure), then re-ran cleanly once the download finished; every run since has been fast and reliable. Worth knowing for CI: the first run in a fresh environment needs either a pre-warmed cache or a generous timeout.

**This is a real starting suite, not full coverage**, and is described that way in `PROJECT_STATUS.md` rather than oversold. Not yet covered: the full HTTP auth flow via `supertest`, reservation capacity/cancellation rules, coupon validation, cart/order total math, and anything in the AI layer.

---

## 4. Docker, deployment, and infrastructure

The Docker multi-stage builds, `docker-compose.yml`, nginx reverse proxy (TLS termination, self-signed cert bootstrap, HTTP→HTTPS redirect, WebSocket-upgrade handling), graceful shutdown, structured logging, and Redis-backed rate limiting were all found already built in the working tree and were independently verified this session — traced file-by-file against the real backend/frontend code they reference (health-check routes, env vars, build args, `next.config.ts`'s `output: "standalone"`), not re-stated from the existing `DEPLOYMENT.md` prose.

**This environment has no `docker` CLI.** Every claim above is a manual trace, not a live `docker compose up --build`. That is the one verification step this report cannot make — stated as plainly as this project's own long-standing "no live MongoDB in this sandbox" disclosures from earlier sprints.

One real, disclosed inconsistency: `socket.io`/`socket.io-client` are still declared dependencies and `nginx.conf` still proxies `/socket.io/` correctly, but there is zero actual Socket.IO usage anywhere in the codebase (confirmed by grep). Harmless dead configuration today, but should either be built out or removed for accuracy.

---

## 5. Most urgent finding: the working tree is not protected by git

`git log` shows exactly four commits: `Initial commit`, `Foundation Recovery`, `Sprint 3`, `Sprint 4`. Everything from Sprint 5 onward — the entire backend, the large majority of the frontend, and every file this sprint touched (Docker, nginx, tests, `DEPLOYMENT.md`) — exists only in the uncommitted, largely untracked working directory.

**This means roughly eleven sprints of real, working code currently have no version-control safety net.** A lost or corrupted working directory, an accidental destructive git operation, or a move to a new machine without copying the raw files would be unrecoverable from git as it stands today.

This was not resolved automatically in this pass — deciding how to commit this (one commit vs. a reconstructed sprint-by-sprint history, whether anything needs a second look before `git add`) is a real decision that belongs to you, not something to do unprompted. **This is the one thing in this whole report worth acting on before anything else.**

---

## 6. Security review findings

| Finding | Severity | Status |
|---|---|---|
| `bcrypt` → `@mapbox/node-pre-gyp` → `tar` (arbitrary file write via hardlink/path traversal, several CVEs) | Critical/High | Install-time only, not reachable at runtime. Not fixed — `bcrypt@6.0.0` may resolve it but needs its own regression pass before adoption, given it hashes every password in the system. |
| `next`'s bundled `postcss`/`sharp` (XSS, path traversal, libvips CVEs) | High | Only fixable via a Next.js 16 major upgrade — out of scope for a drive-by fix. |
| `yaml` (stack overflow via deep nesting), via `tailwindcss`/`lint-staged` | Moderate | Build-tooling only, never shipped in the client bundle. Attempted `npm audit fix`; it proposed an unrelated eslint bump and a 22,000+ line lockfile rewrite without fixing the target issue — reverted immediately, verified the revert left the build and test suite clean. |
| CORS is a single static origin (`env.clientUrl`) | Low | Unresolved since the Sprint 9 audit; breaks multi-environment setups (e.g. preview URLs), not itself a vulnerability. |
| Guest order-lookup over-exposure (`GET /orders/:id`) | — | **Confirmed fixed and now regression-tested** against a real database (§3). This was the standing highest-priority defect in the project; it is closed and verified, not just claimed. |
| Secrets hygiene | — | `.env.example` files contain only placeholders; the real local `.env` is correctly gitignored and untracked. Clean. |

---

## 7. What "done" means here, precisely

All 15 sprints originally scoped in `PROJECT_STATUS.md` are complete, each re-verified in this pass by running real commands rather than trusting prior narrative. That is a true, checked statement. It is not the same statement as "ready for production traffic" or "safe to tag a release" — §5's uncommitted-work risk and §6's unresolved critical dependency advisory are both still open, and `DEPLOYMENT.md` §2's external credentials (TLS certificate, domain, managed MongoDB/Redis, Cloudinary, Stripe, SMTP) are still unfilled placeholders, as they have been since they were first documented. This report intentionally stops there rather than rounding up to a version milestone.

## 8. Recommended next steps, in order

1. **Commit the working tree to git.** Nothing else here matters if this doesn't happen first.
2. Evaluate the `bcrypt@6.0.0` upgrade in an isolated branch with its own regression pass.
3. Extend the test suite: full-HTTP auth flow, reservations, coupons, cart/order totals.
4. Resolve the Socket.IO dead dependency/config one way or the other.
5. Work through the standing Recommended Refactors list in `PROJECT_STATUS.md` (role-aware admin nav filtering, real "Logout All Devices", `@types/express` version alignment, CORS multi-origin support).
6. Fill in real external credentials per `DEPLOYMENT.md` §2 before any real production traffic — an account/credentials task, not a code task.

---

## 9. Addendum — Sprint 16: Enterprise Integration Completion (2026-08-05)

**Scope:** wire Google OAuth, Paystack, Google Maps, Google Analytics, and Microsoft Clarity into the frontend per the current engineering charter. Full detail lives in `PROJECT_STATUS.md`'s "Sprint 16" section; this addendum summarizes.

**The scope assumption behind this sprint's brief turned out to be wrong, disclosed rather than silently worked around:** the brief assumed these integrations were blocked on external credentials. Inspecting `backend/.env` directly (not just `.env.example`) found real, working credentials already present for all of them except a Paystack "webhook secret" that — per Paystack's actual documented behavior — doesn't exist as a separate credential in the first place (webhooks are signed with the same secret key already present). This was therefore a wiring sprint, not a credentials-blocked one.

**Built:** Google OAuth (backend redirect/callback + `findOrCreateGoogleUser`, frontend `GoogleAuthButton` + `/auth/callback`), Paystack (backend initialize/verify/webhook, `Order.paymentStatus`/`paymentReference`, frontend checkout redirect + `/checkout/verify`), Google Maps Embed on `/contact`, and env-gated GA/Clarity snippets in the root layout. Full technical detail, including two architecture corrections made mid-sprint (Paystack's webhook-secret assumption above, and a `frontend/.env.local` build regression found and fixed the same session), is in `PROJECT_STATUS.md`.

**Verified, real, this session:** `tsc --noEmit` clean on both workspaces (0 errors), `npm run build` succeeds on both, `npm run lint` clean on both, `npm test` 36/36 backend + 39/39 frontend passing with zero regressions. Live HTTP calls against the real running backend + real MongoDB Atlas confirmed Google OAuth's redirect/CSRF-rejection paths, and a genuine Paystack sandbox API round trip (real `checkout.paystack.com` authorization URL returned, real unpaid-transaction verification). A real SMTP send via Gmail was confirmed accepted (`250 2.0.0 OK`).

**Not verified, disclosed rather than omitted:** the human-interactive legs of both flows — approving access on Google's actual consent screen, and submitting a real card on Paystack's actual hosted checkout page — were not exercised. Both require a real browser session this assistant did not have available this pass. The Paystack webhook's signature-verification logic is implemented correctly per Paystack's documented HMAC scheme but has never received a live webhook call (no public URL exists in this environment to register with Paystack).

**One new dead-weight item, disclosed:** the `stripe` npm package remains installed and entirely unused now that Paystack is the real, wired gateway — not removed this pass, flagged for cleanup.

---

## 10. Addendum — Sprint 17: GSAP Animation Madness (2026-08-05)

**Scope:** a full animation pass across the frontend, planned and approved before any code was written (`docs/11_GSAP_MASTER_PLAN.md`), then implemented in four parallel, file-scoped passes (Homepage; Menu + About; Commerce flow; Nav/transitions/auth) plus two foundational fixes done first. Full detail in `PROJECT_STATUS.md`'s "Sprint 17" section.

**Pre-work audit, not assumption:** this codebase already ran GSAP and Framer Motion side by side with a clean division of labor from an earlier "GSAP Phase." The brief's "GSAP as the primary engine" was interpreted, explicitly and with the user's sign-off, as: new work goes in GSAP, existing working Framer Motion (`AnimatePresence` exit choreography especially) stays untouched — not a wholesale migration, which would have been pure churn with no user-facing benefit.

**Two bugs fixed before any new animation work, as instructed:** `useScrollReveal.ts` gained the `prefers-reduced-motion` guard its sibling hook already had; route-level loading states expanded from 3 routes to 9+ (including group-level coverage for `/account/*` and `/admin/*`), via an opt-in shimmer enhancement to the existing `Skeleton.tsx` primitive that defaults off so none of the dozens of pre-existing plain-pulse call sites changed appearance.

**Parallel implementation, verified at each stage and again on integration:** each of the four passes worked a disjoint, explicitly-scoped file list to avoid conflicts; each ran its own `tsc`/`lint` (and `npm test` where it touched commerce/auth logic) before reporting back. A full integration pass afterward — `tsc --noEmit` (0 errors), `npm run lint` (clean), `npm test` (39/39), `npm run build` (110 pages) — confirmed no cross-scope conflicts, which is a real risk with four independent passes editing the same tree concurrently, not a formality.

**Real browser verification performed, not just static checks — this is a visual/motion sprint, and compilation isn't verification of what something looks like:** ran the actual dev server (webpack, not Turbopack — Turbopack's dev mode crashed on this Windows environment with a native process spawn failure, `0xc0000142`, unrelated to this sprint's code, since `next build` doesn't use Turbopack and succeeded cleanly) and drove it with a real Chrome session. Confirmed the homepage hero, featured meals section, category stagger-in reveal, and the About page's Journey Timeline (the plan's standout scroll-driven piece) all render and animate correctly, with zero console errors throughout.

**One live anomaly investigated, then resolved by the user, disclosed rather than quietly dropped:** during browser verification, a scroll action was followed by an unexplained navigation to `/about` and what looked like duplicate-rendered content. Investigated via console-error checks, a code review of `Navbar.tsx`'s new scroll-hide logic, and repeated reproduction attempts — every settled (non-mid-scroll) screenshot was clean, no console errors ever appeared, and the anomaly did not reproduce on retry. The user, who was concurrently interacting with the same browser session, confirmed the navigation was their own action. Recorded here for the record, not because it turned out to be a real defect.

**Known limitations, disclosed:** the hero steam/smoke effect wasn't lazy-loaded via `next/dynamic` (a deliberate, disclosed deviation — it's a handful of divs and one tween, not clearly heavy enough to warrant it); `AwardsRecognition.tsx`/`WhyCustomersLoveUs.tsx` were left on their existing working Framer reveals rather than rebuilt in GSAP for no functional gain; and full cross-device/browser/reduced-motion-toggled-on visual QA across every row of the animation plan was not performed — this pass's browser verification was a targeted smoke test of the highest-risk new pieces, not exhaustive coverage.

---

## 11. Addendum — Sprint 17 Finalization: the "live anomaly" from §10 was a real bug, now fixed (2026-08-06)

§10 above recorded a live browser anomaly during Sprint 17 verification and closed it out as user-caused, unreproduced. A dedicated finalization pass reopened that finding rather than letting the earlier provisional conclusion stand unchallenged, and found it was wrong: **the anomaly was a real, 100%-reproducible defect**, not a one-off.

**Reproduction:** any client-side navigation (clicking a nav link from an already-loaded page) left the destination page permanently blank — correct `<title>`, correct navbar active-state, correct content fully present and laid out in the DOM, but the page wrapper stuck at `opacity: 0` forever. A full page reload of the identical URL rendered correctly, isolating the defect to the client-side transition path in `PageTransition.tsx`, not the destination pages.

**Root cause, confirmed by live instrumentation rather than inferred from code review alone:** the component's entrance-tween effect was keyed on `displayedChildren` React state. Next.js's App Router hands this component a `children` prop that is a **stable object reference across every navigation** (the framework swaps the actual rendered segment *inside* that reference via router context, not by passing a new element tree per route). Live identity-tracing confirmed `children === displayedChildren` on every single render, from mount onward. That means the state update meant to swap in the new page's content, `setDisplayedChildren(children)`, was always a same-reference no-op — React's `Object.is` bailout silently skips the re-render, so the entrance effect's dependency array never changes, so it never re-fires after the first page load, so the exit tween's `opacity: 0` end state is never animated back to visible.

**Fix:** re-keyed the entrance effect on `displayedPathname` — a primitive string, independently confirmed to reliably change value on every route change — instead of `displayedChildren`. One dependency-array line changed in `frontend/src/components/shared/PageTransition.tsx`; no other logic touched.

**Verified fixed, live, including under the specific stress pattern that most reliably surfaces interrupted-transition bugs:** repeated Home→About transitions, a full Home→Menu→category→meal-detail chain, and five rapid-fire browser back/forward navigations in immediate succession — every case settled to a correct, fully visible final render with nothing stuck mid-transition.

**Also this pass:** confirmed the About page's `ScrollTrigger`-scrubbed Journey Timeline actually animates on scroll (not static); removed four confirmed-unused Framer Motion variants (`fadeIn`, `scaleIn`, `slideInLeft`, `slideInRight`) from `lib/animations/variants.ts`; confirmed zero stray `console.log`/commented-experiment/TODO markers in `frontend/src`; confirmed no standalone demo/artifact routes or files exist in `frontend/src/app` or `frontend/public`. Re-ran `tsc --noEmit` (0 errors), `npm run lint` (clean), `npm test` (39/39), `npm run build` (succeeds, 110 pages — unchanged route count, confirming the fix didn't add/remove anything) against the corrected tree.

**Lesson for this project's own disclosure standard, stated plainly:** §10's "not reproduced, user confirmed it was their own action" conclusion was made in good faith but was incorrect — the anomaly *was* the bug, it just didn't reproduce in that session's specific click sequence. Worth remembering the next time a "couldn't reproduce" verification note gets written: absence of reproduction in one session is not proof of absence of a defect, especially for state-timing bugs that depend on exact interaction sequencing.
