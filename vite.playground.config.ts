import { defineConfig } from 'vite'
import define from './env'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    minify: true,
    target: 'esnext',
  },
  define,
})
