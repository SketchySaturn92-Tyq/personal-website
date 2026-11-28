import { useEffect, useRef } from 'react'
import * as THREE from 'three'

/**
 * Procedural planet surface textures painted on HTML5 Canvas for:
 * - Earth (Low Orbit departure)
 * - Mars (Red rust canyons & polar cap)
 * - Jupiter (Banded ochre-amber storms)
 * - Saturn (Warm champagne-gold bands + multi-ring alpha texture)
 * - Pluto (Icy nitrogen-slate surface + iconic Tombaugh Regio heart glacier!)
 */
function createPlanetTexture(kind) {
  const w = 512
  const h = 256
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')

  if (kind === 'earth') {
    const g = ctx.createLinearGradient(0, 0, 0, h)
    g.addColorStop(0, '#cfe4ff')
    g.addColorStop(0.18, '#1b4a8a')
    g.addColorStop(0.5, '#12366e')
    g.addColorStop(0.82, '#1c4d8c')
    g.addColorStop(1, '#d8e9ff')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, w, h)

    // Continents & swirling clouds
    ctx.fillStyle = 'rgba(92, 152, 118, 0.55)'
    ;[[90, 95, 75, 42], [240, 82, 95, 58], [380, 110, 68, 45]].forEach(([x, y, rx, ry]) => {
      ctx.beginPath()
      ctx.ellipse(x, y, rx, ry, 0.3, 0, Math.PI * 2)
      ctx.fill()
    })
    ctx.fillStyle = 'rgba(255, 255, 255, 0.36)'
    for (let i = 0; i < 14; i += 1) {
      ctx.beginPath()
      ctx.ellipse((i * 47) % w, 35 + ((i * 29) % (h - 70)), 52, 8, -0.15, 0, Math.PI * 2)
      ctx.fill()
    }
  } else if (kind === 'mars') {
    const g = ctx.createLinearGradient(0, 0, 0, h)
    g.addColorStop(0, '#f2e4d8')
    g.addColorStop(0.1, '#c9623d')
    g.addColorStop(0.5, '#a84426')
    g.addColorStop(0.88, '#8c351d')
    g.addColorStop(1, '#eeddd0')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, w, h)

    // Dark basaltic plains & Valles Marineris canyon
    ctx.fillStyle = 'rgba(62, 22, 15, 0.42)'
    ;[[140, 130, 85, 24], [330, 112, 95, 34], [240, 165, 60, 20]].forEach(([x, y, rx, ry]) => {
      ctx.beginPath()
      ctx.ellipse(x, y, rx, ry, -0.18, 0, Math.PI * 2)
      ctx.fill()
    })
  } else if (kind === 'jupiter') {
    const bands = [
      '#9c7d60',
      '#e2cdb0',
      '#b87a52',
      '#ecdcc4',
      '#a86844',
      '#d9c1a0',
      '#8f6f56',
    ]
    bands.forEach((col, idx) => {
      ctx.fillStyle = col
      ctx.fillRect(0, (h / bands.length) * idx, w, h / bands.length + 2)
    })
    // Great Red Spot
    ctx.fillStyle = '#c45b3b'
    ctx.beginPath()
    ctx.ellipse(310, 154, 34, 18, 0, 0, Math.PI * 2)
    ctx.fill()
  } else if (kind === 'saturn') {
    const g = ctx.createLinearGradient(0, 0, 0, h)
    g.addColorStop(0, '#bfa278')
    g.addColorStop(0.22, '#ebd5b0')
    g.addColorStop(0.48, '#f6e7cb')
    g.addColorStop(0.68, '#dcc094')
    g.addColorStop(1, '#a88c64')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, w, h)

    ctx.fillStyle = 'rgba(130, 96, 58, 0.18)'
    for (let y = 24; y < h; y += 22) {
      ctx.fillRect(0, y, w, 7)
    }
  } else if (kind === 'pluto') {
    const g = ctx.createLinearGradient(0, 0, 0, h)
    g.addColorStop(0, '#b9c6d8')
    g.addColorStop(0.38, '#8d99ad')
    g.addColorStop(0.7, '#5c667a')
    g.addColorStop(1, '#9aa8bc')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, w, h)

    // Iconic bright nitrogen-ice Tombaugh Regio heart glacier!
    ctx.fillStyle = 'rgba(240, 244, 252, 0.78)'
    ctx.beginPath()
    ctx.ellipse(242, 128, 44, 34, -0.35, 0, Math.PI * 2)
    ctx.ellipse(282, 128, 42, 34, 0.35, 0, Math.PI * 2)
    ctx.fill()
  }

  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

