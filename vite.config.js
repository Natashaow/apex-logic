import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
// DECISION-15 (2026-08-15) — test config lives here rather than in a separate
// vitest.config.js so there is one config file, matching the repo's existing
// no-extra-config-files posture (see CLAUDE.md §5 on tailwind.config.js).
export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
    globals: false,
    include: ['src/**/*.test.{js,jsx}'],
  },
})
