import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

export default defineConfig(({ mode }) => ({
  plugins: [vue()],
  server: {
    allowedHosts: ["localhost", "overhelpful-readily-lynell.ngrok-free.dev"],
  },
  test: {
    environment: "jsdom",
    globals: true,
  },
  build: mode === "lib" ? {
    lib: {
      entry: resolve(__dirname, "src/components/FlowTree/index.js"),
      name: "VueFlowTreeLeadster",
      formats: ["es", "umd"],
    },
    rollupOptions: {
      external: ["vue", "@vue-flow/core", "@vue-flow/controls", "@vue-flow/background", "@vue-flow/minimap"],
      output: {
        globals: {
          vue: "Vue",
          "@vue-flow/core": "VueFlow",
          "@vue-flow/controls": "Controls",
          "@vue-flow/background": "Background",
          "@vue-flow/minimap": "Minimap",
        },
        exports: "named",
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') return 'style.css'
          return 'index.js'
        },
        entryFileNames: (format) => {
          return `vue-flow-tree-leadster.${format === 'es' ? 'es' : 'umd'}.js`
        },
        chunkFileNames: 'vue-flow-tree-leadster-[hash].js',
      },
    },
    cssCodeSplit: false,
    minify: false,
  } : undefined,
}));
