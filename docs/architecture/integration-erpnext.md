# ERPNext Integration Specification
## مواصفات التكامل مع ERPNext

**Document:** ARCH-003
**Status:** Draft
**Last Updated:** 2026-05-29

---

## Overview

ERPNext is the primary operational data source for the Executive Decision Support Dashboard. This document defines the integration approach, required modules, API endpoints, and data contracts.

---

## ERPNext Modules Required

| Module | Data Used | Dashboard Consumer |
|---|---|---|
| Accounts (Finance) | Budget, GL entries, cost centers | Budget Overview, Executive |
| HR | Headcount, leave, performance | HR Analytics |
| Projects | Project status, milestones, tasks | Strategic Projects |
| Purchase | Purchase orders, vendors, tenders | Procurement |
| Assets | Asset register, depreciation | Budget Overview |
| CRM | Stakeholder interactions | Corporate Communications |

---

## Authentication

- Method: API Key + API Secret (ERPNext token-based auth)
- Tokens stored in: secrets manager (never in code or config files)
- Token rotation: every 90 days
- Permissions: Read-only service account per module

---

## API Endpoints (Planned)

```
GET /api/resource/Budget
GET /api/resource/GL Entry
GET /api/resource/Employee
GET /api/resource/Project
GET /api/resource/Purchase Order
GET /api/resource/Task
GET /api/resource/Leave Allocation
GET /api/method/frappe.desk.reportview.get  (for report data)
```

---

## Webhooks (Planned)

| Event | ERPNext Trigger | Dashboard Action |
|---|---|---|
| Project status change | Project.on_update | Refresh Strategic Projects |
| Purchase order approved | Purchase Order.on_submit | Refresh Procurement |
| Budget exceeded | GL Entry.on_submit | Trigger Risk alert |

---

## Data Mapping

To be detailed in Phase 1. Each dashboard module will have a corresponding field mapping document.

---

## Open Items

- [ ] ERPNext instance URL and environment details
- [ ] Service account creation and API key provisioning
- [ ] Confirm ERPNext version (v13 / v14 / v15)
- [ ] Webhook endpoint security (HMAC signature verification)
- [ ] Data volume estimation per module
