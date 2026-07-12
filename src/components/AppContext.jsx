// APEX LOGIC — React State Engine
// Contract: src/docs/app-context-contract.md — read that first before changing this file.
// Exposes state + derived values + action handlers to every section/ui component.

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import mockData from "../data/mockLedgerData.json";

const AppContext = createContext(null);

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
  const anomaliesRef = useRef(mockData.trappedAnomalies);

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
  const agentsRef = useRef(agents);
  useEffect(() => {
    agentsRef.current = agents;
  }, [agents]);

  useEffect(() => {
    anomaliesRef.current = trappedAnomalies;
  }, [trappedAnomalies]);

  useEffect(() => {
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
  }, [prependLog]);

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
      const newEntry = {
        id: `tx-${Date.now()}`,
        timestamp: timestampNow(),
        agentId: anomaly.agentId,
        humanIntent: anomaly.humanIntent,
        machineAssumption: anomaly.machineAssumption,
        technicalMetrics: { model: "—", latencyVariance: "—" },
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
      highestActiveSeverity,
      approveAnomaly,
      rejectAnomaly,
      emergencyStop,
      prependLog,
    }),
    [
      agents,
      ledgerEntries,
      trappedAnomalies,
      terminalLogs,
      systemMetrics,
      highestActiveSeverity,
      approveAnomaly,
      rejectAnomaly,
      emergencyStop,
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
