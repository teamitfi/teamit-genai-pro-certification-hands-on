# DONE_CRITERIA

- [ ] The slice answers: "Who are our customers?"
- [ ] `GET /accounts` returns the seeded accounts with embedded contacts from `seeds/accounts.json`.
- [ ] `GET /accounts/:accountId` returns one seeded account with embedded contacts.
- [ ] Unknown account detail requests return `404`.
- [ ] API behavior matches the task and returns `[]` for empty contact collections.
- [ ] Tests cover the happy path plus account detail, unknown account detail, and the empty-contact privacy/contract edge case.
- [ ] API responses and UI, if any, do not expose `Opportunity.value`.
- [ ] No `invoiceAmount`, invoice data, production data, or hidden integration was introduced.
- [ ] `npm test` passes.
- [ ] `npm run lint` passes.
- [ ] `npm run typecheck` passes.
- [ ] The final report names changed files, user-facing behavior, checks, and any known residual risk.
