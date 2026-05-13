# Market Requirements Document: Kielo Digital CRM

_Status: Draft v0.1_
_Audience: product owners, account managers, delivery leads, sales operations, and engineering teams responsible for building or evolving this CRM._
_Fictional company: Kielo Digital Oy, a Finnish SME IT consultancy._

> **Document context.** Kielo Digital Oy and every customer, contact, opportunity, and renewal scenario referenced here are fictional. This MRD provides upstream product context for the Teamit GenAI Pro Certification hands-on labs; `PRODUCT_BRIEF.md` remains the shorter agent-readable boundary used during implementation.

## 1. Purpose

This MRD describes a small, privacy-aware CRM for Kielo Digital Oy. It explains who the CRM is for, why it matters, which workflows are core, and what is intentionally out of scope.

It is **not** an implementation plan, technical specification, architecture document, or data model. Use `PRODUCT_BRIEF.md` for the concise product boundary, `BUILD_PLAN.md` for slice order, `DOMAIN_MODEL.md` for entity contracts, and `ARCHITECTURE.md` for technical boundaries when needed.

## 2. Executive summary

Kielo Digital Oy is a fictional Finnish IT consultancy serving B2B customers across Finland. The company sells consulting projects, cloud and data advisory, software delivery, integration work, and ongoing maintenance or renewal-based services.

As the company grows, customer knowledge is spread across emails, spreadsheets, meeting notes, and individual consultants' memories. Account managers need a shared, privacy-aware view of customers, contacts, opportunities, recent activity, and renewal risk.

The desired CRM should be much simpler than Salesforce, HubSpot, or Microsoft Dynamics. It should focus on a few core account-management workflows that can be understood, built, reviewed, and demonstrated within a short training session using agentic coding.

## 3. Business background

Kielo Digital Oy is an SME consultancy with roughly 40-60 employees. Its work is relationship-led and project-based rather than high-volume transactional sales.

Typical customers include:

- Finnish SMEs modernising internal systems or integrations.
- SaaS and product companies needing senior engineering capacity.
- Manufacturing and logistics companies improving data flows.
- Public-sector or semi-public organisations running tenders or framework-based purchases.
- Existing customers considering renewals, maintenance, or expansion work.

Typical services include:

- Discovery workshops and technical assessments.
- Custom software delivery.
- Cloud, data, AI-readiness, and integration advisory.
- Team augmentation with senior consultants.
- Maintenance, support retainers, and renewal-based engagements.

The sales motion is consultative. Trust, timing, previous delivery history, and the next follow-up often matter more than high-volume lead generation.

## 4. Market problem

Kielo Digital's account-management work suffers from five common problems:

1. **Customer context is fragmented.** People know useful details, but the organisation lacks a shared view.
2. **Follow-ups are easy to miss.** Important customer conversations can stall when ownership is unclear or notes are buried.
3. **Pipeline status is inconsistent.** Leaders struggle to understand which opportunities are active, stuck, won, or lost.
4. **Renewals can surprise the team.** Existing customers may need attention before a renewal or extension date, but the risk is not visible early enough.
5. **Trust in customer data is uneven.** Users need confidence that the CRM contains only relevant, synthetic or approved information and does not expose sensitive business data.

## 5. Product vision

Create a simple CRM that helps a Finnish IT consultancy maintain shared customer memory and make better account-management decisions.

The CRM should help users answer five questions:

1. Who are our customers?
2. Who should we contact next?
3. Which opportunities are moving?
4. Which renewals are at risk?
5. What changed, and can we trust it?

## 6. Product principles

- **Account-manager first.** Optimise for the daily work of account managers, not enterprise CRM administrators.
- **Shared context over automation.** The first goal is reliable visibility, not complex workflow automation.
- **Small enough to deliver in vertical slices.** The product must be understandable and buildable one slice at a time, so a small team can plan, implement, review, and demo a single account-management capability end to end.
- **Privacy-aware by default.** Treat B2B contact information as personal data and keep the demo context synthetic.
- **Not a Salesforce clone.** Use familiar CRM concepts, but avoid enterprise-suite complexity.
- **Evidence over magic.** Users should be able to explain what they see and why it matters without relying on vague AI features.

