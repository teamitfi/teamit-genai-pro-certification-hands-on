# Slice 1 — Accounts & Contacts

## Goal

Implement `GET /accounts` so it returns all accounts with embedded contacts from `seeds/accounts.json`.

## Files changed

- `src/routes/accounts.ts` — replaced the `return []` stub with real seed data loaded at startup

## Steps taken

1. Read `seeds/accounts.json` at module load using `readFileSync`.
2. Return the parsed array directly from the `GET /accounts` handler.
3. Confirmed path resolution: `src/routes/` is two levels from project root, so `../../seeds/accounts.json`.

## Non-goals

- No `GET /accounts/:id`
- No filtering, sorting, or pagination
- No Opportunity, Activity, or renewal-risk data
- No writes (POST/PUT/DELETE)
