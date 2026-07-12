// SPEC-04: TerminalLog (Left Column, below AgentBlock stack) — component-specs.md
// Newest entries prepend to top. Continuous scroll interval is owned by
// AppContext (see app-context-contract.md Section 4), not this component.

import { useAppContext } from "../AppContext";
import { type, layout } from "../../tokens/theme";

const EVENT_COLOR = {
  CIRCUIT_BREAK: "text-amber-400",
  CRITICAL_HALT: "text-red-400",
  GLOBAL_KILL_SWITCH_ACTIVATED: "text-red-400",
  LEDGER_COMMIT: "text-emerald-400",
  TOOL_CALL: "text-neutral-400",
  STATE_CHANGE: "text-neutral-400",
};

export default function TerminalLog() {
  const { terminalLogs } = useAppContext();

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="shrink-0 px-3 pb-1 pt-2">
        <span className={type.micro}>Terminal Feed</span>
      </div>
      <div className={`min-h-0 flex-1 space-y-1 ${layout.scrollArea} px-3 pb-3`}>
        {terminalLogs.map((log, idx) => (
          <p
            key={`${log.ts}-${log.agentId}-${idx}`}
            className={`${type.log} ${EVENT_COLOR[log.event] ?? "text-neutral-400"}`}
          >
            <span className="text-neutral-600">[{log.ts}]</span> {log.event} — {log.detail}
          </p>
        ))}
      </div>
    </div>
  );
}
