import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, Orbit, Sparkles } from 'lucide-react'
import './StarChartOdyssey.css'

// Six Planetary Stations along the SS-92 Interplanetary Transfer Orbit
const PLANET_NODES = [
  { x: 0.12, y: 0.74, code: 'EARTH · 1.00 AU', color: '#6ba8ff', r: 9, ring: false },
  { x: 0.25, y: 0.44, code: 'MOON · 384,400 KM', color: '#cfd8e8', r: 6.5, ring: false },
  { x: 0.42, y: 0.65, code: 'MARS · 1.52 AU', color: '#de6b48', r: 8.5, ring: false },
  { x: 0.58, y: 0.32, code: 'JUPITER · 5.20 AU', color: '#e2b684', r: 12, ring: false },
  { x: 0.75, y: 0.58, code: 'SATURN · 9.58 AU', color: '#ebd2a4', r: 10.5, ring: true },
  { x: 0.9, y: 0.25, code: 'PLUTO · 39.48 AU', color: '#9fc5f8', r: 7.5, ring: false },
]

function sampleCatmullRom(points, t) {
  const n = points.length - 1
  const scaled = Math.max(0, Math.min(n, t * n))
  const idx = Math.min(n - 1, Math.floor(scaled))
  const localT = scaled - idx

  const p0 = points[Math.max(0, idx - 1)]
  const p1 = points[idx]
  const p2 = points[Math.min(n, idx + 1)]
  const p3 = points[Math.min(n, idx + 2)]

  const tt = localT * localT
  const ttt = tt * localT

  const x =
    0.5 *
    (2 * p1.x +
      (-p0.x + p2.x) * localT +
      (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * tt +
      (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * ttt)

  const y =
    0.5 *
    (2 * p1.y +
      (-p0.y + p2.y) * localT +
      (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * tt +
      (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * ttt)

  return { x, y }
}

export default function StarChartOdyssey({ copy }) {
  const [activeIdx, setActiveIdx] = useState(0)
  const canvasRef = useRef(null)
  const mapWrapRef = useRef(null)
  const travelerProgressRef = useRef(0)
  const targetProgressRef = useRef(0)

  const stops = copy?.stops || []
  const activeStop = stops[activeIdx] || stops[0]
  const activePlanet = PLANET_NODES[activeIdx] || PLANET_NODES[0]

  useEffect(() => {
    targetProgressRef.current = stops.length > 1 ? activeIdx / (stops.length - 1) : 0
  }, [activeIdx, stops.length])

  useEffect(() => {
    const onKeyDown = (e) => {
      const wrap = mapWrapRef.current
      if (!wrap) return
      const rect = wrap.getBoundingClientRect()
      const inView = rect.top < window.innerHeight * 0.75 && rect.bottom > window.innerHeight * 0.25
      if (!inView) return

      if (e.key === 'ArrowRight') {
        setActiveIdx((prev) => (prev + 1) % stops.length)
      } else if (e.key === 'ArrowLeft') {
        setActiveIdx((prev) => (prev - 1 + stops.length) % stops.length)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [stops.length])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined
    const ctx = canvas.getContext('2d')
    if (!ctx) return undefined

    let width = 800
    let height = 450
    let dpr = Math.min(window.devicePixelRatio || 1, 2)

    const stars = Array.from({ length: 110 }, (_, i) => {
      const s1 = Math.sin(i * 127.1 + 311.7) * 43758.5453
      const s2 = Math.sin(i * 269.5 + 183.3) * 43758.5453
      return {
        x: s1 - Math.floor(s1),
        y: s2 - Math.floor(s2),
        r: 0.5 + (i % 3) * 0.55,
        phase: i * 0.7,
      }
    })

    const resize = () => {
      const rect = canvas.parentElement.getBoundingClientRect()
      width = Math.max(300, rect.width)
      height = Math.max(280, rect.height)
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
    }
    resize()
    window.addEventListener('resize', resize)

    let rafId = 0
    const render = (now) => {
      const t = now * 0.001
      travelerProgressRef.current +=
        (targetProgressRef.current - travelerProgressRef.current) * 0.085

      ctx.save()
      ctx.scale(dpr, dpr)
      ctx.clearRect(0, 0, width, height)

      // 1. Concentric Heliocentric Planetary Orbit Ellipses (Star-Orbit Chart)
      ctx.save()
      ctx.translate(width * 0.04, height * 0.92)
      ;[0.22, 0.38, 0.54, 0.72, 0.9, 1.08].forEach((rf, idx) => {
        ctx.strokeStyle =
          idx === 4 ? 'rgba(229, 201, 155, 0.16)' : 'rgba(138, 180, 248, 0.085)'
        ctx.lineWidth = 1
        ctx.setLineDash(idx % 2 === 1 ? [3, 6] : [])
        ctx.beginPath()
        ctx.ellipse(0, 0, width * rf, height * (rf * 0.86), -0.18, -Math.PI * 0.55, 0.2)
        ctx.stroke()
      })
      ctx.restore()

      // 2. Twinkling Starfield
      stars.forEach((st) => {
        const alpha = 0.2 + 0.3 * (0.5 + 0.5 * Math.sin(t * 1.5 + st.phase))
        ctx.fillStyle = `rgba(244, 241, 234, ${alpha.toFixed(3)})`
        ctx.beginPath()
        ctx.arc(st.x * width, st.y * height, st.r, 0, Math.PI * 2)
        ctx.fill()
      })

      // 3. Interplanetary Transfer Trajectory Spline
      const screenPts = PLANET_NODES.map((c) => ({ x: c.x * width, y: c.y * height }))
      const samples = 130

      ctx.save()
      ctx.strokeStyle = 'rgba(244, 241, 234, 0.16)'
      ctx.lineWidth = 1.4
      ctx.setLineDash([4, 6])
      ctx.beginPath()
      for (let i = 0; i <= samples; i += 1) {
        const pt = sampleCatmullRom(screenPts, i / samples)
        if (i === 0) ctx.moveTo(pt.x, pt.y)
        else ctx.lineTo(pt.x, pt.y)
      }
      ctx.stroke()
      ctx.restore()

      const curProg = travelerProgressRef.current
      const litSteps = Math.max(1, Math.round(samples * curProg))
      const routeGrad = ctx.createLinearGradient(width * 0.1, 0, width * 0.9, 0)
      routeGrad.addColorStop(0, '#6ba8ff')
      routeGrad.addColorStop(0.42, '#de6b48')
      routeGrad.addColorStop(0.75, '#e5c99b')
      routeGrad.addColorStop(1, '#9fc5f8')

      ctx.save()
      ctx.strokeStyle = routeGrad
      ctx.lineWidth = 2.6
      ctx.shadowColor = 'rgba(229, 201, 155, 0.5)'
      ctx.shadowBlur = 12
      ctx.beginPath()
      for (let i = 0; i <= litSteps; i += 1) {
        const pt = sampleCatmullRom(screenPts, (i / litSteps) * curProg)
        if (i === 0) ctx.moveTo(pt.x, pt.y)
        else ctx.lineTo(pt.x, pt.y)
      }
      ctx.stroke()
      ctx.restore()

      // 4. Stylized Planet Spheres at Each Station
      PLANET_NODES.forEach((pNode, idx) => {
        const px = pNode.x * width
        const py = pNode.y * height

        const pGlow = ctx.createRadialGradient(px, py, 1, px, py, pNode.r * 2.4)
        pGlow.addColorStop(0, `${pNode.color}55`)
        pGlow.addColorStop(1, `${pNode.color}00`)
        ctx.fillStyle = pGlow
        ctx.beginPath()
        ctx.arc(px, py, pNode.r * 2.4, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = pNode.color
        ctx.beginPath()
        ctx.arc(px, py, pNode.r, 0, Math.PI * 2)
        ctx.fill()

        // Saturn Rings on station #4!
        if (pNode.ring) {
          ctx.save()
          ctx.translate(px, py)
          ctx.rotate(-0.35)
          ctx.strokeStyle = '#f6e7c8'
          ctx.lineWidth = 2.1
          ctx.beginPath()
          ctx.ellipse(0, 0, pNode.r * 2.1, pNode.r * 0.65, 0, 0, Math.PI * 2)
          ctx.stroke()
          ctx.restore()
        }

        // Orbiting tiny moon for Earth & Pluto
        if (idx === 0 || idx === 5) {
          const ma = t * 1.4 + idx
          ctx.fillStyle = '#dce4f2'
          ctx.beginPath()
          ctx.arc(
            px + Math.cos(ma) * (pNode.r + 7),
            py + Math.sin(ma) * (pNode.r + 7) * 0.65,
            2,
            0,
            Math.PI * 2,
          )
          ctx.fill()
        }
      })

      // 5. SS-92 Animal Star-Ark Gliding Between Planets!
      const craft = sampleCatmullRom(screenPts, curProg)
      const ahead = sampleCatmullRom(screenPts, Math.min(1, curProg + 0.015))
      const heading = Math.atan2(ahead.y - craft.y, ahead.x - craft.x)

      ctx.save()
      ctx.translate(craft.x, craft.y - 16)

      const halo = ctx.createRadialGradient(0, 0, 1, 0, 0, 18)
      halo.addColorStop(0, 'rgba(255, 243, 214, 0.85)')
      halo.addColorStop(0.55, 'rgba(138, 180, 248, 0.35)')
      halo.addColorStop(1, 'rgba(138, 180, 248, 0)')
      ctx.fillStyle = halo
      ctx.beginPath()
      ctx.arc(0, 0, 18, 0, Math.PI * 2)
      ctx.fill()

      ctx.rotate(heading * 0.2)
      ctx.strokeStyle = '#f5dfb8'
      ctx.lineWidth = 1.8
      ctx.beginPath()
      ctx.ellipse(0, 0, 11, 4.2, 0, 0, Math.PI * 2)
      ctx.stroke()

      ctx.fillStyle = '#ffffff'
      ctx.beginPath()
      ctx.arc(0, -1, 4, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()

      ctx.restore()
      rafId = window.requestAnimationFrame(render)
    }

    rafId = window.requestAnimationFrame(render)
    return () => {
      window.cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <div className="odyssey-atlas" ref={mapWrapRef}>
      <div className="odyssey-map-stage">
        <canvas ref={canvasRef} className="odyssey-canvas" aria-hidden="true" />

        <div className="odyssey-map-hud-top">
          <span className="odyssey-compass">
            <Orbit size={13} />
            <span>SS-92 INTERPLANETARY STAR-ORBIT</span>
          </span>
          <span className="odyssey-lat">{activePlanet.code}</span>
        </div>

        {stops.map((stop, idx) => {
          const coord = PLANET_NODES[idx] || PLANET_NODES[0]
          const isActive = idx === activeIdx
          return (
            <button
              key={stop.id}
              type="button"
              className={`odyssey-beacon${isActive ? ' is-active' : ''}`}
              style={{
                left: `${coord.x * 100}%`,
                top: `${coord.y * 100}%`,
                '--beacon-accent': coord.color,
              }}
              onClick={() => setActiveIdx(idx)}
              aria-label={`${stop.planet} ${stop.year}`}
              data-cursor="FLY TO"
            >
              <span className="odyssey-beacon__ring" />
              <span className="odyssey-beacon__year">
                {stop.planet} · {stop.year}
              </span>
            </button>
          )
        })}

        <div className="odyssey-map-hud-bottom">
          <span>{copy?.controlsHint}</span>
        </div>
      </div>

      <article className="odyssey-journal" key={activeStop?.id}>
        <div className="odyssey-journal__top">
          <span className="odyssey-journal__step">
            STATION 0{activeIdx + 1} / 0{stops.length}
          </span>
          <span className="odyssey-journal__year">{activeStop?.year}</span>
        </div>

        <p className="odyssey-journal__place">{activeStop?.place}</p>
        <h3 className="odyssey-journal__title">{activeStop?.title}</h3>
        <p className="odyssey-journal__body">{activeStop?.body}</p>

        <div className="odyssey-journal__artifact">
          <Sparkles size={13} />
          <span>{activeStop?.artifact}</span>
        </div>

        <div className="odyssey-journal__nav">
          <button
            type="button"
            className="studio-btn studio-btn--glass"
            onClick={() => setActiveIdx((prev) => (prev - 1 + stops.length) % stops.length)}
          >
            <ArrowLeft size={14} />
            <span>{copy?.prevBtn}</span>
          </button>
          <button
            type="button"
            className="studio-btn studio-btn--primary"
            onClick={() => setActiveIdx((prev) => (prev + 1) % stops.length)}
          >
            <span>{copy?.nextBtn}</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </article>
    </div>
  )
}
