# ACTIVE CONTEXT
> This file is updated after every work session. Read it first to know where we are.

---

## Current Status
**Phase:** Phase 0 COMPLETE — Brand Foundation locked. Phase 1 COMPLETE (retroactively verified, see Session 4 note below). UX reasoning layer (Session 3) also complete.
**Next Phase:** Phase 2 — Component Build (in progress)
**Last updated:** 2026-07-12

---

## Session 5 — Intro Screen (Parallel Track)

**What:** Built `src/components/screens/IntroScreen.jsx` — a standalone intro/splash screen (logo mark + locked `brand.tagline` + new plain-English descriptor + animated boot-sequence fade-in + `[Enter Control Plane]` CTA).
**Files modified:** `src/components/screens/IntroScreen.jsx` (new), `memory-bank/DECISIONS.md` (DECISION-8), `memory-bank/COMPONENT_MAP.md`, `memory-bank/PROGRESS.md`.
**Downstream impact:** None yet — deliberately NOT wired into `App.jsx`, since Phase 2's component build (`AppContext.jsx` → `SystemHeader.jsx` → `ThreeColumnLayout.jsx`) is actively in progress on that file. This was worked as an explicitly parallel, non-blocking track per founder request ("let's work on other things while Phase 2 builds").
**Decision logged:** Yes — DECISION-8 in `memory-bank/DECISIONS.md`.

**Next step for this track:** When Phase 2's `App.jsx` reaches final assembly (Step 9 in the Build Sequence), add a `showIntro` boolean state and conditionally render `<IntroScreen onEnter={() => setShowIntro(false)} />` before the dashboard tree. Do not do this preemptively — wait until `App.jsx` is no longer mid-build to avoid merge conflicts with the active Phase 2 session.

---

## Session 4 — Correction + Phase 2 Kickoff

**Tracker correction:** This file and `PROGRESS.md` previously said Phase 1 — Token Resolution was not started. That was stale. On inspection, the code already had it done: `src/tokens/theme.js` has no PENDING comments and cyan is the live accent; `index.html` already loads the combined JetBrains Mono + Space Grotesk Google Fonts link; `src/index.css` already defines `--font-sans` / `--font-mono` in a Tailwind v4 `@theme` block. **Note:** this project uses Tailwind v4's CSS-first theming — there is no `tailwind.config.js`, so the old Phase 1 checklist item to "extend `tailwind.config.js` fontFamily" does not apply; the equivalent work already lives in `index.css`.

**New reference doc added:** `src/docs/app-context-contract.md` — the state/action contract for `AppContext.jsx` (state shape, derived `highestActiveSeverity`, and the three action handlers), written before any component code so the first file in the build order has an explicit spec rather than an improvised one.

**Phase 2 build proceeding** per the sequence below, but content is layered in by **Tier** (per `dashboard-information-architecture.md`) rather than strictly by component: empty 3-column shell first, then Tier 0/1 fields across all columns, then Tier 2, then Tier 3, then interaction wiring, then QA.

---

## What Was Just Done (Session 3 — UX Problem Framework & Information Architecture)

### New Reference Docs
- `src/docs/ux-problem-framework.md` — POV/HMW problem statements `PS-01`–`PS-06`, condensed persona snapshots, Architect-Governor journey overlay, lighter Sovereign Operator / Compliance Controller treatment, and a `Problem → Persona → Journey Moment → Design Opportunity → Component Spec` traceability matrix.
- `src/docs/dashboard-information-architecture.md` — Visual Hierarchy Tiers (0–3) mapping every data field to a priority tier, a Cross-Column Attention Model (steady-state vs. interrupt-state scan order), and a master Progressive Disclosure Matrix.

### Canonical Source Updated
- `src/docs/user-architecture.md` — now carries inline `PS-01`–`PS-06` tags cross-referencing `ux-problem-framework.md`. Remains the canonical source for personas/friction/journey; update there first, then reconcile IDs in the framework doc.

