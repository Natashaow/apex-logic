# ACTIVE CONTEXT
> This file is updated after every work session. Read it first to know where we are.

---

## Current Status
**Phase:** Phase 0 COMPLETE — Brand Foundation locked. UX reasoning layer (Session 3) also complete, in parallel — does not block or unblock Phase 1.  
**Next Phase:** Phase 1 — Token Resolution (~30 min technical session)  
**Last updated:** 2026-07-12

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
[🔲 NEXT]   Phase 1 → Token Resolution (~30 min)
[ ]         Phase 2 → Component Build (fully unblocked after Phase 1)
```

### Phase 1 Checklist (Exact Steps)
All of these must complete before any component is built:

1. `src/tokens/theme.js` — remove PENDING comments, confirm accent is `text-cyan-400`
2. `index.html` — add combined Google Fonts link (JetBrains Mono 400+600 + Space Grotesk 400+500+600)
3. `tailwind.config.js` — extend `fontFamily.mono` and `fontFamily.sans`
4. `src/index.css` — verify font stack is clean (no conflicting @imports)
5. Lock all 4 branding docs (done — just verify no PENDING flags remain)

### Phase 2 Build Sequence (After Phase 1)
```
Step 2  → AppContext.jsx (React state engine — must expose highestActiveSeverity, see DECISION-6)
Step 3  → SystemHeader.jsx
Step 4  → ThreeColumnLayout.jsx
Step 5  → AgentBlock.jsx + TerminalLog.jsx → AuditStream.jsx
Step 6  → LedgerRow.jsx → IntentLedger.jsx
Step 7  → AnomalyCard.jsx → CircuitBreakerGate.jsx (column header consumes highestActiveSeverity per SPEC-07)
Step 8  → ComplianceBadgeStrip.jsx
Step 9  → App.jsx (wire everything)
Step 10 → Test all interactions (add: column header attention escalation on trapped anomaly)
```

---

## Open Decisions
**None.** All visual, brand, UX-framing, and information-architecture decisions are locked (including `DECISION-6`). Build is fully unblocked after Phase 1.

---

## Next Step Prompt (Use This to Start Phase 1)

> "Read `memory-bank/ACTIVE_CONTEXT.md` and `src/docs/branding/BRAND_STRATEGY.md` first. All brand decisions are locked. Execute Phase 1 — Token Resolution:
> 1. Update `src/tokens/theme.js` — remove all PENDING comments, confirm accent is cyan
> 2. Add the combined Google Fonts link to `index.html` (JetBrains Mono 400+600, Space Grotesk 400+500+600)
> 3. Extend `tailwind.config.js` with `fontFamily.mono: ['JetBrains Mono', 'monospace']` and `fontFamily.sans: ['Space Grotesk', 'sans-serif']`
> 4. Verify `src/index.css` has no conflicting font imports
> After completing all 4 steps, confirm Phase 1 is done and update `memory-bank/ACTIVE_CONTEXT.md`."
