import { asset } from '../asset'
import type { Box } from '../components/ui'

/*
 * Pantalla CATALOGO – 4. Textos del XD con sus erratas corregidas.
 * Libros: x de la portada dentro del carrusel ("Grupo de desplazamiento 4",
 * viewport 1256px desde x 331). Portadas 317×439 con sombra incluida.
 * `tx`: x de los textos respecto a la portada.
 */
export type EditorialPrice = { promo: number; normal: number }

export const BOOKS: { title: string; img: string; x: number; w: number; tx: number; price?: EditorialPrice }[] = [
  { title: 'EL PODER DE LA ORATORIA E\nIMAGEN POLÍTICA', img: asset('libro-01.webp'), x: 1, w: 317, tx: 12, price: { promo: 120, normal: 140 } },
  { title: 'LAWFARE GUERRA JURÍDICA EN LA POLÍTICA', img: asset('libro-02.webp'), x: 457, w: 316, tx: 13, price: { promo: 90, normal: 120 } },
  { title: 'GUERRA ELECTORAL-EL PODER EN LAS SOMBRAS', img: asset('libro-03.webp'), x: 899, w: 316, tx: 13, price: { promo: 100, normal: 120 } },
  { title: 'MANUAL DEL CONSULTOR\nPOLÍTICO', img: asset('libro-04.webp'), x: 1341, w: 315, tx: 13, price: { promo: 100, normal: 120 } },
  { title: 'MÁQUINA\nELECTORAL', img: asset('libro-05.webp'), x: 1797, w: 316, tx: 15 },
  { title: 'MANUAL DE OPERACIONES\nPSICOLÓGICAS Y PSICOSOCIALES', img: asset('libro-06.webp'), x: 2239, w: 315, tx: 17 },
  { title: 'WAR ROOM EN CAMPAÑAS\nELECTORALES', img: asset('libro-07.webp'), x: 2679.6, w: 316.5, tx: 22.4, price: { promo: 90, normal: 120 } },
  { title: 'MANUAL DE INTELIGENCIA Y\nCONTRA INTELIGENCIA', img: asset('libro-08.webp'), x: 3122.2, w: 316.5, tx: 21.8, price: { promo: 120, normal: 140 } },
]
export const VISIBLE = 3
export const COLLECTION_PRICE: EditorialPrice = { promo: 450, normal: 670 }

/*
 * Packs (coordenadas relativas a la sección, top 1852 en XD).
 * `y` = línea base del número; `band` = franja del pack entre sus líneas
 * divisorias (el tramo dorado de la línea de tiempo marca la del activo).
 * `name`: el que se muestra en "Pack seleccionado" (el XD solo da el del 02).
 */
export const PACKS = [
  { n: '01', title: 'Edición\nIndividual', name: 'Edición Individual', y: 157, band: [134, 397.5], price: BOOKS[7].price!, description: 'Manual de Inteligencia y Contrainteligencia. Precio por ejemplar.' },
  { n: '02', title: 'Edición Dúo\nEstratégico', name: 'Dúo Estratégico', y: 475.4, band: [397.5, 725.9], price: { promo: 170, normal: 230 }, description: '2 libros de primera edición. Elige tus títulos.' },
  { n: '03', title: 'Edición Dúo\nPremium', name: 'Dúo Premium', y: 811.9, band: [725.9, 1041.9], price: { promo: 200, normal: 300 }, description: '2 libros de segunda edición. Elige tus títulos.' },
  { n: '04', title: 'Trilogía\nEstratégica', name: 'Trilogía Estratégica', y: 1119.9, band: [1041.9, 1370.9], price: { promo: 260, normal: 340 }, description: '3 libros a elección. El pack es por cantidad.' },
  { n: '05', title: 'Edición Alta\nDirección', name: 'Alta Dirección', y: 1458.9, band: [1370.9, 1698.9], price: { promo: 340, normal: 450 }, description: '4 libros a elección. El pack es por cantidad.' },
  { n: '06', title: 'Pack de\n5 libros', name: 'Pack de 5 libros', y: 1800.9, band: [1698.9, 2030], price: { promo: 390, normal: 560 }, description: '5 libros a elección. El pack es por cantidad.' },
  { n: '07', title: 'Edición Goberna\nExclusiva', name: 'Goberna Exclusiva', y: 2129.9, band: [2030, 2359], price: COLLECTION_PRICE, description: '6 libros a elección. El pack es por cantidad.' },
]
/* Portadas de cada pack, en el orden de apilado del XD (la última queda encima) */
export const PACK_BOOKS: { src: string; box: Box }[] = [
  { src: asset('pack-inteligencia.webp'), box: [1185, 121, 166.4, 230.8] },
  { src: asset('pack-waroom.webp'), box: [1296.3, 443.3, 170.8, 237] },
  { src: asset('pack-lawfare.webp'), box: [1185, 443.3, 166.4, 237.4] },
  { src: asset('pack-oratoria.webp'), box: [1282.2, 770.9, 162.3, 225.1] },
  { src: asset('pack-inteligencia.webp'), box: [1185, 770.9, 171.7, 238.1] },
  { src: asset('pack-waroom.webp'), box: [1395.3, 1087, 170.8, 237] },
  { src: asset('pack-lawfare.webp'), box: [1284, 1087, 166.4, 237.4] },
  { src: asset('pack-guerra.webp'), box: [1185, 1087, 173.4, 247.4] },
  { src: asset('pack-consultor.webp'), box: [1480.3, 1416, 170.8, 237] },
  { src: asset('pack-waroom.webp'), box: [1395.3, 1416, 170.8, 237] },
  { src: asset('pack-lawfare.webp'), box: [1284, 1416, 166.4, 237.4] },
  { src: asset('pack-guerra.webp'), box: [1185, 1416, 173.4, 247.4] },
  { src: asset('pack-inteligencia.webp'), box: [1491.2, 1762, 170.8, 237] },
  { src: asset('pack-consultor.webp'), box: [1425.3, 1762, 170.8, 237] },
  { src: asset('pack-waroom.webp'), box: [1350.3, 1762, 170.8, 237] },
  { src: asset('pack-lawfare.webp'), box: [1259, 1762, 166.4, 237.4] },
  { src: asset('pack-guerra.webp'), box: [1185, 1762, 173.4, 247.4] },
  { src: asset('pack-oratoria.webp'), box: [1549.2, 2091, 170.8, 237] },
  { src: asset('pack-inteligencia.webp'), box: [1491.2, 2091, 170.8, 237] },
  { src: asset('pack-consultor.webp'), box: [1425.3, 2091, 170.8, 237] },
  { src: asset('pack-waroom.webp'), box: [1350.3, 2091, 170.8, 237] },
  { src: asset('pack-lawfare.webp'), box: [1259, 2091, 166.4, 237.4] },
  { src: asset('pack-guerra.webp'), box: [1185, 2091, 173.4, 247.4] },
]
