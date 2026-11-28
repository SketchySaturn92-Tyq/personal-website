import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

export default function CursorLens() {
  const outerRef = useRef(null)
  const dotRef = useRef(null)
  const [label, setLabel] = useState('')
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const finePointer = window.matchMedia('(pointer: fine) and (hover: hover)')
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

    const check = () => {
      setEnabled(finePointer.matches && !reducedMotion.matches)
    }

    check()
    finePointer.addEventListener('change', check)
    reducedMotion.addEventListener('change', check)

    return () => {
      finePointer.removeEventListener('change', check)
      reducedMotion.removeEventListener('change', check)
    }
  }, [])

  useEffect(() => {
    if (!enabled) return undefined

    const outer = outerRef.current
    const dot = dotRef.current
    if (!outer || !dot) return undefined

    gsap.set([outer, dot], { xPercent: -50, yPercent: -50, autoAlpha: 0 })

    const xOuter = gsap.quickTo(outer, 'x', { duration: 0.42, ease: 'power3.out' })
    const yOuter = gsap.quickTo(outer, 'y', { duration: 0.42, ease: 'power3.out' })
    const xDot = gsap.quickTo(dot, 'x', { duration: 0.08, ease: 'power2.out' })
    const yDot = gsap.quickTo(dot, 'y', { duration: 0.08, ease: 'power2.out' })

    let revealed = false

    const handleMove = (event) => {
      if (!revealed) {
        revealed = true
        gsap.to([outer, dot], { autoAlpha: 1, duration: 0.3, overwrite: 'auto' })
      }
      xOuter(event.clientX)
      yOuter(event.clientY)
      xDot(event.clientX)
      yDot(event.clientY)

      const target = event.target instanceof Element ? event.target.closest('[data-cursor], a, button') : null
      if (target) {
        const customText = target.getAttribute('data-cursor') || ''
        outer.classList.add('is-interactive')
        if (customText) {
          outer.classList.add('has-label')
          setLabel((prev) => (prev === customText ? prev : customText))
        } else {
          outer.classList.remove('has-label')
          setLabel((prev) => (prev === '' ? prev : ''))
        }
      } else {
        outer.classList.remove('is-interactive', 'has-label')
        setLabel((prev) => (prev === '' ? prev : ''))
      }
    }

    const handleLeave = () => {
      revealed = false
      gsap.to([outer, dot], { autoAlpha: 0, duration: 0.25, overwrite: 'auto' })
    }

    window.addEventListener('pointermove', handleMove, { passive: true })
    document.documentElement.addEventListener('mouseleave', handleLeave)

    return () => {
      window.removeEventListener('pointermove', handleMove)
      document.documentElement.removeEventListener('mouseleave', handleLeave)
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <>
      <div className="cursor-lens" ref={outerRef} aria-hidden="true">
        {label ? <span className="cursor-lens__label">{label}</span> : null}
      </div>
      <div className="cursor-dot" ref={dotRef} aria-hidden="true" />
    </>
  )
}
