import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import define from './env'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    minify: true,
    target: 'esnext',
    lib: {
      entry: resolve(__dirname, 'src/main.ts'),
      name: 'THREE_DEBUG',
      // the proper extensions will be added
      fileName: 'main'
    }
  },
  server: {
    fs: {
      allow: ['.'],
      strict: true,
    },
    headers: {
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
    },
    port: 5171,
    strictPort: true,
  },
  define,
})
