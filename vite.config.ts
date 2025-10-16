import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'

const config = defineConfig({
  plugins: [
    // this is the plugin that enables path aliases
    viteTsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],
  preview: {
    host: '0.0.0.0', // Listen on all addresses
    port: 3000,
    strictPort: true,
    allowedHosts: [
      'ai-security-web.jollyocean-4c140d70.eastus.azurecontainerapps.io',
      'localhost',
      '127.0.0.1',
    ],
  },
  server: {
    host: true,
  },
})

export default config
