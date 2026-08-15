// SPEC-02: AgentBlock (Left Column) — src/docs/component-specs.md
// Tier 0/1: identity + status badge. Tier 2 (added here): role + live metrics.

import { statusLabels, statusTokenMap, layout, type } from "../../tokens/theme";

function MetricCell({ label, value }) {
  return (
    <div className="flex min-w-0 flex-col gap-0.5">
      <span className={type.micro}>{label}</span>
      <span className={`${type.data} truncate`}>{value}</span>
    </div>
  );
}

export default function AgentBlock({ agent }) {
  // Defensive lookups: the live feed (work/agent-activity/events.jsonl) is written
  // by an external hook and has carried out-of-vocabulary statuses before — an
  // unmapped status used to crash this component's render outright, white-screening
  // the whole left column. Fall back to neutral/idle styling instead.
  const statusToken = statusTokenMap[agent.status] ?? statusTokenMap.idle;
  const statusLabel = statusLabels[agent.status] ?? String(agent.status ?? "unknown").toUpperCase();
  const metrics = agent.metrics ?? {};
  const isPaused = agent.status === "paused";

  return (
    <div className={`${layout.card} p-3`}>
      <div className="flex items-center justify-between gap-3">
        <span className={`${type.body} truncate`}>{agent.name}</span>
        <span
          className={`${statusToken.badge} flex shrink-0 items-center gap-1.5 px-2 py-0.5 text-[10px] font-mono uppercase tracking-widest`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${statusToken.dot} ${isPaused ? "animate-pulse" : ""}`} />
          {statusLabel}
        </span>
      </div>

      <p className={`${type.log} mt-1 truncate`}>{agent.role}</p>

      <div className="mt-2 grid grid-cols-3 gap-2 border-t border-neutral-800/60 pt-2">
        <MetricCell label="MODEL" value={metrics.model ?? "—"} />
        <MetricCell label="LATENCY" value={metrics.latency ?? "—"} />
        <MetricCell label="TOKEN VEL" value={metrics.tokenVelocity ?? "—"} />
      </div>
    </div>
  );
}
