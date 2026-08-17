import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { X } from 'lucide-react'
import './CertificateQuickLook.css'

gsap.registerPlugin(useGSAP)

const getTargetFrame = () => {
  const compact = window.innerWidth <= 700
  const width = Math.min(window.innerWidth * (compact ? 0.92 : 0.86), 1180)
  const height = Math.min(window.innerHeight * (compact ? 0.7 : 0.76), 760)

  return {
    width,
    height,
    left: (window.innerWidth - width) / 2,
    top: (window.innerHeight - height) / 2,
  }
}

function CertificateQuickLook({ item, ariaLabel, closeLabel, onClose }) {
  const rootRef = useRef(null)
  const backdropRef = useRef(null)
  const stageRef = useRef(null)
  const imageRef = useRef(null)
  const closeButtonRef = useRef(null)
  const captionRef = useRef(null)
  const closingRef = useRef(false)

  const { contextSafe } = useGSAP(
    () => {
      const sourceElement = item.sourceElement
      const sourceRect = sourceElement?.getBoundingClientRect() || item.sourceRect
      const target = getTargetFrame()
      const previousOverflow = document.body.style.overflow
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      document.body.style.overflow = 'hidden'
      sourceElement?.classList.add('is-quicklook-source')

      gsap.set(stageRef.current, {
        top: target.top,
        left: target.left,
        width: target.width,
        height: target.height,
        x: sourceRect.left - target.left,
        y: sourceRect.top - target.top,
        scaleX: sourceRect.width / target.width,
        scaleY: sourceRect.height / target.height,
        borderRadius: 7,
        boxShadow: '0 0 0 rgba(0, 0, 0, 0)',
        transformOrigin: 'top left',
        force3D: true,
      })
      gsap.set(imageRef.current, { scale: 1.025, force3D: true })
      gsap.set(backdropRef.current, { autoAlpha: 0 })
      gsap.set(closeButtonRef.current, { autoAlpha: 0, y: -7, scale: 0.9 })
      gsap.set(captionRef.current, { autoAlpha: 0, y: 14 })

      if (reducedMotion) {
        gsap.set(stageRef.current, {
          x: 0,
          y: 0,
          scaleX: 1,
          scaleY: 1,
          borderRadius: compactRadius(),
          boxShadow: '0 34px 100px rgba(0, 0, 0, 0.55)',
        })
        gsap.set(imageRef.current, { scale: 1 })
        gsap.set([backdropRef.current, closeButtonRef.current, captionRef.current], { autoAlpha: 1 })
        gsap.set([closeButtonRef.current, captionRef.current], { y: 0, scale: 1 })
      } else {
        gsap
          .timeline({ defaults: { overwrite: 'auto' } })
          .to(backdropRef.current, { autoAlpha: 1, duration: 0.52, ease: 'power2.out' }, 0)
          .to(
            stageRef.current,
            {
              x: 0,
              y: 0,
              scaleX: 1,
              scaleY: 1,
              borderRadius: compactRadius(),
              boxShadow: '0 34px 100px rgba(0, 0, 0, 0.55)',
              duration: 0.82,
              ease: 'power4.out',
            },
            0,
          )
          .to(imageRef.current, { scale: 1, duration: 0.82, ease: 'power4.out' }, 0)
          .to(
            closeButtonRef.current,
            { autoAlpha: 1, y: 0, scale: 1, duration: 0.36, ease: 'power3.out' },
            0.24,
          )
          .to(captionRef.current, { autoAlpha: 1, y: 0, duration: 0.44, ease: 'power3.out' }, 0.28)
      }

      return () => {
        document.body.style.overflow = previousOverflow
        sourceElement?.classList.remove('is-quicklook-source')
      }
    },
    { scope: rootRef, dependencies: [item.id], revertOnUpdate: true },
  )

  const close = contextSafe(() => {
    if (closingRef.current) return
    closingRef.current = true

    const sourceElement = item.sourceElement
    const sourceRect = sourceElement?.isConnected ? sourceElement.getBoundingClientRect() : item.sourceRect
    const stage = stageRef.current
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (!stage || !sourceRect || reducedMotion) {
      onClose()
      return
    }

    const baseWidth = stage.offsetWidth
    const baseHeight = stage.offsetHeight
    const baseLeft = stage.offsetLeft
    const baseTop = stage.offsetTop

    gsap.set(rootRef.current, { pointerEvents: 'none' })
    gsap.killTweensOf([
      backdropRef.current,
      stage,
      imageRef.current,
      closeButtonRef.current,
      captionRef.current,
    ])

    gsap
      .timeline({ defaults: { overwrite: 'auto' } })
      .to(
        [closeButtonRef.current, captionRef.current],
        { autoAlpha: 0, y: 8, duration: 0.14, ease: 'power1.in' },
        0,
      )
      .set(backdropRef.current, { backdropFilter: 'none' }, 0)
      .to(
        stage,
        {
          x: sourceRect.left - baseLeft,
          y: sourceRect.top - baseTop,
          scaleX: sourceRect.width / baseWidth,
          scaleY: sourceRect.height / baseHeight,
          borderRadius: 7,
          boxShadow: '0 0 0 rgba(0, 0, 0, 0)',
          duration: 0.5,
          ease: 'power4.in',
          force3D: true,
        },
        0,
      )
      .to(imageRef.current, { scale: 1.025, duration: 0.5, ease: 'power4.in' }, 0)
      .to(backdropRef.current, { autoAlpha: 0, duration: 0.38, ease: 'power2.in' }, 0)
      .call(() => sourceElement?.classList.remove('is-quicklook-source'), [], 0.41)
      .to(stage, { autoAlpha: 0, duration: 0.09, ease: 'none' }, 0.41)
      .call(onClose, [], 0.5)
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
      className="certificate-quicklook"
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget || event.target === backdropRef.current) close()
      }}
    >
      <div className="certificate-quicklook__backdrop" ref={backdropRef} aria-hidden="true" />
      <button
        className="certificate-quicklook__close"
        ref={closeButtonRef}
        type="button"
        onClick={close}
        aria-label={closeLabel}
      >
        <X size={18} strokeWidth={1.5} />
      </button>
      <button
        className="certificate-quicklook__stage"
        ref={stageRef}
        type="button"
        onClick={close}
        aria-label={closeLabel}
      >
        <img ref={imageRef} src={item.image} alt={item.title} />
      </button>
      <div className="certificate-quicklook__caption" ref={captionRef} aria-hidden="true">
        <strong>{item.title}</strong>
        <span>{item.issuer}</span>
      </div>
    </div>,
    document.body,
  )
}

const compactRadius = () => (window.innerWidth <= 700 ? 12 : 18)

export default CertificateQuickLook
