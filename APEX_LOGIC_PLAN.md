# APEX LOGIC — Master Execution Plan
> **Do not paste this manually anymore.** Cursor rules in `.cursor/rules/` auto-inject this context into every agent.
> For live status, read `memory-bank/ACTIVE_CONTEXT.md`. For build progress, read `memory-bank/PROGRESS.md`.
> Status: Updated after Session 2 — Memory Bank system installed.

---

## Project Stack
- **Framework:** React 19 + Vite
- **Styling:** Tailwind CSS 4
- **Icons:** Lucide React (already installed)
- **Animated counters:** react-countup (already installed)
- **State:** React Context + useState (no backend, no database)
- **Location:** `/apex-logic/apex-logic/` — run `npm run dev` to start

---

## File Map & Status

### 📁 src/docs/ — Reference Documents (Do Not Edit During Build)
| File | Status | Contents |
|---|---|---|
| `product-strategy.md` | ✅ COMPLETE | Brand, mission, personas, intercept protocol, metrics framework |
| `strategic-assumptions.md` | ✅ COMPLETE | 5 architectural assumptions, compliance alignment matrix |
| `lean-prd.md` | ✅ COMPLETE | 3-column architecture, feature specs, scope guardrails |
| `user-architecture.md` | ✅ COMPLETE | 3 personas, friction points, journey matrix (4 phases) |
| `ledger-spec.md` | ✅ COMPLETE | Intent Ledger business rationale, 6 vectors, 3 intercept controls |
| `component-specs.md` | ✅ COMPLETE | SPEC-01 through SPEC-07 — exact layout, data fields, behavior rules |
| `ux-problem-framework.md` | ✅ COMPLETE | POV/HMW problem statements (PS-01–06), persona snapshots, journey-problem overlay, traceability matrix to component specs |
| `dashboard-information-architecture.md` | ✅ COMPLETE | Visual hierarchy tiers (0–3), cross-column attention model, progressive disclosure matrix — feeds SPEC-07 |
| `rationale-void-review-checklist.md` | ✅ COMPLETE | 6-question standing rubric to test any new decision against the Rationale Void → Intent Ledger problem |
| `pitch-narrative.md` | ✅ COMPLETE | Sub-5-minute pitch script (Hook/Pivot/Turn/Walkthrough/Close) built on The Rationale Void → The Intent Ledger, with live prototype screen map |

### 📁 src/docs/branding/ — Branding Decisions
| File | Status | Contents |
|---|---|---|
| `brand-identity.md` | ✅ COMPLETE | Brand name, tagline, logo mark, voice, approved copy |
| `color-palette.md` | ⚠️ 2 DECISIONS PENDING | Locked: canvas, emerald, amber, crimson, neutral scale. Pending: accent color, logo mark color |
| `type-system.md` | ⚠️ 1 DECISION PENDING | Locked: type scale, two-font rule, tabular-nums rule. Pending: monospace font import |
| `ui-spec.md` | ⚠️ 1 DECISION PENDING | Locked: 3-column layout, thin-lines rule, component behavior. Pending: header surface treatment |

### 📁 src/data/ — Structured Data (Powers all components)
| File | Status | Contents |
|---|---|---|
| `strategy.js` | ✅ COMPLETE | `brand`, `valueProps`, `personas`, `interceptProtocol` |
| `assumptions.js` | ✅ COMPLETE | `assumptions[]`, `complianceMatrix`, `humanGateGuardrail` |
| `users.js` | ✅ COMPLETE | `landscapeHeadlines`, `personas[]`, `journeyPhases[]` |
| `mockLedgerData.json` | ✅ COMPLETE | `agents[]`, `ledgerEntries[]`, `trappedAnomalies[]`, `terminalLogs[]`, `systemMetrics{}` |

### 📁 src/tokens/ — Design Token System
| File | Status | Contents |
|---|---|---|
| `theme.js` | ⚠️ DECISIONS PENDING | `brand`, `canvas`, `tokens` (emerald/amber/crimson/neutral), `statusTokenMap`, `type`, `layout`. Pending: accent token |

### 📁 src/ — Application Code
| File | Status | Contents |
|---|---|---|
| `App.jsx` | 🔲 NOT STARTED | Root component — wire up context + layout |
| `main.jsx` | ✅ UNTOUCHED | Entry point — do not modify |
| `index.css` | 🔲 NEEDS FONT IMPORT | Add monospace font @import once font is decided |