### New Decision: DECISION-6 — Cross-Column Attention Model
- **Resolved:** Circuit-Breaking Gate column header escalates (border → `tokens.amber.border` / `tokens.crimson.border` + pulsing `● N PENDING` badge) when `trappedAnomalies.length > 0`. Reverts to neutral when clear. No new colors — reuses existing severity tokens and `animate-pulse`.
- **Logged in:** `memory-bank/DECISIONS.md` (Session 3)
- **Spec added:** `SPEC-07: ColumnAttentionState` in `src/docs/component-specs.md`
- **UI rule added:** "Cross-Column Attention State" section in `src/docs/branding/ui-spec.md`
- **Downstream impact:** `AppContext.jsx` (not yet built) must expose a derived `highestActiveSeverity` value computed from `trappedAnomalies[]`; consumed by `sections/CircuitBreakerGate.jsx` column header. See updated `memory-bank/COMPONENT_MAP.md` cascade row. No component code exists yet, so nothing is currently out of sync — this is captured ahead of Phase 2 build.

### Tracking Docs Updated
- `APEX_LOGIC_PLAN.md` and `memory-bank/PROGRESS.md` — both new docs registered; `component-specs.md` and `ui-spec.md` status notes updated to mention SPEC-07 / DECISION-6.
- `memory-bank/COMPONENT_MAP.md` — new cascade row (`trappedAnomalies[]` volume → `CircuitBreakerGate.jsx` header), new SPEC-07 → component cross-reference row, both new docs added to Reference Docs table.

### Follow-up: The Rationale Void → The Intent Ledger Symbol + Pitch Narrative
- **Umbrella frame formalized, then corrected:** `ux-problem-framework.md` briefly opened with a "Black Box → Command Centre" umbrella; this was replaced with "The Rationale Void — Umbrella Frame," naming every `PS-01`–`PS-06` as a facet of the same absence, with The Intent Ledger (gated by The Apex Checkpoint) as the one-line resolution. This reuses vocabulary already locked in `brand-identity.md` rather than inventing new terms, and avoids implying model-interpretability claims Apex Logic doesn't make. Cross-referenced from `user-architecture.md`'s companion note.
- **New doc — `src/docs/rationale-void-review-checklist.md`** (supersedes the deleted `black-box-review-checklist.md`): a 6-question standing rubric (does this close a piece of the void, which PS does it resolve, would cutting it reopen a piece of the void, etc.) to test any future decision against, plus a pasteable review-sub-agent prompt.
- **New doc — `src/docs/pitch-narrative.md`:** sub-5-minute pitch script (Hook ~25s / Pivot ~40s / Turn ~20s / Walkthrough ~2:30 / Close ~20s, total ~4:15), built entirely on The Rationale Void → The Intent Ledger symbol, replaying one Monday-morning incident twice (without / with Apex Logic). Closes on the already-approved headline "Human Intent. Permanently Bound." Includes a literal component screen map (`AgentBlock` paused badge → `AnomalyCard` Zone 1 + Approve & Sign → `LedgerRow` committed entry) for whoever drives the prototype live.
- **Journey map tagged:** `user-architecture.md` Section III journey matrix now has a `Pitch Beat` row mapping Phase 1 → Hook, Phase 2/3 → Pivot, Phase 4 → Turn + Walkthrough.
- **Deferred, explicitly noted (not started):** an HTML pitch deck reusing `theme.js` tokens and the 25/45/30 column system, to be built only after the script above is confirmed in the presenter's own voice.

---

## What Was Done Earlier (Session 2)

### Memory Bank System (installed)
- `.cursor/rules/apex-context.mdc` — auto-inject context into every agent chat
- `.cursor/rules/change-protocol.mdc` — cascade awareness protocol
- `memory-bank/` folder — all 4 files active and pre-populated

