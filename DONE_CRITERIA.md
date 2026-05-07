# Done Criteria — Slice 1: Accounts & Contacts

A slice is done when ALL of the following are true:

- [ ] The product question "who are our customers?" can be answered using only the new endpoints.
- [ ] `GET /accounts` returns the seeded accounts from `seeds/accounts.json`.
- [ ] `GET /accounts/:id` returns one seeded account when the id exists.
- [ ] `GET /accounts/:id` returns `404` when the id does not exist.
- [ ] `npm test` passes with no skipped tests.
- [ ] `npm run lint` exits 0.
- [ ] `npm run typecheck` exits 0.
- [ ] No forbidden field (`Opportunity.value`, `invoiceAmount`) appears in any API response or test fixture.
- [ ] Empty collections return `[]`, not `null`.
- [ ] All `Opportunity.stage` values used in code and fixtures match the case-sensitive enum exactly.
- [ ] `DOMAIN_MODEL.md` was not changed by this slice (or, if it was, the change was reviewed and committed separately before any code).
- [ ] Seed data is synthetic only — no real customer, contact, or financial data.
- [ ] Account and contact response fields match `DOMAIN_MODEL.md`; no new fields were invented.
