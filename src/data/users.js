// Extracted from: src/docs/user-architecture.md
// Drives: persona context panel, journey phase indicators, friction labels, column emphasis logic.

// --- Landscape Headlines ---
// These are used verbatim as UI copy — panel headers, tooltips, empty-state labels.
export const landscapeHeadlines = {
  documentationTax: {
    label: "The Documentation Tax",
    description:
      "Modern technical environments move too fast for manual documentation. Under high cognitive load, engineers suffer from acute memory fatigue — leaving a critical rationale void when autonomous agents run background loops.",
  },
  translationTrap: {
    label: "The Translation Trap",
    description:
      "AI systems fail probabilistically, not deterministically. Tech leads need a visual observability system that translates raw model behavior into plain-English reasoning that both senior engineers and non-technical stakeholders can instantly understand.",
  },
};

// --- Persona Stack ---
export const personas = [
  {
    id: "architect-governor",
    priority: "Primary",
    title: "The Architect-Governor",
    role: "Tech Lead / Pod Architect / Lead AI Engineer",
    accountability: "System Reliability (Uptime), Deployment Velocity, Architectural Resilience",
    primaryColumn: "left", // which dashboard column this persona anchors to
    frictionPoints: [
      {
        id: "rationale-void",
        label: "Rationale Void & Memory Tax",
        description:
          "Traditional repos record what changed but provide zero record of why. Under pressure, the Tech Lead lacks time to reverse-engineer the bot's logic path.",
        // Design constraint: every ledger row MUST display Human Intent — never hidden behind a click.
        designConstraint: "humanIntent-always-visible",
      },
      {
        id: "vanishing-context",
        label: "Vanishing Runtime Context",
        description:
          "Multi-agent loops generate massive streams of transient runtime data and chat memories that vanish from standard text log aggregates.",
        // Design constraint: terminal log must appear to scroll continuously — static logs fail this.
        designConstraint: "terminal-continuous-scroll",
      },
      {
        id: "shadow-execution",
        label: "Shadow Execution Risk",
        description:
          "AI agents completely bypass human pull-request reviews, altering system routes and burning compute resources without a deterministic audit trail.",
        // Design constraint: PAUSED state must flash/pulse — a static amber badge is insufficient.
        designConstraint: "paused-state-must-pulse",
      },
      {
        id: "language-barrier",
        label: "Language Barrier",
        description:
          "Tech Lead lacks visual monitoring systems to explain complex agent failures or token spikes to non-technical stakeholders.",
        // Design constraint: plain-English zone must appear BEFORE code diff zone, not after.
        designConstraint: "plainenglish-before-diff",
      },
    ],
    dashboardValue:
      "Utilizes the Traceable Audit Stream and the Human Gate Circuit Breaker to instantly capture human intent alongside machine assumptions — removing the documentation burden entirely.",
  },
  {
    id: "sovereign-operator",
    priority: "Secondary",
    title: "The Sovereign Operator",
    role: "Hyper-Scalable Solo Founder / Digital Agency Owner",
    accountability: "Cash flow margins, operational capital, automated workforce profitability",
    primaryColumn: "center",
    frictionPoints: [
      {
        id: "capital-bleed",
        label: "Capital Bleed",
        description:
          "Financial vulnerability to unmonitored token burn and infinite execution loops draining limited operational capital. No corporate treasury to absorb mistakes.",
        designConstraint: "cogs-always-prominent",
      },
    ],
    dashboardValue:
      "Relies on the Machine P&L Ledger to analyze real-time Agent Efficiency Ratios (AER) to protect cash flow margins.",
  },
  {
    id: "compliance-controller",
    priority: "Tertiary",
    title: "The Compliance Controller",
    role: "Head of AI Operations / Corporate Finance Director",
    accountability: "Corporate reporting, audit readiness, operational risk",
    primaryColumn: "center",
    frictionPoints: [
      {
        id: "translation-gap",
        label: "The Translation Gap",
        description:
          "Deep anxiety regarding Shadow AI deployment. Needs to tie volatile compute costs (Tokens/COGS) directly to business outcomes for corporate reporting and accountability.",
        designConstraint: "plainenglish-translation-always-present",
      },
    ],
    dashboardValue:
      "Uses the plain-English translation layer of the Intent-to-Asset Ledger to audit corporate compliance and approve operational expenses without reading raw backend code.",
  },
];

// --- User Journey Matrix ---
// The four phases drive the emotional state arc displayed in onboarding / demo mode.
// Phase IDs also map to agent status transitions in the left column audit stream.
export const journeyPhases = [
  {
    id: "autonomous-spark",
    phase: 1,
    title: "The Autonomous Spark",
    systemEvent: "Operator types a high-level natural language prompt to patch a performance issue.",
    userAction: "Sets master business goal and relies on multi-agent execution.",
    emotionalState: "Optimistic / Relieved",
    emotionalQuote: "The automation tool is handling it, I can focus on my core sprint tasks.",
    emotionalValence: "positive",
    uxPainPoint:
      "False sense of security; no visibility into initial multi-agent path choices.",
    uxOpportunity: {
      label: "Passive Rationale Stamping",
      description: "Capture short-term prompt context right at the input interface.",
    },
    agentStatus: "processing",
  },
  {
    id: "shadow-shift",
    phase: 2,
    title: "The Shadow Shift",
    systemEvent: "Autonomous DevOps bot changes 42 lines of routing code at 3:14 AM.",
    userAction: "Sleeping / Off-line.",
    emotionalState: "Uneasy / Anxious",
    emotionalQuote:
      "I hope the background routing loops aren't introducing hidden vulnerabilities.",
    emotionalValence: "negative",
    uxPainPoint:
      "Total lack of real-time visibility; agents bypass standard code-review gates completely.",
    uxOpportunity: {
      label: "The Amber Circuit Breaker",
      description: "Trap high-variance code paths in a frozen state before deployment.",
    },
    agentStatus: "paused",
  },
  {
    id: "monday-reckoning",
    phase: 3,
    title: "The Monday Reckoning",
    systemEvent:
      "The Finance Director flags a major infra spike; the CTO asks for an immediate breakdown.",
    userAction:
      "Sifting through massive raw text server logs and checking standard Git diff logs.",
    emotionalState: "Frustrated / Overwhelmed",
    emotionalQuote:
      "GitHub just says 'auto-update.' I don't remember what I typed, and I have zero documentation.",
    emotionalValence: "critical",
    uxPainPoint:
      "The Rationale Void: Tracking code changes without human context or recorded business intent.",
    uxOpportunity: {
      label: "The Living System Story",
      description:
        "Convert raw token streams into a scannable, plain-English chronological narrative.",
    },
    agentStatus: "idle",
  },
  {
    id: "unified-protocol",
    phase: 4,
    title: "The Unified Protocol",
    systemEvent: "The operator opens Apex Logic to audit the system state changes.",
    userAction:
      "Reviews the high-density ledger row; maps cost directly to prompt intent.",
    emotionalState: "In Control / Validated",
    emotionalQuote:
      "The narrative is perfectly clear. I see the technical trace and the financial justification instantly.",
    emotionalValence: "resolved",
    uxPainPoint:
      "High cognitive friction if metrics are layout-heavy or confusing to read quickly.",
    uxOpportunity: {
      label: "Unified Card Integration",
      description:
        "Bracket technical data points directly alongside business cost calculations.",
    },
    agentStatus: "approved",
  },
];
