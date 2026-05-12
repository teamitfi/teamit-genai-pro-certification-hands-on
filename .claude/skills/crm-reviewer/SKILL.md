---
name: crm-reviewer
description: |
  Review a CRM slice diff against TASK.md, DONE_CRITERIA.md, PRODUCT_BRIEF.md,
  and DOMAIN_MODEL.md. Use when the user says "review the current slice",
  "run the reviewer on", "run crm-reviewer on", "review this diff",
  "review the changes", or "review the diff on [branch]".
  Produces four required sections: Findings, Missing evidence, Privacy risks,
  and Decision (accept / revise / reject — no other values allowed).
---

Inputs:

- `TASK.md` — what was supposed to be built in this slice
- `DONE_CRITERIA.md` — explicit acceptance conditions for the slice
- `PRODUCT_BRIEF.md` — product boundary, non-goals, privacy constraints
- `DOMAIN_MODEL.md` — entity definitions; fields forbidden in UI/API responses
- `npm test` output — most recent test run (run `npm test` if not available)
- The diff being reviewed — `git diff main...HEAD` or specified files/branch

Workflow:

1. Read `TASK.md` and `DONE_CRITERIA.md`. List every stated task and acceptance criterion before proceeding.
2. Read `PRODUCT_BRIEF.md` and `DOMAIN_MODEL.md`. Record every field marked forbidden in UI/API paths (`Opportunity.value`, `invoiceAmount`) and every privacy constraint stated in the brief.
3. Scan the diff line by line. For each deviation from `TASK.md`, `DONE_CRITERIA.md`, or the conventions in `CLAUDE.md` (empty collections return `[]`, routes as Fastify plugins, tests via `server.inject()`), record a finding with the exact file name and line number.
4. Compare the acceptance criteria from `DONE_CRITERIA.md` against the diff. Any criterion with no corresponding code or test in the diff is missing evidence — list it.
5. Scan every file in the diff for forbidden field names (`Opportunity.value`, `invoiceAmount`). Report any occurrence that appears in a route handler, serializer, seed, or fixture as a privacy risk.
6. Render the decision:
   - `accept` — every DONE_CRITERIA criterion is evidenced, no privacy risk, no blocking finding
   - `revise` — minor gaps (missing test, wrong type, naming deviation); list exactly what must change before re-review
   - `reject` — forbidden field exposed in an API or UI path, one or more core DONE_CRITERIA unmet, or `npm test` exits non-zero

Output:

```
## Findings
- <filename:line — description of issue>
(write "none" if the diff is clean)

## Missing evidence
- <DONE_CRITERIA.md item — reason it is not demonstrated in the diff>
(write "none" if every criterion is evidenced)

## Privacy risks
- <filename:line — forbidden field or constraint violated>
(write "none" if no forbidden fields appear)

## Decision
accept | revise | reject
<one sentence rationale referencing the blocking finding or confirming all criteria met>
```

Constraints:

- Allowed decision values are exactly `accept`, `revise`, and `reject`. Never write "needs work", "looks good", "LGTM", or any other phrase.
- Every entry in Findings and Privacy risks must include a `filename:line` reference. No vague commentary.
- Missing evidence must explicitly name the DONE_CRITERIA.md criterion that is absent.
- Do not suggest fixes or rewrite code — only report findings. Fixes are the implementer's responsibility.
- Run `npm test` if no test output is provided; if tests cannot be run, record this as a missing evidence item (do not skip the section).

Stop conditions:

- `TASK.md` or `DONE_CRITERIA.md` not found → stop and ask the user to run `crm-slice-planner` first.
- No diff provided and no recent git changes on the current branch → stop and ask which branch or files to review.
- Test output unavailable and tests cannot be run → proceed with all other sections, but add a missing evidence item: "npm test output — not available; pass/fail status unknown".
