import assert from 'node:assert/strict'
import fs from 'node:fs'
import { chromium } from 'playwright'

const bookPrices = [[120, 140], [90, 120], [100, 120], [100, 120], null, null, [90, 120], [120, 140]]
const packPrices = [[120, 140], [170, 230], [200, 300], [260, 340], [340, 450], [390, 560], [450, 670]]
const descriptions = ['Precio por ejemplar.', 'primera edición', 'segunda edición', '3 libros', '4 libros', '5 libros', '6 libros']
const viewports = [{ width: 1920, height: 1080 }, { width: 1366, height: 620 }]

async function verifyPrice(locator, expected) {
  if (!expected) {
    assert.equal(await locator.textContent(), 'Consultar precio')
    assert.equal(await locator.locator('strong, s').count(), 0)
    return
  }
  const [promo, normal] = expected
  assert.equal(await locator.locator('strong').textContent(), `S/${promo}`)
  assert.equal(await locator.locator('s').textContent(), `S/${normal}`)
  assert.equal(await locator.getAttribute('aria-label'), `Precio promocional S/${promo}. Precio normal S/${normal}.`)
}

async function verifyLayout(page) {
  const problems = await page.evaluate(() => {
    const issues = []
    const scale = document.querySelector('.page').getBoundingClientRect().width / 1920
    if (document.documentElement.scrollWidth > document.documentElement.clientWidth) issues.push('Scroll horizontal')
    for (const book of document.querySelectorAll('.book')) {
      const title = book.querySelector('h3').getBoundingClientRect()
      const price = book.querySelector('.editorial-price').getBoundingClientRect()
      const link = book.querySelector('.mini-link').getBoundingClientRect()
      const bounds = book.getBoundingClientRect()
      if (price.top < title.bottom + 6 * scale) issues.push(`Título y precio: ${book.querySelector('h3').textContent}`)
      if (link.top < price.bottom + 4 * scale) issues.push('Precio y enlace superpuestos')
      if (link.bottom > bounds.bottom + 1) issues.push('Enlace recortado')
    }
    const selection = document.querySelector('.packs__selection')
    const title = selection.querySelector('h3').getBoundingClientRect()
    const description = selection.querySelector('.wrap').getBoundingClientRect()
    const price = selection.querySelector('.editorial-price').getBoundingClientRect()
    const button = selection.parentElement.querySelector('.btn').getBoundingClientRect()
    if (description.top < title.bottom) issues.push('Título y descripción del pack superpuestos')
    if (price.top < description.bottom + 8 * scale) issues.push('Descripción y precio del pack superpuestos')
    if (button.top < price.bottom + 12 * scale) issues.push('Precio y botón del pack superpuestos')
    if (price.right > title.left + 395 * scale + 1) issues.push('Precio fuera del panel de selección')
    const collectionPrice = document.querySelectorAll('.editorial-price--dark')[1]
    const collection = collectionPrice.closest('section')
    const disclaimer = [...collection.querySelectorAll('.t')].find(text => text.textContent === 'Precio de los libros; estuche a consultar.')
    if (disclaimer.getBoundingClientRect().top < collectionPrice.getBoundingClientRect().bottom) issues.push('Precio y aclaración del estuche superpuestos')
    if (collection.querySelector('.btn').getBoundingClientRect().top < disclaimer.getBoundingClientRect().bottom + 8 * scale) issues.push('Aclaración y botón del estuche superpuestos')
    return issues
  })
  assert.deepEqual(problems, [], 'Precios sin superposiciones ni recortes')
}

async function capture(page, locator, path, offset = 110) {
  await locator.evaluate((element, offset) => {
    window.scrollTo({ top: scrollY + element.getBoundingClientRect().top - offset, behavior: 'instant' })
  }, offset)
  await page.waitForFunction(() => [...document.images].filter(image => {
    const bounds = image.getBoundingClientRect()
    return bounds.bottom > 0 && bounds.top < innerHeight
  }).every(image => image.complete && image.naturalWidth > 0))
  await page.screenshot({ path })
}

