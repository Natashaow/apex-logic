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

**Last updated:** 2026-08-16

---

## Open Loops

Everything outstanding, newest concern first. Nothing here is blocking a build — `npm run build`, `npm run lint`, and `npm test` (12/12) are all clean.

**Needs Natasha — cannot be delegated to any agent**
1. **`src/docs/` debt (§5 puts it off-limits to every agent).** Three edits: a `RationaleGate` SPEC block in `component-specs.md`; SPEC-01's live-track `LedgerRow` variant, still undocumented since Session 8; and `app-context-contract.md`, which describes `applyLiveSnapshot` as overwriting five keys when it now conditionally applies a sixth (`preCommitments`).

**Unverified — built but never exercised for real**
2. **Rationale Gate persistence has not been confirmed in the running app.** DECISION-14 Q2 is built, unit-tested, and smoke-tested against a throwaway vault, but nobody has run `npm run dev` + `npm run watch-activity`, logged an entry, and refreshed. Until that happens, "it persists" is an inference, not an observation.

**Known gaps, deliberately not fixed**
3. **Mediator resolution events still don't *act*.** Open since Session 7 — `POST /resolve` records an Approve/Reject decision, but no paused `Workflow`/`CronCreate`/`/loop` run notices or resumes. The control plane records; it does not yet control.
4. **The mediator is unsupervised.** If the process dies, pre-commitments stop persisting **silently** — the POST is fire-and-forget by design, so nothing surfaces in the UI. A launchd agent or a `.zshrc` line would fix it; that's a new decision, not a slip-in. Currently running as PID 84315 (restarted 2026-08-16).
5. **`scripts/*.mjs` are not unit-testable.** Both call `sync()`/`listen()` at import and `process.exit` without `VAULT_ROOT`, so they can't be imported under test. Covered by the end-to-end smoke test instead. Making them testable is a load-bearing refactor needing its own entry.

**Tooling decisions parked**
6. **Gemini is read-only** until billing is enabled on its Cloud project **and** two clean constraint-respecting tasks land. See `CLAUDE.md` §11 for the evidence.
7. **Six MCP servers were removed from user scope globally** (`glif`, `motion`, `motion-plus`, `streamable-mcp-server`, `playwright`, `obsidian-api`). If anything elsewhere depended on them, definitions are at `~/.claude/mcp-servers-backup-2026-08-15.json`.

---

## Open Decisions

**None.** All visual, brand, UX-framing, and information-architecture decisions are locked — 21 entries, indexed at the top of `memory-bank/DECISIONS.md`.

The Session 12 process debt is closed: **DECISION-14 is signed off (2026-08-15)** — full-width strip retained, entries persist local-only and gitignored, OPC-track scope. **DECISION-15** added the test framework. Remaining work is execution and documentation, not decisions — see Open Loops.

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
