import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Port for your Vite dev server (usually 5173)
    // port: 5173, // You can explicitly set it, or Vite picks a free one

    // Configure the proxy
    proxy: {
      // All requests starting with '/server' will be proxied
      '/server': {
        target: 'http://localhost:5000', // Your Express backend URL
        changeOrigin: true,             // Needed for virtual hosted sites
        secure: false,                  // Set to true if your backend uses HTTPS (unlikely for localhost dev)
        // rewrite: (path) => path.replace(/^\/server/, '') // Optional: If your backend route doesn't have '/server'
                                                          // e.g., if backend route is just `/test` and frontend calls `/server/test`
      },
      // You can add more proxy rules if you have other API prefixes
      // Example:
      // '/api': {
      //   target: 'http://localhost:5000',
      //   changeOrigin: true,
      //   secure: false,
      // },
    },
  },
})