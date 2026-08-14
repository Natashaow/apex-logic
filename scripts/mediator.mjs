#!/usr/bin/env node
// DECISION-9 (2026-08-15) — local-only mediator.
//
// Minimal HTTP listener (Node's built-in `http`, no framework) exposing one
// endpoint: POST /resolve. AppContext.jsx's approveAnomaly/rejectAnomaly fire
// a request here (fire-and-forget — they don't wait for this to gate the
// optimistic UI update). This appends a "resolution" event to the vault's
// events.jsonl; scripts/sync-activity-log.mjs --watch picks it up and folds
// it into the next ledger-state.json.
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

const server = createServer((req, res) => {
  if (req.method !== 'POST' || req.url !== '/resolve') {
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
    if (!payload.anomalyId || !['approved', 'rejected'].includes(payload.outcome)) {
      res.writeHead(400).end('expected { anomalyId, outcome: "approved"|"rejected", reason? }')
      return
    }
    appendEvent({
      ts: new Date().toISOString(),
      type: 'resolution',
      anomalyId: payload.anomalyId,
      outcome: payload.outcome,
      reason: payload.reason,
    })
    // Recording only — see file header. Does not yet resume/abort a real
    // paused Workflow/CronCreate/loop run.
    res.writeHead(200, { 'Content-Type': 'application/json' }).end(JSON.stringify({ recorded: true }))
  })
})

server.listen(PORT, () => {
  console.log(`Mediator listening on http://localhost:${PORT}/resolve (recording only — see file header)`)
})
