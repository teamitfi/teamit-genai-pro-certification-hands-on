# Product Brief

## Product Boundary

This repo is a small CRM for lab delivery. It gives account managers a trustworthy
place to inspect synthetic customer, contact, opportunity, activity, and renewal
risk data while practicing agent-driven delivery.

The product is intentionally narrow. It is not a general CRM platform, not a
Salesforce replacement, and not a place for real customer data.

## Target User

The primary user is an account manager who owns customer relationships and needs
quick answers before outreach, pipeline reviews, renewal checks, and handoffs.

The account manager should be able to understand the visible data without knowing
the codebase, internal accounting rules, or lab instructions.

## Core Workflows

The CRM exists to answer five questions:

1. Who are our customers?
   Show accounts and their contacts with clear names, industries, roles, and work
   email addresses.
2. Who should we contact next?
   Surface customer activity history so stale relationships and next-contact
   candidates are visible.
3. Which opportunities are moving?
   Show opportunities grouped by their declared pipeline stage, using only the
   stage values defined in `DOMAIN_MODEL.md`.
4. Which renewals are at risk?
   Flag accounts with upcoming renewal dates and old or missing recent activity.
5. What changed, and can we trust it?
   Every delivered slice must include evidence of changed behavior, passing
   checks, and any remaining risk so a reviewer can trust the update.

## Non-Goals

- Not Salesforce. Do not build a full CRM platform, custom-field system,
  forecasting suite, report builder, permissions model, or admin console.
- No vague AI features. Do not add AI scoring, AI summaries, AI recommendations,
  or "smart" workflow behavior unless a future brief defines exact inputs,
  outputs, rules, and tests.
- No production customer data. Do not use real company names, real people, real
  contact details, real contract values, or copied client exports.
- No hidden integrations. Do not connect to live CRM, billing, invoicing,
  accounting, calendar, email, marketing, analytics, or enrichment systems.
- Invoicing is out of scope. Do not add invoice screens, invoice workflows,
  invoice exports, invoice statuses, invoice amounts, or invoice fields.

## Privacy Constraints

- Demo data must be synthetic. Names, emails, account names, activity text, and
  opportunity labels must be invented for the lab.
- Invoice amounts must never appear in the UI, API responses, tests, or seed data.
  A field named `invoiceAmount` is forbidden.
- `Opportunity.value` is internal sales-ops data. It may exist in the domain
  model, but it must not appear in API responses or UI.
- Secrets and production configuration are outside the product boundary. Do not
  read, write, display, or depend on `.env`, `secrets/`, or production config
  files when building product slices.

## Demo-Data Assumptions

- `seeds/` is the only allowed data source.
- Seed rows are intentionally small, readable, and synthetic.
- Empty collections must be represented as `[]`, not `null`.
- New fields require an approved update to `DOMAIN_MODEL.md` before code,
  fixtures, API responses, or UI can use them.

## Acceptance Evidence

Before declaring a slice done, show evidence that a reviewer can inspect without
guessing:

- The user-facing behavior delivered by the slice.
- The files changed and the reason each change belongs in the slice.
- Passing automated checks relevant to the change, normally `npm test`,
  `npm run lint`, and `npm run typecheck`.
- Focused test coverage for the slice, including empty-state or privacy checks
  when the slice touches collections, API responses, or UI.
- Confirmation that no forbidden fields, invoice data, production data, or hidden
  integrations were introduced.
- Any known limitation or residual risk that should appear in the handoff.

## Agent-Readability Check

A fresh agent must be able to read only this file and answer correctly:

- This is for account managers.
- The core workflows are the five questions listed above: customers, next
  contact, moving opportunities, renewal risk, and trusted changes.
- Invoicing is not in scope; invoice amounts and `invoiceAmount` are forbidden.
