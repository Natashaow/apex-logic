#!/usr/bin/env node
// DECISION-9 (2026-08-15) — local-only mediator.
//
// Minimal HTTP listener (Node's built-in `http`, no framework) exposing two
// endpoints:
//   POST /resolve   — AppContext.jsx's approveAnomaly/rejectAnomaly
//   POST /precommit — AppContext.jsx's logPreCommitment (DECISION-14 Q2)
// All callers fire-and-forget: they don't wait for this to gate the optimistic
// UI update. Each appends an event to the vault's events.jsonl;
// scripts/sync-activity-log.mjs --watch picks it up and folds it into the next
// ledger-state.json.
//
// NOT YET IMPLEMENTED, explicitly flagged (per DECISION-9 and the action
// plan): how a real paused Workflow/CronCreate/loop run actually notices this
// resolution event and resumes or aborts. This process only records the
// decision — it does not yet act on it. That's separate follow-up work.

import { appendFileSync, existsSync, mkdirSync } from 'node:fs'
import { createServer } from 'node:http'
import { dirname, join } from 'node:path'

const vaultRoot = process.env.VAULT_ROOT
if (!vaultRoot) {
  console.error('VAULT_ROOT env var not set — point it at the vault root (e.g. /Users/natasha/Documents/MyBrain)')
  process.exit(1)
}

const PORT = process.env.MEDIATOR_PORT ? Number(process.env.MEDIATOR_PORT) : 4177
const eventsPath = join(vaultRoot, 'work', 'agent-activity', 'events.jsonl')

function appendEvent(event) {
  mkdirSync(dirname(eventsPath), { recursive: true })
  if (!existsSync(eventsPath)) appendFileSync(eventsPath, '')
  appendFileSync(eventsPath, JSON.stringify(event) + '\n')
}

// Each route validates its payload and returns the event to append, or an
// error string. Adding a route means adding an entry here — the transport
// handling below stays shared.
const routes = {
  '/resolve': (payload) => {
    if (!payload.anomalyId || !['approved', 'rejected'].includes(payload.outcome)) {
      return { error: 'expected { anomalyId, outcome: "approved"|"rejected", reason? }' }
    }
    return {
      event: {
        ts: new Date().toISOString(),
        type: 'resolution',
        anomalyId: payload.anomalyId,
        outcome: payload.outcome,
        reason: payload.reason,
      },
    }
  },

  // DECISION-14 Q2 (2026-08-15) — Rationale Gate pre-commitments persist
  // through this same pipeline rather than living only in React state.
  // taskLabel + assumption are the load-bearing pair; the other two are
  // optional by design (the form allows logging an assumption without yet
  // knowing the success signal).
  '/precommit': (payload) => {
    if (!payload.taskLabel || !payload.assumption) {
      return { error: 'expected { taskLabel, assumption, alternativeRejected?, signal? }' }
    }
    return {
      event: {
        ts: new Date().toISOString(),
        type: 'pre_commitment',
        id: payload.id,
        taskLabel: payload.taskLabel,
        assumption: payload.assumption,
        alternativeRejected: payload.alternativeRejected,
        signal: payload.signal,
      },
    }
  },
}

const server = createServer((req, res) => {
  const handler = req.method === 'POST' ? routes[req.url] : undefined
  if (!handler) {
    res.writeHead(404).end()
    return
  }

  let body = ''
  req.on('data', chunk => { body += chunk })
  req.on('end', () => {
    let payload
    try {
      payload = JSON.parse(body)
    } catch {
      res.writeHead(400).end('invalid JSON')
      return
    }
    const { event, error } = handler(payload)
    if (error) {
      res.writeHead(400).end(error)
      return
    }
    appendEvent(event)
    // Recording only — see file header. Does not yet resume/abort a real
    // paused Workflow/CronCreate/loop run.
    res.writeHead(200, { 'Content-Type': 'application/json' }).end(JSON.stringify({ recorded: true }))
  })
})

server.listen(PORT, () => {
  console.log(`Mediator listening on http://localhost:${PORT} — POST /resolve, /precommit (recording only — see file header)`)
})
