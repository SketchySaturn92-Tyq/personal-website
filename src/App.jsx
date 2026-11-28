import { useEffect, useRef, useState } from 'react'
import { Globe, Menu, Music, Volume2, X } from 'lucide-react'

import ClickSpark from './components/ClickSpark'
import Noise from './components/Noise'

import { AmbientChordPlayer } from './AmbientAudio'
import CertificateQuickLook from './CertificateQuickLook'
import CursorLens from './CursorLens'
import GalacticMainStage, { GALACTIC_DESTINATIONS } from './GalacticMainStage'
import NewWorldFinale from './NewWorldFinale'
import OpeningMotion from './OpeningMotion'
import PaperPreview from './PaperPreview'
import PlanetStandalonePage from './PlanetPages'

import {
  copyByLanguage,
  languageOptions,
  paperPreviewCopyByLanguage,
} from './data/portfolioCopy'

export default function App() {
  const audioRef = useRef(null)

  const [menuOpen, setMenuOpen] = useState(false)
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false)
  const [soundPlaying, setSoundPlaying] = useState(false)

  // Core Galactic Navigation State:
  // null = Full-Screen 3D Galactic Voyage Main Stage ("穿越银河空间")
  // 'mars' | 'jupiter' | 'saturn' | 'pluto' | 'pulsar' = Standalone Planet Page!
  const [activePlanetId, setActivePlanetId] = useState(null)
  const [galaxyProgress, setGalaxyProgress] = useState(0)

  const [quickLookCertificate, setQuickLookCertificate] = useState(null)
  const [paperPreview, setPaperPreview] = useState(null)

  const [introRunId, setIntroRunId] = useState(1)
  const [introActive, setIntroActive] = useState(() => {
    if (typeof window === 'undefined') return false
    return !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  })

  const [language, setLanguage] = useState(() => {
    if (typeof window === 'undefined') return 'zh'
    const stored = window.localStorage.getItem('portfolio-language')
    return copyByLanguage[stored] ? stored : 'zh'
  })

  const copy = copyByLanguage[language]
  const paperPreviewCopy = paperPreviewCopyByLanguage[language]
  const currentLanguage = languageOptions.find((item) => item.code === language) || languageOptions[0]

  useEffect(() => {
    audioRef.current = new AmbientChordPlayer()
    return () => {
      audioRef.current?.dispose()
    }
  }, [])

  useEffect(() => {
    document.documentElement.lang = currentLanguage.htmlLang
    window.localStorage.setItem('portfolio-language', language)
  }, [currentLanguage.htmlLang, language])

  const toggleSound = () => {
    const player = audioRef.current
    if (!player) return
    if (soundPlaying) {
      player.stop()
      setSoundPlaying(false)
    } else if (player.start()) {
      setSoundPlaying(true)
    }
  }

  const selectLanguage = (code) => {
    setLanguage(code)
    setLanguageMenuOpen(false)
    setMenuOpen(false)
  }

  const handleReplayLiftoff = () => {
    setActivePlanetId(null)
    setGalaxyProgress(0)
    setIntroActive(true)
    setIntroRunId((prev) => prev + 1)
  }

  const handleSelectPlanetFromHeader = (planetId) => {
    setMenuOpen(false)
    if (!planetId) {
      setActivePlanetId(null)
      return
    }
    const dest = GALACTIC_DESTINATIONS.find((d) => d.id === planetId)
    if (dest) setGalaxyProgress(dest.t)
    setActivePlanetId(planetId)
  }

  const headerNavItems = [
    { id: null, label: copy.galaxyHud.originLabel },
    ...GALACTIC_DESTINATIONS.map((d) => ({
      id: d.id,
      label: copy.destinations?.[d.id]?.planetName,
    })),
  ]

  return (
    <ClickSpark
      sparkColor="#E5C99B"
      sparkSize={10}
      sparkRadius={24}
      sparkCount={8}
      sparkWidth={1.5}
      duration={500}
      glow={0.5}
    >
      <div className="studio-app is-galactic-viewport">
        {introActive && (
          <OpeningMotion
            key={`opening-motion-${introRunId}`}
            copy={copy.opening}
            onComplete={() => setIntroActive(false)}
          />
        )}

        <CursorLens />
        <Noise fixed opacity={0.024} blendMode="overlay" fps={18} contrast={0.5} zIndex={390} />

        {/* Persistent Minimal Star-Cruiser Cockpit Header */}
        <header className="studio-header is-floating" style={{ zIndex: 90 }}>
          <div className="studio-header__left">
            <button
              type="button"
              className="studio-wordmark"
              style={{ border: 0, background: 'transparent', padding: 0 }}
              aria-label={copy.wordmarkAria}
              onClick={() => setActivePlanetId(null)}
            >
              SS<span className="studio-wordmark__dot">92.</span>
            </button>
            <span className="studio-status">
              <i className="studio-status__dot" aria-hidden="true" />
              {copy.statusPill}
            </span>
          </div>

          <nav className="studio-nav" aria-label="Galactic Sectors">
            {headerNavItems.map((item) => (
              <button
                key={item.id || 'galaxy'}
                type="button"
                className={`studio-nav-btn${activePlanetId === item.id ? ' is-active' : ''}`}
                onClick={() => handleSelectPlanetFromHeader(item.id)}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="studio-header__right">
            <button
              type="button"
              className={`studio-sound-pill${soundPlaying ? ' is-playing' : ''}`}
              onClick={toggleSound}
              data-cursor="SOUND"
            >
              {soundPlaying ? <Volume2 size={13} /> : <Music size={13} />}
              <span>{soundPlaying ? copy.soundOnLabel : copy.soundOffLabel}</span>
            </button>

            <div className="studio-lang">
              <button
                type="button"
                className="studio-lang__trigger"
                aria-label={copy.languageAria}
                aria-expanded={languageMenuOpen}
                onClick={() => setLanguageMenuOpen((prev) => !prev)}
              >
                <Globe size={14} />
                <span>{currentLanguage.shortLabel}</span>
              </button>

              {languageMenuOpen && (
                <div className="studio-lang__menu" role="menu" aria-label={copy.languageAria}>
                  {languageOptions.map((item) => (
                    <button
                      key={item.code}
                      type="button"
                      role="menuitem"
                      className={item.code === language ? 'is-active' : ''}
                      onClick={() => selectLanguage(item.code)}
                    >
                      <span>{item.label}</span>
                      <small>{item.shortLabel}</small>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              className="studio-burger"
              aria-label={menuOpen ? copy.menuClose : copy.menuOpen}
              onClick={() => setMenuOpen((prev) => !prev)}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {menuOpen && (
            <div className="studio-mobile-drawer">
              <nav aria-label="Mobile">
                {headerNavItems.map((item) => (
                  <button
                    key={item.id || 'galaxy'}
                    type="button"
                    className="studio-mobile-nav-btn"
                    onClick={() => handleSelectPlanetFromHeader(item.id)}
                  >
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          )}
        </header>

        {/* ====================================================================
            MAIN VIEWPORT: 3D GALACTIC VOYAGE, STANDALONE PLANET, OR NEW WORLD!
            ==================================================================== */}
        {activePlanetId === null ? (
          <GalacticMainStage
            copy={copy}
            initialProgress={galaxyProgress}
            onProgressChange={(t) => setGalaxyProgress(t)}
            onEnterPlanet={(planetId, lastT) => {
              setGalaxyProgress(lastT)
              setActivePlanetId(planetId)
            }}
            onReplayLiftoff={handleReplayLiftoff}
          />
        ) : activePlanetId === 'newworld' ? (
          <NewWorldFinale
            copy={copy}
            onBackToGalaxy={() => {
              setGalaxyProgress(0.8)
              setActivePlanetId(null)
            }}
          />
        ) : (
          <PlanetStandalonePage
            planetId={activePlanetId}
            copy={copy}
            paperPreviewCopy={paperPreviewCopy}
            onBackToGalaxy={() => setActivePlanetId(null)}
            onSwitchPlanet={(nextId) => {
              const dest = GALACTIC_DESTINATIONS.find((d) => d.id === nextId)
              if (dest) setGalaxyProgress(dest.t)
              setActivePlanetId(nextId)
            }}
            onOpenPaper={(paper) => setPaperPreview(paper)}
            onOpenCertificate={(cert) => setQuickLookCertificate(cert)}
          />
        )}

        {quickLookCertificate && (
          <CertificateQuickLook
            item={quickLookCertificate}
            ariaLabel={copy.quickLook.ariaLabel}
            closeLabel={copy.quickLook.closeLabel}
            onClose={() => setQuickLookCertificate(null)}
          />
        )}

        {paperPreview && (
          <PaperPreview paper={paperPreview} onClose={() => setPaperPreview(null)} />
        )}
      </div>
    </ClickSpark>
  )
}
