import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { X } from 'lucide-react'
import './ProjectPreview.css'

gsap.registerPlugin(useGSAP)

export default function ProjectPreview({ project, onClose }) {
  const rootRef = useRef(null)
  const backdropRef = useRef(null)
  const panelRef = useRef(null)
  const controlsRef = useRef(null)
  const imageRef = useRef(null)
  const closeRef = useRef(null)
  const closingRef = useRef(false)

  const { contextSafe } = useGSAP(
    () => {
      const previousOverflow = document.body.style.overflow
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const sourceCenter = project.sourceRect
        ? {
            x: project.sourceRect.left + project.sourceRect.width / 2,
            y: project.sourceRect.top + project.sourceRect.height / 2,
          }
        : { x: window.innerWidth / 2, y: window.innerHeight / 2 }

      document.body.style.overflow = 'hidden'
      closeRef.current?.focus({ preventScroll: true })

      gsap.set(backdropRef.current, { autoAlpha: 0 })
      gsap.set(panelRef.current, {
        autoAlpha: reducedMotion ? 1 : 0,
        scale: reducedMotion ? 1 : 0.94,
        y: reducedMotion ? 0 : 28,
        transformOrigin: `${(sourceCenter.x / window.innerWidth) * 100}% ${(sourceCenter.y / window.innerHeight) * 100}%`,
        force3D: true,
      })
      gsap.set(controlsRef.current, { autoAlpha: reducedMotion ? 1 : 0, y: reducedMotion ? 0 : -10 })
      gsap.set(imageRef.current, { autoAlpha: reducedMotion ? 1 : 0, scale: reducedMotion ? 1 : 1.025 })

      if (reducedMotion) {
        gsap.set(backdropRef.current, { autoAlpha: 1 })
      } else {
        gsap
          .timeline({ defaults: { overwrite: 'auto' } })
          .to(backdropRef.current, { autoAlpha: 1, duration: 0.42, ease: 'power2.out' }, 0)
          .to(
            panelRef.current,
            { autoAlpha: 1, scale: 1, y: 0, duration: 0.72, ease: 'power4.out' },
            0.04,
          )
          .to(controlsRef.current, { autoAlpha: 1, y: 0, duration: 0.46, ease: 'power3.out' }, 0.2)
          .to(imageRef.current, { autoAlpha: 1, scale: 1, duration: 0.72, ease: 'power3.out' }, 0.16)
      }

      return () => {
        document.body.style.overflow = previousOverflow
      }
    },
    { scope: rootRef, dependencies: [project.id], revertOnUpdate: true },
  )

  const close = contextSafe(() => {
    if (closingRef.current) return
    closingRef.current = true

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      onClose()
      return
    }

    gsap.set(rootRef.current, { pointerEvents: 'none' })
    gsap
      .timeline({ defaults: { overwrite: 'auto' } })
      .to(controlsRef.current, { autoAlpha: 0, y: -8, duration: 0.18, ease: 'power1.in' }, 0)
      .to(imageRef.current, { autoAlpha: 0, scale: 0.992, duration: 0.26, ease: 'power2.in' }, 0)
      .to(panelRef.current, { autoAlpha: 0, scale: 0.975, y: 18, duration: 0.34, ease: 'power3.in' }, 0.04)
      .to(backdropRef.current, { autoAlpha: 0, duration: 0.3, ease: 'power2.in' }, 0.08)
      .call(onClose, [], 0.4)
  })

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') close()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [close])

  return createPortal(
    <div
      className="project-preview"
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-label={project.ariaLabel}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget || event.target === backdropRef.current) close()
      }}
    >
      <div className="project-preview__backdrop" ref={backdropRef} aria-hidden="true" />
      <article className="project-preview__panel" ref={panelRef}>
        <div className="project-preview__controls" ref={controlsRef}>
          <button ref={closeRef} type="button" onClick={close} aria-label={project.closeLabel}>
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>

        <figure className="project-preview__canvas" ref={imageRef}>
          <img src={project.image} alt={project.imageAlt} decoding="async" />
        </figure>
      </article>
    </div>,
    document.body,
  )
}
