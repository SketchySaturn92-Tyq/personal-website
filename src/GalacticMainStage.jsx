import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { ArrowLeft, ArrowRight, Compass, Play, Rocket, Sparkles } from 'lucide-react'
import { createHeroSpacecraft } from './HeroSpacecraft'
import './GalacticMainStage.css'

/**
 * Strictly ordered from NEAREST to FARTHEST from Earth along the outward solar/galactic trajectory:
 * Earth Gate (0.00 AU from Earth / 1.00 AU Solar)
 *   -> 01 Mars (1.52 AU, +0.52 AU from Earth)
 *   -> 02 Jupiter (5.20 AU, +4.20 AU from Earth)
 *   -> 03 Saturn (9.58 AU, +8.58 AU from Earth)
 *   -> 04 Pluto (39.48 AU, +38.48 AU from Earth)
 *   -> 05 Wormhole Beyond Pluto -> New World Finale (Handwritten Sign-Off)
 */
export const GALACTIC_DESTINATIONS = [
  {
    id: 'mars',
    t: 0.2,
    auFromEarth: 0.52,
    code: '01 · MARS · 1.52 AU (+0.52 AU FROM EARTH)',
    planetKind: 'mars',
    radius: 2.35,
    offset: [5.0, 0.55, -2.0],
    halo: '#eb7a52',
    accent: '#eb7a52',
  },
  {
    id: 'jupiter',
    t: 0.4,
    auFromEarth: 4.2,
    code: '02 · JUPITER · 5.20 AU (+4.20 AU FROM EARTH)',
    planetKind: 'jupiter',
    radius: 3.3,
    offset: [-5.9, 0.85, -2.4],
    halo: '#e5b976',
    accent: '#e5b976',
  },
  {
    id: 'saturn',
    t: 0.6,
    auFromEarth: 8.58,
    code: '03 · SATURN · 9.58 AU (+8.58 AU FROM EARTH)',
    planetKind: 'saturn',
    radius: 2.75,
    offset: [5.7, 0.75, -2.5],
    halo: '#f5dfb8',
    accent: '#f5dfb8',
    hasRings: true,
  },
  {
    id: 'pluto',
    t: 0.8,
    auFromEarth: 38.48,
    code: '04 · PLUTO · 39.48 AU (+38.48 AU FROM EARTH)',
    planetKind: 'pluto',
    radius: 2.05,
    offset: [-4.8, 0.5, -2.2],
    halo: '#88c4ff',
    accent: '#88c4ff',
    hasMoon: true,
  },
  {
    id: 'newworld',
    t: 0.985,
    auFromEarth: 50.0,
    code: '05 · BEYOND PLUTO · WORMHOLE → NEW WORLD',
    planetKind: 'newworld',
    radius: 2.15,
    offset: [0, 0.55, -6.5],
    halo: '#7dd3fc',
    accent: '#99f6e4',
    hasRings: true,
    isWormhole: true,
  },
]

function interpolateEarthDistanceAu(t) {
  const stops = [
    [0, 0],
    [0.2, 0.52],
    [0.4, 4.2],
    [0.6, 8.58],
    [0.8, 38.48],
    [1.0, 52.0],
  ]
  for (let i = 0; i < stops.length - 1; i += 1) {
    const [t0, a0] = stops[i]
    const [t1, a1] = stops[i + 1]
    if (t <= t1) {
      const u = Math.max(0, Math.min(1, (t - t0) / (t1 - t0)))
      return a0 + (a1 - a0) * u
    }
  }
  return 52.0
}

