# Product Brief

This brief is the agent-readable product boundary for the training CRM. For fuller business background, see `MRD.md`.

## Target user

Primary users are account managers at Kielo Digital Oy, a fictional Finnish SME IT consultancy. They manage B2B customer relationships, consulting opportunities, follow-ups, and renewals.

Secondary users are the managing director, delivery leads, and sales operations staff who need shared customer context without turning the product into an enterprise CRM suite.

## Core workflows

The CRM helps users answer five questions:

1. Who are our customers?
2. Who should we contact next?
3. Which opportunities are moving?
4. Which renewals are at risk?
5. What changed, and can we trust it?

## Product boundary

This is a small training CRM inspired by common CRM concepts from Salesforce, HubSpot, and Microsoft Dynamics, but intentionally much simpler.

In scope:

- Customer and contact context for account managers.
- Simple opportunity pipeline visibility.
- Activity history for relationship follow-up.
- Renewal-risk awareness for existing customers.
- Synthetic Finnish B2B consultancy demo data.
- Behavioural evidence that the core workflows work.

## Non-goals

Explicitly not in scope:

- Not Salesforce, HubSpot, or Microsoft Dynamics.
- No vague AI features.
- No production customer data.
- No hidden external integrations.
- No marketing automation, mass email campaigns, or lead scoring.
- No support ticketing or helpdesk product.
- No invoicing, payments, payroll, ERP, or accounting workflows.
- No resource planning, time tracking, or HR management.

## Privacy constraints

- Use synthetic data only.
- Treat B2B contact details as personal data.
- Keep customer information business-relevant.
- Do not expose invoice amounts in the UI or user-facing responses.
- Do not introduce sensitive personal details or unrelated commercial data.

## Demo-data assumptions

All customers, contacts, activities, opportunities, and renewal scenarios are fictional. Demo data should feel plausible for a Finnish IT consultancy but must not describe real customers or real private individuals.

## Acceptance evidence

Before declaring a slice done, show evidence that an account manager can answer the relevant workflow question without violating the product boundary or privacy constraints.

Examples:

- Customer context answers "who are our customers?"
- Activity context answers "who should we contact next?"
- Pipeline context answers "which opportunities are moving?"
- Renewal context answers "which renewals are at risk?"
- Review evidence confirms no production data, invoicing scope, hidden integrations, or vague AI features were added.
