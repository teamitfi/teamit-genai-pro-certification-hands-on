# TASK

## Slice

Slice 1. Accounts & Contacts (Session 1, Lab S1.4 starts this)

## User Story

As an account manager, I can list customer accounts and inspect account contact details so that I can answer "who are our customers?"

## In Scope

- Implement a read-only `GET /accounts` endpoint backed only by `seeds/accounts.json`.
- Return every seeded account with its declared `id`, `name`, `industry`, `renewalDate`, and embedded `contacts`.
- Preserve each contact's declared `id`, `accountId`, `name`, `role`, and `email`.
- Implement a read-only account detail endpoint, `GET /accounts/:accountId`, that returns one seeded account with its embedded contacts.
- Return `404` for an unknown account id on the detail endpoint.
- Preserve empty contact collections as `[]`, never `null`.
- Keep the route module pattern already used by `src/routes/accounts.ts` and registered from `src/server.ts`.

## Out of Scope

- Creating, updating, deleting, importing, or enriching accounts or contacts.
- Frontend UI.
- Opportunity pipeline behavior, `Opportunity.stage` grouping, or exposure of `Opportunity.value`.
- Activity timeline, next-contact recommendations, renewal-risk calculations, or handoff polish.
- Authentication, permissions, admin tooling, report builders, custom fields, or hidden integrations.
- Invoice, billing, accounting, calendar, email, marketing, analytics, CRM, or production-data integrations.

## Domain And Data Contracts

- `Account` fields allowed in API responses: `id`, `name`, `industry`, `renewalDate`, `contacts`.
- `Contact` fields allowed in API responses: `id`, `accountId`, `name`, `role`, `email`.
- `Account.contacts` is embedded and must be an array.
- Empty collections must return `[]`, never `null`.
- `seeds/accounts.json` is the only data source for this slice.
- Seed data must remain small, readable, and synthetic.
- Do not introduce fields outside `DOMAIN_MODEL.md`.
- Do not introduce `invoiceAmount`, invoice data, production data, real customer exports, or hidden integrations.
- `Opportunity.value` is internal and must not appear in API responses or UI.

## Expected Files

- `src/routes/accounts.ts` - implement the read-only accounts list and account detail endpoints using the existing Fastify route-module pattern.
- `tests/accounts.spec.ts` - cover the accounts list, account detail, unknown account detail, and empty contacts contract.
- `seeds/accounts.json` - keep as the synthetic data source; change only if a small readable fixture adjustment is needed for this slice.

## Implementation Notes

- Prefer TypeScript types that mirror the declared `Account` and `Contact` fields instead of returning untyped raw data.
- Use `resolveJsonModule` or Node file-reading APIs consistently with the repo's TypeScript ES module setup.
- Keep response shaping explicit enough that future forbidden fields cannot be leaked accidentally if seed rows grow.
- Tests should verify account and contact field presence, the seeded account count, a known account detail response, and that the account with no contacts returns `contacts: []`.
- Do not add a frontend or any non-seed data source.
