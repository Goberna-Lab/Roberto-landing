import { useEffect, useRef } from 'react'
import type { CSSProperties } from 'react'
import './PieceShine.css'

/** Único reflejo compartido por móvil y escritorio. */
export function PieceShine({
  src, delay = 0, cold = false, observe = true, className = '', style,
}: { src: string; delay?: number; cold?: boolean; observe?: boolean; className?: string; style?: CSSProperties }) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element || !observe) return
    const observer = new IntersectionObserver(([entry]) => {
      element.classList.toggle('is-visible', entry.isIntersecting)
    }, { rootMargin: '-8% 0px' })
    observer.observe(element)
    return () => observer.disconnect()
  }, [observe])

  return (
    <span
      ref={ref}
      className={`piece-shine ${cold ? 'piece-shine--cold' : ''} ${className}`}
      style={{ ...style, ['--mask' as string]: `url("${src}")`, ['--shine-d' as string]: `${delay}s` }}
      aria-hidden
    >
      <span className="piece-shine__band m-shine__band" />
    </span>
  )
}
