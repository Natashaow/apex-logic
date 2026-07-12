# CLAUDE.md — Apex Logic Working Rules

**You are working in a mature, spec-driven codebase. Read the map before touching the territory.**

---

## 1. Read-first sequence (mandatory, in order)

Before *any* response that proposes a change, read these files:

1. `APEX_LOGIC_PLAN.md` — master plan, stack, file map, build sequence
2. `memory-bank/ACTIVE_CONTEXT.md` — current phase, recent decisions, and the **In Progress** section (concurrent-session markers)
3. `memory-bank/PROGRESS.md` — what is done / not started / blocked
4. `memory-bank/DECISIONS.md` — 8 locked decisions with rationale (DECISION-0A through DECISION-8). Do not contradict any of these.
5. `memory-bank/COMPONENT_MAP.md` — cascade tracker. Mandatory before editing any component or token.

If your change touches a spec: also read the relevant `src/docs/component-specs.md` SPEC block. If it touches a data shape: also read `src/docs/app-context-contract.md`.

---

## 2. What Apex Logic is (one paragraph — grounds every judgment call)

Apex Logic is a client-side dashboard (React 19 + Vite + Tailwind 4, no backend) that positions itself as a **control plane and translation ledger** for autonomous AI agents. Its core narrative symbol is **The Rationale Void → The Intent Ledger**, gated by **The Apex Checkpoint** (see `DECISION-7`). The primary persona is the **Architect-Governor** (Tech Lead / Pod Architect); the aesthetic is **Cyberpunk Bloomberg Terminal** — institutional density with a live phosphor edge. When in doubt about a design or copy call, ask: *does this close a piece of the Rationale Void, or reopen one?*

---

## 3. Locked design constraints (do not violate)

| Constraint | Rule | Rejection signal |
|---|---|---|
| Corners | `rounded-none` only. `rounded-full` allowed only on status dots. `rounded-sm` is the absolute maximum anywhere else. | If you catch yourself typing `rounded-md`, `rounded-lg`, `rounded-xl` — stop. |
| Numerics | `tabular-nums` on every stacking numeric column. | Any `text-*` on a metric without `tabular-nums` is a bug. |
| Type | `font-mono` (JetBrains Mono) for data, terminal, micro-labels, logo. `font-sans` (Space Grotesk) for panel headings and plain-English copy. | Introducing a third font family = violation of DECISION-3 / DECISION-5. |
| Canvas | `bg-neutral-950` base, `bg-neutral-900` header. Thin borders only — no shadows, no gradients, no glass. | If you're reaching for `shadow-*`, `bg-gradient-*`, or `backdrop-blur-*`, you're off-brand. |
| Accent | Cyan only: `text-cyan-400` / `border-cyan-500` / `bg-cyan-950/30` (DECISION-1). Do not introduce blue, violet, or any other interactive accent. | New color variables → violation. |
| Status colors | emerald = active, amber = paused/warning, crimson = error/danger. Never decorative. | Amber on a "success" state or emerald on an alert = wrong. |
| Human Intent visibility | `humanIntent-always-visible` — never hidden behind a click, hover, or drawer. | If a design collapses Human Intent, reject it. |
| Terminal | `terminal-continuous-scroll` — continuous animated scroll on `TerminalLog`. | Static log = violation of SPEC-04. |
| Paused state | `paused-state-must-pulse` — Amber PAUSED badge uses `animate-pulse`. | Static amber badge on a paused agent = violation of SPEC-02. |
| Plain-English first | `plainenglish-before-diff` — business risk summary always renders above the code diff in `AnomalyCard`. | Diff-first layout = violation of SPEC-03. |

The 8 locked DECISIONS live in `memory-bank/DECISIONS.md` — read the rationale there before proposing any change that touches these.

---

## 4. Load-bearing files (edit with extreme care)

Changes to these cascade widely. Consult `memory-bank/COMPONENT_MAP.md` before touching them.

| File | Cascades to | Rule |
|---|---|---|
| `src/tokens/theme.js` | **Everything.** `tokens.accent` and `statusTokenMap` touch every visual component. | Token changes require a `DECISIONS.md` entry with downstream impact listed. |
| `src/components/AppContext.jsx` | Every component using `useContext(AppContext)` — that's every section + ui component. State shape is contracted in `src/docs/app-context-contract.md`. | Add derived state; don't rename existing state. If you must, list every consumer first. |
| `src/data/mockLedgerData.json` | `agents[]` → AgentBlock/AuditStream/AppContext. `ledgerEntries[]` → LedgerRow/IntentLedger. `trappedAnomalies[]` → AnomalyCard/CircuitBreakerGate (+ header escalation via SPEC-07). `terminalLogs[]` → TerminalLog. `systemMetrics{}` → SystemHeader. | Data-shape changes are 🔴 HIGH severity. Add fields; don't rename or remove. |
| `src/components/layout/SystemHeader.jsx` / `ThreeColumnLayout.jsx` | Top-level layout — 25/45/30 column ratio is LOCKED (DECISION-0C). | Never change column proportions. |

