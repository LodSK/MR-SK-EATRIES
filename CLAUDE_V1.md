# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

MR_SK EATRIES — a full-stack restaurant commerce platform (online ordering, reservations, customer accounts, admin back office, AI chatbot). Built as an **npm workspaces monorepo**: Next.js 15 frontend + Express/MongoDB backend, each independently deployable.

This project is built **sprint by sprint** against a fixed 15-sprint plan. Before making changes, read:
- `PROJECT_STATUS.md` — single source of truth for what's actually built, what's pending, and known technical debt. Update it whenever you complete work.
- `CLAUDE_RULES.md` — the build rules governing every sprint (see summary below; the file itself is authoritative).
- `ARCHITECTURE.md` — rationale for every technology choice.

## Sprint discipline (from CLAUDE_RULES.md)

- Work one sprint at a time, in the order defined in `PROJECT_STATUS.md`. Never combine sprints.
- Never generate placeholder code (`// TODO`, `// add code`, etc.) — every file delivered must be complete.
- Preserve the existing monorepo structure exactly; new files go into their correct existing folder, never an ad hoc new one.
- Don't regenerate/touch files that haven't changed.
- After finishing a sprint's scope, stop and wait for explicit confirmation before starting the next.
- Before considering work done: every `@/...` import must resolve to a real file, no orphaned/empty files, `PROJECT_STATUS.md` updated to reflect true current state.

## Commands

Run from the repo root unless noted.

```bash
npm install                    # installs both workspaces in one pass

npm run dev                    # frontend (:3000) + backend (:5000) concurrently
npm run dev:frontend           # frontend only
npm run dev:backend            # backend only

npm run build                  # build:frontend && build:backend
npm run lint                   # lint both workspaces

npm run test                   # test both workspaces (jest)
npm run test --workspace=frontend
npm run test --workspace=backend
```

Backend-specific (run inside `backend/`):
```bash
npm run seed                   # seeds MongoDB: menu items, users, orders, reservations, reviews, coupons...
npm run dev                    # ts-node + nodemon, path aliases via tsconfig-paths
npm run build                  # tsc, then tsc-alias to rewrite @/ aliases in dist/
```

Frontend-specific (run inside `frontend/`):
```bash
npm run type-check             # tsc --noEmit
npm run format                 # prettier --write
```

Running a single test: use jest's own filtering, e.g. `npx jest path/to/file.test.ts` or `npx jest -t "test name"` from within the relevant workspace.

Environment setup:
```bash
cp frontend/.env.example frontend/.env.local
cp backend/.env.example backend/.env
```
Requires a MongoDB Atlas cluster (or local `mongod`) and a Redis instance. Fill in JWT secrets, Cloudinary, Stripe, SMTP per the comments in each `.env.example`.

## Architecture

### Layering (both sides follow the same clean/layered discipline)

**Backend:** `routes → controllers → services → models`
- Routes: URL + HTTP verb wiring only.
- Controllers: parse request, call service, shape response — no business logic.
- Services: business logic, orchestration, third-party calls (Cloudinary, Stripe, email).
- Models: Mongoose schemas — the only layer that talks to MongoDB.
- Middleware: auth guards, validation, rate limiting, error handling.

**Frontend:** `app/ (routes) → components/ (presentation) → lib/ (logic, hooks, API clients) → types/`
- Route groups: `(marketing)` isolates public pages (About, Menu, Reservations, Gallery, Blog, Contact, FAQ...) under a shared nav/footer layout, distinct from `account/`, `admin/`, `auth/`, which each need their own shell.
- `menu/{category}/{slug}` are real nested routes, not client-side filters — each gets its own SEO metadata and is deep-linkable.
- `components/` is organized by domain (`menu/`, `cart/`, `checkout/`, `reservations/`, `admin/`...), not atomic-design layers; `ui/` holds the shared shadcn-style primitives (Button, Card, Dialog).
- `lib/` is split by concern: `api/` (HTTP clients calling the Express backend), `hooks/`, `store/` (Zustand), `validations/` (Zod schemas mirroring backend validators), `animations/` (shared Framer Motion/GSAP configs), `constants/`.
- `src/app/api/*` exists only for edge-friendly concerns (webhooks, image proxy, ISR revalidation) — it is **not** where business logic lives. The real API is the Express backend, called via `lib/api`.

### Path aliases

Both `frontend/tsconfig.json` and `backend/tsconfig.json` define `@/*` (and more specific `@/components/*`, `@/services/*`, etc.) mapped to `src/*`. Backend requires `tsconfig-paths/register` at dev/runtime and `tsc-alias` in the build step for these to resolve outside the TS compiler.

### Auth model

JWT access token (stateless, sent per-request) + httpOnly refresh cookie (`mrsk_refresh_token`) set by the backend — more secure than a client-readable refresh token. bcrypt (cost 12) for password hashing. Redis backs session/refresh-token blacklisting and rate-limit state.

### Data model note

Menu items, orders, and reservations are intentionally document-shaped (variable modifiers, nested items, flexible metadata) rather than heavily normalized — this is a deliberate MongoDB/Mongoose fit, not a shortcut.

### Resource access scoping pattern

Guest-accessible resources (e.g. `GET /reservations/:id`) must scope unauthenticated access by a matching identifier (e.g. `?email=`) rather than allowing open lookup by ID alone. This pattern exists in `reservation.service.ts` (`assertCanAccess`) and is the model to follow for any new guest-accessible endpoint — `GET /orders/:id` is a known, currently-unfixed exception to this pattern (see `PROJECT_STATUS.md`'s technical debt section, it is the highest-priority fix listed there).

## Current state

Sprints 1–10 are complete (frontend UI through Auth/Cart/Menu/Reservations, full Express/MongoDB backend). Sprints 11–15 (Customer Dashboard, Admin Dashboard, AI Chatbot, performance/SEO pass, deployment) are pending. `PROJECT_STATUS.md` has the authoritative per-file breakdown, in-flight technical debt, and recommended refactors — read its "Known Limitations," "Technical Debt," and "Recommended Refactors" sections before starting new work, since several already-identified issues (card-component duplication across `MealCard`/`SpecialCard`/`MenuCard`, cart/session merge on login, the orders guest-lookup exposure) are explicitly deferred rather than forgotten.
