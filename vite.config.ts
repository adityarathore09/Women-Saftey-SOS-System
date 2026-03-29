import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  base: '/Women-Safety-SOS-System/', // ✅ VERY IMPORTANT
  plugins: [react()],
})
