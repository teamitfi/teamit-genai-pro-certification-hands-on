#!/usr/bin/env bash
# Lab S2.3 hook #2 — PostToolUse on Write|Edit.
# After an edit in src/ or tests/ or seeds/, run `npm test --silent` and
# surface the result. Does not block (exit 0 always); a failing run is
# information for the next turn, not a guillotine.
#
# Input: JSON on stdin with shape { "tool_input": { "file_path": "..." } }.

set -euo pipefail

payload=$(cat)
file_path=$(printf '%s' "$payload" | sed -n 's/.*"file_path"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p')

case "$file_path" in
  *src/*|*tests/*|*seeds/*) ;;
  *) exit 0 ;;
esac

repo_root=$(git rev-parse --show-toplevel 2>/dev/null || pwd)
cd "$repo_root" || exit 0

if [ ! -f package.json ]; then
  exit 0
fi

# Portable timeout (macOS lacks GNU `timeout`; use `gtimeout` if available).
if command -v timeout >/dev/null 2>&1; then
  RUN=(timeout 120 npm test --silent --run)
elif command -v gtimeout >/dev/null 2>&1; then
  RUN=(gtimeout 120 npm test --silent --run)
else
  RUN=(npm test --silent --run)
fi

echo "lab-s2-3 PostToolUse(Write|Edit): file changed under src/|tests/|seeds/ — running 'npm test --silent --run'..."
if "${RUN[@]}" > /tmp/lab-s2-3-test.out 2>&1; then
  tail -n 20 /tmp/lab-s2-3-test.out
  echo "lab-s2-3 PostToolUse: tests PASSED."
else
  status=$?
  tail -n 30 /tmp/lab-s2-3-test.out
  echo "lab-s2-3 PostToolUse: tests FAILED (exit $status). Address before declaring the slice done."
fi

exit 0