function createPlanetSurfaceTexture(kind) {
  const w = 512
  const h = 256
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')

  if (kind === 'earth') {
    const g = ctx.createLinearGradient(0, 0, 0, h)
    g.addColorStop(0, '#eef6ff')
    g.addColorStop(0.14, '#2a6bb8')
    g.addColorStop(0.5, '#194d92')
    g.addColorStop(0.86, '#235da6')
    g.addColorStop(1, '#eef6ff')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, w, h)

    // Lush emerald-olive continents + swirling cloud wisps
    ctx.fillStyle = 'rgba(72, 152, 108, 0.85)'
    ;[
      [120, 105, 58, 34, 0.25],
      [285, 96, 78, 38, -0.2],
      [350, 156, 48, 26, 0.3],
      [180, 165, 36, 28, -0.15],
    ].forEach(([x, y, rx, ry, rot]) => {
      ctx.beginPath()
      ctx.ellipse(x, y, rx, ry, rot, 0, Math.PI * 2)
      ctx.fill()
    })
    ctx.fillStyle = 'rgba(255, 255, 255, 0.38)'
    for (let y = 38; y < h - 30; y += 36) {
      ctx.fillRect((y * 7) % 180, y, 165, 8)
    }
  } else if (kind === 'mars') {
    const g = ctx.createLinearGradient(0, 0, 0, h)
    g.addColorStop(0, '#f4e6da')
    g.addColorStop(0.1, '#d46b45')
    g.addColorStop(0.5, '#b24829')
    g.addColorStop(0.88, '#8d341c')
    g.addColorStop(1, '#f0dfd2')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, w, h)

    ctx.fillStyle = 'rgba(58, 20, 14, 0.44)'
    ;[[130, 128, 88, 24], [320, 110, 96, 34], [240, 168, 64, 20]].forEach(([x, y, rx, ry]) => {
      ctx.beginPath()
      ctx.ellipse(x, y, rx, ry, -0.18, 0, Math.PI * 2)
      ctx.fill()
    })
  } else if (kind === 'jupiter') {
    const bands = ['#9f7f60', '#e6d2b5', '#be7e54', '#efe0c8', '#aa6a44', '#dcc4a2', '#8f6e54']
    bands.forEach((col, idx) => {
      ctx.fillStyle = col
      ctx.fillRect(0, (h / bands.length) * idx, w, h / bands.length + 2)
    })
    ctx.fillStyle = '#c95c3b'
    ctx.beginPath()
    ctx.ellipse(305, 152, 36, 19, 0, 0, Math.PI * 2)
    ctx.fill()
  } else if (kind === 'saturn') {
    const g = ctx.createLinearGradient(0, 0, 0, h)
    g.addColorStop(0, '#c2a478')
    g.addColorStop(0.24, '#eed8b4')
    g.addColorStop(0.5, '#f8ead0')
    g.addColorStop(0.72, '#dec296')
    g.addColorStop(1, '#aa8d64')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, w, h)
    ctx.fillStyle = 'rgba(130, 96, 58, 0.18)'
    for (let y = 24; y < h; y += 22) ctx.fillRect(0, y, w, 7)
  } else if (kind === 'pluto') {
    const g = ctx.createLinearGradient(0, 0, 0, h)
    g.addColorStop(0, '#c4d2e4')
    g.addColorStop(0.4, '#92a2b8')
    g.addColorStop(0.74, '#5e6b82')
    g.addColorStop(1, '#a6b6cc')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, w, h)
    // Tombaugh Regio Heart Glacier
    ctx.fillStyle = 'rgba(244, 248, 255, 0.84)'
    ctx.beginPath()
    ctx.ellipse(242, 128, 44, 34, -0.35, 0, Math.PI * 2)
    ctx.ellipse(282, 128, 42, 34, 0.35, 0, Math.PI * 2)
    ctx.fill()
  } else {
    // New World Wormhole Shimmering Event-Horizon Core
    const g = ctx.createLinearGradient(0, 0, w, h)
    g.addColorStop(0, '#f5dfb8')
    g.addColorStop(0.48, '#6ee7b7')
    g.addColorStop(1, '#38bdf8')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, w, h)
  }

  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

function createRingTexture(tint = '229, 201, 155') {
  const size = 512
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  const c = size * 0.5
  const grad = ctx.createRadialGradient(c, c, size * 0.2, c, c, size * 0.5)
  grad.addColorStop(0, `rgba(${tint}, 0)`)
  grad.addColorStop(0.16, `rgba(${tint}, 0.38)`)
  grad.addColorStop(0.4, `rgba(${tint}, 0.88)`)
  grad.addColorStop(0.56, 'rgba(10, 14, 24, 0.1)')
  grad.addColorStop(0.66, `rgba(${tint}, 0.74)`)
  grad.addColorStop(0.88, 'rgba(138, 180, 248, 0.4)')
  grad.addColorStop(1, 'rgba(138, 180, 248, 0)')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, size, size)

  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

/**
 * Full-Screen (100vw x 100vh) Interactive 3D Galactic Voyage Main Stage.
 * Strictly ordered from Earth outward (Earth -> Mars -> Jupiter -> Saturn -> Pluto -> New World),
 * with scroll-up / swipe-up propelling the SS-92 Saturn Clipper forward!
 */
