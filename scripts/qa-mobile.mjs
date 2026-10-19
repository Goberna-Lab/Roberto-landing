// QA de la versión mobile con Playwright (requiere `npm run dev` en marcha).
//   node scripts/qa-mobile.mjs [carpeta-capturas] [anchos…]
// En cada ancho y página revisa: scroll horizontal, elementos que se salen de
// la pantalla, textos cortados, tamaño mínimo de texto, áreas táctiles y
// errores de consola. Luego prueba las interacciones (menú, fichas, carrusel,
// packs, galería, movimiento reducido) y guarda capturas de cada estado.
import { chromium, devices } from 'playwright'
import fs from 'node:fs'
import path from 'node:path'

const [dirArg, ...widthArgs] = process.argv.slice(2)
const DIR = dirArg ?? 'qa-shots/mobile'
const WIDTHS = widthArgs.length ? widthArgs.map(Number) : [320, 360, 375, 390, 430, 768]
const BASE = process.env.BASE ?? 'http://localhost:5173/'
const PAGES = [
  { name: 'home', route: '' },
  { name: 'medallas', route: '#/medallas' },
  { name: 'pines', route: '#/pines' },
  { name: 'biblioteca', route: '#/biblioteca' },
]
const HEIGHT = { 320: 568, 360: 740, 375: 667, 390: 844, 430: 932, 768: 1024 }

fs.mkdirSync(DIR, { recursive: true })
const browser = await chromium.launch()
let problems = 0
const fail = (msg) => {
  problems++
  console.log(`  ✗ ${msg}`)
}
const ok = (msg) => console.log(`  ✓ ${msg}`)
const check = (cond, good, bad) => (cond ? ok(good) : fail(bad))

const newPage = async (w, opts = {}) => {
  const ctx = await browser.newContext({
    ...devices['iPhone 13'],
    viewport: { width: w, height: HEIGHT[w] ?? 844 },
    deviceScaleFactor: 2,
    ...opts,
  })
  const page = await ctx.newPage()
  page.errors = []
  page.on('pageerror', (e) => page.errors.push(e.message))
  page.on('console', (m) => (m.type() === 'error' || m.type() === 'warning') && page.errors.push(`${m.type()}: ${m.text()}`))
  return page
}

/** Recorre la página (scroll instantáneo) para disparar revelados e imágenes diferidas. */
const walk = (page) =>
  page.evaluate(async () => {
    for (let y = 0; y < document.documentElement.scrollHeight; y += innerHeight / 3) {
      window.scrollTo({ top: y, behavior: 'instant' })
      await new Promise((r) => setTimeout(r, 70))
    }
    for (let t = 0; t < 100 && ![...document.images].every((i) => i.complete); t++) await new Promise((r) => setTimeout(r, 100))
  })

