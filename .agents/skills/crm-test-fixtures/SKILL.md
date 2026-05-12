---
name: crm-test-fixtures
description:
  Generate or extend synthetic seed data and test fixtures for the CRM
  (accounts, contacts, opportunities, activities, renewals). Use when a
  slice needs new fixture rows, an empty-state row, a boundary-value row,
  or a fresh fixture file. Output JSON written under seeds/ plus a
  fixtures-README block describing what each row exists to test.
---

> Template Skill. Provided so you can see another working Skill and adapt it. Synthetic data only — never paste real customer data into seeds.

Inputs:

- `DOMAIN_MODEL.md` (field shapes and enums)
- `seeds/` directory (existing fixtures)
- the target test or slice this fixture supports

Workflow:

1. Read `DOMAIN_MODEL.md` for the entity's field types, enums, and forbidden-in-UI markers.
2. Identify the test or empty-state the new fixture should exercise.
3. Generate rows that cover at minimum: a happy-path row, one boundary row, and one empty/null edge case where applicable.
4. Write to `seeds/<entity>.json`. Extend the existing file rather than replacing it unless explicitly asked.
5. Add or extend `seeds/README.md` with a one-line note per new row explaining what it tests.

Constraints:

- Synthetic data only. Use obvious placeholders (`Acme Corp`, `test+contact-1@example.com`). No real names, real emails, real account numbers, real invoice amounts.
- Never include forbidden-in-UI fields in fixtures that UI tests consume. Backend-only fixtures may include them if `DOMAIN_MODEL.md` declares them.
- Stay within the entity's declared shape; do not add ad-hoc fields.

Output:

- Updated `seeds/<entity>.json`.
- Updated `seeds/README.md` block describing the new rows.

Stop conditions:

- The fixture would require a field not in `DOMAIN_MODEL.md` → stop and route the change to `crm-domain-modeler` first.
- The test request is ambiguous about which edge case to exercise → stop and ask.
