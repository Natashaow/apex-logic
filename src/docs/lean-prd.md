# Lean PRD: Apex Logic Control Plane
> Technical Scope, Feature Architecture & Data Specifications

---

## 1. Product System Architecture

Client-Side State Engine — React + tokenized Cyberpunk Bloomberg Terminal framework.
- **Theme:** `bg-neutral-950`, `font-mono`, razor-thin borders
- **State Management:** React Context (Token Budgets, Active Diffs, Agent Records)

```
┌────────────────────────────────────────────────────────┐
│                      React Context                     │
│  (Manages Token Budgets, Active Diffs, Agent Records)  │
└───────────────────────────┬────────────────────────────┘
                            │
       ┌────────────────────┼────────────────────┐
       ▼                    ▼                    ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│ Left Column  │    │Center Column │    │ Right Column │
│  Traceable   │    │  Intent &    │    │ The Circuit  │
│ Audit Stream │    │Asset Ledger  │    │ Breaker Gate │
└──────────────┘    └──────────────┘    └──────────────┘
```

---

## 2. Core Functional Requirements

### Feature 1: The Traceable Audit Stream (Left Column)
- **User Value:** Eradicates AI "Shadow Execution Risk" with a visual registry of multi-agent handoffs.
- **Technical Requirement:** Real-time registry of executing corporate agent processes. Each block shows runtime state (idle, processing, paused). Below: rolling terminal printing live technical logs (timestamp, agent ID, execution latency, token velocity) via client-side interval timer.

### Feature 2: The Intent-to-Asset Ledger (Center Column)
- **User Value:** Mitigates Memory Tax and Translation Gap by anchoring raw machine metadata to the master human business purpose.
- **Technical Requirement:** High-density data table. Each row binds:
  - **Human Intent** — The natural language prompt that initiated the loop chain.
  - **Machine Assumption** — The explicit hypothesis the agent formulated.
  - **Technical Trace** — Model tier, latency variance.
  - **Real-Time P&L** — Direct dollar expenditure as variable COGS + AER.

**Formulas:**
- `Compute Cost (COGS) = Input Token Cost + Output Token Cost + Latency Overhead`
- `AER = Attributed Business Revenue / Compute Cost`

### Feature 3: The Circuit-Breaking Human Gate (Right Column)
- **User Value:** Eliminates Approval Fatigue by isolating high-risk anomalies.
- **Technical Requirement:** Stack of trapped anomaly alert cards. On card registration, corresponding agent switches to flashing Amber-coded [PAUSED] state.
- **Interactive Controls:**
  - Plain-English Rationale View (business threat summary)
  - Expandable Technical Drawer (raw code diff + technical trace)
  - `[Approve & Sign]` — Flushes card, returns agent to processing, commits asset to ledger
  - `[Reject & Kill]` — Flushes card, terminates agent thread, logs CRITICAL_HALT to console

---

## 3. Scope Guardrails (Will Not Build)

- **No Live API Integrations** — All logs, entries, and code changes loop from local static JSON. Zero live Anthropic/OpenAI API calls.
- **No Genuine Cryptographic Signing** — Signature action driven purely by local React state updates. No Web3 wallet or hardware verification.
- **No Database Architecture** — Dashboard lives entirely in volatile React state (useState). Browser refresh resets to default mock values.
