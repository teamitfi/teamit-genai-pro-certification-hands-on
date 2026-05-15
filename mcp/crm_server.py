"""CRM MCP server — Lab S2.4 second-language sketch (Python port).

Mirrors the TypeScript canonical at ``mcp/crm-server.ts``: one read-only
stdio tool ``list_accounts``, empty input schema, seed data projected
through an allow-list so no forbidden fields leak. No write surface.

Not executed in the lab. To run locally a reader would:
    uv add "mcp[cli]>=1.2"
    uv run python mcp/crm_server.py
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from mcp.server.fastmcp import FastMCP

SEEDS_PATH = Path(__file__).resolve().parent.parent / "seeds" / "accounts.json"

# Defensive allow-list — mirrors ALLOWED_ACCOUNT_FIELDS in crm-server.ts.
# Anything in the seed file outside this set is stripped before it leaves
# the process, so a future seed edit cannot accidentally widen the surface.
ALLOWED_ACCOUNT_FIELDS: tuple[str, ...] = (
    "id",
    "name",
    "industry",
    "renewalDate",
    "contacts",
)


def load_accounts() -> list[dict[str, Any]]:
    raw = json.loads(SEEDS_PATH.read_text(encoding="utf-8"))
    if not isinstance(raw, list):
        raise ValueError("seeds/accounts.json is not an array")

    projected: list[dict[str, Any]] = []
    for entry in raw:
        account = {field: entry.get(field) for field in ALLOWED_ACCOUNT_FIELDS}
        # Empty-contacts-as-[] contract — matches the TS server and the
        # Slice 1 REST API: never null, always an array.
        if not isinstance(account.get("contacts"), list):
            account["contacts"] = []
        projected.append(account)
    return projected


mcp = FastMCP("crm")


@mcp.tool(
    name="list_accounts",
    title="List CRM accounts",
    description=(
        "Returns all synthetic CRM accounts with embedded contacts, including "
        "renewalDate so renewal questions can be answered. Read-only; no arguments."
    ),
)
def list_accounts() -> dict[str, list[dict[str, Any]]]:
    """No parameters → empty input schema, matching the TS server."""
    return {"accounts": load_accounts()}


if __name__ == "__main__":
    # FastMCP.run() defaults to stdio transport, equivalent to wiring
    # StdioServerTransport explicitly in the TS server.
    mcp.run()
