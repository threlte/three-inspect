import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'
import studioPlugin from './src/lib/plugin'

export default defineConfig({
  plugins: [studioPlugin(), sveltekit()],
  ssr: {
    noExternal: ['three'],
  },
})
