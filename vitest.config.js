import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    coverage: {
      include: ['src']
    }
  }
})
