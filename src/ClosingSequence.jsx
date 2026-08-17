import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, Linkedin, Mail, Phone } from 'lucide-react'
import './ClosingSequence.css'

const PYTHON_CODE = `print(
    "This is the start of something good...\\n"
    "and it will get better.\\n"
    "thank you,\\n"
    "Quan Zhong."
)`
const HANDWRITING_PLAYBACK_RATE = 3

export default function ClosingSequence({ copy, endingCopy }) {
  const sectionRef = useRef(null)
  const videoRef = useRef(null)
  const startedRef = useRef(false)
  const [phase, setPhase] = useState('idle')
  const [typedCode, setTypedCode] = useState('')

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !startedRef.current) {
          startedRef.current = true
          setPhase('typing')
        }
      },
      { threshold: 0.46 },
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (phase !== 'typing') return undefined
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) {
      setTypedCode(PYTHON_CODE)
      setPhase('output')
      return undefined
    }

    let index = 0
    let timer
    const typeNext = () => {
      index += 1
      setTypedCode(PYTHON_CODE.slice(0, index))
      if (index < PYTHON_CODE.length) {
        const char = PYTHON_CODE[index - 1]
        const delay = char === '\n' ? 180 : char === '.' ? 138 : char === ' ' ? 52 : 66
        timer = window.setTimeout(typeNext, delay)
      } else {
        timer = window.setTimeout(() => setPhase('output'), 720)
      }
    }

    timer = window.setTimeout(typeNext, 280)
    return () => window.clearTimeout(timer)
  }, [phase])

  useEffect(() => {
    if (phase !== 'output') return undefined
    const timer = window.setTimeout(() => setPhase('handwriting'), 1350)
    return () => window.clearTimeout(timer)
  }, [phase])

  useEffect(() => {
    if (phase !== 'handwriting') return undefined
    const video = videoRef.current
    if (!video) return undefined

    video.currentTime = 0
    video.playbackRate = HANDWRITING_PLAYBACK_RATE
    const playTimer = window.setTimeout(() => {
      video.playbackRate = HANDWRITING_PLAYBACK_RATE
      video.play().catch(() => {})
    }, 100)

    return () => window.clearTimeout(playTimer)
  }, [phase])

  const keepVideoSpeed = (event) => {
    event.currentTarget.playbackRate = HANDWRITING_PLAYBACK_RATE
  }

  return (
    <>
      <section
        className={`closing-sequence closing-sequence--${phase}`}
        id="ending"
        ref={sectionRef}
        aria-label={copy.aria}
      >
      <div className="closing-sequence__matrix" aria-hidden="true" />
      <p className="section-label closing-sequence__label">
        <span>{endingCopy.number}</span>
        {endingCopy.label}
      </p>

      <div className="python-window" aria-live="polite">
        <div className="python-window__bar">
          <div className="python-window__lights" aria-hidden="true">
            <i />
            <i />
            <i />
          </div>
          <span>{copy.filename}</span>
          <span className="python-window__runtime">PYTHON 3.12</span>
        </div>
        <div className="python-window__body">
          <div className="python-window__meta">
            <span>{copy.terminalLabel}</span>
            <span className="python-window__status">
              <i aria-hidden="true" />
              {phase === 'typing' ? copy.typingStatus : copy.completeStatus}
            </span>
          </div>
          <pre className="python-window__code">
            <span className="python-window__prompt">&gt;&gt;&gt;</span>{' '}
            <code>{typedCode}</code>
            {phase === 'typing' ? <span className="python-window__cursor" aria-hidden="true" /> : null}
          </pre>
          <div className={`python-window__output${phase === 'output' ? ' is-visible' : ''}`}>
            <span>{copy.outputLabel}</span>
            <p>
              This is the start of something good...
              <br />
              and it will get better.
              <br />
              thank you,
              <br />
              Quan Zhong.
            </p>
          </div>
        </div>
      </div>

      <div className="closing-handwriting" aria-hidden={phase !== 'handwriting'}>
        <video
          className="closing-handwriting__video"
          ref={videoRef}
          aria-label={endingCopy.videoLabel}
          muted
          playsInline
          preload="metadata"
          onLoadedMetadata={keepVideoSpeed}
          onCanPlay={keepVideoSpeed}
          onPlay={keepVideoSpeed}
          onEnded={(event) => {
            const video = event.currentTarget
            video.pause()
            video.currentTime = Math.max(video.duration - 0.08, 0)
          }}
        >
          <source src="/assets/ending-handwriting.m4v" type="video/mp4" />
          <source src="/assets/ending-handwriting.mov" type="video/quicktime" />
          {endingCopy.fallback}
        </video>
        <div className="closing-handwriting__shade" />
      </div>
      </section>

      <section className="final-footer" aria-label={endingCopy.footer.aria}>
        <div className="final-footer__main">
          <div className="final-footer__identity">
            <a className="final-footer__mark" href="#top" aria-label="Quan Zhong">
              QZ<span>.</span>
            </a>
            <p className="final-footer__tagline">{endingCopy.footer.tagline}</p>
            <p className="final-footer__note">{endingCopy.footer.note}</p>
            <div className="final-footer__socials">
              <a
                href="https://www.linkedin.com/in/quan-zhong-ss92"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
              >
                <Linkedin aria-hidden="true" />
              </a>
              <a href="mailto:17762583565@163.com" aria-label="Email">
                <Mail aria-hidden="true" />
              </a>
              <a href="tel:+447526037298" aria-label="Phone">
                <Phone aria-hidden="true" />
              </a>
            </div>
          </div>

          <div className="final-footer__columns">
            <nav className="final-footer__column" aria-label={endingCopy.footer.explore}>
              <p>{endingCopy.footer.explore}</p>
              {endingCopy.footer.links.map((link) => (
                <a href={link.href} key={link.href}>
                  {link.label}
                </a>
              ))}
            </nav>
            <div className="final-footer__column">
              <p>{endingCopy.footer.direct}</p>
              {endingCopy.footer.contacts.map((link) => (
                <a
                  href={link.href}
                  key={link.href}
                  target={link.href.startsWith('http') ? '_blank' : undefined}
                  rel={link.href.startsWith('http') ? 'noreferrer' : undefined}
                >
                  {link.label}
                  <ArrowUpRight aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="final-footer__bottom">
          <p>{endingCopy.footer.copyright}</p>
          <a href="#top">QZ / 2026</a>
        </div>
      </section>
    </>
  )
}
