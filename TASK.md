# Task: Accounts & Contacts

## What we're building

This slice answers **"Who are our customers?"** — the first core workflow. It wires up
`GET /accounts` and `GET /accounts/:id` so an account manager can browse the full
account list and drill into a single account's details and associated contacts.
All data is served from `seeds/accounts.json`. Contact PII (`email`) is withheld
from the list view and exposed only on the detail endpoint.

## Files to change

- `src/routes/accounts.ts` — implement `GET /accounts` (read seeds, strip email from embedded contacts) and `GET /accounts/:id` (full account + contacts including email; 404 on miss)
- `tests/accounts.spec.ts` — add: detail endpoint happy path, 404 case, PII-strip assertion on list, empty-contacts assertion, forbidden-field check
- `seeds/accounts.json` — no changes needed; coverage already includes happy-path, empty-contacts (Cetus Agri), and null-renewalDate rows

## Domain fields in scope

| Field              | Type                   | Source in DOMAIN_MODEL.md  |
| ------------------ | ---------------------- | -------------------------- |
| `Account.id`       | string (UUID)          | Account table              |
| `Account.name`     | string                 | Account table              |
| `Account.industry` | string                 | Account table              |
| `Account.renewalDate` | string \| null      | Account table              |
| `Account.contacts` | `Contact[]`            | Account table (embedded)   |
| `Contact.id`       | string (UUID)          | Contact table              |
| `Contact.accountId`| string                 | Contact table              |
| `Contact.name`     | string                 | Contact table              |
| `Contact.role`     | string                 | Contact table              |
| `Contact.email`    | string                 | Contact table — detail only |

## Non-goals

- Does not implement any write operations (POST, PATCH, DELETE).
- Does not add a dedicated `GET /accounts/:id/contacts` route — contacts are embedded in the account response.
- Does not implement search or filtering — plain list and detail only.
- Does not touch Opportunity, Activity, or renewal-risk data — those are later slices.
