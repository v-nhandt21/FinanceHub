import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      '1c77dfc9734f.ngrok-free.app' // <-- thêm dòng này
    ]
  }
})