// ── 1. Composición en cada ancho ─────────────────────────────────────────
for (const w of WIDTHS) {
  console.log(`\n── ${w}px`)
  for (const pg of PAGES) {
    const page = await newPage(w)
    await page.goto(BASE + pg.route, { waitUntil: 'networkidle' })
    await page.evaluate(() => document.fonts.ready)
    await walk(page)
    await page.waitForTimeout(1200) // revelados terminados
    const r = await page.evaluate(() => {
      const out = { overflowX: 0, offscreen: [], clipped: [], tiny: [], small: [], hidden: [], isMobile: !!document.querySelector('.m-app') }
      const de = document.documentElement
      out.overflowX = de.scrollWidth - de.clientWidth
      const W = de.clientWidth
      const label = (el) => (el.getAttribute('aria-label') || el.textContent || el.className || el.tagName).toString().trim().replace(/\s+/g, ' ').slice(0, 50)
      // ¿Lo recorta algún contenedor (carrusel, máscara)? Entonces no cuenta.
      const clippedBy = (el) => {
        for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
          const cs = getComputedStyle(p)
          if (cs.overflowX !== 'visible' && p !== de) return true
          if (cs.position === 'fixed') return true
        }
        return false
      }
      for (const el of document.querySelectorAll('.m-app *')) {
        const b = el.getBoundingClientRect()
        if (!b.width || !b.height) continue
        const cs = getComputedStyle(el)
        if (cs.visibility === 'hidden' || el.closest('[inert], .m-menu')) continue
        if ((b.right > W + 1 || b.left < -1) && !clippedBy(el)) out.offscreen.push(`${el.tagName.toLowerCase()}.${el.className} "${label(el)}" (${Math.round(b.left)}–${Math.round(b.right)})`)
        // texto cortado: contenido más ancho que su caja con overflow oculto
        if (/^(H1|H2|H3|P|A|BUTTON|SPAN|DT|DD|LI)$/.test(el.tagName) && cs.overflowX !== 'visible' && el.scrollWidth > el.clientWidth + 1 && !el.matches('.m-books__track, .m-packs__tabs, .m-gallery__track, .m-tile, .m-other__img, .sr-only, .m-shine'))
          out.clipped.push(`"${label(el)}"`)
        // tamaño de texto propio (nodos de texto directos)
        const own = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())
        if (own && !el.closest('.sr-only') && parseFloat(cs.fontSize) < 10) out.tiny.push(`"${label(el)}" ${cs.fontSize}`)
        // revelados que quedaron ocultos
        if (el.hasAttribute('data-reveal') && parseFloat(cs.opacity) < 0.99 && !el.closest('[inert]')) out.hidden.push(`"${label(el)}"`)
      }
      // áreas táctiles: botones y enlaces (no los de texto corrido)
      for (const el of document.querySelectorAll('.m-app a[href], .m-app button')) {
        const b = el.getBoundingClientRect()
        if (!b.width || el.closest('[inert], .m-menu') || getComputedStyle(el).visibility === 'hidden') continue
        if (b.height < 40 || b.width < 40) out.small.push(`"${label(el)}" ${Math.round(b.width)}×${Math.round(b.height)}`)
      }
      return out
    })
    const tag = `${pg.name}`
    if (!r.isMobile && w < 1024) fail(`${tag}: no se cargó la versión mobile`)
    if (r.overflowX > 0) fail(`${tag}: scroll horizontal de ${r.overflowX}px`)
    for (const o of r.offscreen.slice(0, 6)) fail(`${tag}: fuera de pantalla ${o}`)
    for (const c of r.clipped.slice(0, 6)) fail(`${tag}: texto cortado ${c}`)
    for (const t of r.tiny.slice(0, 6)) fail(`${tag}: texto < 10px ${t}`)
    for (const h of r.hidden.slice(0, 6)) fail(`${tag}: contenido sin revelar ${h}`)
    for (const s of r.small.slice(0, 6)) fail(`${tag}: área táctil pequeña ${s}`)
    for (const e of page.errors) fail(`${tag}: consola → ${e}`)
    if (!r.overflowX && !r.offscreen.length && !r.clipped.length && !r.tiny.length && !r.hidden.length && !r.small.length && !page.errors.length) ok(`${tag}: sin problemas`)
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
    await page.waitForTimeout(300)
    await page.screenshot({ path: path.join(DIR, `${pg.name}-${w}-top.png`) })
    await page.context().close()
  }
}

// ── 2. Interacciones (390 y 320) ─────────────────────────────────────────
/** Como una persona: lleva el elemento a la pantalla (se revela) y lo toca. */
const tap = async (loc) => {
  await loc.scrollIntoViewIfNeeded()
  await loc.page().waitForTimeout(900)
  await loc.tap()
}
const shot = (page, name) => page.screenshot({ path: path.join(DIR, `${name}.png`) })
const htmlLocked = (page) => page.evaluate(() => document.documentElement.style.overflow === 'hidden')
const dialog = (page) => page.locator('[role="dialog"]')

