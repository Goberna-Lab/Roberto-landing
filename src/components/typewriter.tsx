/**
 * Texto que se escribe letra por letra. Usar dentro de un título con la clase
 * `tw-title`: todas sus letras se animan en orden, aunque estén en varios
 * tramos (p. ej. una parte en dorado). Los lectores de pantalla leen el texto
 * completo, no las letras sueltas.
 */
export function TW({ text }: { text: string }) {
  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {[...text].map((ch, i) =>
          ch === '\n' || ch === ' ' ? ch : <span key={i} className="tw-c">{ch}</span>,
        )}
      </span>
    </>
  )
}
