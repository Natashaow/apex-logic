// DECISION-15 (2026-08-15) — global test setup.
// Adds jest-dom matchers (toBeInTheDocument, toBeDisabled, ...) and clears the
// DOM between tests so component tests can't leak state into each other.

import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'

afterEach(() => {
  cleanup()
})
