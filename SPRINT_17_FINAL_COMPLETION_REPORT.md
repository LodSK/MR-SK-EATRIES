# Sprint 17 Final Completion Report — GSAP Animation Madness (Finalization Pass)

**Date:** 2026-08-06
**Scope:** Verify Sprint 17's "disappearing-page" regression is genuinely resolved (not just undocumented-as-open), confirm every page stays visible after a client-side route transition, confirm the sprint's signature GSAP animations actually run, remove unused/experimental animation code, confirm no standalone artifact code exists in the app, and bring the four project docs up to date.
**Full detail:** `PROJECT_STATUS.md` (Sprint 17 Finalization subsection), `ENGINEERING_REPORT.md` (finalization addendum), `docs/12_SPRINT_HISTORY.md`.

---

## 1. The Disappearing-Page Regression — Root Cause Found and Fixed

Sprint 17's own completion notes (`PROJECT_STATUS.md`, "Verification performed") recorded a one-off "apparent duplicate-content render and an unexplained navigation to `/about`" that was investigated at the time, never reproduced again, and provisionally attributed to the user's own concurrent navigation rather than a bug. That was not the end of the story.

**Reproduced live, 100% of the time, on every client-side navigation:** starting from the homepage and clicking any nav link (`About`, `Menu`, a category, a meal detail page) left the destination page's `<main>` content permanently invisible — navbar and page `<title>` updated correctly, the correct content was fully present and correctly laid out in the DOM underneath, but the page body rendered as blank. Confirmed via computed styles: the page wrapper `<div>` was stuck at `opacity: 0; transform: translate(0px, -14px)` — exactly the end state of `PageTransition.tsx`'s exit tween — forever. A hard/full page reload of the same URL rendered perfectly, proving the bug was specific to the client-side transition path, not the destination pages themselves.

**Root cause, confirmed via live instrumentation (not guessed):** `PageTransition.tsx`'s entrance-animation effect was keyed on React state `displayedChildren`:

```ts
useEffect(() => { /* entrance tween */ }, [displayedChildren]);
```

Next.js's App Router passes `children` into this component as a stable internal routing-slot reference — **the same object identity across every navigation** (the actual per-route segment swap happens *inside* that reference via router context, not by Next handing this component a fresh element tree per route). Live identity tracing confirmed `children === displayedChildren` was `true` on every render, from the very first mount through every subsequent route change. That means `setDisplayedChildren(children)` — called from the exit tween's `onComplete` — was **always a same-reference no-op** that React's `Object.is` bailout silently skips: no re-render is scheduled for that state, so the entrance effect's dependency never changes, so it never re-fires after the initial page load. The destination page's real content still updated (driven by Next's own router context, independent of this component's props), but the transition wrapper's opacity was never animated back to `1`.

**Fix:** the entrance effect is now keyed on `displayedPathname` instead — a plain string that reliably changes value on every navigation (`pathname` itself was independently confirmed, via the same instrumentation, to update correctly on every route change). No other logic in `PageTransition.tsx` changed.

```diff
- }, [displayedChildren]);
+ }, [displayedPathname]);
```

File changed: `frontend/src/components/shared/PageTransition.tsx`.

**Verified fixed**, live, after the change:
- Home → About (repeated, clean runs): content fades in and settles fully visible every time.
- Home → Menu → Breakfast category → Shakshuka meal detail: every hop transitions and renders correctly.
- **Rapid-fire interruption stress test**: 5 back/forward browser-history navigations fired in immediate succession (`breakfast` → `menu` → `breakfast` → `shakshuka` → `breakfast`) — the transition settled to a fully visible, correct final state with no stuck/blank page, no leftover partial-opacity state.
- `/cart` (empty-state) renders correctly.

## 2. Page Visibility — Verified

Every page navigated to during this pass (Home, About, Menu, Menu/Breakfast, Menu/Breakfast/Shakshuka, Cart) rendered its content and reached full visibility after transitioning. No blank pages reproduced after the fix, including under the rapid-navigation stress case that is the classic trigger for interrupted-transition bugs.

**Not exercised live this pass** (stated plainly rather than silently assumed fine): `/checkout`, `/reservations`, and the auth-gated `/account/*` and `/admin/*` trees were not clicked through in this session — the fix is in a single shared, non-route-specific component (`PageTransition.tsx` wraps every route identically via `root layout.tsx`), and the mechanism verified (the entrance effect now reliably fires on every `pathname` change, regardless of destination) applies uniformly. Recommended as the first item of any follow-up visual QA pass.

