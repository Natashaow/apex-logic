// Extracted from: src/docs/product-strategy.md
// Source of truth for all product narrative copy rendered in the UI.

export const brand = {
  name: "Apex Logic",
  tagline: "Bridging Human Intent and Autonomous Execution.",
  mission:
    "To empower engineering architects and corporate teams to scale autonomous agent infrastructure safely by providing the missing governance layer: a centralized observation, financial attribution, and circuit-breaking interface that keeps human intent securely at the apex of autonomous execution.",
};

export const valueProps = [
  {
    id: "intent-mapping",
    title: "Contextual Intent-to-Asset Mapping",
    description:
      "Permanently binds the original Human Intent prompt to the localized Machine Assumption, specific code modifications, and real-time financial expenditure.",
  },
  {
    id: "rationale-ledger",
    title: "Rationale Documentation Ledger",
    description:
      "Captures intent passively at the millisecond of creation, building a living, human-readable historical timeline of the system's evolution.",
  },
  {
    id: "compute-costing",
    title: "Granular Compute-to-Value Costing",
    description:
      "Treats token burn and compute latency as direct variable Cost of Goods Sold (COGS), grouped by agent identity and business outcome.",
  },
];

export const personas = [
  {
    id: "architect-governor",
    title: "The Architect-Governor",
    role: "Tech Lead / AI Engineer / Pod Owner",
    priority: "Primary",
    friction: "The Rationale Void & Memory Tax",
    frictionDetail:
      "Agents bypass traditional code review and modify systems on the fly. Tech leads suffer acute alert fatigue and lack time to reconstruct volatile server logs.",
  },
  {
    id: "sovereign-operator",
    title: "The Sovereign Operator",
    role: "Hyper-Scalable Solo Founder / Digital Agency Owner",
    priority: "Secondary",
    friction: "The Capital Bleed",
    frictionDetail:
      "Total financial vulnerability to infinite execution logic loops or inefficient model routing that can drain credit cards overnight.",
  },
  {
    id: "compliance-controller",
    title: "The Compliance Controller",
    role: "Head of AI Governance / Corporate Finance Director",
    priority: "Tertiary",
    friction: "The Translation Gap",
    frictionDetail:
      "Total inability to translate raw machine metadata (tokens, latency) into clean, audit-ready financial metrics (COGS) and plain-English business justifications.",
  },
];

// The three-column intercept protocol — drives the main dashboard layout logic.
export const interceptProtocol = {
  regulatoryAnchor: "Singapore IMDA Model AI Governance Framework",
  pillars: ["Bounding Risk Upfront", "Ensuring Meaningful Human Accountability"],
  steps: [
    {
      id: "agent-execution",
      label: "Agent Execution State",
      column: "left",
      trigger: null,
    },
    {
      id: "circuit-breaker",
      label: "Circuit Breaker",
      column: "left",
      trigger: "High-Variance Action Detected",
      state: "PAUSED",
      stateColor: "amber",
    },
    {
      id: "human-gate",
      label: "Human Gate Review",
      column: "right",
      trigger: "Circuit Breaker Trip",
      action: "Tech Lead reads Plain-English Rationale + Code Diff",
    },
    {
      id: "apex-resolution",
      label: "Apex Resolution",
      column: "right",
      trigger: "Human Gate Approval",
      action: "Approve & Sign to commit asset to ledger, or kill thread",
    },
  ],
};
