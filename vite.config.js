import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";
import cssInjectedByJs from "vite-plugin-css-injected-by-js";
import { fileURLToPath, URL } from "node:url";

export default defineConfig(({ mode }) => ({
  plugins: [vue(), cssInjectedByJs()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  ...(mode === 'test' ? {
    test: {
      environment: "jsdom",
      globals: true,
      include: ["src/**/*.test.js"],
    },
  } : {
    build: {
      lib: {
        entry: fileURLToPath(new URL("./src/index.js", import.meta.url)),
        name: "VueFlowTreeLeadster",
        formats: ["es", "umd"],
      },
      rollupOptions: {
        external: ["vue", "@vue-flow/core", "@vue-flow/controls", "@vue-flow/minimap", "@vue-flow/background"],
        output: {
          globals: {
            vue: "Vue",
            '@vue-flow/core': 'VueFlow',
            '@vue-flow/controls': 'VueFlowControls',
            '@vue-flow/minimap': 'VueFlowMinimap',
            '@vue-flow/background': 'VueFlowBackground',
          },
          exports: 'named',
        },
      },
    },
  }),
}));