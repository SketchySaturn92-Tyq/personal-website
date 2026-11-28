import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { ArrowLeft, ArrowUpRight, Check, Copy, Gamepad2, Linkedin, Mail, RotateCcw } from 'lucide-react'
import { createHeroSpacecraft } from './HeroSpacecraft'
import './NewWorldFinale.css'

/**
 * Full-Screen 3D Finale Sequence:
 * 1. Slingshots the SS-92 Saturn Clipper past the last solar planet (icy heart-glacier Pluto, 39.48 AU)
 * 2. Plunges through a luminous golden-aurora Einstein-Rosen Hyperspace Wormhole
 * 3. Emerges above a serene, radiant emerald-champagne "New World" dawn horizon
 * 4. Organically reveals and auto-plays Quan Zhong's handwritten signature film!
 */
export default function NewWorldFinale({ copy, onBackToGalaxy }) {
  const canvasWrapRef = useRef(null)
  const flashRef = useRef(null)
  const videoRef = useRef(null)

  const [arrivedNewWorld, setArrivedNewWorld] = useState(false)
  const [replayNonce, setReplayNonce] = useState(0)
  const [emailCopied, setEmailCopied] = useState(false)

  useEffect(() => {
    setArrivedNewWorld(false)
    const wrap = canvasWrapRef.current
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
      setArrivedNewWorld(true)
      return undefined
    }

    renderer.setPixelRatio(dpr)
    renderer.setSize(width, height)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.15
    wrap.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const bgDark = new THREE.Color('#04060d')
    const bgDawn = new THREE.Color('#071422')
    scene.background = bgDark.clone()

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 260)

    const disposables = []
    const reg = (x) => {
      disposables.push(x)
      return x
    }

    const hemi = new THREE.HemisphereLight('#d6ebff', '#102230', 1.2)
    scene.add(hemi)
    const sun = new THREE.DirectionalLight('#fff2d6', 2.6)
    sun.position.set(16, 14, -20)
    scene.add(sun)

    // -------------------------------------------------------------------------
    // BEAT 1 OBJECTS: PLUTO FLYBY + HYPERSPACE WORMHOLE TUNNEL
    // -------------------------------------------------------------------------
    const departureGroup = new THREE.Group()
    scene.add(departureGroup)

    // Pluto with heart glacier on the left as SS-92 slingshots past it!
    const plutoCanvas = document.createElement('canvas')
    plutoCanvas.width = 512
    plutoCanvas.height = 256
    const pCtx = plutoCanvas.getContext('2d')
    const pg = pCtx.createLinearGradient(0, 0, 0, 256)
    pg.addColorStop(0, '#c6d4e6')
    pg.addColorStop(0.5, '#7e8fa6')
    pg.addColorStop(1, '#9fb0c6')
    pCtx.fillStyle = pg
    pCtx.fillRect(0, 0, 512, 256)
    pCtx.fillStyle = 'rgba(246, 250, 255, 0.86)'
    pCtx.beginPath()
    pCtx.ellipse(242, 128, 44, 34, -0.35, 0, Math.PI * 2)
    pCtx.ellipse(282, 128, 42, 34, 0.35, 0, Math.PI * 2)
    pCtx.fill()

    const plutoTex = reg(new THREE.CanvasTexture(plutoCanvas))
    plutoTex.colorSpace = THREE.SRGBColorSpace
    const plutoGeo = reg(new THREE.SphereGeometry(2.6, 42, 32))
    const plutoMat = reg(new THREE.MeshStandardMaterial({ map: plutoTex, roughness: 0.75 }))
    const plutoMesh = new THREE.Mesh(plutoGeo, plutoMat)
    plutoMesh.position.set(-3.4, 0.4, -10)
    departureGroup.add(plutoMesh)

    // Luminous Wormhole Portal Rings ahead at z = -34
    const wormholeGroup = new THREE.Group()
    wormholeGroup.position.set(0, 0.3, -34)
    departureGroup.add(wormholeGroup)

    for (let i = 0; i < 12; i += 1) {
      const rGeo = reg(new THREE.TorusGeometry(3.6 - i * 0.16, 0.035, 10, 72))
      const rMat = reg(
        new THREE.MeshBasicMaterial({
          color: i % 2 === 0 ? '#f5dfb8' : '#7dd3fc',
          transparent: true,
          opacity: 0.72 - i * 0.04,
          blending: THREE.AdditiveBlending,
        }),
      )
      const ring = new THREE.Mesh(rGeo, rMat)
      ring.position.z = -i * 2.2
      wormholeGroup.add(ring)
    }

    // Hyperspace Warp Star-Streak Lines
    const streakCount = 420
    const streakPos = new Float32Array(streakCount * 6)
    for (let i = 0; i < streakCount; i += 1) {
      const angle = Math.random() * Math.PI * 2
      const rad = 1.6 + Math.random() * 14
      const sx = Math.cos(angle) * rad
      const sy = Math.sin(angle) * rad
      const sz = 10 - Math.random() * 85
      streakPos[i * 6] = sx
      streakPos[i * 6 + 1] = sy
      streakPos[i * 6 + 2] = sz
      streakPos[i * 6 + 3] = sx
      streakPos[i * 6 + 4] = sy
      streakPos[i * 6 + 5] = sz - 4.5
    }
    const streakGeo = reg(new THREE.BufferGeometry())
    streakGeo.setAttribute('position', new THREE.BufferAttribute(streakPos, 3))
    const streakMat = reg(
      new THREE.LineBasicMaterial({
        color: '#cfe8ff',
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
      }),
    )
    const warpStreaks = new THREE.LineSegments(streakGeo, streakMat)
    scene.add(warpStreaks)

    // -------------------------------------------------------------------------
    // BEAT 2 OBJECTS: THE "NEW WORLD" (LUMINOUS EMERALD-AURORA EXOPLANET DAWN!)
    // -------------------------------------------------------------------------
    const newWorldGroup = new THREE.Group()
    newWorldGroup.visible = false
    scene.add(newWorldGroup)

    // Giant curved New World Exoplanet Horizon below the ship
    const nwCanvas = document.createElement('canvas')
    nwCanvas.width = 1024
    nwCanvas.height = 512
    const nwCtx = nwCanvas.getContext('2d')
    const nwg = nwCtx.createLinearGradient(0, 0, 0, 512)
    nwg.addColorStop(0, '#c8f5e8')
    nwg.addColorStop(0.25, '#2b8a8e')
    nwg.addColorStop(0.55, '#164d6e')
    nwg.addColorStop(0.85, '#102b46')
    nwg.addColorStop(1, '#e5c99b')
    nwCtx.fillStyle = nwg
    nwCtx.fillRect(0, 0, 1024, 512)

    nwCtx.fillStyle = 'rgba(229, 201, 155, 0.35)'
    for (let i = 0; i < 18; i += 1) {
      nwCtx.beginPath()
      nwCtx.ellipse((i * 73) % 1024, 90 + ((i * 41) % 280), 90, 14, 0.12, 0, Math.PI * 2)
      nwCtx.fill()
    }

    const nwTex = reg(new THREE.CanvasTexture(nwCanvas))
    nwTex.colorSpace = THREE.SRGBColorSpace
    const nwGeo = reg(new THREE.SphereGeometry(26, 64, 48))
    const nwMat = reg(
      new THREE.MeshStandardMaterial({
        map: nwTex,
        emissive: new THREE.Color('#1c5e68'),
        emissiveIntensity: 0.28,
        roughness: 0.55,
      }),
    )
    const nwPlanet = new THREE.Mesh(nwGeo, nwMat)
    nwPlanet.position.set(0, -27.2, -26)
    newWorldGroup.add(nwPlanet)

    // Golden-Cyan Dawn Atmosphere Halo Arc over the New World!
    const atmGeo = reg(new THREE.SphereGeometry(27.1, 64, 48))
    const atmMat = reg(
      new THREE.MeshBasicMaterial({
        color: '#88e5d8',
        transparent: true,
        opacity: 0.24,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
      }),
    )
    const atmMesh = new THREE.Mesh(atmGeo, atmMat)
    atmMesh.position.copy(nwPlanet.position)
    newWorldGroup.add(atmMesh)

    // Twin Serene Moons & Soft Starfield in the New World Sky
    const nwStarsPos = new Float32Array(900 * 3)
    for (let i = 0; i < 900; i += 1) {
      nwStarsPos[i * 3] = (Math.random() - 0.5) * 120
      nwStarsPos[i * 3 + 1] = -4 + Math.random() * 55
      nwStarsPos[i * 3 + 2] = -15 - Math.random() * 90
    }
    const nwStarsGeo = reg(new THREE.BufferGeometry())
    nwStarsGeo.setAttribute('position', new THREE.BufferAttribute(nwStarsPos, 3))
    const nwStarsMat = reg(
      new THREE.PointsMaterial({
        color: '#f7efe0',
        size: 0.15,
        transparent: true,
        opacity: 0.8,
      }),
    )
    newWorldGroup.add(new THREE.Points(nwStarsGeo, nwStarsMat))

    // Hero SS-92 Saturn Clipper flying through the entire sequence!
    const starship = createHeroSpacecraft(disposables, { showMiniCrew: true })
    starship.group.scale.setScalar(0.55)
    scene.add(starship.group)

    const handleResize = () => {
      width = window.innerWidth
      height = window.innerHeight
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }
    window.addEventListener('resize', handleResize)

    let rafId = 0
    const startTime = performance.now()
    let triggeredArrival = false

    const animate = (now) => {
      const elapsedSec = (now - startTime) * 0.001

      if (elapsedSec < 3.4) {
        // BEAT 1 (0.0s -> 3.4s): Slingshot past Pluto & plunge into the Wormhole!
        const u = elapsedSec / 3.4
        const accel = u * u * u
        const shipZ = 2 - u * 16 - accel * 34
        const shipX = Math.sin(u * Math.PI) * 0.9

        starship.group.position.set(shipX, 0.15, shipZ)
        // Nose is along -Z and thrusters along +Z, so rotation.y = 0 aims nose straight into the Wormhole!
        starship.group.rotation.set(0.04, 0, -Math.cos(u * Math.PI) * 0.25)
        starship.setThrottle(0.65 + accel * 1.6, elapsedSec)

        camera.position.set(shipX * 0.5, 1.35, shipZ + 5.2 - accel * 1.8)
        camera.lookAt(0, 0.25, shipZ - 12)

        plutoMesh.rotation.y = elapsedSec * 0.25
        wormholeGroup.rotation.z = elapsedSec * 1.4

        // Hyperspace streaks intensify entering the wormhole
        const warpAmt = Math.max(0, (u - 0.35) / 0.65)
        streakMat.opacity = warpAmt * 0.85
        warpStreaks.position.z = (elapsedSec * 42) % 30

        // Warm starlight flash right as we cross the wormhole throat (2.8s -> 3.4s)
        if (flashRef.current) {
          const flashIn = Math.max(0, (elapsedSec - 2.75) / 0.65)
          flashRef.current.style.opacity = String(Math.min(1, flashIn * flashIn))
        }
      } else {
        // BEAT 2 (3.4s+): Emerge peacefully above the Luminous New World Horizon!
        departureGroup.visible = false
        newWorldGroup.visible = true
        scene.background.copy(bgDawn)

        const postSec = elapsedSec - 3.4
        const settle = 1 - Math.pow(Math.max(0, 1 - Math.min(1, postSec / 2.0)), 3)

        streakMat.opacity = Math.max(0, (1 - postSec / 0.8) * 0.5)
        if (flashRef.current) {
          flashRef.current.style.opacity = String(Math.max(0, 1 - postSec / 1.1))
        }

        // Starship glides serenely toward the lower-right horizon, opening center sky for Handwriting!
        const glideX = THREE.MathUtils.lerp(0, 2.8, settle) + Math.sin(elapsedSec * 0.9) * 0.12
        const glideY = THREE.MathUtils.lerp(0.2, -1.35, settle) + Math.cos(elapsedSec * 1.1) * 0.06
        const glideZ = THREE.MathUtils.lerp(1.5, -4.6, settle)
        starship.group.position.set(glideX, glideY, glideZ)
        starship.group.rotation.set(0.04, -0.22, -0.1)
        starship.setThrottle(0.45, elapsedSec)

        camera.position.set(0, 0.85, 4.5)
        camera.lookAt(0, -0.2, -14)

        nwPlanet.rotation.y = elapsedSec * 0.035

        if (!triggeredArrival && postSec >= 1.05) {
          triggeredArrival = true
          setArrivedNewWorld(true)
        }
      }

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
  }, [replayNonce])

  // Auto-play handwriting video as soon as we arrive in the New World!
  useEffect(() => {
    if (!arrivedNewWorld || !videoRef.current) return undefined
    const v = videoRef.current
    v.currentTime = 0
    v.playbackRate = 2.4
    v.play().catch(() => {})

    let timer = 0
    const onEnded = () => {
      timer = window.setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.currentTime = 0
          videoRef.current.playbackRate = 2.4
          videoRef.current.play().catch(() => {})
        }
      }, 3000)
    }
    v.addEventListener('ended', onEnded)
    return () => {
      window.clearTimeout(timer)
      v.removeEventListener('ended', onEnded)
    }
  }, [arrivedNewWorld])

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText('17762583565@163.com')
      setEmailCopied(true)
      window.setTimeout(() => setEmailCopied(false), 2000)
    } catch {
      window.location.href = 'mailto:17762583565@163.com'
    }
  }

  return (
    <section className="newworld-stage">
      <div className="newworld-canvas-wrap" ref={canvasWrapRef} />
      <div className="newworld-flash" ref={flashRef} aria-hidden="true" />

      <header className="newworld-topbar">
        <button type="button" className="planet-back-btn" onClick={onBackToGalaxy}>
          <ArrowLeft size={15} />
          <span>{copy.galaxyHud.backToGalaxy}</span>
        </button>

        <span className="newworld-status">
          {arrivedNewWorld
            ? copy.galaxyHud.newWorldArrivedBadge
            : copy.galaxyHud.newWorldTransitingBadge}
        </span>

        <button
          type="button"
          className="planet-next-btn"
          onClick={() => setReplayNonce((n) => n + 1)}
        >
          <RotateCcw size={13} />
          <span>{copy.galaxyHud.replayWarpBtn}</span>
        </button>
      </header>

      {/* Revealed organically after crossing Pluto's wormhole into the New World! */}
      <div className={`newworld-epilogue${arrivedNewWorld ? ' is-visible' : ''}`}>
        <p className="newworld-quote">{copy.epilogue.quote}</p>

        <div className="newworld-handwriting-box">
          <video
            ref={videoRef}
            className="newworld-handwriting-video"
            muted
            playsInline
            preload="auto"
          >
            <source src="/assets/ending-handwriting.m4v" type="video/mp4" />
            <source src="/assets/ending-handwriting.mov" type="video/quicktime" />
          </video>
        </div>

        <div className="newworld-comms-bar">
          <button type="button" className="newworld-chip" onClick={handleCopyEmail}>
            <Mail size={14} />
            <span>17762583565@163.com</span>
            <small>{emailCopied ? copy.galaxyHud.copiedEmail : copy.galaxyHud.copyEmail}</small>
            {emailCopied ? <Check size={13} /> : <Copy size={13} />}
          </button>

          <a
            href="https://www.linkedin.com/in/quan-zhong-ss92"
            target="_blank"
            rel="noreferrer"
            className="newworld-chip"
          >
            <Linkedin size={14} />
            <span>LinkedIn</span>
            <ArrowUpRight size={13} />
          </a>

          <a
            href={copy.builds.app?.primaryHref}
            target="_blank"
            rel="noreferrer"
            className="newworld-chip"
          >
            <Gamepad2 size={14} />
            <span>{copy.builds.appTitle}</span>
            <ArrowUpRight size={13} />
          </a>
        </div>
      </div>
    </section>
  )
}