## 7. User personas

### Persona 1: Sari Lehtonen, Account Manager

**Role:** Owns relationships with 15-25 customer accounts.
**Goal:** Know where each customer relationship stands and what action should happen next.
**Pain points:** Follow-ups are scattered across email and notes; opportunity status is hard to compare; renewal risks appear too late.
**Success looks like:** Sari can quickly prepare for a customer meeting, see active opportunities, and identify accounts needing attention.

### Persona 2: Mikko Korhonen, Managing Director

**Role:** Leads the consultancy and reviews sales health with the team.
**Goal:** Understand customer coverage, active opportunities, and renewal exposure without micromanaging each account.
**Pain points:** Pipeline discussions rely on verbal updates; different people use different terminology; leadership visibility depends on manual summaries.
**Success looks like:** Mikko can run a short weekly review using a shared view of customers, opportunities, and risk signals.

### Persona 3: Aino Virtanen, Delivery Lead / Senior Consultant

**Role:** Leads client delivery and notices expansion or risk signals during project work.
**Goal:** Share relevant delivery context with account managers without becoming a full-time CRM user.
**Pain points:** Delivery knowledge stays in project channels; sales may not know about changing stakeholder priorities or satisfaction concerns.
**Success looks like:** Aino can contribute concise account activity context that helps the commercial team follow up appropriately.

### Persona 4: Olli Rantanen, Sales Coordinator / Operations

**Role:** Keeps customer records tidy and helps prepare sales meetings.
**Goal:** Maintain clean, consistent CRM information for the account team.
**Pain points:** Duplicate or unclear customer records create confusion; sensitive or irrelevant data may be copied into shared tools.
**Success looks like:** Olli can help the team trust that CRM information is current, relevant, and safe for the training context.

### Persona 5: Laura Niemi, Customer Decision Maker

**Role:** CTO, COO, product leader, or procurement stakeholder at a customer organisation.
**Goal:** Work with a consultancy that remembers context, follows up professionally, and respects privacy.
**Pain points:** Vendors forget previous discussions, repeat discovery questions, or contact the wrong stakeholder.
**Success looks like:** Laura experiences Kielo Digital as coordinated, respectful, and well-prepared.

## 8. Core workflows

### 8.1 Understand customer relationships

Users need a clear view of customer organisations and relevant business contacts so they can understand existing relationships before taking action.

### 8.2 Prepare the next follow-up

Users need to see recent activity and identify which customer relationship needs attention next. The CRM should support professional follow-up, not mass marketing.

### 8.3 Review opportunity movement

Users need to understand which consulting opportunities are early, qualified, proposed, won, or lost. The emphasis is on visibility and shared language, not advanced forecasting.

### 8.4 Identify renewal risk

Users need to spot existing customer relationships that may require attention before renewal or continuation decisions. Renewal risk should be easy to explain from visible business context.

### 8.5 Build trust in the CRM

Users and training participants need to know that the CRM uses synthetic data, avoids forbidden sensitive information, and stays within the agreed product boundary.

## 9. High-level market requirements

### MR-1: Shared customer memory

The CRM must give account teams a shared view of customer organisations and the people connected to them.

### MR-2: Relationship activity awareness

The CRM must help users understand recent customer interactions and where follow-up may be needed.

### MR-3: Opportunity pipeline visibility

The CRM must make active and closed opportunities visible using simple, consistent stages that a small consultancy can understand.

### MR-4: Renewal-risk awareness

The CRM must help account managers notice customer relationships that may need attention before a renewal or continuation decision.

### MR-5: Privacy-safe training context

The CRM must use synthetic demo data and avoid exposing production customer data, sensitive personal data, invoice amounts, or hidden integrations.

### MR-6: Simple enough for agentic delivery

The CRM must remain small enough that participants can plan, build, review, and explain each vertical slice within a short hands-on session.

