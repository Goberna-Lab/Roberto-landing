# Comparación del XD actualizado con la web

Fecha de revisión: 16 de octubre de 2026.

Fuente: `LANDING-PRODUCTOS-GOBERNA.xd`, incluido en el ZIP descargado de Drive.
Se revisaron las 8 mesas de trabajo de 1920 px, los componentes y estados de
la biblioteca, 90 imágenes y 3 videos. La comparación identifica lo que existe
en este XD y falta en la implementación actual; no establece cuándo se añadió
cada elemento al diseño.

Se comprobaron las cuatro rutas actuales a 1920×1080 y 1366×620, con movimiento
reducido para revisar el contenido estático. Ninguna presentó scroll horizontal.
Esta revisión de contenido y estructura no equivale a una comparación de todos
los píxeles de todas las pantallas.

## Faltantes confirmados

| Elemento | Evidencia en el XD | Estado actual | Acción pendiente |
|---|---|---|---|
| Página de Esenciales Goberna | `CATALOGO – 8`, con portada propia, título y una muestra de tarjeta comercial | Solo existe el bloque de Esenciales dentro del inicio; `App.tsx` no tiene una página de Esenciales | Completar el contenido de esa mesa e implementar su página y navegación |
| Portada de Esenciales | Imagen `30a1bceb67453838de5cd684960b6936`, colocada a 1920×700 en la mesa 8 | No está exportada a `public/img` ni se usa en la web | Exportarla e incorporarla cuando se construya la página |
| Tarjeta comercial de gorra | La mesa 8 incluye el componente 12 con nombre, marca, precio S/47.92 y precio anterior S/59.90 | No hay tarjetas individuales de merchandising con precios | Adaptar el componente a la futura página de Esenciales |
| Foto y variante completa de la gorra | La biblioteca contiene el componente 13 y la imagen `efd7ee23e9d6312b18f4dbac1ac084f2`; el estado hover muestra «Hablar con un asesor» | La foto individual y ese componente no están implementados | Usarlos si se confirma esta variante de tarjeta |
| Precio del pack en Biblioteca | Las mesas 4 y 6 muestran «Inversión», S/120 y «Antes S/180» en la columna del pack seleccionado | `Biblioteca.tsx` no incluye ese bloque de precio | Añadirlo y redistribuir la columna izquierda conforme a la mesa 4 |
| Texto «Selección GOBERNA» en inicio | La tarjeta de pisco y café de `CATALOGO` usa ese título | La web muestra «Edición Dúo Estratégico» | Actualizar el título y el nombre accesible del enlace asociado |

## Diferencias de diseño pendientes

- **Biblioteca, columna del pack seleccionado:** el XD utiliza el rótulo
  «PACK 02» junto al nombre, descripción y nuevo precio. La web conserva
  «Pack seleccionado» y un número grande adicional. El título principal,
  botones, texto de asesor y bloque Amazon también tienen otra distribución.
  El precio del XD está definido para el ejemplo del pack 02; no se deben
  inventar precios de los otros cinco packs.
- **Biblioteca, títulos de los packs:** el XD usa 28 px; la web usa 26 px.
- **Biblioteca, cierre de página:** la web mide 5881 px a escala de diseño,
  frente a 5849 px en la mesa 4. El bloque de otras colecciones usa 378 px
  en el código y añade 32 px respecto al cierre del XD.
- **Pines, título de portada:** el XD usa 72 px con interlineado de 80 px;
  la web mantiene 65 px y 70 px. No faltan modelos de pines.
- **Pines, tarjetas:** conservan los valores anteriores de las líneas base
  y separadores, con diferencias de medio píxel respecto al XD. Las imágenes,
  su orden y los nueve modelos coinciden.
- **Inicio en laptop:** el hero se adapta a la altura de la ventana; no es
  una reducción estrictamente proporcional de la mesa de 1920 px. Es una
  adaptación existente, no contenido nuevo pendiente.

## Funciones que están dibujadas, pero no conectadas

