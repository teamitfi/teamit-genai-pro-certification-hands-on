# Accounts & Contacts Slice

## User Value

Answer the account-manager question: "Who are our customers?"

This slice exposes read-only account list and account detail data with embedded contacts, backed only by synthetic seed data.

## Scope

- Add API support for listing accounts.
- Add API support for retrieving one account by id.
- Include embedded contacts for each account.
- Preserve empty contact lists as `[]`.
- Keep the slice API-only; there is no UI in day one scope.

## Likely Files To Change

- `src/routes/accounts.ts`
- `tests/accounts.spec.ts`
- `TASK.md`
- `DONE_CRITERIA.md`

## Implementation Tasks

1. Load account data from `seeds/accounts.json`.
2. Define route-local `Account` and `Contact` types that match `DOMAIN_MODEL.md`.
3. Return all seeded accounts from `GET /accounts`.
4. Return one seeded account from `GET /accounts/:id`.
5. Return `404` for an unknown account id.
6. Extend account route tests for list, detail, missing-account, contact shape, and empty contacts.
7. Run the slice checks before review.

## Non-Goals

- No account or contact writes.
- No search, filtering, sorting, or pagination.
- No opportunities, activities, renewal-risk logic, or pipeline behavior.
- No UI.
- No AI behavior or external integrations.
- No billing, invoices, invoice amounts, or production data.

## Risks Or Open Questions

- The route should not invent fields outside `DOMAIN_MODEL.md`.
- API responses must not expose forbidden fields, including `Opportunity.value` or any literal `invoiceAmount`.
- All data must remain synthetic and sourced from `seeds/`.
