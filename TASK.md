# TASK — Slice 1: Accounts & Contacts

## Slice
- Slice 1 of `BUILD_PLAN.md`. First UI lands here.

## Workflow question
- **Who are our customers** — browseable account list with enough context to recognise who matters.
- Detail view also exposes the account's contacts (supports "who should we contact next" later, but ranking is out of scope).

## Entities & fields (all present in `DOMAIN_MODEL.md`)
- `Account`: `id`, `name`, `industry`, `renewalDate` (nullable), `contacts`.
- `Contact`: `id`, `accountId`, `name`, `role`, `email`.
- No new fields. No `Opportunity.*`. No `invoiceAmount` (forbidden tripwire).

## Routes & files
- `src/routes/accounts.go` — replace JSON stub with HTML handlers:
  - `GET /accounts` → list page.
  - `GET /accounts/{id}` → detail page (account + embedded contacts).
  - `404` for unknown id.
- `src/templates/layout.html` — base layout (single nav, no analytics).
- `src/templates/accounts/list.html` — table/cards of accounts.
- `src/templates/accounts/detail.html` — account header + contacts list.
- `src/static/style.css` — plain CSS, served by Go.
- `src/server.go` — register static handler + templates init.
- `tests/accounts.spec.ts` — delete (TS scaffold, replaced).
- `src/routes/accounts_test.go` — new Go tests (workflow-anchored).

## Fixture rows (already in `seeds/accounts.json`, no new rows needed)
- Happy: `Aurora Logistics Oy` — 1 contact, renewal set.
- Loaded: `Brahe Maritime Ltd` — 2 contacts.
- Boundary: `Cetus Agri Co-op` — 0 contacts, `renewalDate: null`.
- Empty-list state: tests load an empty seed file (test helper), not a new row.

## Out of scope
- Opportunities, Activities, Renewal-Risk dashboard (later slices).
- Search, sort, pagination, filters.
- Contact create/edit/delete (read-only slice).
- Auth, sessions, audit log wiring (Slice 5 polish).
- Any client-side build step or JS framework beyond inline HTMX/Alpine.
