/** Quita los saltos de línea del XD: en mobile el texto se ajusta solo. */
export const flat = (s: string) => s.replace(/\s*\n\s*/g, ' ')
