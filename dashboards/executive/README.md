# Executive Dashboard
## لوحة القيادة التنفيذية

**Module:** DASH-01
**Phase:** 2
**Status:** Planned

---

## Purpose

The top-level command center for C-suite leadership. Provides a single-screen view of organizational health — combining KPI status, strategic project progress, risk posture, budget utilization, and AI-generated insights.

---

## Key Widgets (Planned)

| Widget | Data Source | Refresh |
|---|---|---|
| Organizational KPI summary | ERPNext + KPI module | Hourly |
| Active alerts / threshold breaches | KPI Monitoring | Real-time |
| Strategic projects health | ERPNext Projects | Hourly |
| Budget utilization gauge | ERPNext Finance | Hourly |
| Top risks (by severity) | Risk Register | Daily |
| AI Executive Briefing card | Claude API | Daily |
| Quick-access module navigation | Internal | Static |

---

## Target Users

- CEO
- Executive Committee members
- Board-level reviewers (read-only, limited view)

---

## Design Notes

- Single-page, no scroll on desktop (1920×1080 target)
- Arabic default, English toggle
- High-contrast color scheme for projection/boardroom use
- Print-to-PDF optimized layout

---

## Dependencies

- KPI Monitoring module (DASH-03)
- Risk Register module (DASH-04)
- Budget Overview module (DASH-07)
- AI Insights module (DASH-10)

---

## Files (To be created in Phase 2)

```
executive/
├── README.md              ← this file
├── spec.md                ← detailed widget specifications
├── wireframe.md           ← layout description / link to Figma
└── data-contracts.md      ← exact fields required from each source
```
