---
name: crm-handoff-writer
description:
  Write HANDOFF.md at the end of a slice so the next session starts clean.
  Use after a slice is committed. Output a short HANDOFF.md covering what
  was completed, changed files, test status, open risks, decisions not to
  reopen, the next recommended slice, and which Skill outputs (TASK.md,
  DONE_CRITERIA.md) were consumed.
---

> Template Skill. Provided so you can see another working Skill and adapt it. A good handoff is the difference between a clean restart and rebuilding context from chat memory.

Inputs:

- The current slice's commits and diff
- `TASK.md` and `DONE_CRITERIA.md` from `crm-slice-planner` (if present)
- Test output from the latest `npm test` (or harness equivalent)

Workflow:

1. Read the slice's diff and commit messages.
2. Summarize the slice in one sentence — what it did, not how.
3. List changed files grouped by directory.
4. State test status: number passing, number failing, named failure if any.
5. List up to three open risks. Each risk gets one line plus a suggested mitigation.
6. List up to two "decisions not to reopen" — choices the next session should accept and not relitigate.
7. Name the next recommended slice from `BUILD_PLAN.md`.

Constraints:

- Summarize the work product, not the agent's chat history or its own behavior.
- Do not invent open risks. If there are none, write "no known open risks."
- Keep the file under 60 lines.

Output:

- `HANDOFF.md` at repo root.

Stop conditions:

- The slice's tests have not been run since the last commit → stop and run tests first.
- The diff spans multiple slices → stop and ask which slice to write the handoff for.
