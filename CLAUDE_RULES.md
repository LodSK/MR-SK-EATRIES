# CLAUDE_RULES.md

Build rules governing every sprint of the MR_SK EATRIES project. These persist for the remainder of the build and supersede any conflicting default behavior.

---

## Sprint Discipline

- Work one sprint at a time, in the order defined in `PROJECT_STATUS.md`.
- Never combine two sprints into one delivery.
- Never generate placeholder code (`// TODO`, `// continue here`, `// add code`). Every file delivered must be complete.
- Never skip a file that a sprint requires.
- Never reduce code quality or completeness to save space — if a response limit is hit, stop cleanly at the end of a completed file, never mid-function.
- After each sprint, stop and wait for explicit confirmation (`CONTINUE`) before starting the next.

## Project Structure Discipline

- Preserve the established monorepo structure (`frontend/`, `backend/`, root docs) exactly. Do not restructure or rename existing folders without a stated reason.
- Every new file goes directly into its correct existing folder — never into a new ad hoc location.
- Do not regenerate files that haven't changed. If a file needs a change, only that file is modified and the reason is stated.

## Delivery Format

- Every sprint from the Foundation Recovery Sprint onward is delivered as **one downloadable ZIP**, named `MR-SK-EATRIES.zip`, containing the full project at its current state — not just the sprint's new files.
- No loose/individual downloadable files. If a file is new or changed, it's inside the ZIP, in its correct path.
- The ZIP must extract into a project that is immediately usable — nothing manually moved or reorganized by the person downloading it.

## Code Standards

- TypeScript strict mode throughout.
- Clean/layered architecture: routes → controllers → services → models (backend); routes → components → lib → types (frontend).
- Component reusability, strong typing, and security best practices are non-negotiable, not aspirational.
- Original branding, copy, and layout only — no copied third-party content.

## Verification Before Delivery

Before a ZIP ships, verify:
- Full folder structure is present, no missing directories.
- Every internal (`@/...`) import resolves to a real file.
- No orphaned or empty files where real content was expected.
- `PROJECT_STATUS.md` is updated to reflect the true current state.

Because this build environment has no outbound network access, `npm install` / `npm run dev` cannot be executed live here. Verification is done via structural and import-resolution checks instead, and this limitation is stated plainly in every status report rather than claiming an untested command "succeeded."

## Status Reporting

Every sprint response ends with, at minimum:
- Project Structure Summary
- Files Created / Files Modified
- Verification Results
- Next Sprint
