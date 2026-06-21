import { defineConfig } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import reactScan from "@react-scan/vite-plugin-react-scan";
import babel from "@rolldown/plugin-babel";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter({ target: "react", autoCodeSplitting: true }),
    react(),
    reactScan(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss(),
    VitePWA({
      workbox: {
        globPatterns: ["**/*"],
      },
      includeAssets: ["**/*"],
      manifest: {
        name: "Fit Notes",
        short_name: "Fit Notes",
        theme_color: "#09090b",
        icons: [
          {
            src: "/favicon.svg",
            type: "image/svg+xml",
            sizes: "512x512",
          },
          {
            src: "/icon-512.png",
            type: "image/png",
            sizes: "512x512",
          },
          {
            src: "/icon-192.png",
            type: "image/png",
            sizes: "192x192",
          },
        ],
        start_url: "/",
        display: "standalone",
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
