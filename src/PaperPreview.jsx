import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { X } from 'lucide-react'
import './PaperPreview.css'

gsap.registerPlugin(useGSAP)

export default function PaperPreview({ paper, onClose }) {
  const rootRef = useRef(null)
  const backdropRef = useRef(null)
  const panelRef = useRef(null)
  const closeRef = useRef(null)
  const closingRef = useRef(false)

  const { contextSafe } = useGSAP(
    () => {
      const previousOverflow = document.body.style.overflow
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      document.body.style.overflow = 'hidden'
      closeRef.current?.focus({ preventScroll: true })

      gsap.set(backdropRef.current, { autoAlpha: reducedMotion ? 1 : 0 })
      gsap.set(panelRef.current, {
        autoAlpha: reducedMotion ? 1 : 0,
        y: reducedMotion ? 0 : 34,
        scale: reducedMotion ? 1 : 0.975,
        force3D: true,
      })

      if (!reducedMotion) {
        gsap
          .timeline({ defaults: { overwrite: 'auto' } })
          .to(backdropRef.current, { autoAlpha: 1, duration: 0.38, ease: 'power2.out' }, 0)
          .to(panelRef.current, { autoAlpha: 1, y: 0, scale: 1, duration: 0.68, ease: 'power4.out' }, 0.04)
      }

      return () => {
        document.body.style.overflow = previousOverflow
      }
    },
    { scope: rootRef, dependencies: [paper.id], revertOnUpdate: true },
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
      .to(panelRef.current, { autoAlpha: 0, y: 18, scale: 0.985, duration: 0.3, ease: 'power3.in' }, 0)
      .to(backdropRef.current, { autoAlpha: 0, duration: 0.28, ease: 'power2.in' }, 0.05)
      .call(onClose, [], 0.34)
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
      className="paper-preview"
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-label={paper.ariaLabel}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget || event.target === backdropRef.current) close()
      }}
    >
      <div className="paper-preview__backdrop" ref={backdropRef} aria-hidden="true" />
      <article className={`paper-preview__panel${paper.pdf ? ' has-document' : ' is-summary'}`} ref={panelRef}>
        <header className="paper-preview__header">
          <div>
            <p>{paper.eyebrow}</p>
            <h2>{paper.title}</h2>
            <span>{paper.subtitle}</span>
          </div>
          <button ref={closeRef} type="button" onClick={close} aria-label={paper.closeLabel}>
            <X size={20} strokeWidth={1.5} />
          </button>
        </header>

        <div className="paper-preview__body">
          <aside className="paper-preview__summary">
            <div className="paper-preview__meta">
              {paper.meta.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
            <p className="paper-preview__lede">{paper.summary}</p>
            <dl>
              {paper.details.map((detail) => (
                <div key={detail.label}>
                  <dt>{detail.label}</dt>
                  <dd>{detail.value}</dd>
                </div>
              ))}
            </dl>
          </aside>

          {paper.pdf ? (
            <div className="paper-preview__document">
              <iframe title={paper.documentTitle} src={`${paper.pdf}#view=FitH&toolbar=1&navpanes=0`} />
            </div>
          ) : (
            <div className="paper-preview__website">
              <iframe
                title={paper.websiteTitle}
                src={paper.websiteUrl}
                loading="eager"
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
          )}
        </div>
      </article>
    </div>,
    document.body,
  )
}
