# DECISIONS LOG
> Immutable record. Once a decision is LOCKED, it is never reopened without explicit founder sign-off.
> Format: newest decisions at the top. Never delete old ones.
> Upstream brand strategy: `src/docs/branding/BRAND_STRATEGY.md`

---

## Session 5 — 2026-07-12 (Intro Screen — Parallel Track, Independent of Phase 2 Component Build)

### DECISION-8 — Intro Screen Copy & Treatment
- **Date:** 2026-07-12
- **Resolved:** Intro screen combo = "Brand-forward": locked logo mark (`▲ APEX LOGIC`, `brand.logoMarkColor`) + the already-LOCKED `brand.tagline` ("Bridging Human Intent and Autonomous Execution.") + one new plain-English descriptor line ("The control plane for autonomous AI agents — audit, cost, and human oversight in one permanent ledger."). Treatment: animated terminal boot-sequence fade-in (staggered opacity stages, no new keyframes/CSS — Tailwind `transition-opacity` + `animate-pulse` only), ending on a `[▸ Enter Control Plane]` cyan CTA button.
- **Rationale:** Founder picked this over a callback-forward variant (alt tagline "Human Intent. Permanently Bound.") and a problem-forward variant ("The Rationale Void ends here.") specifically because it reuses the actual LOCKED tagline rather than the "alternative candidate" line, and its descriptor is the most literal statement of what the product does. The boot-sequence animation was chosen over a static render to reinforce the Cyberpunk Bloomberg Terminal register established elsewhere (`ui-spec.md`).
- **Files added:** `src/components/screens/IntroScreen.jsx` (new — standalone, self-contained, accepts an `onEnter` callback)
- **Files NOT touched (deliberately):** `App.jsx`, `AppContext.jsx`, `ThreeColumnLayout.jsx`, `SystemHeader.jsx` — Phase 2's component build sequence is active on these files; wiring the intro screen in is a one-line follow-up (`showIntro` boolean + conditional render) to be done when that build reaches assembly, not now.
- **Downstream:** No existing component is affected. Future integration point: `App.jsx` root render.
- **Status:** LOCKED

### DECISION-7 — The Rationale Void as Core Narrative Symbol
- **Date:** 2026-07-12
- **Resolved:** The umbrella narrative symbol for the pitch and the UX problem framework is **The Rationale Void → The Intent Ledger** (gated by The Apex Checkpoint), not "Black Box → Command Centre." All PS-01–PS-06 problem statements are framed as facets of the Rationale Void.
- **Rationale:** "The Rationale Void" was already a locked brand vocabulary term (`brand-identity.md`, `BRAND_STRATEGY.md`) — this decision reuses existing, founder-approved vocabulary rather than introducing new box/window/glass imagery. It is also a more precise product claim: Apex Logic captures a permanently bound record of intent, assumption, and cost — it does not attempt model interpretability. "Black Box" is industry-standard shorthand for the latter (unrelated, much harder problem), so it risked implying a claim Apex Logic doesn't make. A "Black Box → Command Centre" framing was drafted earlier in this session but never logged as a decision; this entry supersedes that draft outright.
- **Files updated:** `src/docs/ux-problem-framework.md` (Umbrella Frame section renamed and reworded), `src/docs/user-architecture.md` (companion note, Pitch Beat row), `src/docs/pitch-narrative.md` (full rewrite), `src/docs/rationale-void-review-checklist.md` (new — replaces deleted `black-box-review-checklist.md`), `APEX_LOGIC_PLAN.md`, `memory-bank/PROGRESS.md`, `memory-bank/ACTIVE_CONTEXT.md`
- **Downstream:** Any future pitch deck, copy, or component naming should draw on The Rationale Void / The Intent Ledger / The Apex Checkpoint vocabulary — not box/window/glass language.
- **Status:** LOCKED

### DECISION-6 — Cross-Column Attention Model
- **Date:** 2026-07-12
- **Resolved:** The Circuit-Breaking Gate column header escalates when `trappedAnomalies.length > 0` — border swaps to `tokens.crimson.border` (any `critical` anomaly) or `tokens.amber.border` (otherwise), plus a pulsing `● N PENDING` count badge using the same severity token. Reverts to neutral border with no badge when zero anomalies are trapped.
- **Rationale:** This is a circuit-breaker monitoring tool, not a static report. When something is trapped, the Right column must out-rank the Center column's normal review cadence rather than wait its turn in a static left-to-right scan. Reuses existing severity tokens and the existing `animate-pulse` utility — no new colors, shadows, or gradients, staying inside the locked Thin-Lines rule.
- **Files updated:** `src/docs/dashboard-information-architecture.md` (new, Section 2), `src/docs/branding/ui-spec.md` (new "Cross-Column Attention State" section), `src/docs/component-specs.md` (new `SPEC-07: ColumnAttentionState`), `memory-bank/COMPONENT_MAP.md` (new cascade row)
- **Downstream:** `AppContext.jsx` must expose a derived `highestActiveSeverity` value; `sections/CircuitBreakerGate.jsx` column header consumes it. Not yet built — Phase 2 is still blocked on Phase 1 token resolution, so no component code is affected yet.
- **Status:** LOCKED

---

## Session 2 — 2026-07-12 (Brand Strategy Session)

### DECISION-5 — Sans-serif Font
- **Date:** 2026-07-12
- **Resolved:** Space Grotesk (Google Fonts, weights 400 + 500 + 600)
- **Rationale:** Geometric and slightly angular — enough technical edge for Cyberpunk Bloomberg aesthetic without consumer warmth. Signals "designed for people who think in systems." Strong pair with JetBrains Mono.
- **Files to update (Phase 1):** `index.html` (Google Fonts link), `tailwind.config.js` (fontFamily.sans)
- **Downstream:** All `font-sans` usage — panel headings, alert titles, plain-English summaries, anomaly card copy
- **Status:** LOCKED

