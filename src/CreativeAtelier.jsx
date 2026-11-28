import { useMemo, useState } from 'react'
import { ArrowUpRight, Cpu, Database, Gamepad2 } from 'lucide-react'
import GlareHover from './components/GlareHover'
import SpotlightCard from './components/SpotlightCard'
import { nengwanGamesAssets } from './data/portfolioCopy'
import './CreativeAtelier.css'

function AgentHarnessDiagram() {
  return (
    <div className="ai-arch-diagram" aria-hidden="true">
      <svg viewBox="0 0 420 124" className="ai-arch-svg">
        <defs>
          <linearGradient id="agentBeam" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#8AB4F8" />
            <stop offset="50%" stopColor="#E5C99B" />
            <stop offset="100%" stopColor="#A6BC65" />
          </linearGradient>
        </defs>
        <path
          d="M72 62 C126 24, 158 24, 210 62 C262 100, 294 100, 348 62"
          fill="none"
          stroke="url(#agentBeam)"
          strokeWidth="2"
          strokeDasharray="4 4"
        />
        <path
          d="M72 62 L210 62 L348 62"
          fill="none"
          stroke="rgba(244,241,234,0.22)"
          strokeWidth="1.4"
        />
        {[
          { x: 72, label: 'RADAR', sub: 'Signal Ingestion', c: '#8AB4F8' },
          { x: 210, label: 'HARNESS', sub: 'Multi-Agent Planner', c: '#E5C99B' },
          { x: 348, label: 'SANDBOX', sub: 'Interactive Output', c: '#A6BC65' },
        ].map((n) => (
          <g key={n.label} transform={`translate(${n.x}, 62)`}>
            <circle r="24" fill="rgba(10,14,24,0.92)" stroke={n.c} strokeWidth="1.6" />
            <circle r="4" fill={n.c} cy="-8" />
            <text y="6" textAnchor="middle" fill="#F4F1EA" fontSize="8.5" fontFamily="DM Mono, monospace">
              {n.label}
            </text>
            <text y="40" textAnchor="middle" fill="rgba(244,241,234,0.52)" fontSize="8.5">
              {n.sub}
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}

function SpatialRagDiagram() {
  return (
    <div className="ai-arch-diagram" aria-hidden="true">
      <svg viewBox="0 0 420 124" className="ai-arch-svg">
        {[0, 1, 2, 3].map((idx) => (
          <g key={idx}>
            <rect
              x={34}
              y={22 + idx * 22}
              width={68}
              height={14}
              rx={4}
              fill="rgba(138,180,248,0.12)"
              stroke="rgba(138,180,248,0.38)"
            />
            <line
              x1={102}
              y1={29 + idx * 22}
              x2={188}
              y2={62}
              stroke="rgba(138,180,248,0.28)"
              strokeWidth="1.2"
            />
          </g>
        ))}
        <circle cx="206" cy="62" r="24" fill="rgba(12,17,28,0.95)" stroke="#8AB4F8" strokeWidth="1.8" />
        <text x="206" y="65" textAnchor="middle" fill="#C7DCFF" fontSize="9" fontFamily="DM Mono, monospace">
          VECTOR
        </text>
        <line x1="230" y1="62" x2="294" y2="62" stroke="#E5C99B" strokeWidth="2" />
        <rect
          x="294"
          y="34"
          width="92"
          height="56"
          rx="10"
          fill="rgba(229,201,155,0.1)"
          stroke="rgba(229,201,155,0.48)"
        />
        <path
          d="M308 74 L328 58 L346 64 L372 46"
          fill="none"
          stroke="#E5C99B"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  )
}

export default function CreativeAtelier({ copy }) {
  const [activeGameIdx, setActiveGameIdx] = useState(0)

  const nengwanShelf = useMemo(
    () =>
      (copy?.app?.games || []).map((g, idx) => ({
        ...nengwanGamesAssets[idx],
        ...g,
      })),
    [copy?.app?.games],
  )

  const aiSystems = copy?.aiSystems || []

  return (
    <div className="atelier-works">
      {/* PART I — AI SYSTEMS & AGENTIC ARCHITECTURES */}
      <div className="ai-systems-grid">
        {aiSystems.map((sys, idx) => (
          <SpotlightCard
            key={sys.title}
            className="ai-system-card reveal-up"
            spotlightColor={idx === 0 ? '#E5C99B' : '#8AB4F8'}
            spotlightSize={340}
            intensity={0.14}
            borderGlow={0.8}
          >
            <div className="ai-system-card__top">
              <span className="ai-system-card__badge">
                {idx === 0 ? <Cpu size={13} /> : <Database size={13} />}
                <span>{sys.badge}</span>
              </span>
            </div>

            {idx === 0 ? <AgentHarnessDiagram /> : <SpatialRagDiagram />}

            <h3 className="ai-system-card__title">{sys.title}</h3>
            <p className="ai-system-card__body">{sys.body}</p>

            <div className="work-tags">
              {sys.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </SpotlightCard>
        ))}
      </div>

      {/* PART II — AI-ASSISTED SHIPPED PRODUCT: 没网也能玩 / Plays Offline */}
      <SpotlightCard
        className="nengwan-showcase reveal-up"
        spotlightColor="#E5C99B"
        spotlightSize={460}
        intensity={0.14}
        borderGlow={0.85}
      >
        <div className="nengwan-showcase__copy">
          <div className="nengwan-brand">
            <img
              src="/projects/nengwan/icon.png"
              alt={copy.appTitle || 'Plays Offline'}
              className="nengwan-brand__icon"
            />
            <span className="nengwan-brand__eyebrow">{copy.appBadge}</span>
          </div>

          <div className="nengwan-titles">
            <h3>{copy.appTitle}</h3>
            <span>{copy.appEnTitle}</span>
          </div>

          <p className="nengwan-lead">{copy.appLead}</p>

          <div className="work-tags">
            {(copy.appTags || []).map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>

          <div className="work-actions">
            <GlareHover borderRadius="999px" glareColor="#ffffff" glareOpacity={0.38} glareSize={36}>
              <a
                href={copy.app?.primaryHref}
                target="_blank"
                rel="noreferrer"
                className="studio-btn studio-btn--primary"
                data-cursor="PLAY"
              >
                <Gamepad2 size={16} />
                <span>{copy.app?.primaryCta}</span>
                <ArrowUpRight size={15} />
              </a>
            </GlareHover>

            <a
              href={copy.app?.secondaryHref}
              target="_blank"
              rel="noreferrer"
              className="studio-btn studio-btn--glass"
              data-cursor="STORE"
            >
              <span>{copy.app?.secondaryCta}</span>
              <ArrowUpRight size={14} />
            </a>

            <a
              href={copy.app?.testflightHref}
              target="_blank"
              rel="noreferrer"
              className="studio-btn studio-btn--subtle"
            >
              <span>{copy.app?.testflightCta}</span>
              <ArrowUpRight size={13} />
            </a>
          </div>
        </div>

        <div className="nengwan-shelf" role="region" aria-label={copy.appTitle}>
          <div className="nengwan-shelf__cards">
            {nengwanShelf.map((game, idx) => (
              <button
                key={game.id || game.title}
                type="button"
                className={`nengwan-game-card${idx === activeGameIdx ? ' is-focused' : ''}`}
                onClick={() => setActiveGameIdx(idx)}
                onPointerEnter={() => setActiveGameIdx(idx)}
                data-cursor="SELECT"
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
      </SpotlightCard>
    </div>
  )
}
