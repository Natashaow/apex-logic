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

  // SPEC-07 / DECISION-6 — derived, never duplicated into state.
  const highestActiveSeverity = useMemo(() => {
    if (trappedAnomalies.some((a) => a.severity === "critical")) return "critical";
    if (trappedAnomalies.length > 0) return "high";
    return null;
  }, [trappedAnomalies]);

  const prependLog = useCallback((entry) => {
    setTerminalLogs((prev) => [entry, ...prev]);
  }, []);

  // app-context-contract.md Section 3 — approveAnomaly
  const approveAnomaly = useCallback(
    (anomalyId) => {
      const anomaly = trappedAnomalies.find((a) => a.id === anomalyId);
      if (!anomaly) return;

      setTrappedAnomalies((prev) => prev.filter((a) => a.id !== anomalyId));
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
    [trappedAnomalies, prependLog]
  );

  // app-context-contract.md Section 3 — rejectAnomaly (also the auto-abort-on-expiry path)
  const rejectAnomaly = useCallback(
    (anomalyId, reason = "operator REJECT_AND_KILL") => {
      const anomaly = trappedAnomalies.find((a) => a.id === anomalyId);
      if (!anomaly) return;

      setTrappedAnomalies((prev) => prev.filter((a) => a.id !== anomalyId));
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
    [trappedAnomalies, prependLog]
  );

  // app-context-contract.md Section 3 — emergencyStop
  const emergencyStop = useCallback(() => {
    setAgents((prev) => prev.map((agent) => ({ ...agent, status: "halted" })));
    setTrappedAnomalies([]);

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
