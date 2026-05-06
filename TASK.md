# TASK — Slice 1: Accounts & Contacts

**Goal.** Implement `GET /accounts` and `GET /accounts/:id` so account managers can list all accounts (with embedded contacts) and view a single account by ID.

## Implementation steps

1. In `src/routes/accounts.ts`, load `seeds/accounts.json` at module level using `readFileSync` + `JSON.parse`.
2. Replace the `GET /accounts` handler stub with one that returns the full accounts array.
3. Add a `GET /accounts/:id` handler that looks up by `id` and returns 404 with `{ error: "Not found" }` if missing.
4. Keep contacts embedded in every account response — do not strip them.
5. Run `npm test` — the existing failing test must now pass, no other tests must break.

## Files to change

| File | Change |
|---|---|
| `src/routes/accounts.ts` | Load seeds; implement GET /accounts and GET /accounts/:id |

## Files to leave unchanged

- `seeds/accounts.json` — seed data is already sufficient; do not modify
- `tests/accounts.spec.ts` — do not modify existing tests; add new ones in a separate commit if needed
- `DOMAIN_MODEL.md` — all required fields already declared
