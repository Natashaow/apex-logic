// Extracted from: src/docs/strategic-assumptions.md
// Drives: compliance badge panel, Human Gate UX guardrails, risk status labels.

export const assumptions = [
  {
    id: "intercept-hook",
    category: "Runtime & Infrastructure",
    title: "Deterministic Intercept Hook Availability",
    assumption:
      "The underlying multi-agent framework exposes clean, low-latency event hooks that can pause execution before an external tool or file system action is committed.",
    riskIfFalse:
      "Dashboard degrades into a passive post-incident log rather than an active circuit breaker.",
    uiImpact: "circuit-breaker", // which UI section this assumption validates
  },
  {
    id: "rationale-serialization",
    category: "Runtime & Infrastructure",
    title: "Standardized Agent Rationale Serialization",
    assumption:
      "Agents are explicitly prompted to self-document their operational hypothesis using a standardized metadata frame or JSON block alongside their tool call commands.",
    riskIfFalse:
      "UI forced to run a secondary LLM parsing loop, introducing significant cost and latency overheads.",
    uiImpact: "rationale-ledger",
  },
  {
    id: "automation-bias",
    category: "Human & Organizational",
    title: "Mitigation of Automation Bias",
    assumption:
      "The Architect-Governor will actually read high-density technical traces rather than rubber-stamping approvals to clear their screen.",
    riskIfFalse: "Meaningful human oversight collapses — the core governance guarantee is void.",
    guardrailBuilt:
      "Dashboard deliberately separates plain-English business risk from the technical code diff to combat cognitive fatigue.",
    uiImpact: "human-gate", // the two-section layout of the Human Gate card is a direct response
  },
  {
    id: "token-cost-mapping",
    category: "Human & Organizational",
    title: "Direct Financial-to-Token Mapping Transparency",
    assumption:
      "The enterprise utilizes token proxy layers (OpenRouter or Portkey) that emit standardized real-time cost data.",
    riskIfFalse: "COGS calculations become estimated rather than precise, reducing financial accountability value.",
    uiImpact: "cogs-panel",
  },
];

// Compliance alignment matrix — drives the regulatory badge strip in the UI.
export const complianceMatrix = {
  framework: "Singapore IMDA Model AI Governance Framework for Agentic AI",
  version: "Version 1.5, May 2026",
  pillars: [
    {
      id: "bounding-risks",
      focusArea: "Bounding Risks Upfront",
      implementation:
        "Trapping anomalous, high-variance prompts before execution occurs.",
      uiElement: "circuit-breaker-status",
    },
    {
      id: "human-accountability",
      focusArea: "Meaningful Human Accountability",
      implementation: "The Human Gate acts as a mandatory operational circuit breaker.",
      uiElement: "human-gate-card",
    },
    {
      id: "technical-controls",
      focusArea: "Technical Controls & Processes",
      implementation:
        "Centralized state tracing ledger linking Intent directly to COGS.",
      uiElement: "ledger-panel",
    },
  ],
};

// Human Gate UX guardrail — this is the design rule extracted from assumption #3.
// The gate card MUST render in two distinct visual zones to prevent rubber-stamping.
export const humanGateGuardrail = {
  zone1: {
    label: "Business Risk Summary",
    tone: "plain-english",
    purpose: "Immediate comprehension — no jargon. Answers: what is at stake?",
  },
  zone2: {
    label: "Technical Code Diff",
    tone: "monospace-technical",
    purpose: "Expandable drawer — answers: exactly what will change?",
  },
  approvalLabel: "Approve & Sign",
  killLabel: "Kill Thread",
};
