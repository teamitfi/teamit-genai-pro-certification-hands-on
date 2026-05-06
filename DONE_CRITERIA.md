# Accounts & Contacts Done Criteria

## Automated Tests

- `tests/accounts.spec.ts` covers `GET /accounts`.
- `tests/accounts.spec.ts` covers `GET /accounts/:id`.
- Tests verify account fields match `DOMAIN_MODEL.md`.
- Tests verify contact fields match `DOMAIN_MODEL.md`.
- Tests verify empty contact collections return `[]`.
- Tests verify an unknown account id returns `404`.

Run before calling the slice done:

1. `npm test`
2. `npm run lint`
3. `npm run typecheck`

## Acceptance Evidence

- Account managers can list customers.
- Account managers can drill into one customer.
- Account responses include embedded contacts.
- Data comes only from synthetic fixtures under `seeds/`.
- The slice remains API-only.

## Domain-Model Checks

- `Account` responses include only `id`, `name`, `industry`, `renewalDate`, and `contacts`.
- `Contact` responses include only `id`, `accountId`, `name`, `role`, and `email`.
- Collection endpoints return `[]` when empty, never `null`.
- No new domain fields are introduced.

## Privacy Checks

- No production customer data is added.
- No billing or invoice surface is added.
- No literal `invoiceAmount` is introduced.
- `Opportunity.value` is not exposed.
- No `.env*`, credentials, or off-limits files are read or changed.

## Reviewer Decision

The reviewer must return one explicit decision:

- `accept` when tests pass and the slice respects product and domain constraints.
- `revise` when changes are close but need concrete fixes.
- `reject` when the slice violates product scope, domain rules, privacy constraints, or test expectations.
