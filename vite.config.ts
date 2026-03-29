import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/Women-Safety-SOS-System/',   // ✅ THIS IS THE FIX
  plugins: [react()],
})
