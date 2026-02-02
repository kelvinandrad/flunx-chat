import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    allowedHosts: ["chat.flunx.com.br", "app.flunx.com.br", "localhost", "127.0.0.1"],
    // Desabilita HMR quando acessado via domínio (Docker/deployed) para evitar erros de WebSocket no console
    hmr:
      process.env.VITE_DISABLE_HMR === "true"
        ? false
        : {
            overlay: false,
          },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
