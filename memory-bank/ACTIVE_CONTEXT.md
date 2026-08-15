# ACTIVE CONTEXT
> Live state only. **Tier 1 — read this every session** (see `CLAUDE.md` §1).
> Historical session narrative lives in `memory-bank/SESSION_LOG.md` (Tier 3) per DECISION-13.

---

## In Progress (session markers)
<!-- Concurrent-session collision safety — see CLAUDE.md §6 and the Session 6 note below. -->
<!-- Before editing a file, add a marker naming your agent: -->
<!--   - [YYYY-MM-DD HH:MM] <claude|codex|cursor> — editing <file paths> — <1-line intent> -->
<!-- Remove your marker when done. Empty is the default state. -->

_(none)_

---

## Current Status

**Phase:** Phases 0–3 COMPLETE. All 11 components built, all 6 interactions wired, Phase 3 human visual QA passed in a real browser (Session 11, zero findings). `npm run build` + `npm run lint` both clean.

**Live vs. mock:** DECISION-9 unlocked a local-only live data layer — `scripts/sync-activity-log.mjs` + `scripts/mediator.mjs` + `src/hooks/useLiveLedgerData.js`. Active in local dev only; `mockLedgerData.json` remains the public deployment's sole data source and the real feed is gitignored (public repo).

**Active scope (per Natasha, 2026-08-15):** OPC/personal track is the build target. B2B enterprise track is deferred until a "de-Natasha-ify" generalization pass later — see `Apex Logic.md` in the vault.

**Next Phase — three open threads:**
1. Wire a real `Workflow`/`CronCreate`/`/loop` run to *act* on a mediator resolution event. Session 7 only records decisions; nothing resumes or aborts yet.
2. Human pass on `src/docs/component-specs.md` — SPEC-01 needs the live-track LedgerRow variant (Session 8), and `RationaleGate` needs a SPEC block (Session 12). **Both are user tasks**, not agent tasks — `CLAUDE.md` §5 puts `src/docs/` off-limits to every agent.
3. **Rationale Gate persistence (DECISION-14 Q2).** Write `preCommitments[]` through the local pipeline so it survives refresh, local-only and gitignored. Touches `AppContext.jsx`, `scripts/sync-activity-log.mjs`, `useLiveLedgerData.js`, `.gitignore` — **>3 files, two 🔴 HIGH**, so it needs explicit §8 go-ahead.
4. **No test framework exists.** `package.json` has no `test` script and no runner installed. Unit tests for anything require adding `vitest` + `@testing-library/react` — a stack expansion needing §8 sign-off.

**Last updated:** 2026-08-15

---

## Open Decisions

**None.** All visual, brand, UX-framing, and information-architecture decisions are locked — 20 entries, indexed at the top of `memory-bank/DECISIONS.md`.

The Session 12 process debt is closed: **DECISION-14 is signed off (2026-08-15)**. Rationale Gate keeps its full-width strip above the grid, persists local-only and gitignored, and is OPC-track scope. `COMPONENT_MAP.md` rows added. Two follow-ups remain — see Next Phase.

---

## Session 6 — Collision Incident (pointer)

Two concurrent sessions edited `App.jsx` with opposing intents; one rebuilt `ComplianceBadgeStrip` after the other had deliberately cut it, and it took manual resolution. **`ComplianceBadgeStrip` is retired — do not rebuild it** without a new DECISIONS entry reversing the cut. Full narrative: `memory-bank/SESSION_LOG.md` → Session 6. This incident is why `CLAUDE.md` §6 exists.

---

## Session 13 — 2026-08-15 (Read-First Chain Reduction + Multi-Agent Routing — DECISION-13)

**Why:** An adjacent session ran out of tokens mid-flight. Root cause was fixed per-session overhead, not working style — a flat ~860-line mandatory read chain, plus 18 plugins and 10 MCP servers loading on a no-backend React dashboard.

**Docs restructured (DECISION-13):**
- New `memory-bank/SESSION_LOG.md` — Sessions 2–12, the archived `PROGRESS.md` detail tables, the 2026-07-12 QA results, and the closed Phase 3 prompt.
- `ACTIVE_CONTEXT.md` 247 → 60 lines (live state only); `PROGRESS.md` 169 → 60 (summary + stale-content flags); `DECISIONS.md` +47 (19-row scan Index + DECISION-13).
- `CLAUDE.md` §1 rewritten as three tiers; §6.3 gained the rotation rule that keeps `ACTIVE_CONTEXT.md` from regrowing; §3 decision count corrected 8 → 19; new §11 Agent Routing.
- Parity per §10: `AGENTS.md` (Codex), `.cursor/rules/apex-context.mdc` (Cursor), new `GEMINI.md` (Gemini).
- **Gemini writes** — initially scoped read-only, corrected same session. It has full write capability (`--approval-mode default/auto_edit/yolo`; `plan` is the read-only mode) and free-tier capacity, so restricting it to lookups while paying Opus for mechanical edits was backwards. On probation per §11 until it's shown to hold the §3 constraints under edit pressure.

**Tooling:** Gemini CLI 0.55.1 installed. `.claude/settings.local.json` (gitignored) disables 7 irrelevant plugins + 6 MCP servers for this repo only — `qmd` and `obsidian-vault` deliberately kept. Global default model set to Sonnet; Opus is now an explicit `/model` escalation.

**Measured:** default session read ~860 → ~85 lines (`ACTIVE_CONTEXT.md` 60 + DECISIONS Index ~25).

**Verification:** `npm run lint` and `npm run build` both clean. No source files touched.

**Not done:** the two stale `APEX_LOGIC_PLAN.md` lines are flagged in `PROGRESS.md`, not fixed — they need a founder call per §6.4. The MCP-server half of the config trim uses a `disabledMcpServers` key that could not be confirmed from the CLI bundle; verify with `/mcp` next session and fall back to the `/mcp` UI if it didn't take.
