#!/bin/sh
set -e

# The refresh-token cookie is set `Secure` whenever NODE_ENV=production
# (backend/src/controllers/auth.controller.ts) — browsers refuse to store
# or send a Secure cookie over plain HTTP, so auth would silently break
# without real TLS termination in front of the app. This generates a
# self-signed certificate on first start (persisted in the `nginx_certs`
# volume, so it isn't regenerated every restart) so the full stack —
# including login — is actually verifiable end-to-end out of the box.
#
# This self-signed cert is for local/staging verification ONLY. Browsers
# will show a security warning for it, correctly — before a real deploy,
# mount a real certificate (Let's Encrypt/certbot, or your cloud
# provider's load balancer) at the same paths instead. See DEPLOYMENT.md.

CERT_DIR="/etc/nginx/certs"
CERT_FILE="$CERT_DIR/fullchain.pem"
KEY_FILE="$CERT_DIR/privkey.pem"

if [ ! -f "$CERT_FILE" ] || [ ! -f "$KEY_FILE" ]; then
  echo "[nginx-entrypoint] No certificate found — generating a self-signed one for local use..."
  mkdir -p "$CERT_DIR"
  openssl req -x509 -nodes -days 365 \
    -newkey rsa:2048 \
    -keyout "$KEY_FILE" \
    -out "$CERT_FILE" \
    -subj "/CN=localhost" \
    -addext "subjectAltName=DNS:localhost,IP:127.0.0.1"
  echo "[nginx-entrypoint] Self-signed certificate generated at $CERT_DIR."
fi

exec nginx -g "daemon off;"
