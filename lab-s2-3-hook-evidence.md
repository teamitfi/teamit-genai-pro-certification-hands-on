| Harness                         | Where this hook lives                                             | One-liner you'd write |
| ------------------------------- | ----------------------------------------------------------------- | --------------------- |
| Claude Code                     | `.claude/settings.json` → `hooks` → `PreToolUse` / `Stop` etc.    | Fully deterministic, implemented with internal claude code hooks      |
| Cursor                          | `.cursorrules` (or `.cursor/rules/*.mdc` instructional rule)      | Not fully deterministic implementation with `.mdc`      |
| OpenCode / Codex CLI / fallback | config wrapper or `.git/hooks/pre-commit` + `lab-s2-3-wrapper.sh` | Fully determistic implementation with a hook managed outside harness      |