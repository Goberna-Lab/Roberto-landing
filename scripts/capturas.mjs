// Capturas de página completa con Playwright (requiere `npm run dev` en marcha).
//   node scripts/capturas.mjs <carpeta> [ancho×alto …]
// Sin tamaños usa los de escritorio. Movimiento reducido: las capturas son
// estables y se pueden comparar con `node scripts/comparar.mjs a b`.
import { chromium } from 'playwright'
import fs from 'node:fs'
import path from 'node:path'

const [dir, ...sizes] = process.argv.slice(2)
if (!dir) throw new Error('Uso: node scripts/capturas.mjs <carpeta> [1920x1080 …]')
const VIEWPORTS = (sizes.length ? sizes : ['1024x768', '1366x768', '1920x1080']).map((s) => s.split('x').map(Number))
const BASE = process.env.BASE ?? 'http://localhost:5173/'
const PAGES = [
  { name: 'home', route: '' },
  { name: 'medallas', route: '#/medallas' },
  { name: 'medallas-1', route: '#/medallas/1' },
  { name: 'pines', route: '#/pines' },
  { name: 'biblioteca', route: '#/biblioteca' },
]

fs.mkdirSync(dir, { recursive: true })
const browser = await chromium.launch()
for (const [w, h] of VIEWPORTS) {
  for (const pg of PAGES) {
    const page = await browser.newPage({ viewport: { width: w, height: h }, reducedMotion: 'reduce' })
    await page.goto(BASE + pg.route, { waitUntil: 'networkidle' })
    await page.evaluate(() => document.fonts.ready)
    // Recorre la página para que carguen las imágenes diferidas (sin scroll suave:
    // index.css lo activa y el recorrido no avanzaría)
    await page.evaluate(async () => {
      for (let y = 0; y < document.documentElement.scrollHeight; y += innerHeight / 2) {
        window.scrollTo({ top: y, behavior: 'instant' })
        await new Promise((r) => setTimeout(r, 60))
      }
      // Antes de volver arriba: si no, las últimas imágenes diferidas no llegan a pedirse
      for (let t = 0; t < 100 && ![...document.images].every((i) => i.complete); t++) {
        await new Promise((r) => setTimeout(r, 100))
      }
      window.scrollTo({ top: 0, behavior: 'instant' })
    })
    await page.waitForTimeout(400)
    const file = path.join(dir, `${pg.name}-${w}.png`)
    await page.screenshot({ path: file, fullPage: true })
    console.log(file)
    await page.close()
  }
}
await browser.close()
