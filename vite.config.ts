import { defineConfig } from "vite";

export default defineConfig({
  base: "/terminal-webcontainer/",
  server: {
    headers: {
      "Cross-Origin-Embedder-Policy": "require-corp",
      "Cross-Origin-Opener-Policy": "same-origin",
    },
  },
});
