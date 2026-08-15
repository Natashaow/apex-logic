# CLAUDE.md — Apex Logic Working Rules

**You are working in a mature, spec-driven codebase. Read the map before touching the territory.**

---

## 1. Read-first sequence (tiered — DECISION-13)

Read by tier, not all at once. This replaced a flat 5-file / ~860-line mandatory chain that was paid in full on every session regardless of task size.

**Tier 1 — every session, before any response that proposes a change (~66 lines):**
1. `memory-bank/ACTIVE_CONTEXT.md` — live state: the **In Progress** section (concurrent-session markers), Current Status, Open Decisions, newest session block.
2. `memory-bank/DECISIONS.md` — **the Index table at the top only.** 19 locked decisions. Do not contradict any of them.

**Tier 2 — before editing any component, token, or data shape:**
3. `memory-bank/COMPONENT_MAP.md` — cascade tracker. Mandatory before touching any component or token.
4. The **full text** of any DECISION entry your change touches — scan the Tier 1 Index to find which.
5. If your change touches a spec: the relevant `src/docs/component-specs.md` SPEC block. If it touches a data shape: `src/docs/app-context-contract.md`.

**Tier 3 — on demand only, not by default:**
- `memory-bank/SESSION_LOG.md` — historical session narrative. Read when you need the *why* behind a past change.
- `memory-bank/PROGRESS.md` — build status. Mostly ✅; read when you need to confirm what exists.
- `APEX_LOGIC_PLAN.md` — original master plan. **Largely a historical artifact now** — it contains known-stale status lines (see `PROGRESS.md` → Known Stale Content). Trust disk state over it.

If Tier 1 doesn't tell you what you need, escalate a tier. Don't skip Tier 2 before editing code.

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

The 19 locked DECISIONS live in `memory-bank/DECISIONS.md` — scan the Index table, then read the rationale for any entry your change touches before proposing it.

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
- **No backend, no database, no server state library — narrowly unlocked by DECISION-9 (2026-08-15).** Apex Logic is client-only by default. The one exception: `AppContext.jsx` may `fetch()` a locally-generated `public/generated/ledger-state.json` (polled on an interval) and POST to a local mediator endpoint (`scripts/mediator.mjs` or equivalent) for Approve/Reject/Emergency Stop resolution — see DECISION-9 and the vault's [[2026-08-15 Action Plan - Apex Logic Live Data Architecture]] for exact scope. Nothing beyond that: no hosted server, no database engine, no `redux`/`zustand`/`tanstack-query`, no third-party API calls. `src/data/mockLedgerData.json` remains the public deploy's data source — the real feed is local-only and `.gitignore`d.
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
3. **When finishing**, remove your marker, then: append your session block to `memory-bank/SESSION_LOG.md` (newest first), rotate the previous newest block out of `ACTIVE_CONTEXT.md`, and update only `Current Status` / `Open Decisions` there. `ACTIVE_CONTEXT.md` carries **one** session block, never a growing stack — without this it regrows past 200 lines within a few sessions and DECISION-13's saving evaporates.
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

`.cursor/rules/apex-context.mdc` and `.cursor/rules/change-protocol.mdc` encode the same intent for Cursor sessions. `AGENTS.md` does the same for Codex, `GEMINI.md` for Gemini. If any of those diverges from this one, the Cursor rules are the source of truth for context loading; this file is the source of truth for escalation, routing, and session-collision safety. Reconcile drift by editing all of them.

---

## 11. Agent routing (multi-agent — read before delegating)

Four agents work this repo. Route by difficulty, not convenience — Opus is the scarce resource.

| Agent | Owns |
|---|---|
| **Claude (Opus — `/model opus`)** | `src/tokens/theme.js`, `src/components/AppContext.jsx`, `src/data/mockLedgerData.json` — anything cascading per `COMPONENT_MAP.md`. New `DECISIONS.md` entries. The mediator-resolution wiring. Vault/QMD work. Any §8 escalation. |
| **Claude (Sonnet — default)** | Routine multi-file edits inside settled specs; session bookkeeping in `ACTIVE_CONTEXT.md` / `SESSION_LOG.md`. |
| **Codex** | **Owns the mechanical lane.** Fully-specified single-file work: lint/build fixes, mechanical refactors, drafting memory-bank entries from a spec, and tests once a runner exists. Default destination for anything specified enough to hand off. |
| **Cursor** | In-editor component tweaks with the dev server live — Tailwind class work, visual iteration against `ui-spec.md`. |
| **Gemini** | **Reads only.** Repo sweeps, dependency tracing, "where is X used", cross-file consistency checks. Never writes, never runs build/lint/deploy. Demoted from the write lane on 2026-08-15 — see below. |

**Rules that survive the hand-off.** A second agent is exactly where these get dropped:

- **`src/docs/` is off-limits to every agent, not just Claude** (§5). Delegating a `src/docs/` edit to Codex or Cursor launders the rule, it doesn't satisfy it. Those changes are the user's to make.
- **`DECISIONS.md` entries are drafted by an agent, authored by the founder.** No agent decides retroactively to justify code that already landed. (Session 12's `RationaleGate` did exactly this — it's outstanding debt, not precedent.)
- **Every locked constraint in §3 binds every agent.** `rounded-none`, `tabular-nums`, cyan-only accent, no shadows/gradients/glass, no third font, no `tailwind.config.js`.
- **`npm run build` + `npm run lint` must exit clean** after any agent's work (§7). Same gate, no exceptions.

**Collision safety (§6 applies with more force here).** Codex, Cursor, and Gemini cannot see each other's edits, and Session 6 already cost a manual resolution with only two agents.

- Every *writing* agent adds a marker to `ACTIVE_CONTEXT.md` naming itself (`claude` / `codex` / `cursor`) before its first edit, and removes it when done.
- **One writing agent at a time per file.** If a marker claims the file you're about to touch, stop and ask the user.
- Gemini reads only, so it never needs a marker. Read-only sweeps need no marker whichever agent runs them.

**Why Gemini reads only (decided 2026-08-15).** It was briefly given the write lane, then demoted on evidence from a single trial. Recorded so this isn't relitigated from intuition:

- **Quality — 0 of 2 on probation.** Its one task (`APEX_LOGIC_PLAN.md` stale-status fix) scoped correctly — one file, no collateral, all five instructed changes, options-history preserved — but it attributed the `@theme` font vars to `theme.js` instead of `src/index.css`, invented a wrong description for `RationaleGate` on a table row nobody asked it to add, and **skipped the session-marker protocol** that `GEMINI.md` explicitly requires. Both factual errors were caught only because the diff was reviewed.
- **Capacity — hard free-tier cap.** Measured: 5 of 6 rapid calls throttled on `generate_content_free_tier_requests` (`limit: 5`), with ~70s backoff mid-task. Note this is a property of the **Google Cloud project's billing, not the API key** — rotating keys does nothing. Confirmed empirically after a key swap changed the string but not the behaviour.

**What would reverse this:** billing enabled on the key's Cloud project (lifting the cap), *and* two clean constraint-respecting tasks under `--approval-mode default`. Both, not either.

Its large context still makes it the best choice for read-heavy sweeps — that's a real strength, and why it stays in the table rather than being dropped.
