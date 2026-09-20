import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,          // so you don't need to import describe, it, expect
    environment: 'jsdom',   // simulates browser environment
    setupFiles: './src/test/setup.js',
    css: true,              // include CSS if needed
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
})