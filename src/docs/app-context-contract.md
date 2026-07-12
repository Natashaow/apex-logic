# AppContext Contract
> The state/action contract for `src/components/AppContext.jsx` — written before the component so the first file in the build order (`memory-bank/PROGRESS.md` Components table) has an explicit spec instead of an improvised one.
> Status: LOCKED for Phase 2 build. Reopen only with explicit founder sign-off, same as `memory-bank/DECISIONS.md`.

---

## 0. Why This Doc Exists

Every other doc in `src/docs/` specifies data *shape* per component (`component-specs.md`) or *priority* per field (`dashboard-information-architecture.md`). Nobody had written the one contract for what the actual React state container exposes — field names, derived values, and exactly what each action handler mutates. `lean-prd.md` Section 1 sketches this abstractly ("React Context — Manages Token Budgets, Active Diffs, Agent Records"); this doc makes it concrete and code-ready.

---

## 1. State Shape

Initialized from `src/data/mockLedgerData.json` on mount. All five top-level keys are held in state (not just passed through as static props) because every one of them is mutated by at least one action handler below.

```
{
  agents: Agent[],            // from mockLedgerData.json → agents[]
  ledgerEntries: LedgerEntry[],   // from mockLedgerData.json → ledgerEntries[]
  trappedAnomalies: Anomaly[],    // from mockLedgerData.json → trappedAnomalies[]
  terminalLogs: TerminalLogLine[], // from mockLedgerData.json → terminalLogs[]
  systemMetrics: SystemMetrics,    // from mockLedgerData.json → systemMetrics{}
}
```

Field shapes are exactly as documented in `component-specs.md` SPEC-01 through SPEC-05 and as demonstrated in `mockLedgerData.json` — this doc does not redefine them, it only states which container holds them and what's allowed to change them.

---

## 2. Derived Values

Computed from state on every render (`useMemo`), never stored redundantly in state.

### `highestActiveSeverity`
Defined in `component-specs.md` SPEC-07 / `memory-bank/DECISIONS.md` DECISION-6. Drives the Circuit-Breaking Gate column header escalation.

```js
highestActiveSeverity =
  trappedAnomalies.some(a => a.severity === "critical") ? "critical"
  : trappedAnomalies.length > 0 ? "high"
  : null
```

Consumed by: `sections/CircuitBreakerGate.jsx` column header only (per SPEC-07 — not the whole column, not other columns).

---

## 3. Action Handlers

Three handlers, matching the three controls in `ledger-spec.md` ("The Three Core Intercept Controls") and the button labels locked in `component-specs.md` SPEC-03 / SPEC-05.

### `approveAnomaly(anomalyId)`
Fires on `[Approve & Sign]`. Per SPEC-03:
1. Remove the matching entry from `trappedAnomalies`.
2. Set that anomaly's `agentId` agent status back to `"processing"` in `agents`.
3. Commit a new entry to `ledgerEntries` (prepended, newest first) built from the anomaly's `humanIntent`, `machineAssumption`, and `technicalTrace.estimatedCost` — this is the literal "flushes card... commits to ledger" behavior from SPEC-03.
4. Prepend a `LEDGER_COMMIT` line to `terminalLogs` (format matches existing lines in `mockLedgerData.json`, e.g. `"tx-105 committed → AER: … | COGS: $…"`).
5. Increment `systemMetrics.totalTokensBurned` / `totalCogs` by the anomaly's estimated cost.

### `rejectAnomaly(anomalyId)`
Fires on `[Reject & Kill]`. Per SPEC-03:
1. Remove the matching entry from `trappedAnomalies`.
2. Set that anomaly's `agentId` agent status to `"halted"` in `agents`.
3. Prepend a `CRITICAL_HALT` line to `terminalLogs` (matches the existing `"agent-01 thread terminated | reason: operator REJECT_AND_KILL"` format in mock data).
4. No ledger entry is committed — a killed thread produces no asset, only a terminal record. This matches `ledger-spec.md`: the ledger is for committed transactions, not aborted ones.