---

## 5. When you see X, don't do Y (negative rules)

These are the fastest way to catch drift:

- **`ComplianceBadgeStrip`** was deliberately retired in Session 6 (see `ACTIVE_CONTEXT.md`). SPEC-06 is marked retired in `component-specs.md`. **Do not rebuild it.** If a status table anywhere says it's pending or done, that table is stale. Any return requires a new DECISION entry with founder sign-off.
- **No backend, no database, no server state library.** Apex Logic is client-only. If you find yourself reaching for `fetch`, an API route, `redux`, `zustand`, `tanstack-query`, or similar — stop. State lives in `AppContext.jsx` with mock data from `mockLedgerData.json`.
- **Do not edit files in `src/docs/`.** Those are reference documents authored deliberately upstream of code. Report needed changes to the user; don't apply them.
- **Do not make design decisions inline.** If a request would introduce a new color, font, layout ratio, or interaction pattern not already locked in `DECISIONS.md` — stop, name the decision, and ask the user to log it. Design decisions must be logged *before* code lands.
- **Do not add ornamentation.** No shadows, no gradients, no glass effects, no rounded card corners. The Thin-Lines rule (`ui-spec.md`) is non-negotiable.
- **Do not add a `tailwind.config.js`.** This is Tailwind v4 with CSS-first theming via `@theme` in `src/index.css`. See Session 4 note in `ACTIVE_CONTEXT.md`.

---

## 6. Session start protocol (concurrent-collision safety)

Session 6 in `ACTIVE_CONTEXT.md` documents a real incident: two concurrent sessions edited the same file with opposing intents, one clobbered the other, and it took a manual resolution to sort out. To prevent recurrence:

1. **Before editing any file**, read the `## In Progress (session markers)` section at the top of `memory-bank/ACTIVE_CONTEXT.md`. If another session has claimed the file you're about to touch, **pause and ask the user** before proceeding.
2. **When starting non-trivial work**, register yourself by adding a marker line under that section:
   `- [YYYY-MM-DD HH:MM] claude — editing [file paths] — [1-line intent]`
3. **When finishing**, remove your marker and append the change summary to the appropriate session block (following the format used in Sessions 3–6).
4. **If a status table in `PROGRESS.md` or `COMPONENT_MAP.md` contradicts what you see on disk**, trust the disk state and `DECISIONS.md`, then flag the mismatch to the user. Do not silently reconcile.

---

## 7. Commands

- `npm run dev` — Vite dev server with HMR
- `npm run build` — production build. Must exit clean. This is the ground-truth check.
- `npm run lint` — ESLint. Must exit with zero errors.
- `npm run preview` — preview the production build locally

Deploys are on Vercel (`vercel.json`) — do not run deploy commands without explicit user request.

---

## 8. Escalate to the user when

- A request would violate any locked DECISION (0A–8).
- A change would cascade to more than 3 files per `COMPONENT_MAP.md`.
- Two decisions or spec sections conflict (like the SPEC-06 / ComplianceBadgeStrip collision).
- The requested tech stack would need to expand — new library, backend, state manager, CSS framework.
- A `src/docs/` change is needed to make a code change sensible.
- A status table on disk contradicts observable file state.

Escalation is cheap. Silent reconciliation is expensive.

---

## 9. Style

- **Terse.** Match the register of the existing docs — declarative, no marketing language, no ornament.
- **Match existing patterns.** Component structure, import order, class ordering, prop naming — copy the closest neighbor in `src/components/`.
- **Comments** — write none by default. Only when the *why* is non-obvious (a hidden constraint, a subtle invariant, a workaround). Never restate the *what*.
- **No emoji** in code. Emoji in memory-bank docs is fine (the existing files use ✅/🔴/🟠/🟡/⚪ as severity markers) but don't invent new emoji vocabularies.
- **Cyberpunk Bloomberg register in copy.** Institutional, precise, declarative. Not friendly, not marketing.

---

## 10. Cursor parity

`.cursor/rules/apex-context.mdc` and `.cursor/rules/change-protocol.mdc` encode the same intent for Cursor sessions. If either of those files diverges from this one, the Cursor rules are the source of truth for context loading; this file is the source of truth for Claude-specific escalation and session-collision safety. Reconcile drift by editing both.
