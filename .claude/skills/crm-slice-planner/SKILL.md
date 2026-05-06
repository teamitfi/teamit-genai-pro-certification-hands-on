---
name: crm-slice-planner
description:
  Plan one CRM vertical slice from PRODUCT_BRIEF.md and BUILD_PLAN.md.
  Use when starting accounts, contacts, pipeline, activity, or renewal-risk work.
  Output TASK.md and DONE_CRITERIA.md with tests and non-goals.
---

Inputs:

- PRODUCT_BRIEF.md
- BUILD_PLAN.md
- current user request

Workflow:

1. Read the product boundary from PRODUCT_BRIEF.md and BUILD_PLAN.md.
2. Identify the smallest valuable slice that answers exactly one of the five product questions.
3. List the files likely to change (routes, tests, seeds). Only propose a DOMAIN_MODEL.md change if the user explicitly
   requests it, or if the slice is impossible or overly complex without it — in either case, stop and ask for user
   approval before proceeding.
4. Define the acceptance tests and review evidence required.
5. State explicit non-goals — what this slice deliberately excludes.

Constraints:

- Stay within the product boundary defined in PRODUCT_BRIEF.md.
- Never invent fields outside DOMAIN_MODEL.md.
- One slice at a time — stop if the request spans more than one slice.

Output:

- TASK.md — what to build, files to change, step-by-step plan
- DONE_CRITERIA.md — passing tests, typecheck/lint green, reviewer Skill accepts

Stop conditions:

- Slice spans more than the named files → stop and ask.
- Brief doesn't cover the user's request → stop and ask.
