// SPEC-01: LedgerRow (Center Column) — src/docs/component-specs.md
// Zone A (Tier 0/1, always visible) + Zone B metrics strip (Tier 2, added here).
// `plainenglish-before-diff` constraint — Zone A always renders above Zone B.

import { type } from "../../tokens/theme";

const TONE_CLASS = {
  neutral: "text-neutral-300",
  bright: "text-neutral-100 font-medium",
  amber: "text-amber-400",
  crimson: "text-red-400",
};

function driftTone(value) {
  return value > 25 ? "amber" : "neutral";
}

function contextTone(value) {
  if (value > 90) return "crimson";
  if (value > 80) return "amber";
  return "neutral";
}

function Cell({ label, value, tone = "neutral" }) {
  return (
    <div className="flex min-w-0 flex-col gap-0.5">
      <span className={type.micro}>{label}</span>
      <span className={`truncate text-sm font-mono tabular-nums ${TONE_CLASS[tone]}`}>{value}</span>
    </div>
  );
}

export default function LedgerRow({ entry }) {
  return (
    <div className="space-y-3 p-4">
      <div className="space-y-2">
        <div>
          <span className={type.micro}>Human Intent Anchor</span>
          <p className={type.body}>{entry.humanIntent}</p>
        </div>
        <div>
          <span className={type.micro}>Machine Assumption Log</span>
          <p className={`${type.body} italic text-neutral-400`}>{entry.machineAssumption}</p>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-2 border-t border-neutral-800/60 pt-2">
        <Cell label="MODEL" value={entry.technicalMetrics.model} />
        <Cell
          label="COGS / AER"
          value={`$${entry.financials.cogs.toFixed(3)} / ${entry.financials.aer.toFixed(0)}`}
          tone="bright"
        />
        <Cell label="LATENCY VAR" value={entry.technicalMetrics.latencyVariance} />
        <Cell label="DRIFT" value={`${entry.intentDriftVariance}%`} tone={driftTone(entry.intentDriftVariance)} />
        <Cell label="CONTEXT" value={`${entry.contextWindowUsage}%`} tone={contextTone(entry.contextWindowUsage)} />
      </div>
    </div>
  );
}
