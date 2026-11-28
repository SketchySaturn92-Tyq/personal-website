import { useEffect, useMemo, useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Award,
  Cpu,
  Database,
  Eye,
  FileText,
  Gamepad2,
  Languages,
  Sparkles,
} from 'lucide-react'
import GlareHover from './components/GlareHover'
import SpotlightCard from './components/SpotlightCard'
import TiltedCard, { TiltedCardLayer } from './components/TiltedCard'
import { GALACTIC_DESTINATIONS } from './GalacticMainStage'
import { certificateAssets, nengwanGamesAssets } from './data/portfolioCopy'
import './PlanetPages.css'

function ActionBiasDiagram() {
  return (
    <div className="research-diagram" aria-hidden="true">
      <div className="research-diagram__grid" />
      <svg viewBox="0 0 420 144" className="research-diagram__svg">
        <defs>
          <linearGradient id="saturnUtilFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8AB4F8" stopOpacity="0.24" />
            <stop offset="100%" stopColor="#8AB4F8" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M28 118 C108 114, 168 92, 232 76 C296 60, 342 52, 392 48"
          fill="none"
          stroke="rgba(244,241,234,0.4)"
          strokeWidth="1.5"
          strokeDasharray="5 5"
        />
        <path
          d="M28 118 C96 108, 146 42, 214 34 C278 26, 326 68, 392 22 L392 124 L28 124 Z"
          fill="url(#saturnUtilFill)"
        />
        <path
          d="M28 118 C96 108, 146 42, 214 34 C278 26, 326 68, 392 22"
          fill="none"
          stroke="#E5C99B"
          strokeWidth="2.3"
          strokeLinecap="round"
        />
        <circle cx="214" cy="34" r="4.5" fill="#E5C99B" />
        <circle cx="214" cy="80" r="3.8" fill="#8AB4F8" />
      </svg>
    </div>
  )
}

function ArimaDiagram() {
  return (
    <div className="research-diagram" aria-hidden="true">
      <div className="research-diagram__grid" />
      <svg viewBox="0 0 420 144" className="research-diagram__svg">
        <line x1="248" y1="16" x2="248" y2="128" stroke="rgba(229,201,155,0.5)" strokeDasharray="3 4" />
        <path
          d="M28 110 L68 98 L104 112 L142 82 L178 90 L212 66 L248 78"
          fill="none"
          stroke="#F4F1EA"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M248 78 C295 74, 342 70, 392 66"
          fill="none"
          stroke="#8AB4F8"
          strokeWidth="1.8"
          strokeDasharray="5 5"
        />
        <path
          d="M248 78 C282 40, 326 50, 392 44"
          fill="none"
          stroke="#E5C99B"
          strokeWidth="2.3"
          strokeLinecap="round"
        />
        <circle cx="248" cy="78" r="4.5" fill="#E5C99B" />
      </svg>
    </div>
  )
}

