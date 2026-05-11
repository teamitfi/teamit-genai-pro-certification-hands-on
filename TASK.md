# TASK — Slice 1: Accounts & Contacts

## Goal

Wire `GET /accounts` and `GET /accounts/:id` to serve data from `seeds/accounts.json`.
Answers the core question: "Who are our customers?"

## Routes

| Method | Path | Response fields |
|--------|------|----------------|
| GET | `/accounts` | `id`, `name`, `industry`, `renewalDate`, `contacts[]` |
| GET | `/accounts/:id` | `id`, `name`, `industry`, `renewalDate`, `contacts[]` |

`contacts[]` items: `id`, `accountId`, `name`, `role`, `email`.

## Field validation

All fields sourced from `DOMAIN_MODEL.md`. No invented fields. Forbidden fields `Opportunity.value` and `invoiceAmount` are not applicable to this slice and must not appear.

## Implementation steps

1. Load `seeds/accounts.json` (ESM-safe path via `import.meta.url`).
2. `GET /accounts` → return full array.
3. `GET /accounts/:id` → find by `id`; return `404 { error: "Not found" }` if missing.
4. `contacts` must always be an array — never `null` (empty contacts → `[]`).
5. `renewalDate` may be `null` for prospects — pass through as-is.

## Seed reference

File: `seeds/accounts.json` — 5 accounts:
- Aurora Logistics Oy — 1 contact
- Brahe Maritime Ltd — 2 contacts
- Cetus Agri Co-op — 0 contacts, `renewalDate: null`
- Draco Energy Holdings — 1 contact
- Equuleus Health Networks — 1 contact

## Non-goals

- No POST / PUT / DELETE.
- No Opportunity or Activity data.
- No pagination or filtering.
- No UI — API only.
