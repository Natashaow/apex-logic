// APEX LOGIC — Intro Screen
// Standalone, self-contained component — deliberately NOT wired into App.jsx yet
// (Phase 2's App.jsx / AppContext.jsx / ThreeColumnLayout.jsx build is in progress elsewhere;
// this avoids touching any file on that active build path).
//
// Integration (when Phase 2 build reaches assembly): App.jsx wraps its existing return in
// `showIntro ? <IntroScreen onEnter={() => setShowIntro(false)} /> : <...dashboard...>`.
//
// Decision reference: memory-bank/DECISIONS.md — DECISION-8 (Intro Screen Copy & Treatment).
// Reuses only already-LOCKED brand copy (brand.tagline) plus one new plain-English descriptor line.

import { useEffect, useState } from "react";
import { brand } from "../../tokens/theme";

const DESCRIPTOR =
  "The control plane for autonomous AI agents — audit, cost, and human oversight in one permanent ledger.";

const STAGE_DELAYS_MS = [0, 400, 900, 1400, 1900, 2400];

export default function IntroScreen({ onEnter }) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const timers = STAGE_DELAYS_MS.map((delay, i) =>
      setTimeout(() => setStage(i), delay)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  const fade = (visibleAtStage) =>
    `transition-opacity duration-700 ${stage >= visibleAtStage ? "opacity-100" : "opacity-0"}`;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-neutral-950 rounded-none">
      <div className={`font-mono text-xs text-neutral-600 mb-6 ${fade(0)}`}>
        &gt; SYSTEM_BOOT_SEQUENCE // INITIALIZING CONTROL PLANE
        <span className="animate-pulse">_</span>
      </div>

      <div className={`text-5xl ${brand.logoMarkColor} ${fade(1)}`}>{brand.logoMark}</div>

      <div className={`font-mono font-bold tracking-[0.35em] text-2xl uppercase text-neutral-100 mt-4 ${fade(2)}`}>
        APEX LOGIC
      </div>

      <div className={`font-sans text-lg text-neutral-300 mt-6 text-center max-w-md ${fade(3)}`}>
        {brand.tagline}
      </div>

      <div className={`font-mono text-sm text-neutral-500 mt-3 text-center max-w-lg leading-relaxed ${fade(4)}`}>
        {DESCRIPTOR}
      </div>

      <button
        type="button"
        onClick={onEnter}
        className={`mt-10 text-xs font-mono uppercase tracking-widest text-cyan-400 border border-cyan-800/60 bg-cyan-950/20 px-4 py-2 hover:bg-cyan-950/40 transition-colors rounded-none outline-offset-2 focus:outline focus:outline-1 focus:outline-cyan-400 ${fade(5)}`}
      >
        ▸ Enter Control Plane
      </button>
    </div>
  );
}
