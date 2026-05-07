# Product Brief

## Target user

Account managers at client organizations who need a fast, read-only view of their customer relationships. Not technical users. Not sales-ops admins.

## Core workflows

The product answers five questions — no more, no less:

1. **Who are our customers?** — Accounts list and detail view (name, industry, renewal date, embedded contacts).
2. **Who should we contact next?** — Contact list per account (name, role, email).
3. **Which opportunities are moving?** — Pipeline view grouped by stage (Prospect → Qualified → Proposal → Closed Won / Closed Lost).
4. **Which renewals are at risk?** — Renewal-risk dashboard filtering accounts by `renewalDate` proximity.
5. **What changed and can we trust it?** — Activity timeline per account (calls, emails, meetings, notes with timestamps).

## Non-goals

These are explicitly out of scope. Do not implement them. Do not design for them.

- **Not Salesforce.** No custom objects, no workflow builder, no third-party CRM parity, no reporting engine.
- **No vague AI features.** No "AI insights", "smart suggestions", or "predictive scores" unless a concrete, bounded workflow is specified in a future brief.
- **No production customer data.** All data in this repo is synthetic. Any data imported from a real client system must be refused.
- **No hidden integrations.** Every MCP server the agent gains access to must appear in the tracked `.mcp.json` at the repo root. Nothing installed in user-global settings counts as reviewed.

## Privacy constraints

- `Opportunity.value` (EUR amount) is an internal sales-ops field. It **must never appear in any API response or UI component.**
- `invoiceAmount` does not exist in this domain. Any code that introduces a field literally called `invoiceAmount` is a privacy violation and must be rejected by the reviewer.

## Demo-data assumptions

- All seed data is synthetic. Source of truth: `seeds/accounts.json`.
- Never replace synthetic seed rows with real customer names, emails, or contract values.
- Synthetic data may be extended (new rows, new fields) only after `DOMAIN_MODEL.md` is updated in a reviewed commit.

## Acceptance evidence

A slice is done when all three of these are true:

1. The Vitest test file for the slice passes: `npm test` exits 0 with no skipped tests.
2. A reviewer sub-agent returns `accept` (not "looks good", not "minor issues") against `TASK.md` and `DONE_CRITERIA.md`.
3. No forbidden fields (`Opportunity.value`, `invoiceAmount`) appear in any API response, UI component, or seed row introduced in the slice.
