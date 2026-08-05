# MR_SK EATRIES

**Taste Beyond Expectations**

A production-grade, full-stack restaurant commerce platform — online ordering, reservations, customer accounts, an admin back office, and an AI chatbot — built as a Next.js 15 frontend and an Express/MongoDB backend in a single npm-workspaces monorepo.

This project is being built sprint by sprint. See `PROJECT_STATUS.md` for exactly what exists today and what's next, and `CLAUDE_RULES.md` for the build rules governing every sprint.

---

## Stack

**Frontend:** Next.js 15 (App Router) · React 19 · TypeScript · TailwindCSS · Framer Motion · GSAP · Radix/shadcn-style UI · React Hook Form + Zod · Zustand · Socket.io client

**Backend:** Node.js · Express · MongoDB (Mongoose) · JWT + bcrypt · Redis · Cloudinary · Socket.io · Helmet/rate-limiting/hardening middleware · winston (structured logging)

**Infra:** Docker (multi-stage builds, standalone Next.js output) · Docker Compose (mongo, redis, backend, frontend, nginx) · nginx (TLS-terminating reverse proxy)

Full rationale for each choice is in `ARCHITECTURE.md`.

---

## Project Structure

```
MR-SK-EATRIES/
├── frontend/            Next.js 15 app
│   ├── src/
│   │   ├── app/          routes (App Router)
│   │   ├── components/   layout, shared, ui, home, menu, reservations, dashboard, admin, ai...
│   │   ├── lib/           api, hooks, store, utils, validations, animations
│   │   ├── config/        site config, fonts
│   │   ├── types/         shared TS types
│   │   └── styles/
│   ├── public/
│   ├── Dockerfile
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.ts
│   ├── tailwind.config.ts
│   ├── postcss.config.js
│   └── eslint.config.js
│
├── backend/              Express API
│   ├── src/
│   │   ├── config/ · models/ · controllers/ · routes/ · middleware/
│   │   ├── services/ · utils/ · validators/
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
│
├── nginx/                Reverse proxy (TLS termination, gzip, routing)
│   ├── Dockerfile
│   ├── nginx.conf
│   └── docker-entrypoint.sh
│
├── docker-compose.yml
├── ARCHITECTURE.md
├── PROJECT_STATUS.md
├── DEPLOYMENT.md
├── CLAUDE_RULES.md
└── README.md
```

---

## Getting Started

### Option A — Docker Compose (full stack, closest to production)

**Prerequisites:** Docker + Docker Compose.

```bash
cp backend/.env.example backend/.env        # fill in real values
cp frontend/.env.example frontend/.env.local
docker compose up --build
```

Open **`https://localhost`**. The browser will warn about the certificate — that's expected, it's a self-signed cert generated automatically on first start for local verification (see `DEPLOYMENT.md` for swapping in a real one). This brings up MongoDB, Redis, the backend API, the frontend, and an nginx reverse proxy in front of everything.

### Option B — Local Node (faster iteration while developing)

**Prerequisites:**
- Node.js ≥ 20
- npm ≥ 10
- MongoDB (Atlas cluster or local `mongod`)
- Redis (local or hosted — optional in dev; rate limiting/session revocation fall back gracefully without it, see `ARCHITECTURE.md`)

```bash
npm install                                  # both workspaces in one pass

cp frontend/.env.example frontend/.env.local
cp backend/.env.example backend/.env         # fill in real values

npm run dev                                  # frontend :3000 + backend :5000
```

To run just one side: `npm run dev:frontend` / `npm run dev:backend`.

### Build for production (without Docker)

```bash
npm run build
```

---

## Current Status

Sprints 1–15 are complete: full public site, full auth (register/login/sessions/roles/per-device and all-device logout), a production Express + MongoDB backend, the Reservation System, Customer Dashboard, Admin Dashboard, an AI chatbot (Claude/Gemini/Groq, swappable via env var), a Performance/SEO/Accessibility pass (Lighthouse-verified), and this sprint's production hardening — structured logging, Redis-backed rate limiting and session revocation, Docker/Docker Compose/nginx, and a security review.

See `PROJECT_STATUS.md` for the authoritative, sprint-by-sprint breakdown of exactly what exists, what's a disclosed placeholder, and what technical debt remains — and `DEPLOYMENT.md` for what a real production deployment still needs (a real domain + TLS certificate, real third-party API keys, a managed MongoDB/Redis instance).

---

## License

Proprietary — built for MR_SK EATRIES. Not for redistribution.
