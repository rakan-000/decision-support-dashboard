# Functional Requirements
## المتطلبات الوظيفية

**Document:** REQ-001
**Status:** Draft
**Last Updated:** 2026-05-29

---

## FR-01: Authentication & Access Control

| ID | Requirement |
|---|---|
| FR-01-01 | Users must authenticate via SSO (LDAP/OAuth 2.0) |
| FR-01-02 | System must enforce Role-Based Access Control (RBAC) |
| FR-01-03 | Roles: Executive, Director, Manager, Analyst, Admin |
| FR-01-04 | Each dashboard module must support role-level visibility rules |
| FR-01-05 | Session timeout after 30 minutes of inactivity |
| FR-01-06 | All login events must be audit-logged |

---

## FR-02: Executive Dashboard

| ID | Requirement |
|---|---|
| FR-02-01 | Display top-level organizational KPIs at a glance |
| FR-02-02 | Show real-time alerts for KPI thresholds breached |
| FR-02-03 | Provide one-click drill-down to any dashboard module |
| FR-02-04 | Display an AI-generated daily executive summary |
| FR-02-05 | Support bilingual display (Arabic / English toggle) |

---

## FR-03: KPI Monitoring

| ID | Requirement |
|---|---|
| FR-03-01 | Display KPIs organized by department/strategic objective |
| FR-03-02 | Show target, actual, and variance for each KPI |
| FR-03-03 | Color-coded status: Green (on track), Amber (at risk), Red (off track) |
| FR-03-04 | Historical trend chart for each KPI (12-month view) |
| FR-03-05 | Allow KPI owners to add commentary/notes |
| FR-03-06 | Export KPI report to PDF and Excel |

---

## FR-04: Strategic Projects Dashboard

| ID | Requirement |
|---|---|
| FR-04-01 | Display all active strategic projects with status |
| FR-04-02 | Show milestone completion percentage per project |
| FR-04-03 | Highlight overdue milestones with owner |
| FR-04-04 | Portfolio-level budget vs. spend summary |
| FR-04-05 | Integration with ERPNext Projects module |

---

## FR-05: Risk Register

| ID | Requirement |
|---|---|
| FR-05-01 | Display risk matrix (Likelihood × Impact) |
| FR-05-02 | Each risk record: description, owner, mitigation, status |
| FR-05-03 | Filter risks by department, category, severity |
| FR-05-04 | Escalation workflow for critical risks |
| FR-05-05 | Risk trend over time (new, closed, escalated) |

---

## FR-06: Procurement Committee Dashboard

| ID | Requirement |
|---|---|
| FR-06-01 | Show active tenders and approval pipeline |
| FR-06-02 | Vendor performance scorecard |
| FR-06-03 | Procurement cycle time metrics |
| FR-06-04 | Integration with ERPNext Purchase module |
| FR-06-05 | Committee meeting schedule and decisions log |

---

## FR-07: HR Analytics

| ID | Requirement |
|---|---|
| FR-07-01 | Headcount by department, grade, and nationality |
| FR-07-02 | Turnover rate (monthly, quarterly, annual) |
| FR-07-03 | Recruitment pipeline status |
| FR-07-04 | Leave utilization summary |
| FR-07-05 | Performance review cycle completion rate |
| FR-07-06 | PII fields visible to HR role and above only |

---

## FR-08: Budget Overview

| ID | Requirement |
|---|---|
| FR-08-01 | Total budget vs. actuals by cost center |
| FR-08-02 | Monthly expenditure trend |
| FR-08-03 | Budget utilization percentage with forecast |
| FR-08-04 | Variance analysis with drill-down |
| FR-08-05 | Integration with ERPNext Accounts module |

---

## FR-09: Digital Transformation Dashboard

| ID | Requirement |
|---|---|
| FR-09-01 | Track all active digital transformation initiatives |
| FR-09-02 | Show adoption metrics per system/initiative |
| FR-09-03 | ROI tracking for completed initiatives |
| FR-09-04 | Milestone tracker aligned to transformation roadmap |

---

## FR-10: Corporate Communications Dashboard

| ID | Requirement |
|---|---|
| FR-10-01 | Internal communications campaign tracker |
| FR-10-02 | Announcement reach and engagement metrics |
| FR-10-03 | Upcoming events and communications calendar |

---

## FR-11: AI Executive Insights

| ID | Requirement |
|---|---|
| FR-11-01 | Natural language query interface in Arabic and English |
| FR-11-02 | AI-generated weekly executive briefing |
| FR-11-03 | Anomaly detection alerts with AI narrative |
| FR-11-04 | Trend forecasting with confidence intervals |
