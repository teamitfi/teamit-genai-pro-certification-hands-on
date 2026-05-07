# Done Criteria: Accounts & Contacts

A slice is done when ALL of the following are true:

1. `npm test` passes — `tests/accounts.spec.ts` must be green on all cases listed below:
   - `GET /accounts` returns all 5 seeded accounts with correct `id`, `name`, `industry`, `renewalDate`, `contacts`
   - `GET /accounts` embedded contacts do **not** include `email` (PII strip check)
   - `GET /accounts` for the Cetus Agri row returns `contacts: []`, not `null` (empty-collection contract)
   - `GET /accounts/:id` for a known id returns the full account including contact `email`
   - `GET /accounts/:id` for an unknown id returns 404

2. `npm run typecheck` passes — no type errors introduced

3. `npm run lint` passes — no lint errors introduced

4. No forbidden field appears in any API response — `Opportunity.value` and `invoiceAmount` are absent from all route handlers and test assertions; `email` is absent from the `GET /accounts` list response shape

5. Empty-collection endpoints return `[]`, not `null` — verified by the Cetus Agri test case (`contacts: []`)

6. `crm-reviewer` (or human reviewer) has returned `accept`, or all `revise` findings are resolved

7. `HANDOFF.md` is updated with what was completed and what the next recommended slice is
