# Slice 1: Accounts & Contacts

## Goal
Answer "who are our customers?" by exposing seeded accounts and their embedded contacts through read-only API endpoints.

## Files to create or modify
- `src/routes/accounts.ts` — load synthetic account fixtures from `seeds/accounts.json` and return account list/detail responses.
- `tests/accounts.spec.ts` — cover the account list/detail API contract, seeded data, empty contact collections, and not-found behavior.
- `seeds/accounts.json` — use the existing synthetic fixtures only; adjust only if a test case requires a domain-valid fixture.

## API contract
- `GET /accounts`
  - Request shape: no body.
  - Response shape: `Account[]`.
  - Each account object includes `id`, `name`, `industry`, `renewalDate`, and `contacts`.
  - Each embedded contact includes `id`, `accountId`, `name`, `role`, and `email`.
  - Accounts with no contacts return `"contacts": []`, never `null`.

- `GET /accounts/:id`
  - Request shape: `id` path parameter matching `Account.id`.
  - Success response shape: one `Account` with `id`, `name`, `industry`, `renewalDate`, and `contacts`.
  - Not found response shape: HTTP `404` with an error response.
  - Accounts with no contacts return `"contacts": []`, never `null`.

No `Opportunity` fields are exposed in this slice. `Opportunity.value` and `invoiceAmount` must not appear in any API response or test fixture.

## Seed data
Use `seeds/accounts.json` as the only data source. The existing fixtures already include synthetic accounts, embedded contacts, a nullable `renewalDate`, and an account with an empty `contacts` array.

## Tests
- `GET /accounts` returns every seeded account.
- `GET /accounts` returns domain-model fields only for accounts and contacts.
- `GET /accounts` preserves empty contact collections as `[]`, not `null`.
- `GET /accounts/:id` returns the matching seeded account with embedded contacts.
- `GET /accounts/:id` returns `404` for an unknown account id.
- Responses and fixtures do not include `Opportunity.value` or `invoiceAmount`.

## Dev-loop commands to run before declaring done
- npm test
- npm run lint
- npm run typecheck
