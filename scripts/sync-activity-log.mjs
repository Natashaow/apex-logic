#!/usr/bin/env node
// DECISION-9 (2026-08-15) — local-only live data sync.
//
// Reads the vault's append-only event log (work/agent-activity/events.jsonl,
// outside this repo — location set via VAULT_ROOT) and folds it into the same
// 5-key shape AppContext.jsx already expects from mockLedgerData.json:
//   agents[], ledgerEntries[], trappedAnomalies[], terminalLogs[], systemMetrics{}
//
// Writes public/generated/ledger-state.json (gitignored — never commit real
// agent-activity data, this repo is public) and regenerates the vault's
// work/agent-activity/Activity Log.md mirror in the same pass.
//
// events.jsonl line schema (one JSON object per line, append-only):
//   { ts, type: "agent_status", agentId, name, role, status, metrics: {model, latency, tokenVelocity} }
//   { ts, type: "terminal_log", agentId, event, detail }
//   { ts, type: "anomaly_trapped", id, agentId, severity, title, humanIntent, machineAssumption, technicalTrace, businessImpact, expirySeconds }
//   { ts, type: "resolution", anomalyId, outcome: "approved"|"rejected", reason? }
//     — written by scripts/mediator.mjs when a local Approve & Sign / Reject & Kill POST lands.
// First version — expect this schema to evolve as real usage shows what's missing.
//
// Read-only against the vault except for the Activity Log.md mirror it regenerates.
// Never writes to events.jsonl itself — that's append-only, written by whatever
// produced the event (Workflow runs, cron agents, the mediator).

import { existsSync, mkdirSync, readFileSync, watch, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const repoRoot = join(__dirname, '..')

const vaultRoot = process.env.VAULT_ROOT
if (!vaultRoot) {
  console.error('VAULT_ROOT env var not set — point it at the vault root (e.g. /Users/natasha/Documents/MyBrain)')
  process.exit(1)
}

const eventsPath = join(vaultRoot, 'work', 'agent-activity', 'events.jsonl')
const activityLogPath = join(vaultRoot, 'work', 'agent-activity', 'Activity Log.md')
const outDir = join(repoRoot, 'public', 'generated')
const outPath = join(outDir, 'ledger-state.json')

function readEvents() {
  if (!existsSync(eventsPath)) return []
  const raw = readFileSync(eventsPath, 'utf-8')
  const events = []
  for (const line of raw.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed) continue
    try {
      events.push(JSON.parse(trimmed))
    } catch {
      console.warn(`Skipping malformed line in events.jsonl: ${trimmed.slice(0, 80)}`)
    }
  }
  return events
}

