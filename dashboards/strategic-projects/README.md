# Strategic Projects Dashboard
## لوحة المشاريع الاستراتيجية

**Module:** DASH-02
**Phase:** 3
**Status:** Planned

---

## Purpose

Provides executive visibility into the full portfolio of strategic projects — status, milestones, budget, risks, and owners — drawn from ERPNext Projects module.

---

## Key Widgets (Planned)

| Widget | Data Source | Refresh |
|---|---|---|
| Project portfolio grid (status, % complete) | ERPNext Projects | Hourly |
| Milestone timeline (Gantt-style summary) | ERPNext Tasks | Hourly |
| Overdue milestones list | ERPNext Tasks | Real-time |
| Budget vs. spend per project | ERPNext Finance | Hourly |
| Projects at risk (flagged) | ERPNext + Risk Register | Daily |
| Project owner accountability matrix | ERPNext Projects | Daily |

---

## Target Users

- CEO / Executive Committee
- PMO Director
- Department Heads (own projects visible)

---

## ERPNext Fields Required

- Project: `name`, `status`, `percent_complete`, `expected_end_date`, `project_manager`
- Task: `subject`, `status`, `exp_end_date`, `project`
- Budget: to be mapped in integration spec

---

## Files (To be created in Phase 3)

```
strategic-projects/
├── README.md
├── spec.md
├── wireframe.md
└── data-contracts.md
```
