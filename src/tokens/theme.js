// APEX LOGIC — Master Design Token System
// Single source of truth. Every component imports from here.
// To retheme the entire product, change values in this file only.
//
// ⚠️  PENDING DECISIONS — resolve these before building components:
//
//  [1] ACCENT COLOR — choose one and uncomment it in the `tokens.accent` block below
//      Options: cyan-400 | violet-400 | blue-400 | neutral-700 (none)
//
//  [2] LOGO MARK COLOR — set `brand.logoMarkColor` to your chosen accent or "text-neutral-100"
//
//  [3] MONOSPACE FONT — if importing JetBrains Mono / IBM Plex Mono / Geist Mono,
//      add @import to src/index.css and extend tailwind.config.js fontFamily.mono
//
//  [4] HEADER SURFACE — set `canvas.header` to your chosen treatment
//      Options: "bg-neutral-950" (border only) | "bg-neutral-900" (lighter) | "bg-neutral-800/40" (contrast)

// --- Brand ---
export const brand = {
  name: "Apex Logic",
  tagline: "Bridging Human Intent and Autonomous Execution.",
  logoMark: "▲",
  logoMarkColor: "text-neutral-100", // ⚠️ PENDING [2]: change to accent color once decided
  systemStateLabel: "SYSTEM_STATE: ACTIVE",
};

// --- Canvas (Base Surface) ---
export const canvas = {
  base: "bg-neutral-950",
  header: "bg-neutral-900",       // ⚠️ PENDING [4]: "bg-neutral-950" | "bg-neutral-900" | "bg-neutral-800/40"
  surface: "bg-neutral-900",
  surfaceElevated: "bg-neutral-800/60",
  overlay: "bg-neutral-900/80",
};

// --- Semantic Status Tokens ---
// Each token maps to a specific operational state in the product narrative.
// RULE: Color appears only when it communicates systemic risk or state change.

export const tokens = {
  // EMERALD — Stable Autonomy
  // Healthy agent streams, active processing, positive financial calculations, approved ledger commits.
  emerald: {
    bg: "bg-emerald-950/30",
    bgSolid: "bg-emerald-950",
    border: "border-emerald-800/50",
    text: "text-emerald-400",
    textDim: "text-emerald-600",
    badge: "bg-emerald-950/40 border border-emerald-800/60 text-emerald-400",
    dot: "bg-emerald-400",
  },

  // AMBER — The Apex Checkpoint
  // Circuit breaker tripped. Execution frozen. Human gate hydrated. Awaiting operator review.
  amber: {
    bg: "bg-amber-950/30",
    bgSolid: "bg-amber-950",
    border: "border-amber-800/50",
    text: "text-amber-400",
    textDim: "text-amber-600",
    badge: "bg-amber-950/40 border border-amber-800/60 text-amber-400",
    dot: "bg-amber-400",
  },

  // CRIMSON — Critical Halt
  // Operator clicked [Reject & Kill]. Thread terminated. CRITICAL_HALT logged to ledger.
  // This state is permanent and non-reversible within a session.
  crimson: {
    bg: "bg-red-950/30",
    bgSolid: "bg-red-950",
    border: "border-red-800/50",
    text: "text-red-400",
    textDim: "text-red-700",
    badge: "bg-red-950/40 border border-red-800/60 text-red-400",
    dot: "bg-red-500",
  },

  // NEUTRAL — System Metadata
  // Timestamps, raw logs, context windows, diagnostic code strings.
  // Keeps the visual field clean and readable — no emotional signal.
  neutral: {
    muted: "text-neutral-500",
    dim: "text-neutral-400",
    base: "text-neutral-300",
    bright: "text-neutral-100",
    border: "border-neutral-800/60",
    borderStrong: "border-neutral-700",
    divider: "divide-neutral-900",
    surface: "bg-neutral-800/40",
  },
};

// --- Agent Status → Token Mapping ---
// Maps agent status strings (from mockLedgerData.json) to the correct semantic token.
export const statusTokenMap = {
  processing: tokens.emerald,
  idle:        tokens.neutral,
  paused:      tokens.amber,
  approved:    tokens.emerald,
  halted:      tokens.crimson,
};

// --- Status Labels ---
export const statusLabels = {
  processing: "PROCESSING",
  idle:        "IDLE",
  paused:      "PAUSED",
  approved:    "APPROVED",
  halted:      "CRITICAL_HALT",
};

// --- Typography Scale ---
export const type = {
  // Micro-label — metric headers, column labels, system tags
  micro: "text-[10px] font-mono uppercase tracking-widest text-neutral-500",
  // Data value — token counts, latency numbers, COGS figures
  data: "text-sm font-mono text-neutral-300 tabular-nums",
  // Data value — emphasized / primary metric
  dataEmphasis: "text-sm font-mono text-neutral-100 tabular-nums font-medium",
  // Log line — terminal output rows
  log: "text-xs font-mono text-neutral-400",
  // Body — plain-English rationale text, human intent copy
  body: "text-sm font-sans text-neutral-300 leading-relaxed",
  // Heading — panel titles, column headers
  heading: "text-xs font-sans font-semibold uppercase tracking-widest text-neutral-400",
  // Alert title — anomaly card header
  alertTitle: "text-sm font-sans font-semibold text-neutral-100",
  // Brand / Logo
  logo: "font-mono font-bold tracking-[0.25em] text-sm uppercase text-neutral-100",
};

// --- Layout Primitives ---
export const layout = {
  // Outer panel — three-column wrapper
  panel: "border border-neutral-800/60 bg-neutral-900/40",
  // Inner card — ledger row, agent block, anomaly card
  card: "border border-neutral-800/60 bg-neutral-900/60 rounded-none",
  // Section divider
  divider: "border-t border-neutral-800/60",
  // Column header strip
  columnHeader: "border-b border-neutral-800/60 bg-neutral-900/80 px-4 py-2",
  // Scrollable container
  scrollArea: "overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-neutral-800",
};

// --- Border Radius Rule ---
// Per brand spec: absolutely no consumer rounded corners.
export const radius = {
  none: "rounded-none",
  min: "rounded-sm", // maximum allowed
};

// --- Anomaly Severity → Token Mapping ---
export const severityTokenMap = {
  critical: tokens.crimson,
  high:     tokens.amber,
  medium:   tokens.neutral,
  low:      tokens.emerald,
};

// --- ⚠️ PENDING [1] — Interactive Accent Token ---
// Uncomment ONE option once the accent color decision is made.
// This drives: hover states, selected row highlight, active column border, button focus rings.
//
// export const accent = { text: "text-cyan-400",   border: "border-cyan-500",   bg: "bg-cyan-950/30"   }; // Cyan
// export const accent = { text: "text-violet-400", border: "border-violet-500", bg: "bg-violet-950/30" }; // Violet
// export const accent = { text: "text-blue-400",   border: "border-blue-500",   bg: "bg-blue-950/30"   }; // Blue
// export const accent = { text: "text-neutral-300", border: "border-neutral-700", bg: "bg-neutral-800/30" }; // None (monochrome)
export const accent = { text: "text-cyan-400", border: "border-cyan-500", bg: "bg-cyan-950/30" }; // DEFAULT: Cyan (change me)