fs.mkdirSync('qa-shots', { recursive: true })
const browser = await chromium.launch()
try {
  for (const viewport of viewports) {
    for (const reducedMotion of ['reduce', 'no-preference']) {
      const page = await browser.newPage({ viewport, reducedMotion })
      try {
        const errors = []
        page.on('pageerror', error => errors.push(error.message))
        await page.goto('http://localhost:5173/#/biblioteca', { waitUntil: 'networkidle' })
        await page.evaluate(() => document.fonts.ready)
        const books = page.locator('.book')
        assert.equal(await books.count(), bookPrices.length)
        for (const [index, expected] of bookPrices.entries()) {
          await verifyPrice(books.nth(index).locator('.editorial-price'), expected)
        }
        await verifyLayout(page)
        const next = page.getByRole('button', { name: 'Siguiente', exact: true })
        for (let step = 0; step < 5; step++) await next.click()
        assert.equal(await next.isDisabled(), true)
        await page.waitForFunction(() => Math.abs(parseFloat(getComputedStyle(document.querySelector('.books__track')).translate) + 2238) < 0.1)
        if (reducedMotion === 'reduce') {
          await capture(page, books.last().locator('h3'), `qa-shots/biblioteca-precios-ultimos-${viewport.width}.png`, 380)
        }
        const previous = page.getByRole('button', { name: 'Anterior', exact: true })
        for (let step = 0; step < 5; step++) await previous.click()
        assert.equal(await previous.isDisabled(), true)
        await page.waitForFunction(() => Math.abs(parseFloat(getComputedStyle(document.querySelector('.books__track')).translate)) < 0.1)
        if (reducedMotion === 'reduce') {
          await capture(page, books.first().locator('h3'), `qa-shots/biblioteca-precios-libros-${viewport.width}.png`, 380)
        }
        const selection = page.locator('.packs__selection')
        const choices = page.locator('.packs__pick')
        assert.equal(await choices.count(), packPrices.length)
        const coverCounts = await page.locator('.packs__list').evaluate(list => {
          const covers = [...list.querySelectorAll('img')]
          return [...list.querySelectorAll('.packs__pick')].map(choice => {
            const top = parseFloat(choice.style.top)
            const bottom = top + parseFloat(choice.style.height)
            return covers.filter(cover => {
              const center = parseFloat(cover.style.top) + parseFloat(cover.style.height) / 2
              return center >= top && center < bottom
            }).length
          })
        })
        assert.deepEqual(coverCounts, [1, 2, 2, 3, 4, 5, 6], 'Cada pack muestra la cantidad correcta de libros')
        for (const [index, expected] of packPrices.entries()) {
          await choices.nth(index).dispatchEvent('click')
          await page.waitForFunction(index => document.querySelectorAll('.packs__pick')[index].getAttribute('aria-pressed') === 'true', index)
          await verifyPrice(selection.locator('.editorial-price'), expected)
          assert.ok((await selection.textContent()).includes(descriptions[index]))
          await verifyLayout(page)
          if (index === 5 && reducedMotion === 'no-preference') {
            await page.waitForTimeout(1000)
            assert.equal(await selection.locator('h3').textContent(), 'Pack de 5 libros')
            await page.screenshot({ path: `qa-shots/biblioteca-precios-pack-cinco-${viewport.width}.png` })
          }
        }
        await verifyPrice(page.locator('.editorial-price--dark').last(), [450, 670])
        if (reducedMotion === 'no-preference') {
          await choices.nth(1).dispatchEvent('click')
          await page.waitForFunction(() => document.querySelectorAll('.packs__pick')[1].getAttribute('aria-pressed') === 'true')
          await page.waitForTimeout(1000)
          await page.screenshot({ path: `qa-shots/biblioteca-precios-pack-${viewport.width}.png` })
        }
        await capture(page, page.locator('.editorial-price--dark').last().locator('strong'), `qa-shots/biblioteca-precios-estuche-${viewport.width}.png`, 290)
        assert.deepEqual(errors, [], 'Sin errores de ejecución')
        console.log(`✓ Biblioteca ${viewport.width}×${viewport.height} (${reducedMotion}): ocho libros, siete opciones, todos los precios de libros y packs del PDF correctos`)
      } finally {
        await page.close()
      }
    }
  }
} finally {
  await browser.close()
}
