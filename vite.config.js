// vite.config.js
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(({ mode }) => {
  // Load env file based on mode
  const env = loadEnv(mode, process.cwd(), "");
  // Ensure baseUrl starts with a slash
  let baseUrl = env.VITE_BASE_URL || "/pandm/";
  if (!baseUrl.startsWith("/")) {
    baseUrl = "/" + baseUrl;
  }

  return {
    base: baseUrl,
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    define: {
      "process.env.VITE_BASE_URL": JSON.stringify(baseUrl),
    },
    build: {
      sourcemap: true,
    },
    server: {
      open: baseUrl,
    },
  };
});