export default function GalacticMainStage({
  copy,
  initialProgress = 0,
  onProgressChange,
  onEnterPlanet,
  onReplayLiftoff,
}) {
  const wrapRef = useRef(null)
  const beaconRefs = useRef([])
  const odometerRef = useRef(null)

  const targetProgressRef = useRef(initialProgress)
  const currentProgressRef = useRef(initialProgress)
  const warpingPlanetRef = useRef(null)
  const warpStartTimeRef = useRef(0)

  const [nearestDestId, setNearestDestId] = useState(null)
  const [atStartGate, setAtStartGate] = useState(initialProgress < 0.08)
  const [warpingTo, setWarpingTo] = useState(null)

  const callbacksRef = useRef({ onProgressChange, onEnterPlanet })
  callbacksRef.current = { onProgressChange, onEnterPlanet }

  const flyToProgress = (nextT) => {
    if (warpingPlanetRef.current) return
    targetProgressRef.current = Math.max(0, Math.min(1, nextT))
  }

  const triggerPlanetLanding = (dest) => {
    if (!dest || warpingPlanetRef.current) return
    targetProgressRef.current = dest.t
    warpingPlanetRef.current = dest
    warpStartTimeRef.current = performance.now()
    setWarpingTo(dest.id)
  }

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
    renderer.toneMappingExposure = 1.12
    wrap.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    scene.background = new THREE.Color('#04060d')
    scene.fog = new THREE.FogExp2('#04060d', 0.0056)

    const camera = new THREE.PerspectiveCamera(44, width / height, 0.1, 500)

    const disposables = []
    const reg = (item) => {
      disposables.push(item)
      return item
    }

    // Cosmic Lighting
    scene.add(new THREE.HemisphereLight('#cfe0ff', '#121528', 1.08))
    const sunLight = new THREE.DirectionalLight('#fff0d4', 2.55)
    sunLight.position.set(24, 18, 26)
    scene.add(sunLight)
    const backRim = new THREE.DirectionalLight('#6ea8ff', 1.05)
    backRim.position.set(-20, -8, -28)
    scene.add(backRim)

    // -------------------------------------------------------------------------
    // 1. SPIRAL MILKY WAY GALAXY & DEEP STARFIELD (5,400 STARS ALONG -390 CORRIDOR)
    // -------------------------------------------------------------------------
    const galaxyCount = 5400
    const galPos = new Float32Array(galaxyCount * 3)
    const galCol = new Float32Array(galaxyCount * 3)
    const cCore = new THREE.Color('#f7e4bc')
    const cArmA = new THREE.Color('#7eb4ff')
    const cArmB = new THREE.Color('#b497ff')
    const cWhite = new THREE.Color('#f4f1ea')

    for (let i = 0; i < galaxyCount; i += 1) {
      if (i < 3200) {
        const arm = i % 3
        const r = 16 + Math.pow(Math.random(), 0.72) * 195
        const spin = r * 0.042 + (arm * Math.PI * 2) / 3
        const spread = (Math.random() - 0.5) * (8 + r * 0.14)
        const gx = Math.cos(spin) * r + spread
        const gy = 22 + (Math.random() - 0.5) * (5 + r * 0.08) + gx * 0.22
        const gz = -185 + Math.sin(spin) * r * 0.95
        galPos[i * 3] = gx
        galPos[i * 3 + 1] = gy
        galPos[i * 3 + 2] = gz

        const mixCol = r < 48 ? cCore : arm === 0 ? cArmA : arm === 1 ? cArmB : cWhite
        galCol[i * 3] = mixCol.r
        galCol[i * 3 + 1] = mixCol.g
        galCol[i * 3 + 2] = mixCol.b
      } else {
        galPos[i * 3] = (Math.random() - 0.5) * 165
        galPos[i * 3 + 1] = (Math.random() - 0.5) * 95
        galPos[i * 3 + 2] = 28 - Math.random() * 435
        galCol[i * 3] = cWhite.r
        galCol[i * 3 + 1] = cWhite.g
        galCol[i * 3 + 2] = cWhite.b
      }
    }

    const galGeo = reg(new THREE.BufferGeometry())
    galGeo.setAttribute('position', new THREE.BufferAttribute(galPos, 3))
    galGeo.setAttribute('color', new THREE.BufferAttribute(galCol, 3))
    const galMat = reg(
      new THREE.PointsMaterial({
        size: 0.22,
        vertexColors: true,
        transparent: true,
        opacity: 0.88,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    )
    const galaxyPoints = new THREE.Points(galGeo, galMat)
    scene.add(galaxyPoints)

    // -------------------------------------------------------------------------
    // 2. HOME PLANET EARTH & MOON AT DEPARTURE STARPORT (0.00 AU FROM EARTH)
    // -------------------------------------------------------------------------
    const earthGroup = new THREE.Group()
    earthGroup.position.set(-5.2, -2.35, 4.8)
    const earthTex = reg(createPlanetSurfaceTexture('earth'))
    const earthGeo = reg(new THREE.SphereGeometry(2.45, 48, 36))
    const earthMat = reg(
      new THREE.MeshStandardMaterial({
        map: earthTex,
        roughness: 0.65,
        metalness: 0.08,
      }),
    )
    const earthMesh = new THREE.Mesh(earthGeo, earthMat)
    earthGroup.add(earthMesh)

    const earthHaloGeo = reg(new THREE.SphereGeometry(2.45 * 1.15, 32, 24))
    const earthHaloMat = reg(
      new THREE.MeshBasicMaterial({
        color: '#60a5fa',
        transparent: true,
        opacity: 0.2,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    )
    earthGroup.add(new THREE.Mesh(earthHaloGeo, earthHaloMat))

    const earthMoonPivot = new THREE.Group()
    const earthMoonMesh = new THREE.Mesh(
      reg(new THREE.SphereGeometry(0.46, 20, 16)),
      reg(new THREE.MeshStandardMaterial({ color: '#dde5f2', roughness: 0.88 })),
    )
    earthMoonMesh.position.set(3.8, 0.55, -0.6)
    earthMoonPivot.add(earthMoonMesh)
    earthGroup.add(earthMoonPivot)
    scene.add(earthGroup)

    // -------------------------------------------------------------------------
    // 3. NEAR-TO-FAR GALACTIC HIGHWAY (UNIFORM 76-UNIT DEPTH INTERVALS)
    // -------------------------------------------------------------------------
    const highwayWaypoints = [
      new THREE.Vector3(0, 0, 8), // t = 0.00: Earth Departure Gate (0.00 AU)
      new THREE.Vector3(3.0, 0.7, -66), // t = 0.20: 01 Mars (1.52 AU)
      new THREE.Vector3(-3.6, -0.5, -142), // t = 0.40: 02 Jupiter (5.20 AU)
      new THREE.Vector3(3.5, 1.0, -218), // t = 0.60: 03 Saturn (9.58 AU)
      new THREE.Vector3(-3.0, -0.4, -294), // t = 0.80: 04 Pluto (39.48 AU)
      new THREE.Vector3(0, 0.55, -370), // t = 1.00: 05 Wormhole -> New World
    ]
    const flightCurve = new THREE.CatmullRomCurve3(highwayWaypoints)

    const curveSamples = flightCurve.getPoints(480)
    const mainLineGeo = reg(new THREE.BufferGeometry().setFromPoints(curveSamples))
    const mainLineMat = reg(
      new THREE.LineBasicMaterial({
        color: '#e5c99b',
        transparent: true,
        opacity: 0.54,
      }),
    )
    scene.add(new THREE.Line(mainLineGeo, mainLineMat))

    ;[-1.1, 1.1].forEach((railOffset) => {
      const railPts = curveSamples.map(
        (pt) => new THREE.Vector3(pt.x + railOffset, pt.y - 0.35, pt.z),
      )
      const rGeo = reg(new THREE.BufferGeometry().setFromPoints(railPts))
      const rMat = reg(
        new THREE.LineBasicMaterial({
          color: '#7ab2ff',
          transparent: true,
          opacity: 0.22,
        }),
      )
      scene.add(new THREE.Line(rGeo, rMat))
    })

    for (let i = 0; i <= 28; i += 1) {
      const u = i / 28
      const pt = flightCurve.getPointAt(u)
      const tan = flightCurve.getTangentAt(u)
      const ringGeo = reg(new THREE.TorusGeometry(3.5, 0.018, 8, 64))
      const ringMat = reg(
        new THREE.MeshBasicMaterial({
          color: i % 2 === 0 ? '#e5c99b' : '#8ab4f8',
          transparent: true,
          opacity: 0.13,
        }),
      )
      const ringMesh = new THREE.Mesh(ringGeo, ringMat)
      ringMesh.position.copy(pt)
      ringMesh.lookAt(pt.clone().add(tan))
      scene.add(ringMesh)
    }

    // -------------------------------------------------------------------------
    // 4. FIVE SEQUENTIAL PLANETARY DESTINATIONS (MARS -> JUPITER -> SATURN -> PLUTO -> WORMHOLE)
    // -------------------------------------------------------------------------
    const planetObjects = []
    const clickableMeshes = []

    GALACTIC_DESTINATIONS.forEach((dest) => {
      const routeAnchor = flightCurve.getPointAt(dest.t)
      const worldPos = new THREE.Vector3(
        routeAnchor.x + dest.offset[0],
        routeAnchor.y + dest.offset[1],
        routeAnchor.z + dest.offset[2],
      )

      const holder = new THREE.Group()
      holder.position.copy(worldPos)

      const tex = reg(createPlanetSurfaceTexture(dest.planetKind))
      const sphereGeo = reg(new THREE.SphereGeometry(dest.radius, 48, 36))
      const sphereMat = reg(
        new THREE.MeshStandardMaterial({
          map: tex,
          emissive: dest.isWormhole ? new THREE.Color('#34d399') : new THREE.Color('#000000'),
          emissiveIntensity: dest.isWormhole ? 0.72 : 0,
          roughness: dest.isWormhole ? 0.2 : 0.72,
          metalness: dest.isWormhole ? 0.25 : 0.08,
        }),
      )
      const planetMesh = new THREE.Mesh(sphereGeo, sphereMat)
      planetMesh.userData.dest = dest
      holder.add(planetMesh)
      clickableMeshes.push(planetMesh)

      const haloGeo = reg(new THREE.SphereGeometry(dest.radius * 1.18, 32, 24))
      const haloMat = reg(
        new THREE.MeshBasicMaterial({
          color: dest.halo,
          transparent: true,
          opacity: dest.isWormhole ? 0.28 : 0.16,
          side: THREE.BackSide,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        }),
      )
      holder.add(new THREE.Mesh(haloGeo, haloMat))

      const dockGeo = reg(new THREE.TorusGeometry(dest.radius * 1.65, 0.026, 10, 72))
      const dockMat = reg(
        new THREE.MeshBasicMaterial({
          color: dest.accent,
          transparent: true,
          opacity: 0.38,
        }),
      )
      const dockRing = new THREE.Mesh(dockGeo, dockMat)
      dockRing.rotation.x = dest.isWormhole ? 0.18 : Math.PI * 0.44
      holder.add(dockRing)

      let wormholeRings = null
      if (dest.isWormhole) {
        wormholeRings = new THREE.Group()
        for (let k = 0; k < 6; k += 1) {
          const wGeo = reg(new THREE.TorusGeometry(dest.radius * (1.85 + k * 0.26), 0.03, 10, 72))
          const wMat = reg(
            new THREE.MeshBasicMaterial({
              color: k % 2 === 0 ? '#f5dfb8' : '#7dd3fc',
              transparent: true,
              opacity: 0.56 - k * 0.07,
              blending: THREE.AdditiveBlending,
            }),
          )
          const wRing = new THREE.Mesh(wGeo, wMat)
          wRing.position.z = -k * 1.1
          wormholeRings.add(wRing)
        }
        holder.add(wormholeRings)
      } else if (dest.hasRings) {
        const rTex = reg(createRingTexture('229, 201, 155'))
        const rGeo = reg(new THREE.PlaneGeometry(dest.radius * 4.7, dest.radius * 4.7))
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
        rings.rotation.x = Math.PI * 0.4
        rings.rotation.y = 0.24
        holder.add(rings)
      }

      let moonPivot = null
      if (dest.hasMoon) {
        moonPivot = new THREE.Group()
        const mGeo = reg(new THREE.SphereGeometry(dest.radius * 0.25, 20, 16))
        const mMat = reg(new THREE.MeshStandardMaterial({ color: '#cfd8e8', roughness: 0.85 }))
        const moon = new THREE.Mesh(mGeo, mMat)
        moon.position.set(dest.radius * 2.0, dest.radius * 0.2, 0)
        moonPivot.add(moon)
        holder.add(moonPivot)
      }

      scene.add(holder)
      planetObjects.push({ dest, holder, planetMesh, dockRing, moonPivot, wormholeRings, worldPos })
    })

    // -------------------------------------------------------------------------
    // 5. HERO "SS-92 SATURN CLIPPER" STARSHIP IN 3RD-PERSON GALACTIC FLIGHT!
    // -------------------------------------------------------------------------
    const starship = createHeroSpacecraft(disposables, { showMiniCrew: true })
    starship.group.scale.setScalar(0.58)
    scene.add(starship.group)

    const raycaster = new THREE.Raycaster()
    const pointer = new THREE.Vector2()

    let isDragging = false
    let dragStartX = 0
    let dragStartY = 0
    let dragMoved = false

    const onPointerDown = (e) => {
      if (e.target.closest('button, a')) return
      isDragging = true
      dragMoved = false
      dragStartX = e.clientX
      dragStartY = e.clientY
    }

    const onPointerMove = (e) => {
      const rect = renderer.domElement.getBoundingClientRect()
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1

      if (isDragging && !warpingPlanetRef.current) {
        const dx = e.clientX - dragStartX
        const dy = e.clientY - dragStartY
        if (Math.hypot(dx, dy) > 6) dragMoved = true
        // Swiping finger UP (dy < 0) advances forward!
        targetProgressRef.current = Math.max(
          0,
          Math.min(1, targetProgressRef.current - dy * 0.0014 + dx * 0.0008),
        )
        dragStartX = e.clientX
        dragStartY = e.clientY
      } else {
        raycaster.setFromCamera(pointer, camera)
        const hits = raycaster.intersectObjects(clickableMeshes, false)
        renderer.domElement.style.cursor = hits.length > 0 ? 'pointer' : 'grab'
      }
    }

    const onPointerUp = (e) => {
      if (!isDragging) return
      isDragging = false
      if (!dragMoved && !warpingPlanetRef.current) {
        const rect = renderer.domElement.getBoundingClientRect()
        pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
        pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
        raycaster.setFromCamera(pointer, camera)
        const hits = raycaster.intersectObjects(clickableMeshes, false)
        if (hits[0]?.object?.userData?.dest) {
          triggerPlanetLanding(hits[0].object.userData.dest)
        }
      }
    }

    const onWheel = (e) => {
      if (warpingPlanetRef.current) return
      e.preventDefault()
      const delta = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX
      // Rolling wheel / pushing fingers UP (delta < 0) flies the starship FORWARD!
      targetProgressRef.current = Math.max(
        0,
        Math.min(1, targetProgressRef.current - delta * 0.00052),
      )
    }

    const onKeyDown = (e) => {
      if (warpingPlanetRef.current) return
      if (e.key === 'ArrowUp' || e.key === 'ArrowRight' || e.key === 'w' || e.key === 'W') {
        targetProgressRef.current = Math.min(1, targetProgressRef.current + 0.08)
      } else if (
        e.key === 'ArrowDown' ||
        e.key === 'ArrowLeft' ||
        e.key === 's' ||
        e.key === 'S'
      ) {
        targetProgressRef.current = Math.max(0, targetProgressRef.current - 0.08)
      } else if (e.key === 'Enter') {
        const near = GALACTIC_DESTINATIONS.find(
          (d) => Math.abs(d.t - currentProgressRef.current) < 0.08,
        )
        if (near) triggerPlanetLanding(near)
      }
    }

    const domEl = renderer.domElement
    domEl.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
    domEl.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('keydown', onKeyDown)

    const handleResize = () => {
      width = window.innerWidth
      height = window.innerHeight
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }
    window.addEventListener('resize', handleResize)

    let lastNearest = null
    let lastAtGate = initialProgress < 0.08
    let rafId = 0
    const projVec = new THREE.Vector3()

    const animate = (now) => {
      const timeSec = now * 0.001

      const diff = targetProgressRef.current - currentProgressRef.current
      currentProgressRef.current += diff * 0.068
      const curT = Math.max(0, Math.min(0.998, currentProgressRef.current))
      callbacksRef.current.onProgressChange?.(curT)

      // Update live Earth-distance odometer without React re-renders
      if (odometerRef.current) {
        const au = interpolateEarthDistanceAu(curT)
        odometerRef.current.textContent = `+${au.toFixed(2)} AU`
      }

      // Auto-plunge into the New World Wormhole if user flies all the way past Pluto to the end!
      if (
        !warpingPlanetRef.current &&
        curT >= 0.968 &&
        targetProgressRef.current >= 0.985 &&
        diff > -0.001
      ) {
        triggerPlanetLanding(GALACTIC_DESTINATIONS[GALACTIC_DESTINATIONS.length - 1])
      }

      const nowAtGate = curT < 0.075
      if (nowAtGate !== lastAtGate) {
        lastAtGate = nowAtGate
        setAtStartGate(nowAtGate)
      }

      let foundNear = null
      let bestDist = 0.075
      GALACTIC_DESTINATIONS.forEach((d) => {
        const dist = Math.abs(d.t - curT)
        if (dist < bestDist) {
          bestDist = dist
          foundNear = d.id
        }
      })
      if (foundNear !== lastNearest) {
        lastNearest = foundNear
        setNearestDestId(foundNear)
      }

      // Rotate Departure Earth & Moon
      earthMesh.rotation.y = timeSec * 0.12
      earthMoonPivot.rotation.y = timeSec * 0.36

      // Position & Orient the SS-92 Saturn Clipper Starship along the Galactic Highway!
      const shipT = Math.min(0.998, curT + 0.012)
      const shipPt = flightCurve.getPointAt(shipT)
      const aheadPt = flightCurve.getPointAt(Math.min(0.999, shipT + 0.014))

      const hoverY = Math.sin(timeSec * 2.4) * 0.09
      const hoverX = Math.cos(timeSec * 1.7) * 0.06
      const shipPosX = shipPt.x + hoverX
      const shipPosY = shipPt.y + hoverY
      const shipPosZ = shipPt.z
      starship.group.position.set(shipPosX, shipPosY, shipPosZ)
      starship.group.lookAt(
        2 * shipPosX - aheadPt.x,
        2 * shipPosY - aheadPt.y,
        2 * shipPosZ - aheadPt.z,
      )

      const speedMag = Math.min(1, Math.abs(diff) * 14)
      const curveTurn = (aheadPt.x - shipPt.x) * -0.36
      starship.group.rotateZ(curveTurn + Math.sin(timeSec * 1.5) * 0.04)
      starship.setThrottle(0.45 + speedMag * 1.15, timeSec)

      // Chase Camera Choreography
      if (warpingPlanetRef.current) {
        const wDest = warpingPlanetRef.current
        const pObj = planetObjects.find((p) => p.dest.id === wDest.id)
        const wProg = Math.min(1, (now - warpStartTimeRef.current) / 720)
        const easeW = wProg < 0.5 ? 4 * wProg * wProg * wProg : 1 - Math.pow(-2 * wProg + 2, 3) / 2

        const camStart = flightCurve.getPointAt(Math.max(0, curT - 0.014))
        camStart.y += 1.55
        camStart.z += 5.2

        if (pObj) {
          const targetCam = pObj.worldPos
            .clone()
            .add(new THREE.Vector3(0, wDest.radius * 0.32, wDest.radius * 2.05))
          camera.position.lerpVectors(camStart, targetCam, easeW)
          camera.lookAt(
            THREE.MathUtils.lerp(shipPt.x, pObj.worldPos.x, easeW),
            THREE.MathUtils.lerp(shipPt.y, pObj.worldPos.y, easeW),
            THREE.MathUtils.lerp(shipPt.z - 6, pObj.worldPos.z, easeW),
          )
        }

        if (wProg >= 1) {
          const finishedDest = warpingPlanetRef.current
          warpingPlanetRef.current = null
          callbacksRef.current.onEnterPlanet?.(finishedDest.id, curT)
          return
        }
      } else {
        const camBackPt = flightCurve.getPointAt(Math.max(0, curT - 0.012))
        camera.position.set(
          camBackPt.x * 0.82,
          camBackPt.y + 1.58 + Math.sin(timeSec * 0.8) * 0.08,
          camBackPt.z + 5.4,
        )
        camera.lookAt(shipPt.x * 0.88, shipPt.y + 0.22, shipPt.z - 12)
      }

      galaxyPoints.rotation.z = timeSec * 0.0035

      planetObjects.forEach((p, idx) => {
        p.planetMesh.rotation.y = timeSec * (0.14 + idx * 0.02)
        p.dockRing.rotation.z = timeSec * 0.35
        if (p.moonPivot) p.moonPivot.rotation.y = timeSec * 0.45 + idx
        if (p.wormholeRings) {
          p.wormholeRings.children.forEach((r, k) => {
            r.rotation.z = timeSec * (0.55 + k * 0.14) * (k % 2 === 0 ? 1 : -1)
          })
        }

        const beaconEl = beaconRefs.current[idx]
        if (!beaconEl) return

        projVec.copy(p.worldPos)
        projVec.y += p.dest.radius * 1.44
        projVec.project(camera)

        const distCam = camera.position.distanceTo(p.worldPos)
        // Strict near-to-far visibility window so only the next approaching planet shows a crisp label!
        const inFront =
          projVec.z < 1 && projVec.z > -1 && distCam < 106 && !warpingPlanetRef.current

        if (!inFront) {
          beaconEl.style.opacity = '0'
          beaconEl.style.pointerEvents = 'none'
        } else {
          const sx = (projVec.x * 0.5 + 0.5) * width
          const sy = (-projVec.y * 0.5 + 0.5) * height
          const distFade = Math.max(0, Math.min(1, (106 - distCam) / 38))
          beaconEl.style.opacity = String(distFade)
          beaconEl.style.pointerEvents = distFade > 0.25 ? 'auto' : 'none'
          beaconEl.style.transform = `translate3d(${sx.toFixed(1)}px, ${sy.toFixed(1)}px, 0) translate(-50%, -100%)`
        }
      })

      renderer.render(scene, camera)
      rafId = window.requestAnimationFrame(animate)
    }

    rafId = window.requestAnimationFrame(animate)

    return () => {
      window.cancelAnimationFrame(rafId)
      domEl.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      domEl.removeEventListener('wheel', onWheel)
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('resize', handleResize)
      disposables.forEach((d) => d.dispose?.())
      renderer.dispose()
      if (domEl.parentNode === wrap) {
        wrap.removeChild(domEl)
      }
    }
  }, [])

  const nearestMeta = GALACTIC_DESTINATIONS.find((d) => d.id === nearestDestId)
  const nearestCopy = nearestDestId ? copy.destinations?.[nearestDestId] : null

  return (
    <div className={`galactic-stage${warpingTo ? ' is-warping' : ''}`}>
      <div className="galactic-canvas-wrap" ref={wrapRef} />

      {/* Live Heliocentric / Earth-Outward Distance Telemetry */}
      <div className="galactic-telemetry-ribbon" aria-hidden="true">
        <span>{copy.galaxyHud.earthDistancePrefix || 'EARTH'}</span>
        <strong ref={odometerRef}>+0.00 AU</strong>
        <span className="galactic-telemetry-ribbon__sep">·</span>
        <span>EARTH → MARS → JUPITER → SATURN → PLUTO → NEW WORLD</span>
      </div>

      {/* Projected 3D Spatial Planet Beacons Floating Directly Above Each Planet! */}
      <div className="galactic-beacons-layer">
        {GALACTIC_DESTINATIONS.map((dest, idx) => {
          const dCopy = copy.destinations?.[dest.id]
          const isNear = nearestDestId === dest.id
          return (
            <button
              key={dest.id}
              type="button"
              ref={(el) => {
                beaconRefs.current[idx] = el
              }}
              className={`spatial-planet-beacon${isNear ? ' is-near' : ''}`}
              style={{ '--planet-accent': dest.accent }}
              onClick={() => triggerPlanetLanding(dest)}
              data-cursor="ENTER PLANET"
            >
              <span className="spatial-planet-beacon__code">{dCopy?.planetName}</span>
              <strong>{dCopy?.sectionTitle}</strong>
              <span className="spatial-planet-beacon__enter">{copy.galaxyHud.enterBtn} ↗</span>
            </button>
          )
        })}
      </div>

      {/* Minimal Poetic Departure Plaque ONLY at Earth Launch Gate (t < 0.075) */}
      {atStartGate && !warpingTo && (
        <div className="galactic-prologue-plaque">
          <div className="galactic-prologue-plaque__eyebrow">
            <Sparkles size={12} />
            <span>{copy.hero.studioTag}</span>
          </div>
          <div className="galactic-prologue-plaque__id">
            <span>{copy.hero.nameEn}</span>
            <i>{copy.hero.nameLocal}</i>
          </div>
          <h1>
            <span>{copy.hero.headlineLead}</span>
            <em>{copy.hero.headlineItalic}</em>
          </h1>
          <p>{copy.galaxyHud.pilotInstruction}</p>
          <div className="galactic-prologue-plaque__actions">
            <button
              type="button"
              className="studio-btn studio-btn--primary"
              onClick={() => flyToProgress(GALACTIC_DESTINATIONS[0].t)}
            >
              <Rocket size={15} />
              <span>{copy.galaxyHud.startCruiseBtn}</span>
            </button>
            <button
              type="button"
              className="studio-btn studio-btn--glass"
              onClick={onReplayLiftoff}
            >
              <Play size={12} fill="currentColor" />
              <span>{copy.hero.replayIntro}</span>
            </button>
          </div>
        </div>
      )}

      {/* Orbital Docking Prompt when Starship Approaches Any Planet */}
      {nearestMeta && nearestCopy && !warpingTo && (
        <div
          className="galactic-dock-prompt"
          style={{ '--planet-accent': nearestMeta.accent }}
        >
          <div className="galactic-dock-prompt__info">
            <span className="galactic-dock-prompt__code">{nearestMeta.code}</span>
            <h2>
              {nearestCopy.planetName} · {nearestCopy.sectionTitle}
            </h2>
            <p>{nearestCopy.brief}</p>
          </div>
          <button
            type="button"
            className="studio-btn studio-btn--primary"
            onClick={() => triggerPlanetLanding(nearestMeta)}
          >
            <span>
              {copy.galaxyHud.landOnPrefix} {nearestCopy.planetName}
            </span>
            <ArrowRight size={15} />
          </button>
        </div>
      )}

      {/* Bottom Galactic Star-Route Navigation Dock */}
      <footer className="galactic-route-dock">
        <div className="galactic-route-dock__hint">
          <Compass size={13} />
          <span>{copy.galaxyHud.controlsHint}</span>
        </div>

        <div className="galactic-route-dock__nodes">
          <button
            type="button"
            className={`route-node${atStartGate ? ' is-active' : ''}`}
            onClick={() => flyToProgress(0)}
          >
            <span className="route-node__dot" style={{ '--node-color': '#60a5fa' }} />
            <span className="route-node__label">{copy.galaxyHud.originLabel}</span>
          </button>

          {GALACTIC_DESTINATIONS.map((dest) => {
            const dCopy = copy.destinations?.[dest.id]
            const isNear = nearestDestId === dest.id
            return (
              <button
                key={dest.id}
                type="button"
                className={`route-node${isNear ? ' is-active' : ''}`}
                style={{ '--node-color': dest.accent }}
                onClick={() => triggerPlanetLanding(dest)}
              >
                <span className="route-node__dot" />
                <span className="route-node__label">{dCopy?.shortLabel}</span>
              </button>
            )
          })}
        </div>

        <div className="galactic-route-dock__steppers">
          <button
            type="button"
            className="route-step-btn"
            aria-label="Fly back"
            onClick={() => flyToProgress(targetProgressRef.current - 0.2)}
          >
            <ArrowLeft size={14} />
          </button>
          <button
            type="button"
            className="route-step-btn"
            aria-label="Fly ahead"
            onClick={() => flyToProgress(targetProgressRef.current + 0.2)}
          >
            <ArrowRight size={14} />
          </button>
        </div>
      </footer>
    </div>
  )
}
