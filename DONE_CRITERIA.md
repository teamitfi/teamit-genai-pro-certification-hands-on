# Slice 2: Opportunity Pipeline — Done Criteria

A slice is complete only when all five boxes are checked and evidence is attached.

---

- [ ] **1. UI flow recorded on synthetic data**
  Screenshot or screen recording shows `GET /opportunities` response in a browser or API client (e.g. curl / Postman), with opportunities visibly grouped by stage using data from `seeds/opportunities.json`. No real customer data visible.

- [ ] **2. Named tests passing**
  `tests/opportunities.spec.ts` passes in full:
  - `GET /opportunities returns seeded rows grouped by stage`
  - `stage keys are case-sensitive enum values`
  - `GET /opportunities/:id returns correct row`
  - `GET /opportunities/:id returns 404 for unknown id`
  - `response objects do not contain a value field`
  Attach `npm test` output showing all five assertions green.

- [ ] **3. No real customer data in src/ or seeds/**
  Run: `grep -r --include="*.ts" --include="*.json" -i "invoiceAmount\|\.value" src/ seeds/`
  Result must be empty (zero matches). Confirm with output.

- [ ] **4. DOMAIN_MODEL.md up to date**
  No new fields were introduced in this slice, so no changes needed. If any field was added during implementation, `DOMAIN_MODEL.md` must be updated and the commit body must explain why.

- [ ] **5. HANDOFF.md written**
  Run the `crm-handoff-writer` skill after committing. The HANDOFF.md must name: files changed, test status, any open risks, and the recommended next slice (Slice 3: Activity Timeline).