for (const w of [390, 320]) {
  console.log(`\n── Interacciones a ${w}px`)
  const page = await newPage(w)

  // Menú
  await page.goto(BASE, { waitUntil: 'networkidle' })
  await page.locator('.m-burger').tap()
  await page.waitForTimeout(700)
  check((await page.locator('.m-header.is-open').count()) && (await htmlLocked(page)), 'menú: abre y bloquea el scroll', 'menú: no abre o no bloquea el scroll')
  if (w === 390) await shot(page, `menu-${w}`)
  await page.keyboard.press('Escape')
  await page.waitForTimeout(400)
  check(!(await page.locator('.m-header.is-open').count()) && !(await htmlLocked(page)), 'menú: Escape lo cierra', 'menú: Escape no lo cierra')
  await page.locator('.m-burger').tap()
  await page.waitForTimeout(600)
  await page.locator('.m-menu a', { hasText: 'Pines institucionales' }).tap()
  await page.waitForTimeout(600)
  check(
    page.url().endsWith('#/pines') && !(await page.locator('.m-header.is-open').count()) && (await page.locator('.m-coll.is-pins').count()),
    'menú: navega a Pines y se cierra',
    `menú: navegación a Pines (${page.url()})`,
  )
  await page.locator('.m-burger').tap()
  await page.waitForTimeout(600)
  await page.locator('.m-menu a', { hasText: 'Packs y ediciones' }).tap()
  await page.waitForTimeout(900)
  const packsTop = await page.evaluate(() => document.getElementById('ediciones')?.getBoundingClientRect().top)
  check(page.url().endsWith('#/biblioteca/ediciones') && Math.abs(packsTop - 64) < 80, 'menú: lleva a la sección de ediciones', `menú: sección de ediciones (top ${packsTop})`)

  // Ficha de medalla con ruta propia
  await page.goto(BASE + '#/medallas', { waitUntil: 'networkidle' })
  await tap(page.locator('.m-card').first())
  await page.waitForTimeout(700)
  const medalOk = page.url().endsWith('#/medallas/1') && (await dialog(page).count()) && (await dialog(page).textContent()).includes('Medalla del Asesor Presidencial') && (await htmlLocked(page))
  check(medalOk, 'ficha de medalla: abre con la ruta #/medallas/1', 'ficha de medalla: no abre')
  const facts = await dialog(page).locator('.m-facts').textContent()
  check(['Bronce de 1/16', '8 CM', '180', 'S/250'].every((t) => facts.includes(t)), 'ficha de medalla: material, diámetro y precios del catálogo', `ficha de medalla: datos (${facts})`)
  const mail = await dialog(page).locator('.m-sheet__foot a').getAttribute('href')
  check(mail.startsWith('mailto:informes@goberna.pe'), 'ficha de medalla: CTA al correo de contacto', `ficha: CTA ${mail}`)
  if (w === 390) await shot(page, `ficha-medalla-${w}`)
  await page.keyboard.press('Escape')
  await page.waitForTimeout(600)
  check(!(await dialog(page).count()) && page.url().endsWith('#/medallas') && !(await htmlLocked(page)), 'ficha de medalla: Escape cierra y vuelve a #/medallas', `ficha: Escape (${page.url()})`)
  await tap(page.locator('.m-card').nth(4))
  await page.waitForTimeout(600)
  await page.mouse.click(w / 2, 20) // fondo oscuro
  await page.waitForTimeout(600)
  check(!(await dialog(page).count()), 'ficha de medalla: tocar fuera la cierra', 'ficha: tocar fuera no la cierra')
  await tap(page.locator('.m-card').nth(2))
  await page.waitForTimeout(600)
  await page.goBack()
  await page.waitForTimeout(500)
  check(!(await dialog(page).count()), 'ficha de medalla: "atrás" del navegador la cierra', 'ficha: atrás no la cierra')
  await page.goto(BASE + '#/medallas/7', { waitUntil: 'networkidle' })
  await page.waitForTimeout(700)
  check((await dialog(page).textContent()).includes('OSINT'), 'ficha de medalla: abre directo desde #/medallas/7', 'ficha: entrada directa')
  await dialog(page).locator('.m-sheet__close').tap()
  await page.waitForTimeout(600)
  check(!(await dialog(page).count()) && page.url().endsWith('#/medallas'), 'ficha de medalla: la X la cierra', 'ficha: X')
  // Placa y cristal
  await tap(page.locator('.m-card', { hasText: 'criminólogo' }))
  await page.waitForTimeout(600)
  check((await dialog(page).textContent()).toLowerCase().includes('criminólogo'), 'ficha de placa: abre', 'ficha de placa')
  await page.keyboard.press('Escape')
  await page.waitForTimeout(500)
  await tap(page.locator('.m-cristal__piece').nth(1))
  await page.waitForTimeout(600)
  check((await dialog(page).textContent()).includes('Foro'), 'ficha de cristal: abre', 'ficha de cristal')
  if (w === 390) await shot(page, `ficha-cristal-${w}`)
  await page.keyboard.press('Escape')
  await page.waitForTimeout(500)
  // Brillo: alguna pieza visible con la animación corriendo
  await page.locator('.m-card').first().scrollIntoViewIfNeeded()
  await page.waitForTimeout(500)
  const shine = await page.evaluate(() => {
    const live = document.querySelectorAll('.m-piece.is-live')
    const anim = [...live].flatMap((p) => p.querySelector('.m-shine__band')?.getAnimations() ?? [])
    return { live: live.length, running: anim.filter((a) => a.playState === 'running').length, total: document.querySelectorAll('.m-piece').length }
  })
  check(shine.running > 0 && shine.live < shine.total, `brillo: ${shine.running} piezas en pantalla con reflejo (de ${shine.total})`, `brillo: ${JSON.stringify(shine)}`)

  // Pines
  await page.goto(BASE + '#/pines', { waitUntil: 'networkidle' })
  await tap(page.locator('.m-card').nth(1))
  await page.waitForTimeout(600)
  check((await dialog(page).textContent()).includes('Escuela de Inteligencia'), 'ficha de pin: abre', 'ficha de pin')
  if (w === 390) await shot(page, `ficha-pin-${w}`)
  await dialog(page).locator('.m-sheet__close').tap()
  await page.waitForTimeout(500)

  // Biblioteca: carrusel y packs
  await page.goto(BASE + '#/biblioteca', { waitUntil: 'networkidle' })
  await page.locator('.m-books__track').scrollIntoViewIfNeeded()
  await page.locator('.m-books__nav button').last().tap()
  await page.waitForTimeout(800)
  await page.locator('.m-books__nav button').last().tap()
  await page.waitForTimeout(800)
  check((await page.locator('.m-books__count').textContent()).startsWith('03'), 'carrusel: botón siguiente avanza (03 / 08)', `carrusel: ${await page.locator('.m-books__count').textContent()}`)
  await page.evaluate(() => {
    const t = document.querySelector('.m-books__track')
    t.scrollTo({ left: t.scrollWidth, behavior: 'instant' })
  })
  await page.waitForTimeout(500)
  check((await page.locator('.m-books__count').textContent()).startsWith('08'), 'carrusel: desplazamiento táctil llega al último libro', 'carrusel: no llega al último')
  if (w === 390) await shot(page, `carrusel-${w}`)
  await page.locator('#ediciones').scrollIntoViewIfNeeded()
  const stageH = async () => page.locator('.m-packs__stage').evaluate((e) => e.getBoundingClientRect().height)
  const h0 = await stageH()
  await tap(page.locator('.m-packs__tab').nth(4))
  await page.waitForTimeout(700)
  const pack5 = await page.locator('.m-pack.is-on').textContent()
  check(pack5.includes('Alta Dirección') && pack5.includes('340'), 'packs: la pestaña 05 muestra Alta Dirección y su precio', `packs: ${pack5}`)
  check(Math.abs((await stageH()) - h0) < 1, 'packs: la ficha no cambia de alto', 'packs: la altura salta')
  // deslizar la ficha hacia la izquierda → siguiente pack
  await page.locator('.m-packs__stage').evaluate((el) => {
    const b = el.getBoundingClientRect()
    const t = (x) => new Touch({ identifier: 1, target: el, clientX: x, clientY: b.top + 100 })
    el.dispatchEvent(new TouchEvent('touchstart', { touches: [t(b.right - 30)], changedTouches: [t(b.right - 30)], bubbles: true }))
    el.dispatchEvent(new TouchEvent('touchend', { touches: [], changedTouches: [t(b.left + 30)], bubbles: true }))
  })
  await page.waitForTimeout(700)
  check((await page.locator('.m-pack.is-on').textContent()).includes('Pack de 5 libros'), 'packs: deslizar pasa al pack 06', 'packs: deslizar no cambia de pack')
  if (w === 390) await shot(page, `packs-${w}`)

  // Materia & oficio: ampliar foto
  await page.goto(BASE + '#/inicio/materia', { waitUntil: 'networkidle' })
  await page.waitForTimeout(500)
  await tap(page.locator('.m-tile').nth(4))
  await page.waitForTimeout(600)
  check((await dialog(page).textContent()).includes('Sello'), 'materia: la foto se amplía', 'materia: ampliar')
  await page.keyboard.press('Escape')
  await page.waitForTimeout(500)

  for (const e of page.errors) fail(`consola → ${e}`)
  await page.context().close()
}

