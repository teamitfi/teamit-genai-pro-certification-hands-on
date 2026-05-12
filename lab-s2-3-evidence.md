# Lab S2.3 — Safety Hook Evidence

## Hook implemented

**Option 3 — Fail on forbidden fields.**
Two enforcement layers for `invoiceAmount` in `src/`:

1. **Claude Code `PreToolUse` hook** — fires before any `Write` or `Edit` tool call where the target path is under `src/` and the content contains `invoiceAmount`. Blocks at the harness layer before the file is written.
2. **git pre-commit hook** — fires at commit time via `scripts/lab-s2-3-wrapper.sh`. Also blocks `.env` and `secrets/` commits.

## Provocation log

```
$ echo 'const x = { invoiceAmount: 999 };' > src/_hook_test.ts
$ git add src/_hook_test.ts
$ git commit -m "test: should be blocked by hook"
lab-s2-3 hook: refuses to commit forbidden field 'invoiceAmount' in src/ (see DOMAIN_MODEL.md)
```

Commit was blocked. File was removed and staging area was cleaned.

## Cross-harness equivalence table

| Harness | Where this hook lives | One-liner you'd write |
|---|---|---|
| Claude Code | `.claude/settings.json` → `hooks.PreToolUse` | `input=$(cat); echo "$input" \| grep -qE '"file_path".*src/' && echo "$input" \| grep -q 'invoiceAmount' && exit 2 \|\| exit 0` |
| Cursor | `.cursor/rules/*.mdc` instructional rule | "Before writing any file under `src/`, refuse if the content contains the literal string `invoiceAmount`." |
| OpenCode / git fallback | `.git/hooks/pre-commit` + `scripts/lab-s2-3-wrapper.sh` | `cp scripts/pre-commit.sample .git/hooks/pre-commit && chmod +x .git/hooks/pre-commit` |
