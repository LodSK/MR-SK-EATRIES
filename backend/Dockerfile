# Build context is the repo ROOT (npm workspaces need the root package.json
# + lockfile to resolve correctly) — see docker-compose.yml's
# `build: { context: ., dockerfile: backend/Dockerfile }`.

# ---- builder: full workspace install, compile TypeScript -> dist/ ----
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
COPY backend/package.json ./backend/package.json
COPY frontend/package.json ./frontend/package.json
RUN npm ci
COPY backend ./backend
RUN npm run build --workspace=backend

# ---- production-deps: backend's own runtime deps, installed in isolation
# from the workspace (every dependency in backend/package.json is exact-
# pinned, no ^/~ ranges, so this is reproducible without needing the
# shared root lockfile) — keeps frontend's dependencies (Next.js, React,
# GSAP, ...) entirely out of the backend image. ----
FROM node:20-alpine AS production-deps
WORKDIR /app
COPY backend/package.json ./package.json
RUN npm install --omit=dev

# ---- production: minimal runtime image ----
FROM node:20-alpine AS production
RUN addgroup -S nodejs && adduser -S nodejs -G nodejs
WORKDIR /app
COPY --from=production-deps --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/backend/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/backend/package.json ./package.json

# config/logger.ts's winston-daily-rotate-file transports create ./logs on
# first write. /app itself is root-owned (only the COPY targets above were
# chowned individually), so the nodejs user couldn't create that directory
# without this — surfaced as a hard EACCES crash on every production boot,
# never caught before because nothing had actually run this image end-to-
# end until a real deploy did.
RUN mkdir logs && chown nodejs:nodejs logs

USER nodejs
ENV NODE_ENV=production
EXPOSE 5000

# No curl in this image — a plain Node http request is enough and avoids
# adding a package just for the healthcheck.
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "require('http').get('http://127.0.0.1:' + (process.env.PORT || 5000) + '/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))"

CMD ["node", "dist/server.js"]
