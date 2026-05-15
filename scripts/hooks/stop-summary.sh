#!/usr/bin/env bash
# Lab S2.3 hook #4 — Stop.
# At session end, print:
#   - list of changed files (git status --short)
#   - any privacy-marker hits in the working tree (invoiceAmount /
#     Opportunity.value exposure / null-as-empty-collection patterns)
#   - reminder if a HANDOFF.md is stale relative to current changes
# Never blocks; informational only. Exit 0.

set -euo pipefail

repo_root=$(git rev-parse --show-toplevel 2>/dev/null || pwd)
cd "$repo_root" || exit 0

echo "── lab-s2-3 Stop summary ────────────────────────────────────────────"

# Changed files
changed=$(git status --short 2>/dev/null || true)
if [ -n "$changed" ]; then
  echo "Changed files:"
  printf '%s\n' "$changed" | sed 's/^/  /'
else
  echo "Changed files: (clean working tree)"
fi

# Privacy markers in src/ (excluding the wrapper that names invoiceAmount on purpose)
echo
echo "Privacy-marker scan (src/):"
if grep -RInE 'invoiceAmount' src 2>/dev/null | grep -v 'scripts/'; then
  echo "  WARNING: 'invoiceAmount' present in src/. See DOMAIN_MODEL.md § Forbidden in API."
else
  echo "  invoiceAmount: clean"
fi
if grep -RInE '\.value' src 2>/dev/null | grep -iE 'opportunity' | head -n 5; then
  echo "  Review the matches above — Opportunity.value must not be exposed in API/UI."
else
  echo "  Opportunity.value exposure: no obvious matches"
fi

# HANDOFF.md staleness
if [ -f HANDOFF.md ]; then
  handoff_mtime=$(date -r HANDOFF.md +%s 2>/dev/null || echo 0)
  newest_src=$(git ls-files -m src tests seeds 2>/dev/null | xargs -I{} stat -f %m "{}" 2>/dev/null | sort -nr | head -n 1 || echo 0)
  if [ "${newest_src:-0}" -gt "${handoff_mtime:-0}" ]; then
    echo
    echo "HANDOFF.md is older than the most recent src/tests/seeds edit — consider refreshing via 'crm-handoff-writer'."
  fi
fi

echo "─────────────────────────────────────────────────────────────────────"
exit 0
