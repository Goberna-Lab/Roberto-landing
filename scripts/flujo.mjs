// Prueba el flujo de pantallas del XD (requiere `npm run dev`):
// inicio → Piezas de honor → 3.ª medalla → atrás → inicio → Biblioteca del poder
import { chromium } from 'playwright'

const W = +(process.argv[2] ?? 1920), H = +(process.argv[3] ?? 1080)
const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: W, height: H } })
const errs = []; p.on('pageerror', (e) => errs.push(e.message))
let fails = 0
const ok = (cond, msg) => { console.log(`${cond ? '✓' : '✗'} ${msg}`); if (!cond) fails++ }
const state = () => p.evaluate(() => ({
  hash: location.hash, y: Math.round(scrollY),
  h1: document.querySelector('h1')?.textContent.replace(/\s+/g, ' ').trim(),
  panel: document.querySelector('.medal-panel') !== null,
  selected: [...document.querySelectorAll('.medal')].findIndex((m) => m.classList.contains('is-selected')) + 1,
}))

await p.goto('http://localhost:5173/', { waitUntil: 'networkidle' })
// 1 → 2: clic en el banner "Piezas de honor" (sobre el título, no en el enlace)
await p.locator('#medallas h2').scrollIntoViewIfNeeded()
await p.locator('#medallas .universe__cover').click({ position: { x: 1200, y: 300 } })
await p.waitForTimeout(400)
let s = await state()
ok(s.hash === '#/medallas' && s.y === 0 && /MEDALLAS, PLACAS/i.test(s.h1), `Piezas de honor → pantalla 2 (${s.hash}, arriba)`)

// 2 → 3: clic en la 3.ª medalla
await p.locator('.medal').nth(2).click()
await p.waitForTimeout(500)
s = await state()
ok(s.hash === '#/medallas/3' && s.panel && s.selected === 3, `3.ª medalla → pantalla 3 (${s.hash}, panel abierto, medalla ${s.selected})`)
const yClick = s.y
// cerrar con "atrás" del navegador sin mover la página
await p.goBack(); await p.waitForTimeout(400)
s = await state()
ok(s.hash === '#/medallas' && !s.panel && s.y === yClick, `Atrás → cierra el panel sin mover la página (y=${s.y})`)

// enlace directo compartible
await p.goto('http://localhost:5173/#/medallas/3', { waitUntil: 'networkidle' }); await p.waitForTimeout(400)
s = await state()
const vis = await p.evaluate(() => { const r = document.querySelector('.medal-panel').getBoundingClientRect(); return r.top < innerHeight && r.bottom > 0 })
ok(s.panel && s.selected === 3 && vis, `Enlace directo #/medallas/3 → panel abierto y a la vista`)

// 1 → 4: clic en el banner de libros
await p.goto('http://localhost:5173/', { waitUntil: 'networkidle' })
await p.locator('#libros h2').scrollIntoViewIfNeeded()
await p.locator('#libros .universe__cover').click({ position: { x: 1300, y: 250 } })
await p.waitForTimeout(400)
s = await state()
ok(s.hash === '#/biblioteca' && s.y === 0 && /IDEAS QUE/i.test(s.h1), `Biblioteca del poder → pantalla 4 (${s.hash}, arriba)`)

ok(!errs.length, `sin errores ${errs.length ? JSON.stringify(errs) : ''}`)
await b.close()
console.log(fails ? `\n✗ ${fails} fallo(s)` : '\n✓ flujo correcto')
process.exit(fails ? 1 : 0)
