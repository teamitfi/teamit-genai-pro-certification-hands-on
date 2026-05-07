# Product Brief

## Target User

Account managers who manage a portfolio of B2B customers. They need a fast, read-focused view of their accounts, contacts, and deals — not a full CRM replacement.

## Core Workflows

The product answers five questions:

1. **Who are our customers?** — Browse and search accounts; view account details and associated contacts.
2. **Who should we contact next?** — View contacts per account; see last-contact date and next-action notes.
3. **Which opportunities are moving?** — View open opportunities per account with stage and expected close date.
4. **Which renewals are at risk?** — Surface accounts whose renewal date is within 90 days and flag those with low engagement scores.
5. **What changed and can we trust it?** — Activity timeline per account showing logged calls, emails, and notes in reverse-chronological order.

## Non-Goals

- **Not Salesforce.** No workflow automation, no email send, no campaign management.
- **No vague AI features.** No "AI insights", no generative summaries surfaced in the UI unless a specific slice is planned and scoped.
- **No production customer data.** The system is built and tested with synthetic seed data only.
- **No hidden integrations.** No background syncs to external CRMs, ERPs, or data warehouses unless explicitly planned in BUILD_PLAN.md.
- **No write operations from agents.** Agents may read repo files and seed data; they must not write to production configs or secrets.

## Privacy Constraints

- **Invoice amounts must not appear in the UI.** The `invoiceAmount` field is forbidden in all UI layers and API responses (see `DOMAIN_MODEL.md` § Forbidden in API).
- Contact personal details (email, phone) are visible only on the contact detail page, not in list views or exports.
- No personally identifiable data may be logged to the console or committed to the repo.

## Demo-Data Assumptions

- All data is synthetic. Seed files live in `seeds/` and are safe to share and commit.
- No real customer names, real account numbers, or real financial figures appear anywhere in the repo.
- Seed data includes at least one happy-path account, one boundary-value row (e.g., renewal in 0 days), and one edge-case row (e.g., account with no contacts).

## Acceptance Evidence

A slice is done when:

1. The relevant test in `tests/` passes (`npm test` green).
2. The agent-readability check passes: a fresh session can answer the five core-workflow questions using only this file and the relevant route/component — no guessing.
3. No forbidden field (`invoiceAmount`) appears in any API response or UI component introduced by the slice.
4. A reviewer (human or `crm-reviewer` Skill) has returned `accept` or the slice has been revised to address all `revise` findings.
5. `HANDOFF.md` is updated with what was completed and what is next.
