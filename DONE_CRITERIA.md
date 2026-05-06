# DONE CRITERIA — Slice 1: Accounts & Contacts

A reviewer may mark this slice **accept** only when all of the following are true.

## Test assertions (must all pass)

1. `GET /accounts` returns HTTP 200.
2. Response body length equals the number of accounts in `seeds/accounts.json` (currently 5).
3. Every account object contains `id`, `name`, `industry`, `renewalDate`, and `contacts`.
4. `contacts` is an array (never `null`) — including for accounts with no contacts (e.g., Cetus Agri Co-op).
5. The set of `id` values in the response exactly matches the set of `id` values in `seeds/accounts.json`.
6. `GET /accounts/:id` with a valid seed ID returns HTTP 200 and the matching account.
7. `GET /accounts/:id` with an unknown ID returns HTTP 404.

## Empty-state contract

- `GET /accounts` must return `[]` if there are no accounts — never `null`.
- `contacts` on any account must be `[]` if the account has no contacts — never `null`.

## Forbidden-field checks

- The response for `GET /accounts` must NOT contain a field named `value` on any nested object.
- The response must NOT contain a field named `invoiceAmount` anywhere in the payload.

## Reviewer command

```bash
npm test
```

All tests must exit 0. Review the diff in `src/routes/accounts.ts` against `DOMAIN_MODEL.md` and confirm:
- Only fields declared in `DOMAIN_MODEL.md` for `Account` and `Contact` are returned.
- No forbidden fields (`Opportunity.value`, `invoiceAmount`) are present.

## Non-goals for this slice

- No pagination — return all accounts in one response.
- No filtering or sorting.
- No write endpoints (POST, PUT, PATCH, DELETE).
- No authentication or authorisation.
- No `Opportunity` or `Activity` data — those are separate slices.
- No changes to `DOMAIN_MODEL.md` — all fields already declared.
