import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ command, isPreview }) => ({
  // GitHub Pages publica el sitio en https://goberna-lab.github.io/<repo>/
  // (el workflow pasa BASE_PATH con el nombre del repo; por defecto, Roberto-landing)
  base: command === 'build' || isPreview ? (process.env.BASE_PATH ?? '/Roberto-landing/') : '/',
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
}))
