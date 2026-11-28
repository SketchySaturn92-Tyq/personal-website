import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, Linkedin, Mail, Phone } from 'lucide-react'
import Magnet from './components/Magnet'
import './ClosingSequence.css'

const HANDWRITING_PLAYBACK_RATE = 2.4

export default function ClosingSequence({ endingCopy, epilogueCopy }) {
  const sectionRef = useRef(null)
  const videoRef = useRef(null)
  const inViewRef = useRef(false)
  const loopTimerRef = useRef(0)
  const [revealed, setRevealed] = useState(false)
  const [londonTime, setLondonTime] = useState('')

  useEffect(() => {
    const updateClock = () => {
      try {
        const formatted = new Intl.DateTimeFormat('en-GB', {
          timeZone: 'Europe/London',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        }).format(new Date())
        setLondonTime(`LONDON · ${formatted} GMT`)
      } catch {
        setLondonTime('LONDON · UK')
      }
    }
    updateClock()
    const interval = window.setInterval(updateClock, 1000)
    return () => window.clearInterval(interval)
  }, [])

  const startHandwriting = () => {
    const video = videoRef.current
    if (!video) return
    window.clearTimeout(loopTimerRef.current)
    try {
      video.currentTime = 0
    } catch {
      // ignore if metadata still buffering
    }
    video.playbackRate = HANDWRITING_PLAYBACK_RATE
    const playPromise = video.play()
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(() => {})
    }
  }

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          inViewRef.current = true
          setRevealed(true)
          startHandwriting()
        } else {
          inViewRef.current = false
          window.clearTimeout(loopTimerRef.current)
          videoRef.current?.pause()
        }
      },
      { threshold: 0.22 },
    )

    observer.observe(section)
    return () => {
      window.clearTimeout(loopTimerRef.current)
      observer.disconnect()
    }
  }, [])

  const keepVideoSpeed = (event) => {
    event.currentTarget.playbackRate = HANDWRITING_PLAYBACK_RATE
  }

  return (
    <>
      <section
        className={`closing-stage${revealed ? ' is-revealed' : ''}`}
        id="ending"
        ref={sectionRef}
        aria-label={endingCopy.aria}
      >
        <div className="closing-stage__glow" aria-hidden="true" />
        <div className="closing-stage__inner">
          <div className="closing-stage__header">
            <p className="studio-eyebrow">
              <span className="studio-eyebrow__num">{endingCopy.number}</span>
              <span>{endingCopy.label}</span>
            </p>
            <p className="closing-stage__epigraph">
              {epilogueCopy?.quote || '“This is the start of something good — and it will get better.”'}
            </p>
          </div>

          <div className="closing-manuscript">
            <video
              className="closing-manuscript__video"
              ref={videoRef}
              aria-label={endingCopy.videoLabel}
              muted
              autoPlay
              playsInline
              preload="auto"
              onLoadedMetadata={keepVideoSpeed}
              onCanPlay={(event) => {
                keepVideoSpeed(event)
                if (inViewRef.current && event.currentTarget.paused) {
                  event.currentTarget.play().catch(() => {})
                }
              }}
              onPlay={keepVideoSpeed}
              onEnded={(event) => {
                const video = event.currentTarget
                video.pause()
                if (Number.isFinite(video.duration) && video.duration > 0.1) {
                  video.currentTime = Math.max(video.duration - 0.08, 0)
                }
                if (inViewRef.current) {
                  loopTimerRef.current = window.setTimeout(() => {
                    if (inViewRef.current) startHandwriting()
                  }, 3200)
                }
              }}
            >
              <source src="/assets/ending-handwriting.m4v" type="video/mp4" />
              <source src="/assets/ending-handwriting.mov" type="video/quicktime" />
              {endingCopy.fallback}
            </video>
            <div className="closing-manuscript__vignette" aria-hidden="true" />
          </div>
        </div>
      </section>

      <footer className="editorial-colophon" aria-label={endingCopy.footer.aria}>
        <div className="editorial-colophon__shell">
          <div className="editorial-colophon__top">
            <div className="editorial-colophon__lead">
              <div className="editorial-colophon__availability">
                <span className="editorial-colophon__pulse" aria-hidden="true" />
                <span>{epilogueCopy?.availability || 'Open to 2026 Opportunities · London & China'}</span>
              </div>
              <h2 className="editorial-colophon__headline">{endingCopy.footer.tagline}</h2>
              <p className="editorial-colophon__subnote">{endingCopy.footer.note}</p>

              <div className="editorial-colophon__actions">
                <Magnet padding={56} magnetStrength={3.2}>
                  <a
                    className="editorial-cta editorial-cta--primary"
                    href="mailto:17762583565@163.com"
                    data-cursor="EMAIL"
                  >
                    <Mail size={15} />
                    <span>17762583565@163.com</span>
                    <ArrowUpRight size={15} />
                  </a>
                </Magnet>
                <Magnet padding={56} magnetStrength={3.2}>
                  <a
                    className="editorial-cta editorial-cta--ghost"
                    href="https://www.linkedin.com/in/quan-zhong-ss92"
                    target="_blank"
                    rel="noreferrer"
                    data-cursor="OPEN"
                  >
                    <Linkedin size={15} />
                    <span>LinkedIn</span>
                    <ArrowUpRight size={15} />
                  </a>
                </Magnet>
              </div>
            </div>

            <div className="editorial-colophon__columns">
              <nav className="editorial-colophon__column" aria-label={endingCopy.footer.explore}>
                <p>{endingCopy.footer.explore}</p>
                {endingCopy.footer.links.map((link) => (
                  <a href={link.href} key={link.href}>
                    <span>{link.label}</span>
                    <ArrowUpRight size={13} aria-hidden="true" />
                  </a>
                ))}
              </nav>

              <div className="editorial-colophon__column">
                <p>{endingCopy.footer.direct}</p>
                {endingCopy.footer.contacts.map((link) => (
                  <a
                    href={link.href}
                    key={link.href}
                    target={link.href.startsWith('http') ? '_blank' : undefined}
                    rel={link.href.startsWith('http') ? 'noreferrer' : undefined}
                  >
                    <span>{link.label}</span>
                    {link.href.startsWith('tel:') ? (
                      <Phone size={12} aria-hidden="true" />
                    ) : (
                      <ArrowUpRight size={13} aria-hidden="true" />
                    )}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="editorial-colophon__monument" aria-hidden="true">
            <span>QUAN ZHONG</span>
          </div>

          <div className="editorial-colophon__bottom">
            <p>{endingCopy.footer.copyright}</p>
            <span className="editorial-colophon__clock">{londonTime}</span>
            <a href="#top" className="editorial-colophon__top-link">
              {epilogueCopy?.backToTop || 'Back to top ↑'}
            </a>
          </div>
        </div>
      </footer>
    </>
  )
}
