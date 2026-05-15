#!/usr/bin/env bash
# Lab S2.3 hook #1 — PreToolUse on Bash.
# Blocks shell commands that read or write .env / .env.* / secrets/.
# Complements .claude/settings.json permissions.deny, which already blocks
# the Read/Write tools but not arbitrary Bash invocations.
#
# Input: JSON on stdin with shape { "tool_input": { "command": "..." } }.
# Output: exit 0 = allow; exit 2 = block (Claude shows stderr to the user).

set -euo pipefail

payload=$(cat)
command=$(printf '%s' "$payload" | sed -n 's/.*"command"[[:space:]]*:[[:space:]]*"\(.*\)".*/\1/p')

if [ -z "$command" ]; then
  exit 0
fi

if printf '%s' "$command" | grep -Eq '(^|[[:space:]/<>|&;`])(\.env(\.[A-Za-z0-9_.-]+)?|secrets/)'; then
  echo "lab-s2-3 PreToolUse(Bash): blocked — command touches .env / secrets/. See DOMAIN_MODEL.md and AGENTS.md § Off-limits files." >&2
  exit 2
fi

exit 0
