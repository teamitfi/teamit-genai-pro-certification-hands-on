# Accounts & Contacts Slice

## Core Question

Who are our customers, and who are the relevant contacts for each customer?

## User Story

As an account manager, I can list synthetic customer accounts and open one account to see its contacts so that I can identify customers and their relationship owners quickly.

## Scope

- Implement the Accounts & Contacts slice only.
- Use `seeds/accounts.json` as the only data source.
- Return fields declared in `DOMAIN_MODEL.md` for `Account` and embedded `Contact`.
- Keep empty contact lists as `[]`, never `null`.

## Tasks

1. Replace the stubbed `GET /accounts` response with the seeded accounts list.
2. Add `GET /accounts/:id` for account detail, including embedded contacts.
3. Return `404` for an unknown account id.
4. Keep responses free of forbidden fields, especially `invoiceAmount` and `Opportunity.value`.
5. Extend account route tests to prove list, detail, not-found, empty contacts, and privacy-boundary behavior.

## Likely Files

- `src/routes/accounts.ts`
- `tests/accounts.spec.ts`
- `seeds/accounts.json` only if another synthetic boundary row is needed

## Required Tests

- `GET /accounts` returns all seeded accounts with declared account and contact fields.
- `GET /accounts/:id` returns the matching seeded account and its contacts.
- `GET /accounts/:id` returns `404` for a missing account.
- The seeded account with no contacts returns `contacts: []`.
- API responses do not include `invoiceAmount` or opportunity value fields.

## Non-Goals

- No opportunity pipeline, activity timeline, renewal-risk dashboard, or handoff-polish work.
- No UI, admin console, search, sorting, filtering, editing, imports, or exports.
- No external APIs, production customer data, hidden integrations, analytics, AI features, invoicing, billing, or payment fields.
- No changes to `DOMAIN_MODEL.md` unless implementation discovers a missing field that blocks the slice.
