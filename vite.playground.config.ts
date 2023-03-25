import { defineConfig } from 'vite'
import define from './env'
import glsl from 'vite-plugin-glsl';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    minify: true,
    target: 'esnext',
    outDir: 'dist-playground'
  },
  publicDir: 'assets',
  plugins: [glsl()],
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
