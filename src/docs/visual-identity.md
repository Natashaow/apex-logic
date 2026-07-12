# Visual Identity & UI Architecture: Apex Logic
> Brand Framework & Cyberpunk Bloomberg Terminal Specification

---

## I. Brand Profile

### Core Identity
- **Brand Name:** Apex Logic
- **Tagline:** Bridging Human Intent and Autonomous Execution.
- **Design Philosophy:** Human-in-command operational supremacy. The interface functions strictly as a high-density command center instrument panel where data density, scannability, and thin-line alignment replace superficial visual fluff.

### Typographic Geometric Logo
Constructed entirely from raw inline monospace text and system symbols — zero image assets required.

```
▲ A P E X  L O G I C   [•] SYSTEM_STATE: ACTIVE
```

---

## II. Layout & Density Guidelines (The "Thin-Lines" Rule)

- **Grid:** Permanently locked flex or grid workspace — mimics an industrial engineering cockpit.
- **Corners:** `rounded-none` or `rounded-sm` maximum. Absolutely no standard rounded consumer corners.
- **Borders:** Thin, precise, low-contrast — `border border-neutral-800/60` or `divide-y divide-neutral-900`

---

## III. Typographic Scale & Scanning Hierarchy

| Layer | Font | Use |
|---|---|---|
| Data Rows | `font-mono` | Systems data, logs, token velocities, financial equations |
| Interface Controls | `font-sans` | Structural text headers, alert summaries |
| Micro-Labels | `font-mono text-[10px] uppercase tracking-widest text-neutral-500` | Metadata metric headers |

---

## IV. The Functional Token System (Semantic Color System)

> Color only appears on the canvas when it communicates immediate systemic risk or operational state change.

| Token | Semantic Meaning | Background | Border | Text |
|---|---|---|---|---|
| **Canvas** | The base | `bg-neutral-950` | — | — |
| **Emerald** | Stable Autonomy — healthy streams, active processing, positive financials | `bg-emerald-950/30` | `border-emerald-800/50` | `text-emerald-400` |
| **Amber** | The Apex Checkpoint — circuit breaker tripped, execution frozen | `bg-amber-950/30` | `border-amber-800/50` | `text-amber-400` |
| **Neutral** | System Metadata — timestamps, raw logs, diagnostic strings | — | — | `text-neutral-400 / text-neutral-500` |
