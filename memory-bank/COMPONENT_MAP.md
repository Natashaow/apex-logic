# COMPONENT MAP — Change Cascade Tracker
> Before changing any file, check this map to know what else you need to update.
> Read left column → look right to find all downstream dependents.

---

## Token Layer (Changes here cascade widely)

| If you change... | It affects... | Severity |
|---|---|---|
| `src/tokens/theme.js` → `tokens.accent` | Every component with hover states, focus rings, selected rows, active borders. Also gates `brand.logoMarkColor` | 🔴 HIGH — touch all components |
| `src/tokens/theme.js` → `brand.logoMarkColor` | `SystemHeader.jsx` (logo SVG fill) | 🟡 LOW — single component |
| `src/tokens/theme.js` → `canvas.*` | `App.jsx` background, `ThreeColumnLayout.jsx`, `SystemHeader.jsx` | 🟠 MEDIUM |
| `src/tokens/theme.js` → `statusTokenMap` | `AgentBlock.jsx`, `LedgerRow.jsx`, `AnomalyCard.jsx` | 🔴 HIGH — all status-bearing components |
| `src/tokens/theme.js` → `type.*` | All components using custom type scale | 🟠 MEDIUM |
| `src/index.css` → font @import | Entire UI — font rendering changes everywhere | 🟠 MEDIUM |

---

## Data Layer (Changes here cascade to consumers)

| If you change... | It affects... | Severity |
|---|---|---|
| `src/data/mockLedgerData.json` → `agents[]` shape | `AgentBlock.jsx`, `AuditStream.jsx`, `AppContext.jsx` | 🔴 HIGH |
| `src/data/mockLedgerData.json` → `ledgerEntries[]` shape | `LedgerRow.jsx`, `IntentLedger.jsx`, `AppContext.jsx` | 🔴 HIGH |
| `src/data/mockLedgerData.json` → `trappedAnomalies[]` shape | `AnomalyCard.jsx`, `CircuitBreakerGate.jsx`, `AppContext.jsx` | 🔴 HIGH |
| `src/data/mockLedgerData.json` → `trappedAnomalies[]` volume (length, severity mix) | Also drives `sections/CircuitBreakerGate.jsx` column header styling (SPEC-07 `ColumnAttentionState`) — not just `AnomalyCard.jsx` | 🟠 MEDIUM |
| `src/data/mockLedgerData.json` → `terminalLogs[]` shape | `TerminalLog.jsx`, `AuditStream.jsx`, `AppContext.jsx` | 🟠 MEDIUM |
| `src/data/mockLedgerData.json` → `systemMetrics{}` | `SystemHeader.jsx` (4 metric counters) | 🟡 LOW |
| `src/data/strategy.js` | Any component rendering brand/persona data | 🟡 LOW |
| `src/data/assumptions.js` | Not currently consumed by any live component — `ComplianceBadgeStrip.jsx` (its only planned consumer) was cut from the dashboard. Retained as pitch/docs data. | ⚪ NONE (dead data for UI purposes) |
| `src/data/users.js` | Any component rendering persona/journey data | 🟡 LOW |

---

## Context Layer

| If you change... | It affects... | Severity |
|---|---|---|
| `src/components/AppContext.jsx` → state shape | Every component using `useContext(AppContext)` — that's all section and ui components | 🔴 HIGH |
| `src/components/AppContext.jsx` → action handlers (approve/reject/emergency stop) | `AnomalyCard.jsx`, `SystemHeader.jsx` (Emergency Stop button) | 🔴 HIGH |

---

## Layout Layer

| If you change... | It affects... | Severity |
|---|---|---|
| `src/components/layout/ThreeColumnLayout.jsx` | Visual position of AuditStream, IntentLedger, CircuitBreakerGate | 🟠 MEDIUM |
| `src/components/layout/SystemHeader.jsx` | Top-level metrics display, Emergency Stop availability | 🟠 MEDIUM |

---

## Component Dependency Tree

