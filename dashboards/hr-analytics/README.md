# HR Analytics Dashboard
## لوحة تحليلات الموارد البشرية

**Module:** DASH-06
**Phase:** 4
**Status:** Planned

---

## Purpose

Provides HR leadership and executive management with a clear view of workforce metrics — headcount, turnover, recruitment, leave, and performance — drawn from the ERPNext HR module.

---

## Key Widgets (Planned)

| Widget | Data Source | Refresh |
|---|---|---|
| Total headcount (by dept / grade) | ERPNext HR | Daily |
| Turnover rate (monthly/annual) | ERPNext HR | Monthly |
| Nationality breakdown | ERPNext HR | Weekly |
| Recruitment pipeline (open positions) | ERPNext HR | Daily |
| Leave utilization by department | ERPNext HR | Daily |
| Performance review completion % | ERPNext HR | Weekly |
| Headcount trend (12 months) | ERPNext HR | Monthly |
| New hires vs. leavers chart | ERPNext HR | Monthly |

---

## Privacy & Access Control

- Employee names and individual salaries: **HR Director and above only**
- Aggregated and anonymized data: visible to all executive roles
- No employee-level data exported without HR Director approval

---

## Target Users

- HR Director
- CEO / Executive Committee (aggregated view only)
- Department Heads (own department only)

---

## ERPNext Fields Required

- Employee: `department`, `designation`, `gender`, `nationality`, `date_of_joining`, `status`
- Leave Allocation: `leave_type`, `total_leaves_allocated`, `total_leaves_encashed`
- Appraisal: `status`, `department`

---

## Files (To be created in Phase 4)

```
hr-analytics/
├── README.md
├── spec.md
├── privacy-controls.md    ← field-level visibility rules
├── wireframe.md
└── data-contracts.md
```
