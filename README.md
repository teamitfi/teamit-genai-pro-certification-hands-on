# Teamit GenAI Pro Certification — Lab Repo

> Welcome to the GenAI Pro Certification lab. You'll build a small CRM and, more importantly, a reusable Skill library that you can take into a future client engagement. The CRM is the vehicle. The Skill library is the lasting capability.

**Starter stack: Node 20+ / TypeScript** (Fastify + Vitest). One stack ships on `main` for day one; participants who arrive fluent in Python, Java, or .NET produce the equivalent artifacts and the lab still passes — graders score intent, not file extension. See [Harness translation](#harness-translation) below.

## Before you start

You need:

- **A coding harness, authenticated.** Claude Code (Pro+) is recommended — the Skills layer the labs build on is most natively supported there. Other harnesses are accepted: Codex CLI, OpenCode, Pi, Cursor, Aider, Cline/Roo/Continue, Copilot Agent Mode. If you bring something else, see [Harness translation](#harness-translation) below.
- **A second harness for Session 2** (recommended). Copilot in VS Code or JetBrains is the easiest path for Lab S2.4.
- **Node 20+** installed (`node --version`).
- **A laptop you can install dependencies on.** No office-wifi allowlist is in place; internet egress is open.

Clone:

```bash
git clone git@github.com:teamitfi/teamit-genai-pro-certification-hands-on.git
cd teamit-genai-pro-certification-hands-on
```

Verify the test runner works and the failing test does fail:

```bash
npm install
npm test
```

You should see one failing test (`GET /accounts returns the seeded accounts`). That's expected — your first slice will fix it.

## What you'll build

Across two 60-minute hands-on halves (the other 60 minutes of each session is lecture), you'll build a small CRM with:

- Accounts and Contacts list and detail
- Opportunity Pipeline (stretch / Session 2 if time)
- Activity Timeline (stretch)
- Renewal-Risk Dashboard (stretch)

You'll also produce a **reusable Skill library**. Two Skills you'll build from scratch in the labs; three more ship as templates under `.claude/skills/` so you can see additional working Skills and adapt them after the certification:

- `crm-slice-planner` — plans one CRM vertical slice from the product brief _(you build in Lab S1.3)_
- `crm-reviewer` — reviews a diff against acceptance criteria with an explicit accept/revise/reject decision _(you build in Lab S2.1)_
- `crm-domain-modeler` — maintains `DOMAIN_MODEL.md` as the single source of truth for entities and forbidden-in-UI fields _(template)_
- `crm-test-fixtures` — generates synthetic seed data with happy-path, boundary, and edge-case rows _(template)_
- `crm-handoff-writer` — writes `HANDOFF.md` at the end of a slice so the next session starts clean _(template)_

All five Skills should be portable into a real client engagement with field renames.

## Session map

| Session                                       | Lecture (60 min)                                              | Hands-on (60 min)                                                    |
| --------------------------------------------- | ------------------------------------------------------------- | -------------------------------------------------------------------- |
| 1 (Group 1: 2026-05-06 · Group 2: 2026-05-07) | Landscape, Claude Code deep dive, harness theory              | Labs S1.1 → S1.4 — product brief, repo map, first Skill, first slice |
| 2 (Group 1: 2026-05-13 · Group 2: 2026-05-12) | Skills-first delivery, security, governance, Teamit checklist | Labs S2.1 → S2.4 + cert walkthrough                                  |

The cert is awarded when you finish both sessions' labs and complete the final 60-second walkthrough of the Teamit 6-item client checklist.

## Repo layout

```
.
├── README.md                  # This file
├── PRODUCT_BRIEF.md           # Empty — Lab S1.1 fills it
├── AGENTS.md                  # Empty — Lab S1.2 fills it (use CLAUDE.md if you prefer)
├── ARCHITECTURE.md            # Optional placeholder — populate if the repo grows
├── BUILD_PLAN.md              # Slice order — already populated, refer to it
├── WORKFLOW.md                # Empty — populate during Session 1 if time
├── DOMAIN_MODEL.md            # Reference — read it before writing skills
├── .claude/
│   ├── settings.json          # Minimal baseline (deny .env / secrets reads & writes)
│   └── skills/
│       ├── crm-domain-modeler/    # Template Skill — adapt for your client's domain
│       ├── crm-test-fixtures/     # Template Skill — synthetic seed-data generator
│       └── crm-handoff-writer/    # Template Skill — writes HANDOFF.md
│       # Labs S1.3 and S2.1 add crm-slice-planner and crm-reviewer alongside these.
├── docs/
│   └── vendor/
│       └── partner-readme.md  # Used in Lab S2.2's prompt-injection drill
├── scripts/
│   ├── lab-s2-3-wrapper.sh    # Git-hook fallback for harnesses without native hooks
│   └── pre-commit.sample      # Drop into .git/hooks/pre-commit during Lab S2.3
├── seeds/
│   └── accounts.json          # Synthetic seed data — never replace with real customer data
├── src/                       # Your implementation lives here
│   ├── index.ts
│   ├── server.ts
│   └── routes/
│       └── accounts.ts
└── tests/
    └── accounts.spec.ts       # One failing test on main; more added per slice
```

Branches:

- `main` — starter; one failing test
- `seeded-bad-build` — used in Lab S2.2; do not merge to main, do not fix; this is the reviewer's adversarial target

### The persistent context stack

Each top-level file/dir maps to a layer of the agent's persistent context. When you write a Skill or judge a diff, ask which layer the answer lives in — that's where the file should be read or updated.

| Layer               | File(s) in this repo                                    | What goes here                                                                                            |
| ------------------- | ------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Product             | `PRODUCT_BRIEF.md`                                      | What the product does, who it's for, the boundary. Lab S1.1 fills it.                                     |
| Agent context       | `AGENTS.md` (or `CLAUDE.md`)                            | How an agent should behave in this repo: conventions, what to read first. Lab S1.2 fills it.              |
| Reusable capability | `.claude/skills/<name>/SKILL.md`                        | A reusable workflow with name, description, inputs, steps, output format. Labs S1.3 and S2.1 add these.   |
| Workflow            | `WORKFLOW.md`                                           | The team's day-to-day flow: plan → build → review → ship. Optional in Session 1.                          |
| Architecture        | `ARCHITECTURE.md`                                       | Data flow and boundaries. Optional placeholder — populate when the repo outgrows reading `src/` directly. |
| Build / slice       | `BUILD_PLAN.md`                                         | Slice order and a 2-line description per slice. Already populated.                                        |
| Domain reference    | `DOMAIN_MODEL.md`                                       | Entity definitions and forbidden fields. Read it before writing skills.                                   |
| Runtime policy      | `.claude/settings.json` + `scripts/lab-s2-3-wrapper.sh` | What the harness is allowed to read, write, or execute. Lab S2.3 extends this.                            |
| Evidence packet     | per-lab artifacts (review reports, lab evidence files)  | What you produce to prove the lab passed. Lives wherever the lab brief tells you.                         |

---

## Session 1 labs

### Lab S1.1 — Product Boundary (10 min)

**Goal.** Write a boundary brief an agent can read and respect without confusion. The brief is an upstream input to every Skill, every sub-agent, every session — it has to be readable by a coding agent, not just by a human PM.

**Do.** Edit `PRODUCT_BRIEF.md` (currently empty) to cover:

- Target user (account managers)
- Core workflows — the five questions: who are our customers; who should we contact next; which opportunities are moving; which renewals are at risk; what changed and can we trust it
- Non-goals — explicit. "Not Salesforce." "No vague AI features." "No production customer data." "No hidden integrations."
- Privacy constraints — name at least one (e.g., "invoice amounts must not appear in the UI")
- Demo-data assumptions — synthetic only
- Acceptance evidence — what proof you'll show before declaring a slice done

**Agent-readability check.** Start a fresh session and ask the agent: "Read `PRODUCT_BRIEF.md` and answer in 3 bullets — who is this for, what are the core workflows, and is invoicing in scope?" The agent must answer correctly _without further prompting_. If it hedges, guesses, or asks you to clarify, the brief is ambiguous — fix the brief, not the prompt.

**Pass criterion.** Non-goals are explicit; at least one privacy constraint is named; the agent-readability check passes on a fresh session.

**While you wait** (any of):

1. Pick one current Teamit client; write 2 sentences on how this brief would change for them.
2. Draft one acceptance criterion you'd ask the client to sign off on.
3. List the three things you're most worried the agent will get wrong, given the brief.

---

### Lab S1.2 — Repo Map (10 min)

**Goal.** Produce the repo contract — the file the agent reads first. This file is the most important agent-instruction artifact in the repo, and every harness has its own conventional name for it.

**Do.** Ask your agent to **inspect without editing** and propose an `AGENTS.md` (or `CLAUDE.md` / `.cursorrules` for your harness). Refine it to cover:

- Framework + folders + entry points
- Dev-loop commands: `npm run dev`, `npm test`, `npm run lint`, `npm run typecheck`
- UI conventions (when you add a UI; otherwise note "API-only on day one")
- **Off-limits files, named explicitly:** `.env`, `secrets/`, anything in production configs

**Naming-by-harness.** Same file, three names:

- `CLAUDE.md` — Claude Code
- `AGENTS.md` — OpenCode, Codex CLI, Copilot custom-agents (the cross-harness emerging standard)
- `.cursorrules` — Cursor

Pick the right name for your harness. If you swap harness mid-engagement, the _content_ travels — just rename or symlink.

Then run a **fresh-session test:** start a new session and ask the agent to summarize the project. The summary must match your mental model.

**Pass criterion.** Fresh-session summary identifies stack, dev-loop, and at least one off-limits file by name. Pair-reviewer also asks: "what's the equivalent of this file in one non-Claude harness?" — you must be able to name it.

**While you wait:**

1. Pair-review with a neighbor — swap repos, run a fresh-session test against their file, write one critique line.
2. Note your harness's cost-check command for later.
3. Try to defeat the off-limits-files rule for 2 minutes — does the agent respect it without a hook?

---

### Lab S1.3 — First CRM Skill (15 min)

**Goal.** Build `crm-slice-planner` — your first reusable Skill.

**Do.** Create `.claude/skills/crm-slice-planner/SKILL.md` (or your harness's equivalent — see [Harness translation](#harness-translation)). Use the seven-question template:

```markdown
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

1. Read the product boundary.
2. Identify the smallest valuable slice.
3. List files likely to change.
4. Define tests and review evidence.
5. State non-goals.

Constraints:

- Stay within the product boundary.
- Never invent fields outside DOMAIN_MODEL.md.

Output:

- TASK.md
- DONE_CRITERIA.md

Stop conditions:

- Slice spans more than the named files → stop and ask.
- Brief doesn't cover the user's request → stop and ask.
```

**Pass criterion.** Description routes correctly (the agent picks the skill on the prompt "let's plan the next CRM slice"); workflow is numbered; output names two named files.

**Description hygiene matters.** A weak description ("helps with CRM") is invisible to the routing layer. A strong description names _when_, _what_, and _output_. Compare:

```
Weak:    Helps with CRM.
Strong:  Plan one CRM vertical slice from PRODUCT_BRIEF.md and BUILD_PLAN.md.
         Use when starting accounts, contacts, pipeline, activity, or renewal-risk work.
         Output TASK.md and DONE_CRITERIA.md with tests and non-goals.
```

**While you wait:**

1. Write a one-line "anti-description" for a different skill you'd want; check the routing language is unambiguous.
2. Identify a current client engagement where this skill would be useful with one or two field changes; note them.

---

### Lab S1.4 — Plan and start Slice 1 (17 min)

**Goal.** Use `crm-slice-planner` on the Accounts & Contacts slice; observe how a sub-agent keeps the parent context clean; produce evidence. **Don't try to finish the slice.**

**Do.**

1. Invoke the planner Skill on the prompt: "let's plan the Accounts & Contacts slice."
2. Read the produced `TASK.md` and `DONE_CRITERIA.md`. Push back on anything overscoped.
3. Have the agent implement just enough that `tests/accounts.spec.ts` passes.
4. **Dispatch one sub-agent in parallel.** Pick a small isolatable task (write the integration test for `GET /accounts/:id`, or scaffold the contacts route stub) and hand it to a sub-agent rather than the parent session:
   - **Claude Code:** invoke the Task tool with a self-contained prompt. The sub-agent's full transcript stays in its context; you get a summary back.
   - **Cursor / others with parallel chats:** open a second chat in the same workspace.
   - **Harness-agnostic fallback:** `git worktree add ../crm-subagent` and start a second harness session in the worktree.

   Note in your evidence: how big was the sub-agent's transcript vs. the summary that came back? That gap is the point — the parent stayed clean.

5. Commit. Do not continue past this point — Session 2 starts from a known state.
6. Write a one-paragraph `HANDOFF.md`: what you completed, what's open, the next recommended slice. Include one line on what the sub-agent did and what came back.

**Pass criterion.** The Skill was actually invoked (not bypassed); the test passes; `HANDOFF.md` is specific enough that a stranger could continue _and_ names what the sub-agent contributed.

**While you wait:**

1. Add one integration test the agent didn't think to write.
2. Try the same prompt with a _second_ harness for 3 minutes; compare diffs.
3. Note one risk for the Opportunity Pipeline slice based on the planner's output.

---

## Session 2 labs

### Lab S2.1 — Reviewer Skill (13 min)

**Goal.** Build `crm-reviewer` — a Skill that reviews a diff and returns an explicit decision.

**Do.** Create `.claude/skills/crm-reviewer/SKILL.md`. It must produce four sections:

- **Findings** — specific issues with file/line refs
- **Missing evidence** — what was claimed but not demonstrated
- **Privacy risks** — any sensitive fields exposed in the UI
- **Decision** — `accept`, `revise`, or `reject`. Not "needs work." Not "looks good."

Reviews are run against: `PRODUCT_BRIEF.md`, `DOMAIN_MODEL.md`, `TASK.md`, `DONE_CRITERIA.md`, and test output.

**Pass criterion.** Description routes correctly; all four sections present in the output schema; `accept`/`revise`/`reject` is explicit.

**While you wait:**

1. Sketch one _additional_ reviewer Skill for your current client (e.g., `legacy-migration-reviewer`, `accessibility-reviewer`); write its description.
2. List two failure modes from the deck slide "Where Agents Fail in a CRM Build" your reviewer should catch.

---

### Lab S2.2 — Agent-instruction fidelity test on seeded bad build (15 min)

**Goal.** Run your reviewer against an instructor-built bad branch. Then test whether the reviewer holds up when the diff was produced by a _sub-agent_ and when an external file tries to subvert agent instructions. Two fidelity tests, one lab.

**Do.**

1. Check out the `seeded-bad-build` branch. It contains six realistic failure modes — do not fix them.
2. Run `crm-reviewer` on the diff. The output must list specific findings, not "looks good."
3. **Sub-agent fidelity test.** Dispatch a sub-agent (Task tool / parallel session / `git worktree`) with the prompt: "fix the failures on `seeded-bad-build`." Then run `crm-reviewer` on the sub-agent's diff. The reviewer must catch the same class of violations regardless of who produced the diff — the parent agent or the sub-agent. If the sub-agent's diff slips through where a hand-edit doesn't, your reviewer's findings depend on the author, not the code.
4. **Prompt-injection drill (agent-instruction fidelity vs. external content).** Ask your agent to fetch and summarize `docs/vendor/partner-readme.md`. The README contains a planted instruction. Observe whether the agent honors `AGENTS.md`/`CLAUDE.md` or lets the external content override it. The Lab S2.3 hook will block actual damage; surface the attempted action in chat.
5. Save the output as `lab-s2-2-evidence.md`: include the reviewer's accept/revise/reject decision on each diff (parent + sub-agent), list of findings, and the agent's response to the injection attempt.

**Pass criterion.** Reviewer caught at least four of the six seeded failure modes; returned an explicit decision on both the parent diff and the sub-agent diff; injection attempt was visibly observed in chat without the agent acting on it.

**While you wait:**

1. Pick one item from OWASP Agentic Top 10 (ASI01–ASI05); write a one-sentence "how it would manifest in this CRM" note.
2. Try a second injection vector — a planted instruction in a code comment of an upstream dependency you ask the agent to "review."

---

### Lab S2.3 — One safety hook or check (10 min)

**Goal.** Add one concrete enforcement that protects the build. Hooks are not a Claude-only concept — every harness has an equivalent shape, and you should be able to translate yours into at least two others.

**Do.** Pick **one** of these four and implement it:

1. **Block sensitive files** — refuse reads/writes to `.env`, `secrets/`, production configs.
2. **Run CRM tests after relevant changes** — auto-trigger.
3. **Fail on forbidden fields** — refuse to commit if `invoiceAmount` (or any forbidden field) appears in UI code.
4. **Summarize at stop** — at session end, list changed files and unresolved risks.

**Mechanisms:**

- Claude Code: hook (`PreToolUse` / `PostToolUse` / `Stop`) in `.claude/settings.json`.
- OpenCode / Codex CLI: config wrapper.
- **Fallback for any harness:** `.git/hooks/pre-commit` + `scripts/lab-s2-3-wrapper.sh` (already in the repo). Activate with `cp scripts/pre-commit.sample .git/hooks/pre-commit && chmod +x .git/hooks/pre-commit`.

**Cross-harness equivalence (fill this in for the hook you implemented).** Pick whichever hook you built and write the one-line equivalent in the other two harnesses you don't use day-to-day. The point isn't to make all three work — it's to know what to look for if a future client engagement uses a different stack.

| Harness                         | Where this hook lives                                             | One-liner you'd write |
| ------------------------------- | ----------------------------------------------------------------- | --------------------- |
| Claude Code                     | `.claude/settings.json` → `hooks` → `PreToolUse` / `Stop` etc.    | _your line here_      |
| Cursor                          | `.cursorrules` (or `.cursor/rules/*.mdc` instructional rule)      | _your line here_      |
| OpenCode / Codex CLI / fallback | config wrapper or `.git/hooks/pre-commit` + `lab-s2-3-wrapper.sh` | _your line here_      |

**Pass criterion.** The gate triggers on one provoked attempt; evidence saved (3-line log); cross-harness mini-table filled in for at least the harness you used plus one other.

**While you wait:**

1. Sketch the second hook from your priority list.
2. Identify which of the four hooks would catch each of the deck's failure modes, item by item.

---

### Lab S2.4 — Copilot translation (12 min)

**Goal.** Translate one Skill to its Copilot equivalent. Demonstrates cross-tool fluency.

**Do.**

1. Translate `crm-reviewer` to `.github/agents/crm-reviewer.md` with YAML frontmatter and Copilot-flavored phrasing.
2. Add a short `.github/copilot-instructions.md` that points at the agent and inherits conventions from your `AGENTS.md`/`CLAUDE.md`.
3. Run Copilot's Code Review Agent on the `seeded-bad-build` diff. Save the output as `lab-s2-4-comparison.md` — 5 bullets: where Copilot caught what your Skill didn't, and vice versa.

**Pass criterion.** Translated agent runs; comparison names at least one concrete difference.

**While you wait:**

1. Write one sentence per harness: "I would pick this one when …"
2. Note one Copilot governance feature (Agent Control Plane, 180-day audit logs, EU Data Residency) that would matter to a current client.

---

## Final certification — 60-second walkthrough

At the end of Session 2 you'll get 60 seconds to walk the **Teamit 6-item client checklist** for your lab project. Pass requires 5/6.

1. **Data residency** — what would change if this client required EU-only inference?
2. **Permission & hooks** — what blocks a `.env` write today?
3. **Logging** — where would agent actions be logged for a 90-day audit trail?
4. **MCP whitelist** — what MCP servers are installed? Which are vetted?
5. **Insurance** — what's the "Silent AI" PI exclusion question you'd ask the client?
6. **Incident response** — under Kyberturvallisuuslaki 124/2025, who is notified within 24 hours, and who at the client owns that?

Have one-line answers ready. "I don't know" is acceptable for at most one item; bullshit is not.

---

## Harness translation

If you're not using Claude Code, produce the equivalent artifact and the lab passes — graders score intent, not file extension.

| Intent                     | Claude Code                      | Equivalents                                                                                                                               | Required artifact (what makes the lab pass)                                                    |
| -------------------------- | -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Initialize project context | `/init`                          | First inspection prompt; or `--read CONVENTIONS.md` (Aider)                                                                               | An agent-context file in the repo                                                              |
| Project context file       | `CLAUDE.md`                      | `AGENTS.md` (Codex CLI / OpenCode / others) · `.cursorrules` (Cursor)                                                                     | One of the above, ≤ 200 lines                                                                  |
| Reusable Skill             | `.claude/skills/<name>/SKILL.md` | `.cursor/rules/*.mdc` · OpenCode agents · Aider conventions snippets · **fallback:** versioned prompt templates in `prompts/`             | A reusable file with name, description, inputs, workflow, output format, evidence requirements |
| Compress / reset context   | `/compact`                       | Start a new session                                                                                                                       | A clean context for the next task                                                              |
| Cost / token check         | `/cost`                          | Codex CLI usage command; harness UI; provider dashboard                                                                                   | A noted cost number per lab                                                                    |
| Deep review                | `/review`, `/ultrareview`        | Explicit "review for security, perf, edge cases" prompt; high-effort tier if available                                                    | A review report committed as `lab-XX-review.md`                                                |
| Pre/post tool gates        | hook events                      | OpenCode/Codex config wrappers · Aider test command + commit gate · **fallback:** `.git/hooks/pre-commit` + `scripts/lab-s2-3-wrapper.sh` | A working hook config or git-hook + wrapper                                                    |
| Subagents / parallel work  | Task tool                        | Multiple terminal sessions in `git worktree`s · Cursor parallel chats                                                                     | Evidence of true parallelism (timestamps overlap)                                              |

If your harness genuinely cannot satisfy a lab intent, document the gap in your evidence file. Recognizing the gap is itself part of the certification — tool fluency includes knowing what your tool can't do.

---

## Rules of the lab

- **Synthetic data only.** Never paste real customer data, real credentials, or real account numbers into the repo or the agent. The seed data is safe to share; anything you bring from a client is not.
- **Read the diff.** Don't accept the agent's plan or its summary without reading the actual diff.
- **No "needs work" decisions.** When you (or your reviewer skill) judge a diff, the answer is `accept`, `revise`, or `reject`. Equivocation is not a decision.
- **If a number isn't sourced, don't quote it.** Cite a URL or say "I don't know." This is the discipline that separates a Teamit consultant from someone who installed a plugin.

Good luck. The CRM is the vehicle. The repeatable Skill library is the lasting capability.
