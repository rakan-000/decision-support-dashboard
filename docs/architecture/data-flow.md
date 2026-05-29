# Data Flow Architecture
## تدفق البيانات

**Document:** ARCH-002
**Status:** Draft
**Last Updated:** 2026-05-29

---

## Overview

This document describes how data moves through the Executive Decision Support Dashboard — from source systems through the integration layer to the presentation layer.

---

## Primary Data Flow

```
Source Systems          Integration Layer        Presentation Layer
──────────────          ─────────────────        ──────────────────

ERPNext ──────────────► ERPNext Connector ──┐
                                            │
Power BI ────────────► Power BI Connector ──┼──► Data Cache ──► Dashboard UI
                                            │      (Redis)
External APIs ──────► API Adapter ──────────┘
                                            │
                       ETL Scheduler ───────┘
                       (Nightly/Hourly)
```

---

## Data Refresh Strategy

| Data Type | Source | Refresh Rate | Method |
|---|---|---|---|
| Budget vs Actuals | ERPNext Finance | Hourly | Scheduled pull |
| HR Headcount | ERPNext HR | Daily | Scheduled pull |
| Project Status | ERPNext Projects | Real-time | Webhook |
| Procurement Status | ERPNext Purchase | Real-time | Webhook |
| KPI Values | ERPNext + Manual | Daily | Scheduled pull + API |
| Risk Register | Manual / ERPNext | On update | Webhook |
| Power BI Reports | Power BI Service | On-demand | Embed token refresh |
| AI Insights | Claude API | On-demand | Request/Response |

---

## Caching Strategy

- **Hot data** (viewed >10x/day): cached in Redis, TTL = 15 minutes
- **Warm data** (daily dashboards): cached in Redis, TTL = 1 hour
- **Cold data** (historical reports): no cache, fetched on demand
- **AI responses**: cached per query hash, TTL = 24 hours

---

## Data Governance

- All data in transit: TLS 1.3
- All data at rest: AES-256 encrypted
- PII fields (HR data): masked for non-HR roles
- Full field-level audit log for sensitive data access

---

## Error Handling

| Scenario | Behavior |
|---|---|
| ERPNext unreachable | Serve stale cached data with staleness indicator |
| Power BI token expired | Auto-refresh token, transparent to user |
| AI API timeout | Show fallback static insight card |
| ETL pipeline failure | Alert to ops team, dashboard shows last-known-good data |
