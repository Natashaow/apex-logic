// SPEC-03: AnomalyCard (Right Column) — src/docs/component-specs.md
// Tier 0/1 pass: Zone 1 (Business Risk Summary) only — title, severity, human
// intent, business impact, machine assumption, expiry countdown, action buttons.
// `plainenglish-before-diff` constraint — Zone 2 (technical drawer) is Tier 3
// and lands in the next build pass, collapsed by default.

import { useAppContext } from "../AppContext";
import { layout, severityTokenMap, tokens, type } from "../../tokens/theme";

function formatCountdown(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export default function AnomalyCard({ anomaly }) {
  const { approveAnomaly, rejectAnomaly } = useAppContext();
  const severityToken = severityTokenMap[anomaly.severity];

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
          Auto-Aborting in {formatCountdown(anomaly.expirySeconds)}
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
    </div>
  );
}
