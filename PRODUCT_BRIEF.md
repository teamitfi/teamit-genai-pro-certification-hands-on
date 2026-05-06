# Product Brief

## Target user

Account managers at a B2B SaaS company. They need a single place to see their customer base, track deal progress, and
spot which renewals are at risk — without switching between spreadsheets and email.

## Core workflows

Five questions the product must answer:

1. **Who are our customers?** — `GET /accounts` returns a list of accounts with embedded contacts.
2. **Who should we contact next?** — Activity Timeline surfaces accounts whose most recent activity is oldest.
3. **Which opportunities are moving?** — Opportunity Pipeline groups deals by stage.
4. **Which renewals are at risk?** — Renewal-Risk Dashboard flags accounts with a `renewalDate` within 90 days and no
   recent activity (last activity > 30 days ago).
5. **What changed and can we trust it?** — Every slice ships with tests; the reviewer Skill signs off on each diff
   before merging.

## Non-goals

- **Not Salesforce.** No workflow automation, no email sending, no calendaring.
- **No AI-generated insights or vague "smart" features.** Read-only views only; no AI summaries surfaced in the UI.
- **No production customer data.** `seeds/accounts.json` is the only allowed data source — all data is synthetic.
- **No hidden integrations.** No outbound webhooks, no third-party CRM sync, no background jobs.
- **No invoicing.** Invoice amounts and billing data are out of scope and must never appear in the API or UI.

## Privacy constraints

- `Opportunity.value` (EUR deal size) is an internal sales-ops field. It must **never** appear in API responses or the
  UI.
- Any field literally named `invoiceAmount` is a privacy violation and must be rejected in review.
- No real customer names, emails, or company data may be committed to this repo.

## Demo-data assumptions

- All data comes from `seeds/accounts.json`.
- Seed data is fully synthetic — no real persons, no real companies.
- Seed records exercise happy-path rows (complete data), boundary rows (e.g., null `renewalDate`), and edge cases (empty
  contact lists).

## Acceptance evidence

A slice is done when:

1. All tests in `tests/` pass (`npm test`).
2. `npm run typecheck` and `npm run lint` pass with no errors.
3. The reviewer Skill (`crm-reviewer`) runs on the diff and returns **Accept**.
4. A reviewer can answer the relevant "five questions" above against the running server using only
   `seeds/accounts.json`.
