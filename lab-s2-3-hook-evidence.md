# Lab S2.3 — Safety hooks evidence

S2.3 asks for **one** of four hooks. To stress-test the design surface, all four are implemented and verified — each as an independent script under `scripts/hooks/`, wired into `.claude/settings.json` for Claude Code, plus the existing `scripts/lab-s2-3-wrapper.sh` activated as a `git pre-commit` fallback for cross-harness portability.

## 1. The four hooks

| #   | Intent                                                            | Event in Claude Code   | Script                                         | Behaviour                                                                                  |
| --- | ----------------------------------------------------------------- | ---------------------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------ |
| 1   | Block sensitive files                                             | `PreToolUse` on `Bash` | `scripts/hooks/deny-sensitive-bash.sh`         | Refuses shell commands that touch `.env` / `.env.*` / `secrets/`. Exit 2 = blocked.        |
| 2   | Run CRM tests after relevant changes                              | `PostToolUse` on `Write|Edit` | `scripts/hooks/post-edit-run-tests.sh`  | When a file under `src/`, `tests/`, or `seeds/` is touched, runs `npm test --silent --run` and prints the summary. Never blocks (informational). |
| 3   | Fail on forbidden field (`invoiceAmount`) in `src/`               | `PreToolUse` on `Write|Edit` | `scripts/hooks/pre-edit-forbidden-field.sh` | If a Write/Edit targets `src/` and the payload contains the literal `invoiceAmount`, refuses the tool call. Exit 2 = blocked. |
| 4   | Summarize at session end                                          | `Stop`                 | `scripts/hooks/stop-summary.sh`                | At session end prints `git status --short`, scans `src/` for `invoiceAmount` / `Opportunity.value` exposure, and flags a stale `HANDOFF.md`. Never blocks. |

The existing `scripts/lab-s2-3-wrapper.sh` is the **harness-agnostic fallback** for hook #1 (`.env` / `secrets/`) and hook #3 (`invoiceAmount` in `src/`). Activated by copying `scripts/pre-commit.sample` to `.git/hooks/pre-commit`.

## 2. Wiring (installed)

Both wiring steps have been completed by the user:

1. **`.claude/settings.json`** — pasted in (the Claude Code harness blocks agent self-edits to this file as a deliberate safety guard; the user applied the change directly). Current contents:

   ```json
   {
     "permissions": {
       "deny": [
         "Read(./.env)",
         "Read(./.env.*)",
         "Read(./secrets/**)",
         "Write(./.env)",
         "Write(./.env.*)",
         "Write(./secrets/**)"
       ]
     },
     "hooks": {
       "PreToolUse": [
         {
           "matcher": "Bash",
           "hooks": [
             { "type": "command", "command": "$CLAUDE_PROJECT_DIR/scripts/hooks/deny-sensitive-bash.sh" }
           ]
         },
         {
           "matcher": "Write|Edit",
           "hooks": [
             { "type": "command", "command": "$CLAUDE_PROJECT_DIR/scripts/hooks/pre-edit-forbidden-field.sh" }
           ]
         }
       ],
       "PostToolUse": [
         {
           "matcher": "Write|Edit",
           "hooks": [
             { "type": "command", "command": "$CLAUDE_PROJECT_DIR/scripts/hooks/post-edit-run-tests.sh" }
           ]
         }
       ],
       "Stop": [
         {
           "matcher": "",
           "hooks": [
             { "type": "command", "command": "$CLAUDE_PROJECT_DIR/scripts/hooks/stop-summary.sh" }
           ]
         }
       ]
     }
   }
   ```

2. **`.git/hooks/pre-commit`** — installed from `scripts/pre-commit.sample`, executable, and live (provoked-attempt evidence in §3 below).

   ```bash
   cp scripts/pre-commit.sample .git/hooks/pre-commit
   chmod +x .git/hooks/pre-commit
   ```

Both layers are now firing on the next tool call / next commit, no restart required.