function createSaturnRingTexture() {
  const size = 512
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')

  const cx = size * 0.5
  const cy = size * 0.5
  const grad = ctx.createRadialGradient(cx, cy, size * 0.2, cx, cy, size * 0.5)
  grad.addColorStop(0, 'rgba(229, 201, 155, 0)')
  grad.addColorStop(0.14, 'rgba(229, 201, 155, 0.35)')
  grad.addColorStop(0.38, 'rgba(246, 232, 205, 0.85)')
  grad.addColorStop(0.56, 'rgba(15, 18, 28, 0.12)') // Cassini Division gap!
  grad.addColorStop(0.64, 'rgba(229, 201, 155, 0.72)')
  grad.addColorStop(0.88, 'rgba(168, 198, 250, 0.38)')
  grad.addColorStop(1, 'rgba(168, 198, 250, 0)')

  ctx.fillStyle = grad
  ctx.fillRect(0, 0, size, size)

  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

/**
 * Persistent Full-Viewport 3D Deep-Space Star-Orbit & Multi-Planet Voyage Backdrop.
 * Driven smoothly by page scroll: flies along golden-ice orbital trajectories past
 * Earth/Moon -> Mars -> Jupiter -> Ringed Saturn -> Icy Pluto!
 */
export default function SpaceVoyageBackdrop({ scrollProgress = 0 }) {
  const wrapRef = useRef(null)
  const targetScrollRef = useRef(scrollProgress)
  targetScrollRef.current = scrollProgress

  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return undefined

    let width = window.innerWidth
    let height = window.innerHeight
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    let renderer
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance',
      })
    } catch {
      return undefined
    }

    renderer.setPixelRatio(dpr)
    renderer.setSize(width, height)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.08
    wrap.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    scene.background = new THREE.Color('#05070e')
    scene.fog = new THREE.FogExp2('#05070e', 0.014)

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 220)

    const disposables = []
    const reg = (item) => {
      disposables.push(item)
      return item
    }

    // Cosmic Sun & Cool Nebula Fill Lighting
    const hemi = new THREE.HemisphereLight('#b9d2ff', '#101322', 0.85)
    scene.add(hemi)

    const sunLight = new THREE.DirectionalLight('#fff0d4', 2.4)
    sunLight.position.set(18, 14, 16)
    scene.add(sunLight)

    const rimLight = new THREE.DirectionalLight('#7aa8f8', 0.9)
    rimLight.position.set(-16, -6, -12)
    scene.add(rimLight)

    // -------------------------------------------------------------------------
    // 1. DEEP-SPACE MULTI-TEMPERATURE STARFIELD
    // -------------------------------------------------------------------------
    const starCount = 1500
    const starPos = new Float32Array(starCount * 3)
    const starColors = new Float32Array(starCount * 3)
    const palette = [
      new THREE.Color('#f7efe2'),
      new THREE.Color('#a8c7fa'),
      new THREE.Color('#e5c99b'),
      new THREE.Color('#c8b8f8'),
    ]

    for (let i = 0; i < starCount; i += 1) {
      starPos[i * 3] = (Math.random() - 0.5) * 120
      starPos[i * 3 + 1] = (Math.random() - 0.5) * 75
      starPos[i * 3 + 2] = 16 - Math.random() * 145
      const c = palette[i % palette.length]
      starColors[i * 3] = c.r
      starColors[i * 3 + 1] = c.g
      starColors[i * 3 + 2] = c.b
    }

    const starGeo = reg(new THREE.BufferGeometry())
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3))
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3))
    const starMat = reg(
      new THREE.PointsMaterial({
        size: 0.16,
        vertexColors: true,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    )
    const stars = new THREE.Points(starGeo, starMat)
    scene.add(stars)

    // -------------------------------------------------------------------------
    // 2. GRAND INTERPLANETARY ORBITAL FLIGHT CURVE & KEPLERIAN STAR-ORBIT RINGS
    // -------------------------------------------------------------------------
    const flightWaypoints = [
      new THREE.Vector3(0, 0.4, 8), // #top: Low Earth Orbit departure
      new THREE.Vector3(-1.8, 0.2, -16), // #about: Mars Flyby
      new THREE.Vector3(1.6, -0.3, -40), // #direction: Jupiter & Solar Orrery
      new THREE.Vector3(-2.1, 0.5, -66), // #research: Majestic Ringed Saturn
      new THREE.Vector3(1.5, -0.2, -90), // #builds: Icy Pluto & Charon
      new THREE.Vector3(0, 0.2, -108), // #ending: Deep Space Horizon
    ]
    const flightCurve = new THREE.CatmullRomCurve3(flightWaypoints)

    // Luminous Golden Star-Orbit Trajectory Line winding through space
    const curvePts = flightCurve.getPoints(260)
    const curveGeo = reg(new THREE.BufferGeometry().setFromPoints(curvePts))
    const curveMat = reg(
      new THREE.LineBasicMaterial({
        color: '#e5c99b',
        transparent: true,
        opacity: 0.34,
      }),
    )
    const trajectoryLine = new THREE.Line(curveGeo, curveMat)
    scene.add(trajectoryLine)

    // Parallel Celestial-Ice Companion Orbit Line
    const offsetPts = curvePts.map(
      (pt, i) =>
        new THREE.Vector3(
          pt.x + Math.cos(i * 0.08) * 1.4,
          pt.y + Math.sin(i * 0.08) * 0.7,
          pt.z,
        ),
    )
    const offsetGeo = reg(new THREE.BufferGeometry().setFromPoints(offsetPts))
    const offsetMat = reg(
      new THREE.LineBasicMaterial({
        color: '#8ab4f8',
        transparent: true,
        opacity: 0.2,
      }),
    )
    scene.add(new THREE.Line(offsetGeo, offsetMat))

    // Ambient Astrolabe / Solar-System Keplerian Elliptical Orbit Rings along Z
    const ringMatGold = reg(
      new THREE.MeshBasicMaterial({
        color: '#e5c99b',
        transparent: true,
        opacity: 0.09,
      }),
    )
    const ringMatIce = reg(
      new THREE.MeshBasicMaterial({
        color: '#8ab4f8',
        transparent: true,
        opacity: 0.08,
      }),
    )
    ;[-6, -24, -44, -68, -92].forEach((zPos, i) => {
      const rg = reg(new THREE.TorusGeometry(9 + (i % 3) * 3.5, 0.025, 8, 96))
      const rm = new THREE.Mesh(rg, i % 2 === 0 ? ringMatGold : ringMatIce)
      rm.position.set(0, 0, zPos)
      rm.rotation.x = 1.18 + (i % 2) * 0.22
      rm.rotation.y = (i - 2) * 0.18
      scene.add(rm)
    })

    // -------------------------------------------------------------------------
    // 3. FIVE SCULPTED 3D PLANETS STATIONED AT EACH CHAPTER
    // -------------------------------------------------------------------------
    const planets = []
    const makePlanet = ({ kind, radius, pos, haloColor, hasRings = false, hasMoon = false }) => {
      const holder = new THREE.Group()
      holder.position.copy(pos)

      const tex = reg(createPlanetTexture(kind))
      const geo = reg(new THREE.SphereGeometry(radius, 48, 36))
      const mat = reg(
        new THREE.MeshStandardMaterial({
          map: tex,
          roughness: 0.76,
          metalness: 0.06,
        }),
      )
      const mesh = new THREE.Mesh(geo, mat)
      holder.add(mesh)

      // Soft Atmospheric Glow Shell
      const haloGeo = reg(new THREE.SphereGeometry(radius * 1.13, 32, 24))
      const haloMat = reg(
        new THREE.MeshBasicMaterial({
          color: haloColor,
          transparent: true,
          opacity: 0.12,
          side: THREE.BackSide,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        }),
      )
      holder.add(new THREE.Mesh(haloGeo, haloMat))

      if (hasRings) {
        const rTex = reg(createSaturnRingTexture())
        const rGeo = reg(new THREE.PlaneGeometry(radius * 4.8, radius * 4.8))
        const rMat = reg(
          new THREE.MeshBasicMaterial({
            map: rTex,
            transparent: true,
            opacity: 0.92,
            side: THREE.DoubleSide,
            depthWrite: false,
          }),
        )
        const rings = new THREE.Mesh(rGeo, rMat)
        rings.rotation.x = Math.PI * 0.41
        rings.rotation.y = 0.24
        holder.add(rings)
      }

      let moonPivot = null
      if (hasMoon) {
        moonPivot = new THREE.Group()
        const mGeo = reg(new THREE.SphereGeometry(radius * 0.24, 24, 18))
        const mMat = reg(
          new THREE.MeshStandardMaterial({
            color: '#cfd6e3',
            roughness: 0.88,
          }),
        )
        const moon = new THREE.Mesh(mGeo, mMat)
        moon.position.set(radius * 1.95, radius * 0.25, 0)
        moonPivot.add(moon)
        holder.add(moonPivot)
      }

      scene.add(holder)
      planets.push({ holder, mesh, moonPivot })
    }

    // Orbit 00 (#top): Earth & Moon
    makePlanet({
      kind: 'earth',
      radius: 2.35,
      pos: new THREE.Vector3(5.2, 1.3, -1.5),
      haloColor: '#69a8ff',
      hasMoon: true,
    })

    // Orbit 01 (#about): Red Planet Mars
    makePlanet({
      kind: 'mars',
      radius: 2.1,
      pos: new THREE.Vector3(4.4, 0.8, -21.5),
      haloColor: '#e0724a',
    })

    // Orbit 02 (#direction): Banded Gas Giant Jupiter
    makePlanet({
      kind: 'jupiter',
      radius: 2.85,
      pos: new THREE.Vector3(-5.6, 1.4, -46.5),
      haloColor: '#e5c99b',
    })

    // Orbit 03 (#research): Iconic Golden-Ringed Saturn ("SketchySaturn92"!)
    makePlanet({
      kind: 'saturn',
      radius: 2.45,
      pos: new THREE.Vector3(4.8, 1.25, -72.0),
      haloColor: '#f3dfb9',
      hasRings: true,
    })

    // Orbit 04 (#builds): Icy Heart-Glacier Pluto & Charon Moon
    makePlanet({
      kind: 'pluto',
      radius: 1.85,
      pos: new THREE.Vector3(-4.4, 0.9, -95.5),
      haloColor: '#9ec4ff',
      hasMoon: true,
    })

    // -------------------------------------------------------------------------
    // 4. TRAVELLING SS-92 STAR-ARK POD CRUISING AHEAD OF CAMERA ON THE ORBIT!
    // -------------------------------------------------------------------------
    const podGroup = new THREE.Group()
    const podDiskGeo = reg(new THREE.CylinderGeometry(0.28, 0.22, 0.08, 24))
    const podGoldMat = reg(
      new THREE.MeshStandardMaterial({
        color: '#f5dfb8',
        emissive: '#e5c99b',
        emissiveIntensity: 0.55,
        metalness: 0.7,
        roughness: 0.25,
      }),
    )
    podGroup.add(new THREE.Mesh(podDiskGeo, podGoldMat))

    const podRingGeo = reg(new THREE.TorusGeometry(0.42, 0.018, 10, 36))
    const podRing = new THREE.Mesh(podRingGeo, podGoldMat)
    podRing.rotation.x = Math.PI * 0.5
    podGroup.add(podRing)

    const podGlowGeo = reg(new THREE.SphereGeometry(0.18, 16, 12))
    const podGlowMat = reg(
      new THREE.MeshBasicMaterial({
        color: '#9ec6ff',
        transparent: true,
        opacity: 0.85,
      }),
    )
    const podGlow = new THREE.Mesh(podGlowGeo, podGlowMat)
    podGlow.position.y = 0.06
    podGroup.add(podGlow)
    scene.add(podGroup)

    const handleResize = () => {
      width = window.innerWidth
      height = window.innerHeight
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }
    window.addEventListener('resize', handleResize)

    let smoothScroll = targetScrollRef.current
    let rafId = 0

    const animate = (now) => {
      const t = now * 0.001
      smoothScroll += (targetScrollRef.current - smoothScroll) * 0.055
      const clampedT = Math.max(0, Math.min(0.96, smoothScroll * 0.96))

      // Camera glides smoothly along the interplanetary orbital trajectory
      const camPt = flightCurve.getPointAt(clampedT)
      const lookPt = flightCurve.getPointAt(Math.min(0.995, clampedT + 0.055))

      camera.position.set(
        camPt.x + Math.sin(t * 0.35) * 0.22,
        camPt.y + 0.55 + Math.cos(t * 0.28) * 0.14,
        camPt.z,
      )
      camera.lookAt(lookPt.x * 0.65, lookPt.y * 0.5, lookPt.z - 6)

      // Position the miniature SS-92 Animal Star-Ark visibly cruising ahead on the golden orbit!
      const podT = Math.min(0.992, clampedT + 0.042)
      const podPt = flightCurve.getPointAt(podT)
      const podTangent = flightCurve.getTangentAt(podT)
      podGroup.position.set(
        podPt.x,
        podPt.y + Math.sin(t * 2.2) * 0.08,
        podPt.z,
      )
      podGroup.rotation.y = t * 1.4
      podGroup.rotation.z = -podTangent.x * 0.35

      // Rotate all 5 planets & binary moons gently
      planets.forEach((p, idx) => {
        p.mesh.rotation.y = t * (0.11 + idx * 0.02)
        if (p.moonPivot) {
          p.moonPivot.rotation.y = t * 0.32 + idx
        }
      })

      renderer.render(scene, camera)
      rafId = window.requestAnimationFrame(animate)
    }

    rafId = window.requestAnimationFrame(animate)

    return () => {
      window.cancelAnimationFrame(rafId)
      window.removeEventListener('resize', handleResize)
      disposables.forEach((d) => d.dispose?.())
      renderer.dispose()
      if (renderer.domElement.parentNode === wrap) {
        wrap.removeChild(renderer.domElement)
      }
    }
  }, [])

  return <div className="space-voyage-backdrop" ref={wrapRef} aria-hidden="true" />
}
