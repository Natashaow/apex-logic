# PROGRESS TRACKER
> Build status. **Tier 3 — read on demand** (see `CLAUDE.md` §1). Session narrative lives in `memory-bank/SESSION_LOG.md`.

---

## Legend
- ✅ DONE — complete, tested, locked
- 🔲 NOT STARTED — ready to build once dependencies are met
- ⚠️ DECISIONS PENDING — exists but has unresolved choices
- 🚫 BLOCKED — cannot proceed until another task completes
- 🔄 IN PROGRESS — currently being worked on

---

## Status Summary

| Layer | Status |
|---|---|
| Infrastructure (`.cursor/rules/`, `memory-bank/`) | ✅ DONE — 5 files, incl. `SESSION_LOG.md` (DECISION-13) |
| Reference Docs (`src/docs/`) | ✅ DONE — 12 files, one exception below |
| Branding Docs (`src/docs/branding/`) | ✅ DONE — 6 files, all decisions LOCKED |
| Data Layer (`src/data/`) | ✅ DONE — `strategy.js`, `assumptions.js`, `users.js`, `mockLedgerData.json` |
| Token Layer (`src/tokens/theme.js`) | ✅ DONE — no PENDING comments, cyan accent live |
| Application Code (`src/`) | ✅ DONE — `main.jsx` (untouched), `index.css`, `App.jsx` |
| Components (`src/components/`) | ✅ DONE — 11 components + `RationaleGate` (Session 12) |
| Screens (`src/components/screens/`) | ✅ DONE — `IntroScreen.jsx`, wired via `showIntro` |
| Interactions | ✅ DONE — all 6 wired and browser-verified (Session 11) |

**Only non-DONE item:** `src/docs/business-model.md` — ⚠️ DECISIONS PENDING. Revenue streams + sustainability plan drafted for a competition application. Grounded in the locked personas, but tiers/price points are PROPOSED, not founder-locked — see the provenance note in the doc.

---

## Components — Tracking Notes

All 11 Phase 2 components are built, plus `sections/RationaleGate.jsx` (Session 12). Two carry standing notes:

- **`sections/RationaleGate.jsx`** — built Session 12 under deadline as an explicit MVP. **Not yet tracked** in `COMPONENT_MAP.md`, not spec'd in `component-specs.md`, no DECISIONS entry, no unit tests, no full `ui-spec.md` visual QA. Local session state only — resets on refresh, not wired into the live pipeline.
- **`layout/ComplianceBadgeStrip.jsx` — RETIRED, deliberately absent.** Cut from the live dashboard per an explicit product decision (see `SESSION_LOG.md` Session 6 and `component-specs.md` SPEC-06). A concurrent session once rebuilt it under the impression its absence was a tracking bug — it was not. **Do not re-add** without a new entry in `memory-bank/DECISIONS.md`.

---

## Next Gate

Phases 0–3 are complete and closed. Session 11 ran the standing Phase 3 human visual QA gate in a real browser and passed with zero findings requiring a design decision.

The three open threads are tracked in `ACTIVE_CONTEXT.md` → **Next Phase**:
1. Wire a real `Workflow`/`CronCreate`/`/loop` run to act on a mediator resolution event (Session 7 records only).
2. `src/docs/component-specs.md` — SPEC-01 live-track variant + a `RationaleGate` SPEC block. **User tasks**, not agent tasks (`CLAUDE.md` §5).
3. Session 12 follow-ups — `COMPONENT_MAP.md` entry, live-pipeline wiring, unit tests.

---

## Known Stale Content — flagged, not silently reconciled

Per `CLAUDE.md` §6.4, these contradict disk state and need a founder call rather than a quiet fix:

- **`APEX_LOGIC_PLAN.md` line 62** — `📁 src/components/ — UI Components (ALL NOT STARTED)`. Every component is built and shipped.
- **`APEX_LOGIC_PLAN.md` "Pending Decisions (Must Resolve Before Building)"** — all four were resolved as DECISION-1 through DECISION-4 in Session 2.

Both are why `APEX_LOGIC_PLAN.md` is Tier 3 under DECISION-13 — it is now largely a historical planning artifact.
