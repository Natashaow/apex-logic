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
3. **Restart any running mediator** — a pre-`/precommit` instance was found live on port 4177. Until it restarts, Rationale Gate entries won't persist (the POST 404s silently, by design).
4. **`src/docs/` debt (user tasks, §5):** no `RationaleGate` SPEC block in `component-specs.md`; `app-context-contract.md` documents `applyLiveSnapshot` as 5 keys when it now conditionally applies 6.

**Last updated:** 2026-08-15

---

## Open Decisions

**None.** All visual, brand, UX-framing, and information-architecture decisions are locked — 20 entries, indexed at the top of `memory-bank/DECISIONS.md`.

The Session 12 process debt is closed: **DECISION-14 is signed off (2026-08-15)**. Rationale Gate keeps its full-width strip above the grid, persists local-only and gitignored, and is OPC-track scope. `COMPONENT_MAP.md` rows added. Two follow-ups remain — see Next Phase.

---

## Session 6 — Collision Incident (pointer)

Two concurrent sessions edited `App.jsx` with opposing intents; one rebuilt `ComplianceBadgeStrip` after the other had deliberately cut it, and it took manual resolution. **`ComplianceBadgeStrip` is retired — do not rebuild it** without a new DECISIONS entry reversing the cut. Full narrative: `memory-bank/SESSION_LOG.md` → Session 6. This incident is why `CLAUDE.md` §6 exists.

---

## Session 15 — 2026-08-15 (Test Framework + Rationale Gate Persistence)

**DECISION-15 — test framework (first stack expansion since DECISION-9).** Added `vitest`, `@testing-library/react`/`jest-dom`/`user-event`, `jsdom`, `@vitest/coverage-v8` as devDependencies. New `npm test` / `npm run test:watch`. Test config lives in the existing `vite.config.js` — no second config file, matching why `tailwind.config.js` doesn't exist. Dev-only surface: production bundle unchanged, DECISION-9's client-only constraint untouched. **§7 is unchanged** — `npm run build` + `npm run lint` remain the ground-truth gate; `npm test` is additive.

**12 tests, all passing**, over `RationaleGate.jsx` and `AppContext.jsx`. One is an **executable check of §3's Thin-Lines rule** — asserts no `rounded-*` beyond `rounded-none`, no `shadow-`, `bg-gradient-`, or `backdrop-blur` in rendered markup. That converts a constraint previously enforced by remembering to grep into one the suite enforces, which matters now that several agents write here.

**DECISION-14 Q2 — persistence, built with §8 go-ahead.** New `pre_commitment` event type end-to-end:
- `mediator.mjs` — added `POST /precommit`; routing refactored to a table so a third route doesn't mean a third copy of the transport code. `/resolve` behaviour unchanged.
- `sync-activity-log.mjs` — folds `pre_commitment` into `preCommitments[]` plus a `RATIONALE_LOGGED` terminal line and an Activity Log section. Deliberately inert: no agent status change, no ledger entry, no `systemMetrics` effect.
- `AppContext.jsx` — `logPreCommitment` POSTs fire-and-forget; `applyLiveSnapshot` applies `snapshot.preCommitments` **guarded**, so an older `ledger-state.json` can't blank the seed.
- `.gitignore` needed no change — `public/generated/ledger-state.json` already covered.

**Verification:** `npm run lint`, `npm run build`, `npm test` (12/12) all clean. Pipeline smoke-tested end-to-end against a throwaway `VAULT_ROOT` on an isolated port: valid POST recorded, invalid POST rejected with the right message, `/resolve` regression-free, `preCommitments[]` + terminal line + Activity Log section all correct. Then reset — original `ledger-state.json` restored, throwaway vault removed, real vault confirmed untouched at 44 lines.

**Caught during that test:** a mediator was already running on port 4177 from an earlier session, so the first POST attempt hit **that** process, which points at the real vault. It 404'd (pre-edit code, no `/precommit` route) and nothing leaked — verified. Re-run on port 4188. **Any running mediator must be restarted** to serve `/precommit`.

**Config (corrects Session 13):** the `disabledMcpServers` key was wrong — `claude mcp list` showed all six still loading. Replaced with `disableClaudeAiConnectors: true`, verified 31 → 17 servers. Then per Natasha, six user-scoped servers removed globally (`glif`, `motion`, `motion-plus`, `streamable-mcp-server`, `playwright`, `obsidian-api`), leaving 4: `perplexity`, `firecrawl`, `obsidian-vault`, `qmd`. Definitions backed up to `~/.claude/mcp-servers-backup-2026-08-15.json`.

**Not done, flagged per §5:** `src/docs/component-specs.md` still has no `RationaleGate` SPEC block, and `src/docs/app-context-contract.md` now understates `applyLiveSnapshot` (documents 5 keys; it conditionally applies a 6th). Both are user tasks. `scripts/*.mjs` remain unit-untestable due to module-level side effects — covered by smoke test, not refactored.
