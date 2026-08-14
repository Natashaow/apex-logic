# DECISIONS LOG
> Immutable record. Once a decision is LOCKED, it is never reopened without explicit founder sign-off.
> Format: newest decisions at the top. Never delete old ones.
> Upstream brand strategy: `src/docs/branding/BRAND_STRATEGY.md`

---

## Session 10 — 2026-08-15 ("Why Every Agent Acted" Overclaim Fix — Explicit `src/docs/` Override)

### DECISION-12 — `src/docs/` Edited Directly, By Explicit One-Time User Override of `CLAUDE.md` §5
- **Date:** 2026-08-15
- **Resolved:** Natasha explicitly instructed Claude Code to override `CLAUDE.md` §5 ("Do not edit files in `src/docs/`") for this one task: fixing the "why every agent acted" overclaim flagged in the vault's `Apex Logic - Market Reality Check.md` ("Models don't reliably expose true reasoning... Apex Logic can honestly show a declared rationale, not the agent's actual reasoning"). This is a **one-time, task-scoped override, not a standing change to §5** — the default rule (report needed `src/docs/` changes, don't apply them) still governs every other session unless Natasha says otherwise again.
- **What changed:** 5 files, all in `src/docs/`, each getting the same surgical fix — wherever copy claimed Apex Logic captures/closes/eliminates the "why" as verified fact, it now says the Intent Ledger records the agent's own **declared** rationale/hypothesis/assumption, explicitly not a claim of true internal reasoning:
  - `rationale-void-review-checklist.md` — "Why This Exists" intro + the pasteable reviewer-sub-agent prompt
  - `product-strategy.md` — Core Value Proposition ("eliminates" → "closes... recording each agent's own declared rationale, not a claim of its true internal reasoning") + Strategic Differentiator #2
  - `ledger-spec.md` — Operational Translation Rule paragraph + the Machine Assumption Log row in the Six System Vectors table
  - `user-architecture.md` — the one-line umbrella summary + "The Translation Trap"
  - `pitch-narrative.md` — "Why This Doc Exists" intro + the TURN beat's spoken line
