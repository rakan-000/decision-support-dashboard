# Power BI Integration Specification
## مواصفات التكامل مع Power BI

**Document:** ARCH-004
**Status:** Draft
**Last Updated:** 2026-05-29

---

## Overview

Power BI reports are embedded within the Executive Decision Support Dashboard using Power BI Embedded. This allows existing Power BI investments to surface within the unified executive interface without rebuilding reports.

---

## Integration Approach

**Method:** Power BI Embedded (App-Owns-Data model)

The dashboard backend authenticates with Power BI service using a service principal, generates embed tokens per user session, and passes them to the frontend Power BI JavaScript SDK.

---

## Authentication Flow

```
User Login
    │
    ▼
Dashboard Backend
    │ (Service Principal credentials)
    ▼
Azure AD ──────► Access Token
    │
    ▼
Power BI REST API
    │ (Generate Embed Token scoped to user role)
    ▼
Frontend (Power BI JS SDK)
    │
    ▼
Embedded Report (read-only, role-filtered)
```

---

## Required Power BI Assets

| Asset | Purpose |
|---|---|
| Power BI Workspace | Hosts all executive reports |
| Service Principal | App authentication to Power BI |
| Embed Token API | Per-session, per-user token generation |
| Row-Level Security (RLS) | Filter data by user's organizational role |

---

## Reports to Embed (Planned)

| Report | Dashboard Module |
|---|---|
| Budget vs Actuals | Budget Overview |
| KPI Scorecard | KPI Monitoring |
| HR Headcount | HR Analytics |
| Procurement Pipeline | Procurement |
| Project Portfolio | Strategic Projects |

---

## Open Items

- [ ] Power BI workspace ID and report IDs
- [ ] Azure AD service principal setup
- [ ] RLS roles aligned with RBAC model
- [ ] Confirm Power BI Premium / Embedded capacity
- [ ] RTL report layout review (Power BI has limited RTL support)
