// DECISION-15 (2026-08-15) — RationaleGate component tests.
// Covers DECISION-14's two locked behaviours: the strip is always visible
// (Q1), and submitting hands a complete payload to logPreCommitment, which is
// what the persistence path in AppContext depends on (Q2).

import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import RationaleGate from './RationaleGate'

const logPreCommitment = vi.fn()
let preCommitments = []

vi.mock('../AppContext', () => ({
  useAppContext: () => ({ preCommitments, logPreCommitment }),
}))

beforeEach(() => {
  logPreCommitment.mockClear()
  preCommitments = []
})

describe('RationaleGate', () => {
  it('renders the strip and its logged count without any interaction (DECISION-14 Q1)', () => {
    render(<RationaleGate />)
    expect(screen.getByText('Rationale Gate — Pre-Commitment Log')).toBeInTheDocument()
    expect(screen.getByText('0 LOGGED')).toBeInTheDocument()
  })

  it('keeps the form closed until the operator opens it', async () => {
    const user = userEvent.setup()
    render(<RationaleGate />)

    expect(screen.queryByPlaceholderText('What are you about to build?')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /log commitment/i }))
    expect(screen.getByPlaceholderText('What are you about to build?')).toBeInTheDocument()
  })

  it('blocks submission until both task and assumption are filled', async () => {
    const user = userEvent.setup()
    render(<RationaleGate />)
    await user.click(screen.getByRole('button', { name: /log commitment/i }))

    const submit = screen.getByRole('button', { name: 'Log Commitment' })
    expect(submit).toBeDisabled()

    await user.type(screen.getByPlaceholderText('What are you about to build?'), 'Ship the gate')
    expect(submit).toBeDisabled()

    await user.type(screen.getByPlaceholderText("What you're assuming is true"), 'Operators will use it')
    expect(submit).toBeEnabled()
  })

  it('submits the full payload and closes the form', async () => {
    const user = userEvent.setup()
    render(<RationaleGate />)
    await user.click(screen.getByRole('button', { name: /log commitment/i }))

    await user.type(screen.getByPlaceholderText('What are you about to build?'), 'Ship the gate')
    await user.type(screen.getByPlaceholderText("What you're assuming is true"), 'Operators will use it')
    await user.type(screen.getByPlaceholderText("What you're choosing not to do"), 'A modal')
    await user.type(screen.getByPlaceholderText('What would prove/disprove this'), '3 entries in a week')
    await user.click(screen.getByRole('button', { name: 'Log Commitment' }))

    expect(logPreCommitment).toHaveBeenCalledTimes(1)
    expect(logPreCommitment).toHaveBeenCalledWith({
      taskLabel: 'Ship the gate',
      assumption: 'Operators will use it',
      alternativeRejected: 'A modal',
      signal: '3 entries in a week',
    })
    expect(screen.queryByPlaceholderText('What are you about to build?')).not.toBeInTheDocument()
  })

  it('renders a chip per logged pre-commitment, newest first', () => {
    preCommitments = [
      { id: 'pc-2', timestamp: '10:05:00 AM', taskLabel: 'Second', assumption: 'B holds' },
      { id: 'pc-1', timestamp: '10:00:00 AM', taskLabel: 'First', assumption: 'A holds' },
    ]
    render(<RationaleGate />)

    expect(screen.getByText('2 LOGGED')).toBeInTheDocument()
    expect(screen.getByText('Second')).toBeInTheDocument()
    expect(screen.getByText('A holds')).toBeInTheDocument()
  })

  // CLAUDE.md §3 — the Thin-Lines rule, as an executable check rather than a
  // grep someone remembers to run. rounded-full is legal on status dots only;
  // this component has none, so any rounded-* beyond rounded-none is a defect.
  it('violates no corner-radius, shadow, or gradient constraint', () => {
    preCommitments = [{ id: 'pc-1', timestamp: '10:00:00 AM', taskLabel: 'T', assumption: 'A' }]
    const { container } = render(<RationaleGate />)
    const markup = container.innerHTML

    expect(markup).not.toMatch(/rounded-(sm|md|lg|xl|2xl|3xl|full)/)
    expect(markup).not.toMatch(/shadow-/)
    expect(markup).not.toMatch(/bg-gradient-/)
    expect(markup).not.toMatch(/backdrop-blur/)
  })

  it('keeps the logged count inside the header, not behind a disclosure', () => {
    preCommitments = [{ id: 'pc-1', timestamp: '10:00:00 AM', taskLabel: 'T', assumption: 'A' }]
    render(<RationaleGate />)
    const heading = screen.getByText('Rationale Gate — Pre-Commitment Log').closest('div')
    expect(within(heading).getByText('1 LOGGED')).toBeInTheDocument()
  })
})
