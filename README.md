# Apex Logic

**A control plane for autonomous AI agents — it sits between human intent and agent execution, and records why every action happened.**

🔗 **Live:** [apex-logic-eight.vercel.app](https://apex-logic-eight.vercel.app)

---

## The problem: the Rationale Void

AI agents now write code, reroute infrastructure, and spend money without waiting for approval. Version control captures *what* changed. Almost nothing captures *why* — the human prompt that started it, the assumption the agent made to fill the gaps, or what the run cost.

When a system changes at 3am because an agent decided it should, reconstructing the reasoning takes hours nobody has. That gap is what this project calls the **Rationale Void**.

## What Apex Logic does

It binds intent to execution while the agent is still running, in a three-column live terminal:

| Column | Role |
|---|---|
| **Audit Stream** | Real-time registry of agent activity — a continuous execution log |
| **Intent Ledger** | Each row binds human intent → the agent's assumption → the resulting change → live cost |
| **Apex Checkpoint** | High-risk actions freeze in an amber `PAUSED` state, awaiting *Approve & Sign* or *Reject & Kill* |

Three design choices make it agent-native rather than a dashboard bolted onto agent output:

1. **Intent-to-asset mapping** — the original prompt stays attached to the artifact it produced.
2. **Pre-execution interception** — high-variance actions pause *before* they commit, not after.
3. **Compute-to-value costing** — token burn and latency are treated as variable cost of goods, attributed per agent.

## Running on real data

Apex Logic isn't a mockup fed by fixtures. It reads a live event feed emitted by my own Claude Code sessions — background jobs, scheduled runs, and subagent lifecycle events — via lifecycle hooks that append to a shared JSONL feed.

Building it against real agent activity surfaced things a mocked demo would have hidden: an unfiltered event class flooding the feed with phantom agents, and a status value outside the renderer's vocabulary that took out an entire column. Both were only visible because the data was real.

```bash
npm run watch-activity   # tail the live agent event feed
```

## Design

Dark operator-console aesthetic — the interface is meant to be watched while something else is doing the work. Status is carried by a constrained token vocabulary (`processing`, `idle`, `paused`, `approved`, `halted`) rather than ad-hoc colour, so any state the system can be in has exactly one visual representation.

## Stack

React 19 · Vite · Tailwind CSS 4 · Lucide · deployed on Vercel

## Running locally

```bash
npm install
npm run dev
```

## Status

Working interactive prototype, actively developed. Positioned as a portfolio systems-architecture artifact rather than a commercial product — the agent-observability space has substantial existing tooling (LangSmith, Langfuse, Arize, and native interrupt primitives in LangGraph and the OpenAI Agents SDK), and this explores the intent-and-cost framing rather than claiming to beat them.

---

Built by [Natasha](https://github.com/Natashaow) — product designer working on AI-native systems.