| Control | Comportamiento actual | Qué hace falta |
|---|---|---|
| Descargar catálogo PDF | Los enlaces apuntan a `#contacto`; no descargan ningún archivo | Proporcionar el PDF definitivo y enlazarlo; el XD tampoco incluye un PDF del catálogo |
| Hablar con un asesor en Biblioteca | Son un icono y un texto sin enlace, tanto en packs como en la edición exclusiva | Definir el destino de contacto y convertirlos en enlaces accesibles |
| Amazon | Se muestra el logo, sin enlace a una tienda o producto | Proporcionar y enlazar la URL real |
| Portadiplomas en inicio | «Descubrir la colección» dirige a Medallas | Definir su destino: el XD actual no contiene una categoría terminada de portadiplomas |

## Borradores y recursos que no deben confundirse con páginas terminadas

- **La mesa 8 está incompleta.** Conserva textos de Biblioteca como
  «6 Títulos. Distintas perspectivas» y el párrafo de publicaciones, además
  de amplios espacios sin productos. No representa todavía un catálogo
  completo de Esenciales listo para copiar a producción.
- **Componentes comerciales:** existen variantes con «Agregar al carrito»
  y «Hablar con un asesor». Eso no define un flujo completo de carrito,
  pago o compra. También hay componentes genéricos heredados de otra
  plantilla; no son requisitos confirmados para Goberna.
- **Tres videos MP4:** `video.mp4`, `-.mp4` y `Goberna.mp4` están en la
  biblioteca del documento y no están exportados en el proyecto. Un componente
  de biblioteca referencia `-.mp4` con reproducción/pausa al hacer clic,
  pero no se encontró colocado en las ocho mesas actuales. No hay una
  ubicación confirmada en las páginas publicables para añadir los tres videos.
- **Referencias fuera de las mesas:** hay composiciones, fotos alternativas
  y textos de exploración en la mesa de montaje. No todos son faltantes de
  la web: varios son versiones descartadas o material de referencia.
- **Mesa 6:** en este archivo es una variante de Biblioteca, con el mismo
  hero de libros y una distribución más corta. No es actualmente una página
  terminada de portadiplomas, pese a lo que indica el README anterior.
- **Diseños de laptop y móvil:** el archivo contiene únicamente mesas de
  1920 px. No incluye una mesa específica de 1366×620 ni una versión móvil.

## Contenido ya implementado

- Las 9 medallas, sus tarjetas y las 9 fichas de detalle integradas.
- Las 3 placas de distinción.
- Las 3 imágenes y el fondo actualizados de Excelencia en Cristal.
- Los 9 pines, con imágenes y orden coincidentes con la mesa 5.
- Los 8 libros del carrusel y las 6 composiciones de packs de Biblioteca.
- El estuche de libros y los tres bloques de Esenciales del inicio.
- Las imágenes de Materia & oficio y las tarjetas de otras colecciones.

Las fotos repetidas de las fichas de medallas 3, 6 y 8 siguen repetidas en el
propio XD. No hay fotos nuevas en estuche para sustituirlas en este documento.
El encabezado «6 Títulos» de Biblioteca también permanece en el XD aunque
el carrusel contiene 8 libros; no son dos publicaciones ausentes en la web.

## Orden sugerido de implementación

1. Completar el bloque de precio y la distribución de Biblioteca.
2. Actualizar «Selección GOBERNA» en inicio y los ajustes visuales de Pines.
3. Terminar el diseño/contenido de Esenciales y crear su página con las tarjetas.
4. Conectar PDF, asesor y Amazon cuando estén disponibles sus destinos reales.

El README sigue indicando 7 mesas; el archivo revisado contiene 8. También
conviene corregir la descripción de la mesa 6 y separar el contenido pendiente
de los borradores del XD.

## Archivos de la implementación relacionados

- `src/App.tsx`: rutas disponibles y selección de páginas.
- `src/pages/Home.tsx`: Esenciales del inicio y enlace de Portadiplomas.
- `src/pages/Biblioteca.tsx`: packs, columna izquierda y accesos a asesor/Amazon.
- `src/pages/Pines.tsx`: tamaño del hero y coordenadas de las tarjetas.
- `src/components/sections.tsx`: cierre compartido y enlace del catálogo.
- `README.md`: inventario de mesas y pendientes de contenido.

Capturas de apoyo: `qa-shots/auditoria-inicio-1920.png`,
`qa-shots/auditoria-inicio-1366.png`, `qa-shots/auditoria-biblioteca-1920.png`
y `qa-shots/auditoria-biblioteca-1366.png`.