// ── 3. Movimiento reducido ───────────────────────────────────────────────
console.log('\n── Movimiento reducido (390px)')
{
  const page = await newPage(390, { reducedMotion: 'reduce' })
  for (const pg of PAGES) {
    await page.goto(BASE + pg.route, { waitUntil: 'networkidle' })
    await page.waitForTimeout(400)
    const r = await page.evaluate(() => ({
      hidden: [...document.querySelectorAll('[data-reveal], [data-unveil], .tw-c')].filter((e) => parseFloat(getComputedStyle(e).opacity) < 0.99).length,
      shine: [...document.querySelectorAll('.m-shine')].filter((e) => getComputedStyle(e).display !== 'none').length,
      anims: document.getAnimations().filter((a) => a.playState === 'running').length,
    }))
    check(!r.hidden && !r.shine && !r.anims, `${pg.name}: todo visible, sin brillos ni animaciones`, `${pg.name}: ${JSON.stringify(r)}`)
  }
  await page.locator('.m-burger').tap()
  await page.locator('.m-menu a', { hasText: 'Medallas' }).tap()
  await tap(page.locator('.m-card').first())
  await page.waitForTimeout(200)
  check((await dialog(page).count()), 'fichas y menú funcionan sin animaciones', 'movimiento reducido: ficha')
  for (const e of page.errors) fail(`consola → ${e}`)
  await page.context().close()
}

await browser.close()
console.log(problems ? `\n${problems} problema(s)` : '\nSin problemas')
process.exit(problems ? 1 : 0)
