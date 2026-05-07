# Done criteria — Slice 1

## Tests
- [ ] `npm test` exits 0 with no skipped tests.
- [ ] `tests/accounts.spec.ts` contains a test for `GET /accounts` that asserts all 5 seeded accounts are returned with `id`, `name`, `industry`, and `contacts` (array).
- [ ] `tests/accounts.spec.ts` contains a test for `GET /accounts/:id` (happy path: known id returns the correct account).
- [ ] `tests/accounts.spec.ts` contains a test for `GET /accounts/:id` with an unknown id returning status 404.
- [ ] Edge case: account `33333333-3333-4333-8333-333333333333` (Cetus Agri, `renewalDate: null`, zero contacts) returns `contacts: []` — not `null` — and does not cause a 500.

## Smoke test
- [ ] `curl -s http://localhost:3000/accounts | jq 'length'` returns `5`.
- [ ] `curl -s http://localhost:3000/accounts/11111111-1111-4111-8111-111111111111 | jq '.name'` returns `"Aurora Logistics Oy"`.
- [ ] `curl -s http://localhost:3000/accounts/33333333-3333-4333-8333-333333333333 | jq '.contacts'` returns `[]` (not `null`).
- [ ] `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/accounts/00000000-0000-0000-0000-000000000000` returns `404`.

## Privacy
- [ ] `invoiceAmount` does not appear anywhere in `src/`.
- [ ] No `Opportunity.value` referenced in this slice (opportunities not touched).

## Domain model
- [ ] No field is used in `src/routes/accounts.ts` that is not declared in `DOMAIN_MODEL.md` (`Account`: `id`, `name`, `industry`, `renewalDate`, `contacts`; `Contact`: `id`, `accountId`, `name`, `role`, `email`).

## Non-goals confirmed
- [ ] No POST / PUT / PATCH / DELETE endpoints added.
- [ ] No filtering, sorting, or pagination implemented on `GET /accounts`.
- [ ] No standalone `/contacts` route introduced.
- [ ] No AI-driven features or generative summaries added.
- [ ] No external data source or import mechanism introduced — `seeds/accounts.json` is the only data read.
