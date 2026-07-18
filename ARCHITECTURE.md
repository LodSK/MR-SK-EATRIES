# MR_SK EATRIES — Architecture & Sprint 1 Deliverable

**Tagline:** Taste Beyond Expectations
**Status:** Sprint 1 of 15 — Foundation

---

## 1. System Overview

MR_SK EATRIES is a full-stack restaurant commerce platform split into two independently deployable services in a single monorepo:

```
mr-sk-eatries/
├── frontend/   → Next.js 15 (App Router) — customer site, dashboards, admin panel
├── backend/    → Node.js/Express API — auth, orders, reservations, payments, sockets
└── package.json → npm workspaces root (orchestrates both)
```

This separation (rather than Next.js API routes doing all backend work) was chosen deliberately — see §3.

---

## 2. Architecture Style: Modular Monolith → Service-Ready

Each side follows **clean/layered architecture**:

**Backend (Express):**
`routes → controllers → services → models`
- **Routes**: URL + HTTP verb wiring only.
- **Controllers**: parse request, call service, shape response. No business logic.
- **Services**: business logic, orchestration, third-party calls (Cloudinary, Stripe, email).
- **Models**: Mongoose schemas — the only layer that talks to MongoDB.
- **Middleware**: auth guards, validation, rate limiting, error handling — cross-cutting concerns kept out of controllers.

This keeps controllers thin and testable, and means the service layer could be extracted into standalone microservices later (e.g., a dedicated Reservations service) without touching route/controller contracts.

**Frontend (Next.js):**
`app/ (routes) → components/ (presentation) → lib/ (logic, hooks, API clients) → types/`
- Route groups `(marketing)` isolate public marketing pages from the shared root layout used by `account/`, `admin/`, `auth/` so each area can have its own nested layout, nav, and metadata without polluting the others.
- `src/app/api/*` exists for edge-friendly concerns only (webhooks, image proxy, ISR revalidation) — it is **not** where business logic lives; the real API is the Express backend, called via `lib/api`.

---

## 3. Technology Choices — Why

| Decision | Reasoning |
|---|---|
| **Next.js 15 + React 19 (App Router)** | Server Components cut client JS for content-heavy pages (menu, blog, about) while still allowing rich client interactivity (cart, checkout, dashboards) where needed. Built-in image optimization and metadata API matter directly for a restaurant site's Core Web Vitals and SEO. |
| **Separate Express backend (not just Next API routes)** | A restaurant platform needs long-lived stateful concerns — Socket.io for live order status, Redis for session/cache, cron jobs for inventory/coupon expiry. These fit a persistent Node process far better than serverless-style route handlers, and keeping them separate means the API can scale, deploy, and be rate-limited independently of the website. |
| **MongoDB + Mongoose** | Menu items, orders, and reservations are naturally document-shaped (variable modifiers, nested order items, flexible metadata) and iterate fast during early product life. Mongoose gives schema validation and middleware hooks (e.g., auto-hash password, auto-slugify) without losing that flexibility. |
| **TypeScript everywhere** | Shared confidence across a 15-sprint build with many models (Order, Reservation, User, MenuItem, Coupon...) — catches shape mismatches between frontend and backend at compile time. |
| **TailwindCSS + shadcn/ui (Radix primitives)** | Utility CSS keeps the "luxury/glassmorphism/dark+light mode" design system consistent via tokens (see `tailwind.config.ts`) instead of scattered custom CSS. Radix gives accessible, unstyled primitives (dialogs, dropdowns, tabs) that we skin ourselves — critical for hitting both "premium custom design" and WCAG accessibility. |
| **Framer Motion + GSAP** | Framer Motion for React-driven UI transitions (page transitions, hover states, staggered reveals). GSAP specifically for the hero parallax/scroll-triggered sequences where its ScrollTrigger plugin outperforms pure React animation. Used deliberately, not redundantly. |
| **TanStack Query + Axios** | Server-state caching, dedupe, and background refetch for menu/orders/reservations data, decoupled from client UI state. |
| **Zustand** | Lightweight client state (cart, wishlist, UI toggles) without Redux boilerplate. |
| **React Hook Form + Zod** | Shared validation schemas can mirror backend Zod schemas for consistent client/server validation on checkout, reservation, and auth forms. |
| **JWT (access + refresh) + bcrypt** | Stateless access tokens for API calls, httpOnly refresh cookie for session longevity, bcrypt (cost 12) for password hashing — standard production auth pattern, extended with a Google OAuth path for social login. |
| **Redis (ioredis)** | Session/refresh-token blacklist, rate-limit store, and hot-path caching (menu listings, availability lookups) so MongoDB isn't hit on every request. |
| **Socket.io** | Live order status updates (kitchen → customer), live table availability, admin live order feed. |
| **Cloudinary + Multer** | Menu photography and gallery images need transformation/CDN delivery (responsive sizes, AVIF/WebP) — offloading this from the app server. |
| **Helmet, rate-limiter, hpp, xss-clean, mongo-sanitize, CORS, compression, Morgan** | Defense-in-depth for a platform that will process payments and PII: security headers, brute-force mitigation, parameter pollution/XSS/NoSQL-injection hardening, and structured request logging from day one — not bolted on later. |
| **Winston (rotating file logs)** | Structured, leveled logging suitable for production monitoring/alerting integration later. |
| **Stripe** | Industry-standard PCI-compliant payment processing; webhook-driven order confirmation. |
| **npm workspaces monorepo** | One repo, one CI pipeline, shared root tooling, but each app still ships its own independent `package.json`/build/deploy — matches how a small team actually operates. |

