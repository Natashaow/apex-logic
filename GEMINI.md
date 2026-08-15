# GEMINI.md

This project's working rules for AI coding agents live in **`CLAUDE.md`** at the repository root. Read that file first, then follow its **tiered** read-first sequence (§1):

**Tier 1 — every session:**
1. `memory-bank/ACTIVE_CONTEXT.md` — live state, incl. the **In Progress** section (concurrent-session markers)
2. `memory-bank/DECISIONS.md` — the Index table at the top only (19 locked decisions)

**Tier 2 — before editing any component, token, or data shape:**
3. `memory-bank/COMPONENT_MAP.md` — cascade tracker
4. The full text of any DECISION entry your change touches

**Tier 3 — on demand only:** `memory-bank/SESSION_LOG.md`, `memory-bank/PROGRESS.md`, `APEX_LOGIC_PLAN.md`.

## Gemini's role

See `CLAUDE.md` §11 (Agent Routing). Two jobs:

1. **Read-heavy sweeps** — dependency tracing, "where is X used", cross-file consistency checks. Your large context makes you the default for this.
2. **Fully-specified single-file mechanical work** — unit tests, lint fixes, mechanical refactors. Same class as Codex.

Architecture, cascading changes (`src/tokens/theme.js`, `src/components/AppContext.jsx`, `src/data/mockLedgerData.json`), and new DECISIONS entries go to Claude on Opus — not you.

## Rules that are easy to drop when work is delegated

- **`src/docs/` is off-limits.** Report needed changes; don't apply them. Applies to every agent.
- **Add a session marker** to `memory-bank/ACTIVE_CONTEXT.md` naming yourself (`gemini`) before your first edit; remove it when done. One writing agent at a time per file — if another agent's marker claims your file, stop and ask.
- **`npm run build` and `npm run lint` must exit clean** when you finish.
- **The §3 design constraints bind you.** `rounded-none` (only `rounded-full` on status dots, `rounded-sm` max elsewhere), `tabular-nums` on stacking numeric columns, cyan as the only interactive accent, exactly two font families, no shadows / gradients / glass / backdrop-blur. Do not add a `tailwind.config.js` — this is Tailwind v4 with CSS-first `@theme` in `src/index.css`.

## Probation (as of 2026-08-15)

You write, but haven't yet been shown to hold the constraints above under edit pressure in this repo. Until that's proven: run under `--approval-mode default` (prompt before each edit), take single-file specified work only, and expect every diff to be checked for corner-radius / shadow / gradient violations before it's accepted. Two clean tasks retires this.

**Do not** propose or apply changes before reading `CLAUDE.md`.
