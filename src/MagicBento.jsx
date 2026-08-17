import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { gsap } from 'gsap'
import './MagicBento.css'

const DEFAULT_GLOW_COLOR = '168, 85, 247'
const MOBILE_BREAKPOINT = 768

const createParticle = (x, y, color) => {
  const particle = document.createElement('span')
  particle.className = 'magic-bento-particle'
  particle.style.left = `${x}px`
  particle.style.top = `${y}px`
  particle.style.setProperty('--particle-color', color)
  return particle
}

const setGlowPosition = (card, clientX, clientY, intensity, radius) => {
  const rect = card.getBoundingClientRect()
  card.style.setProperty('--glow-x', `${((clientX - rect.left) / rect.width) * 100}%`)
  card.style.setProperty('--glow-y', `${((clientY - rect.top) / rect.height) * 100}%`)
  card.style.setProperty('--glow-intensity', intensity.toString())
  card.style.setProperty('--glow-radius', `${radius}px`)
}

function useDisableMotion(disableAnimations) {
  const [disableMotion, setDisableMotion] = useState(disableAnimations)

  useEffect(() => {
    const media = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px), (prefers-reduced-motion: reduce)`)
    const update = () => setDisableMotion(disableAnimations || media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [disableAnimations])

  return disableMotion
}

function BentoCard({
  card,
  openLabel,
  disableAnimations,
  enableStars,
  enableTilt,
  enableMagnetism,
  clickEffect,
  glowColor,
  particleCount,
}) {
  const cardRef = useRef(null)
  const particlesRef = useRef([])

  const clearParticles = useCallback(() => {
    particlesRef.current.forEach((particle) => {
      gsap.killTweensOf(particle)
      particle.remove()
    })
    particlesRef.current = []
  }, [])

  useEffect(() => clearParticles, [clearParticles])

  const handleEnter = () => {
    const element = cardRef.current
    if (!element || disableAnimations || !enableStars) return
    const rect = element.getBoundingClientRect()
    clearParticles()

    particlesRef.current = Array.from({ length: particleCount }, (_, index) => {
      const particle = createParticle(Math.random() * rect.width, Math.random() * rect.height, glowColor)
      element.appendChild(particle)
      gsap.fromTo(
        particle,
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 0.72,
          duration: 0.35,
          delay: index * 0.045,
          ease: 'back.out(1.8)',
        },
      )
      gsap.to(particle, {
        x: (Math.random() - 0.5) * 70,
        y: (Math.random() - 0.5) * 70,
        opacity: 0.18,
        duration: 1.8 + Math.random() * 1.4,
        delay: index * 0.045,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })
      return particle
    })
  }

  const handleMove = (event) => {
    const element = cardRef.current
    if (!element || disableAnimations) return
    const rect = element.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    const dx = x - rect.width / 2
    const dy = y - rect.height / 2

    if (enableTilt) {
      gsap.to(element, {
        rotateX: (-dy / rect.height) * 9,
        rotateY: (dx / rect.width) * 11,
        transformPerspective: 900,
        duration: 0.35,
        ease: 'power3.out',
        overwrite: 'auto',
      })
    }

    if (enableMagnetism) {
      gsap.to(element, {
        x: dx * 0.025,
        y: dy * 0.025,
        duration: 0.5,
        ease: 'power3.out',
        overwrite: 'auto',
      })
    }
  }

  const handleLeave = () => {
    const element = cardRef.current
    clearParticles()
    if (!element || disableAnimations) return
    gsap.to(element, {
      x: 0,
      y: 0,
      rotateX: 0,
      rotateY: 0,
      duration: 0.65,
      ease: 'elastic.out(1, 0.7)',
      overwrite: 'auto',
    })
  }

  const handleClick = (event) => {
    const element = cardRef.current
    if (!element || disableAnimations || !clickEffect) return
    const rect = element.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    const diameter = Math.max(rect.width, rect.height) * 2.2
    const ripple = document.createElement('span')
    ripple.className = 'magic-bento-ripple'
    ripple.style.left = `${x - diameter / 2}px`
    ripple.style.top = `${y - diameter / 2}px`
    ripple.style.width = `${diameter}px`
    ripple.style.height = `${diameter}px`
    ripple.style.setProperty('--ripple-color', glowColor)
    element.appendChild(ripple)
    gsap.fromTo(
      ripple,
      { scale: 0, opacity: 0.8 },
      { scale: 1, opacity: 0, duration: 0.85, ease: 'power2.out', onComplete: () => ripple.remove() },
    )
  }

  return (
    <a
      ref={cardRef}
      className={`magic-bento-card magic-bento-card--border-glow${card.featured ? ' is-featured' : ''}`}
      href={card.href}
      target="_blank"
      rel="noreferrer"
      style={{ '--glow-color': glowColor }}
      onMouseEnter={handleEnter}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onClick={handleClick}
      aria-label={`${card.title} — ${openLabel}`}
    >
      <img src={card.image} alt="" loading="lazy" />
      <span className="magic-bento-card__shade" aria-hidden="true" />
      <span className="magic-bento-card__header">
        <span>{card.type}</span>
        <span>{card.year}</span>
      </span>
      <span className="magic-bento-card__content">
        <strong>{card.title}</strong>
        <small>{card.issuer}</small>
      </span>
      <span className="magic-bento-card__open">
        {openLabel}
        <ArrowUpRight size={14} />
      </span>
    </a>
  )
}

function GlobalSpotlight({ gridRef, disabled, radius, glowColor }) {
  const spotlightRef = useRef(null)

  useEffect(() => {
    const grid = gridRef.current
    if (!grid || disabled) return undefined

    const spotlight = document.createElement('div')
    spotlight.className = 'magic-bento-global-spotlight'
    spotlight.style.setProperty('--spotlight-color', glowColor)
    document.body.appendChild(spotlight)
    spotlightRef.current = spotlight

    const handleMove = (event) => {
      const gridRect = grid.getBoundingClientRect()
      const inside =
        event.clientX >= gridRect.left &&
        event.clientX <= gridRect.right &&
        event.clientY >= gridRect.top &&
        event.clientY <= gridRect.bottom

      if (!inside) {
        gsap.to(spotlight, { opacity: 0, duration: 0.35, overwrite: 'auto' })
        grid.querySelectorAll('.magic-bento-card').forEach((card) => card.style.setProperty('--glow-intensity', '0'))
        return
      }

      let nearest = Infinity
      grid.querySelectorAll('.magic-bento-card').forEach((card) => {
        const rect = card.getBoundingClientRect()
        const distance = Math.max(
          0,
          Math.hypot(event.clientX - (rect.left + rect.width / 2), event.clientY - (rect.top + rect.height / 2)) -
            Math.max(rect.width, rect.height) / 2,
        )
        nearest = Math.min(nearest, distance)
        const intensity = Math.max(0, 1 - distance / radius)
        setGlowPosition(card, event.clientX, event.clientY, intensity, radius)
      })

      gsap.to(spotlight, {
        left: event.clientX,
        top: event.clientY,
        opacity: Math.max(0.18, 0.7 * (1 - nearest / radius)),
        duration: 0.16,
        ease: 'power2.out',
        overwrite: 'auto',
      })
    }

    document.addEventListener('mousemove', handleMove, { passive: true })
    return () => {
      document.removeEventListener('mousemove', handleMove)
      spotlight.remove()
    }
  }, [disabled, glowColor, gridRef, radius])

  return null
}

function MagicBento({
  cards,
  ariaLabel,
  openLabel,
  enableStars = true,
  enableSpotlight = true,
  enableBorderGlow = true,
  disableAnimations = false,
  spotlightRadius = 260,
  particleCount = 7,
  enableTilt = true,
  glowColor = DEFAULT_GLOW_COLOR,
  clickEffect = true,
  enableMagnetism = true,
  className = '',
}) {
  const gridRef = useRef(null)
  const disableMotion = useDisableMotion(disableAnimations)

  return (
    <div
      ref={gridRef}
      className={`magic-bento-grid${enableBorderGlow ? ' has-border-glow' : ''}${className ? ` ${className}` : ''}`}
      aria-label={ariaLabel}
      data-count={cards.length}
    >
      {enableSpotlight && (
        <GlobalSpotlight gridRef={gridRef} disabled={disableMotion} radius={spotlightRadius} glowColor={glowColor} />
      )}
      {cards.map((card) => (
        <BentoCard
          key={card.id}
          card={card}
          openLabel={openLabel}
          disableAnimations={disableMotion}
          enableStars={enableStars}
          enableTilt={enableTilt}
          enableMagnetism={enableMagnetism}
          clickEffect={clickEffect}
          glowColor={glowColor}
          particleCount={particleCount}
        />
      ))}
    </div>
  )
}

export default MagicBento
