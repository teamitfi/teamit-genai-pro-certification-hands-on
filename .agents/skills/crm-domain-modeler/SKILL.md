---
name: crm-domain-modeler
description:
  Maintain DOMAIN_MODEL.md as the single source of truth for CRM entities,
  fields, enums, and forbidden-in-UI fields. Use when adding a new entity,
  changing a field type, introducing an enum value, or auditing whether
  code uses fields the model has not declared. Output a DOMAIN_MODEL.md
  diff plus a short rationale and a list of follow-up edits.
---

> Template Skill. Lab S1.3 builds `crm-slice-planner` from scratch; this file is provided so you can see another working Skill and adapt it to a client's domain after the certification.

Inputs:

- `DOMAIN_MODEL.md`
- `PRODUCT_BRIEF.md` (for the privacy boundary)
- the proposed entity, field, or enum change

Workflow:

1. Read `DOMAIN_MODEL.md` and locate the affected entity, or note that the entity is new.
2. State the change in one sentence — what entity, what field, what type, what default.
3. Check `PRODUCT_BRIEF.md` for any privacy constraint that marks this field as forbidden-in-UI.
4. Propose the diff to `DOMAIN_MODEL.md` as a single section edit — not a rewrite.
5. List existing files that will need follow-up edits to stay aligned (routes, fixtures, tests).

Constraints:

- Never invent fields outside an explicit user request.
- Never silently drop fields; removals require an explicit "remove" instruction.
- Forbidden-in-UI fields must be marked in the model and never referenced from UI code paths.

Output:

- A `DOMAIN_MODEL.md` patch (diff or replacement section).
- A two-line rationale: why this change, and what is intentionally not changing.
- A bullet list of follow-up files to edit.

Stop conditions:

- The change would touch more than one entity → stop and ask the user to split it.
- The change conflicts with the product boundary in `PRODUCT_BRIEF.md` → stop and surface the conflict.
- The user has not named the field type or default → stop and ask.
