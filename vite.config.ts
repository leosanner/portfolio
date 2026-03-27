import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import devServer from "@hono/vite-dev-server";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    devServer({
      entry: "worker/index.ts",
      exclude: [
        /^\/(src|node_modules|@).+/,
        /\.(ts|tsx|css|scss|png|jpg|jpeg|gif|svg|ico|webp|woff|woff2|ttf|eot)$/,
      ],
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
