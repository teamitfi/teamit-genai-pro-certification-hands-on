# Product Brief

## Target User

Account managers responsible for a portfolio of B2B customers. They spend most of their day in email and calls, not dashboards. They need fast answers — not another CRM to keep updated.

## Core Workflows

The product answers five questions, and nothing else:

1. **Who are our customers?** — A clean list of accounts with key facts: tier, health score, owner, contract value.
2. **Who should we contact next?** — Contacts ranked by last-touch date and open activity gaps, so no account goes dark.
3. **Which opportunities are moving?** — Pipeline view showing stage, expected close, and what changed since last week.
4. **Which renewals are at risk?** — Upcoming renewals flagged by health signals: low engagement, overdue tasks, declining usage.
5. **What changed and can we trust it?** — An audit trail of recent data changes with provenance, so account managers can decide whether to act on the information.

## Non-Goals

- **Not Salesforce.** No workflow automation, approval chains, forecasting rolls, or territory management.
- **No vague AI features.** No "AI insights" that cannot be traced to a specific data signal. Every suggestion must cite its source.
- **No production customer data.** All development and demonstration runs on synthetic data only.
- **No hidden integrations.** The system connects only to sources the user explicitly sees listed. No silent data pulls from email, calendar, or external APIs.

## Privacy Constraints

- Invoice amounts and contract values must not appear in the UI in plain text; they may only be shown as tier labels (e.g., "Enterprise", "Growth") or suppressed entirely.
- Customer contact personal data (email addresses, phone numbers) is not stored in the demo dataset and must not be inferred or reconstructed.
- Any field marked `pii` in the domain model is excluded from AI-generated summaries and search results.

## Demo-Data Assumptions

All data is synthetic and purpose-built for the lab. Specifically:

- Company names, contact names, and email domains are fictional.
- Numeric values (ARR, deal size, usage counts) are plausible but invented.
- No row in any seed file is derived from, or seeded with, a real customer record.
- Seed data is checked into the repository under `seeds/` and versioned alongside the code.

## Acceptance Evidence

A slice is done when the following evidence is produced before declaring it complete:

1. **Screenshot or screen recording** showing the relevant UI flow on synthetic data.
2. **Passing tests** — unit or integration — covering the core data path for the slice (visible in CI output or a local `npm test` / `pytest` run).
3. **No hardcoded real data** — a grep or audit confirms no real customer names, emails, or amounts appear in source or seed files.
4. **Domain model updated** — `DOMAIN_MODEL.md` reflects any new or changed fields introduced in the slice.
5. **HANDOFF.md written** — a brief handed off to the next session covering what was completed, what is still open, and what the next slice should tackle.
