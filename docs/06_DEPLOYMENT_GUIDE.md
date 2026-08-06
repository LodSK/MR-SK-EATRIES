# Deployment Guide — Free-Tier Public Development Deployment

**Scope:** get the current, already-verified application (Sprints 1–17 + Sprint 17 Finalization) publicly reachable on free-tier infrastructure, per this deployment's target architecture:

| Layer | Provider | Plan |
|---|---|---|
| Frontend (Next.js) | Netlify | Free |
| Backend (Express API) | Render | Free web service |
| Database | MongoDB Atlas | Free M0 cluster |
| Images | Cloudinary | Existing account/credentials, unchanged |
| Payments | Paystack | Existing **sandbox/test** keys, unchanged |
| Sign-in | Google OAuth | Existing client, redirect URI updated for the new backend URL |
| Maps | Google Maps | Existing key, unchanged |
| Analytics | Google Analytics + Microsoft Clarity | Existing IDs, unchanged |

This is explicitly a **publicly accessible development deployment**, not a hardened production launch — see "Known Limitations of This Deployment" at the end before treating it as more than that. This document is the practical companion to `DEPLOYMENT.md` at the repo root, which covers the separate Docker Compose + nginx self-hosted path; that path is untouched by anything here.

No new application features were added to reach this deployment — every change described below is deployment configuration (build settings, CORS, a cross-origin cookie flag) or a config file (`netlify.toml`, `render.yaml`), not new functionality.

---

## 0. Why the order below matters

Render and Netlify each need to know the other's URL (the backend needs the frontend's origin for CORS + the OAuth/Paystack/email redirect links it generates; the frontend needs the backend's URL to call the API). Neither exists yet, so there's an unavoidable two-pass bootstrap: deploy both once with placeholder cross-references, capture the real URLs, then go back and fill them in. The steps below are ordered to make that one pass, not two.

## 1. Prerequisites

