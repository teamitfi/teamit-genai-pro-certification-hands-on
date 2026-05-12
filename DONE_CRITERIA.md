# Done Criteria: Accounts & Contacts

## Acceptance Criteria

- `GET /accounts` answers "who are our customers?" by returning the synthetic accounts from `seeds/accounts.json`.
- Each account response includes only declared `Account` fields: `id`, `name`, `industry`, `renewalDate`, and `contacts`.
- Each embedded contact includes only declared `Contact` fields: `id`, `accountId`, `name`, `role`, and `email`.
- `GET /accounts/:id` returns one matching account with embedded contacts.
- Unknown account ids return `404`.
- Accounts with no contacts return `contacts: []`.

## Required Tests

- Run `npm test`.
- Run `npm run lint`.
- Run `npm run typecheck`.
- `tests/accounts.spec.ts` covers list, detail, not-found, empty contacts, and forbidden-field checks.

## UI Checks

- No UI is in scope for this slice.
- API responses should be inspectable through tests or a local HTTP request if manual evidence is needed.

## Product-Boundary Checks

- Data comes only from `seeds/accounts.json`.
- Seed data remains visibly synthetic and uses synthetic work-style email addresses.
- No production customer data is introduced.
- No hidden integrations, background sync, external APIs, analytics, AI features, invoicing, billing, payment status, or invoice history are introduced.
- `invoiceAmount` does not appear in `src/`, tests, fixtures, docs, screenshots, or sample output.
- `Opportunity.value` is not exposed in API responses or UI.

## Handoff Evidence

- Summarize changed files.
- Record exact test commands and results.
- Note any open risks or decisions not to reopen.
- Confirm the slice stayed within `PRODUCT_BRIEF.md`, `BUILD_PLAN.md`, and `DOMAIN_MODEL.md`.
