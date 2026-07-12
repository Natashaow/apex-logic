// SPEC-03: AnomalyCard (Right Column) — src/docs/component-specs.md
// Zone 1 (Tier 0/1, always first) + Zone 2 technical drawer (Tier 3, added here —
// collapsed by default per `plainenglish-before-diff`).

import { useEffect, useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import { useAppContext } from "../AppContext";
import { layout, severityTokenMap, tokens, type } from "../../tokens/theme";

function formatCountdown(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function DiffBlock({ diff }) {
  return (
    <pre className="overflow-x-auto whitespace-pre rounded-none border border-neutral-800/60 bg-neutral-950 p-2 text-[11px] font-mono leading-relaxed">
      {diff.split("\n").map((line, idx) => {
        const tone = line.startsWith("+")
          ? "text-emerald-400"
          : line.startsWith("-")
            ? "text-red-400"
            : "text-neutral-500";
        return (
          <div key={idx} className={tone}>
            {line}
          </div>
        );
      })}
    </pre>
  );
}

export default function AnomalyCard({ anomaly }) {
  const [expanded, setExpanded] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(anomaly.expirySeconds);
  const { approveAnomaly, rejectAnomaly } = useAppContext();
  const severityToken = severityTokenMap[anomaly.severity];

  // Live countdown tick — one interval per card, created once on mount.
  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((value) => Math.max(value - 1, 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Auto-abort at 0 (ledger-spec.md "State Expiry Review Timer") — reuses the
  // same rejectAnomaly path a human REJECT_AND_KILL click takes, tagged with a
  // distinct reason so the audit trail can tell them apart.
  useEffect(() => {
    if (secondsLeft === 0) {
      rejectAnomaly(anomaly.id, "AUTO_ABORT_EXPIRY");
    }
  }, [secondsLeft, anomaly.id, rejectAnomaly]);

  return (
    <div className={`${layout.card} space-y-3 border-l-2 p-3 ${severityToken.border}`}>
      <div className="flex items-start justify-between gap-2">
        <span className={type.alertTitle}>{anomaly.title}</span>
        <span
          className={`${severityToken.badge} shrink-0 px-2 py-0.5 text-[10px] font-mono uppercase tracking-widest`}
        >
          {anomaly.severity}
        </span>
      </div>

      <div className="space-y-2">
        <div>
          <span className={type.micro}>Human Intent</span>
          <p className={type.body}>{anomaly.humanIntent}</p>
        </div>
        <div>
          <span className={type.micro}>Business Impact</span>
          <p className={type.body}>{anomaly.businessImpact}</p>
        </div>
        <div>
          <span className={type.micro}>Machine Assumption</span>
          <p className={`${type.body} italic text-neutral-400`}>{anomaly.machineAssumption}</p>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-neutral-800/60 pt-2">
        <span className={`${tokens.amber.text} text-[10px] font-mono uppercase tracking-widest`}>
          Auto-Aborting in {formatCountdown(secondsLeft)}
        </span>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => approveAnomaly(anomaly.id)}
          className={`${tokens.emerald.badge} flex-1 rounded-none px-2 py-1.5 text-xs font-mono font-semibold uppercase tracking-widest transition-colors hover:bg-emerald-950/60`}
        >
          Approve &amp; Sign
        </button>
        <button
          type="button"
          onClick={() => rejectAnomaly(anomaly.id)}
          className={`${tokens.crimson.badge} flex-1 rounded-none px-2 py-1.5 text-xs font-mono font-semibold uppercase tracking-widest transition-colors hover:bg-red-950/60`}
        >
          Reject &amp; Kill
        </button>
      </div>

      <button
        type="button"
        onClick={() => setExpanded((value) => !value)}
        className="flex w-full items-center gap-1 border-t border-neutral-800/60 pt-2 text-[10px] font-mono uppercase tracking-widest text-neutral-500 transition-colors hover:text-neutral-300"
      >
        {expanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
        Technical Trace
      </button>

      {expanded && (
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex min-w-0 flex-col gap-0.5">
              <span className={type.micro}>Prompt Variance</span>
              <span className={`${type.data} truncate`}>{anomaly.technicalTrace.promptVariance}</span>
            </div>
            <div className="flex min-w-0 flex-col gap-0.5 text-right">
              <span className={type.micro}>Estimated Cost</span>
              <span className={`${type.data} truncate`}>{anomaly.technicalTrace.estimatedCost}</span>
            </div>
          </div>
          <DiffBlock diff={anomaly.technicalTrace.proposedDiff} />
        </div>
      )}
    </div>
  );
}
