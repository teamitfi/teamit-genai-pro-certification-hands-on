# Slice 1 — Accounts & Contacts

Implementation checklist. Work top-to-bottom; each item is one file-scoped change.

## Types

- [ ] **`src/types.ts`** (new) — Define and export `Contact` interface (`id`, `accountId`, `name`, `role`, `email`) and `Account` interface (`id`, `name`, `industry`, `renewalDate: string | null`, `contacts: Contact[]`), matching `DOMAIN_MODEL.md` exactly.

## Data layer

- [ ] **`src/data/accounts.ts`** (new) — Read and parse `seeds/accounts.json` synchronously at module load using `readFileSync`. Import types from `../types.js`. Export `getAccounts(): Account[]` and `getAccountById(id: string): Account | undefined`.

## Route layer

- [ ] **`src/routes/accounts.ts`** — Replace the stub `GET /accounts` handler: import `getAccounts` from `../data/accounts.js` and return its result. Add `GET /accounts/:id`: call `getAccountById(id)`, return 200 with the account or `reply.code(404).send()` if not found.

## Test layer

- [ ] **`tests/accounts.spec.ts`** — Extend the existing `GET /accounts` describe block: add an assertion that `renewalDate` is present on each account (string or `null` — both valid).
- [ ] **`tests/accounts.spec.ts`** — Add a `GET /accounts/:id` describe block: (1) valid id returns 200 with the correct account and all domain-model fields; (2) unknown id returns 404; (3) `contacts` is always an array — use the Cetus Agri Co-op seed that has `contacts: []` to cover the empty case.