- **Deliberately left unchanged:** problem-statement sentences (e.g. "no record of why is ever created" describing today's industry-wide gap — true, not an Apex Logic capability claim), `ux-problem-framework.md` (pure problem statements, no solution-capability overclaim found on inspection), and the brand-identity/`BRAND_STRATEGY.md` personality-trait tables ("Accountable — every action has a rationale, permanently bound") — brand-voice register, not a literal feature claim, same category as "The Ruler" archetype language.
- **Not touched, already clean:** rendered UI copy in `src/components/` (`AnomalyCard.jsx`, `LedgerRow.jsx`) already says "Machine Assumption" and "Estimated Cost" — properly hedged before this session, no code change needed.
- **Verification:** doc-only change (`.md` files under `src/docs/`, which `COMPONENT_MAP.md` documents as read-only reference docs never imported into the app bundle) — no `npm run lint` / `npm run build` impact, none run.
- **Status:** LOCKED

---

## Session 9 — 2026-08-15 (Real-Entry Model Field Fix)

### DECISION-11 — `technicalMetrics.model` Now Resolved From the Source Agent, Not `technicalTrace`
- **Date:** 2026-08-15
- **Resolved:** Both places that construct a real `ledgerEntries[]` row (`AppContext.jsx`'s `approveAnomaly` and `scripts/sync-activity-log.mjs`'s `resolution` handler) now set `technicalMetrics.model` by looking up the anomaly's `agentId` against the already-in-scope agents list/map (`agentsRef.current` client-side, the `agents` Map node-side) and reading `.metrics.model`, falling back to `"—"` only if the agent is genuinely unknown.
- **Rationale:** Flagged as a known gap in DECISION-10 — `technicalTrace` never carried a `model` field in the `anomaly_trapped` event schema, so the old code (`anomaly.technicalTrace?.model`) was always `undefined` on the Node path and hardcoded `"—"` on the client-optimistic path. The fix uses data already present in both functions' scope — no change to `events.jsonl`'s schema, no new field on `mockLedgerData.json` or `public/generated/ledger-state.json`.
- **Not touched:** `technicalMetrics.latencyVariance` in the client-optimistic path (`AppContext.approveAnomaly`) is still hardcoded `"—"` — it self-corrects within ~3s once the next live poll pulls the Node-derived entry (which has always read `promptVariance` correctly). Left as-is; out of scope for this fix, which was model-only.
- **Files updated:** `src/components/AppContext.jsx`, `scripts/sync-activity-log.mjs`.
- **Verification:** `npm run lint` and `npm run build` both clean. Smoke-tested `sync-activity-log.mjs` against a synthetic `agent_status → anomaly_trapped → resolution` event chain in a throwaway `VAULT_ROOT` — `technicalMetrics.model` resolved to the agent's real model (`"Claude-Sonnet-5"`) instead of `undefined`. Output reset to empty afterward, no real vault/repo state touched.
- **Status:** LOCKED

---

## Session 8 — 2026-08-15 (OPC Track Submission — Intent Ledger Copy Reframe)

### DECISION-10 — LedgerRow Zone B Splits by Track: Risk-Primary (Live/OPC) vs. Cost-Primary (Mock/B2B)
- **Date:** 2026-08-15
- **Resolved:** `ui/LedgerRow.jsx`'s Zone B metrics strip now branches on `isLive` (already computed by `useLiveLedgerData`, newly exposed on `AppContext`'s value):
  - **Live/OPC track** (`isLive === true`): 3 cells — `MODEL`, `RISK AT APPROVAL` (bright/tiered, reuses the anomaly's own `promptVariance` string — the number that trapped it in the first place — instead of manufacturing a new field), `EST. COST` (plain, no longer bright).
  - **Mock/B2B track** (`isLive === false`, unchanged): original 5-cell `MODEL / COGS-AER / LATENCY VAR / DRIFT / CONTEXT` grid, `COGS / AER` still bright.
- **Rationale:** Natasha's own usage of Apex Logic (OPC/One-Person-Company hackathon track, `openarena.to`/BUIDL_QUESTS 2026) surfaced that the $-primary framing assumes per-token/API-metered spend anxiety her flat-subscription usage doesn't have — see vault `02 - Active Projects/Apex Logic/2026-08-15 Decision - Apex Logic Agent Architecture.md`, "OPC track — Intent Ledger cost-framing split." Separately, on inspection: `financials.attributedRevenue`/`aer`, `intentDriftVariance`, and `contextWindowUsage` are hardcoded `0` on every real entry produced by both `AppContext.jsx`'s `approveAnomaly` and `scripts/sync-activity-log.mjs` (no revenue concept for personal use, and drift/context were never wired up for the live feed) — showing them as live stats would read as broken to OPC judges, not just be a weak hook. `RISK AT APPROVAL` reuses `technicalMetrics.latencyVariance`, which for real entries actually already holds the anomaly's `promptVariance` (e.g. `"42.8% (Critical Path Flag)"`) — real data, not a new field.
- **Not fixed, flagged instead:** `technicalMetrics.model` is also unreliable on real entries (`"—"` from the client optimistic-update path in `AppContext.approveAnomaly`, `undefined` from `sync-activity-log.mjs` — neither reads a real model field off the anomaly). Left as-is; would need a data-shape change (🔴 HIGH per `COMPONENT_MAP.md`) across both the client action handler and the Node sync script, out of scope for a copy-only pass.
- **Files updated:** `src/components/AppContext.jsx` (added `isLive` to context value — additive, no rename), `src/components/sections/IntentLedger.jsx` (passes `isLive` to `LedgerRow`), `src/components/ui/LedgerRow.jsx` (branches Zone B).
- **Not updated — needs a human pass:** `src/docs/component-specs.md` SPEC-01 still documents only the 5-cell mock layout. Per `CLAUDE.md` §5 ("Do not edit files in `src/docs/`"), this needs Natasha to add the live-track variant herself rather than have it applied inline here.
- **Verification:** `npm run lint` and `npm run build` both clean.
- **Downstream:** None beyond the 3 files above — `mockLedgerData.json` shape unchanged, `trappedAnomalies[]`/`AnomalyCard.jsx` unaffected, public Vercel deployment (`isLive` always `false` there) renders exactly as before.
- **Status:** LOCKED

---

## Session 7 — 2026-08-15 (Live Agent-Activity Control Plane — Scope Pivot)

### DECISION-9 — Client-Only/No-Backend Constraint Unlocked, Scoped to Local Sync + Mediator
- **Date:** 2026-08-15
- **Resolved:** Apex Logic is no longer a mock-data-only Play/Sandbox demo. It becomes a live control panel for Natasha's real background/scheduled agent work (Claude Code's `Workflow` tool, `CronCreate` scheduled agents, `/loop` background loops) — the class of agent activity that runs without her watching in the moment, which The Apex Checkpoint mechanic was actually built to govern. The founding "client-only, no backend, no database, mock data" constraint (this file's original architecture, `CLAUDE.md` §5, `src/docs/lean-prd.md` §3, `src/docs/app-context-contract.md` §5) is unlocked, **narrowly**: only for (a) a local Node sync script reading a real event log from the vault (`work/agent-activity/events.jsonl`, outside this repo) and writing a runtime-polled JSON file, and (b) a local mediator process (`POST /resolve`) that the three action handlers call. The blanket "no backend/no database/no live API" rule otherwise still stands — no hosted server, no database engine, no third-party API calls beyond this scope.
- **Rationale:** The original constraint was correct for a portfolio demo running on mock data. It's wrong for what Apex Logic is now — a real governance tool needs real data. Scoping the unlock narrowly (local-only, one JSON feed, one mediator endpoint) avoids reopening the constraint further than the actual need, and keeps the public Vercel deployment unaffected (still shows `mockLedgerData.json`, unchanged) since the real feed is `.gitignore`d and never committed — confirmed 2026-08-15 that `github.com/Natashaow/apex-logic` is a public repo, so real agent-activity data (human intent text, cost figures) must never enter git history.
- **Files updated:** `CLAUDE.md` (§5 backend rule), `src/docs/lean-prd.md` (§3 Scope Guardrails), `src/docs/app-context-contract.md` (LOCKED banner + §5 Non-Goals), `src/components/AppContext.jsx` (data source), `memory-bank/COMPONENT_MAP.md`, `memory-bank/PROGRESS.md`. New: `scripts/sync-activity-log.mjs`, `scripts/mediator.mjs` (or extended sync script), `src/hooks/useLiveLedgerData.js`, `.gitignore` entry for `public/generated/ledger-state.json`.
- **Downstream:** `src/data/mockLedgerData.json` is kept, not deleted — remains the public deploy's data source and an offline/demo fixture. The synthetic terminal-log generator in `AppContext.jsx` is removed (superseded by real `terminalLogs` from the live feed). Full implementation plan: see the vault's [[2026-08-15 Action Plan - Apex Logic Live Data Architecture]].
- **Explicitly not resolved by this decision:** how a real paused `Workflow`/`CronCreate`/`/loop` run notices a mediator resolution event and actually resumes/aborts — flagged as open, separate follow-up work, not designed here.
- **Status:** LOCKED

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
