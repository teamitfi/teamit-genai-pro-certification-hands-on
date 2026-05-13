# Lab S2.3 Hook Evidence

## Hook implemented

**Option 3 — Fail on forbidden fields**

Activated the pre-commit fallback hook by copying `scripts/pre-commit.sample` to `.git/hooks/pre-commit`. The hook delegates to `scripts/lab-s2-3-wrapper.sh`, which runs three checks on the staged diff:

1. Refuses commits touching `.env` or `.env.*`
2. Refuses commits touching anything under `secrets/`
3. Refuses commits introducing the literal `invoiceAmount` in `src/`

## Trigger evidence (3-line log)

```
$ git add src/bad-field.ts && git commit -m "test: should be blocked"
lab-s2-3 hook: refuses to commit forbidden field 'invoiceAmount' in src/ (see DOMAIN_MODEL.md)
exit code: 1
```

Staged file `src/bad-field.ts` contained `const invoiceAmount = 999;`. Commit was blocked. File removed and staging cleared.

## Cross-harness equivalence table

| Harness | Where this hook lives | One-liner you'd write |
|---|---|---|
| Claude Code | `.claude/settings.json` → `hooks` → `PreToolUse` on `Write` matcher | `"command": "bash -c 'cat \"$CLAUDE_TOOL_INPUT_FILE_PATH\" 2>/dev/null | grep -q invoiceAmount && echo Blocked: invoiceAmount forbidden >&2 && exit 2 || exit 0'"` |
| Cursor | `.cursor/rules/*.mdc` instructional rule | `Never introduce a field named invoiceAmount in any file under src/. If a diff would add it, stop and tell the user it is a forbidden field per DOMAIN_MODEL.md.` |
| OpenCode / Codex CLI / fallback | `.git/hooks/pre-commit` + `scripts/lab-s2-3-wrapper.sh` | `exec "$(git rev-parse --show-toplevel)/scripts/lab-s2-3-wrapper.sh"` ← this is what we activated |

**Note on Claude Code vs git hook:** The settings.json `deny` rules already block `.env` and `secrets/` reads/writes at the harness level (before any tool call executes). The pre-commit hook adds a second enforcement layer that catches forbidden fields at commit time — independently of which harness is used.
