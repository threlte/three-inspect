import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    minify: true,
    target: 'esnext',
    lib: {
      entry: 'src/main.ts',
      name: 'THREE_INSPECT',
      // the proper extensions will be added
      fileName: 'main'
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: [
        'three',
        'three/examples/jsm/lines/LineMaterial',
        'three/examples/jsm/lines/LineGeometry',
        'three/examples/jsm/lines/Line2',
      ],
      output: {
        inlineDynamicImports: true,
        manualChunks: undefined,
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          three: 'THREE',
        },
      },
    },
  },
})