### MR-7: Clear product boundaries

The CRM must make its non-goals explicit so coding agents and participants do not expand the product into a full enterprise CRM suite.

## 10. In scope for the training CRM

The training CRM is expected to cover:

- Customer and contact context for account managers.
- Simple opportunity pipeline visibility.
- Activity history for relationship follow-up.
- Renewal-risk awareness for existing customers.
- Synthetic demo data that resembles a Finnish B2B consultancy context.
- Behavioural acceptance evidence showing that the core user questions can be answered.

## 11. Out of scope

The CRM is not intended to include:

- A Salesforce, HubSpot, or Microsoft Dynamics clone.
- Marketing automation, campaigns, lead scoring, or mass email tooling.
- Customer support ticketing or helpdesk workflows.
- Quotes, invoices, payments, payroll, ERP, or accounting workflows.
- Resource planning, time tracking, or HR management.
- Complex permissions, territories, enterprise administration, or marketplace extensions.
- Production customer data or hidden external integrations.
- Vague AI features that cannot be explained or verified in the training context.

## 12. Privacy and trust expectations

The CRM should model responsible handling of customer relationship information:

- Use synthetic data in training and demos.
- Treat names, work emails, roles, notes, and activity history as personal data when they identify a person.
- Keep information business-relevant and avoid sensitive personal details.
- Do not expose invoice amounts or other unnecessary commercial details in user-facing views.
- Keep communication context respectful and relevant to B2B relationships.
- Make it clear when information is demo data rather than real customer data.

## 13. Success criteria for this MRD

This MRD is successful if a reader (human or agent) can use it to:

- Explain the company context and why it needs a CRM.
- Identify the primary users and their goals.
- Distinguish the CRM's core scope from enterprise CRM features.
- Plan vertical slices without inventing unrelated product areas.
- Demonstrate the five core account-management questions against the built CRM.
- Review proposed work against clear product boundaries and privacy expectations.

## 14. Example user scenarios

### Scenario A: Preparing for a customer meeting

An account manager is meeting a manufacturing customer next week. They need to understand who the key contacts are, what recent interactions have happened, and whether any opportunity or renewal topic should be discussed.

### Scenario B: Weekly pipeline review

The managing director asks the account team which opportunities are progressing, which are stalled, and which have recently been won or lost. The team needs a shared language for the discussion.

### Scenario C: Renewal-risk check

A customer has an upcoming renewal or continuation decision. The account manager needs to know whether the relationship has been active recently and whether follow-up is needed.

### Scenario D: Delivery insight becomes commercial context

A delivery lead learns that a customer may need additional integration work. The CRM should help that context reach the account manager without turning delivery work into a complex sales process.

### Scenario E: Product-boundary review

A coding agent proposes adding invoicing, AI recommendations, or external integrations. Participants should be able to reject that expansion using this MRD.

## 15. Glossary

- **Account / customer:** A company or organisation Kielo Digital has, had, or may have a business relationship with.
- **Contact:** A business person connected to an account.
- **Opportunity:** A potential consulting engagement, extension, tender, or project conversation.
- **Pipeline:** The shared view of opportunities by their current business stage.
- **Activity:** A customer interaction such as a call, email, meeting, or note.
- **Renewal risk:** A signal that an existing customer relationship may need attention before a renewal or continuation decision.
- **Synthetic data:** Fictional data used for training, demos, and tests instead of real customer information.
- **Agentic coding:** Using coding agents to plan, implement, review, and refine small product slices under clear human-defined boundaries.

## 16. Open assumptions

- The company, users, customers, and scenarios in this document are fictional.
- The MRD is intentionally narrower than a commercial CRM product.
- Implementation work is governed by stricter, authoritative documents in the repo (`PRODUCT_BRIEF.md`, `BUILD_PLAN.md`, `DOMAIN_MODEL.md`). Where they conflict with this MRD, those documents win for implementation decisions.
- When in doubt about whether a feature belongs in scope, prefer the simpler interpretation and ask whether it helps answer one of the five core CRM questions.
