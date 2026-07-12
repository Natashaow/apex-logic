// SPEC-05: SystemHeader — src/docs/component-specs.md
// Left: logo + system state badge. Center: 4 live metrics. Right: Emergency Stop.

import CountUpModule from "react-countup";
import { useAppContext } from "../AppContext";
import { brand, canvas, tokens, type } from "../../tokens/theme";

// `react-countup` is published as CommonJS. Depending on Vite's module
// interop path, its default import can be either the component itself or an
// object containing that component under `.default`.
const CountUp = CountUpModule.default ?? CountUpModule;

function Metric({ label, children }) {
  return (
    <div className="flex flex-col items-end gap-0.5">
      <span className={type.micro}>{label}</span>
      <span className={type.dataEmphasis}>{children}</span>
    </div>
  );
}

export default function SystemHeader() {
  const { systemMetrics, agents, emergencyStop } = useAppContext();
  const allHalted = agents.every((agent) => agent.status === "halted");
  const stateToken = allHalted ? tokens.crimson : tokens.emerald;

  return (
    <header
      className={`${canvas.header} border-b border-neutral-800/60 flex items-center justify-between gap-6 px-4 py-3 shrink-0`}
    >
      <div className="flex items-center gap-3 shrink-0">
        <span className={type.logo}>
          {brand.logoMark} A P E X &nbsp; L O G I C
        </span>
        <span
          className={`${stateToken.badge} flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-mono uppercase tracking-widest`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${stateToken.dot}`} />
          {allHalted ? "SYSTEM_STATE: HALTED" : brand.systemStateLabel}
        </span>
      </div>

      <div className="flex items-center gap-6 overflow-x-auto">
        <Metric label="TOKENS BURNED">
          <CountUp end={systemMetrics.totalTokensBurned} duration={0.6} separator="," preserveValue />
        </Metric>
        <Metric label="TOTAL COGS">
          <CountUp end={systemMetrics.totalCogs} duration={0.6} decimals={3} prefix="$" preserveValue />
        </Metric>
        <Metric label="SYSTEM AER">
          <CountUp end={systemMetrics.systemAer} duration={0.6} decimals={1} preserveValue />
        </Metric>
        <Metric label="LEAKAGE RATE">
          <CountUp end={systemMetrics.leakageRate} duration={0.6} decimals={3} prefix="$" preserveValue />
        </Metric>
      </div>

      <button
        type="button"
        onClick={emergencyStop}
        disabled={allHalted}
        className={`${tokens.crimson.badge} shrink-0 rounded-none px-3 py-1.5 text-xs font-mono font-semibold uppercase tracking-widest transition-colors focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-red-500 ${allHalted ? "cursor-not-allowed opacity-50" : "hover:bg-red-950/60"}`}
      >
        ■ EMERGENCY STOP
      </button>
    </header>
  );
}
