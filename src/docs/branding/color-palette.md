# Color Palette: Apex Logic
> Engineering + brand reference.
> Status: ALL DECISIONS LOCKED — Session 2, 2026-07-12
> Upstream: `src/docs/branding/BRAND_STRATEGY.md`

---

## The Core Rule
Color appears on the canvas ONLY when it communicates:
- Immediate systemic risk (Amber, Crimson)
- Positive operational health (Emerald)
- Live interactive state (Cyan accent)

Everything else is Neutral. Color is not decoration. Color is signal.

---

## [LOCKED] — Interactive Accent: Cyan

**Decision rationale:** Cyan is the phosphor of a live terminal — the Cyberpunk register of the brand. It reads subconsciously as "live system signal." Blue would be pure Bloomberg (authoritative but static). Cyan adds the living edge. The Bloomberg structural grid *contains* the cyberpunk energy.

| Token | Value | Used for |
|---|---|---|
| Accent text | `text-cyan-400` | Hover states, selected row highlight, focus indicators |
| Accent border | `border-cyan-500` | Active column border, selected card edge |
| Accent bg | `bg-cyan-950/30` | Selected row background tint |

**Status: LOCKED. Do not reopen.**

---

## [LOCKED] — Logo Mark Color: White

The `▲` is the Ruler's mark. White on near-black is absolute institutional weight. The logo mark sits above the color system, not within it.

- `text-neutral-100` — always, with no exceptions

**Status: LOCKED. Do not reopen.**

---

## [LOCKED] — Base Canvas

| Token Name | Tailwind Class | Purpose |
|---|---|---|
| Canvas | `bg-neutral-950` | The base. All content sits on this. |
| Surface | `bg-neutral-900` | Elevated panels (header, column headers) |
| Surface Elevated | `bg-neutral-800/60` | Cards, active rows |

---

## [LOCKED] — Semantic Status Colors

### Emerald — Stable Autonomy
> Healthy agent streams, active processing, positive financials, approved ledger commits.

| Usage | Class |
|---|---|
| Background tint | `bg-emerald-950/30` |
| Border | `border-emerald-800/50` |
| Text / Badge | `text-emerald-400` |
| Dot indicator | `bg-emerald-400` |

### Amber — The Apex Checkpoint
> Used EXCLUSIVELY when the circuit breaker trips. Execution is frozen. Human review required.

| Usage | Class |
|---|---|
| Background tint | `bg-amber-950/30` |
| Border | `border-amber-800/50` |
| Text / Badge | `text-amber-400` |
| Dot indicator | `bg-amber-400` (+ `animate-pulse`) |

### Crimson — Critical Halt
> [Reject & Kill] button, CRITICAL_HALT events, terminated threads. Permanent, non-reversible.

| Usage | Class |
|---|---|
| Background tint | `bg-red-950/30` |
| Border | `border-red-800/50` |
| Text / Badge | `text-red-400` |
| Dot indicator | `bg-red-500` |

---

## [LOCKED] — Neutral Metadata Scale

| Role | Class | Used for |
|---|---|---|
| Brightest | `text-neutral-100` | Logo mark, primary KPI values |
| Primary body | `text-neutral-300` | Human intent text, readable copy |
| Secondary data | `text-neutral-400` | Log lines, machine assumption text |
| Micro-labels | `text-neutral-500` | Column headers, metric labels |
| Borders | `border-neutral-800/60` | Panel dividers, card edges |

---

## [LOCKED] — Severity → Color Mapping

| Severity | Token |
|---|---|
| `critical` | Crimson |
| `high` | Amber |
| `medium` | Neutral |
| `low` | Emerald |