## 3. Provoked-attempt evidence

Each script tested in isolation by piping a synthetic event payload to stdin (the same shape Claude Code sends). All runs from repo root.

### Hook #1 — `deny-sensitive-bash.sh`

```text
-- benign --
$ echo '{"tool_input":{"command":"ls src/"}}' | scripts/hooks/deny-sensitive-bash.sh
(no output, exit 0)  → allowed

-- malicious .env --
$ echo '{"tool_input":{"command":"cat .env"}}' | scripts/hooks/deny-sensitive-bash.sh
lab-s2-3 PreToolUse(Bash): blocked — command touches .env / secrets/.
exit=2  → blocked

-- malicious secrets/ --
$ echo '{"tool_input":{"command":"tar czf /tmp/out.tgz secrets/"}}' | scripts/hooks/deny-sensitive-bash.sh
lab-s2-3 PreToolUse(Bash): blocked — command touches .env / secrets/.
exit=2  → blocked
```

### Hook #3 — `pre-edit-forbidden-field.sh`

```text
-- benign edit in src/ --
$ echo '{"tool_input":{"file_path":"src/routes/accounts.ts","content":"return seeds;"}}' | scripts/hooks/pre-edit-forbidden-field.sh
exit 0  → allowed

-- forbidden field via Write.content --
$ echo '{"tool_input":{"file_path":"src/routes/accounts.ts","content":"return { ...a, invoiceAmount: 12450 };"}}' | scripts/hooks/pre-edit-forbidden-field.sh
lab-s2-3 PreToolUse(Write|Edit): blocked — forbidden field 'invoiceAmount' targeting src/routes/accounts.ts.
exit=2  → blocked

-- forbidden field via Edit.new_string --
$ echo '{"tool_input":{"file_path":"src/routes/accounts.ts","old_string":"return [];","new_string":"return [{ invoiceAmount: 1 }];"}}' | scripts/hooks/pre-edit-forbidden-field.sh
lab-s2-3 PreToolUse(Write|Edit): blocked — forbidden field 'invoiceAmount' targeting src/routes/accounts.ts.
exit=2  → blocked

-- outside src/ (intentionally allowed — DOMAIN_MODEL.md / docs may name the field) --
$ echo '{"tool_input":{"file_path":"docs/note.md","content":"invoiceAmount mention"}}' | scripts/hooks/pre-edit-forbidden-field.sh
exit 0  → allowed
```

### Hook #2 — `post-edit-run-tests.sh`

```text
-- short-circuit when path is outside src/tests/seeds --
$ echo '{"tool_input":{"file_path":"README.md"}}' | scripts/hooks/post-edit-run-tests.sh
exit 0  → no test run

-- triggers on src/ path --
$ echo '{"tool_input":{"file_path":"src/routes/accounts.ts"}}' | scripts/hooks/post-edit-run-tests.sh
… (vitest output) …
 Test Files  1 passed (1)
      Tests  5 passed (5)
lab-s2-3 PostToolUse: tests PASSED.
```

### Hook #4 — `stop-summary.sh`

```text
$ scripts/hooks/stop-summary.sh
── lab-s2-3 Stop summary ────────────────────────────────────────────
Changed files:
  ?? .claude/skills/accessibility-reviewer/
  ?? .claude/skills/crm-reviewer/
  ?? .github/
  ?? CLAUDE.md
  ?? docs/vendor/vendor-snippet.ts
  ?? lab-s2-2-evidence.md
  ?? scripts/hooks/

Privacy-marker scan (src/):
  invoiceAmount: clean
  Opportunity.value exposure: no obvious matches
─────────────────────────────────────────────────────────────────────
```

### Git pre-commit fallback (`scripts/lab-s2-3-wrapper.sh`)

