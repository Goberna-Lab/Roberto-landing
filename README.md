# Goberna · Landing de productos (Catálogo 2026)

Landing del catálogo institucional de Goberna, construida desde el Adobe XD
`LANDING-PRODUCTOS-GOBERNA.xd` (4 artboards de 1920 px).

> Desktop: diseño exacto a **1920 px** y adaptación a laptop (1280–1919 px). Mobile pendiente.

## Comandos

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
npm run lint
npm run qa -- 1366 620 [--shots]   # QA con Playwright (con `npm run dev` en marcha)
```

## Laptop

`src/viewport.ts` escala la página al ancho disponible (`zoom`) y, por debajo de
1680 px, fija un tamaño mínimo de texto de 11 px reales. Los iconos de enlaces y
botones van en línea con el texto, así no se enciman si el texto crece. En 1920
todo queda en las coordenadas del XD (`npm run qa -- 1920 1080` lo comprueba).

## Páginas (rutas por hash)

| Artboard XD | Ruta |
|---|---|
| CATALOGO | `#/` |
| CATALOGO – 2 | `#/medallas` |
| CATALOGO – 3 (medalla seleccionada) | `#/medallas` + clic en una medalla |
| CATALOGO – 4 | `#/biblioteca` |

Secciones enlazables: `#/inicio/pines`, `#/inicio/diplomas`, `#/biblioteca/ediciones`.

## Estructura

- `src/components/ui.tsx` — `Txt` posiciona cada texto con las coordenadas del XD
  (línea base en textos de punto, borde superior en textos de área), más enlaces,
  botones e iconos reutilizables.
- `src/components/sections.tsx` — bloques compartidos: “Otras piezas de colección”,
  cierre “Encuentra una pieza…” y botón “volver arriba”.
- `src/pages/` — Home, Medallas, Biblioteca.
- `src/assets/icons/` — logo e iconos exportados como SVG desde los vectores del XD.
- `public/img/` — imágenes del XD en WebP (generadas desde los originales del `.xd`).

## Pendiente de contenido

- Correo real para “Solicitar información” (hoy `informes@goberna.pe`).
- PDF del catálogo para “Descargar catálogo PDF”.
- Fichas reales (material, acabado, diámetro, precio) de cada medalla.
- Mockups de libros/packs en mayor resolución (los del XD son pequeños).
