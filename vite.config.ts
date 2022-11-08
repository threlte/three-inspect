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
      name: 'THREE_INSPECT',
      // the proper extensions will be added
      fileName: 'main'
    }
  },
  define,
})
