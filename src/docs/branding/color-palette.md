# Color Palette: Apex Logic
> Engineering + brand reference. Decisions marked [LOCKED] or [PENDING DECISION].

---

## The Core Rule
Color appears on the canvas ONLY when it communicates:
- Immediate systemic risk (Amber, Crimson)
- Positive operational health (Emerald)
- Brand anchor (Accent — see below)

Everything else is Neutral.

---

## [LOCKED] — Base Canvas

| Token Name | Tailwind Class | Purpose |
|---|---|---|
| Canvas | `bg-neutral-950` | The base. All content sits on this. |
| Surface | `bg-neutral-900` | Slightly elevated panels (header, column headers) |
| Surface Elevated | `bg-neutral-800/60` | Cards, active rows |

---

## [LOCKED] — Semantic Status Colors

### Emerald — Stable Autonomy
> Used for: healthy agent streams, active processing, positive financials, approved ledger commits.

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
> Used for: [Reject & Kill] button, CRITICAL_HALT events, terminated threads. Permanent, non-reversible.

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
| Brightest | `text-neutral-100` | Logo, primary KPI values |
| Primary body | `text-neutral-300` | Human intent text, readable copy |
| Secondary data | `text-neutral-400` | Log lines, machine assumption text |
| Micro-labels | `text-neutral-500` | Column headers, metric labels |
| Borders | `border-neutral-800/60` | Panel dividers, card edges |

---

## [PENDING DECISION] — Interactive Accent Color

**What it drives:** hover states, selected ledger row highlight, active column indicator, button focus rings, the `▲` logo mark (optional).

**Options:**
- **Cyan** — `text-cyan-400` — classic terminal hacker feel, pairs perfectly with neutral-950
- **Violet** — `text-violet-400` — premium, distinct from status colors, strong brand recall
- **Blue** — `text-blue-400` — professional, enterprise-grade, Bloomberg-adjacent
- **None** — pure monochrome, use `neutral-700` borders for interactive states only

> ⚠️ Decide this in the next session. This decision gates the logo mark color and button hover system.

---

## [PENDING DECISION] — Logo Triangle Mark Color

**What it drives:** The `▲` in the top-left logo and any brand accent repetitions.

**Options:**
- Accent color (whichever is chosen above) — makes `▲` the only persistent brand color
- `text-neutral-100` white — maximum restraint, Bloomberg-accurate
- `text-emerald-400` — ties the mark to "system active / stable" semantic

---

## Severity → Color Mapping (for AnomalyCards)

| Severity | Token |
|---|---|
| `critical` | Crimson |
| `high` | Amber |
| `medium` | Neutral |
| `low` | Emerald |
