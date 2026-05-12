#!/usr/bin/env bash
# Lab S2.3 — pre-commit guard (harness-agnostic fallback).
#
# Activate the tracked hook:
#   git config --local core.hooksPath scripts/git-hooks
#
# Checks, all on the staged diff:
#   1. Refuses commits that touch blocked sensitive paths.
#   2. Refuses commits that introduce the literal `invoiceAmount` in src/.

set -euo pipefail

fail() {
  echo "lab-s2-3 hook: $1" >&2
  exit 1
}

repo_root="$(git rev-parse --show-toplevel)"

"$repo_root/scripts/sensitive-file-guard.sh" --staged

if git diff --cached -- 'src/*' 'src/**/*' 2>/dev/null | grep -qE '^\+.*invoiceAmount'; then
  fail "refuses to commit forbidden field 'invoiceAmount' in src/ (see DOMAIN_MODEL.md)"
fi

exit 0
