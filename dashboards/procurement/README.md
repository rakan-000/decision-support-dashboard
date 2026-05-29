# Procurement Committee Dashboard
## لوحة لجنة المشتريات

**Module:** DASH-05
**Phase:** 3
**Status:** Planned

---

## Purpose

Gives the Procurement Committee and executive leadership full visibility into the procurement pipeline — active tenders, approval stages, vendor performance, and procurement cycle efficiency.

---

## Key Widgets (Planned)

| Widget | Data Source | Refresh |
|---|---|---|
| Tender pipeline (by stage) | ERPNext Purchase | Real-time |
| Purchase orders awaiting approval | ERPNext Purchase | Real-time |
| Procurement spend by category | ERPNext Finance | Hourly |
| Vendor performance scorecard | ERPNext Purchase | Weekly |
| Avg. procurement cycle time | Calculated | Weekly |
| Upcoming committee meetings | Calendar integration | Daily |
| Committee decisions log | Internal | On update |

---

## Target Users

- Procurement Committee members
- CFO / Finance Director
- CEO (summary view)
- Procurement Manager

---

## ERPNext Fields Required

- Purchase Order: `name`, `supplier`, `status`, `grand_total`, `transaction_date`
- Supplier: `supplier_name`, `supplier_group`
- Purchase Invoice: `status`, `outstanding_amount`

---

## Files (To be created in Phase 3)

```
procurement/
├── README.md
├── spec.md
├── wireframe.md
└── data-contracts.md
```
