# Slice: Accounts & Contacts

**Scope:** List and detail views for Account and Contact entities, backed by `seeds/accounts.json`, so an account manager can answer "who are our customers?"

## Tasks

1. `src/routes/accounts.ts` — Implement `GET /accounts`: load `seeds/accounts.json`, return all accounts with embedded contacts array (`[]` for empty, never `null`). Response fields: `id`, `name`, `industry`, `renewalDate` (nullable), `contacts`.
2. `src/routes/accounts.ts` — Implement `GET /accounts/:id`: return full account object including embedded contacts; 404 `{ error: "Account not found" }` if ID not found.
3. `src/routes/accounts.ts` — Implement `GET /accounts/:id/contacts`: return the account's contacts array (`[]` if empty, never `null`); 404 `{ error: "Account not found" }` if account ID not found.
4. `tests/accounts.spec.ts` — Extend existing describe block: assert `renewalDate` field on `GET /accounts` response items.
5. `tests/accounts.spec.ts` — Add `GET /accounts/:id` happy-path test: Brahe Maritime Ltd (ID `22222222-2222-4222-8222-222222222222`), assert `id`, `name`, `industry`, `renewalDate`, `contacts` shape.
6. `tests/accounts.spec.ts` — Add `GET /accounts/:id` 404 test: unknown ID returns status 404.
7. `tests/accounts.spec.ts` — Add `GET /accounts/:id/contacts` test: Brahe Maritime returns 2 contacts with `id`, `accountId`, `name`, `role`, `email`.
8. `tests/accounts.spec.ts` — Add `GET /accounts/:id/contacts` empty-state test: Cetus Agri Co-op (ID `33333333-3333-4333-8333-333333333333`) returns `[]`.
9. `tests/accounts.spec.ts` — Add `GET /accounts/:id/contacts` 404 test: unknown account ID returns status 404.

## Field cross-check

All fields used are declared in `DOMAIN_MODEL.md`. No forbidden fields (`Opportunity.value`, `invoiceAmount`) appear. Seeds already complete — no seed changes required.
