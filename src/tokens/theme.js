// APEX LOGIC — Master Design Token System
// Single source of truth. Every component imports from here.
// To retheme the entire product, change values in this file only.
//
// All decisions are LOCKED as of 2026-07-12.
// Upstream brand reference: src/docs/branding/BRAND_STRATEGY.md

// --- Brand ---
export const brand = {
  name: "Apex Logic",
  tagline: "Bridging Human Intent and Autonomous Execution.",
  logoMark: "▲",
  logoMarkColor: "text-neutral-100",
  systemStateLabel: "SYSTEM_STATE: ACTIVE",
};

// --- Canvas (Base Surface) ---
export const canvas = {
  base: "bg-neutral-950",
  header: "bg-neutral-900",
  surface: "bg-neutral-900",
  surfaceElevated: "bg-neutral-800/60",
  overlay: "bg-neutral-900/80",
};

// --- Semantic Status Tokens ---
// Color appears ONLY when it communicates systemic risk or state change.
// Never use these decoratively.

export const tokens = {
  // EMERALD — Stable Autonomy
  // Healthy agent streams, active processing, positive financials, approved ledger commits.
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
// All components reference these named roles. Never use raw Tailwind size classes directly.
// Font families: Space Grotesk (font-sans) + JetBrains Mono (font-mono)
// The font switch between sans (human copy) and mono (machine data) IS the translation layer.
export const type = {
  micro:        "text-[10px] font-mono uppercase tracking-widest text-neutral-500",
  data:         "text-sm font-mono text-neutral-300 tabular-nums",
  dataEmphasis: "text-sm font-mono text-neutral-100 tabular-nums font-medium",
  log:          "text-xs font-mono text-neutral-400",
  body:         "text-sm font-sans text-neutral-300 leading-relaxed",
  heading:      "text-xs font-sans font-semibold uppercase tracking-widest text-neutral-400",
  alertTitle:   "text-sm font-sans font-semibold text-neutral-100",
  logo:         "font-mono font-bold tracking-[0.25em] text-sm uppercase text-neutral-100",
};

// --- Layout Primitives ---
export const layout = {
  panel:        "border border-neutral-800/60 bg-neutral-900/40",
  card:         "border border-neutral-800/60 bg-neutral-900/60 rounded-none",
  divider:      "border-t border-neutral-800/60",
  columnHeader: "border-b border-neutral-800/60 bg-neutral-900/80 px-4 py-2",
  scrollArea:   "overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-neutral-800",
};

// --- Border Radius Rule ---
// Per brand spec: absolutely no consumer rounded corners.
export const radius = {
  none: "rounded-none",
  min:  "rounded-sm", // absolute maximum allowed
};

// --- Interactive Accent Token — LOCKED: Cyan ---
// Cyberpunk Bloomberg register: cyan = phosphor of a live terminal.
// Used for: hover states, selected row highlight, active column border, button focus rings.
export const accent = {
  text:   "text-cyan-400",
  border: "border-cyan-500",
  bg:     "bg-cyan-950/30",
};

// --- Anomaly Severity → Token Mapping ---
export const severityTokenMap = {
  critical: tokens.crimson,
  high:     tokens.amber,
  medium:   tokens.neutral,
  low:      tokens.emerald,
};
