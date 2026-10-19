// Compara píxel a píxel las capturas con el mismo nombre de dos carpetas.
//   node scripts/comparar.mjs <antes> <después> [umbral 0-255]
// Informa el % de píxeles distintos y guarda un mapa de diferencias
// (<después>/diff-*.png) cuando hay cambios.
import { chromium } from 'playwright'
import fs from 'node:fs'
import path from 'node:path'

const [a, b, t = '24'] = process.argv.slice(2)
if (!a || !b) throw new Error('Uso: node scripts/comparar.mjs <antes> <después>')
const files = fs.readdirSync(a).filter((f) => f.endsWith('.png') && !f.startsWith('diff-'))

const browser = await chromium.launch()
const page = await browser.newPage()
let changed = 0
for (const f of files) {
  if (!fs.existsSync(path.join(b, f))) {
    console.log(`FALTA   ${f}`)
    changed++
    continue
  }
  const src = (d) => `data:image/png;base64,${fs.readFileSync(path.join(d, f)).toString('base64')}`
  const r = await page.evaluate(
    async ({ x, y, threshold }) => {
      const load = (s) => new Promise((ok) => { const i = new Image(); i.onload = () => ok(i); i.src = s })
      const [i1, i2] = await Promise.all([load(x), load(y)])
      const w = Math.max(i1.width, i2.width), h = Math.max(i1.height, i2.height)
      const px = (img) => {
        const c = new OffscreenCanvas(w, h)
        const g = c.getContext('2d')
        g.drawImage(img, 0, 0)
        return g.getImageData(0, 0, w, h).data
      }
      const d1 = px(i1), d2 = px(i2)
      const out = new OffscreenCanvas(w, h)
      const og = out.getContext('2d')
      const od = og.createImageData(w, h)
      let diff = 0
      for (let k = 0; k < d1.length; k += 4) {
        const dd = Math.max(Math.abs(d1[k] - d2[k]), Math.abs(d1[k + 1] - d2[k + 1]), Math.abs(d1[k + 2] - d2[k + 2]))
        if (dd > threshold) { diff++; od.data[k] = 255; od.data[k + 3] = 255 }
        else { od.data[k] = od.data[k + 1] = od.data[k + 2] = d1[k] * 0.3; od.data[k + 3] = 255 }
      }
      og.putImageData(od, 0, 0)
      const blob = await out.convertToBlob()
      const buf = new Uint8Array(await blob.arrayBuffer())
      let bin = ''
      for (const c of buf) bin += String.fromCharCode(c)
      return { size: [i1.width, i1.height, i2.width, i2.height], pct: (100 * diff) / (w * h), diff, png: btoa(bin) }
    },
    { x: src(a), y: src(b), threshold: +t },
  )
  const sizeNote = r.size[0] !== r.size[2] || r.size[1] !== r.size[3] ? `  tamaño ${r.size[0]}×${r.size[1]} → ${r.size[2]}×${r.size[3]}` : ''
  const ok = r.diff === 0 && !sizeNote
  if (!ok) {
    changed++
    fs.writeFileSync(path.join(b, `diff-${f}`), Buffer.from(r.png, 'base64'))
  }
  console.log(`${ok ? 'IGUAL  ' : 'CAMBIO '} ${f}  ${r.pct.toFixed(3)}% (${r.diff} px)${sizeNote}`)
}
await browser.close()
console.log(changed ? `\n${changed} captura(s) con diferencias` : '\nSin diferencias')
process.exit(changed ? 1 : 0)
