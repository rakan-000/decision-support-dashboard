# Monitoring & Observability
## المراقبة والرصد

**Status:** Planned — Phase 1

---

## Observability Pillars

| Pillar | Tool (Planned) | Purpose |
|---|---|---|
| Metrics | Prometheus + Grafana | System health, API latency, error rates |
| Logging | ELK Stack or Loki | Application and access logs |
| Tracing | OpenTelemetry | Request tracing across services |
| Alerting | Alertmanager / PagerDuty | On-call alerts for critical failures |
| Uptime | Uptime Kuma or equivalent | Public availability monitoring |

---

## Key Metrics to Monitor

- Dashboard load time (p50, p95, p99)
- API error rate (target < 0.1%)
- ERPNext connector availability
- Power BI token refresh success rate
- AI API response time and error rate
- Active user sessions
- Cache hit rate

---

## Alerting Thresholds (Draft)

| Metric | Warning | Critical |
|---|---|---|
| API error rate | > 1% | > 5% |
| Dashboard load time (p95) | > 3s | > 6s |
| System uptime | < 99.9% | < 99% |
| ERPNext connection failures | > 5 in 10min | > 10 in 10min |

---

## Files (To be created in Phase 1)

```
monitoring/
├── README.md
├── metrics-spec.md             ← All metrics definitions
├── alerting-rules.md           ← Alert thresholds and escalations
├── dashboard-spec.md           ← Grafana/monitoring dashboard layout
└── runbook.md                  ← On-call runbook for common incidents
```
