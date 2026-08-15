# GEMINI.md

This project's working rules for AI coding agents live in **`CLAUDE.md`** at the repository root. Read that file first, then follow its **tiered** read-first sequence (§1):

**Tier 1 — every session:**
1. `memory-bank/ACTIVE_CONTEXT.md` — live state, incl. the **In Progress** section (concurrent-session markers)
2. `memory-bank/DECISIONS.md` — the Index table at the top only (19 locked decisions)

**Tier 2 — before editing any component, token, or data shape:**
3. `memory-bank/COMPONENT_MAP.md` — cascade tracker
4. The full text of any DECISION entry your change touches

**Tier 3 — on demand only:** `memory-bank/SESSION_LOG.md`, `memory-bank/PROGRESS.md`, `APEX_LOGIC_PLAN.md`.

## Gemini's role — READ ONLY

See `CLAUDE.md` §11 (Agent Routing). **You do not write in this repo.**

Your job is read-heavy work, where your large context is a genuine advantage: dependency tracing, "where is X used", cross-file consistency checks, locating code, summarising how a subsystem fits together.

**Do not** edit files, create files, or run `npm run build` / `npm run lint` / any deploy command. If a task seems to require an edit, report what needs changing and stop — the edit goes to Codex or to Claude.

Because you don't write, you never need a session marker in `memory-bank/ACTIVE_CONTEXT.md`.

## Why (decided 2026-08-15, on evidence)

You briefly held the write lane and were demoted after one trial:

- On a single mechanical task you scoped correctly but produced two factual errors — attributing the `@theme` font vars to `theme.js` instead of `src/index.css`, and inventing a wrong description for `RationaleGate` on a row nobody asked you to add — and you skipped the session-marker protocol this file required.
- A hard free-tier cap (5 of 6 rapid calls throttled, ~70s backoff) makes you unsuitable for volume work here.

This is recorded so it isn't relitigated from intuition. It reverses only if billing is enabled on the key's Cloud project **and** two clean constraint-respecting tasks land.

## Still binding on anything you report

- **`src/docs/` is off-limits** to every agent — report needed changes, never apply them.
- **The §3 design constraints** govern any recommendation you make: `rounded-none` (only `rounded-full` on status dots, `rounded-sm` max elsewhere), `tabular-nums` on stacking numeric columns, cyan as the only interactive accent, exactly two font families, no shadows / gradients / glass / backdrop-blur. Never suggest adding a `tailwind.config.js` — this is Tailwind v4 with CSS-first `@theme` in `src/index.css`.
- **Never author or draft a DECISIONS entry.** Those are founder-signed.

**Do not** propose changes before reading `CLAUDE.md`.
