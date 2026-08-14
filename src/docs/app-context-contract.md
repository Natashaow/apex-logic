# AppContext Contract
> The state/action contract for `src/components/AppContext.jsx` — written before the component so the first file in the build order (`memory-bank/PROGRESS.md` Components table) has an explicit spec instead of an improvised one.
> Status: LOCKED for Phase 2 build. Reopen only with explicit founder sign-off, same as `memory-bank/DECISIONS.md`.
> **Amended by DECISION-9 (2026-08-15):** the "no persistence / no live API calls" boundary in §5 is narrowly reopened — see §1 and §5 below, and `memory-bank/DECISIONS.md` DECISION-9.

---

## 0. Why This Doc Exists

Every other doc in `src/docs/` specifies data *shape* per component (`component-specs.md`) or *priority* per field (`dashboard-information-architecture.md`). Nobody had written the one contract for what the actual React state container exposes — field names, derived values, and exactly what each action handler mutates. `lean-prd.md` Section 1 sketches this abstractly ("React Context — Manages Token Budgets, Active Diffs, Agent Records"); this doc makes it concrete and code-ready.

---

## 1. State Shape

**Initialization source, amended by DECISION-9 (2026-08-15):** `src/data/mockLedgerData.json` remains the initialization source on the public deployment (and as a local offline/demo fixture). Locally, `useLiveLedgerData.js` (new hook) instead polls `public/generated/ledger-state.json` — a runtime-generated file with the identical shape, produced by `scripts/sync-activity-log.mjs` from real events in the vault's `work/agent-activity/events.jsonl`. Either source resolves to the same five top-level keys below; components never need to know which one is active.

All five top-level keys are held in state (not just passed through as static props) because every one of them is mutated by at least one action handler below.

```
{
  agents: Agent[],            // agents[]
  ledgerEntries: LedgerEntry[],   // ledgerEntries[]
  trappedAnomalies: Anomaly[],    // trappedAnomalies[]
  terminalLogs: TerminalLogLine[], // terminalLogs[]
  systemMetrics: SystemMetrics,    // systemMetrics{}
}
```

Field shapes are exactly as documented in `component-specs.md` SPEC-01 through SPEC-05 and as demonstrated in `mockLedgerData.json` — this doc does not redefine them, it only states which container holds them and what's allowed to change them. This applies equally to the live-polled source: `sync-activity-log.mjs` must derive the identical shape, not a variant.

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
6. **(DECISION-9)** Fire-and-forget `POST` to the local mediator endpoint with the resolution (`{anomalyId, outcome: "approved"}`). Steps 1–5 happen immediately and locally regardless of whether the POST succeeds — the mediator call does not gate the optimistic UI update.

### `rejectAnomaly(anomalyId)`
Fires on `[Reject & Kill]`. Per SPEC-03:
1. Remove the matching entry from `trappedAnomalies`.
2. Set that anomaly's `agentId` agent status to `"halted"` in `agents`.
3. Prepend a `CRITICAL_HALT` line to `terminalLogs` (matches the existing `"agent-01 thread terminated | reason: operator REJECT_AND_KILL"` format in mock data).
4. No ledger entry is committed — a killed thread produces no asset, only a terminal record. This matches `ledger-spec.md`: the ledger is for committed transactions, not aborted ones.
5. **(DECISION-9)** Fire-and-forget `POST` to the local mediator endpoint with the resolution (`{anomalyId, outcome: "rejected", reason}`), same non-gating behavior as `approveAnomaly` step 6.

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
**Superseded by DECISION-9 (2026-08-15) when the live source is active.** Original behavior (still true for the public deployment / mock-data fixture): every 3–5 seconds, prepend one synthetic log line to `terminalLogs` using randomized data drawn from the current `agents` array, favoring `TOOL_CALL` / `STATE_CHANGE` over `CIRCUIT_BREAK` / `CRITICAL_HALT` / `LEDGER_COMMIT`. When `useLiveLedgerData.js` is active, this synthetic generator is removed entirely — `terminalLogs` scrolls from real polled events instead, and the continuous-scroll *visual* requirement (SPEC-04) is satisfied by real event frequency, not manufactured filler. If real events arrive sparsely, that's an accurate reflection of actual agent activity, not a bug.

### Expiry countdown (SPEC-03)
Each `AnomalyCard` owns its own visible countdown tick (local `useState`/`useEffect`, not global state — no other component needs to read another card's timer). When a card's local timer hits 0, it calls `rejectAnomaly(anomalyId, "AUTO_ABORT_EXPIRY")` from context. This keeps 2+ simultaneous countdowns fully independent, matching the "N PENDING" badge in SPEC-07 which counts cards, not timers.

Animated metric counters (`react-countup`, already a dependency in `package.json`) are a pure presentation concern inside `SystemHeader.jsx` — they read `systemMetrics` from context but require no new state or handler here.

---

## 5. Non-Goals (Explicitly Out of Scope for AppContext)

Per `lean-prd.md` Section 3 Scope Guardrails, **amended by DECISION-9 (2026-08-15)**:
- **No persistence beyond the local live feed.** On the public deployment: state still resets to `mockLedgerData.json` defaults on every page refresh (`useState` only). Locally, with `useLiveLedgerData.js` active: real persistence exists, but it lives in the vault's `work/agent-activity/events.jsonl` (append-only log), not in this component and not in a database — `AppContext.jsx`'s own React state is still just a poll-refreshed cache, never the source of truth.
- **No live API calls to model providers, still true.** DECISION-9's fetch/POST exception is scoped to (a) polling a local static JSON file and (b) POSTing to a local mediator endpoint — neither is a call to Anthropic/OpenAI or any hosted API.
- No cryptographic signing — `[Approve & Sign]` is still a local state transition, not a real signature. Unaffected by DECISION-9.

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