- A GitHub account with push access to this repo's remote (`origin` → `https://github.com/LodSK/MR-SK-EATRIES.git`). **The remote is currently far behind local** (`git log origin/main` stops at "Sprint 4"; all of Sprints 5–17 plus this deployment-prep work exist only in the local working tree as of this writing). Render and Netlify's normal deploy flow watches a GitHub branch, so **the local commits need to be pushed before either platform has anything to build.** This wasn't done as part of this pass — pushing to a real, possibly-shared GitHub remote is a deliberate action, not a default one.
- Free accounts on [Netlify](https://netlify.com), [Render](https://render.com), and [MongoDB Atlas](https://mongodb.com/cloud/atlas) (Atlas's free tier is called "M0").
- The real values already sitting in your local `backend/.env` (SMTP, Cloudinary, Google OAuth, Paystack, Google Maps, Groq) — see the Sprint 16 work in `PROJECT_STATUS.md` for how each was obtained. Nothing in this deployment needs new external credentials; it needs the existing ones copied into two new dashboards.

## 2. MongoDB Atlas — free M0 cluster

1. Create an M0 (free, 512 MB) cluster.
2. **Database Access** → add a database user (username/password auth) — a fresh one for this deployment, not your personal Atlas login.
3. **Network Access** → add `0.0.0.0/0` (allow from anywhere). Render's free tier doesn't publish a fixed outbound IP, so there's no smaller range to allow instead; this is a real, disclosed trade-off of free-tier hosting, not an oversight — the database is still protected by the username/password from step 2.
4. **Connect → Drivers** → copy the connection string. It looks like `mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/mrsk_eatries?retryWrites=true&w=majority` — this is your production `MONGODB_URI`. Make sure the database name segment reads `mrsk_eatries` (or update it consistently everywhere else if you choose a different name).
5. This cluster starts empty. Run the existing seed script once, pointed at it, to get the admin account and starter menu data: from `backend/`, temporarily set `MONGODB_URI` in your local `.env` to the Atlas string and run `npm run seed`, then restore your local value. (Running it from Render's own shell after the service is live is the alternative, if you'd rather not point your local machine at the production database, even briefly.)

## 3. Backend → Render

1. Push this repo to GitHub (see §1's caveat — needed before this step works).
2. In Render: **New → Blueprint**, point it at the GitHub repo. Render reads `render.yaml` (added at the repo root by this pass) and proposes one web service, `mrsk-eatries-api`, built from `backend/Dockerfile` with `plan: free`.
3. Render will prompt for every environment variable marked `sync: false` in `render.yaml`. Fill in:
   - **Carried over unchanged from local `backend/.env`:** `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `EMAIL_FROM`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_MAPS_API_KEY`, `PAYSTACK_PUBLIC_KEY`, `PAYSTACK_SECRET_KEY`, `PAYSTACK_WEBHOOK_SECRET` (empty is correct — see the comment in `backend/src/config/env.ts`), `GROQ_API_KEY`, `ADMIN_SEED_EMAIL`.
   - **New, generate fresh — never reuse local dev values:** `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET` (`openssl rand -base64 48` each), `ADMIN_SEED_PASSWORD` (a real password, not the `.env.example` placeholder).
   - **Deployment-specific, fill in with a placeholder for now, real value in §5:** `MONGODB_URI` (the Atlas string from §2), `CLIENT_URL` and `CORS_ORIGINS` (temporarily `http://localhost:3000` is fine — corrected once the Netlify URL exists), `GOOGLE_CALLBACK_URL` (temporarily `https://<your-render-service>.onrender.com/api/v1/auth/google/callback` — the exact final value, since you'll know the Render subdomain right after this step, before Netlify's).
4. Deploy. Render assigns a URL like `https://mrsk-eatries-api.onrender.com`. **Confirm it's alive**: `curl https://<your-service>.onrender.com/health` should return `{"success":true,...}` once MongoDB connects (a few seconds after first boot).

## 4. Frontend → Netlify

1. **Add new site → Import an existing project**, point it at the same GitHub repo. Netlify reads `netlify.toml` (added at the repo root by this pass) — build command `npm ci && npm run build --workspace=frontend`, publish `frontend/.next`, the `@netlify/plugin-nextjs` plugin declared explicitly.
2. **Site configuration → Environment variables**, add:
   - `NEXT_PUBLIC_API_BASE_URL` = `https://<your-render-service>.onrender.com/api/v1` (from §3.4)
   - `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` = same value as backend's `GOOGLE_MAPS_API_KEY`
   - `NEXT_PUBLIC_GA_MEASUREMENT_ID` (optional — `AnalyticsScripts.tsx` renders nothing if unset)
   - `NEXT_PUBLIC_CLARITY_PROJECT_ID` (optional, same)
3. Deploy. Netlify assigns a URL like `https://mrsk-eatries.netlify.app`.

## 5. Close the loop: point Render back at the real Netlify URL

Back in Render's environment settings for `mrsk-eatries-api`:

- `CLIENT_URL` → the real Netlify URL (e.g. `https://mrsk-eatries.netlify.app`)
- `CORS_ORIGINS` → same value (a single URL is fine; it's comma-separated only if you ever need more than one — see `backend/src/config/env.ts`)

Save — Render redeploys automatically on an env var change.

## 6. Google OAuth redirect URI

In Google Cloud Console, on the OAuth client `GOOGLE_CLIENT_ID` already points at: **Credentials → OAuth 2.0 Client IDs → Authorized redirect URIs**, add the real `GOOGLE_CALLBACK_URL` from §3.3 (`https://<your-render-service>.onrender.com/api/v1/auth/google/callback`). Google rejects the callback with no explanation if this doesn't match exactly, including the scheme and trailing path.

## 7. Verification checklist

- [ ] `GET https://<render-url>/health` → `200`, `mongodb: "connected"`.
- [ ] Frontend loads at the Netlify URL and its network requests resolve against the Render API (check the browser Network tab, not just that the page renders — a stale build can still serve a page that then fails every API call).
- [ ] Register a new account, log out, log back in. This is the specific cross-origin case this deployment pass fixed (`PageTransition`'s unrelated bug aside): the refresh-token cookie must survive a full logout/login cycle across the Netlify ↔ Render origin boundary — confirm session persists after a hard page reload, not just within the SPA session.
- [ ] Trigger any AI-backed feature (chat widget, recommendations, or the admin AI dashboard's insights) and confirm Groq responds — this is "Verify Groq" from this deployment's task list. If it fails, check `GROQ_API_KEY` is actually a real key and `AI_PROVIDER=groq` in Render's env vars, and check Render's logs for the actual provider error.
- [ ] Run a Paystack **test-card** checkout ([Paystack's documented test cards](https://paystack.com/docs/payments/test-payments/)) end to end: cart → checkout → Paystack's hosted page → redirect back to `/checkout/verify` → order shows `paymentStatus: "paid"`. This is "Verify Paystack Sandbox." No real card or real money is involved — `PAYSTACK_SECRET_KEY`/`PAYSTACK_PUBLIC_KEY` are the existing `sk_test_.../pk_test_...` sandbox keys, unchanged from local dev.
- [ ] Google sign-in completes and lands back on the app authenticated, not on Google's "redirect URI mismatch" error page (confirms §6 was done correctly).

## 8. Known Limitations of This Deployment

- **Render's free web service spins down after ~15 minutes of no traffic** and takes 30–60 seconds to cold-start the next request. This is normal free-tier behavior, not a bug — expect the first request after a quiet period to be slow.
- **No Redis.** Render's free tier has no free managed Redis/Key Value offering. Rate limiting and per-session refresh-token revocation both degrade to their documented in-memory/no-op fallback (see `backend/src/config/redis.ts`, `app.ts`'s `/health` check) instead of failing — correct behavior for a single-instance free deployment, but means rate-limit counters reset on every cold start/redeploy, and "revoke this one session" isn't real without Redis backing it (this was already a known limitation, not newly introduced here).
- **MongoDB Atlas M0** caps out at 512 MB storage and shared (not dedicated) compute — fine for a development deployment's seed data and light testing traffic, not for real production load.
- **Paystack stays in test/sandbox mode** — this deployment intentionally does not switch to live keys. No real payment can be taken through it.
- **A single Render instance** — no horizontal scaling on the free plan. `DEPLOYMENT.md` §6's notes on running multiple replicas behind a load balancer don't apply here; they're written for the separate Docker/self-hosted path.
- **CORS_ORIGINS supports one deployed frontend origin plus whatever you add.** If you later add Netlify deploy-preview URLs (which get a random subdomain per PR) and want them to reach the API too, add each one to `CORS_ORIGINS` as a comma-separated list, or point `CORS_ORIGINS` at only the production domain and accept that previews can't call the live API — both are legitimate choices depending on whether you need preview builds to be fully functional.
- **`stripe` remains an installed, unused dependency** in `backend/package.json` — a pre-existing, disclosed item (see `PROJECT_STATUS.md`'s Roadmap Status), not something this deployment pass introduced or needed to resolve.
- **Rotated log files (`backend/logs/*.log`) don't persist across restarts or redeploys** on Render's free tier — its filesystem is ephemeral, and there's no free managed disk add-on. This was never a working feature to begin with on this plan; the `Console` transport (stdout) is unaffected and is what Render's own log viewer reads, which is the practical way to view logs on this deployment regardless.

## 9. What changed in the repo to make this deployment possible

For the record — every file this pass touched, and why:

| File | Change | Why |
|---|---|---|
| `backend/src/config/env.ts` | Added `env.corsOrigins: string[]`, parsed from `CORS_ORIGINS` (comma-separated) falling back to `CLIENT_URL` | Resolves the standing "CORS is a single static origin" debt item — needed the moment frontend and backend live on different domains. |
| `backend/src/app.ts` | CORS `origin` changed from a static string to a function checking `env.corsOrigins` | Same reason — supports the deployed frontend origin (and local dev, if added) at once. |
| `backend/src/controllers/auth.controller.ts` | Refresh-token cookie's `sameSite` is now `"none"` in production (was hardcoded `"lax"`) | `SameSite=Lax` cookies are not sent on cross-site `fetch`/XHR requests. Netlify and Render are different registrable domains, so without this change, login would appear to succeed but session refresh (`POST /auth/refresh`, called with `withCredentials: true` from `frontend/src/lib/api/httpClient.ts`) would silently fail on every deployed request — found during this deployment pass, not previously encountered because the Docker/nginx path puts everything under one origin. `secure: true` (already required for `SameSite=None`) was already conditional on `NODE_ENV=production`. |
| `backend/.env.example` | Documented the new `CORS_ORIGINS` var | Keep the example file in sync with what `env.ts` actually reads. |
| `frontend/next.config.ts` | `output: "standalone"` is now conditional on `process.env.NETLIFY` (Netlify sets this automatically during its builds) | Netlify's own Next.js runtime expects the standard `.next` build layout and does not expect the slimmed `.next/standalone` output this mode produces; the Docker path (where `NETLIFY` is never set) is completely unaffected. |
| `netlify.toml` (new) | Build command, publish directory, Next.js plugin declaration | Netlify's monorepo-aware build config — see the file's own comments for why the build runs from repo root rather than `frontend/`. |
| `render.yaml` (new) | Blueprint service definition using the existing `backend/Dockerfile` | Deploys the exact image already built and health-checked for Sprint 15's Docker path, rather than standing up a second, divergent build config. |
| `package-lock.json` | Regenerated | Render's `npm ci` rejected the committed lockfile as out-of-sync with `package.json` (several transitive deps had drifted — `body-parser`, `qs`, `raw-body`, etc.) — the first real deploy attempt's actual build failure, caught by watching Render's own build logs, not anticipated in advance. |
| `frontend/package.json` | Added `react-markdown`, `remark-gfm`, `lenis` as real dependencies | All three are genuinely imported by production code (`ChatMessageBubble.tsx`, `SmoothScrollProvider.tsx`) but were never declared — a prior local environment's `node_modules` must have had them installed out-of-band, masking the gap until a clean install (this deployment's own lockfile regeneration) exposed it. |
| `backend/Dockerfile` | `RUN mkdir logs && chown nodejs:nodejs logs` added before `USER nodejs` | The backend crashed on every boot in the real deployed container with `Error: EACCES: permission denied, mkdir 'logs/'` — `winston-daily-rotate-file` creates `./logs` on first write, but `/app` itself is root-owned (only the individually-`COPY --chown`'d subdirectories were writable by the `nodejs` user), so it could never create that directory. Caught only by watching a real container boot on Render — `docker build` succeeding (Sprint 15's original verification) never proved the image could actually *run*. |

All five source changes were verified with `tsc --noEmit` (both workspaces, 0 errors) and the full test suite (`npm test`, both workspaces) immediately after being made, in addition to whatever re-verification happens once this is actually deployed per §7.
