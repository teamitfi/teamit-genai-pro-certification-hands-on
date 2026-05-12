## The Run

› use the crm MCP to list our accounts and tell me which one renews soonest


• I’ll pull the seeded CRM accounts through the MCP and compare their renewal dates.

• Called crm.list_accounts({})
  └ [{"id": "11111111-1111-4111-8111-111111111111", "name": "Aurora Logistics Oy", "industry":
        "Logistics", "renewalDate": "2026-08-15", "contacts": [{"id": "c1111111-1111-4111-
        8111-111111111111", "accountId": "11111111-1111-4111-8111-111111111111", "name":
        "Liisa Korhonen", "role": "Procurement Lead", "email":
        "liisa.korhonen@aurora.example"}]}, {"id": "22222222-2222-4222-8222-222222222222",
        "name": "Brahe Maritime Ltd", "industry": "Shippin...

──────────────────────────────────────────────────────────────────────────────────────────────

• Brahe Maritime Ltd renews soonest, on 2026-06-30.

  Accounts returned:

  - Aurora Logistics Oy: 2026-08-15
  - Brahe Maritime Ltd: 2026-06-30
  - Cetus Agri Co-op: no renewal date
  - Draco Energy Holdings: 2026-12-01
  - Equuleus Health Networks: 2026-09-22

## Checklist

I wouldn't let anyone install this MCP, it has no auth and it returns information that is very likely confidential between the CRM user and client org. An MCP like this seems super dangerous, I think it would be best to only run this inside some sort of remote sandbox where the data does it leave the system. But realistically, if user wants the data they can always do that, with or without an MCP. We just do not want to make it very easy, like embedding the MCP next to the public API for this service would probably be a bad idea, some additional screening seems legit to me.

I used Go and the recommended Go SDK to build the MCP. I had to add a .codex/config.toml for this because Codex does not read `.mcp.json` from repo root. Lol.
