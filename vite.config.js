import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";
import path from 'path';
// https://vite.dev/config/
export default defineConfig({
    resolve: {
        alias: {
            '@codemirror/state': path.resolve(__dirname, 'node_modules/@codemirror/state'),
        },
    },
  plugins: [

      react()
  ],
})