Activated by copying `scripts/pre-commit.sample` → `.git/hooks/pre-commit`. Same enforcement surface as hooks #1 and #3 but at commit time. Three checks on the staged diff: refuses `.env` / `.env.*`, refuses anything under `secrets/`, refuses `+` lines containing `invoiceAmount` in `src/`. If a future client engagement is on a harness without native hooks, this fallback alone covers the two highest-severity rules.

**Provoked attempt — live, hook installed:**

```text
$ printf 'export const x = { invoiceAmount: 1 };\n' > src/tmp-invoice-test.ts
$ git add src/tmp-invoice-test.ts
$ git commit -m "test: should be blocked by pre-commit"
lab-s2-3 hook: refuses to commit forbidden field 'invoiceAmount' in src/ (see DOMAIN_MODEL.md)
$ echo "exit=$?"
exit=1            # commit refused; nothing landed on HEAD
$ git restore --staged src/tmp-invoice-test.ts && rm src/tmp-invoice-test.ts
```

The commit was refused before any object was written to the repo; `git log` is unchanged. The fixture file was unstaged and deleted after the test.

### Live in-harness verification (hooks firing on this session's own tool calls)

After the `.claude/settings.json` wiring was applied, the four hooks were re-verified end-to-end by provoking them on Claude's *own* tool calls in this session — not via stdin piping. The harness intercepted each call exactly as configured:

```text
-- Hook #1 (PreToolUse on Bash): Claude attempted `cat .env` --
$ cat .env
PreToolUse:Bash hook error:
[$CLAUDE_PROJECT_DIR/scripts/hooks/deny-sensitive-bash.sh]:
  lab-s2-3 PreToolUse(Bash): blocked — command touches .env / secrets/.
  See DOMAIN_MODEL.md and AGENTS.md § Off-limits files.
→ tool call refused; no file read.

-- Hook #3 (PreToolUse on Write|Edit): Claude attempted to Write `invoiceAmount` into src/ --
Write { file_path: "/.../src/tmp-hook-test.ts",
        content: "export const x = { invoiceAmount: 1 };\n" }
PreToolUse:Write hook error:
[$CLAUDE_PROJECT_DIR/scripts/hooks/pre-edit-forbidden-field.sh]:
  lab-s2-3 PreToolUse(Write|Edit): blocked — forbidden field
  'invoiceAmount' targeting /.../src/tmp-hook-test.ts.
  See DOMAIN_MODEL.md § Forbidden in API.
→ tool call refused; file never created.

-- Hook #2 (PostToolUse on Write|Edit): Claude wrote a benign src/ file --
Write { file_path: "/.../src/tmp-hook-bench.ts",
        content: "export const benign = \"lab-s2-3 hook verification — delete me\";\n" }
→ Write succeeded.
PostToolUse fired and ran `npm test --silent --run`; output captured in
/tmp/lab-s2-3-test.out:
 Test Files  1 passed (1)
      Tests  5 passed (5)
lab-s2-3 PostToolUse: tests PASSED.
→ fixture file removed in the same turn to keep the tree clean.

-- Hook #4 (Stop): fires on every session end. --
The standalone invocation in §3 above is the same script and produced the
expected summary; in-harness Stop output is visible at the natural end of
each Claude turn (not captured here because it lands after the turn's
final message).
```

Combined coverage: every Claude Code tool boundary that could touch a forbidden surface in this repo is now intercepted at the harness level. Git remains the second floor.

## 4. Cross-harness equivalence table

The intent translates across harnesses; only the configuration surface changes. Filled below for the two harnesses I'd reach for first, plus the harness-agnostic fallback.

