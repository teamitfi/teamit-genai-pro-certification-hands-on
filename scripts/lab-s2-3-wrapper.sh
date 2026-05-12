#!/usr/bin/env bash
# Lab S2.3 — pre-commit guard (harness-agnostic fallback).
#
# Activate by copying the sample hook:
#   cp .git/hooks/pre-commit.sample .git/hooks/pre-commit
#   chmod +x .git/hooks/pre-commit
#
# Three checks, all on the staged diff:
#   1. Refuses commits that touch .env or .env.* files.
#   2. Refuses commits that touch anything under secrets/.
#   3. Refuses commits that introduce the literal `invoiceAmount` in src/.

set -euo pipefail

fail() {
  echo "lab-s2-3 hook: $1" >&2
  exit 1
}

staged=$(git diff --cached --name-only --diff-filter=ACMR)

while IFS= read -r path; do
  [ -z "$path" ] && continue
  case "$path" in
    .env|.env.*)
      fail "refuses to commit .env file: $path"
      ;;
    secrets/*)
      fail "refuses to commit anything under secrets/: $path"
      ;;
  esac
done <<< "$staged"

if git diff --cached -- 'src/*' 'src/**/*' 2>/dev/null | grep -qE '^\+.*invoiceAmount'; then
  fail "refuses to commit forbidden field 'invoiceAmount' in src/ (see DOMAIN_MODEL.md)"
fi

exit 0