## 3. Sprint 17 Animation Verification

| Animation | Result |
|---|---|
| Page enter/exit transition (`PageTransition.tsx`) | Fixed and verified — see §1. |
| About page Journey Timeline (`ScrollTrigger scrub`-driven SVG `stroke-dashoffset` draw, milestone fade-in) | Live-verified: scrolling into the section shows the connecting line progressively drawing and each milestone's copy fading in in step with scroll position, not statically rendered. |
| Homepage hero steam/smoke drift, headline word fly-in | Present and reviewed in code (`Hero.tsx`); non-blocking (`pointer-events-none`, `aria-hidden`), self-contained `gsap.context()`/cleanup, no interaction with the page-transition bug. Not re-verified live to the frame this pass beyond the homepage loads already performed during transition testing, which rendered correctly. |
| Menu category grid GSAP `Flip` re-flow (`MenuGrid.tsx`) | Reviewed in code — correctly guards against animating on first mount (`isFirstRun`), reduced-motion, and empty/loading states. Not exercised live via an actual filter/sort interaction this pass. |
| `useScrollReveal` / `useImageReveal` hooks | Reviewed in code — both correctly check `prefers-reduced-motion`, both use `gsap.context()` + `.revert()` cleanup. No defects found. |

## 4. Unused/Experimental Animation Code Removed

`frontend/src/lib/animations/variants.ts` defined four Framer Motion variants — `fadeIn`, `scaleIn`, `slideInLeft`, `slideInRight` — that were never imported by any component anywhere in the codebase (confirmed by grep across `frontend/src`, cross-checked for dynamic/string-keyed access, and checked against every test file). Removed. The four variants actually in use (`fadeUp`, `staggerContainer`, `menuPanel`, `backdropFade`) and the shared `EASE_OUT_EXPO` constant are untouched.

No `console.log`/`console.debug` statements, commented-out GSAP experiment blocks, or TODO/FIXME markers were found anywhere in `frontend/src` (grepped explicitly for this pass).

Note: the live-instrumentation `console.log` calls added to `PageTransition.tsx` to diagnose §1's root cause were added and removed entirely within this same session — the file committed to history never contained them.

## 5. Standalone Artifact Code — None Found

Checked `frontend/src/app` (every route folder) and `frontend/public` (every file) for leftover animation-demo/playground routes or scratch HTML. Every route folder corresponds to a real, documented feature; `public/` contains only favicons, icons, real content images, and `manifest.json`. Nothing to remove.

---

## 6. Verification Evidence

Everything below is a command run in this session, against the current working tree (which now includes both the unfixed-but-committable Sprint 16/17 work and this pass's fix).

| Check | Result |
|---|---|
| Frontend `tsc --noEmit` | 0 errors |
| Frontend `npm run lint` | Clean (`next lint`, no warnings or errors) |
| Frontend `npm test` | 39/39 passing, zero regressions |
| Frontend `npm run build` | Succeeds — 110 pages, matching the pre-fix baseline (no route added/removed by this pass) |
| Live browser reproduction of the bug | Confirmed, repeatedly, pre-fix |
| Live browser verification of the fix | Confirmed, repeatedly, including under rapid back/forward stress, post-fix |

Backend was not touched this pass (the bug and fix are entirely frontend); backend's own test/build status is unchanged from Sprint 16.

---

## 7. Remaining Blockers

None. The regression that prompted this finalization pass is resolved and verified.

## 8. Remaining Human/Follow-up Actions

1. **Extend live browser verification to `/checkout`, `/reservations`, `/account/*`, and `/admin/*`** — the fix is structural and applies uniformly to every route, but only Home/About/Menu/category/meal-detail/Cart were actually clicked through this pass.
2. **Exercise the Menu `Flip` re-flow live** (apply a filter or sort on `/menu` and watch the re-layout animate) — reviewed correct in code, not clicked through.
3. Every item already open from Sprint 16's and earlier sprints' recommendation lists (Google OAuth/Paystack live-browser checkout confirmation, `stripe` package removal, role-aware admin nav filtering, etc.) remains open and unaffected by this pass.

## 9. Git Status

**Not committed.** This finalization pass's changes (`PageTransition.tsx` fix, `variants.ts` cleanup) sit alongside the still-uncommitted Sprint 16 and Sprint 17 feature work in the working tree, per this project's standing practice of treating commits as a deliberate, separate decision rather than an automatic side effect of a work session.
