# MR_SK EATRIES — Project Status

_Last updated: Foundation Recovery Sprint (post Sprint 2)_

This file is the single source of truth for what has actually been built. It is updated at the end of every sprint.

---

## ⚠️ Foundation Recovery Note

A recovery pass consolidated Sprint 1 (architecture/config) and Sprint 2 (UI/layout) into one verified, working project tree, and added the previously-missing root tooling files (`postcss.config.js`, `eslint.config.js`, `README.md`, `PROJECT_STATUS.md`, `CLAUDE_RULES.md`). No Sprint 1 or Sprint 2 application code was rewritten — only additive files were introduced and the whole tree was re-verified and re-packaged as a single ZIP. Full detail in the "Foundation Recovery Sprint" section below.

---

## Sprint Checklist

| Sprint | Scope | Status |
|---|---|---|
| 1 | Architecture, folder structure, tech stack, configs | ✅ Complete |
| 2 | Layouts, theme, navbar, footer, global styles, loading screen, animations | ✅ Complete |
| — | **Foundation Recovery Sprint** (consolidation + packaging) | ✅ Complete |
| 3 | Homepage: Hero, CTA, Featured Meals, Story, Featured Categories, Why Choose Us | ✅ Complete |
| 4 | Homepage remainder: Testimonials, Newsletter, Instagram, Gallery Preview, Footer polish | ✅ Complete |
| 5 | About Page: Story, Mission, Vision, Timeline, Team | ⏭ Next |
| 6 | Menu System: Categories, Cards, Filtering, Search, Sorting | Pending |
| 7 | Cart, Wishlist, Checkout, Coupons, Order Summary | Pending |
| 8 | Auth: Register, Login, Forgot Password, JWT, Google Login architecture | Pending |
| 9 | Backend: Express, MongoDB, Models, Routes, Controllers, Middleware | Pending |
| 10 | Reservation System: Calendar, Availability, Booking, Emails | Pending |
| 11 | Customer Dashboard: Orders, Reservations, Profile, Addresses, Wishlist | Pending |
| 12 | Admin Dashboard: Charts, Analytics, Users, Orders, Reservations, Inventory, Menu, Blogs, Reviews | Pending |
| 13 | AI Chatbot, Recommendation Engine, Search, FAQ Assistant | Pending |
| 14 | Performance, SEO, Accessibility, Lazy Loading, Caching | Pending |
| 15 | Docker, Deployment, README, Testing, Production Review | Pending |

---

## Files That Exist Today

### Root
- `package.json` (npm workspaces) · `.gitignore` · `README.md` · `PROJECT_STATUS.md` · `CLAUDE_RULES.md` · `ARCHITECTURE.md`

### `frontend/`
- `package.json` · `tsconfig.json` · `next.config.ts` · `tailwind.config.ts` · `postcss.config.js` · `eslint.config.js` · `.env.example`
- `src/app/layout.tsx` · `src/app/page.tsx` (full homepage, Sprints 3–4) · `src/app/loading.tsx` · `src/app/globals.css`
- Full route-folder tree scaffolded (empty, awaiting content) under `src/app/`: `(marketing)/{about,menu/*,reservations,gallery,events,blog/[slug],contact,faq,careers}`, `account/*`, `admin/*`, `auth/*`, `api/*`, `cart`, `checkout`, `order`, `track-order`, `wishlist`
- `src/components/layout/{Navbar,MobileMenu,Footer}.tsx` (Footer extended in Sprint 4: opening hours, back-to-top)
- `src/components/shared/{ThemeProvider,ThemeToggle,LoadingScreen,Rating,SectionHeading,BackToTop}.tsx`
- `src/components/home/{Hero,FeaturedMeals,MealCard,Categories,CategoryCard,WhyChooseUs,Stats,StatCounter,TodaysSpecials,SpecialCard,Testimonials,TestimonialCard,InstagramGallery,Newsletter,FAQ}.tsx`
- `src/components/ui/{button,accordion}.tsx`
- Empty scaffolded folders awaiting content: `components/{menu,cart,checkout,reservations,about,gallery,blog,dashboard,admin,auth,chatbot}`
- `src/config/{site,fonts}.ts` · `src/types/{nav,menu,home,testimonial,faq}.ts`
- `src/lib/utils/cn.ts` · `src/lib/animations/{variants,gsap}.ts` · `src/lib/hooks/{useScrollReveal,useCountUp}.ts`
- `src/lib/constants/{homepage-data,testimonials-data,social-gallery-data,specials-data,faq-data}.ts`
- `src/lib/api/newsletter.ts` · `src/lib/validations/newsletter.ts`
- Empty scaffolded folder awaiting content: `lib/store`

### `backend/`
- `package.json` · `tsconfig.json` · `.env.example`
- Full folder tree scaffolded (empty, awaiting Sprint 9): `src/{config,models,controllers,routes,middleware,services,utils,validators,sockets,jobs,types}`, `tests/{unit,integration}`, `logs/`

---

## Known Limitations (by design, until later sprints)

- Backend has no server entrypoint yet (`src/server.ts` doesn't exist until Sprint 9) — `npm run dev:backend` will not start a server today.
- Homepage sections use static, in-repo data (`lib/constants/*.ts`: meals, categories, specials, testimonials, social posts, FAQs) — swapped for live API data (TanStack Query → Express) in Sprint 6 (menu), Sprint 9 (backend/reviews), and Sprint 13 (as applicable). Data shapes already match the future API contract so this is a data-source swap, not a component rewrite.
- Meal/category/special/gallery cards use designed gradient-and-icon placeholders instead of real photography — swapped for actual food photography (via Cloudinary) once assets are supplied; no external image domains were added to avoid depending on network access this build has none of.
- Instagram gallery links to the real profile URL from `site.ts` but tile content is placeholder — swapped for a live Instagram Graph API feed in a later sprint.
- Cart icon badge in the Navbar is static (0) — wired to the Zustand cart store in Sprint 7.
- Both newsletter forms (Footer shortcut + homepage Newsletter section) call `lib/api/newsletter.ts`, which simulates a network call — its internals (not its signature) are replaced with a real `POST /api/v1/newsletter` call in Sprint 9.
- No `node_modules` are included in delivered ZIPs — this sandbox has no network access to run `npm install`, so dependency installation must happen on the developer's machine. See "Verification Method" below.

---

## Verification Method

This build environment does not have outbound network access, so `npm install` cannot be executed here to prove a live `npm run dev`. Verification performed instead:

1. **Structural check** — every folder in the required project structure exists; no placeholder/empty files where real code was expected.
2. **Import resolution check** — every `@/...` import across all `.ts`/`.tsx` files was programmatically resolved against the actual file tree (path aliases from `tsconfig.json`). Result: all internal imports resolve.
3. **Manual review** — every generated file was written in full (no `// TODO` / `// continue here` placeholders), following the coding rules in `CLAUDE_RULES.md`.

Once `npm install` is run in a networked environment, `npm run dev` is expected to start cleanly based on (1)–(3). If it doesn't, that's a bug to report, not an expected gap.

---

## Next Sprint

**Sprint 5** — About Page: Restaurant Story, Mission, Vision, Timeline, Team.