```
App.jsx
├── AppContext.jsx (provides state to all below)
├── layout/SystemHeader.jsx
│   └── reads: systemMetrics{} from mockLedgerData via AppContext
├── layout/ThreeColumnLayout.jsx
│   ├── sections/AuditStream.jsx
│   │   ├── ui/AgentBlock.jsx  ← reads agents[] from AppContext
│   │   └── ui/TerminalLog.jsx ← reads terminalLogs[] from AppContext
│   ├── sections/IntentLedger.jsx
│   │   └── ui/LedgerRow.jsx   ← reads ledgerEntries[] from AppContext
│   └── sections/CircuitBreakerGate.jsx
│       └── ui/AnomalyCard.jsx ← reads trappedAnomalies[] from AppContext
```

---

## Screens Layer

| If you change... | It affects... | Severity |
|---|---|---|
| `src/components/screens/IntroScreen.jsx` | `App.jsx` — rendered when `showIntro` is `true`; `onEnter` prop flips it to `false`, unmounting `IntroScreen` and mounting the dashboard tree. | 🟡 LOW — single consumer |

**Session 6 note:** `IntroScreen` is now wired into `App.jsx` (previously built standalone per DECISION-8; that gap is closed this session). `ComplianceBadgeStrip.jsx` does **not** exist in this codebase and should not be re-added — it was deliberately cut from the dashboard (see `ACTIVE_CONTEXT.md` Session 6 and `component-specs.md` SPEC-06, which is retired). A concurrent session briefly rebuilt it under a mistaken "tracking error" theory; that's been reverted.

---

## Spec-to-Component Cross-Reference

| Spec | Component | Key behaviors |
|---|---|---|
| SPEC-01 | `ui/LedgerRow.jsx` | Intent + metrics row, human readable |
| SPEC-02 | `ui/AgentBlock.jsx` | Agent status card, status badge |
| SPEC-03 | `ui/AnomalyCard.jsx` | Human gate card, approve/reject actions |
| SPEC-04 | `ui/TerminalLog.jsx` | Rolling terminal, continuous scroll |
| SPEC-05 | `layout/SystemHeader.jsx` | Logo, 4 metrics, Emergency Stop |
| SPEC-06 | *(retired — see `component-specs.md`)* | Was `ComplianceBadgeStrip.jsx`, cut from dashboard |
| SPEC-07 | `sections/CircuitBreakerGate.jsx` (column header) | Cross-column attention escalation — border + pending-count badge |

---

## Reference Docs (Read-only — Never Edit During Build)

| File | Contains | Who reads it |
|---|---|---|
| `src/docs/component-specs.md` | SPEC-01 to SPEC-06 exact layout and behavior | Agents building components |
| `src/docs/lean-prd.md` | Feature scope, 3-column architecture | Architecture reference |
| `src/docs/product-strategy.md` | Brand, mission, personas | Brand/copy reference |
| `src/docs/ledger-spec.md` | Intent Ledger rationale, 6 vectors, 3 intercept controls | LedgerRow + AppContext |
| `src/docs/user-architecture.md` | Personas, journey matrix | Persona rendering |
| `src/docs/strategic-assumptions.md` | 5 assumptions, compliance matrix | Pitch/docs reference only — no live component consumes this |
| `src/docs/branding/brand-identity.md` | Brand name, tagline, logo mark, voice | SystemHeader, copy |
| `src/docs/branding/color-palette.md` | Color decisions (partial) | theme.js updates |
| `src/docs/branding/type-system.md` | Type scale, font decisions | theme.js, index.css |
| `src/docs/branding/ui-spec.md` | Layout behavior decisions (partial) | ThreeColumnLayout |
| `src/docs/ux-problem-framework.md` | POV/HMW problem statements, journey-problem overlay, traceability matrix | Design decision rationale |
| `src/docs/dashboard-information-architecture.md` | Visual hierarchy tiers, cross-column attention model, progressive disclosure matrix | `ThreeColumnLayout.jsx`, `AppContext.jsx`, `CircuitBreakerGate.jsx` |
| `src/docs/app-context-contract.md` | State shape, derived `highestActiveSeverity`, 3 action handlers, background effects (terminal interval, expiry auto-abort) | `AppContext.jsx` — read this first, before writing the component |