// Fold the raw event stream into the same shape AppContext.jsx already
// expects. This mirrors AppContext's own approveAnomaly/rejectAnomaly logic
// on the Node side, since the sync script has no React state to mutate.
function deriveState(events) {
  const agents = new Map()
  const ledgerEntries = []
  const trappedAnomalies = new Map()
  const terminalLogs = []
  const systemMetrics = {
    totalTokensBurned: 0,
    totalCogs: 0,
    totalAttributedRevenue: 0,
    systemAer: 0,
    activeAgents: 0,
    pausedAgents: 0,
    idleAgents: 0,
    leakageRate: 0,
  }

  function parseEstimatedCost(str) {
    // Matches AppContext.jsx's parseEstimatedCost — "4,500 tokens ($0.09)"
    const tokenMatch = /([\d,]+)\s*tokens/.exec(str || '')
    const costMatch = /\$([\d.]+)/.exec(str || '')
    return {
      tokens: tokenMatch ? Number(tokenMatch[1].replace(/,/g, '')) : 0,
      cost: costMatch ? Number(costMatch[1]) : 0,
    }
  }

  for (const ev of events) {
    switch (ev.type) {
      case 'agent_status':
        agents.set(ev.agentId, {
          id: ev.agentId,
          name: ev.name,
          role: ev.role,
          status: ev.status,
          metrics: ev.metrics,
        })
        break

      case 'terminal_log':
        terminalLogs.unshift({ ts: ev.ts, agentId: ev.agentId, event: ev.event, detail: ev.detail })
        break

      case 'anomaly_trapped':
        trappedAnomalies.set(ev.id, {
          id: ev.id,
          agentId: ev.agentId,
          severity: ev.severity,
          title: ev.title,
          humanIntent: ev.humanIntent,
          machineAssumption: ev.machineAssumption,
          technicalTrace: ev.technicalTrace,
          businessImpact: ev.businessImpact,
          timestamp: ev.ts,
          expirySeconds: ev.expirySeconds,
        })
        if (agents.has(ev.agentId)) agents.get(ev.agentId).status = 'paused'
        break

      case 'resolution': {
        const anomaly = trappedAnomalies.get(ev.anomalyId)
        if (!anomaly) break
        trappedAnomalies.delete(ev.anomalyId)
        const agent = agents.get(anomaly.agentId)
        if (ev.outcome === 'approved') {
          if (agent) agent.status = 'processing'
          const { tokens, cost } = parseEstimatedCost(anomaly.technicalTrace?.estimatedCost)
          ledgerEntries.unshift({
            id: `tx-${ev.anomalyId}`,
            timestamp: ev.ts,
            agentId: anomaly.agentId,
            humanIntent: anomaly.humanIntent,
            machineAssumption: anomaly.machineAssumption,
            // DECISION-11 — technicalTrace never carried a model field; the
            // real signal is the source agent's own metrics.model.
            technicalMetrics: { model: agent?.metrics?.model ?? '—', latencyVariance: anomaly.technicalTrace?.promptVariance },
            financials: { cogs: cost, attributedRevenue: 0, aer: 0 },
            intentDriftVariance: 0,
            contextWindowUsage: 0,
            status: 'approved',
          })
          terminalLogs.unshift({ ts: ev.ts, agentId: anomaly.agentId, event: 'LEDGER_COMMIT', detail: `tx-${ev.anomalyId} committed | cost: $${cost}` })
          systemMetrics.totalTokensBurned += tokens
          systemMetrics.totalCogs += cost
        } else {
          if (agent) agent.status = 'halted'
          terminalLogs.unshift({ ts: ev.ts, agentId: anomaly.agentId, event: 'CRITICAL_HALT', detail: `${anomaly.agentId} thread terminated | reason: ${ev.reason || 'operator REJECT_AND_KILL'}` })
        }
        break
      }

      default:
        console.warn(`Unknown event type in events.jsonl: ${ev.type}`)
    }
  }

  const agentList = [...agents.values()]
  systemMetrics.activeAgents = agentList.filter(a => a.status === 'processing').length
  systemMetrics.pausedAgents = agentList.filter(a => a.status === 'paused').length
  systemMetrics.idleAgents = agentList.filter(a => a.status === 'idle').length

  return {
    agents: agentList,
    ledgerEntries,
    trappedAnomalies: [...trappedAnomalies.values()],
    terminalLogs,
    systemMetrics,
  }
}

function renderActivityLogMarkdown(state, eventCount) {
  const lines = [
    '---',
    'date: 2026-08-15',
    'description: "Generated, human-readable mirror of events.jsonl — real background/scheduled agent activity feeding Apex Logic\'s live control panel. Regenerated by apex-logic/scripts/sync-activity-log.mjs; never hand-edited."',
    'project: Apex Logic',
    'status: active',
    'tags:',
    '  - work-note',
    '  - project/apex-logic',
    '  - generated',
    '---',
    '',
    '# Agent Activity Log',
    '',
    '> [!note] Generated file — do not hand-edit',
    '> Regenerated by `apex-logic/scripts/sync-activity-log.mjs` from `events.jsonl` (same folder). Edits here are overwritten on the next sync.',
    '',
    `Last synced from ${eventCount} event${eventCount === 1 ? '' : 's'}.`,
    '',
    `## Agents (${state.agents.length})`,
    ...state.agents.map(a => `- **${a.name}** (\`${a.id}\`) — ${a.status}`),
    '',
    `## Trapped Anomalies (${state.trappedAnomalies.length})`,
    ...state.trappedAnomalies.map(a => `- [${a.severity}] ${a.title} — agent \`${a.agentId}\``),
    '',
    `## Ledger Entries (${state.ledgerEntries.length})`,
    ...state.ledgerEntries.slice(0, 20).map(e => `- \`${e.id}\` — ${e.humanIntent}`),
    '',
    '## Related',
    '- [[Apex Logic]] — the control panel this feeds',
    '- [[2026-08-15 Decision - Apex Logic Agent Architecture]] — the architecture decision this implements',
    '- [[2026-08-15 Action Plan - Apex Logic Live Data Architecture]] — full implementation plan',
    '',
  ]
  return lines.join('\n')
}

function sync() {
  const events = readEvents()
  const state = deriveState(events)
  mkdirSync(outDir, { recursive: true })
  writeFileSync(outPath, JSON.stringify(state, null, 2), 'utf-8')
  writeFileSync(activityLogPath, renderActivityLogMarkdown(state, events.length), 'utf-8')
  console.log(`Synced ${events.length} events → ${state.agents.length} agents, ${state.trappedAnomalies.length} trapped anomalies, ${state.ledgerEntries.length} ledger entries`)
}

sync()

if (process.argv.includes('--watch')) {
  console.log(`Watching ${eventsPath} for changes...`)
  watch(eventsPath, { persistent: true }, (eventType) => {
    if (eventType === 'change') sync()
  })
}
