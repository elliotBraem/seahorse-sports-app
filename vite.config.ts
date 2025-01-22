import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineConfig({
  plugins: [TanStackRouterVite(), react(), nodePolyfills({
    globals: { global: true },
    protocolImports: true,
    include: ['fs', 'path', 'os']
  })],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