### 📁 src/components/ — UI Components (ALL NOT STARTED)
| Component | Spec | Priority |
|---|---|---|
| `AppContext.jsx` | React Context — agents, ledger, anomalies, terminal state | 1st |
| `layout/SystemHeader.jsx` | SPEC-05 — logo, 4 metrics, Emergency Stop button | 2nd |
| `layout/ComplianceBadgeStrip.jsx` | SPEC-06 — IMDA compliance pillars | 3rd |
| `layout/ThreeColumnLayout.jsx` | Three-column flex wrapper | 4th |
| `sections/AuditStream.jsx` | Left column wrapper | 5th |
| `sections/IntentLedger.jsx` | Center column wrapper | 6th |
| `sections/CircuitBreakerGate.jsx` | Right column wrapper | 7th |
| `ui/AgentBlock.jsx` | SPEC-02 — agent status card | 8th |
| `ui/TerminalLog.jsx` | SPEC-04 — rolling terminal feed | 9th |
| `ui/LedgerRow.jsx` | SPEC-01 — intent + metrics row | 10th |
| `ui/AnomalyCard.jsx` | SPEC-03 — human gate card | 11th |

---

## Pending Decisions (Must Resolve Before Building)

### Decision 1 — Interactive Accent Color
**File to update:** `src/tokens/theme.js` (add `tokens.accent`), `src/docs/branding/color-palette.md`
**Options:**
- `cyan` → `text-cyan-400` — terminal hacker feel
- `violet` → `text-violet-400` — premium brand recall
- `blue` → `text-blue-400` — enterprise/Bloomberg
- `none` → pure monochrome, `neutral-700` for interactive states

**What it gates:** hover states, selected row highlight, active column border, logo mark color, button focus rings.

### Decision 2 — Logo Triangle Mark Color
**File to update:** `src/tokens/theme.js` (`brand.logoMarkColor`), `src/docs/branding/color-palette.md`
**Options:** Accent color / `neutral-100` white / `emerald-400`

### Decision 3 — Monospace Font
**File to update:** `src/index.css` or `index.html`, `tailwind.config.js`
**Options:** JetBrains Mono / IBM Plex Mono / Geist Mono / System default

### Decision 4 — Header Surface Treatment
**File to update:** `src/tokens/theme.js` (`canvas.header`), `src/docs/branding/ui-spec.md`
**Options:** Border only (`neutral-950`) / Slightly lighter (`neutral-900`) / Dark contrast (`neutral-800/40`)

---

## Build Sequence (Once Decisions Are Made)

```
Step 1  → Resolve 4 pending decisions → update theme.js + index.css
Step 2  → Build AppContext.jsx (React state engine)
Step 3  → Build SystemHeader.jsx
Step 4  → Build ThreeColumnLayout.jsx
Step 5  → Build AgentBlock.jsx + TerminalLog.jsx → wire into AuditStream.jsx
Step 6  → Build LedgerRow.jsx → wire into IntentLedger.jsx
Step 7  → Build AnomalyCard.jsx → wire into CircuitBreakerGate.jsx
Step 8  → Build ComplianceBadgeStrip.jsx
Step 9  → Assemble App.jsx — all sections wired together
Step 10 → Test interactions: Approve & Sign / Reject & Kill / Emergency Stop / Expiry Timer
```

---

## The Build Prompt (Use in New Chat After Decisions)

> "Read `memory-bank/ACTIVE_CONTEXT.md` and `memory-bank/PROGRESS.md` first. All 4 decisions are now resolved and logged in `memory-bank/DECISIONS.md`. Using `component-specs.md`, `lean-prd.md`, `mockLedgerData.json`, and `theme.js`, build the full Dashboard following the Build Sequence. Start with `AppContext.jsx` and work through every step. The aesthetic is Cyberpunk Bloomberg Terminal — bg-neutral-950, font-mono, rounded-none, thin borders. Do not skip any component. Update `memory-bank/ACTIVE_CONTEXT.md` after each step."

## Memory Bank System (Installed Session 2)

| File | Purpose |
|---|---|
| `.cursor/rules/apex-context.mdc` | Auto-injected into every chat — forces agents to read context first |
| `.cursor/rules/change-protocol.mdc` | Cascade awareness — agents update memory-bank after every change |
| `memory-bank/ACTIVE_CONTEXT.md` | What is being worked on RIGHT NOW |
| `memory-bank/DECISIONS.md` | Immutable log of all decisions with rationale and downstream impact |
| `memory-bank/COMPONENT_MAP.md` | What depends on what — change cascade tracker |
| `memory-bank/PROGRESS.md` | Full build status — done / blocked / not started |

---

## Design Constraints (Locked — Non-Negotiable)
1. `humanIntent-always-visible` — Human Intent never hidden behind a click
2. `terminal-continuous-scroll` — Terminal log must animate continuously
3. `paused-state-must-pulse` — Amber PAUSED badge must use `animate-pulse`
4. `plainenglish-before-diff` — Business risk summary always renders above code diff
5. `rounded-none` — No consumer rounded corners anywhere
6. `tabular-nums` — All stacking numeric columns must use tabular numbers
