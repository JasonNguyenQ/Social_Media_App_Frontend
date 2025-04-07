import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks (id) {
          if (id.includes("node_modules")){
            if (id.includes("react-dom")){
              return "react-dom"
            }
            else if (id.includes("react")){
              return "react"
            }
            else if (id.includes("socket.io")){
              return "socket.io"
            }
            else if (id.includes("zod")){
              return "zod"
            }
            return "vendor"
          }
        }
      }
    }
  }
})
