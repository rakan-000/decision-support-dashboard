# Risk Register Dashboard
## لوحة سجل المخاطر

**Module:** DASH-04
**Phase:** 3
**Status:** Planned

---

## Purpose

Provides a live, interactive risk register for executive oversight — displaying the risk matrix, top risks, ownership, mitigation status, and trend over time.

---

## Key Widgets (Planned)

| Widget | Data Source | Refresh |
|---|---|---|
| Risk heat map (Likelihood × Impact) | Risk Register DB | On update |
| Top 10 risks list | Risk Register DB | Daily |
| Risks by department | Risk Register DB | Daily |
| Mitigation status tracker | Risk Register DB | On update |
| New/closed/escalated trend chart | Risk Register DB | Weekly |
| Overdue mitigations alert | Calculated | Daily |

---

## Risk Taxonomy (Planned)

| Category | Arabic |
|---|---|
| Strategic | مخاطر استراتيجية |
| Financial | مخاطر مالية |
| Operational | مخاطر تشغيلية |
| Compliance / Legal | مخاطر امتثال وقانونية |
| Reputational | مخاطر سمعة |
| Technology | مخاطر تقنية |

---

## Risk Record Fields

- Risk ID, Title (AR + EN), Description
- Category, Department, Owner
- Likelihood (1–5), Impact (1–5), Risk Score
- Mitigation Plan, Mitigation Owner, Due Date
- Status: Open / In Mitigation / Closed / Escalated

---

## Target Users

- Executive Committee
- Risk Committee
- Department Heads (own risks)
- Internal Audit

---

## Files (To be created in Phase 3)

```
risk-register/
├── README.md
├── spec.md
├── risk-taxonomy.md
├── wireframe.md
└── data-contracts.md
```
