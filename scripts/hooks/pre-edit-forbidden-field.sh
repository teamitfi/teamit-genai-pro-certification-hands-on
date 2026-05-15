#!/usr/bin/env bash
# Lab S2.3 hook #3 — PreToolUse on Write|Edit.
# Blocks any attempt to introduce the literal `invoiceAmount` into src/.
# Mirrors scripts/lab-s2-3-wrapper.sh, but at the edit boundary rather than
# at commit time — catches the bad write before it reaches the working tree.
#
# Input: JSON on stdin with shape:
#   Write -> { "tool_input": { "file_path": "...", "content": "..." } }
#   Edit  -> { "tool_input": { "file_path": "...", "new_string": "...", ... } }
# Output: exit 0 = allow; exit 2 = block.

set -euo pipefail

payload=$(cat)

file_path=$(printf '%s' "$payload" | sed -n 's/.*"file_path"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p')

case "$file_path" in
  */src/*|src/*) ;;
  *) exit 0 ;;
esac

# Conservative: if the payload (content / new_string / anywhere in this
# Write|Edit invocation against src/) contains the literal forbidden field,
# block. Catches both Write.content and Edit.new_string without needing to
# parse the JSON shape precisely.
if printf '%s' "$payload" | grep -q 'invoiceAmount'; then
  echo "lab-s2-3 PreToolUse(Write|Edit): blocked — forbidden field 'invoiceAmount' targeting $file_path. See DOMAIN_MODEL.md § Forbidden in API." >&2
  exit 2
fi

exit 0
