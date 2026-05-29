# System Architecture Overview
## نظرة عامة على معمارية النظام

**Document:** ARCH-001
**Status:** Draft
**Last Updated:** 2026-05-29

---

## Architecture Principles

1. **Arabic-First** — RTL layout, Arabic typography, and bilingual content are non-negotiable requirements, not afterthoughts.
2. **API-Driven** — All data is consumed via APIs; no direct database queries from the frontend.
3. **Integration-Ready** — ERPNext, Power BI, and AI assistant integrations are first-class citizens in the architecture.
4. **Role-Based** — Every view, widget, and data field is governed by RBAC.
5. **Observable** — Full logging, tracing, and alerting at every layer.
6. **Secure by Default** — TLS everywhere, secrets management, audit trails.

---

## System Layers

```
┌──────────────────────────────────────────────────────────────┐
│                     PRESENTATION LAYER                        │
│          Executive Dashboard UI (Arabic RTL / LTR)           │
│         (Web App — React/Next.js or Vue + Vite)              │
└───────────────────────────┬──────────────────────────────────┘
                            │ HTTPS / REST / WebSocket
┌───────────────────────────▼──────────────────────────────────┐
│                      API GATEWAY LAYER                        │
│         Authentication · Rate Limiting · Routing             │
│              Role-Based Access Control (RBAC)                │
└──────┬───────────────────┬────────────────────┬──────────────┘
       │                   │                    │
┌──────▼──────┐   ┌────────▼────────┐  ┌───────▼──────────────┐
│  ERPNext    │   │   Power BI      │  │   AI Insights        │
│  Connector  │   │   Connector     │  │   Engine             │
│             │   │                 │  │   (Future Phase)     │
└──────┬──────┘   └────────┬────────┘  └───────┬──────────────┘
       │                   │                    │
┌──────▼───────────────────▼────────────────────▼──────────────┐
│                    DATA INTEGRATION LAYER                     │
│              ETL Pipelines · Data Cache · Queue               │
└──────────────────────────────────────────────────────────────┘
```

---

## Technology Stack (Recommended — Pending Final Decision)

| Layer | Technology | Rationale |
|---|---|---|
| Frontend | Next.js (React) | SSR, i18n, strong RTL ecosystem |
| Styling | Tailwind CSS | Utility-first, RTL plugin available |
| API Gateway | Node.js / FastAPI | Lightweight, async-friendly |
| ERPNext Integration | ERPNext REST API v2 | Native Frappe API |
| Power BI Integration | Power BI Embedded SDK | Microsoft-supported embed |
| Data Cache | Redis | Low-latency dashboard data |
| Background Jobs | Celery / BullMQ | Async ETL scheduling |
| AI Layer | Anthropic Claude API | Arabic NLP, executive summaries |
| Auth | OAuth 2.0 / JWT | Industry standard, RBAC-compatible |
| Infrastructure | Docker + Kubernetes | Cloud-agnostic deployment |

---

## Data Flow

See [data-flow.md](data-flow.md) for detailed sequence diagrams.

---

## Integration Points

| System | Type | Direction | Frequency |
|---|---|---|---|
| ERPNext | REST API | Pull | Real-time + Scheduled |
| Power BI | Embed SDK + REST | Pull | Real-time |
| AI Assistant | LLM API | Request/Response | On-demand |
| LDAP / SSO | Auth Protocol | Auth only | Per session |

---

## Security Architecture

See [security architecture](../../infrastructure/security/security-architecture.md).

---

## Related Documents

- [Data Flow](data-flow.md)
- [ERPNext Integration](integration-erpnext.md)
- [Power BI Integration](integration-powerbi.md)
- [AI Integration](integration-ai.md)
- [ADR-001 — Technology Stack](../decisions/ADR-001-tech-stack.md)
