import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import devServer from "@hono/vite-dev-server";
import { cloudflareAdapter } from "@hono/vite-dev-server/cloudflare";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    devServer({
      adapter: cloudflareAdapter,
      entry: "worker/index.ts",
      exclude: [/^(?!\/api\/).*/],
    }),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
      "@server": resolve(__dirname, "./server"),
      "@shared": resolve(__dirname, "./shared"),
    },
  },
  build: {
    rollupOptions: {
      input: resolve(__dirname, "index.html"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    include: [
      "tests/**/*.{test,spec}.{ts,tsx}",
      "src/**/*.{test,spec}.{ts,tsx}",
      "server/**/*.{test,spec}.ts",
    ],
  },
});
