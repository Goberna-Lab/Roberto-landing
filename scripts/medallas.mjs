import assert from 'node:assert/strict'
import fs from 'node:fs'
import { chromium } from 'playwright'

const base = 'http://localhost:5173/'
const viewports = [{ width: 1920, height: 1080 }, { width: 1366, height: 620 }]
const columns = [212, 713, 1226]
const centers = [[443, 960, 1473], [459, 961, 1473], [459, 960, 1473]]
const dashes = [[410.5, 928.5, 1441.5], [427.5, 929.5, 1441.5], [427.5, 928.5, 1441.5]]
const near = (actual, expected, label, tolerance = 0.1) => assert.ok(Math.abs(actual - expected) <= tolerance, `${label}: ${actual} ≠ ${expected}`)

async function measure(page) {
  return page.evaluate(() => {
    const pageBox = document.querySelector('.page').getBoundingClientRect()
    const scale = pageBox.width / 1920
    const box = (element) => {
      const rect = element.getBoundingClientRect()
      return { x: (rect.left - pageBox.left) / scale, y: (rect.top - pageBox.top) / scale, width: rect.width / scale, height: rect.height / scale }
    }
    return {
      scale,
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      rows: [...document.querySelectorAll('.medal-row')].map(row => ({
        box: box(row),
        separators: [...row.querySelectorAll('.vline')].map(box),
        cards: [...row.querySelectorAll('.medal')].map(card => {
          const name = card.querySelector('.medal__name')
          const marker = document.createElement('span')
          marker.style.cssText = 'display:inline-block;width:0;height:0;vertical-align:baseline'
          name.prepend(marker)
          const baseline = box(marker).y
          marker.remove()
          const nameBox = box(name)
          return {
            image: box(card.querySelector('.medal__img')),
            base: box(card.querySelector('img')),
            center: nameBox.x + nameBox.width / 2,
            baseline,
            dash: box(card.querySelector('.hline')),
            label: name.textContent,
          }
        }),
      })),
    }
  })
}

async function verifyLayout(page, expanded) {
  const layout = await measure(page)
  const rowTops = expanded ? [2029, 3167, 3757] : [2029, 2619, 3209]
  assert.equal(layout.overflow, 0, 'La página no debe tener scroll horizontal')
  assert.equal(layout.rows.length, 3)
  for (const [rowIndex, row] of layout.rows.entries()) {
    const shift = expanded && rowIndex === 1 ? -6 : 0
    near(row.box.y, rowTops[rowIndex], `Fila ${rowIndex + 1}, posición vertical`)
    for (const [columnIndex, card] of row.cards.entries()) {
      const label = `Medalla ${rowIndex * 3 + columnIndex + 1}`
      near(card.image.x, columns[columnIndex] + shift, `${label}, imagen X`)
      near(card.image.y, rowTops[rowIndex], `${label}, imagen Y`)
      near(card.image.width, 494, `${label}, ancho`)
      near(card.image.height, 390, `${label}, alto`)
      near(card.base.x, columns[columnIndex] + shift + 10, `${label}, pedestal X`)
      near(card.base.y, rowTops[rowIndex] + 49, `${label}, pedestal Y`)
      near(card.base.width, 476, `${label}, ancho del pedestal`)
      near(card.base.height, 477, `${label}, alto del pedestal`)
      near(card.center, centers[rowIndex][columnIndex] + shift, `${label}, centro del título`)
      near(card.baseline, rowTops[rowIndex] + 485.5, `${label}, línea base`, 1 / layout.scale)
      near(card.dash.x, dashes[rowIndex][columnIndex] + shift, `${label}, raya X`)
      near(card.dash.y, rowTops[rowIndex] + 521.5, `${label}, raya Y`)
      near(card.dash.width, 64, `${label}, ancho de raya`)
      near(card.dash.height, 2, `${label}, alto de raya`)
    }
    for (const [separatorIndex, separator] of row.separators.entries()) {
      near(separator.x, [708, 1217][separatorIndex] + shift, 'Separador X')
      near(separator.y, rowTops[rowIndex] + 136.5, 'Separador Y')
      near(separator.height, 214, 'Alto del separador')
    }
  }
  assert.equal(layout.rows[0].cards[1].label, expanded ? 'Medalla del\nArquitecto de Poder Político' : 'Medalla del Arquitecto de\nPoder Político')
  return layout.scale
}

async function screenshot(page, width, state, scale) {
  await page.locator('.medal-row').nth(1).evaluate((row, scale) => {
    window.scrollTo({ top: scrollY + row.getBoundingClientRect().top - 160 * scale, behavior: 'instant' })
  }, scale)
  await page.waitForFunction(() => [...document.querySelectorAll('.medal-row img')].filter(image => {
    const rect = image.getBoundingClientRect()
    return rect.bottom > 0 && rect.top < innerHeight
  }).every(image => image.complete && image.naturalWidth > 0))
  await page.screenshot({ path: `qa-shots/medallas-${width}-${state}.png` })
}

fs.mkdirSync('qa-shots', { recursive: true })
const browser = await chromium.launch()
try {
  for (const viewport of viewports) {
    const page = await browser.newPage({ viewport, reducedMotion: 'reduce' })
    try {
      const errors = []
      page.on('pageerror', error => errors.push(error.message))
      await page.goto(`${base}#/medallas`, { waitUntil: 'networkidle' })
      await page.evaluate(() => document.fonts.ready)
      const scale = await verifyLayout(page, false)
      near(scale, await page.evaluate(() => document.documentElement.clientWidth / 1920), 'Escala de la página', 0.0001)
      await screenshot(page, viewport.width, 'cerradas', scale)
      await page.locator('.medal').first().dispatchEvent('click')
      await page.waitForFunction(() => document.querySelector('.medal.is-selected')?.getAttribute('aria-expanded') === 'true')
      await verifyLayout(page, true)
      await screenshot(page, viewport.width, 'abiertas', scale)
      for (let selected = 2; selected <= 9; selected++) {
        await page.locator('.medal').nth(selected - 1).dispatchEvent('click')
        await page.waitForFunction(selected => document.querySelectorAll('.medal')[selected - 1].classList.contains('is-selected'), selected)
        const clipped = await page.locator('.medal-panel').evaluate(panel => {
          const bounds = panel.getBoundingClientRect()
          return [...panel.querySelectorAll('.t')].filter(text => {
            const rect = text.getBoundingClientRect()
            return rect.left < bounds.left - 1 || rect.right > bounds.right + 1
          }).map(text => text.textContent)
        })
        assert.deepEqual(clipped, [], `Contenido fuera de la ficha ${selected}`)
      }
      await page.locator('.medal').last().dispatchEvent('click')
      await page.waitForFunction(() => !document.querySelector('.medal-panel'))
      await verifyLayout(page, false)
      assert.deepEqual(errors, [], 'Errores de ejecución')
      console.log(`✓ Medallas @ ${viewport.width}×${viewport.height}: coordenadas XD, escala y nueve fichas correctas`)
    } finally {
      await page.close()
    }
  }
} finally {
  await browser.close()
}
