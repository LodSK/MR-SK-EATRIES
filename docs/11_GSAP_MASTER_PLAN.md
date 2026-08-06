# Sprint 17 — GSAP Animation Madness: Animation Plan

**Status:** APPROVED (with refinements) and IMPLEMENTED — 2026-08-05. See `PROJECT_STATUS.md`'s "Sprint 17" section and `ENGINEERING_REPORT.md` §10 for what was actually built and verified against this plan, including a few deliberate, disclosed deviations (e.g. `AwardsRecognition`/`WhyCustomersLoveUs` left on their existing working Framer reveals rather than rebuilt in GSAP).

**Audit basis:** a full read-only audit of `frontend/src/` (existing GSAP usage, existing Framer Motion usage, every route, every loading state, `prefers-reduced-motion` coverage, and existing performance patterns). Findings are in §0 below and are the ground truth this plan is built against — not assumptions.

---

## 0. What already exists (don't rebuild this)

This is **not a greenfield animation pass.** The codebase already runs two animation libraries with a clean, deliberate division of labor from a prior "GSAP Phase":

| Concern | Library | Where |
|---|---|---|
| Global smooth scroll (Lenis synced to ScrollTrigger) | GSAP | `SmoothScrollProvider.tsx` |
| Route entrance transition | GSAP | `PageTransition.tsx` (entrance-only, no exit choreography) |
| Scroll-triggered section reveals | GSAP | `useScrollReveal()` — only 3 call sites today (`JourneyTimeline`, `OurStory`, `WhyChooseUs`) |
| Image clip-path reveal on scroll | GSAP | `useImageReveal()` — `MealCard`, `SpecialCard`, `MenuCard`, `BlogCard` |
| Animated count-up numbers | GSAP | `StatCard.tsx` |
| Hero headline word flip-in | GSAP | `Hero.tsx` |
| AI chat widget micro-interactions | GSAP | `ChatButton`/`ChatWidget`/`ChatMessageBubble`/`TypingIndicator` |
| Hero scroll parallax | Framer Motion | `Hero.tsx` (`useScroll`/`useTransform`) |
| Section fade/stagger reveals | Framer Motion | `lib/animations/variants.ts` — used across Home, About, Gallery, FAQ |
| Card hover lift | Framer Motion | `MealCard.tsx`, `MenuCard.tsx` (`whileHover={{ y: -6 }}`) |
| Mobile menu slide panel | Framer Motion | `MobileMenu.tsx` |
| Cart drawer, checkout, reservation confirmation | Framer Motion | respective components |
| Branded loading screen | Framer Motion | `LoadingScreen.tsx` (root `loading.tsx` only) |

All existing GSAP call sites use raw `gsap.context()` + `ctx.revert()`/`tween.kill()` cleanup — **not** `@gsap/react`'s `useGSAP` hook. ScrollTrigger is registered once, SSR-guarded, in `lib/animations/gsap.ts`.

**Two real gaps found, not opinions — fix these regardless of anything else in this plan:**
- `useScrollReveal.ts` does **not** check `prefers-reduced-motion` (its sibling `useImageReveal` does — this is an inconsistency, not a design choice).
- Zero `will-change` CSS anywhere in the codebase; only one `next/dynamic` lazy-load exists (the chat widget).
- Only 3 routes have a `loading.tsx` (root, `/menu`, `/menu/[category]`) — every other route, including checkout/cart/account/admin, has no route-level loading state at all.

### Architecture decision this plan is making — flagging it explicitly rather than silently choosing

"Use GSAP as the primary animation engine" does **not** mean ripping out the 34 files of working, tested Framer Motion and rebuilding them in GSAP. That would be pure churn: high regression risk, no user-facing benefit, and directly against the standing engineering principle of not rewriting working code without a reason. Instead, this plan proposes:

- **All new Sprint 17 animation work is built in GSAP** (ScrollTrigger-driven storytelling, steam/smoke effects, new hover choreography, new loading states, checkout/cart/reservation enhancements) — reusing the existing `gsap.context()` cleanup pattern and the existing `useScrollReveal`/`useImageReveal` hooks (extended, not replaced) rather than inventing a second convention.
- **Existing Framer Motion stays exactly as-is** where it already does the job well (mobile menu slide panel, cart drawer, `AnimatePresence` exit choreography — GSAP doesn't have an equivalent primitive as clean as Framer's `AnimatePresence` for unmount transitions, so replacing it would be a downgrade, not an upgrade).
- Net effect: GSAP becomes primary for everything *new* in this sprint and for scroll-driven work generally; Framer Motion keeps its existing, narrower role. **If you want a full migration instead, say so explicitly** — it's a materially larger, riskier scope than what's below.

---

## 1. Animation Plan

Legend for **Trigger**: `Load` = on mount/page load · `Scroll` = ScrollTrigger, viewport entry · `Hover` = pointer hover/focus · `Click` = user action · `Route` = navigation change · `State` = data/async state change.

### Tier 1 — Homepage (highest traffic, sets the "cinematic" tone)

