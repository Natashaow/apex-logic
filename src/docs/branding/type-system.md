# Type System: Apex Logic
> Typography specification — engineering reference.
> Status: ALL DECISIONS LOCKED — Session 2, 2026-07-12
> Upstream: `src/docs/branding/BRAND_STRATEGY.md`

---

## The Two-Font Rule

The entire interface uses exactly two font families. No exceptions.

| Family | Font | Role | Tailwind |
|---|---|---|---|
| **Monospace** | JetBrains Mono | All data, numbers, logs, code, metrics, logo | `font-mono` |
| **Sans-serif** | Space Grotesk | All readable copy, headings, alerts, plain-English summaries | `font-sans` |

**Why this split matters:** Monospace signals machine output. Sans-serif signals human language. The visual switch between the two IS the product — it is the translation layer between machine and human made visible in typography.

**Why JetBrains Mono:** Technical authority with terminal intelligence. Reads cleanly at 10px (micro-label size). The standard for engineering command tools. Carries the Cyberpunk Bloomberg aesthetic without feeling like a bank (IBM Plex Mono) or a startup (Geist Mono).

**Why Space Grotesk:** Geometric and slightly angular — just enough technical edge to sit in the Cyberpunk Bloomberg space without consumer warmth. Signals "designed for people who think in systems." Pairs strongly with JetBrains Mono.

---

## [LOCKED] — Monospace Font: JetBrains Mono

**Import method:** Google Fonts  
**Weights:** 400 (Regular) + 600 (SemiBold)  
**HTML link tag:**
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
```

**Tailwind config:**
```js
fontFamily: {
  mono: ["JetBrains Mono", "Menlo", "monospace"],
}
```

**Status: LOCKED.**

---

## [LOCKED] — Sans-serif Font: Space Grotesk

**Import method:** Google Fonts  
**Weights:** 400 (Regular) + 500 (Medium) + 600 (SemiBold)  
**HTML link tag (combine into one request with JetBrains Mono):**
```html
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Space+Grotesk:wght@400;500;600&display=swap" rel="stylesheet">
```

**Tailwind config:**
```js
fontFamily: {
  sans: ["Space Grotesk", "ui-sans-serif", "system-ui", "sans-serif"],
  mono: ["JetBrains Mono", "Menlo", "monospace"],
}
```

**Status: LOCKED.**

---

## [LOCKED] — Named Type Scale

Every component references these named roles from `src/tokens/theme.js`.  
Never use raw Tailwind size classes directly in components.

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
2. Human Intent copy         ← most important readable content (font-sans body, neutral-300)
3. Machine Assumption        ← supporting readable content (font-sans body, neutral-400)
4. Data metrics strip        ← monospace numbers (font-mono data, tabular-nums)
5. Micro-labels              ← column identifiers (font-mono micro, neutral-500)
```

The font switch from sans (human copy) to mono (data) is visible and intentional. It communicates the translation.

---

## Tabular Numbers Rule

All numeric values that stack vertically (COGS columns, latency columns, AER columns) MUST use `tabular-nums` to ensure decimal points align. This is non-negotiable for Bloomberg terminal feel and financial data credibility.
