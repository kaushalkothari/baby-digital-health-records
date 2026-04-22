import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

const securityHeaders = {
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "microphone=(), geolocation=()",
} as const;

export default defineConfig({
  server: {
    // Avoid host "::" — on some systems/environments `os.networkInterfaces()` fails and Vite crashes on startup.
    host: "localhost",
    port: 8080,
    hmr: {
      overlay: false,
    },
    headers: securityHeaders,
  },
  preview: {
    headers: securityHeaders,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom"],
  },
});
