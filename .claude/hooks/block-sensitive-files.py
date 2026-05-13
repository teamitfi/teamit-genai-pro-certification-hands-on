#!/usr/bin/env python3
import json
import re
import sys

data = json.load(sys.stdin)
path = data.get("tool_input", {}).get("file_path", "") or ""

if not path:
    sys.exit(0)

PATTERNS = [
    (r"(^|[/\\])\.env($|\.)", ".env file"),
    (r"(^|[/\\])secrets[/\\]", "secrets/ directory"),
    (r"\.prod\.", "*.prod.* production config"),
    (r"(^|[/\\])production\.", "production.* config"),
    (r"(^|[/\\])prod\.", "prod.* config"),
]

for pattern, label in PATTERNS:
    if re.search(pattern, path):
        print(json.dumps({
            "hookSpecificOutput": {
                "hookEventName": "PreToolUse",
                "permissionDecision": "deny",
                "permissionDecisionReason": (
                    f"BLOCKED: '{path}' is a sensitive file ({label}). "
                    "Access to .env files, secrets/, and production configs is denied."
                ),
            }
        }))
        sys.exit(0)

sys.exit(0)
