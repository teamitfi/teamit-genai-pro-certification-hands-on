# Product Brief

A small **CRM for account managers**: list and drill into customers, pipeline, activity, and renewal risk. This product is the training vehicle for a reusable agent Skill library; scope stays disciplined so agents and reviewers share one boundary.

## Target user

**Account managers** (AMs): people who own a portfolio of customer relationships, track renewals, and prioritize outreach. They need fast answers from structured data—not a full admin or configure-everything platform.

## Core workflows

The product must support answering these questions, in order of build priority where noted in `BUILD_PLAN.md`:

1. **Who are our customers?** — See accounts and contacts (list + detail); understand who belongs to which company.
2. **Who should we contact next?** — See recent activity per account and surface accounts that need follow-up (stale touchpoints).
3. **Which opportunities are moving?** — See opportunities by stage; understand momentum in the pipeline.
4. **Which renewals are at risk?** — See renewals approaching with weak recent engagement (read-only risk view).
5. **What changed and can we trust it?** — Changes are reviewed against this brief, `DOMAIN_MODEL.md`, and automated tests; no silent scope creep.

## Non-goals

- **Not a Salesforce replacement** — No parity with enterprise CRM configuration, automation builders, or AppExchange-style extensibility.
- **No vague or “magic” AI in v1** — No LLM features, summarization, or autonomous outreach; deterministic behavior and explicit data only unless a future lab explicitly adds AI with constraints.
- **No production customer data in this repository** — Only synthetic fixtures under `seeds/`; never paste real credentials, invoices, or account numbers into code or prompts.
- **No hidden integrations** — No background sync to external CRMs, billing systems, or data warehouses unless explicitly scoped in a future change with reviewed config.
- **Invoicing and billing are out of scope** — Invoicing, invoices, and **invoice amounts are not part of this product**; do not model, display, or expose them in API or UI.

## Privacy and data-handling constraints

- **Invoice-related amounts must never appear in the UI or public API** — There is no invoicing feature; amounts billed or similar must not be introduced. (The domain explicitly flags any literal `invoiceAmount` field as a violation.)
- **Internal commercial fields stay internal** — `Opportunity.value` (deal size) exists for internal modeling only and **must not appear in API responses or UI**; see `DOMAIN_MODEL.md` § Forbidden in API.

## Demo-data assumptions

- All runtime and test data is **synthetic** and loaded from **`seeds/`** (e.g. `seeds/accounts.json`).
- Data is safe to share in labs; it must not be replaced with real client exports.

## Acceptance evidence (slice done)

Before declaring a vertical slice complete:

1. **Automated tests** for that slice pass (`npm test`), including any new tests added for the slice contract.
2. **Domain compliance** — Implementation matches `DOMAIN_MODEL.md`; no forbidden fields in API or UI; no invented fields without updating the domain model first.
3. **Review** — A reviewer checks the diff against this brief, `DOMAIN_MODEL.md`, and the slice’s `TASK.md` / `DONE_CRITERIA.md` (when produced by the planner Skill); the decision is explicitly **accept**, **revise**, or **reject** with concrete findings—not “looks fine.”
