# TASK — Slice 1: Accounts & Contacts

## Slice

Stand up read-only list-and-detail surfaces for `Account` and `Contact` so an account manager can answer **"who are our customers?"** Accounts list with embedded contacts, single-account detail, and per-account contact list/detail — all backed by `seeds/accounts.json` round-tripped through tests. Success: every endpoint round-trips a named fixture row, `[]` is returned for the empty case, and the existing `tests/accounts.spec.ts` is green instead of stub-failing.

## Endpoints

- `GET /accounts` — array of all accounts, contacts embedded.
- `GET /accounts/:id` — single account with embedded contacts; `404` on unknown id.
- `GET /accounts/:id/contacts` — array of contacts for the account; `[]` if zero contacts; `404` if the account is unknown.
- `GET /accounts/:accountId/contacts/:contactId` — single contact; `404` on either unknown id.

No top-level `/contacts` route — contacts are FK-bound to an account in `DOMAIN_MODEL.md`, and the brief's Question 1 surface is "Contacts per account."

## Files to change

**`src/`**
- `src/routes/accounts.ts` — replace the stub `[]` with a real handler; add the `:id` detail route, plus the nested `/accounts/:id/contacts` and `/accounts/:accountId/contacts/:contactId` routes. Contacts live here (not a separate file) because they don't own a URL namespace — every contact endpoint is rooted under `/accounts`. Keep handlers thin (no shaping logic — return rows from the loader as-is). If contacts later grow non-trivial logic, split to `src/routes/accounts/contacts.ts` then.
- `src/lib/seedStore.ts` — **new.** Single accessor for `seeds/accounts.json`. Reads the file once at module load; exports `listAccounts()`, `getAccount(id)`, `listContacts(accountId)`, `getContact(accountId, contactId)`. No caching beyond the import-time read; no `Date.now`/`Math.random`.
- `src/server.ts` — no change. `accountsRoutes` already registered; contacts ride along.

**`tests/`**
- `tests/accounts.spec.ts` — extend: detail happy path, detail-404, boundary cases (`renewalDate: null`, `contacts: []`).
- `tests/contacts.spec.ts` — **new.** Per-account list, per-account list-empty (`Cetus Agri Co-op`), contact detail happy path, account-404, contact-404. Kept as a sibling spec (not folded into `accounts.spec.ts`) so each file stays scannable; Vitest discovery is flat regardless.
- `tests/privacy.spec.ts` — **new.** Greps `src/` for the literal string `invoiceAmount` and asserts zero matches. Cross-cutting tripwire required by `PRODUCT_BRIEF.md` acceptance evidence #5 for any slice touching `src/`.

**`seeds/`**
- `seeds/accounts.empty.json` — **new.** `[]`. Anchors the empty-state assertion in `tests/accounts.spec.ts`. Generate via the `crm-test-fixtures` skill — do not hand-author.

## Test strategy

| Case | Endpoint | Fixture row / file | Assertion |
| ---- | -------- | ------------------ | --------- |
| Happy — list | `GET /accounts` | `seeds/accounts.json` (all 5) | length + shape (`id`, `name`, `industry`, `renewalDate`, `contacts[]`); id-set equals seed id-set |
| Empty — list | `GET /accounts` (server built against empty fixture) | `seeds/accounts.empty.json` | body is `[]`, not `null` |
| Boundary — null renewalDate | `GET /accounts/:id` | `Cetus Agri Co-op` | `renewalDate` is exactly `null`, not omitted, not `""` |
| Boundary — empty contacts | `GET /accounts/:id` | `Cetus Agri Co-op` | `contacts` is `[]`, not omitted, not `null` |
| Boundary — multiple contacts | `GET /accounts/:id` | `Brahe Maritime Ltd` | both contacts present, order preserved |
| Detail — 404 | `GET /accounts/does-not-exist` | n/a | `statusCode === 404` |
| Contacts — list | `GET /accounts/:id/contacts` | `Brahe Maritime Ltd` | array with both contact rows, shape matches seed |
| Contacts — empty | `GET /accounts/:id/contacts` | `Cetus Agri Co-op` | body is `[]`, account-404 not raised |
| Contact — detail | `GET /accounts/:accountId/contacts/:contactId` | `Liisa Korhonen` under `Aurora Logistics Oy` | shape matches the embedded contact row exactly |
| Contact — 404 (unknown contact) | `GET /accounts/:accountId/contacts/zzz` | n/a | `statusCode === 404` |
| Privacy — `invoiceAmount` | n/a — grep over `src/` | n/a | zero matches |

To support the empty-list test cleanly, allow `buildServer()` to accept an optional seed source (e.g. `buildServer({ seedsPath })` or an injected store). The default reads `seeds/accounts.json`. This keeps the empty-fixture test from mutating shared state.

## Non-goals

- **No write paths.** No `POST` / `PUT` / `PATCH` / `DELETE` on either entity. Slice 4 (Renewal-Risk) is also read-only on purpose; this slice does not establish a write convention.
- **No filtering, search, sorting, or pagination.** Lists return every row.
- **No top-level `/contacts` route.** Contacts are accessed through their account.
- **No Opportunity, Activity, or Renewal-Risk surfacing.** Those are slices 2, 3, and 4.
- **No UI.** API-only per `AGENTS.md`. No HTML, no React, no static assets.
- **No new fields.** If a need surfaces, stop and route to `crm-domain-modeler` first.
- **No production-shaped data.** New fixture rows go through `crm-test-fixtures` and use `@example.test` / `@*.invalid` style emails.
- **No logging of contact emails, names, or account names** beyond IDs (`PRODUCT_BRIEF.md` privacy rule).
