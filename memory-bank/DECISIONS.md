# DECISIONS LOG
> Immutable record. Once a decision is LOCKED, it is never reopened without explicit founder sign-off.
> Format: newest decisions at the top. Never delete old ones.
> Upstream brand strategy: `src/docs/branding/BRAND_STRATEGY.md`

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
