// RATIONALE GATE (DECISION-14, 2026-08-15) — Pre-Commitment Log.
// Sits between SystemHeader and the locked 3-column grid — additive, does not
// touch the 25/45/30 layout (DECISION-0C intact). Logs the assumption behind a
// task BEFORE it starts, upstream of Intent Drift (which the Circuit-Breaking
// Gate already covers during execution).
// DECISION-14 Q1: the strip stays full-width and always visible — a
// pre-commitment behind a click would reopen the void it exists to close.
// DECISION-14 Q2: entries persist via the mediator (POST /precommit) and the
// local sync pipeline; local-only and gitignored, so the public deployment
// still shows only mockLedgerData.json's seed entries.

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { useAppContext } from "../AppContext";
import { accent, layout, type } from "../../tokens/theme";

function LogForm({ onSubmit, onCancel }) {
  const [taskLabel, setTaskLabel] = useState("");
  const [assumption, setAssumption] = useState("");
  const [alternativeRejected, setAlternativeRejected] = useState("");
  const [signal, setSignal] = useState("");

  const canSubmit = taskLabel.trim() && assumption.trim();

  const fieldClass =
    "w-full rounded-none border border-neutral-800/60 bg-neutral-950 px-2 py-1.5 text-xs font-sans text-neutral-200 placeholder:text-neutral-600 focus:border-cyan-500 focus:outline-none";

  return (
    <div className={`${layout.card} space-y-2 p-3`}>
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <span className={type.micro}>Task</span>
          <input
            className={fieldClass}
            value={taskLabel}
            onChange={(e) => setTaskLabel(e.target.value)}
            placeholder="What are you about to build?"
          />
        </div>
        <div className="space-y-1">
          <span className={type.micro}>Alternative Rejected</span>
          <input
            className={fieldClass}
            value={alternativeRejected}
            onChange={(e) => setAlternativeRejected(e.target.value)}
            placeholder="What you're choosing not to do"
          />
        </div>
      </div>
      <div className="space-y-1">
        <span className={type.micro}>Assumption</span>
        <input
          className={fieldClass}
          value={assumption}
          onChange={(e) => setAssumption(e.target.value)}
          placeholder="What you're assuming is true"
        />
      </div>
      <div className="space-y-1">
        <span className={type.micro}>Signal (optional)</span>
        <input
          className={fieldClass}
          value={signal}
          onChange={(e) => setSignal(e.target.value)}
          placeholder="What would prove/disprove this"
        />
      </div>
      <div className="flex gap-2 pt-1">
        <button
          type="button"
          disabled={!canSubmit}
          onClick={() => {
            onSubmit({ taskLabel, assumption, alternativeRejected, signal });
            setTaskLabel("");
            setAssumption("");
            setAlternativeRejected("");
            setSignal("");
          }}
          className={`${accent.bg} flex-1 rounded-none border ${accent.border} px-2 py-1.5 text-xs font-mono font-semibold uppercase tracking-widest ${accent.text} transition-colors hover:bg-cyan-950/60 disabled:cursor-not-allowed disabled:opacity-40`}
        >
          Log Commitment
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-none border border-neutral-800/60 px-2 py-1.5 text-xs font-mono uppercase tracking-widest text-neutral-500 transition-colors hover:text-neutral-300"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

function CommitmentChip({ entry }) {
  return (
    <div className={`${layout.card} min-w-[220px] max-w-[280px] shrink-0 space-y-1 p-2`}>
      <div className="flex items-center justify-between gap-2">
        <span className={`${type.alertTitle} truncate text-xs`}>{entry.taskLabel}</span>
        <span className={`${type.micro} shrink-0`}>{entry.timestamp}</span>
      </div>
      <p className={`${type.body} truncate text-xs italic text-neutral-400`}>{entry.assumption}</p>
    </div>
  );
}

export default function RationaleGate() {
  const { preCommitments, logPreCommitment } = useAppContext();
  const [formOpen, setFormOpen] = useState(false);

  return (
    <div className={`${layout.columnHeader} flex flex-col gap-2 border-b-0 ${layout.divider} px-4 py-2`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={type.heading}>Rationale Gate — Pre-Commitment Log</span>
          <span className={`${type.micro} rounded-none border border-neutral-800/60 px-1.5 py-0.5`}>
            {preCommitments.length} LOGGED
          </span>
        </div>
        <button
          type="button"
          onClick={() => setFormOpen((v) => !v)}
          className={`flex items-center gap-1 rounded-none border ${formOpen ? "border-neutral-700 text-neutral-300" : `${accent.border} ${accent.text}`} px-2 py-1 text-[10px] font-mono uppercase tracking-widest transition-colors`}
        >
          {formOpen ? <X className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
          {formOpen ? "Close" : "Log Commitment"}
        </button>
      </div>

      {formOpen && (
        <LogForm
          onSubmit={(payload) => {
            logPreCommitment(payload);
            setFormOpen(false);
          }}
          onCancel={() => setFormOpen(false)}
        />
      )}

      {preCommitments.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {preCommitments.map((entry) => (
            <CommitmentChip key={entry.id} entry={entry} />
          ))}
        </div>
      )}
    </div>
  );
}
