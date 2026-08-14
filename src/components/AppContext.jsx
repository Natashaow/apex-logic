// APEX LOGIC — React State Engine
// Contract: src/docs/app-context-contract.md — read that first before changing this file.
// Exposes state + derived values + action handlers to every section/ui component.

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import mockData from "../data/mockLedgerData.json";
import { useLiveLedgerData } from "../hooks/useLiveLedgerData";

const AppContext = createContext(null);

// DECISION-9 (2026-08-15) — fire-and-forget POST to the local mediator.
// Never awaited by callers, never gates the optimistic local state update —
// see approveAnomaly/rejectAnomaly below and app-context-contract.md §3.
const MEDIATOR_URL = "http://localhost:4177/resolve";
function postResolution(anomalyId, outcome, reason) {
  if (!import.meta.env.DEV) return;
  fetch(MEDIATOR_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ anomalyId, outcome, reason }),
  }).catch(() => {
    // Mediator not running — expected if `npm run mediator` hasn't been
    // started locally. Not an error the UI needs to surface.
  });
}

function timestampNow() {
  return new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}

function parseEstimatedCost(estimatedCost = "") {
  const tokensMatch = /([0-9,]+)\s*tokens/.exec(estimatedCost);
  const costMatch = /\$([0-9.]+)/.exec(estimatedCost);
  return {
    tokens: tokensMatch ? parseInt(tokensMatch[1].replace(/,/g, ""), 10) : 0,
    cogs: costMatch ? parseFloat(costMatch[1]) : 0,
  };
}

