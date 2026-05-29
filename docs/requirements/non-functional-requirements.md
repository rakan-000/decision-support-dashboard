# Non-Functional Requirements
## المتطلبات غير الوظيفية

**Document:** REQ-002
**Status:** Draft
**Last Updated:** 2026-05-29

---

## NFR-01: Performance

| ID | Requirement | Target |
|---|---|---|
| NFR-01-01 | Dashboard initial load time | < 2 seconds (p95) |
| NFR-01-02 | Data refresh time (cached) | < 500ms |
| NFR-01-03 | AI response time | < 8 seconds |
| NFR-01-04 | Concurrent users supported | 200 simultaneous |
| NFR-01-05 | API response time | < 300ms (p95) |

---

## NFR-02: Availability & Reliability

| ID | Requirement | Target |
|---|---|---|
| NFR-02-01 | System uptime | 99.5% monthly |
| NFR-02-02 | Planned maintenance window | Weekends, off-hours |
| NFR-02-03 | Recovery Time Objective (RTO) | < 4 hours |
| NFR-02-04 | Recovery Point Objective (RPO) | < 1 hour |
| NFR-02-05 | Dashboard available when ERPNext is down | Yes (stale cache) |

---

## NFR-03: Security

| ID | Requirement |
|---|---|
| NFR-03-01 | All traffic over TLS 1.3 |
| NFR-03-02 | No sensitive data in browser localStorage |
| NFR-03-03 | API keys and secrets in secrets manager only |
| NFR-03-04 | Full audit log of all data access |
| NFR-03-05 | OWASP Top 10 compliance |
| NFR-03-06 | Penetration test before go-live |

---

## NFR-04: Usability

| ID | Requirement |
|---|---|
| NFR-04-01 | Arabic RTL layout as default for Arabic users |
| NFR-04-02 | Language toggle (Arabic ↔ English) available on all pages |
| NFR-04-03 | WCAG 2.1 AA accessibility compliance |
| NFR-04-04 | Mobile-responsive (tablet minimum) |
| NFR-04-05 | No more than 3 clicks to reach any KPI from the homepage |

---

## NFR-05: Maintainability

| ID | Requirement |
|---|---|
| NFR-05-01 | All components documented |
| NFR-05-02 | Test coverage ≥ 80% for backend services |
| NFR-05-03 | CI/CD pipeline for all environments |
| NFR-05-04 | Environment parity (Dev = Staging = Prod configuration) |
| NFR-05-05 | Dependency updates automated via Dependabot or equivalent |

---

## NFR-06: Scalability

| ID | Requirement |
|---|---|
| NFR-06-01 | Horizontal scaling for API and frontend layers |
| NFR-06-02 | Database connection pooling |
| NFR-06-03 | CDN for static assets |
| NFR-06-04 | Architecture supports adding new dashboard modules without core changes |
