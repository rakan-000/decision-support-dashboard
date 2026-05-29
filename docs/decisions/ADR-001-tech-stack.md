# ADR-001: Technology Stack Selection
## قرار معماري: اختيار المكدس التقني

**Status:** Proposed
**Date:** 2026-05-29
**Deciders:** Enterprise Architect, Tech Lead, PM

---

## Context

We need to select a technology stack for the Executive Decision Support Dashboard that satisfies:
- Arabic RTL as a first-class feature
- ERPNext and Power BI integration
- Enterprise-grade security and scalability
- Future AI assistant integration
- Maintainability by the internal team

---

## Decision

**Frontend:** Next.js (React) with Tailwind CSS + RTL plugin
**Backend / API Gateway:** Node.js (Express or Fastify) or Python (FastAPI) — to be finalized
**Cache:** Redis
**Auth:** OAuth 2.0 / JWT via existing identity provider
**AI:** Anthropic Claude API
**Infrastructure:** Docker containers, cloud-hosted (provider TBD)

---

## Rationale

| Option | Considered | Outcome |
|---|---|---|
| Next.js (React) | Yes | ✅ Selected — strong i18n, RTL ecosystem, SSR |
| Vue 3 + Vite | Yes | Viable alternative, weaker RTL ecosystem |
| Angular | Yes | Rejected — heavier, fewer Arabic RTL resources |
| FastAPI (Python) | Yes | ✅ Strong candidate for backend if Python team preferred |
| Node.js (Express) | Yes | ✅ Strong candidate for backend if JS full-stack preferred |
| Django | Yes | Rejected — heavier framework for API gateway use case |

---

## Consequences

**Positive:**
- Next.js has a mature Arabic/RTL community
- React ecosystem has Power BI Embedded SDK support
- Claude API has strong Arabic capability

**Negative:**
- Team may need React/Next.js training if primarily Python-focused
- Backend language decision still open — needs team skills assessment

---

## Open Questions

- [ ] What is the primary backend team's language preference (Python vs JS)?
- [ ] Is there an existing identity provider for SSO, or do we build auth from scratch?
- [ ] Cloud provider preference (Azure aligns with Power BI; AWS is more general)?

---

## Review Date

This ADR should be reviewed and finalized by end of Phase 0 (Week 2).
