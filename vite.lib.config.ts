import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [svelte(), cssInjectedByJsPlugin()],
	build: {
		emptyOutDir: false,
		minify: true,
		target: 'esnext',
		lib: {
			formats: ['es'],
			entry: './src/lib/inspector.ts',
			fileName: 'inspector',
		},
		rollupOptions: {
			external: ['three'],
		},
	},
})
