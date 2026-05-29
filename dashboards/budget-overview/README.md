# Budget Overview Dashboard
## لوحة نظرة عامة على الميزانية

**Module:** DASH-07
**Phase:** 2
**Status:** Planned

---

## Purpose

Gives executive leadership a real-time view of budget utilization, expenditure trends, and financial health — integrated with ERPNext Accounts module and Power BI financial reports.

---

## Key Widgets (Planned)

| Widget | Data Source | Refresh |
|---|---|---|
| Total budget vs. actuals (org-wide) | ERPNext Finance | Hourly |
| Budget utilization % by cost center | ERPNext Finance | Hourly |
| Monthly expenditure trend | ERPNext Finance | Daily |
| Top 5 overspent cost centers | Calculated | Daily |
| Forecast vs. budget remaining | ERPNext Finance | Daily |
| Year-to-date variance summary | Calculated | Daily |
| Budget approval pipeline | ERPNext Finance | Real-time |

---

## Financial Dimensions

- By Cost Center (department)
- By Account Type (Opex / Capex)
- By Quarter (Q1–Q4)
- By Project (for project-linked budget)

---

## Target Users

- CFO
- Finance Director
- CEO / Executive Committee
- Department Heads (own budget only)

---

## ERPNext Fields Required

- Budget: `account`, `cost_center`, `budget_amount`, `fiscal_year`
- GL Entry: `account`, `cost_center`, `debit`, `credit`, `posting_date`
- Cost Center: `cost_center_name`, `parent_cost_center`

---

## Files (To be created in Phase 2)

```
budget-overview/
├── README.md
├── spec.md
├── wireframe.md
└── data-contracts.md
```
