import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [svelte()],
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
