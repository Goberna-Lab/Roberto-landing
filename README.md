# Goberna · Landing de productos (Catálogo 2026)

Landing del catálogo institucional de Goberna, construida desde el Adobe XD
"GOBERNA CATALOGO" (https://xd.adobe.com/view/6bc6ebf5-b2d7-4d0b-8357-00d3558434be-3e95/,
7 artboards de 1920 px).

> Desktop: diseño exacto a **1920 px** y adaptación a laptop (1280–1919 px). Mobile pendiente.

## Comandos

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
npm run lint
npm run qa -- 1366 620 [--shots]   # QA con Playwright (con `npm run dev` en marcha)
npm run qa:medallas               # Coordenadas XD y capturas a 1920×1080 y 1366×620
```

## Laptop

`src/viewport.ts` escala la página al ancho disponible (`zoom`) y, por debajo de
1680 px, fija un tamaño mínimo de texto de 11 px reales. Los iconos de enlaces y
botones van en línea con el texto, así no se enciman si el texto crece. En 1920
todo queda en las coordenadas del XD (`npm run qa -- 1920 1080` lo comprueba).

La colección de medallas conserva las líneas base y separadores con precisión de
medio píxel. Al abrir una ficha de la primera fila, la segunda se desplaza 6 px
a la izquierda, como en «CATALOGO – 3». A 1366 px se mantiene la composición
proporcional del original de 1920 px; el XD no incluye una mesa de laptop.
`npm run qa:medallas` comprueba ambos tamaños y guarda capturas en `qa-shots/`.

## Páginas (rutas por hash)

| Artboard XD | Ruta |
|---|---|
| CATALOGO | `#/` |
| CATALOGO – 2 | `#/medallas` |
| CATALOGO – 3 y 7 (fichas de cada medalla) | `#/medallas/1` … `#/medallas/9` (clic en una medalla) |
| CATALOGO – 4 | `#/biblioteca` |
| CATALOGO – 5 | `#/pines` |
| CATALOGO – 6 | borrador en el XD (hero de portadiplomas sobre contenido de Biblioteca): no implementado |

Secciones enlazables: `#/inicio/pines`, `#/inicio/diplomas`, `#/biblioteca/ediciones`.

## Estructura

- `src/components/ui.tsx` — `Txt` posiciona cada texto con las coordenadas del XD
  (línea base en textos de punto, borde superior en textos de área), más enlaces,
  botones e iconos reutilizables.
- `src/components/sections.tsx` — bloques compartidos: “Otras piezas de colección”,
  cierre “Encuentra una pieza…” y botón “volver arriba”.
- `src/pages/` — Home, Medallas, Pines, Biblioteca.
- `src/assets/icons/` — logo e iconos exportados como SVG desde los vectores del XD.
- `public/img/` — imágenes del XD en WebP (generadas desde los originales del `.xd`).

## Pendiente de contenido

- Correo real para “Solicitar información” (hoy `informes@goberna.pe`).
- PDF del catálogo para “Descargar catálogo PDF”.
- Fotos propias de las fichas 3, 6 y 8 (en el XD repiten la de la medalla 1).
- Mockups de libros/packs en mayor resolución (los del XD son pequeños).
