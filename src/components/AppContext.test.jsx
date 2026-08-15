// DECISION-15 (2026-08-15) — AppContext pre-commitment tests.
// Covers DECISION-14 Q2's persistence contract: logPreCommitment updates local
// state optimistically, emits the RATIONALE_LOGGED terminal line, and fires a
// non-blocking POST to the mediator. Also pins the applyLiveSnapshot guard that
// stops an older ledger-state.json from blanking seeded pre-commitments.

import { useEffect } from 'react'
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { AppProvider, useAppContext } from './AppContext'

// The live-poll hook fetches /generated/ledger-state.json on an interval in
// DEV. Tests stub fetch so nothing hits the network; a 404 keeps isLive false,
// which is the mock-data path we want under test.
let fetchMock

beforeEach(() => {
  vi.useFakeTimers()
  fetchMock = vi.fn(() => Promise.resolve({ ok: false, status: 404 }))
  vi.stubGlobal('fetch', fetchMock)
})

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

// Captured in an effect, not during render: assigning an outer variable
// mid-render trips react-hooks/globals (same rule family that bit Session 7 —
// see SESSION_LOG.md). Effects run before act() returns, so `ctx` is populated
// and current by the time any assertion reads it.
let ctx
function Probe() {
  const value = useAppContext()
  useEffect(() => {
    ctx = value
  })
  return <span data-testid="count">{value.preCommitments.length}</span>
}

function renderProvider() {
  return render(
    <AppProvider>
      <Probe />
    </AppProvider>
  )
}

describe('AppContext — logPreCommitment', () => {
  it('prepends the new entry so newest reads first', () => {
    renderProvider()
    const before = ctx.preCommitments.length

    act(() => {
      ctx.logPreCommitment({
        taskLabel: 'Ship the gate',
        assumption: 'Operators will use it',
        alternativeRejected: 'A modal',
        signal: '3 entries in a week',
      })
    })

    expect(ctx.preCommitments).toHaveLength(before + 1)
    expect(ctx.preCommitments[0].taskLabel).toBe('Ship the gate')
    expect(ctx.preCommitments[0].assumption).toBe('Operators will use it')
    expect(ctx.preCommitments[0].id).toMatch(/^pc-/)
    expect(screen.getByTestId('count')).toHaveTextContent(String(before + 1))
  })

  it('emits a RATIONALE_LOGGED line attributed to the operator, not an agent', () => {
    renderProvider()

    act(() => {
      ctx.logPreCommitment({ taskLabel: 'Ship the gate', assumption: 'It holds' })
    })

    const line = ctx.terminalLogs[0]
    expect(line.event).toBe('RATIONALE_LOGGED')
    expect(line.agentId).toBe('operator')
    expect(line.detail).toContain('Ship the gate')
  })

  // DECISION-14 Q2 / DECISION-9 — fire-and-forget. The local entry must land
  // whether or not the mediator is running, so a rejected POST cannot throw.
  it('POSTs to the mediator without gating the local update', async () => {
    fetchMock.mockReturnValue(Promise.reject(new Error('mediator down')))
    renderProvider()

    act(() => {
      ctx.logPreCommitment({ taskLabel: 'Ship the gate', assumption: 'It holds' })
    })

    expect(ctx.preCommitments[0].taskLabel).toBe('Ship the gate')
    const precommitCall = fetchMock.mock.calls.find(([url]) => String(url).endsWith('/precommit'))
    expect(precommitCall).toBeDefined()
    expect(precommitCall[1].method).toBe('POST')
    expect(JSON.parse(precommitCall[1].body).taskLabel).toBe('Ship the gate')
  })
})

describe('AppContext — applyLiveSnapshot pre-commitment guard', () => {
  const snapshot = (extra) => ({
    agents: [],
    ledgerEntries: [],
    trappedAnomalies: [],
    terminalLogs: [],
    systemMetrics: { totalTokensBurned: 0, totalCogs: 0 },
    ...extra,
  })

  const serveSnapshot = (payload) => {
    fetchMock.mockImplementation((url) =>
      String(url).includes('ledger-state.json')
        ? Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve(payload) })
        : Promise.resolve({ ok: true, status: 200 })
    )
  }

  // A ledger-state.json generated before DECISION-14 has no preCommitments
  // key. Applying it must not blank the seeded list — that regression would
  // silently empty the strip the moment the sync script ran an old build.
  it('leaves seeded pre-commitments intact when a snapshot omits the key', async () => {
    serveSnapshot(snapshot())
    renderProvider()
    const seeded = ctx.preCommitments.length
    expect(seeded).toBeGreaterThan(0)

    await act(async () => {})

    expect(ctx.isLive).toBe(true)
    expect(ctx.ledgerEntries).toHaveLength(0)
    expect(ctx.preCommitments).toHaveLength(seeded)
  })

  it('replaces pre-commitments when the snapshot carries them', async () => {
    serveSnapshot(
      snapshot({
        preCommitments: [
          { id: 'pc-live', timestamp: '2026-08-15T10:00:00Z', taskLabel: 'From the vault', assumption: 'A' },
        ],
      })
    )
    renderProvider()

    await act(async () => {})

    expect(ctx.preCommitments).toHaveLength(1)
    expect(ctx.preCommitments[0].taskLabel).toBe('From the vault')
  })
})