---

## 4. Folder Structure Rationale

- **`(marketing)` route group** — every public content page (About, Menu, Reservations, Gallery, Events, Blog, Contact, FAQ, Careers) shares one layout (nav + footer treatment) distinct from `account/`, `admin/`, and `auth/`, which each need their own shell (sidebar, minimal auth chrome, etc.).
- **`menu/{breakfast,lunch,dinner,desserts,drinks}`** are real nested routes (not just filters) so each has its own SEO metadata and can be deep-linked/shared — important for a restaurant's organic search traffic.
- **`components/` mirrors domain, not atomic-design dogma** (`menu/`, `cart/`, `checkout/`, `reservations/`, `admin/`...) — easier to locate everything relevant to a feature; `ui/` holds the shadcn-style generic primitives (Button, Card, Dialog) shared across domains.
- **`lib/` split by concern** (`api/` clients, `hooks/`, `store/` for Zustand, `validations/` Zod schemas, `animations/` shared Framer/GSAP configs, `constants/`) so business logic never lives inside components.
- **Backend mirrors the same philosophy**: `models/`, `controllers/`, `services/`, `routes/`, `middleware/`, `validators/`, `sockets/` (Socket.io namespaces/handlers), `jobs/` (node-cron: coupon expiry, abandoned-cart emails, inventory alerts).

---

## 5. Environment Configuration

Two `.env.example` files were generated (`frontend/.env.example`, `backend/.env.example`) covering: app URLs, API base URL, JWT secrets, MongoDB Atlas URI, Redis URL, Cloudinary, Stripe, Google OAuth, SMTP, Twilio (SMS-ready architecture per spec), rate-limit tuning, and admin seed credentials. Real secrets are never committed — only `.env.example` ships in the repo.

---

## 6. What Was Generated in Sprint 1

- ✅ Full monorepo folder structure (frontend `app/` routes for every feature in the spec, `components/`, `lib/`, `types/`; backend `src/` layered folders + `tests/`)
- ✅ `frontend/package.json` — Next.js 15, React 19, TypeScript, Tailwind, Framer Motion, GSAP, shadcn/Radix, RHF+Zod, TanStack Query, Axios, Zustand, Socket.io client, Cloudinary, PWA/SEO libs
- ✅ `backend/package.json` — Express, Mongoose, JWT, bcrypt, Redis (ioredis), Cloudinary, Multer, Socket.io, Helmet, rate-limiter, compression, Morgan, Stripe, Winston, node-cron
- ✅ `frontend/tsconfig.json` — strict mode, path aliases (`@/components`, `@/lib`, etc.)
- ✅ `backend/tsconfig.json` — strict mode, path aliases
- ✅ `frontend/tailwind.config.ts` — brand tokens (`#C62828` primary, `#111111` secondary, `#FFD54F` accent), glassmorphism shadows, custom keyframes for hero/scroll animations, dark mode via class strategy
- ✅ `frontend/next.config.ts` — security headers, Cloudinary image domain, package import optimization
- ✅ `frontend/.env.example` and `backend/.env.example`
- ✅ Root `package.json` (npm workspaces) and `.gitignore`
- ✅ Full project tree (`PROJECT_TREE.txt`)

---

## 7. Next Sprint

**Sprint 2** will build the shared UI shell: root layout, theme provider (dark/light), typography system, Navbar (sticky, glass-blur on scroll), Footer, global styles, the branded loading screen, and shared animation primitives — before any page content is built on top of it.

**STOP — awaiting `CONTINUE`.**
