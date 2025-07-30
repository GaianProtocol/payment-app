import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import { VitePWA } from "vite-plugin-pwa";

const APP_VERSION = 'v0.0.6';

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills(),
    VitePWA({
      injectRegister: 'auto',
      registerType: "autoUpdate",
      includeAssets: ['favicon.svg', 'robots.txt'],
      workbox: {
        cacheId: `gaian-network-${APP_VERSION}`,
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // Set to 5 MB
        skipWaiting: true,
        clientsClaim: true,
        cleanupOutdatedCaches: true,
      },
      manifest: {
        name: "Gaian Network",
        short_name: "Gaian Network",
        description: "Gaian Network",
        start_url: "/",
        display: "standalone",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        icons: [
          {
            src: "/icons/icon-180x180.png",
            sizes: "180x180",
            type: "image/png",
          },
          {
            src: "/icons/icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icons/icon-180x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "./build",
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: "globalThis",
      },
    },
  },
  server: {
    port: 3000,
  },
  preview: {
    port: 3000,
  },
});