| Section | Component | Animation | Trigger | UX Objective |
|---|---|---|---|---|
| Hero | `Hero.tsx` | *Enhance existing*: layer a subtle steam/smoke drift effect (looping, low-opacity, CSS-driven with a GSAP-tweened opacity/position wobble, not a heavy particle system) behind the hero food image | Load | Make the hero feel alive without competing with the existing headline flip-in |
| Today's Specials | `TodaysSpecials` | New: ScrollTrigger horizontal-reveal stagger as cards enter | Scroll | Guide attention to the rotating specials as a "featured" moment |
| Featured Meals | `FeaturedMeals` → `MealCard` | *Extend existing* `useImageReveal`; add GSAP hover tilt/scale micro-interaction (replacing Framer's plain `y: -6` lift with a slightly richer GSAP hover — subtle scale + shadow-depth change) | Scroll (image), Hover (card) | Make cards feel touchable/premium, not just "content that lifts" |
| Categories | `Categories` | New: ScrollTrigger stagger-in per category tile | Scroll | Reinforce menu structure as the visitor scans past |
| Why Choose Us | `WhyChooseUs` | *Already has* `useScrollReveal` — no change needed beyond the reduced-motion fix in §0 | Scroll | (already correct) |
| Stats | `StatCard` | *Already correct* (count-up, `once`, reduced-motion respected) — no change | Scroll | (already correct) |
| Testimonials | `Testimonials` | New: gentle parallax drift on quote cards as the section scrolls (small `y` offset tied to scroll progress, ScrollTrigger `scrub`) | Scroll | Add depth/storytelling without a full carousel rebuild |
| Instagram Gallery | `InstagramGallery` | New: staggered scale-in grid reveal | Scroll | Make the gallery feel like a curated wall, not a static grid |
| FAQ | `FAQ` | Leave as-is (accordion interaction is already appropriately minimal — an FAQ is a utility, not a moment) | — | Avoid clutter — an FAQ shouldn't be "cinematic" |
| Newsletter | `Newsletter` | New: subtle input-focus glow + success-state check-mark draw-in (SVG stroke animation) on subscribe | Click/State | Give the one conversion action on this section a moment of delight |

### Tier 1 — Menu

| Section | Component | Animation | Trigger | UX Objective |
|---|---|---|---|---|
| Category grid | `/menu` category cards | New: staggered ScrollTrigger reveal, matching homepage Categories treatment for consistency | Scroll | Visual continuity between home and menu |
| Menu grid/browser | `MenuGrid`/`MenuCard` | *Extend existing* `useImageReveal`; add filter/sort transition (items re-flow with a short FLIP-style GSAP transition instead of an instant re-layout snap) when filters change | Scroll (image), State (filter change) | Filtering should feel like the menu is *responding*, not just re-rendering |
| Item detail (`/menu/[category]/[slug]`) | meal detail page | New: hero image parallax-in on load, price/add-to-cart button micro-pulse on successful add | Load, Click | Make the single highest-intent page (deciding what to order) feel premium |

### Tier 1 — About

| Section | Component | Animation | Trigger | UX Objective |
|---|---|---|---|---|
| Hero | `Hero` (about variant) | Match homepage hero treatment for consistency | Load | Brand continuity |
| Our Story | `OurStory` | *Already has* `useScrollReveal` — apply the reduced-motion fix, otherwise unchanged | Scroll | (already correct) |
| Meet Our Chefs | `MeetOurChefs` | New: portrait cards with a subtle GSAP hover reveal (name/title slide up over the portrait) | Hover | Turn a static team grid into something that invites exploration |
| Journey Timeline | `JourneyTimeline` | *Already has* `useScrollReveal` — extend with a GSAP-drawn connecting line that "grows" as the visitor scrolls through the timeline (`ScrollTrigger scrub` on an SVG stroke) | Scroll | Reinforce "journey" as a literal, visual progression — the single best parallax-storytelling opportunity on the site |
| Awards & Recognition | `AwardsRecognition` | New: simple stagger-in, no more | Scroll | Credibility signal, doesn't need heavy treatment |
| Why Customers Love Us | `WhyCustomersLoveUs` | New: stagger-in matching `WhyChooseUs` pattern | Scroll | Consistency |
| CTA | `CTA` | New: button micro-interaction (magnetic hover — button subtly follows cursor within a small radius) | Hover | End the page on a premium, intentional note |

### Tier 1 — Commerce flow (cart → checkout → confirmation)

| Section | Component | Animation | Trigger | UX Objective |
|---|---|---|---|---|
| Cart drawer | `CartDrawer.tsx` | Leave Framer Motion as-is (already handles slide/backdrop well via `AnimatePresence`) | — | Don't fix what isn't broken |
| Mini cart badge | `MiniCartBadge.tsx` | New: GSAP "bump" (scale pulse) when quantity changes, replacing/augmenting whatever currently happens on add | State | Confirm the add-to-cart action registered, at a glance |
| Checkout form | `CheckoutForm.tsx` | New: step/section reveal as delivery method or payment method changes (form sections should animate in/out, not snap) | State | Reduce the "form just changed under me" jolt common in multi-branch checkout forms |
| Checkout confirmation | `CheckoutPageContent.tsx` | *Enhance existing* Framer success state with a GSAP checkmark draw-in | State | Make order confirmation feel like a genuine payoff moment |
| Checkout payment verify (new page, Sprint 16, no animation yet) | `CheckoutVerifyContent.tsx` | New: loading → success/failure state transition (spinner morphs into check/X, not an abrupt swap) | State | This page currently hard-cuts between states — smooth that specifically |
| Reservation confirmation | `ReservationConfirmation.tsx` | Leave Framer as-is | — | Already appropriate |

### Tier 2 — Navigation & global chrome

| Section | Component | Animation | Trigger | UX Objective |
|---|---|---|---|---|
| Navbar | `Navbar.tsx` | New: scroll-direction-aware hide/reveal (already common on premium sites) + subtle background blur/opacity transition on scroll past hero | Scroll | Keep nav out of the way during hero moments, present when needed |
| Mobile menu | `MobileMenu.tsx` | Leave Framer as-is | — | Already correct |
| Page transitions | `PageTransition.tsx` | *Enhance existing* GSAP entrance-only transition with a matching exit choreography (currently entrance-only, per the audit) | Route | Close the one disclosed gap in the existing transition system |
| Back to top | `BackToTop.tsx` | Leave Framer as-is | — | Already correct |

### Tier 2 — Loading states (currently only 3 of 55+ routes have one)

| Scope | Animation | Trigger | UX Objective |
|---|---|---|---|
| New `loading.tsx` for `/checkout`, `/cart`, `/reservations`, `/account/*`, `/blog/[slug]`, `/menu/[category]/[slug]` | Lightweight branded skeleton (reuse the existing dashboard "Skeleton" pattern already established in admin components — don't invent a second skeleton convention) with a GSAP shimmer sweep | Route (Suspense boundary) | Every route users actually wait on should feel intentional, not blank |
| Admin routes | Same skeleton pattern, no shimmer/branding flourish | Route | Admin is a working tool — functional loading state, not a "moment" |

### Tier 3 — Account dashboard (`/account/*`)

Light, consistent touch only — this is a utility area a logged-in customer visits repeatedly; heavy animation here becomes friction, not delight, on the 10th visit.

| Scope | Animation | Trigger | UX Objective |
|---|---|---|---|
| All `/account/*` pages | Simple fade/slide-up on section mount (existing `fadeUp` Framer variant, already used elsewhere — reuse, don't reinvent) | Load | Consistency with the rest of the site's entrance feel, nothing more |
| Order/reservation status changes | Small state-change pulse on status badges | State | Confirm to the user that something changed, without a full re-animation |

### Tier 4 — Admin (`/admin/*`) — deliberately minimal

**Recommendation: no cinematic treatment.** Admin is an internal operational tool used by staff many times a day. The brief's own rule — "never animate simply because it is possible" — applies most directly here. Proposed scope is limited to:
- The reduced-motion and loading-skeleton fixes from §0/Tier 2 (functional, not decorative).
- Leave existing chart/analytics rendering as-is.

### Tier 2 — Auth pages

| Scope | Animation | Trigger | UX Objective |
|---|---|---|---|
| Login/Register/Forgot/Reset/Verify-email | Simple fade/slide-up entrance only (reuse `fadeUp`) | Load | Consistency, low-stakes utility flow — don't slow down someone trying to log in |
| `/auth/callback`, `/checkout/verify` (Sprint 16 pages, currently unanimated) | Loading spinner → success/failure state transition, matching the Tier 1 checkout-verify treatment | State | Close the gap these two new pages currently have |

---

## 2. Performance requirements (applies to every item above, not repeated per row)

- Target 60fps: prefer `transform`/`opacity` tweens over layout-triggering properties; add `will-change: transform` only on elements actively animating, removed after (currently zero uses in the codebase — this sprint introduces the pattern deliberately, not everywhere).
- Every new scroll/hover animation checks `prefers-reduced-motion` via the existing `useReducedMotion` hook — extending `useScrollReveal` to check it closes the one real gap found in the audit; every new hook/component follows the same pattern from day one.
- No new layout shift: reveals animate opacity/transform, never width/height/margin in a way that reflows surrounding content.
- Steam/smoke and parallax effects are lazy-loaded (`next/dynamic`, matching the one existing precedent — the chat widget) so they don't add to initial bundle weight for users who never scroll that far.
- Admin routes get the minimal-motion treatment specifically to protect perceived performance for staff running the tool all day.

## 3. What this plan deliberately does NOT do

- No wholesale Framer → GSAP migration (see architecture decision in §0).
- No animation added to FAQ accordions, legal pages (`/privacy`, `/terms`), or admin data tables — utility surfaces where motion adds clutter, not clarity.
- No heavy particle-system steam/smoke (canvas/WebGL) — a CSS+GSAP-tweened layered gradient/blur effect achieves "natural, not distracting" at a fraction of the performance cost, matching the brief's own "never animate simply because it is possible" instruction.

---

**Next step:** implementation begins only after this plan is approved or amended.
