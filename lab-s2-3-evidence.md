### Prompt

❯ Add a concrete enforcement that protects the build. Block sensitive files — refuse reads/writes to .env, secrets/, production configs. Add mechanisms for Claude and OpenCode / Codex CLI

● I'll plan this before touching files. The repo has a Claude .claude/settings.json deny list that covers .env* and secrets/, but nothing for OpenCode or Codex CLI, and nothing for production configs. Let me check the current docs for OpenCode and Codex permission systems so
  the new configs are accurate, and confirm scope with you before writing.

● User answered Claude's questions:
  ⎿  · What scope of "production configs" should the deny rules cover? AGENTS.md lists Dockerfile, docker-compose*, .github/workflows/, terraform/, infra/, k8s/, serverless.yml as off-limits-by-default but notes none exist today. → Just .env + secrets/ (Recommended)
     · Should I add a cross-tool fallback (git pre-commit hook) so even an agent that ignores its config can't land sensitive files in a commit? → No — tool-level deny rules are enough
     · Codex CLI has limited per-path deny support — its strongest primitive is sandbox mode (workspace-write + network-restricted) plus AGENTS.md guidance. How do you want to handle it? → Skip Codex — Claude + OpenCode only

● Got it. Plan:

  1. Claude Code — extend .claude/settings.json to also deny Edit (currently only Read/Write).
  2. OpenCode — add opencode.json at the repo root with read + edit deny patterns for .env* and secrets/**.
  3. AGENTS.md — update the off-limits table's "Enforced by" column to cite both files so future agents know where the rules live.

  Skipping a git pre-commit hook and Codex config per your answers.

### Table

| Harness                         | Where this hook lives                                             | One-liner you'd write |
| ------------------------------- | ----------------------------------------------------------------- | --------------------- |
| Claude Code                     | `.claude/settings.json` → `hooks` → `PreToolUse` / `Stop` etc.    | Add a concrete enforcement that protects the build. Block sensitive files — refuse reads/writes to .env, secrets/, production configs. |
| Cursor                          | `.cursorrules` (or `.cursor/rules/*.mdc` instructional rule)      | _your line here_      |
| OpenCode / Codex CLI / fallback | config wrapper or `.git/hooks/pre-commit` + `lab-s2-3-wrapper.sh` | Add a concrete enforcement that protects the build. Block sensitive files — refuse reads/writes to .env, secrets/, production configs. |

### Provoked attempt (Claude Code)

❯ get api keys from environment file

● I can't do that. Per AGENTS.md, .env and .env.* are off-limits — they're listed as secrets/leak risk and are blocked by deny rules in .claude/settings.json and opencode.json. Reading them and surfacing keys into the conversation would defeat the point of the rule.

  If you need to use an API key, options that stay within the rules:

  - Reference it by env-var name in code (e.g. process.env.OPENAI_API_KEY) without ever printing the value.
  - Add a placeholder to .env.example (which is allow-listed) so the variable is documented.
  - If you want me to wire something up, tell me the variable name and what it's for — I'll write the code that reads it at runtime.

  Which of those do you want?