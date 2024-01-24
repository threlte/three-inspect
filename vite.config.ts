import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'
import Inspect from 'vite-plugin-inspect'
import { plugin } from './src/vite-plugin'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [Inspect(), plugin(), sveltekit()],
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
