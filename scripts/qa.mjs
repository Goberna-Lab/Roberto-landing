// QA visual con Playwright (requiere `npm run dev` en marcha).
//   node scripts/qa.mjs [ancho] [alto] [--shots]
// Revisa en cada página: scroll horizontal, tamaño mínimo de texto, textos
// encimados, contenido que se sale de botones/tarjetas y (a 1920) que cada
// línea base coincida con el XD. Con --shots guarda capturas en qa-shots/.
import { chromium } from 'playwright'
import fs from 'node:fs'

const W = +(process.argv[2] ?? 1920)
const H = +(process.argv[3] ?? 1080)
const SHOTS = process.argv.includes('--shots')
const BASE = 'http://localhost:5173/'
const PAGES = [
  { name: 'home', route: '' },
  { name: 'medallas', route: '#/medallas' },
  { name: 'medallas-panel', route: '#/medallas', open: true },
  { name: 'biblioteca', route: '#/biblioteca' },
]

const browser = await chromium.launch()
let problems = 0
if (SHOTS) fs.mkdirSync('qa-shots', { recursive: true })

for (const pg of PAGES) {
  // Animaciones desactivadas: se mide el diseño final (y se prueba la versión accesible)
  const page = await browser.newPage({ viewport: { width: W, height: H }, reducedMotion: 'reduce' })
  const errors = []
  page.on('pageerror', (e) => errors.push(e.message))
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  await page.goto(BASE + pg.route, { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  if (pg.open) {
    await page.locator('.medal').first().click()
    await page.mouse.move(0, 0)
    await page.waitForTimeout(600)
  }

  const r = await page.evaluate(() => {
    const out = { overflowX: 0, minFont: 99, overlaps: [], spills: [], baselines: [] }
    const de = document.documentElement
    out.overflowX = de.scrollWidth - de.clientWidth
    const z = parseFloat(getComputedStyle(de).getPropertyValue('--z')) || 1
    const texts = [...document.querySelectorAll('.t')].filter((el) => !el.parentElement.closest('.t'))
    // caja real del texto (no la del elemento)
    // caja del texto visible (ignora el texto oculto para lectores de pantalla)
    const box = (el) => {
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
      let l = Infinity, t = Infinity, r = -Infinity, b = -Infinity
      for (let n = walker.nextNode(); n; n = walker.nextNode()) {
        if (n.parentElement.closest('.sr-only') || !n.textContent.trim()) continue
        const rg = document.createRange()
        rg.selectNodeContents(n)
        for (const q of rg.getClientRects()) {
          l = Math.min(l, q.left); t = Math.min(t, q.top); r = Math.max(r, q.right); b = Math.max(b, q.bottom)
        }
      }
      return l === Infinity ? el.getBoundingClientRect() : { left: l, top: t, right: r, bottom: b, width: r - l, height: b - t }
    }
    // caja aproximada de los glifos: quita el espacio de ascendente/descendente
    // de la fuente para no contar como choque el interlineado apretado del XD
    const glyphs = (el) => {
      const r = box(el)
      const f = parseFloat(getComputedStyle(el).fontSize) * z
      return { left: r.left, right: r.right, top: r.top + 0.3 * f, bottom: r.bottom - 0.25 * f }
    }
    const label = (el) => [...el.childNodes].filter((n) => !(n.classList?.contains('sr-only'))).map((n) => n.textContent).join('').trim().replace(/\s+/g, ' ').slice(0, 40)
    for (const el of texts) {
      const fs = parseFloat(getComputedStyle(el).fontSize) * z
      if (fs < out.minFont) out.minFont = +fs.toFixed(1)
    }
    // textos encimados dentro de la misma sección (tolerancia 1px)
    const rects = texts.map((el) => ({ el, r: glyphs(el), sec: el.closest('section, .medal-row, .medal-panel, header') }))
    for (let i = 0; i < rects.length; i++) {
      for (let j = i + 1; j < rects.length; j++) {
        const a = rects[i], b = rects[j]
        if (a.sec !== b.sec || a.el.closest('[hidden]')) continue
        const ox = Math.min(a.r.right, b.r.right) - Math.max(a.r.left, b.r.left)
        const oy = Math.min(a.r.bottom, b.r.bottom) - Math.max(a.r.top, b.r.top)
        if (ox > 1 && oy > 1) out.overlaps.push(`"${label(a.el)}" ⟷ "${label(b.el)}"`)
      }
    }
    // contenido que se sale de su contenedor (botones, tarjetas, links)
    const check = (container, inner, name) => {
      const c = container.getBoundingClientRect()
      for (const el of container.querySelectorAll(inner)) {
        const b = el.getBoundingClientRect()
        if (b.right > c.right + 1 || b.left < c.left - 1) out.spills.push(`${name}: "${label(container)}"`)
      }
    }
    document.querySelectorAll('.btn').forEach((b) => check(b, '.txt-ico__text, .txt-ico__ico', 'botón'))
    document.querySelectorAll('.other-card').forEach((card) => {
      const boxEl = card.querySelector('.other-card__box').getBoundingClientRect()
      card.querySelectorAll('.t').forEach((t) => {
        const b = box(t)
        if (b.right > boxEl.right + 1 || b.bottom > boxEl.bottom + 1) out.spills.push(`tarjeta: "${label(t)}"`)
      })
    })
    document.querySelectorAll('.books, .medal-panel').forEach((cont) => {
      const c = cont.getBoundingClientRect()
      cont.querySelectorAll('.t').forEach((t) => {
        const b = box(t)
        if (b.right > c.right + 1 && b.left < c.right) out.spills.push(`${cont.className}: "${label(t)}"`)
      })
    })
    // líneas base e iconos vs XD (solo tiene sentido a escala 1)
    if (z === 1) {
      for (const el of document.querySelectorAll('.txt-ico__text')) {
        const textW = box(el).width
        const minW = parseFloat(el.style.minWidth)
        if (textW > minW + 0.5) out.baselines.push(`icono desplazado tras "${label(el)}" (${textW.toFixed(1)} > ${minW})`)
      }
      for (const el of document.querySelectorAll('[data-bl]')) {
        const m = document.createElement('span')
        m.style.cssText = 'display:inline-block;width:0;height:0;vertical-align:baseline'
        el.prepend(m)
        const bl = m.getBoundingClientRect().bottom - el.offsetParent.getBoundingClientRect().top
        m.remove()
        if (Math.abs(bl - +el.dataset.bl) > 1) out.baselines.push(`"${label(el)}" ${bl.toFixed(1)} ≠ ${el.dataset.bl}`)
      }
    }
    out.laptop = de.classList.contains('is-laptop')
    out.height = de.scrollHeight
    return out
  })

  const issues = [
    ...(r.overflowX > 0 ? [`scroll horizontal de ${r.overflowX}px`] : []),
    ...(r.laptop && r.minFont < 10.9 ? [`texto mínimo ${r.minFont}px`] : []),
    ...r.overlaps.map((o) => `encimado: ${o}`),
    ...[...new Set(r.spills)].map((s) => `se sale: ${s}`),
    ...r.baselines.map((b) => `línea base: ${b}`),
    ...errors.map((e) => `error: ${e}`),
  ]
  problems += issues.length
  console.log(`\n${pg.name} @ ${W}×${H} — alto ${r.height}px, texto mínimo ${r.minFont}px`)
  for (const i of issues) console.log('  ✗ ' + i)
  if (!issues.length) console.log('  ✓ sin problemas')

  if (SHOTS) {
    const steps = pg.open ? [await page.evaluate(() => document.querySelector('.medal-panel').getBoundingClientRect().top + scrollY - 200)] : []
    if (!pg.open) for (let y = 0; y < r.height; y += H) steps.push(y)
    for (const y of steps) {
      await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), y)
      await page.waitForTimeout(350)
      await page.screenshot({ path: `qa-shots/${W}-${pg.name}-${String(Math.round(y)).padStart(5, '0')}.png` })
    }
  }
  await page.close()
}

await browser.close()
console.log(`\n${problems ? `✗ ${problems} problema(s)` : '✓ todo correcto'}`)
process.exit(problems ? 1 : 0)
