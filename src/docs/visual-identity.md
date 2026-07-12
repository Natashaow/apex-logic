# Visual Identity & UI Architecture: Apex Logic
> Brand Framework & Cyberpunk Bloomberg Terminal Specification
> Status: LOCKED — Session 2, 2026-07-12
> Upstream: `src/docs/branding/BRAND_STRATEGY.md`

---

## I. Brand Profile

### Core Identity
- **Brand Name:** Apex Logic
- **Tagline:** Bridging Human Intent and Autonomous Execution.
- **Design Philosophy:** Human-in-command operational supremacy. The interface functions strictly as a high-density command center instrument panel where data density, scannability, and thin-line alignment replace superficial visual fluff.
- **Visual Theme:** Cyberpunk Bloomberg Terminal

### The Cyberpunk Bloomberg Tension
This is not a style aesthetic — it is a deliberate brand tension that governs every visual decision.

Bloomberg provides the structural discipline: institutional authority, information density, consequential decision-making, thin-line precision, neutral restraint.

Cyberpunk provides the edge: terminal intelligence, phosphor signal (cyan), live system awareness, the sense of governing something genuinely new and dangerous.

Too far Bloomberg = sterile compliance tool.  
Too far Cyberpunk = hacker toy.  
**Apex Logic is the command infrastructure that serious people use at the frontier of autonomous AI.**

---

## II. Logo Mark

Constructed entirely from raw inline monospace text and system symbols — zero image assets required.

```
▲ A P E X  L O G I C   [•] SYSTEM_STATE: ACTIVE
```

| Element | Spec | Rationale |
|---|---|---|
| `▲` | `text-neutral-100`, `font-mono` | The Ruler's mark — white, above the color system, no semantic baggage |
| `A P E X  L O G I C` | `font-mono tracking-[0.25em] uppercase font-bold text-neutral-100` | Wide-tracked, monospace, all-caps — command register |
| `[•] SYSTEM_STATE: ACTIVE` | `font-mono text-neutral-400` | Live status — the system breathing, always present |

---

## III. Layout & Density Guidelines (The "Thin-Lines" Rule)

- **Grid:** Permanently locked flex or grid workspace — mimics an industrial engineering cockpit.
- **Corners:** `rounded-none` everywhere. `rounded-sm` is the absolute maximum. No exceptions.
- **Borders:** Thin, precise, low-contrast — `border border-neutral-800/60` or `divide-y divide-neutral-900`
- **Shadows:** None. Depth is created by border contrast, not shadows.
- **Gradients:** None. Flat surfaces only.

---

## IV. Typographic Scale & Scanning Hierarchy

The two-font system is the product's translation layer made visible:

| Layer | Font | Use |
|---|---|---|
| Data Rows | JetBrains Mono (`font-mono`) | Systems data, logs, token velocities, financial equations |
| Interface Controls & Copy | Space Grotesk (`font-sans`) | Structural text headers, alert summaries, plain-English intent |
| Micro-Labels | JetBrains Mono, `text-[10px] uppercase tracking-widest text-neutral-500` | Metadata metric headers — maximum information density |

**Scanning hierarchy (enforced visually in every component):**
```
1. Alert title / Heading     ← font-sans, font-semibold, neutral-100
2. Human Intent copy         ← font-sans, body, neutral-300
3. Machine Assumption        ← font-sans, body, neutral-400
4. Data metrics strip        ← font-mono, tabular-nums, neutral-300
5. Micro-labels              ← font-mono, 10px, uppercase, neutral-500
```

---

## V. Functional Token System (Semantic Color System)

> Color only appears on the canvas when it communicates immediate systemic risk, operational state change, or live interactivity. Color is signal, never decoration.

| Token | Semantic Meaning | Text | Border | Background |
|---|---|---|---|---|
| **Canvas** | The base | — | — | `bg-neutral-950` |
| **Cyan (Accent)** | Live interactivity — hover, selected, focused | `text-cyan-400` | `border-cyan-500` | `bg-cyan-950/30` |
| **Emerald** | Stable Autonomy — healthy, active, approved | `text-emerald-400` | `border-emerald-800/50` | `bg-emerald-950/30` |
| **Amber** | The Apex Checkpoint — circuit breaker tripped, execution frozen | `text-amber-400` | `border-amber-800/50` | `bg-amber-950/30` |
| **Crimson** | Critical Halt — rejected, killed, non-reversible | `text-red-400` | `border-red-800/50` | `bg-red-950/30` |
| **Neutral** | System Metadata — timestamps, raw logs, diagnostic strings | `text-neutral-400/500` | `border-neutral-800/60` | — |

---

## VI. Interactive State System

| State | Treatment |
|---|---|
| Hover (rows, cards) | `bg-neutral-800/30` background transition |
| Selected / Active | `border-l-2 border-cyan-500` left accent border |
| Focus (buttons) | `outline outline-1 outline-offset-2 outline-cyan-500` |
| Disabled | `opacity-40 cursor-not-allowed` |

---

## VII. All Visual Decisions — Status Summary

| Decision | Status | Value |
|---|---|---|
| Canvas base color | ✅ LOCKED | `bg-neutral-950` |
| Header surface | ✅ LOCKED | `bg-neutral-900` |
| Accent color | ✅ LOCKED | `text-cyan-400` / `border-cyan-500` / `bg-cyan-950/30` |
| Logo mark color | ✅ LOCKED | `text-neutral-100` (white) |
| Status colors (emerald/amber/crimson) | ✅ LOCKED | See table above |
| Monospace font | ✅ LOCKED | JetBrains Mono (Google Fonts, weights 400 + 600) |
| Sans-serif font | ✅ LOCKED | Space Grotesk (Google Fonts, weights 400 + 500 + 600) |
| Corner radius | ✅ LOCKED | `rounded-none` always, `rounded-sm` absolute maximum |
| Border style | ✅ LOCKED | `border border-neutral-800/60` |
| Shadows / Gradients | ✅ LOCKED | None |

**All visual decisions are locked. The build may begin.**
