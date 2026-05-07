import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import sitemap from 'vite-plugin-sitemap'

// Public-facing routes to include in the sitemap.
// Private routes (owner dashboards, auth pages, admin) are intentionally excluded.
const publicRoutes = [
  '/',
  '/about',
  '/places',
  '/north-sikkim',
  '/east-sikkim',
  '/west-sikkim',
  '/south-sikkim',
  '/adventure-zone',
  '/vlog',
  '/article',
  '/plan-trip',
  '/contact',
  '/disaster-alerts',
  '/hotels',
  '/bikes',
]

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    sitemap({
      hostname: 'https://sikkimpal.in',
      dynamicRoutes: publicRoutes,
      changefreq: 'weekly',
      priority: 0.8,
      lastmod: new Date().toISOString().split('T')[0],
    }),
  ],
})
