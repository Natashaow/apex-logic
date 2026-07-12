# UI Specification: Apex Logic Control Plane
> Layout rules, density guidelines, and component behavior — engineering reference.
> Status: ALL DECISIONS LOCKED — Session 2, 2026-07-12
> Upstream: `src/docs/branding/BRAND_STRATEGY.md`

---

## Layout Architecture

### Three-Column Grid (The Law)
The dashboard is ALWAYS a three-column flex layout. This is non-negotiable — it maps directly to the product's governance intercept protocol.

```
┌──────────────┬───────────────────┬──────────────┐
│  LEFT (25%)  │   CENTER (45%)    │  RIGHT (30%) │
│  Traceable   │   Intent-to-Asset │  Circuit     │
│  Audit       │   Ledger          │  Breaker     │
│  Stream      │                   │  Human Gate  │
└──────────────┴───────────────────┴──────────────┘
```

Column width rationale:
- **Left (25%):** Registry + terminal — dense but secondary to the ledger
- **Center (45%):** The ledger is the product's core value — it gets the most space
- **Right (30%):** Action cards need enough width for readable plain-English summaries

### Full Viewport Lock
The dashboard occupies 100vh exactly. No page scroll. Internal columns scroll independently.

---

## The "Thin-Lines" Rule (Non-Negotiable)

| Property | Rule |
|---|---|
| Corner radius | `rounded-none` everywhere. `rounded-sm` is the absolute maximum. |
| Borders | `border border-neutral-800/60` — thin, low-contrast, precise |
| Dividers | `divide-y divide-neutral-900` for stacked lists |
| Shadows | None. Depth is created by border contrast, not shadows. |
| Gradients | None. Flat surfaces only. |

---

## [LOCKED] — Header Surface Treatment: `bg-neutral-900`

The Ruler commands with presence, not loudness. `neutral-900` gives the header authority through contrast without decoration. The Bloomberg standard — elevated from the canvas without decorative gradient or shadow.

- **Header:** `bg-neutral-900` + `border-b border-neutral-800/60`
- **Column header strips:** same treatment — `bg-neutral-900/80 border-b border-neutral-800/60`

**Status: LOCKED — Session 2, 2026-07-12.**

---

## Component Behavior Rules

### AgentBlock (Left Column)
- `processing` → static emerald dot
- `idle` → static neutral dot
- `paused` → **pulsing** amber dot (`animate-pulse`) — mandatory
- `halted` → static crimson dot

### AnomalyCard (Right Column)
- Zone 1 (Business Risk Summary) ALWAYS renders before Zone 2 (Technical Drawer)
- Zone 2 is collapsed by default, expandable on click
- Expiry countdown timer ticks live from `expirySeconds`
- Auto-kill fires when timer reaches 0 (sets agent status to `halted`)

### TerminalLog (Left Column)
- Newest entries prepend to top
- `setInterval` appends a synthetic log line every 4 seconds
- Color-coded by event type:
  - `CIRCUIT_BREAK` → amber
  - `CRITICAL_HALT` → crimson
  - `LEDGER_COMMIT` → emerald
  - `TOOL_CALL`, `STATE_CHANGE` → neutral

### LedgerRow (Center Column)
- Human Intent is always visible — never collapsed
- Metrics strip (Zone B) renders below intent text
- `intentDriftVariance` above 25% renders in amber text
- `contextWindowUsage` above 80% renders in amber text; above 90% in crimson

### SystemHeader (Top Bar)
- Left: Logo + system state badge
- Center: Four live system metrics (react-countup for animated entry)
- Right: `[EMERGENCY STOP]` button (crimson, prominent)

---

## Interactive States

| State | Treatment |
|---|---|
| Hover (rows, cards) | `bg-neutral-800/30` background transition |
| Selected / Active | `border-l-2` left accent border in chosen accent color |
| Focus (buttons) | `outline outline-1 outline-offset-2` in accent color |
| Disabled | `opacity-40 cursor-not-allowed` |

---

## Spacing Scale

All internal padding follows a tight, consistent scale:
- Panel padding: `p-4`
- Card padding: `p-3`
- Micro-component padding: `px-2 py-1`
- Column gap: `gap-px` (1px — the gap IS the border)
