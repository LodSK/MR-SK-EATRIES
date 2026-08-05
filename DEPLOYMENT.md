# Deployment Guide

This covers taking the Docker Compose stack (`docker-compose.yml`) from local verification to a real production deployment. Read `PROJECT_STATUS.md`'s Sprint 15 section first for what was built and why.

---

## 1. What's already handled

- **Multi-stage Docker builds** for both `frontend/` and `backend/` — small, non-root, production-only images. The frontend uses Next.js's `output: "standalone"` build; the backend ships only its own compiled `dist/` + production dependencies (installed in isolation from the workspace, so frontend's dependencies never end up in the backend image).
- **nginx reverse proxy** in front of both services, terminating TLS, gzip-compressing responses, and routing `/api/*` and `/socket.io/*` to the backend and everything else to the frontend.
- **Health checks** on every service (`mongo`, `redis`, `backend`, `frontend`) so Compose brings the stack up in the right order and restarts anything that becomes unhealthy. `GET /health` on the backend reports real MongoDB/Redis connectivity, not just "the process is running."
- **Graceful shutdown** — the backend stops accepting new connections, lets in-flight requests finish, and closes its MongoDB/Redis connections cleanly on `SIGTERM` (what `docker stop` / a rolling deploy sends), instead of dropping requests mid-flight.
- **Structured logging** (winston) — JSON in production (feed straight into CloudWatch/ELK/Datadog/etc.), with daily-rotated files under `backend/logs/` as a local fallback.
- **Redis-backed rate limiting** and **per-session logout** (a stolen refresh token can now actually be revoked, not just have its cookie cleared client-side) — both degrade gracefully to in-memory/no-op if Redis is unreachable, so a Redis outage doesn't take the whole API down.

## 2. What YOU still need to provide before this is real production

None of the following can be filled in without your own accounts/credentials — this is not something that can be automated:

| What | Where it goes | Notes |
|---|---|---|
| A real TLS certificate | `nginx/certs/fullchain.pem` + `privkey.pem` (mount over the self-signed one — see §3) | Let's Encrypt/certbot, or terminate TLS at your cloud load balancer instead and point nginx's `listen` at plain HTTP behind it. |
| A real domain | DNS → your server/load balancer | Update `CLIENT_URL`, `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_API_BASE_URL`, `GOOGLE_CALLBACK_URL` to match it. |
| MongoDB | `MONGODB_URI` in `backend/.env` | The bundled `mongo` Compose service has no auth and no backups — fine for local verification, not for real data. Point at MongoDB Atlas (or a self-hosted instance with auth enabled) instead. |
| Redis | `REDIS_URL`/`REDIS_PASSWORD` in `backend/.env` | The bundled `redis` service likewise has no auth/persistence guarantees beyond the Compose volume. A managed Redis (Elasticache, Upstash, Redis Cloud) is safer for real deployments. |
| JWT secrets | `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET` | Generate real ones: `openssl rand -base64 48`. Never reuse the dev placeholder values. |
| Cloudinary | `CLOUDINARY_*` (both `.env` files) | Image hosting for menu/gallery/avatars. |
| Stripe | `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Real payments need live (not test) keys. |
| SMTP | `SMTP_*` in `backend/.env` | Transactional email (verification, password reset, order/reservation confirmations) is silently skipped (logged, not sent) without this. |
| AI provider key | `AI_PROVIDER` + matching key (`GROQ_API_KEY`/`GEMINI_API_KEY`/`ANTHROPIC_API_KEY`) | Groq is the default (generous free tier); see `PROJECT_STATUS.md` for the Gemini free-tier quota caveat found during Sprint 13's live testing. |
| Google OAuth | `GOOGLE_CLIENT_ID`/`SECRET`/`CALLBACK_URL` | Only needed if/when Google sign-in is wired up — not currently used by any route. |

## 3. Replacing the self-signed TLS certificate

`nginx/docker-entrypoint.sh` generates a self-signed certificate on first container start so the stack is fully verifiable (including login, which requires HTTPS — see §4) without needing a real domain first. Browsers correctly warn about it. Before a real deployment:

```bash
# Option 1: mount a real cert over the generated one
docker compose down
# copy your real fullchain.pem / privkey.pem into the nginx_certs volume,
# or bind-mount your own directory instead of the named volume in
# docker-compose.yml's nginx service.
docker compose up -d

# Option 2 (simpler in many setups): terminate TLS at your cloud load
# balancer / reverse proxy instead, and run nginx behind it on plain HTTP.
```

## 4. Why HTTPS isn't optional here

`backend/src/controllers/auth.controller.ts` sets the refresh-token cookie with `Secure: true` whenever `NODE_ENV=production` (which the Docker image always sets). Browsers refuse to store or send `Secure` cookies over plain HTTP — so without real TLS termination somewhere in front of the app, login/session refresh silently breaks. This is why `nginx.conf` redirects all HTTP traffic to HTTPS rather than serving both.

## 5. Environment-hardening checklist

- [ ] All secrets in the table above are real, unique values — not the `.env.example` placeholders.
- [ ] `backend/.env` and `frontend/.env.local` are **not** committed (already gitignored — double-check before pushing a fork/mirror).
- [ ] `MONGODB_URI` points at an authenticated, backed-up instance (Atlas or self-hosted-with-auth), not the bundled `mongo` service.
- [ ] `REDIS_URL`/`REDIS_PASSWORD` point at an authenticated instance for the same reason.
- [ ] A real TLS certificate is in place (§3).
- [ ] `CLIENT_URL` (backend) and `NEXT_PUBLIC_APP_URL`/`NEXT_PUBLIC_API_BASE_URL` (frontend) all match your real domain.
- [ ] `npm audit` has been reviewed on both workspaces (see `PROJECT_STATUS.md`'s security-review notes for what was found and what's outstanding).
- [ ] Log retention/shipping is configured for `backend/logs/` (or your log aggregator of choice — winston already emits JSON) if you need logs to outlive the container.

## 6. Scaling beyond one instance

Rate limiting and session revocation are already Redis-backed specifically so `backend` can run as multiple replicas behind a load balancer without each instance disagreeing about who's been rate-limited or logged out. `docker-compose.yml` runs a single instance of each service by default (correct for local verification, small first deployments) — for real horizontal scaling, run multiple `backend`/`frontend` replicas (via `docker compose up --scale backend=3`, Kubernetes, ECS, etc.) behind nginx/your load balancer; nothing in the application code assumes a single instance.
