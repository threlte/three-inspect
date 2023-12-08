import { defineConfig } from 'vite'
import { sveltekit } from '@sveltejs/kit/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [sveltekit()],
  build: {
    minify: true,
    target: 'esnext',
  },
  server: {
    port: 5000,
  },
  ssr: {
    noExternal: ['three'],
  },
})