**Auto-abort path:** when an `AnomalyCard`'s `expirySeconds` countdown reaches 0 without a human decision, the component calls this same `rejectAnomaly(anomalyId)` handler — the expiry timer is a UI-side trigger, not a separate state mutation path. The only difference is the terminal log line's `reason` reads `"AUTO_ABORT_EXPIRY"` instead of `"operator REJECT_AND_KILL"`, so the ledger/audit trail can distinguish a human kill from an unattended one. Pass an optional second argument, `rejectAnomaly(anomalyId, reason = "operator REJECT_AND_KILL")`, to support both call sites without duplicating logic.

### `emergencyStop()`
Fires on `[EMERGENCY STOP]` in `SystemHeader`. Per SPEC-05:
1. Set every entry in `agents` to status `"halted"`.
2. Clear `trappedAnomalies` entirely (`[]`).
3. Prepend a `GLOBAL_KILL_SWITCH_ACTIVATED` line to `terminalLogs`.

This handler does not touch `ledgerEntries` or `systemMetrics` — it is a hard stop on live execution, not a financial event.

---

## 4. Background Effects Owned by AppContext

Two `setInterval` loops live inside `AppContext.jsx` because they mutate shared state that multiple components read (`TerminalLog`, `SystemHeader`).

### Terminal continuous scroll (SPEC-04 / `terminal-continuous-scroll`)
Every 3–5 seconds (randomized interval, not fixed), prepend one synthetic log line to `terminalLogs` using randomized data drawn from the current `agents` array. Event type distribution should favor `TOOL_CALL` / `STATE_CHANGE` (the steady-state noise) over `CIRCUIT_BREAK` / `CRITICAL_HALT` / `LEDGER_COMMIT` (which are reserved for real state transitions triggered by the action handlers above, not manufactured by the interval).

### Expiry countdown (SPEC-03)
Each `AnomalyCard` owns its own visible countdown tick (local `useState`/`useEffect`, not global state — no other component needs to read another card's timer). When a card's local timer hits 0, it calls `rejectAnomaly(anomalyId, "AUTO_ABORT_EXPIRY")` from context. This keeps 2+ simultaneous countdowns fully independent, matching the "N PENDING" badge in SPEC-07 which counts cards, not timers.

Animated metric counters (`react-countup`, already a dependency in `package.json`) are a pure presentation concern inside `SystemHeader.jsx` — they read `systemMetrics` from context but require no new state or handler here.

---

## 5. Non-Goals (Explicitly Out of Scope for AppContext)

Per `lean-prd.md` Section 3 Scope Guardrails:
- No persistence — state resets to the `mockLedgerData.json` defaults on every page refresh (`useState` only, no `localStorage`/backend).
- No live API calls — the terminal interval manufactures synthetic lines from local data, it does not call any model provider.
- No cryptographic signing — `[Approve & Sign]` is a local state transition, not a real signature.

---

## 6. Consumers (Cross-Reference)

Matches `memory-bank/COMPONENT_MAP.md` Context Layer table exactly — listed here for one-glance confirmation while building:

| Consumes | Component |
|---|---|
| `agents`, `highestActiveSeverity` indirectly (via anomalies) | `sections/AuditStream.jsx` → `ui/AgentBlock.jsx` |
| `terminalLogs` | `ui/TerminalLog.jsx` |
| `ledgerEntries` | `sections/IntentLedger.jsx` → `ui/LedgerRow.jsx` |
| `trappedAnomalies`, `highestActiveSeverity`, `approveAnomaly`, `rejectAnomaly` | `sections/CircuitBreakerGate.jsx` → `ui/AnomalyCard.jsx` |
| `systemMetrics`, `emergencyStop` | `layout/SystemHeader.jsx` |

If a component needs a field or handler not listed above or in Sections 1–3, it needs to be added here first — not read out of `mockLedgerData.json` directly, and not improvised inline in the component.
