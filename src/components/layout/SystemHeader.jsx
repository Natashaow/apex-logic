// SPEC-05: SystemHeader — src/docs/component-specs.md
// Left: logo + system state badge. Center: 4 live metrics. Right: Emergency Stop.

import { useAppContext } from "../AppContext";
import { brand, canvas, tokens, type } from "../../tokens/theme";

function Metric({ label, value }) {
  return (
    <div className="flex flex-col items-end gap-0.5">
      <span className={type.micro}>{label}</span>
      <span className={type.dataEmphasis}>{value}</span>
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
        <Metric label="TOKENS BURNED" value={systemMetrics.totalTokensBurned.toLocaleString()} />
        <Metric label="TOTAL COGS" value={`$${systemMetrics.totalCogs.toFixed(3)}`} />
        <Metric label="SYSTEM AER" value={systemMetrics.systemAer.toFixed(1)} />
        <Metric label="LEAKAGE RATE" value={`$${systemMetrics.leakageRate.toFixed(3)}`} />
      </div>

      <button
        type="button"
        onClick={emergencyStop}
        className={`${tokens.crimson.badge} shrink-0 rounded-none px-3 py-1.5 text-xs font-mono font-semibold uppercase tracking-widest transition-colors hover:bg-red-950/60 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-red-500`}
      >
        ■ EMERGENCY STOP
      </button>
    </header>
  );
}
