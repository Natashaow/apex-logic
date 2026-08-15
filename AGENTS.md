# AGENTS.md

This project's working rules for AI coding agents live in **`CLAUDE.md`** at the repository root. Read that file first, then follow its **tiered** read-first sequence (§1):

**Tier 1 — every session:**
1. `memory-bank/ACTIVE_CONTEXT.md` — live state, incl. the **In Progress** section (concurrent-session markers)
2. `memory-bank/DECISIONS.md` — the Index table at the top only (19 locked decisions)

**Tier 2 — before editing any component, token, or data shape:**
3. `memory-bank/COMPONENT_MAP.md` — cascade tracker
4. The full text of any DECISION entry your change touches

**Tier 3 — on demand only:** `memory-bank/SESSION_LOG.md`, `memory-bank/PROGRESS.md`, `APEX_LOGIC_PLAN.md`.

## Codex's role

See `CLAUDE.md` §11 (Agent Routing). **Codex owns the mechanical lane** — it is the default destination for any work specified enough to hand off: lint/build fixes, mechanical refactors, drafting memory-bank entries from a spec, and tests once a runner exists. Gemini reads only (demoted 2026-08-15 on quality and rate-limit evidence), so this lane does not get split.

Architecture, cascading changes (`src/tokens/theme.js`, `src/components/AppContext.jsx`, `src/data/mockLedgerData.json`), and new DECISIONS entries go to Claude on Opus — not you.

**Note:** this repo has **no test framework** — no runner, no `test` script in `package.json`. Adding `vitest`/`@testing-library/react` is a stack expansion requiring founder sign-off per §8. Do not install it on your own initiative.

Three rules that are easy to drop when work is delegated:

- **`src/docs/` is off-limits.** Report needed changes; don't apply them. This applies to every agent, not just Claude.
- **Add a session marker** to `memory-bank/ACTIVE_CONTEXT.md` naming yourself (`codex`) before your first edit; remove it when done. One writing agent at a time per file.
- **`npm run build` and `npm run lint` must exit clean** when you finish.

Cursor-native sessions are additionally governed by `.cursor/rules/apex-context.mdc` and `.cursor/rules/change-protocol.mdc`; Gemini by `GEMINI.md`. All encode the same intent.

**Do not** propose or apply changes before reading `CLAUDE.md`.
