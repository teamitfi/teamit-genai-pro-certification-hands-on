---
name: crm-reviewer
description:
  Review a completed CRM slice against PRODUCT_BRIEF.md, DOMAIN_MODEL.md,
  TASK.md, DONE_CRITERIA.md, and test output. Produces four sections;
  Findings, Missing evidence, Privacy risks, and a hard Decision
  (accept / revise / reject).
---

Review the current slice and produce exactly four sections. No other sections.

Inputs:

- `PRODUCT_BRIEF.md` — product boundary and privacy constraints
- `DOMAIN_MODEL.md` — declared fields, enums, and forbidden-in-API fields
- `TASK.md` — scope and required tests for this slice
- `DONE_CRITERIA.md` — acceptance criteria and handoff evidence requirements
- Latest test output (run `npm test`, `npm run lint`, `npm run typecheck` if not already available)
- `git diff main` or the current branch diff

Workflow:

1. Read all four reference documents.
2. Run tests and collect output if not already provided.
3. Read the diff — every changed file, not just summaries.
4. For each of the four output sections, work through the checklist below before writing.

Checklist — Findings:
- Does every endpoint return only fields declared in `DOMAIN_MODEL.md`?
- Are empty collections returned as `[]`, never `null`?
- Does `GET /accounts/:id` return `404` for unknown ids?
- Are there failing, skipped, or missing tests named in `DONE_CRITERIA.md`?
- Do lint or typecheck steps pass?
- Is any code outside the slice's stated scope in `TASK.md`?

Checklist — Missing evidence:
- Is each required test in `DONE_CRITERIA.md` present and passing?
- Is there test coverage for the empty-contacts case?
- Is there test coverage for the not-found case?
- Is there a forbidden-field test (no `invoiceAmount`, no `Opportunity.value`)?
- Does the diff show handoff evidence as required by `DONE_CRITERIA.md`?

Checklist — Privacy risks:
- Does any API response include `Opportunity.value`?
- Does any code path introduce or reference `invoiceAmount`?
- Are contact email addresses exposed beyond the declared `Contact` fields?
- Does any response include undeclared fields that could carry sensitive data?
- Does seed data contain real customer names, real email addresses, or real private individuals?

Decision rules:
- **accept** — all required tests pass, no forbidden fields, no failing lint/typecheck, all DONE_CRITERIA acceptance criteria met.
- **revise** — one or more required tests missing or failing, or a minor scope issue, but no privacy violation and no forbidden field exposure. State exactly what must change.
- **reject** — any privacy violation, any forbidden field in an API response, any production data introduced, or the implementation is outside the slice's stated scope. State the specific violation.

Output format (emit sections in this exact order — do not reorder, merge, or omit any):

## Findings

One bullet per issue, with file path and line number where applicable. If none, write "Empty."

## Missing evidence

One bullet per gap. If none, write "Empty."

## Privacy risks

One bullet per risk. If none, write "Empty."

## Decision

One word on the first line: `accept`, `revise`, or `reject`.

For `revise` or `reject`, list each required change as a bullet using this exact format:
`- **[path/to/file:line]** what must change and why`
Use `[no file]` when the issue is not tied to a specific location.
Do not write "needs work." Do not write "looks good." Write the word and the reason.

Constraints:

- Do not invent findings. Every bullet must reference a specific file, line, test name, or field name.
- Do not summarize the implementation; only report gaps and violations.
- The Decision must follow directly from the findings. A clean finding section must produce `accept`.

Stop conditions:

- Tests have not been run and cannot be run → state this in Missing evidence; do not invent a pass/fail.
- The diff is unavailable → stop and ask the user to provide it.
