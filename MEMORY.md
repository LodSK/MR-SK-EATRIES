# MR_SK EATRIES Project Memory

## Approved visual roadmap

The owner approved a two-phase UI and image improvement program on 2026-08-28.

### Phase 1 — immediate visual foundation

- Replace repeated/category-level dish imagery with per-dish photography wherever `MenuItem.images[]` is available.
- Keep category photography as a safe fallback for older or unphotographed dishes.
- Add dedicated hero imagery to the Menu and Gallery pages instead of relying on the generic dark gradient hero.
- Replace the homepage Instagram/social placeholder tiles with real restaurant imagery from the local media library.
- Correct image alternative text so it describes the actual subject.
- Preserve `next/image`, reduced-motion behavior, and the existing centralized media constants.

### Phase 2 — richer brand image system

- Source or create authentic MR_SK EATRIES photography for signature dishes, staff, kitchen process, guests, celebrations, cocktails, and Accra atmosphere.
- Add individual images for the full menu, beginning with featured meals and specials.
- Upgrade category cards from icon-only tiles to image-led cards where this improves discovery.
- Add editorial imagery for Events, About, and Blog experiences.
- Move production media to Cloudinary when deployment credentials and the final asset set are ready.
- Standardize warm, cinematic image grading and consistent crop/focal-point rules across responsive breakpoints.

## Implementation status

- Phase 1 started: per-item image fallback support, page-hero imagery, social gallery imagery, and hero alt-text correction.
- Phase 2 started: category cards are now image-led and meal detail galleries prefer real `MenuItem.images[]` when present.
- Phase 2 queued: real per-dish asset acquisition, editorial/event photography, and Cloudinary migration.

## Review findings to preserve

- Homepage ratings and menu ratings for the same dishes are inconsistent and need one source of truth before launch.
- The live site currently uses placeholder contact details; verify business phone, email, address, and social accounts before production.
- Do not fabricate a multi-image meal gallery from one photograph. Use one honest fallback image until real per-dish galleries exist.
