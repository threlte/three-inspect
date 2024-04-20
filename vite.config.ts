import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'
import Inspect from 'vite-plugin-inspect'
// import { studioPlugin } from './src/lib/plugin'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [Inspect(), sveltekit()],
	// plugins: [Inspect(), studioPlugin(), sveltekit()],
	// build: {
	// 	minify: true,
	// 	target: 'esnext',
	// },
	server: {
		port: 5000,
	},
	ssr: {
		noExternal: ['three'],
	},
})
