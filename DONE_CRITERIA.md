# Done Criteria — Slice 1: Accounts & Contacts

Tick every item before marking the slice complete.

## Test suite

- [ ] `npm test` passes with no failures
- [ ] `npm run typecheck` passes with no errors
- [ ] `npm run lint` passes with no errors

## Endpoint contracts

### `GET /accounts`

- [ ] Returns HTTP 200 with a JSON array
- [ ] Array length equals the number of records in `seeds/accounts.json` (currently 5)
- [ ] Every account object contains `id`, `name`, `industry`, `renewalDate`, and `contacts`
- [ ] `contacts` is always a JSON array — **never `null`**, even for accounts with no contacts (e.g. Cetus Agri Co-op)
- [ ] Empty `contacts` is returned as `[]`, not `null`
- [ ] `renewalDate` may be a string (ISO 8601) or `null` — both are valid

### `GET /accounts/:id`

- [ ] Valid id returns HTTP 200 with the matching account object, including all fields above
- [ ] Unknown id returns HTTP 404
- [ ] The returned account's `contacts` array is always present and always an array (never `null`)

## Forbidden fields

- [ ] No `Opportunity.value` field appears in any response body
- [ ] No `invoiceAmount` field appears anywhere in `src/` or any response body
- [ ] Contact emails (`Contact.email`) are present in API responses (permitted) but are **not written to any log statement** in `src/`

## Handoff

- [ ] `crm-handoff-writer` skill has been run and `HANDOFF.md` is written at the repo root
