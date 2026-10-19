/** Correo de "Solicitar información" (pendiente de confirmar el definitivo, ver README). */
export const MAIL = 'informes@goberna.pe'

/** Enlace mailto con asunto, p. ej. el nombre de la pieza consultada. */
export const mailto = (subject = 'Solicitud de información — Colección Goberna') =>
  `mailto:${MAIL}?subject=${encodeURIComponent(subject)}`
