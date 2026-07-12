# Component Specifications: Apex Logic Control Plane
> Engineering reference — technical implementation rules for each UI component.
> Updated as new specs are received. Not for stakeholder distribution.

---

## SPEC-01: LedgerRow (Center Column)

**Purpose:** Displays one committed transaction from `ledgerEntries[]` in `mockLedgerData.json`.

**Layout:** Two-zone vertical stack.

```
Zone A — Intent Layer (font-sans, readable)
┌─────────────────────────────────────────────┐
│ 👤 HUMAN INTENT ANCHOR                      │  ← text-neutral-300, always visible
│ "Optimize checkout performance pipeline"    │
├─────────────────────────────────────────────┤
│ 🤖 MACHINE ASSUMPTION LOG                   │  ← text-neutral-400, italic
│ "Assuming low-latency serverless routing…"  │
└─────────────────────────────────────────────┘

Zone B — Metrics Strip (font-mono, tabular)
┌─────────┬──────────┬──────────┬──────────┬──────────┐
│ TECH    │ COGS/AER │ LATENCY  │ DRIFT    │ CONTEXT  │
│ TRACE   │          │ VARIANCE │ VARIANCE │ GAUGE    │
└─────────┴──────────┴──────────┴──────────┴──────────┘
```

**Design Constraints (from users.js):**
- `humanIntent-always-visible` — Human Intent Anchor is never behind a click or collapsed by default.
- `plainenglish-before-diff` — Zone A (intent) always renders above Zone B (metrics).

**Data Fields Required (from mockLedgerData.json):**
- `humanIntent` — string
- `machineAssumption` — string
- `technicalMetrics.model` — string
- `technicalMetrics.latencyVariance` — string
- `financials.cogs` — number
- `financials.aer` — number
- `intentDriftVariance` — number (percentage, e.g. 12.4)
- `contextWindowUsage` — number (percentage, e.g. 84)

---

## SPEC-02: AgentBlock (Left Column)

**Purpose:** Displays one agent from `agents[]`. Shows status badge, role, and live metrics.

**Status Badge Rules:**
- `processing` → Emerald badge, static dot
- `idle` → Neutral badge, static dot
- `paused` → Amber badge, **pulsing dot** (`animate-pulse`) — mandatory per `paused-state-must-pulse` constraint
- `halted` → Crimson badge, static dot

**Design Constraints:**
- `paused-state-must-pulse` — The `[PAUSED]` state must animate. A static amber badge is insufficient.

---

## SPEC-03: AnomalyCard (Right Column)

**Purpose:** Displays one trapped anomaly from `trappedAnomalies[]`. The human gate card.

**Layout:** Two-zone, ordered (per `plainenglish-before-diff` constraint):

```
Zone 1 — Business Risk Summary (ALWAYS FIRST)
  - Anomaly title
  - Human Intent (what the operator originally asked for)
  - Business Impact (plain English — what is at stake)
  - Machine Assumption (what the bot assumed it was doing)
  - State Expiry Timer countdown (e.g., "AUTO-ABORTING IN 02:45")

Zone 2 — Technical Drawer (EXPANDABLE, collapsed by default)
  - Code diff (monospace, line-diff formatted)
  - Prompt variance %
  - Estimated token cost
```

**Action Buttons:**
- `[Approve & Sign]` → Emerald — flushes card, returns agent to `processing`, commits to ledger
- `[Reject & Kill]` → Crimson — flushes card, sets agent to `halted`, logs `CRITICAL_HALT` to terminal

**Data Fields Required:**
- `title` — string
- `severity` — "critical" | "high" | "medium" | "low"
- `humanIntent` — string
- `machineAssumption` — string
- `businessImpact` — string
- `technicalTrace.proposedDiff` — string (raw diff)
- `technicalTrace.promptVariance` — string
- `technicalTrace.estimatedCost` — string
- `expirySeconds` — number (countdown timer start value, e.g. 165 = 2:45)

---

## SPEC-04: TerminalLog (Left Column, below AgentBlock stack)

**Purpose:** Rolling terminal feed from `terminalLogs[]`. Simulates live output via `setInterval`.

**Rules:**
- New log lines prepend to the top (newest first)
- `terminal-continuous-scroll` constraint: interval appends a new synthetic log line every 3–5 seconds using randomized data from the agents array
- Color-coded event types:
  - `CIRCUIT_BREAK` → `text-amber-400`
  - `CRITICAL_HALT` → `text-red-400`
  - `LEDGER_COMMIT` → `text-emerald-400`
  - `TOOL_CALL`, `STATE_CHANGE` → `text-neutral-400`

---

## SPEC-05: SystemHeader (Top Bar)

**Purpose:** Global metrics strip + branding + Global Kill-Switch.

**Left:** Logo mark (`▲ APEX LOGIC`) + `SYSTEM_STATE: ACTIVE` badge

**Center:** Four system-wide metrics from `systemMetrics{}`:
- Total Tokens Burned
- Total COGS ($)
- System AER
- Leakage Rate ($)

**Right:** `[EMERGENCY STOP]` — Global Kill-Switch button
- Crimson styling
- On click: sets all agent statuses to `halted`, clears `trappedAnomalies`, logs `GLOBAL_KILL_SWITCH_ACTIVATED` to terminal

---

## SPEC-06: ComplianceBadgeStrip (Below Header or Footer)

**Purpose:** Renders the three IMDA compliance pillars from `complianceMatrix` in `assumptions.js`.

**Format:** Horizontal strip of three slim badges, neutral styling, `text-[10px] font-mono uppercase`.
