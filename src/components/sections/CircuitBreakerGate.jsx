// Right Column — The Circuit-Breaking Gate. Houses the AnomalyCard stack.
// Column header implements SPEC-07 ColumnAttentionState (component-specs.md) —
// escalates border + pending-count badge when trappedAnomalies.length > 0.
// Card body content lands in the Tier 0/1 and Tier 2/3 build passes.

import { useAppContext } from "../AppContext";
import AnomalyCard from "../ui/AnomalyCard";
import { layout, tokens, type } from "../../tokens/theme";

export default function CircuitBreakerGate() {
  const { highestActiveSeverity, trappedAnomalies } = useAppContext();

  const severityToken =
    highestActiveSeverity === "critical"
      ? tokens.crimson
      : highestActiveSeverity === "high"
        ? tokens.amber
        : null;

  const borderClass = severityToken ? severityToken.border : "border-neutral-800/60";

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div
        className={`flex items-center justify-between border-b bg-neutral-900/80 px-4 py-2 transition-colors ${borderClass}`}
      >
        <span className={type.heading}>Circuit-Breaking Gate</span>
        {severityToken && (
          <span
            className={`${severityToken.badge} flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-mono uppercase tracking-widest`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${severityToken.dot} animate-pulse`} />
            {trappedAnomalies.length} PENDING
          </span>
        )}
      </div>
      <div className={`min-h-0 flex-1 space-y-3 ${layout.scrollArea} p-3`}>
        {trappedAnomalies.map((anomaly) => (
          <AnomalyCard key={anomaly.id} anomaly={anomaly} />
        ))}
      </div>
    </div>
  );
}
