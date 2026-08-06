# API Inventory

_Populated Sprint 16 (2026-08-05) from the real route files under `backend/src/routes/`, not written from memory — every endpoint below was extracted by grepping the actual `router.*` calls. Base path for everything: `/api/{API_VERSION}` (`/api/v1` by default, see `backend/src/config/env.ts`). "Staff+" means `authorize(...STAFF_ROLES)` (`staff`/`manager`/`admin`); admin-only routes say so explicitly._

For the full request/response shape of any endpoint, read the corresponding controller in `backend/src/controllers/` — this file is a map, not a full contract, and will drift out of date if trusted as one.

## Auth (`auth.routes.ts`)

| Method | Path | Auth | Notes |
|---|---|---|---|
| POST | `/auth/register` | guest only | |
| POST | `/auth/login` | guest only | |
| GET | `/auth/google` | public | **Sprint 16.** Redirects to Google's OAuth consent screen. |
| GET | `/auth/google/callback` | public | **Sprint 16.** Google redirects here; sets the refresh cookie and redirects to the frontend. |
| POST | `/auth/logout` | public | |
| POST | `/auth/logout-all` | authenticated | |
| POST | `/auth/refresh` | public (cookie) | |
| POST | `/auth/forgot-password` | public | |
| POST | `/auth/reset-password` | public | |
| GET / POST | `/auth/verify-email` | public | |
| POST | `/auth/resend-verification` | authenticated | |
| GET | `/auth/me` | authenticated | |
| PATCH | `/auth/me` | authenticated | |
| POST | `/auth/change-password` | authenticated | |

## Menu (`menu.routes.ts`)

| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/menu` | public | |
| GET | `/menu/search` | public | |
| GET | `/menu/featured` | public | |
| GET | `/menu/popular` | public | |
| GET | `/menu/:slug` | public | |
| GET | `/categories` | public | |
| GET / POST / PATCH / DELETE | `/admin/menu*` | staff+ | |

## Cart (`cart.routes.ts`)

| Method | Path | Auth |
|---|---|---|
| GET / POST / PATCH | `/cart` | authenticated |
| DELETE | `/cart/:menuItemId`, `/cart` | authenticated |

## Orders (`order.routes.ts`, `payment.routes.ts`)

| Method | Path | Auth | Notes |
|---|---|---|---|
| POST | `/orders` | optional | Guest checkout allowed. |
| GET | `/orders/history` | authenticated | |
| GET | `/orders/track/:orderNumber` | optional | Guest needs `?email=`. |
| GET | `/orders/pay/verify` | optional | **Sprint 16.** Re-verifies a Paystack transaction against Paystack directly. |
| POST | `/orders/:id/pay/initialize` | optional | **Sprint 16.** Starts a Paystack transaction for a "card" order; guest needs `?email=`. |
| GET | `/orders/:id` | optional | Guest needs `?email=`. |
| GET | `/admin/orders` | staff+ | |
| PATCH | `/admin/orders/:id/status` | staff+ | |
| POST | `/payments/paystack/webhook` | signature-verified, no session auth | **Sprint 16.** Paystack calls this directly; HMAC-SHA512 over the raw body, signed with `PAYSTACK_SECRET_KEY`. |

## Payment Methods — saved cards for display only (`payment-method.routes.ts`)

Not a payment gateway — see `PaymentMethod.model.ts`'s own doc comment. Never stores a full card number. Real payment processing is Paystack (`order.routes.ts` above).

| Method | Path | Auth |
|---|---|---|
| GET / POST | `/payment-methods` | authenticated |
| PATCH | `/payment-methods/:id/default` | authenticated |
| DELETE | `/payment-methods/:id` | authenticated |

## Coupons (`coupon.routes.ts`)

| Method | Path | Auth |
|---|---|---|
| POST | `/coupons/validate` | public |
| GET / POST / PATCH / DELETE | `/admin/coupons*` | staff+ |

## Reservations (`reservation.routes.ts`)

| Method | Path | Auth |
|---|---|---|
| POST | `/reservations` | optional |
| GET | `/reservations/availability` | public |
| GET | `/reservations/mine` | authenticated |
| GET | `/reservations/:id` | optional |
| PATCH / DELETE | `/reservations/:id` | authenticated |
| GET / PATCH | admin reservation routes | staff+ |

## Users (`user.routes.ts`)

| Method | Path | Auth |
|---|---|---|
| POST / PATCH / DELETE | `/users/me/addresses*` | authenticated |
| GET | `/users/me/dashboard-summary` | authenticated |
| GET | `/admin/users`, `/admin/users/:id`, `/admin/users/:id/orders` | admin/manager |
| PATCH | `/admin/users/:id/role` | admin only |
| PATCH | `/admin/users/:id/active` | admin/manager |

## Reviews (`review.routes.ts`)

| Method | Path | Auth |
|---|---|---|
| POST | `/reviews` | authenticated |
| GET | `/reviews/menu-item/:menuItemId` | public |
| GET / PATCH | `/admin/reviews*` | staff+ |

## Wishlist (`wishlist.routes.ts`)

| Method | Path | Auth |
|---|---|---|
| GET / POST | `/wishlist` | authenticated |
| DELETE | `/wishlist/:menuItemId` | authenticated |

## Notifications (`notification.routes.ts`)

| Method | Path | Auth |
|---|---|---|
| GET | `/notifications` | authenticated |
| PATCH | `/notifications/:id/read`, `/notifications/read-all` | authenticated |

**Known gap (pre-existing, not Sprint 16):** no frontend caller exists for this domain yet — the dashboard "Notifications" UI is local-state-only. See `PROJECT_STATUS.md`.

## Uploads (`upload.routes.ts`)

| Method | Path | Auth |
|---|---|---|
| POST | `/uploads/:folder` | authenticated |

## Admin (`admin.routes.ts`)

Read-only analytics/dashboard endpoints — GET only, staff+.

## Newsletter (`newsletter.routes.ts`)

| Method | Path | Auth |
|---|---|---|
| POST | `/newsletter/subscribe` (see file) | public |

## Settings (`settings.routes.ts`)

| Method | Path | Auth |
|---|---|---|
| GET | `/settings` | public |
| PATCH | `/settings` | staff+ |

## AI (`ai.routes.ts`)

| Method | Path | Auth |
|---|---|---|
| POST | `/ai/chat` | optional |
| POST | `/ai/recommend` | optional |
| POST | `/ai/search` | optional |
| GET | `/ai/insights` | staff+ |

## Contact (`contact.routes.ts`)

| Method | Path | Auth |
|---|---|---|
| POST | `/contact` | public |
| GET / PATCH | `/admin/contact-messages*` | staff+ |

## Blog (`blog.routes.ts`)

| Method | Path | Auth |
|---|---|---|
| GET | `/blog`, `/blog/:slug` | public |
| GET / POST / PATCH / DELETE | `/admin/blog*` | staff+ |

## Job Applications / Careers (`job-application.routes.ts`)

| Method | Path | Auth |
|---|---|---|
| POST | create application | public |
| GET / PATCH | admin listing/status | staff+ |

## Health

| Method | Path | Notes |
|---|---|---|
| GET | `/health` | Not versioned (`/health`, not `/api/v1/health`). MongoDB down → 503; Redis down → 200 with a degraded-mode note. |