### DECISION-4 — Header Surface Treatment
- **Date:** 2026-07-12
- **Resolved:** `bg-neutral-900` — standard Bloomberg approach
- **Rationale:** The Ruler commands with presence, not loudness. `neutral-900` gives authority through contrast without decoration. Already set correctly in `theme.js`.
- **Files updated:** `src/tokens/theme.js` (canvas.header — already set), `src/docs/branding/ui-spec.md`
- **Downstream:** `SystemHeader.jsx`, column header strips in `ThreeColumnLayout.jsx`
- **Status:** LOCKED

### DECISION-3 — Monospace Font
- **Date:** 2026-07-12
- **Resolved:** JetBrains Mono (Google Fonts, weights 400 + 600)
- **Rationale:** Technical authority with terminal intelligence. Reads cleanly at 10px (micro-label scale). Standard for engineering command tools. Carries the Cyberpunk Bloomberg aesthetic without IBM Plex Mono's institutional sterility or Geist Mono's startup register.
- **Files to update (Phase 1):** `index.html` (Google Fonts link), `tailwind.config.js` (fontFamily.mono)
- **Downstream:** All `font-mono` usage — data rows, terminal logs, micro-labels, logo mark
- **Status:** LOCKED

### DECISION-2 — Logo Mark Color
- **Date:** 2026-07-12
- **Resolved:** `text-neutral-100` (white) — already set in `theme.js`
- **Rationale:** The Ruler's mark sits above the color system. White on near-black is absolute institutional weight. Coloring it cyan would subordinate it to the interactive layer. The logo mark needs no color to assert authority.
- **Files updated:** `src/tokens/theme.js` (brand.logoMarkColor — already set), `src/docs/branding/color-palette.md`
- **Downstream:** `SystemHeader.jsx` logo rendering
- **Status:** LOCKED

### DECISION-1 — Interactive Accent Color
- **Date:** 2026-07-12
- **Resolved:** Cyan — `text-cyan-400` / `border-cyan-500` / `bg-cyan-950/30`
- **Rationale:** Cyan is the phosphor of a live terminal and the correct Cyberpunk register. Blue would be pure Bloomberg (authoritative but static). Cyan adds the living edge that "Cyberpunk Bloomberg" requires. The Bloomberg structural grid contains the cyberpunk energy. Already set as default in `theme.js`.
- **Files to update (Phase 1):** `src/tokens/theme.js` — uncomment cyan line and remove the comment marking it as pending
- **Downstream:** Hover states, selected row highlight, active column border, button focus rings — affects every interactive component
- **Status:** LOCKED

### DECISION-0E — Brand Archetype
- **Date:** 2026-07-12
- **Resolved:** The Ruler
- **Rationale:** Apex Logic creates order, commands with earned authority, and is accountable for outcomes. Institutional weight + frontier intelligence. Governs the brand personality, voice, visual register, and competitive positioning.
- **Files updated:** `src/docs/branding/BRAND_STRATEGY.md`, `src/docs/branding/brand-identity.md`
- **Status:** LOCKED

### DECISION-0F — Visual Theme
- **Date:** 2026-07-12 (confirmed — was implied in earlier docs, now formally locked)
- **Resolved:** Cyberpunk Bloomberg Terminal
- **Rationale:** Bloomberg provides structural discipline (institutional authority, density, thin-line precision). Cyberpunk provides edge (terminal intelligence, phosphor signal, live system awareness). The tension between them is the brand's visual identity.
- **Files updated:** `src/docs/visual-identity.md`, `src/docs/branding/BRAND_STRATEGY.md`
- **Status:** LOCKED

---

## Session 1 — Pre-existing Locked Decisions

### DECISION-0A — Canvas Color
- **Date:** Pre-session (locked in brand docs)
- **Resolved:** `neutral-950` as base canvas
- **Rationale:** Cyberpunk Bloomberg Terminal aesthetic — maximum darkness for signal legibility
- **Files locked:** `src/tokens/theme.js`, `src/docs/branding/color-palette.md`
- **Status:** LOCKED

### DECISION-0B — Status Color System
- **Date:** Pre-session (locked in brand docs)
- **Resolved:** emerald = active/success, amber = paused/warning, crimson = error/danger
- **Rationale:** Traffic-light legibility for compliance dashboard. Each color carries a unique semantic meaning — never used decoratively.
- **Files locked:** `src/tokens/theme.js` (statusTokenMap)
- **Status:** LOCKED

### DECISION-0C — Layout Architecture
- **Date:** Pre-session (locked in lean-prd.md)
- **Resolved:** 3-column layout — AuditStream 25% / IntentLedger 45% / CircuitBreakerGate 30%
- **Rationale:** Maps directly to the governance intercept protocol. Human intent (center) gets the most space.
- **Files locked:** `src/docs/lean-prd.md`, `src/docs/component-specs.md`, `src/docs/branding/ui-spec.md`
- **Status:** LOCKED

### DECISION-0D — No Rounded Corners
- **Date:** Pre-session (design constraint)
- **Resolved:** `rounded-none` everywhere. `rounded-sm` is the absolute maximum.
- **Rationale:** Industrial cockpit aesthetic — consumer softness is incompatible with The Ruler + Cyberpunk Bloomberg
- **Status:** LOCKED
