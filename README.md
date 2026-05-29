# Executive Decision Support Dashboard
## لوحة دعم القرار التنفيذي

> An enterprise-grade, Arabic-first decision support platform for executive leadership — integrating KPIs, strategic projects, risk, procurement, HR, budget, and AI-driven insights into a unified command center.

---

## Overview

The **Executive Decision Support Dashboard** is a centralized intelligence platform designed for C-suite and senior leadership. It consolidates data from ERP systems, financial platforms, HR systems, and project management tools into a single real-time view — enabling faster, evidence-based decisions.

The platform is built with Arabic RTL (Right-to-Left) support as a first-class requirement, designed for organizations operating in Arabic-speaking environments.

---

## Platform Modules

| Module | Arabic | Status |
|---|---|---|
| Executive Dashboard | لوحة القيادة التنفيذية | Planned |
| Strategic Projects Dashboard | لوحة المشاريع الاستراتيجية | Planned |
| KPI Monitoring | مؤشرات الأداء الرئيسية | Planned |
| Risk Register | سجل المخاطر | Planned |
| Procurement Committee Dashboard | لوحة لجنة المشتريات | Planned |
| HR Analytics | تحليلات الموارد البشرية | Planned |
| Budget Overview | نظرة عامة على الميزانية | Planned |
| Digital Transformation Dashboard | لوحة التحول الرقمي | Planned |
| Corporate Communications Dashboard | لوحة الاتصالات المؤسسية | Planned |
| AI Executive Insights | الرؤى التنفيذية بالذكاء الاصطناعي | Planned |

---

## Key Capabilities

- **Arabic RTL Support** — Full right-to-left layout, Arabic typography, bilingual content
- **ERPNext Integration** — Live data feeds from ERPNext modules (Finance, HR, Projects, Procurement)
- **Power BI Integration** — Embed and extend Power BI reports within the unified dashboard
- **AI Assistant Ready** — Architecture designed for future AI assistant and NLP query layer
- **Role-Based Access Control** — Executive, Director, Manager, and Analyst permission tiers
- **Mobile Responsive** — Optimized for tablets and executive mobile use

---

## Repository Structure

```
decision-support-dashboard/
├── docs/                        # Architecture, requirements, and ADRs
│   ├── architecture/            # System design documents
│   ├── requirements/            # Functional & non-functional requirements
│   └── decisions/               # Architecture Decision Records (ADRs)
├── dashboards/                  # One folder per dashboard module
│   ├── executive/
│   ├── strategic-projects/
│   ├── kpi-monitoring/
│   ├── risk-register/
│   ├── procurement/
│   ├── hr-analytics/
│   ├── budget-overview/
│   ├── digital-transformation/
│   ├── corporate-communications/
│   └── ai-insights/
├── integrations/                # Integration specifications and connectors
│   ├── erpnext/
│   ├── powerbi/
│   └── ai-assistant/
├── design/                      # UX, RTL guidelines, branding
│   ├── ux/
│   ├── rtl/
│   └── branding/
└── infrastructure/              # Deployment, security, monitoring
    ├── deployment/
    ├── security/
    └── monitoring/
```

---

## Integration Architecture

```
┌─────────────────────────────────────────────┐
│         Executive Decision Dashboard         │
│              (Unified Interface)             │
└────────────┬────────────────────┬────────────┘
             │                    │
    ┌────────▼────────┐  ┌───────▼────────┐
    │   ERPNext API   │  │  Power BI API  │
    │  (Finance, HR,  │  │  (Reports &    │
    │  Projects, PO)  │  │   Analytics)   │
    └────────┬────────┘  └───────┬────────┘
             │                    │
    ┌────────▼────────────────────▼────────┐
    │          Data Integration Layer       │
    │        (ETL / API Gateway)            │
    └────────────────────┬─────────────────┘
                         │
              ┌──────────▼──────────┐
              │   AI Insights Layer  │
              │  (Future: LLM/NLP)   │
              └─────────────────────┘
```

---

## Roadmap

See [ROADMAP.md](ROADMAP.md) for the full phased delivery plan.

## Architecture

See [docs/architecture/system-overview.md](docs/architecture/system-overview.md) for the full system architecture.

---

## Project Status

**Current Phase:** Phase 0 — Repository Setup & Architecture Planning

---

*Built for executive leadership. Designed for Arabic-first organizations.*
