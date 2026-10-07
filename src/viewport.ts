import { useSyncExternalStore } from 'react'

/* El diseño es de 1920 px. Por debajo (laptops) se escala proporcionalmente
   y se aplica un tamaño mínimo de texto para que siga siendo legible. */
export const DESIGN_W = 1920
/** Tamaño mínimo de texto visible en pantalla (px reales) en modo laptop. */
const MIN_TEXT_PX = 11
/** Por debajo de este ancho se activan los ajustes de laptop (no solo la escala). */
const LAPTOP_MAX = 1680

let laptop = false
const listeners = new Set<() => void>()

function apply() {
  const root = document.documentElement
  // clientWidth descuenta la barra de scroll: el diseño nunca se corta
  const w = root.clientWidth
  const z = Math.min(1, w / DESIGN_W)
  const next = w < LAPTOP_MAX
  root.style.setProperty('--z', String(z))
  root.style.setProperty('--fsmin', next ? `${MIN_TEXT_PX / z}px` : '0px')
  root.classList.toggle('is-laptop', next)
  if (next !== laptop) {
    laptop = next
    listeners.forEach((l) => l())
  }
}

export function initViewport() {
  apply()
  window.addEventListener('resize', apply)
}

/** true en pantallas de laptop (ancho útil < 1680 px). */
export function useLaptop() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb)
      return () => listeners.delete(cb)
    },
    () => laptop,
  )
}
