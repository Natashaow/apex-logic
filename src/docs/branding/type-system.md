# Type System: Apex Logic
> Typography specification — engineering reference.

---

## The Two-Font Rule

The entire interface uses exactly two font families. No exceptions.

| Family | Role | Tailwind |
|---|---|---|
| **Monospace** | All data, numbers, logs, code, metrics | `font-mono` |
| **Sans-serif** | All readable copy, headings, alerts, plain-English summaries | `font-sans` |

**Why:** Monospace signals machine output. Sans-serif signals human language. The visual switch between the two IS the product — it is the translation layer made visible.

---

## [PENDING DECISION] — Monospace Font Import

The current `font-mono` defaults to system fonts: Menlo (macOS), Consolas (Windows), monospace (fallback). These are sharp and acceptable.

**Options to upgrade:**

| Font | Feel | Import method |
|---|---|---|
| **JetBrains Mono** | Industry standard for dev tools, very readable at 10px | Google Fonts |
| **IBM Plex Mono** | Corporate/institutional, strong for compliance positioning | Google Fonts |
| **Geist Mono** | Modern, tech-forward (Vercel's font) | npm package |
| **System default** | No import, fastest load, sharp on macOS | None needed |

> ⚠️ Decide this in the next session. If choosing a Google Font, add one `<link>` to `index.html` and extend `tailwind.config.js`.

---

## [LOCKED] — Named Type Scale

Every component references these named roles. Never use raw Tailwind size classes directly in components.

| Role name | Classes | Used for |
|---|---|---|
| `type.micro` | `text-[10px] font-mono uppercase tracking-widest text-neutral-500` | Column headers, metric labels, system tags |
| `type.data` | `text-sm font-mono text-neutral-300 tabular-nums` | Token counts, latency numbers, COGS values |
| `type.dataEmphasis` | `text-sm font-mono text-neutral-100 tabular-nums font-medium` | Primary KPI values (AER, total COGS) |
| `type.log` | `text-xs font-mono text-neutral-400` | Terminal log lines |
| `type.body` | `text-sm font-sans text-neutral-300 leading-relaxed` | Human intent text, machine assumption copy |
| `type.heading` | `text-xs font-sans font-semibold uppercase tracking-widest text-neutral-400` | Panel titles, section headers |
| `type.alertTitle` | `text-sm font-sans font-semibold text-neutral-100` | Anomaly card headers |
| `type.logo` | `font-mono font-bold tracking-[0.25em] text-sm uppercase text-neutral-100` | Brand wordmark |

---

## Scanning Hierarchy Rule

Reading order must be visually enforced in every component:

```
1. Alert title / Heading     ← largest visual weight (font-semibold, neutral-100)
2. Human Intent copy         ← most important readable content (body, neutral-300)
3. Machine Assumption        ← supporting readable content (body, neutral-400)
4. Data metrics strip        ← monospace numbers (data, tabular-nums)
5. Micro-labels              ← column identifiers (micro, neutral-500)
```

---

## Tabular Numbers Rule

All numeric values that stack vertically (COGS columns, latency columns, AER columns) MUST use `tabular-nums` to ensure decimal points align. This is non-negotiable for a Bloomberg terminal feel.
