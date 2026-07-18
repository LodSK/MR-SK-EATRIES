# MR_SK EATRIES

**Taste Beyond Expectations**

A production-grade, full-stack restaurant commerce platform — online ordering, reservations, customer accounts, an admin back office, and an AI chatbot — built as a Next.js 15 frontend and an Express/MongoDB backend in a single npm-workspaces monorepo.

This project is being built sprint by sprint. See `PROJECT_STATUS.md` for exactly what exists today and what's next, and `CLAUDE_RULES.md` for the build rules governing every sprint.

---

## Stack

**Frontend:** Next.js 15 (App Router) · React 19 · TypeScript · TailwindCSS · Framer Motion · GSAP · Radix/shadcn-style UI · React Hook Form + Zod · TanStack Query · Zustand · Socket.io client

**Backend:** Node.js · Express · MongoDB Atlas (Mongoose) · JWT + bcrypt · Redis · Cloudinary · Socket.io · Helmet/rate-limiting/hardening middleware

Full rationale for each choice is in `ARCHITECTURE.md`.

---

## Project Structure

```
MR-SK-EATRIES/
├── frontend/            Next.js 15 app
│   ├── src/
│   │   ├── app/          routes (App Router)
│   │   ├── components/   layout, shared, ui, home, menu, reservations, dashboard, admin, chatbot...
│   │   ├── lib/           api, hooks, store, utils, validations, animations
│   │   ├── config/        site config, fonts
│   │   ├── types/         shared TS types
│   │   └── styles/
│   ├── public/
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
│   │   ├── services/ · utils/ · validators/ · sockets/ · jobs/
│   ├── tests/
│   ├── package.json
│   └── tsconfig.json
│
├── ARCHITECTURE.md
├── PROJECT_STATUS.md
├── CLAUDE_RULES.md
└── README.md
```

---

## Getting Started

### Prerequisites
- Node.js ≥ 20
- npm ≥ 10
- MongoDB Atlas cluster (or local MongoDB instance)
- Redis instance (local or hosted)

### 1. Install dependencies (from the project root)
```bash
npm install
```
This installs both `frontend` and `backend` workspaces in one pass.

### 2. Configure environment variables
```bash
cp frontend/.env.example frontend/.env.local
cp backend/.env.example backend/.env
```
Fill in real values (MongoDB URI, JWT secrets, Cloudinary, Stripe, SMTP, etc.) — see the comments in each file.

### 3. Run in development
```bash
npm run dev
```
This runs the frontend (`http://localhost:3000`) and backend (`http://localhost:5000`) concurrently. To run just one:
```bash
npm run dev:frontend
npm run dev:backend
```

### 4. Build for production
```bash
npm run build
```

---

## Current Status

The backend Express server, database models, and business logic have **not** been implemented yet — Sprint 9 covers this. Until then, `npm run dev:backend` will start an empty workspace with no server entrypoint. The frontend is fully runnable today (Sprints 1–2 complete): layout, theme, navigation, and footer render against a placeholder homepage.

See `PROJECT_STATUS.md` for the authoritative, up-to-date sprint checklist.

---

## License

Proprietary — built for MR_SK EATRIES. Not for redistribution.
