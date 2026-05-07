# Slice 1 — Accounts & Contacts

## Goal
Implement `GET /accounts` and `GET /accounts/:id` so an account manager can list all customers and drill into a single account with its embedded contacts.

## Pre-conditions
- `seeds/accounts.json` exists with 5 accounts (confirmed).
- `DOMAIN_MODEL.md` declares all fields used (`id`, `name`, `industry`, `renewalDate`, `contacts`, and all `Contact` fields) — confirmed, no gaps.
- No prior slice dependency.

## Steps
- [ ] 1. Update `src/routes/accounts.ts`: read `seeds/accounts.json` at request time and return the full array from `GET /accounts`.
- [ ] 2. Verify `GET /accounts` returns all 5 accounts with embedded contacts (run the existing test: `npx vitest run tests/accounts.spec.ts`).
- [ ] 3. Add `GET /accounts/:id` to `src/routes/accounts.ts`: find by `id`, return the account or a 404 JSON error.
- [ ] 4. Add tests for `GET /accounts/:id` in `tests/accounts.spec.ts`: happy path (known id returns correct account) and 404 path (unknown id returns 404).
- [ ] 5. Add an edge-case assertion: the account with `id` `33333333-3333-4333-8333-333333333333` (Cetus Agri, zero contacts, `renewalDate: null`) returns `contacts: []` and does not throw.
- [ ] 6. Run `npm test` — all tests pass, none skipped.

## Out of scope
- Write, update, or delete endpoints of any kind.
- Filtering, sorting, or pagination on the list.
- Contact endpoints outside of account embedding (`GET /contacts` is not part of this slice).
- Any other slice (Opportunities, Activities, Renewal-Risk).