### Brand Strategy (Phase 0 — complete)
- Created `src/docs/branding/BRAND_STRATEGY.md` — upstream brand document (all visual decisions reference this)
- **Brand Archetype locked:** The Ruler
- **Visual Theme confirmed:** Cyberpunk Bloomberg Terminal
- **Emotional Territory:** Command
- **Only We Statement:** "Only Apex Logic permanently binds the original human intent to every agent action..."
- **Brand Vocabulary:** 8 owned terms documented and systematized
- **Brand Voice rules:** Authoritative, precise, declarative — documented with examples

### All 5 Visual Decisions Locked
| Decision | Resolved Value |
|---|---|
| D-1 Accent Color | Cyan — `text-cyan-400` / `border-cyan-500` / `bg-cyan-950/30` |
| D-2 Logo Mark Color | White — `text-neutral-100` (already in theme.js) |
| D-3 Monospace Font | JetBrains Mono (Google Fonts, 400 + 600) |
| D-4 Header Surface | `bg-neutral-900` (already in theme.js) |
| D-5 Sans-serif Font | Space Grotesk (Google Fonts, 400 + 500 + 600) |

### Updated Brand Docs
- `src/docs/branding/BRAND_STRATEGY.md` — NEW, upstream source of truth
- `src/docs/branding/brand-identity.md` — updated with archetype, personality stack, Only We, vocabulary
- `src/docs/branding/color-palette.md` — all decisions LOCKED
- `src/docs/branding/type-system.md` — both fonts LOCKED with import instructions
- `src/docs/branding/ui-spec.md` — D-4 LOCKED
- `src/docs/visual-identity.md` — expanded with full brand strategy + all visual decision summary

---

## Where We Are in the Build Sequence

```
[✅ DONE]   Phase 0 → Brand Foundation (archetype, theme, all visual decisions)
[✅ DONE]   Phase 1 → Token Resolution (retroactively verified, Session 4)
[🔄 NOW]    Phase 2 → Component Build
```

### Phase 1 Checklist (Retroactively Verified Complete)
1. `src/tokens/theme.js` — ✅ no PENDING comments, accent is `text-cyan-400`
2. `index.html` — ✅ combined Google Fonts link present (JetBrains Mono 400+600 + Space Grotesk 400+500+600)
3. `src/index.css` — ✅ `@theme` block sets `--font-sans` / `--font-mono` (Tailwind v4 CSS-first theming — no `tailwind.config.js` exists or is needed in this project)
4. All 4 branding docs — ✅ locked, no PENDING flags remain

### Phase 2 Build Sequence (Tier-Layered — Current)
```
Step 1  → src/docs/app-context-contract.md (state/action contract — new reference doc)
Step 2  → AppContext.jsx (React state engine — exposes highestActiveSeverity per DECISION-6)
Step 3  → SystemHeader.jsx + ThreeColumnLayout.jsx as an EMPTY 25/45/30 shell (no row/card content yet)
Step 4  → Tier 0/1 content across all 3 columns (status badges, human intent, anomaly titles + actions)
Step 5  → Tier 2 content (metrics strips, terminal log, agent metrics) then Tier 3 (collapsible diff drawer)
Step 6  → Wire interactions: Approve & Sign, Reject & Kill, Emergency Stop, expiry countdown, terminal
          continuous scroll, animated metric counters
Step 7  → ComplianceBadgeStrip.jsx
Step 8  → QA pass against `ui-spec.md` Thin-Lines rule + `rationale-void-review-checklist.md`
```

---

## Open Decisions
**None.** All visual, brand, UX-framing, and information-architecture decisions are locked (including `DECISION-6`). Phase 2 build is in progress — see Session 4 note above.

---

## Next Step Prompt (Use This to Resume Phase 2)

> "Read `memory-bank/ACTIVE_CONTEXT.md`, `src/docs/app-context-contract.md`, and `memory-bank/PROGRESS.md` first to see the exact current build step. Continue the Phase 2 Tier-Layered build sequence from wherever `PROGRESS.md`'s Components table shows the first non-DONE row. Do not skip the shell-before-content ordering, and do not reopen any decision marked LOCKED in `memory-bank/DECISIONS.md` without explicit founder sign-off."
