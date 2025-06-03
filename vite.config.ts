import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import reactIcons from 'vite-plugin-react-icons'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    // reactRefresh(),
    reactIcons(),
    react()
  ],
})
