# DONE_CRITERIA — Slice 1: Accounts & Contacts

The slice is **in progress** until every box below is checked. Derived from `PRODUCT_BRIEF.md` acceptance evidence — a green test alone is not sufficient.

## Build gates

- [ ] `npm test` passes — full Vitest run, no skipped specs, no `.only`.
- [ ] `npm run typecheck` passes — `tsc --noEmit` clean.
- [ ] `npm run lint` passes — ESLint clean, no `--fix`-pending changes left in the diff.

## Coverage gates

- [ ] **`GET /accounts`** has ≥3 tests: happy (returns seeded list), empty (`[]` against the empty fixture), and one boundary assertion (e.g., `renewalDate: null` preserved verbatim).
- [ ] **`GET /accounts/:id`** has ≥3 tests: happy, 404 on unknown id, and a boundary case (account with `contacts: []` returns `[]`, not omitted).
- [ ] **`GET /accounts/:id/contacts`** has ≥3 tests: happy (multiple contacts), empty (`[]` for `Cetus Agri Co-op`), and account-404.
- [ ] **`GET /accounts/:accountId/contacts/:contactId`** has ≥3 tests: happy, 404 on unknown contact, 404 on unknown account.

## Contract gates

- [ ] Empty-state contract: every list endpoint returns `[]` for empty collections; **never `null`**. Asserted with a strict equality test (`toEqual([])`), not just truthiness.
- [ ] Fixture provenance: each response shape round-trips a row in `seeds/accounts.json` (or `seeds/accounts.empty.json` for the empty case). Each shape-asserting test names the fixture file in a comment or import path.
- [ ] No invented fields: the response contains only fields declared in `DOMAIN_MODEL.md` for `Account` and `Contact`. A test compares response keys to the model's declared set.

## Privacy gates

- [ ] **`invoiceAmount` tripwire.** A test (`tests/privacy.spec.ts`) greps `src/` for the literal string `invoiceAmount` and asserts zero matches. Required because this slice touches `src/`.
- [ ] **No `Opportunity.value` leak risk in this slice** — `Opportunity` is not surfaced here, so no per-response assertion is required. Confirmed by inspection: no Opportunity import in any new file.
- [ ] **No PII in logs.** A grep of new `src/` files finds no `server.log.info`/`server.log.warn`/`console.log` call that includes contact `email`, contact `name`, or account `name`. IDs only.
- [ ] **No real-data leaks.** Reviewer pass over the diff confirms no real names, real domains (anything not `*.example` / `*.test` / `*.invalid`), or real emails were introduced in `seeds/`, tests, or commit messages.

## Process gates

- [ ] New fixture rows (the empty fixture) were generated via the **`crm-test-fixtures`** skill, not hand-authored.
- [ ] No edits to `DOMAIN_MODEL.md` were required. If the slice forced a model change, it was routed through **`crm-domain-modeler`** in a separate commit *before* the route code.
- [ ] **`HANDOFF.md` written via `crm-handoff-writer`** at the end of the slice — what was completed, files changed, test status, open risks, and the next recommended slice (Opportunity Pipeline per `BUILD_PLAN.md`).
