# AI Executive Insights Dashboard
## لوحة الرؤى التنفيذية بالذكاء الاصطناعي

**Module:** DASH-10
**Phase:** 5
**Status:** Planned

---

## Purpose

The AI Insights module transforms passive data into active intelligence. It provides executive leadership with natural language querying, automated anomaly detection, trend forecasting, and AI-generated briefings — in Arabic and English.

---

## Key Features (Planned)

| Feature | Arabic | Priority |
|---|---|---|
| Natural language query interface | واجهة الاستعلام باللغة الطبيعية | High |
| AI Executive Briefing (weekly) | الإحاطة التنفيذية الأسبوعية | High |
| Anomaly detection alerts | تنبيهات الكشف عن الشذوذ | High |
| KPI trend forecasting | توقعات مسار المؤشرات | Medium |
| Ask-a-question (ad hoc) | اسأل سؤالاً | High |
| Cross-dashboard AI summary | ملخص ذكي متعدد اللوحات | Medium |

---

## Sample Queries

```
"What is the budget utilization rate for Q2?"
ما نسبة استخدام الميزانية للربع الثاني؟

"Which departments have KPIs in red?"
ما الإدارات التي لديها مؤشرات في الحالة الحمراء؟

"Summarize the top 3 risks this month."
لخّص أهم 3 مخاطر هذا الشهر.

"How many positions are open in HR?"
كم عدد الوظائف الشاغرة في الموارد البشرية؟
```

---

## AI Provider

- **Claude API** (Anthropic) — `claude-sonnet-4-6` or latest
- Arabic + English bilingual responses
- Structured response format: Summary → Findings → Actions

---

## Data Context Passed to AI

- Current user's role and department
- Live KPI snapshot (aggregated, no PII)
- Current alerts and anomalies
- Organization metadata (name, fiscal year, reporting period)

---

## Privacy Guardrails

- No employee names or individual salaries sent to AI
- No confidential contract values sent without anonymization
- All AI queries logged for audit purposes

---

## Files (To be created in Phase 5)

```
ai-insights/
├── README.md
├── spec.md
├── prompt-library.md         ← system prompts and query templates
├── ai-response-schema.md     ← structured output format
├── privacy-guardrails.md
└── data-contracts.md
```