| Harness                         | Where the hook lives                                                                                | One-liner you'd write                                                                                                            |
| ------------------------------- | --------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Claude Code                     | `.claude/settings.json` → `hooks.PreToolUse` / `PostToolUse` / `Stop` block above                  | `"command": "$CLAUDE_PROJECT_DIR/scripts/hooks/pre-edit-forbidden-field.sh"` (one matcher per hook event in the JSON)            |
| Cursor                          | `.cursor/rules/no-invoice-amount.mdc` (an `alwaysApply: true` rule) + a Cursor "Run on save" task   | `alwaysApply: true` rule body: *"Reject any change in `src/**` that introduces `invoiceAmount`; refer to DOMAIN_MODEL.md."* Cursor enforces by prompt; for hard enforcement, pair with the git-hook fallback. |
| OpenCode / Codex CLI / fallback | `.git/hooks/pre-commit` → `scripts/lab-s2-3-wrapper.sh` (`cp scripts/pre-commit.sample .git/hooks/pre-commit && chmod +x .git/hooks/pre-commit`) | `if git diff --cached -- 'src/*' 'src/**/*' | grep -qE '^\+.*invoiceAmount'; then exit 1; fi`                                    |

Take-away from filling the table: Claude Code gives the strongest pre-flight enforcement (PreToolUse can refuse the action before any file is written); Cursor's rule layer relies on agent compliance and should be paired with the git hook; the git hook is the universal floor — every harness commits through git, so the floor is enforceable regardless of editor or model.

## 5. Pass criterion check

- Hooks 1 and 3 each block on at least one provoked attempt (`.env` read; `invoiceAmount` write to `src/`). ✓
- Hook 4 produces a 3+ line summary at session end. ✓
- Cross-harness mini-table filled for Claude Code + one other (Cursor) and the fallback. ✓

## 6. While-you-wait

**1. Second hook from the priority list (sketch).**

If the lab limited me to one and I had to pick the second-most-valuable next, it would be a **`PreToolUse` on `WebFetch` / `Bash(curl|wget)` that blocks egress to anything outside an allow-list** (allow: `npm` registry, `context7`, `modelcontextprotocol.io`; deny: everything else). The class of incident it prevents is OWASP **ASI04 Agentic Supply Chain Vulnerabilities** — an agent that fetches a vendor doc and silently imports a typosquatted package. The other hooks here protect the working tree; this one protects the network boundary.

**2. Which hook would catch each deck failure-mode.**

Without the deck slide in hand, mapping the failure modes used in earlier labs to these four hooks:

| Failure mode (from deck / our labs)                                            | Hook that catches it          |
| ------------------------------------------------------------------------------ | ----------------------------- |
| Agent hallucinates `invoiceAmount` into `GET /accounts`                        | Hook #3 (PreToolUse) + git fallback |
| Agent invents fields like `accountTier` outside `DOMAIN_MODEL.md`              | Not caught by these hooks (handled by `crm-reviewer` Skill — hooks are not domain-aware enough; the analogue would be a much stricter PreToolUse parser of `interface Account`) |
| Agent returns `null` for empty contacts                                        | Not caught by hooks (caught by tests via Hook #2 only if a test asserts `[]`) |
| Agent commits enum-case drift (`closed won`)                                   | Not caught by hooks (caught by tests via Hook #2 only if a test asserts case) |
| Agent reads / exfiltrates `.env`                                               | Hook #1 (PreToolUse Bash) + permissions.deny on Read tool + git fallback |
| Agent edits sub-agent transcript or persists secret to `secrets/`              | Hook #1 + permissions.deny on Write tool + git fallback |
| Agent scope-creeps past the slice                                              | Not caught by hooks (caught by `crm-reviewer` Skill) |
| Agent ends session with uncommitted privacy-violating change                   | Hook #4 (Stop summary) flags `invoiceAmount` / `Opportunity.value` in `src/` |
| Agent skips required tests                                                     | Not caught by hooks; surfaced by Hook #4's HANDOFF-staleness check indirectly |
| Agent fetches malicious vendor blob (ASI04)                                    | Sketch in §6.1 (not implemented in this lab) |

Take-away: hooks are a **floor**, not a ceiling. Domain-aware judgements (hallucinated fields, scope creep, enum-case drift) stay with the reviewer Skill; hooks catch the categorical, easily-pattern-matched violations and the things you cannot afford to leave to vibes.