function AgentFlowVisual() {
  return (
    <div className="pluto-holo-diagram" aria-hidden="true">
      <svg viewBox="0 0 520 180" className="pluto-holo-svg">
        <defs>
          <linearGradient id="plutoBeam" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#7CE0FF" />
            <stop offset="50%" stopColor="#A78BFA" />
            <stop offset="100%" stopColor="#E5C99B" />
          </linearGradient>
        </defs>
        <path
          d="M90 90 C160 30, 200 30, 260 90 C320 150, 360 150, 430 90"
          fill="none"
          stroke="url(#plutoBeam)"
          strokeWidth="2.2"
          strokeDasharray="5 5"
        />
        <line x1="90" y1="90" x2="430" y2="90" stroke="rgba(124,224,255,0.28)" strokeWidth="1.5" />
        {[
          { x: 90, title: 'SCOUT AGENT', sub: 'Multi-Source Radar', c: '#7CE0FF' },
          { x: 260, title: 'AGENT HARNESS', sub: 'Structured Planner', c: '#A78BFA' },
          { x: 430, title: 'LIVE SANDBOX', sub: 'Interactive Prototype', c: '#E5C99B' },
        ].map((n) => (
          <g key={n.title} transform={`translate(${n.x}, 90)`}>
            <circle r="34" fill="rgba(7,14,28,0.94)" stroke={n.c} strokeWidth="1.8" />
            <circle r="5" cy="-12" fill={n.c} />
            <text y="6" textAnchor="middle" fill="#F4F1EA" fontSize="8.5" fontFamily="DM Mono, monospace">
              {n.title}
            </text>
            <text y="54" textAnchor="middle" fill="rgba(244,241,234,0.6)" fontSize="10">
              {n.sub}
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}

function VectorRagVisual() {
  return (
    <div className="pluto-holo-diagram" aria-hidden="true">
      <svg viewBox="0 0 520 180" className="pluto-holo-svg">
        {['N · ZONE', 'S · ZONE', 'E · ZONE', 'W · ZONE'].map((z, i) => (
          <g key={z}>
            <rect
              x="36"
              y={26 + i * 34}
              width="92"
              height="22"
              rx="6"
              fill="rgba(124,224,255,0.1)"
              stroke="rgba(124,224,255,0.42)"
            />
            <text
              x="82"
              y={40 + i * 34}
              textAnchor="middle"
              fill="#BCEEFF"
              fontSize="9"
              fontFamily="DM Mono, monospace"
            >
              {z}
            </text>
            <line
              x1="128"
              y1={37 + i * 34}
              x2="232"
              y2="90"
              stroke="rgba(124,224,255,0.3)"
              strokeWidth="1.3"
            />
          </g>
        ))}
        <circle cx="262" cy="90" r="34" fill="rgba(8,16,32,0.96)" stroke="#7CE0FF" strokeWidth="2" />
        <text x="262" y="93" textAnchor="middle" fill="#F4F1EA" fontSize="9.5" fontFamily="DM Mono, monospace">
          VECTOR DB
        </text>
        <line x1="296" y1="90" x2="366" y2="90" stroke="#E5C99B" strokeWidth="2.2" />
        <rect
          x="366"
          y="46"
          width="118"
          height="88"
          rx="14"
          fill="rgba(229,201,155,0.1)"
          stroke="#E5C99B"
          strokeWidth="1.6"
        />
        <path
          d="M384 112 L408 86 L432 94 L466 64"
          fill="none"
          stroke="#E5C99B"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        <text x="425" y="125" textAnchor="middle" fill="#F5DFB8" fontSize="9" fontFamily="DM Mono, monospace">
          ROI MATRIX
        </text>
      </svg>
    </div>
  )
}

export default function PlanetStandalonePage({
  planetId,
  copy,
  paperPreviewCopy,
  onBackToGalaxy,
  onSwitchPlanet,
  onOpenPaper,
  onOpenCertificate,
}) {
  const [marsPillarIdx, setMarsPillarIdx] = useState(0)
  const [jupiterEpochIdx, setJupiterEpochIdx] = useState(0)
  const [saturnWing, setSaturnWing] = useState('papers')
  const [vaultFilter, setVaultFilter] = useState('all')
  const [plutoSlot, setPlutoSlot] = useState('app')
  const [activeGameIdx, setActiveGameIdx] = useState(0)

  const currentIdx = GALACTIC_DESTINATIONS.findIndex((d) => d.id === planetId)
  const nextDest =
    GALACTIC_DESTINATIONS[(currentIdx + 1) % GALACTIC_DESTINATIONS.length] ||
    GALACTIC_DESTINATIONS[0]
  const nextCopy = copy.destinations?.[nextDest.id]

  const certificates = useMemo(
    () =>
      copy.research.certificateItems.map((item, index) => ({
        ...certificateAssets[index],
        ...item,
        issuer: item.meta,
      })),
    [copy.research.certificateItems],
  )

  const filteredCertificates = useMemo(() => {
    if (vaultFilter === 'all') return certificates
    return certificates.filter((item) => item.group === vaultFilter)
  }, [certificates, vaultFilter])

  const nengwanShelf = useMemo(
    () =>
      (copy.builds.app?.games || []).map((g, idx) => ({
        ...nengwanGamesAssets[idx],
        ...g,
      })),
    [copy.builds.app?.games],
  )

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onBackToGalaxy()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onBackToGalaxy])

  return (
    <section className={`planet-page planet-page--${planetId}`} key={planetId}>
      {/* Ambient Planetary Horizon Limb & Atmospheric Grid */}
      <div className="planet-page__horizon" aria-hidden="true" />
      <div className="planet-page__grid" aria-hidden="true" />

      {/* Top Planetary Command Bar */}
      <header className="planet-topbar">
        <button type="button" className="planet-back-btn" onClick={onBackToGalaxy}>
          <ArrowLeft size={15} />
          <span>{copy.galaxyHud.backToGalaxy}</span>
        </button>

        <span className="planet-eyebrow" style={{ margin: 0 }}>
          {GALACTIC_DESTINATIONS[currentIdx]?.code}
        </span>

        <button
          type="button"
          className="planet-next-btn"
          onClick={() => onSwitchPlanet(nextDest.id)}
        >
          <span>
            {copy.galaxyHud.nextPlanetPrefix}
            {nextCopy?.planetName}
          </span>
          <ArrowRight size={14} />
        </button>
      </header>

      {/* ====================================================================
          01 · MARS STANDALONE PAGE — MARTIAN COMMAND DECK (SELF-PORTRAIT)
          ==================================================================== */}
      {planetId === 'mars' && (
        <div className="planet-body mars-layout">
          <div className="mars-passport-col" data-cursor="FLIP">
            <TiltedCard
              containerHeight="430px"
              containerWidth="100%"
              imageHeight="430px"
              imageWidth="100%"
              rotateAmplitude={11}
              scaleOnHover={1.02}
              glare={0.55}
              glareColor="#EB7A52"
              radius={24}
              floating
              flipOnClick
              showTooltip={false}
            >
              <div className="dossier-face dossier-face--front mars-dossier">
                <div className="dossier-orbit dossier-orbit--outer" aria-hidden="true" />
                <TiltedCardLayer depth={18} className="dossier-layer">
                  <div className="dossier-face__top">
                    <span className="dossier-chip">{copy.about.cardFront.badge}</span>
                    <span className="dossier-serial">1.52 AU · MARS</span>
                  </div>
                  <div className="dossier-monogram" aria-hidden="true">
                    92
                  </div>
                  <div className="dossier-identity">
                    <h3>{copy.about.cardFront.title}</h3>
                    <p className="dossier-identity__sub">{copy.about.cardFront.subtitle}</p>
                    <div className="dossier-divider" />
                    <p className="dossier-identity__school">{copy.about.cardFront.school}</p>
                    <span className="dossier-identity__degree">{copy.about.cardFront.degree}</span>
                  </div>
                  <div className="dossier-face__foot">
                    <span>{copy.about.cardFront.flipHint}</span>
                  </div>
                </TiltedCardLayer>
              </div>
            </TiltedCard>
          </div>

          <div className="mars-console-col">
            <span className="planet-eyebrow">{copy.about.label}</span>
            <h1 className="planet-h1">{copy.about.headline}</h1>
            <p className="planet-lead">{copy.about.lead}</p>

            <div className="mars-pillars-tabs">
              {copy.about.curios.map((c, idx) => (
                <button
                  key={c.code}
                  type="button"
                  className={`mars-pillar-tab${idx === marsPillarIdx ? ' is-active' : ''}`}
                  onClick={() => setMarsPillarIdx(idx)}
                >
                  <small>{c.code}</small>
                  <strong>{c.title}</strong>
                </button>
              ))}
            </div>

            <div className="mars-pillar-detail" key={copy.about.curios[marsPillarIdx]?.code}>
              <div className="mars-pillar-detail__head">
                <span>{copy.about.curios[marsPillarIdx]?.code}</span>
                <Languages size={14} />
              </div>
              <h3>{copy.about.curios[marsPillarIdx]?.title}</h3>
              <p>{copy.about.curios[marsPillarIdx]?.detail}</p>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          02 · JUPITER STANDALONE PAGE — HORIZONTAL JOVIAN CHRONO-ASTROLABE
          ==================================================================== */}
      {planetId === 'jupiter' && (
        <div className="planet-body jupiter-layout">
          <div className="jupiter-header">
            <span className="planet-eyebrow">{copy.odyssey.label}</span>
            <h1 className="planet-h1">{copy.odyssey.headline}</h1>
          </div>

          {/* Horizontal Astrolabe Epoch Rail */}
          <div className="jupiter-dial-rail" role="tablist">
            <div className="jupiter-dial-line" aria-hidden="true" />
            {copy.odyssey.stops.map((stop, idx) => (
              <button
                key={stop.id}
                type="button"
                role="tab"
                aria-selected={idx === jupiterEpochIdx}
                className={`jupiter-epoch-node${idx === jupiterEpochIdx ? ' is-active' : ''}`}
                onClick={() => setJupiterEpochIdx(idx)}
              >
                <span className="jupiter-epoch-node__orb" />
                <strong>{stop.year}</strong>
                <small>{stop.planet}</small>
              </button>
            ))}
          </div>

          {/* Central Observatory Epoch Plate */}
          {copy.odyssey.stops[jupiterEpochIdx] && (
            <article className="jupiter-epoch-stage" key={copy.odyssey.stops[jupiterEpochIdx].id}>
              <div className="jupiter-epoch-stage__meta">
                <span className="jupiter-epoch-stage__idx">
                  EPOCH 0{jupiterEpochIdx + 1} / 0{copy.odyssey.stops.length}
                </span>
                <span className="jupiter-epoch-stage__place">
                  {copy.odyssey.stops[jupiterEpochIdx].place}
                </span>
              </div>

              <h2>{copy.odyssey.stops[jupiterEpochIdx].title}</h2>
              <p>{copy.odyssey.stops[jupiterEpochIdx].body}</p>

              <div className="jupiter-epoch-stage__foot">
                <div className="jupiter-artifact">
                  <Sparkles size={14} />
                  <span>{copy.odyssey.stops[jupiterEpochIdx].artifact}</span>
                </div>

                <div className="jupiter-nav-btns">
                  <button
                    type="button"
                    className="studio-btn studio-btn--glass"
                    onClick={() =>
                      setJupiterEpochIdx(
                        (p) => (p - 1 + copy.odyssey.stops.length) % copy.odyssey.stops.length,
                      )
                    }
                  >
                    <ArrowLeft size={14} />
                    <span>{copy.odyssey.prevBtn}</span>
                  </button>
                  <button
                    type="button"
                    className="studio-btn studio-btn--primary"
                    onClick={() =>
                      setJupiterEpochIdx((p) => (p + 1) % copy.odyssey.stops.length)
                    }
                  >
                    <span>{copy.odyssey.nextBtn}</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </article>
          )}
        </div>
      )}

      {/* ====================================================================
          03 · SATURN STANDALONE PAGE — CASSINI ROYAL ARCHIVE (RESEARCH & MEDALS)
          ==================================================================== */}
      {planetId === 'saturn' && (
        <div className="planet-body saturn-layout">
          <div className="saturn-head-bar">
            <div>
              <span className="planet-eyebrow">{copy.research.label}</span>
              <h1 className="planet-h1">{copy.research.headline}</h1>
            </div>

            <div className="saturn-wing-switcher" role="tablist">
              <button
                type="button"
                className={saturnWing === 'papers' ? 'is-active' : ''}
                onClick={() => setSaturnWing('papers')}
              >
                <FileText size={14} />
                <span>{copy.galaxyHud.saturnTabPapers}</span>
              </button>
              <button
                type="button"
                className={saturnWing === 'honours' ? 'is-active' : ''}
                onClick={() => setSaturnWing('honours')}
              >
                <Award size={14} />
                <span>{copy.galaxyHud.saturnTabHonours}</span>
              </button>
            </div>
          </div>

          {saturnWing === 'papers' ? (
            <div className="saturn-papers-grid">
              {copy.research.papers.map((paper) => (
                <SpotlightCard
                  key={paper.id}
                  className="paper-folio"
                  spotlightColor="#8AB4F8"
                  spotlightSize={360}
                  intensity={0.14}
                >
                  <div className="paper-folio__head">
                    <span className="paper-folio__badge">{paper.badge}</span>
                    <time className="paper-folio__year">{paper.year}</time>
                  </div>

                  {paper.id === 'action-bias' ? <ActionBiasDiagram /> : <ArimaDiagram />}

                  <div className="paper-folio__body">
                    <h3 className="paper-folio__title">{paper.title}</h3>
                    <p className="paper-folio__subtitle">{paper.subtitle}</p>
                  </div>

                  <div className="paper-folio__foot">
                    <div className="work-tags work-tags--ice">
                      {paper.tags.map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </div>

                    <button
                      type="button"
                      className="paper-folio__cta"
                      onClick={() => onOpenPaper(paperPreviewCopy[paper.paperKey])}
                    >
                      <FileText size={14} />
                      <span>{paper.cta}</span>
                      <ArrowUpRight size={14} />
                    </button>
                  </div>
                </SpotlightCard>
              ))}
            </div>
          ) : (
            <div className="saturn-honours-wing">
              <div className="vault-filters" role="tablist">
                {copy.research.filters.map((f) => (
                  <button
                    key={f.key}
                    type="button"
                    className={`vault-filter-pill${vaultFilter === f.key ? ' is-active' : ''}`}
                    onClick={() => setVaultFilter(f.key)}
                  >
                    <span>{f.label}</span>
                  </button>
                ))}
              </div>

              <div className="saturn-medals-grid">
                {filteredCertificates.map((cert) => (
                  <button
                    key={cert.id}
                    type="button"
                    className="saturn-medal-card"
                    onClick={(event) => {
                      const thumb =
                        event.currentTarget.querySelector('.saturn-medal-card__thumb') ||
                        event.currentTarget
                      const rect = thumb.getBoundingClientRect()
                      onOpenCertificate({
                        ...cert,
                        sourceElement: thumb,
                        sourceRect: {
                          top: rect.top,
                          left: rect.left,
                          width: rect.width,
                          height: rect.height,
                        },
                      })
                    }}
                  >
                    <div className="saturn-medal-card__thumb">
                      <img src={cert.image} alt={cert.title} loading="lazy" />
                      <span className="saturn-medal-card__eye">
                        <Eye size={12} />
                      </span>
                    </div>
                    <div className="saturn-medal-card__info">
                      <strong>{cert.title}</strong>
                      <small>{cert.meta}</small>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ====================================================================
          04 · PLUTO STANDALONE PAGE — KUIPER HOLOGRAPHIC AI WORKBENCH
          ==================================================================== */}
      {planetId === 'pluto' && (
        <div className="planet-body pluto-layout">
          <aside className="pluto-rail">
            <span className="planet-eyebrow">{copy.builds.label}</span>
            <h1 className="pluto-rail__title">{copy.builds.headline}</h1>

            <div className="pluto-slot-list">
              <button
                type="button"
                className={`pluto-slot-btn${plutoSlot === 'app' ? ' is-active' : ''}`}
                onClick={() => setPlutoSlot('app')}
              >
                <Gamepad2 size={16} />
                <span>{copy.galaxyHud.plutoSlotApp}</span>
              </button>
              <button
                type="button"
                className={`pluto-slot-btn${plutoSlot === 'agent' ? ' is-active' : ''}`}
                onClick={() => setPlutoSlot('agent')}
              >
                <Cpu size={16} />
                <span>{copy.galaxyHud.plutoSlotAgent}</span>
              </button>
              <button
                type="button"
                className={`pluto-slot-btn${plutoSlot === 'rag' ? ' is-active' : ''}`}
                onClick={() => setPlutoSlot('rag')}
              >
                <Database size={16} />
                <span>{copy.galaxyHud.plutoSlotRag}</span>
              </button>
            </div>
          </aside>

          <div className="pluto-stage">
            {plutoSlot === 'app' && (
              <div className="pluto-app-panel">
                <div className="pluto-app-panel__top">
                  <div className="nengwan-brand">
                    <img
                      src="/projects/nengwan/icon.png"
                      alt={copy.builds.appTitle}
                      className="nengwan-brand__icon"
                    />
                    <div>
                      <span className="nengwan-brand__eyebrow">{copy.builds.appBadge}</span>
                      <div className="nengwan-titles">
                        <h3>{copy.builds.appTitle}</h3>
                        <span>{copy.builds.appEnTitle}</span>
                      </div>
                    </div>
                  </div>

                  <div className="work-actions">
                    <GlareHover borderRadius="999px" glareColor="#ffffff" glareOpacity={0.35}>
                      <a
                        href={copy.builds.app?.primaryHref}
                        target="_blank"
                        rel="noreferrer"
                        className="studio-btn studio-btn--primary"
                      >
                        <Gamepad2 size={15} />
                        <span>{copy.builds.app?.primaryCta}</span>
                        <ArrowUpRight size={14} />
                      </a>
                    </GlareHover>
                    <a
                      href={copy.builds.app?.secondaryHref}
                      target="_blank"
                      rel="noreferrer"
                      className="studio-btn studio-btn--glass"
                    >
                      <span>{copy.builds.app?.secondaryCta}</span>
                      <ArrowUpRight size={14} />
                    </a>
                    <a
                      href={copy.builds.app?.testflightHref}
                      target="_blank"
                      rel="noreferrer"
                      className="studio-btn studio-btn--subtle"
                    >
                      <span>{copy.builds.app?.testflightCta}</span>
                    </a>
                  </div>
                </div>

                <p className="pluto-app-lead">{copy.builds.appLead}</p>

                <div className="nengwan-shelf__cards">
                  {nengwanShelf.map((game, idx) => (
                    <button
                      key={game.id || game.title}
                      type="button"
                      className={`nengwan-game-card${idx === activeGameIdx ? ' is-focused' : ''}`}
                      onClick={() => setActiveGameIdx(idx)}
                      onPointerEnter={() => setActiveGameIdx(idx)}
                    >
                      <div className="nengwan-game-card__art">
                        <img src={game.image} alt={game.title} loading="lazy" />
                      </div>
                      <div className="nengwan-game-card__meta">
                        <strong>{game.title}</strong>
                        <span>{game.caption}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {plutoSlot === 'agent' && copy.builds.aiSystems?.[0] && (
              <div className="pluto-ai-panel">
                <span className="pluto-ai-badge">{copy.builds.aiSystems[0].badge}</span>
                <h2>{copy.builds.aiSystems[0].title}</h2>
                <AgentFlowVisual />
                <p>{copy.builds.aiSystems[0].body}</p>
                <div className="work-tags">
                  {copy.builds.aiSystems[0].tags.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
              </div>
            )}

            {plutoSlot === 'rag' && copy.builds.aiSystems?.[1] && (
              <div className="pluto-ai-panel">
                <span className="pluto-ai-badge">{copy.builds.aiSystems[1].badge}</span>
                <h2>{copy.builds.aiSystems[1].title}</h2>
                <VectorRagVisual />
                <p>{copy.builds.aiSystems[1].body}</p>
                <div className="work-tags">
                  {copy.builds.aiSystems[1].tags.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