export function AppProvider({ children }) {
  const [agents, setAgents] = useState(mockData.agents);
  const [ledgerEntries, setLedgerEntries] = useState(mockData.ledgerEntries);
  const [trappedAnomalies, setTrappedAnomalies] = useState(mockData.trappedAnomalies);
  const [terminalLogs, setTerminalLogs] = useState(mockData.terminalLogs);
  const [systemMetrics, setSystemMetrics] = useState(mockData.systemMetrics);
  const [preCommitments, setPreCommitments] = useState(mockData.preCommitments ?? []);
  const anomaliesRef = useRef(mockData.trappedAnomalies);

  // DECISION-9 (2026-08-15) — local-only live feed. See app-context-contract.md
  // §1: mockData remains the init source; once a live poll succeeds, its
  // payload overwrites state below (no diff/merge — latest poll wins, see
  // §1's documented v1 rough edge on optimistic-mutation flicker). setState
  // calls happen inside the hook's fetch callback, not a downstream effect.
  const applyLiveSnapshot = useCallback((snapshot) => {
    setAgents(snapshot.agents);
    setLedgerEntries(snapshot.ledgerEntries);
    setTrappedAnomalies(snapshot.trappedAnomalies);
    anomaliesRef.current = snapshot.trappedAnomalies;
    setTerminalLogs(snapshot.terminalLogs);
    setSystemMetrics(snapshot.systemMetrics);
  }, []);
  const { isLive } = useLiveLedgerData(applyLiveSnapshot);

  // SPEC-07 / DECISION-6 — derived, never duplicated into state.
  const highestActiveSeverity = useMemo(() => {
    if (trappedAnomalies.some((a) => a.severity === "critical")) return "critical";
    if (trappedAnomalies.length > 0) return "high";
    return null;
  }, [trappedAnomalies]);

  const prependLog = useCallback((entry) => {
    setTerminalLogs((prev) => [entry, ...prev]);
  }, []);

  // app-context-contract.md Section 4 — terminal continuous scroll (SPEC-04 /
  // `terminal-continuous-scroll`). Steady-state noise only (TOOL_CALL / STATE_CHANGE) —
  // real CIRCUIT_BREAK / CRITICAL_HALT / LEDGER_COMMIT lines come from the action
  // handlers above, never manufactured here. Reads agents via a ref so this
  // effect runs once on mount rather than restarting every time agents change.
  // DECISION-9 (2026-08-15): superseded when isLive — see contract §4. This
  // generator only runs on mock/public-deployment data.
  const agentsRef = useRef(agents);
  useEffect(() => {
    agentsRef.current = agents;
  }, [agents]);

  useEffect(() => {
    anomaliesRef.current = trappedAnomalies;
  }, [trappedAnomalies]);

  useEffect(() => {
    if (isLive) return undefined;
    let timeoutId;

    const scheduleNext = () => {
      const delay = 3000 + Math.random() * 2000; // 3–5s, randomized per SPEC-04
      timeoutId = setTimeout(() => {
        const pool = agentsRef.current.filter((agent) => agent.status !== "halted");

        if (pool.length > 0) {
          const agent = pool[Math.floor(Math.random() * pool.length)];
          const latency = Math.floor(30 + Math.random() * 120);
          const tokensIn = Math.floor(100 + Math.random() * 500);
          const tokensOut = Math.floor(50 + Math.random() * 200);
          const isToolCall = Math.random() > 0.4;

          prependLog({
            ts: timestampNow(),
            agentId: agent.id,
            event: isToolCall ? "TOOL_CALL" : "STATE_CHANGE",
            detail: isToolCall
              ? `${agent.role.split(" ")[0].toLowerCase()}.probe() → latency: ${latency}ms | tokens: ${tokensIn} in / ${tokensOut} out`
              : `status: ${agent.status} → ${agent.status} | heartbeat: routine_scan`,
          });
        }

        scheduleNext();
      }, delay);
    };

    scheduleNext();
    return () => clearTimeout(timeoutId);
  }, [prependLog, isLive]);

  // app-context-contract.md Section 3 — approveAnomaly
  const approveAnomaly = useCallback(
    (anomalyId) => {
      const anomaly = anomaliesRef.current.find((a) => a.id === anomalyId);
      if (!anomaly) return;

      anomaliesRef.current = anomaliesRef.current.filter((a) => a.id !== anomalyId);
      setTrappedAnomalies(anomaliesRef.current);
      setAgents((prev) =>
        prev.map((agent) =>
          agent.id === anomaly.agentId ? { ...agent, status: "processing" } : agent
        )
      );

      const { tokens, cogs } = parseEstimatedCost(anomaly.technicalTrace?.estimatedCost);
      // DECISION-11 — technicalTrace never carried a model field; the real
      // signal is the agent's own metrics.model, already in agentsRef.
      const sourceAgent = agentsRef.current.find((a) => a.id === anomaly.agentId);
      const newEntry = {
        id: `tx-${Date.now()}`,
        timestamp: timestampNow(),
        agentId: anomaly.agentId,
        humanIntent: anomaly.humanIntent,
        machineAssumption: anomaly.machineAssumption,
        technicalMetrics: { model: sourceAgent?.metrics?.model ?? "—", latencyVariance: "—" },
        financials: { cogs, attributedRevenue: 0, aer: 0 },
        intentDriftVariance: 0,
        contextWindowUsage: 0,
        status: "approved",
      };
      setLedgerEntries((prev) => [newEntry, ...prev]);

      prependLog({
        ts: newEntry.timestamp,
        agentId: anomaly.agentId,
        event: "LEDGER_COMMIT",
        detail: `${newEntry.id} committed → approved via Human Gate | COGS: $${cogs.toFixed(3)}`,
      });

      setSystemMetrics((prev) => ({
        ...prev,
        totalTokensBurned: prev.totalTokensBurned + tokens,
        totalCogs: +(prev.totalCogs + cogs).toFixed(3),
      }));

      // DECISION-9 — fire-and-forget, does not gate the local update above.
      postResolution(anomalyId, "approved");
    },
    [prependLog]
  );

  // app-context-contract.md Section 3 — rejectAnomaly (also the auto-abort-on-expiry path)
  const rejectAnomaly = useCallback(
    (anomalyId, reason = "operator REJECT_AND_KILL") => {
      const anomaly = anomaliesRef.current.find((a) => a.id === anomalyId);
      if (!anomaly) return;

      anomaliesRef.current = anomaliesRef.current.filter((a) => a.id !== anomalyId);
      setTrappedAnomalies(anomaliesRef.current);
      setAgents((prev) =>
        prev.map((agent) =>
          agent.id === anomaly.agentId ? { ...agent, status: "halted" } : agent
        )
      );

      prependLog({
        ts: timestampNow(),
        agentId: anomaly.agentId,
        event: "CRITICAL_HALT",
        detail: `${anomaly.agentId} thread terminated | reason: ${reason}`,
      });

      // DECISION-9 — fire-and-forget, does not gate the local update above.
      postResolution(anomalyId, "rejected", reason);
    },
    [prependLog]
  );

  // Rationale Gate (Tier 1, 2026-08-15) — pre-commitment log. Fired before a
  // task starts, not gated on any agent action. Local-only for this MVP: not
  // yet wired into scripts/sync-activity-log.mjs or the live-poll snapshot.
  const logPreCommitment = useCallback(
    ({ taskLabel, assumption, alternativeRejected, signal }) => {
      const entry = {
        id: `pc-${Date.now()}`,
        timestamp: timestampNow(),
        taskLabel,
        assumption,
        alternativeRejected,
        signal,
      };
      setPreCommitments((prev) => [entry, ...prev]);
      prependLog({
        ts: entry.timestamp,
        agentId: "operator",
        event: "RATIONALE_LOGGED",
        detail: `${entry.id} — "${taskLabel}" | assumption logged before execution`,
      });
    },
    [prependLog]
  );

  // app-context-contract.md Section 3 — emergencyStop
  const emergencyStop = useCallback(() => {
    setAgents((prev) => prev.map((agent) => ({ ...agent, status: "halted" })));
    anomaliesRef.current = [];
    setTrappedAnomalies(anomaliesRef.current);

    prependLog({
      ts: timestampNow(),
      agentId: "system",
      event: "GLOBAL_KILL_SWITCH_ACTIVATED",
      detail: "Operator triggered EMERGENCY STOP — all agent threads halted, all trapped anomalies cleared",
    });
  }, [prependLog]);

  const value = useMemo(
    () => ({
      agents,
      ledgerEntries,
      trappedAnomalies,
      terminalLogs,
      systemMetrics,
      preCommitments,
      highestActiveSeverity,
      isLive,
      approveAnomaly,
      rejectAnomaly,
      emergencyStop,
      logPreCommitment,
      prependLog,
    }),
    [
      agents,
      ledgerEntries,
      trappedAnomalies,
      terminalLogs,
      systemMetrics,
      preCommitments,
      highestActiveSeverity,
      isLive,
      approveAnomaly,
      rejectAnomaly,
      emergencyStop,
      logPreCommitment,
      prependLog,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components -- context hook lives alongside its provider by design, see app-context-contract.md
export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return ctx;
}

export default AppContext;
