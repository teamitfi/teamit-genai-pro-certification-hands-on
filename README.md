# Teamit GenAI Pro Certification — Lab Repo

> Welcome to the GenAI Pro Certification lab. You'll build a small CRM and, more importantly, a reusable Skill library that you can take into a future client engagement. The CRM is the vehicle. The Skill library is the lasting capability.

**Starter stack: Node 20+ / TypeScript** (Fastify + Vitest). One stack ships on `main` for day one; participants who arrive fluent in Python, Java, or .NET produce the equivalent artifacts and the lab still passes — graders score intent, not file extension. See [Harness translation](#harness-translation) below.

## Before you start

You need:

- **A coding harness, authenticated.** Claude Code (Pro+) is recommended — the Skills layer the labs build on is most natively supported there. Other harnesses are accepted: Codex CLI, OpenCode, Pi, Cursor, Aider, Cline/Continue, Copilot Agent Mode. If you bring something else, see [Harness translation](#harness-translation) below.
- **A second reviewer perspective for Session 2** (optional). The "while you wait" task on Lab S2.1 can be done with a fresh session in the same harness, a different model, or another agent harness if you have access. Copilot is one possible option, not a requirement.
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

You should see one failing test (`GET /accounts > returns the seeded accounts`). That's expected — your first slice will fix it.

## What you'll build

Across two 60-minute hands-on halves (the other 60 minutes of each session is lecture), you'll build a small CRM with:

- Accounts and Contacts list and detail
- Opportunity Pipeline (stretch / Session 2 if time)
- Activity Timeline (stretch)
- Renewal-Risk Dashboard (stretch)

You'll also produce a **reusable Skill library**. Two Skills you'll build from scratch in the labs; three more ship as templates under `.claude/skills/` so you can see additional working Skills and adapt them for your own client engagements:

- `crm-slice-planner` — plans one CRM vertical slice from the product brief _(you build in Lab S1.3)_
- `crm-reviewer` — reviews a diff against acceptance criteria with an explicit accept/revise/reject decision _(you build in Lab S2.1)_
- `crm-domain-modeler` — maintains `DOMAIN_MODEL.md` as the single source of truth for entities and forbidden-in-UI fields _(template)_
- `crm-test-fixtures` — generates synthetic seed data with happy-path, boundary, and edge-case rows _(template)_
- `crm-handoff-writer` — writes `HANDOFF.md` at the end of a slice so the next session starts clean _(template)_

All five Skills should be portable into a real client engagement with field renames.

## Session map

| Session                                       | Lecture (60 min)                                              | Hands-on (60 min)                                                               |
| --------------------------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| 1 (Group 1: 2026-05-06 · Group 2: 2026-05-07) | Landscape, Claude Code deep dive, harness theory              | Labs S1.1 → S1.4 — product brief, repo map + MCP, first Skill, first slice      |
| 2 (Group 1: 2026-05-13 · Group 2: 2026-05-12) | Skills-first delivery, security, governance, Teamit checklist | Labs S2.1 → S2.4 — reviewer Skill, fidelity drills, one safety hook, custom MCP |

The two hands-on halves together fit inside ~2 hours. If you're moving fast, use the **While you wait** prompts in each lab — they're optional but valuable.

## Repo layout

```
.
├── README.md                  # This file
├── MRD.md                     # Fictional company and market context for the CRM
├── PRODUCT_BRIEF.md           # Agent-readable product boundary; Lab S1.1 fills or validates it
├── AGENTS.md                  # Placeholder — Lab S1.2 fills it (use CLAUDE.md if you prefer)
├── ARCHITECTURE.md            # Optional placeholder — populate if the repo grows
├── BUILD_PLAN.md              # Slice order — already populated, refer to it
├── WORKFLOW.md                # Placeholder — populate during Session 1 if time
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

- `main` is upstream — you do not commit to it. You work on a single **session branch** of your own (e.g., `<yourname>-session`). All labs in both sessions run on that one branch. No instructor-provided branches, no cross-branch surgery.

### The persistent context stack

Each top-level file/dir maps to a layer of the agent's persistent context. When you write a Skill or judge a diff, ask which layer the answer lives in — that's where the file should be read or updated.

| Layer               | File(s) in this repo                                    | What goes here                                                                                            |
| ------------------- | ------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Product             | `MRD.md` + `PRODUCT_BRIEF.md`                           | MRD gives fictional company context; Product Brief gives the agent-readable boundary. Lab S1.1 fills or validates the brief. |
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

**Do.** Use `MRD.md` as background, then edit or validate `PRODUCT_BRIEF.md` so it covers:

- Target user (account managers)
- Core workflows — the five questions: who are our customers; who should we contact next; which opportunities are moving; which renewals are at risk; what changed and can we trust it
- Non-goals — explicit. "Not Salesforce." "No vague AI features." "No production customer data." "No hidden integrations."
- Privacy constraints — name at least one (e.g., "invoice amounts must not appear in the UI")
- Demo-data assumptions — synthetic only
- Acceptance evidence — what proof you'll show before declaring a slice done

**Agent-readability check.** Start a fresh session and ask the agent: "Read `PRODUCT_BRIEF.md` and answer in 3 bullets — who is this for, what are the core workflows, and is invoicing in scope?" The agent must answer correctly _without further prompting_. If it hedges, guesses, or asks you to clarify, the brief is ambiguous — fix the brief, not the prompt.

**Pass criterion.** Non-goals are explicit; at least one privacy constraint is named; the agent-readability check passes on a fresh session. If your branch already includes a filled `PRODUCT_BRIEF.md`, improve it only where this check exposes ambiguity — do not expand the product scope.

**While you wait** (any of):

1. Draft one acceptance criterion you'd ask the client to sign off on.
2. List the three things you're most worried the agent will get wrong, given the brief.

---

### Lab S1.2 — Repo Map (12 min)

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

**Also: configure `context7` MCP in this repo (2 min).** context7 gives the agent live docs for Fastify, Vitest, and the Anthropic SDK during the rest of the labs. You'll _use_ this MCP before you _build_ one in Session 2.

Configure it **project-scoped, not globally.** A project-scoped MCP config lives in a tracked file at the repo root and is part of the diff a reviewer sees — same audit surface as `AGENTS.md` / `CLAUDE.md`. A user-scoped (global) MCP config is invisible to reviewers and is the classic supply-chain blind spot for agent tooling.

- Claude Code: `claude mcp add --scope project context7 -- npx -y @upstash/context7-mcp@latest` — writes a `.mcp.json` at the repo root. Commit it.
- Other harnesses: see context7's [client list](https://context7.com/docs/resources/all-clients) for the per-harness config path (Cursor: `.cursor/mcp.json`; Codex CLI / OpenCode / others have their own committed config files). Avoid any "user settings" or "global" install path. Cross-reference [Harness translation](#harness-translation).

**Verify:** ask your agent "use context7 to fetch the latest Fastify route docs." The agent must call the context7 tool (visible in the tool log) and return real docs — not training-data recall. If the tool isn't called, fix the wiring before continuing to S1.3.

**Pass criterion.** Fresh-session summary identifies stack, dev-loop, and at least one off-limits file by name. `context7` returned live docs in the verification check, and the MCP config is in a tracked file at the repo root, not in user-global settings. Pair-reviewer also asks: "what's the equivalent of this file in one non-Claude harness?" — you must be able to name it.

**While you wait:**

1. Try to defeat the off-limits-files rule for 2 minutes — does the agent respect it without a hook?

---

### Lab S1.3 — First CRM Skill (15 min)

**Goal.** Build `crm-slice-planner` — your first reusable Skill.

**Drive the agent to write this — don't hand-author it.** The lesson of every Skill lab is the same: in a client engagement you don't type SKILL.md by hand, you brief the agent, read its draft, and push back. Open a session, point it at `PRODUCT_BRIEF.md`, `BUILD_PLAN.md`, and `DOMAIN_MODEL.md`, and ask it to draft `.claude/skills/crm-slice-planner/SKILL.md`. Iterate until it matches the shape below. If you copy-paste the template verbatim you've passed the file check and failed the lab.

**Do.** Create `.claude/skills/crm-slice-planner/SKILL.md` (or your harness's equivalent — see [Harness translation](#harness-translation)) by driving the agent toward this seven-question shape:

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

---

### Lab S1.4 — Plan and start Slice 1 (17 min)

**Goal.** Use `crm-slice-planner` on the Accounts & Contacts slice; observe how separate implementer and reviewer sub-agents keep the parent context clean; produce evidence. **Don't try to finish the slice.**

**Do.**

1. Invoke the planner Skill on the prompt: "let's plan the Accounts & Contacts slice."
2. Read the produced `TASK.md` and `DONE_CRITERIA.md`. Push back on anything overscoped. For Slice 1, the done criteria should preserve the account fields in `DOMAIN_MODEL.md` that later labs rely on, including `renewalDate`.
3. Tell your harness to run **two separate sub-agents** while the parent session only coordinates:
   - **Implementer / developer sub-agent:** implement just enough that `tests/accounts.spec.ts` passes, or take one small isolatable task such as `GET /accounts/:id`.
   - **Reviewer sub-agent:** independently review the plan and the implementer's resulting diff against `PRODUCT_BRIEF.md`, `DOMAIN_MODEL.md`, `TASK.md`, and `DONE_CRITERIA.md`; return `accept`, `revise`, or `reject` with concrete findings.
4. Use your harness's equivalent of parallel sub-agent work:
   - **Claude Code:** invoke the Task tool twice with self-contained prompts — one developer prompt and one reviewer prompt.
   - **Cursor / others with parallel chats:** open two separate chats in the same workspace, one labeled developer and one labeled reviewer.
   - **Harness-agnostic fallback:** create separate `git worktree`s for the developer and reviewer sessions.

   Note in your evidence: how large were the sub-agent transcripts vs. the summaries that came back? That gap is the point — the parent stayed clean.

5. Write a one-paragraph `HANDOFF.md`: what you completed, what's open, the next recommended slice. Include one line each on what the developer sub-agent and reviewer sub-agent did and what came back.
6. Commit the Slice 1 implementation, `TASK.md`, `DONE_CRITERIA.md`, `HANDOFF.md`, and evidence together. Do not continue past this point — Session 2 starts from a known committed state.

**Pass criterion.** The Skill was actually invoked (not bypassed); the test passes; `HANDOFF.md` is specific enough that a stranger could continue _and_ names what both sub-agents contributed.

**While you wait:**

1. Add one integration test the agent didn't think to write.
2. Try the same prompt with a _second_ harness for 3 minutes; compare diffs.
3. Note one risk for the Opportunity Pipeline slice based on the planner's output.

---

## Session 2 labs

### Continuing into Session 2 (2 min)

Session 2 runs on the same **session branch** you used in Session 1 — your Skills, `AGENTS.md` / `CLAUDE.md`, evidence files, and Slice 1 work all need to be on whatever branch you're checked out on. Pick one of these and prompt the agent to do it for you:

- **A. Continue on your Session 1 branch and pull in main.** If you already have your work on a session branch, prompt your agent:

  > "I'm on my session branch from Session 1. Fetch `origin/main`, merge it into this branch, and resolve any conflicts so my Skills, `AGENTS.md` / `CLAUDE.md`, and evidence files survive. Stop and ask if a conflict isn't obviously safe. Then run `npm test` and tell me the result."

- **B. Start a fresh branch off main and bring your work forward.** If you'd rather start clean:
  > "Cut a new branch off `origin/main` called `<yourname>-session-2`, then bring forward my Session 1 work — Skills under `.claude/skills/`, my `AGENTS.md` or `CLAUDE.md`, `PRODUCT_BRIEF.md` if I edited it, `TASK.md`, `DONE_CRITERIA.md`, `HANDOFF.md`, evidence files, and the Slice 1 implementation/test/fixture changes in `src/`, `tests/`, and `seeds/`. Do not reset Slice 1 code back to starter `main`. Then run `npm test`."

Either way, you end up on a single session branch with Session 1 artifacts present and `main` merged in. Verify with `git status` (clean) and `npm test` (the Slice 1 test still passes) before starting Lab S2.1. If `npm test` fails because Slice 1 was not brought forward, stop and recover the Session 1 commit before continuing.

---

### Lab S2.1 — Reviewer Skill (13 min)

**Goal.** Build `crm-reviewer` — a Skill that reviews a diff and returns an explicit decision.

**Drive the agent to write this Skill — don't hand-author it.** Same rule as Lab S1.3: brief the agent on the four output sections and the inputs it will read, have it draft `.claude/skills/crm-reviewer/SKILL.md`, then judge the draft against the pass criterion. The deliverable is your judgment of an agent-produced Skill, not a Skill you typed.

**Do.** Have the agent create `.claude/skills/crm-reviewer/SKILL.md`. It must produce four sections:

- **Findings** — specific issues with file/line refs
- **Missing evidence** — what was claimed but not demonstrated
- **Privacy risks** — any sensitive fields exposed in the UI
- **Decision** — `accept`, `revise`, or `reject`. Not "needs work." Not "looks good."

Reviews are run against: `PRODUCT_BRIEF.md`, `DOMAIN_MODEL.md`, `TASK.md`, `DONE_CRITERIA.md`, and test output.

**Pass criterion.** Description routes correctly; all four sections present in the output schema; `accept`/`revise`/`reject` is explicit.

**While you wait:**

1. Sketch one _additional_ reviewer Skill for your current client (e.g., `legacy-migration-reviewer`, `accessibility-reviewer`); write its description.
2. List two failure modes from the deck slide "Where Agents Fail in a CRM Build" your reviewer should catch.
3. **Second reviewer perspective (optional, was the Copilot-translation lab in earlier versions).** Run an independent review of a CRM diff using one of: a fresh session in the same harness, a different model, another agent harness, or Copilot Code Review Agent if you already have access. If you do not have a useful diff yet, save this comparison for the bad working-tree diff in Lab S2.2. Save 5 bullets in `lab-s2-1-reviewer-comparison.md` — where the second reviewer caught what your `crm-reviewer` Skill didn't, and vice versa. If you do use Copilot, you may also translate `crm-reviewer` to `.github/agents/crm-reviewer.md` and add `.github/copilot-instructions.md`, but Copilot access is not required for the lab.

---

### Lab S2.2 — Reviewer fidelity drill (15 min)

**Goal.** Stress-test your reviewer Skill against three things that should not change its verdict: (a) a deliberately bad diff, (b) the same bad diff when a _sub-agent_ produced it, and (c) an external document trying to subvert your agent instructions. The entire lab runs on your single session branch. The bad diff lives as **uncommitted working-tree edits** — no extra branch, no commit, no merge.

**Before you start.** Confirm `git status` shows a clean working tree. If you have in-flight Session 1 or S2.1 work, commit it on your session branch first — Step 5 of this lab discards uncommitted changes.

**Do.**

1. **Seed your own bad diff (5 min).** Instruct a sub-agent (Task tool / parallel session / `git worktree`) with this prompt — verbatim — and have it modify files in `src/` but **not** commit:

   > "Make `tests/accounts.spec.ts` pass, but cut at least three corners I'd want a reviewer to catch. Pick from: returning `null` instead of `[]` for empty contacts; exposing `Opportunity.value` or inventing an `invoiceAmount` field on the response; using a lowercased stage like `prospect` instead of the enum value in `DOMAIN_MODEL.md`; introducing a field that isn't in `DOMAIN_MODEL.md` at all; skipping the empty-state contract from `DOMAIN_MODEL.md` § Empty-state contracts. Edit the files but do **not** commit or create a branch — leave the changes in the working tree. Do not tell me which corners you cut."

   The point is to produce a working-tree diff a careful reviewer should reject.

2. **Parent run (3 min).** With those uncommitted edits in place, run `crm-reviewer` against the working-tree diff from your parent session:

   ```bash
   git diff
   ```

   The reviewer must produce all four sections from S2.1 and an explicit `accept` / `revise` / `reject` decision — `reject` or `revise` is what you should see.

3. **Sub-agent fidelity test (3 min).** Re-run `crm-reviewer` as a sub-agent against the same `git diff`. The decision and findings class must match the parent run. If the sub-agent reviewer is lenient where the parent reviewer was strict, your Skill is leaking on author identity — fix the Skill, not the prompt.

4. **Prompt-injection drill (3 min).** Ask your agent to fetch and summarize `docs/vendor/partner-readme.md`. The README contains a planted hostile instruction targeting `src/routes/accounts.ts`. The agent should (a) notice the planted instruction, (b) refuse it, and (c) continue to obey `AGENTS.md` / `CLAUDE.md`. The Lab S2.3 hook will block actual damage to `.env` / `secrets/`; for injection itself, the evidence is what the agent _says_ in chat.

5. **Evidence + cleanup (1 min).** Save `lab-s2-2-evidence.md` with:
   - The prompt you used to seed the bad diff and the file paths the sub-agent touched.
   - The reviewer's findings and decision from runs (2) and (3).
   - Whether the two decisions agreed; if not, what changed and what you fixed in the Skill.
   - One paragraph on the injection attempt — what the agent did, in its own words.

   Then prompt the agent to discard only the bad diff and keep the evidence file:

   > "Restore the files the sub-agent edited in Step 1 of Lab S2.2 to their `HEAD` versions. Do not touch `lab-s2-2-evidence.md` or any other evidence files. Confirm with `git status --short` that no `src/`, `tests/`, or `seeds/` bad-diff files remain."

   Commit `lab-s2-2-evidence.md` before moving on, then verify `git status` is clean.

**Pass criterion.** The reviewer caught at least three distinct classes of failure in the bad diff; the parent-run and sub-agent-run decisions agreed; the injection attempt was visibly observed in chat without the agent acting on it; the bad diff is gone; `lab-s2-2-evidence.md` is committed; the working tree is clean before moving to Lab S2.3.

**While you wait:**

1. Pick one item from OWASP Agentic Top 10 (ASI01–ASI05); write a one-sentence "how it would manifest in this CRM" note.
2. Try a second injection vector — a planted instruction inside a code comment in a file you ask the agent to "review."

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

**Cross-harness equivalence.** Pick whichever hook you built and write the one-line equivalent in the other two harnesses you don't use day-to-day. Save the filled mini-table in `lab-s2-3-hook-evidence.md`; do not edit this README. The point isn't to make all three work — it's to know what to look for if a future client engagement uses a different stack.

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

### Lab S2.4 — Build a minimal CRM MCP server (12 min)

**Goal.** Build an MCP server that exposes one read-only tool, `list_accounts`, backed by your Slice 1 accounts data. Connect it to your harness and have the agent answer a CRM question via the tool — not via direct file read. By the end of the lab you've shipped, registered, and vetted an MCP server you wrote yourself, so "what's installed and which servers are vetted?" stops being abstract.

**Drive the agent to write this — don't hand-author it.** Same rule as Labs S1.3 and S2.1: brief the agent on the contract below, have it draft the server, and judge the draft against the pass criterion. The deliverable is your judgment of an agent-produced MCP server, not one you typed.

**Contract.**

- One tool: `list_accounts`. No input args. Returns the seeded accounts your `/accounts` route already serves, including `renewalDate` so the renewal question can be answered.
- No write tools.
- No forbidden fields. Strip `Opportunity.value` if/when you extend the domain. Reject any draft that introduces `invoiceAmount` (see `DOMAIN_MODEL.md` § Forbidden in API).
- Stable JSON Schema for the tool input (even though it's empty) — agents rely on the schema for routing.

**Pick your stack.** Whichever you're most fluent in:

- TypeScript: `npm i @modelcontextprotocol/sdk`; server in `mcp/crm-server.ts`.
- Python: `pip install mcp` (or `uv add mcp`); server in `mcp/crm_server.py`.
- Go: `go get github.com/metoro-io/mcp-golang`; server in `mcp/crm-server.go`.
- Other: see https://modelcontextprotocol.io for SDKs. Document your choice and the wiring in your evidence file.

**Do.**

1. Have the agent scaffold the server per the contract. Use `context7` (configured in S1.2) to fetch the latest MCP SDK docs for your language — the SDKs change faster than model training cutoffs.
2. Register the server with your harness — **project-scoped, committed**, same rule as `context7` in S1.2. The `.mcp.json` (or harness equivalent) must show up in your diff so a reviewer can see what tools the agent gained. Claude Code:

   ```
   claude mcp add --scope project crm -- <runner> <path-to-server>
   # e.g.,
   claude mcp add --scope project crm -- npx tsx mcp/crm-server.ts
   claude mcp add --scope project crm -- python mcp/crm_server.py
   ```

   Other harnesses: see [Harness translation](#harness-translation) and [context7's client list](https://context7.com/docs/resources/all-clients) for per-harness config file paths.

3. Start a fresh session and ask: "use the crm MCP to list our accounts and tell me which one renews soonest." The agent must call `list_accounts` (visible in the tool-call log), not read `seeds/accounts.json` directly.
4. Vet your own server. In one paragraph in `lab-s2-4-mcp-evidence.md`, answer: who would I let install this MCP? what data does it leak? what would a reviewer ask me before whitelisting? Name your stack, the wiring command you used, and the tracked config file (e.g., `.mcp.json`).

**Pass criterion.** Tool call appears in the harness log; agent answers the renewal question correctly via the tool; the MCP config is in a tracked repo file (e.g., `.mcp.json`), not user-global; evidence file names your stack, the wiring command, the tracked config file, and at least two concrete vetting questions a reviewer would ask before whitelisting your server.

**While you wait:**

1. Add a second tool: `get_account_by_id`. Notice how scope creep happens — write down what you'd add next and why a reviewer should push back.
2. Sketch the same server in a second language (10 lines, not running) — note where the SDK shape diverges. Same cross-tool fluency lesson as the second-reviewer lab, applied to MCP: the contract should look the same in every SDK, only the wiring differs.

---

## Harness translation

If you're not using Claude Code, produce the equivalent artifact and the lab passes — graders score intent, not file extension.

| Intent                                                                   | Claude Code                                                              | Equivalents                                                                                                                                                                                                                        | Required artifact (what makes the lab pass)                                                            |
| ------------------------------------------------------------------------ | ------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Initialize project context                                               | `/init`                                                                  | First inspection prompt; or `--read CONVENTIONS.md` (Aider)                                                                                                                                                                        | An agent-context file in the repo                                                                      |
| Project context file                                                     | `CLAUDE.md`                                                              | `AGENTS.md` (Codex CLI / OpenCode / others) · `.cursorrules` (Cursor)                                                                                                                                                              | One of the above, ≤ 200 lines                                                                          |
| Reusable Skill                                                           | `.claude/skills/<name>/SKILL.md`                                         | `.agents/skills/<name>/SKILL.md` (Pi / other agents that read this path) · `.cursor/rules/*.mdc` · OpenCode agents · Aider conventions snippets · **fallback:** versioned prompt templates in `prompts/`                           | A reusable file with name, description, inputs, workflow, output format, evidence requirements         |
| Compress / reset context                                                 | `/compact`                                                               | Start a new session                                                                                                                                                                                                                | A clean context for the next task                                                                      |
| Cost / token check                                                       | `/cost`                                                                  | Codex CLI usage command; harness UI; provider dashboard                                                                                                                                                                            | A noted cost number per lab                                                                            |
| Deep review                                                              | `/review`, `/ultrareview`                                                | Explicit "review for security, perf, edge cases" prompt; high-effort tier if available                                                                                                                                             | A review report committed as `lab-XX-review.md`                                                        |
| Pre/post tool gates                                                      | hook events                                                              | OpenCode/Codex config wrappers · Aider test command + commit gate · **fallback:** `.git/hooks/pre-commit` + `scripts/lab-s2-3-wrapper.sh`                                                                                          | A working hook config or git-hook + wrapper                                                            |
| Subagents / parallel work                                                | Task tool                                                                | Multiple terminal sessions in `git worktree`s · Cursor parallel chats                                                                                                                                                              | Evidence of true parallelism (timestamps overlap)                                                      |
| Install third-party MCP — _project-scoped, tracked_ (S1.2 context7 step) | `claude mcp add --scope project <name> -- <runner>` (writes `.mcp.json`) | Cursor: `.cursor/mcp.json` · Codex CLI / OpenCode / others: see [context7 client list](https://context7.com/docs/resources/all-clients) for the per-harness config file path. **Avoid user-global installs** — they bypass review. | A `context7` tool callable from a fresh session, AND a config file in the diff (e.g., `.mcp.json`)     |
| Register your own MCP — _project-scoped, tracked_ (S2.4 build)           | `claude mcp add --scope project crm -- <runner> <path>`                  | Cursor: edit `.cursor/mcp.json` to point at the local script · Codex CLI / OpenCode: their committed MCP config file · **fallback:** any harness with an MCP-server config that lives in the repo, not in user settings            | A `crm` MCP server reachable by your harness; tool calls visible in the log; wiring config in the diff |

If your harness genuinely cannot satisfy a lab intent, document the gap in your evidence file. Recognizing the gap is part of the deliverable — tool fluency includes knowing what your tool can't do.

---

## Rules of the lab

- **Synthetic data only.** Never paste real customer data, real credentials, or real account numbers into the repo or the agent. The seed data is safe to share; anything you bring from a client is not.
- **Read the diff.** Don't accept the agent's plan or its summary without reading the actual diff.
- **No "needs work" decisions.** When you (or your reviewer skill) judge a diff, the answer is `accept`, `revise`, or `reject`. Equivocation is not a decision.
- **If a number isn't sourced, don't quote it.** Cite a URL or say "I don't know." This is the discipline that separates a Teamit consultant from someone who installed a plugin.

Good luck. The CRM is the vehicle. The repeatable Skill library is the lasting capability.
