# Final certification — 60-second walkthrough

Teamit 6-item client checklist for this lab project. Pass = 5/6. One-line answers.
"I don't know" allowed for at most one item.

---

## 1. Data residency — EU-only inference if we deployed this project

**Prompt.** What would change if the client required EU-only inference for this CRM?

**My final one-liner:**
- For inference switch model enddpoint to EU region. For app hosting, deploy the API and MCP server inside the EU (eg. AWS `eu-north-1`).

---

## 2. Permission & hooks — what blocks a `.env` write today

**Prompt.** What blocks an agent from writing `.env` in this repo today?

**My final one-liner:**
- `.claude/settings.json` -> `permissions.deny` has explicit write/read entries pointing to `.env` and `./secrets/**`
- `PreToolUse(Bash)` hook `scripts/hooks/deny-sensitive-bash.sh` blocks (exits on) any shell commands touching `.env`, `.env.*` and `./secrets/` 
- pre-commit hook also prevents staging `.env` and `secrets/`

---

## 3. Logging — 90-day audit trail

**Prompt.** Where would agent actions be logged for a 90-day audit trail?

**My final one-liner:**
- Transcripts on disk: Claude Code already writes per-project sessions to `~/.claude/projects/<project-slug>/`. Each turn (prompts, tool calls, tool results) is captured as JSON.
- For 90d retention: ship the transcript dir + OTEL stream to centralized storage with a 90-day retention policy. Local disk alone is not durable enough for audit.

---

## 4. MCP whitelist — what's installed, what's vetted

**Prompt.** What MCP servers are installed? Which are vetted?

**My final one-liner:**
- `.mcp.json` in project root (for Claude Code): `crm` which is self-built and vetted by me.
- `.cursor/mcp.json`: `context7` - vetted 3rd-party documentation-fetch tool (installed with Cursor) 

---

## 5. Insurance — "Silent AI" PI exclusion question

**Prompt.** What's the Silent AI PI exclusion question you'd ask the client?

**My final one-liner:**
- *"Does your professional indemnity (PI) policy explicitly cover defects in agent-authored / LLM-generated code, or does it include a silent-AI exclusion or carve-out that could void cover if the deliverable was produced by an AI agent?"*

---

## 6. Incident response — Kyberturvallisuuslaki 124/2025

**Prompt.** Under Kyberturvallisuuslaki 124/2025, who is notified within 24 hours, and who at the client owns that?

**My final one-liner:**
- Traficom / Kyberturvallisuuskeskus (NCSC-FI): Brief notification / early warning within 24h and detailed report withing 72h
- Client's CISO or designated NIS2 "vastuuhenkilö"

---
