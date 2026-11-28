import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { ArrowRight } from 'lucide-react'
import { createHeroSpacecraft } from './HeroSpacecraft'
import './OpeningMotion.css'

// 8.6s Realistic Zero-Clipping Boarding & Liftoff Sequence:
// 0.00 - 0.24 (0.0s - 2.1s): 5 scaled woodland animals stroll across "SketchySaturn92", SS-92 lands on 3-point gear
// 0.24 - 0.34 (2.1s - 2.9s): Starboard gull-wing canopy opens & illuminated port-forward ramp extends to floor
// 0.34 - 0.70 (2.9s - 6.0s): Animals line up in single-file queue & physically walk up the ramp into their 5 cabin seats!
// 0.70 - 1.00 (6.0s - 8.6s): Ramp retracts, canopy locks, gear tucks, triple ion thrusters ignite & SS-92 climbs into the Galaxy!
const TOTAL_DURATION_MS = 8600

const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v))
const phase = (p, start, end) => clamp((p - start) / (end - start))
const lerp = (a, b, t) => a + (b - a) * t

const easeOutCubic = (x) => 1 - Math.pow(1 - x, 3)
const easeInCubic = (x) => x * x * x
const easeInOutCubic = (x) =>
  x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2

function buildFloorTextures(maxAnisotropy = 4) {
  const size = 2048
  const colorCanvas = document.createElement('canvas')
  colorCanvas.width = size
  colorCanvas.height = size
  const ctx = colorCanvas.getContext('2d')

  const baseGrad = ctx.createRadialGradient(
    size * 0.5,
    size * 0.49,
    size * 0.04,
    size * 0.5,
    size * 0.5,
    size * 0.54,
  )
  baseGrad.addColorStop(0, '#33394f')
  baseGrad.addColorStop(0.45, '#252a3c')
  baseGrad.addColorStop(0.78, '#141824')
  baseGrad.addColorStop(1, '#04060c')
  ctx.fillStyle = baseGrad
  ctx.fillRect(0, 0, size, size)

  const warmWash = ctx.createRadialGradient(
    size * 0.48,
    size * 0.45,
    size * 0.03,
    size * 0.5,
    size * 0.48,
    size * 0.46,
  )
  warmWash.addColorStop(0, 'rgba(229, 201, 155, 0.24)')
  warmWash.addColorStop(0.42, 'rgba(138, 180, 248, 0.12)')
  warmWash.addColorStop(0.72, 'rgba(157, 134, 233, 0.08)')
  warmWash.addColorStop(1, 'rgba(4, 6, 12, 0)')
  ctx.fillStyle = warmWash
  ctx.fillRect(0, 0, size, size)

  ctx.save()
  ctx.translate(size * 0.5, size * 0.5)
  ctx.rotate(-0.34)
  const shafts = [
    { y: -320, h: 190, alpha: 0.15, tint: '245, 221, 182' },
    { y: -20, h: 265, alpha: 0.2, tint: '248, 228, 194' },
    { y: 285, h: 170, alpha: 0.12, tint: '162, 196, 250' },
  ]
  shafts.forEach((s) => {
    const sg = ctx.createLinearGradient(0, s.y - s.h * 0.5, 0, s.y + s.h * 0.5)
    sg.addColorStop(0, `rgba(${s.tint}, 0)`)
    sg.addColorStop(0.24, `rgba(${s.tint}, ${s.alpha})`)
    sg.addColorStop(0.76, `rgba(${s.tint}, ${s.alpha * 0.9})`)
    sg.addColorStop(1, `rgba(${s.tint}, 0)`)
    ctx.fillStyle = sg
    ctx.fillRect(-size, s.y - s.h * 0.5, size * 2, s.h)
  })
  ctx.restore()

  ctx.save()
  ctx.translate(size * 0.5, size * 0.5)
  ctx.strokeStyle = 'rgba(229, 201, 155, 0.22)'
  ctx.lineWidth = 2
  ctx.setLineDash([14, 10])
  ctx.beginPath()
  ctx.arc(0, 0, 220, 0, Math.PI * 2)
  ctx.stroke()
  ctx.restore()

  const colorTex = new THREE.CanvasTexture(colorCanvas)
  colorTex.colorSpace = THREE.SRGBColorSpace
  colorTex.anisotropy = maxAnisotropy
  return colorTex
}

function buildInscriptionTextures(inscription = 'SketchySaturn92', maxAnisotropy = 4) {
  const w = 2048
  const h = 1024

  const colorCanvas = document.createElement('canvas')
  colorCanvas.width = w
  colorCanvas.height = h
  const ctx = colorCanvas.getContext('2d')

  const emissiveCanvas = document.createElement('canvas')
  emissiveCanvas.width = w
  emissiveCanvas.height = h
  const eCtx = emissiveCanvas.getContext('2d')

  const draw = () => {
    ctx.clearRect(0, 0, w, h)
    eCtx.clearRect(0, 0, w, h)

    const fontFamily = '"Cormorant Garamond", "Instrument Serif", Georgia, serif'

    ctx.save()
    ctx.translate(w * 0.5, h * 0.47)
    ctx.scale(1, 1.42)
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    if ('letterSpacing' in ctx) ctx.letterSpacing = '6px'
    ctx.font = `500 206px ${fontFamily}`

    ctx.fillStyle = 'rgba(6, 7, 12, 0.78)'
    ctx.fillText(inscription, 0, 6)

    const textGrad = ctx.createLinearGradient(-780, -70, 780, 70)
    textGrad.addColorStop(0, '#e5c99b')
    textGrad.addColorStop(0.46, '#f8efe0')
    textGrad.addColorStop(0.78, '#e8cfa4')
    textGrad.addColorStop(1, '#a8c6fa')
    ctx.fillStyle = textGrad
    ctx.fillText(inscription, 0, 0)

    if ('letterSpacing' in ctx) ctx.letterSpacing = '15px'
    ctx.font = '400 26px "DM Mono", monospace'
    ctx.fillStyle = 'rgba(229, 201, 155, 0.52)'
    ctx.fillText('STARPORT · SS-92 SATURN CLIPPER', 0, 134)
    ctx.restore()

    eCtx.save()
    eCtx.translate(w * 0.5, h * 0.47)
    eCtx.scale(1, 1.42)
    eCtx.textAlign = 'center'
    eCtx.textBaseline = 'middle'
    if ('letterSpacing' in eCtx) eCtx.letterSpacing = '6px'
    eCtx.font = `500 206px ${fontFamily}`
    eCtx.fillStyle = '#f5dfb8'
    eCtx.fillText(inscription, 0, 0)
    eCtx.restore()
  }

  draw()

  const colorTex = new THREE.CanvasTexture(colorCanvas)
  colorTex.colorSpace = THREE.SRGBColorSpace
  colorTex.anisotropy = maxAnisotropy

  const emissiveTex = new THREE.CanvasTexture(emissiveCanvas)
  emissiveTex.colorSpace = THREE.SRGBColorSpace
  emissiveTex.anisotropy = maxAnisotropy

  return {
    colorTex,
    emissiveTex,
    refresh: () => {
      draw()
      colorTex.needsUpdate = true
      emissiveTex.needsUpdate = true
    },
  }
}

function createClayAnimal(spec, trackedDisposables) {
  const root = new THREE.Group()
  const bodyRig = new THREE.Group()
  root.add(bodyRig)

  const makeMat = (color, roughness = 0.8, metalness = 0.04) => {
    const mat = new THREE.MeshStandardMaterial({ color, roughness, metalness })
    trackedDisposables.push(mat)
    return mat
  }

  const reg = (geo) => {
    trackedDisposables.push(geo)
    return geo
  }

  const furMat = makeMat(spec.fur, 0.82, 0.03)
  const creamMat = makeMat(spec.cream || '#f5efe6', 0.78, 0.02)
  const darkMat = makeMat(spec.dark || '#28242a', 0.76, 0.05)
  const accentMat = makeMat(spec.accent || '#8ab4f8', 0.72, 0.08)
  const innerEarMat = makeMat(spec.innerEar || '#e5b8b0', 0.82, 0.02)

  const isBunny = spec.species === 'bunny'

  const makePawLeg = (x, z, useDarkPaw = false) => {
    const pivot = new THREE.Group()
    pivot.position.set(x, 0.25, z)

    const legGeo = reg(new THREE.CapsuleGeometry(0.068, 0.14, 8, 12))
    const leg = new THREE.Mesh(legGeo, useDarkPaw ? darkMat : furMat)
    leg.position.y = -0.09
    leg.castShadow = true
    pivot.add(leg)

    const pawGeo = reg(new THREE.SphereGeometry(0.072, 10, 10))
    pawGeo.scale(1.0, 0.68, 1.22)
    const paw = new THREE.Mesh(
      pawGeo,
      spec.whitePaws ? creamMat : useDarkPaw ? darkMat : furMat,
    )
    paw.position.set(0, -0.2, 0.022)
    pivot.add(paw)

    bodyRig.add(pivot)
    return pivot
  }

  const darkLegs = spec.species === 'raccoon' || spec.species === 'fox'
  const legSpreadX = isBunny ? 0.14 : 0.155
  const legFrontZ = isBunny ? 0.14 : 0.21
  const legBackZ = isBunny ? -0.15 : -0.22

  const frontLeft = makePawLeg(-legSpreadX, legFrontZ, darkLegs)
  const frontRight = makePawLeg(legSpreadX, legFrontZ, darkLegs)
  const backLeft = makePawLeg(-legSpreadX, legBackZ, darkLegs)
  const backRight = makePawLeg(legSpreadX, legBackZ, darkLegs)

  if (isBunny) {
    const torsoGeo = reg(new THREE.SphereGeometry(0.26, 20, 16))
    torsoGeo.scale(0.95, 1.12, 1.08)
    const torso = new THREE.Mesh(torsoGeo, furMat)
    torso.position.set(0, 0.39, -0.02)
    torso.rotation.x = -0.28
    torso.castShadow = true
    bodyRig.add(torso)
  } else {
    const bodyRadius = spec.species === 'raccoon' ? 0.235 : 0.205
    const bodyLen = spec.species === 'cat' ? 0.34 : 0.28
    const torsoGeo = reg(new THREE.CapsuleGeometry(bodyRadius, bodyLen, 12, 18))
    const torso = new THREE.Mesh(torsoGeo, furMat)
    torso.rotation.x = Math.PI * 0.5
    torso.position.set(0, 0.4, 0)
    torso.castShadow = true
    bodyRig.add(torso)

    const chestGeo = reg(new THREE.SphereGeometry(bodyRadius * 0.88, 14, 12))
    chestGeo.scale(0.9, 0.94, 0.78)
    const chest = new THREE.Mesh(chestGeo, creamMat)
    chest.position.set(0, 0.41, bodyLen * 0.52)
    bodyRig.add(chest)

    if (spec.species === 'cat' && spec.saddle) {
      const saddleMat = makeMat(spec.saddle, 0.82, 0.03)
      const saddleGeo = reg(new THREE.SphereGeometry(0.212, 16, 12))
      saddleGeo.scale(0.96, 0.72, 1.18)
      const saddle = new THREE.Mesh(saddleGeo, saddleMat)
      saddle.position.set(0, 0.47, -0.03)
      bodyRig.add(saddle)
    }
  }

  const neckPos = isBunny ? [0, 0.58, 0.1] : [0, 0.51, 0.22]
  const collarGeo = reg(new THREE.TorusGeometry(isBunny ? 0.17 : 0.185, 0.042, 10, 20))
  const collar = new THREE.Mesh(collarGeo, accentMat)
  collar.position.set(neckPos[0], neckPos[1], neckPos[2])
  collar.rotation.x = Math.PI * 0.5 + (isBunny ? 0.15 : 0.38)
  bodyRig.add(collar)

  const headPivot = new THREE.Group()
  headPivot.position.set(0, isBunny ? 0.74 : 0.67, isBunny ? 0.12 : 0.27)
  bodyRig.add(headPivot)

  const headColorMat =
    spec.species === 'cat' && spec.saddle ? makeMat(spec.saddle, 0.82, 0.03) : furMat
  const headGeo = reg(new THREE.SphereGeometry(0.225, 20, 16))
  headGeo.scale(1.06, 0.96, 0.98)
  const head = new THREE.Mesh(headGeo, headColorMat)
  head.castShadow = true
  headPivot.add(head)

  const snoutLen = spec.species === 'fox' ? 1.32 : spec.species === 'bunny' ? 0.78 : 1.05
  const snoutGeo = reg(new THREE.SphereGeometry(0.095, 14, 10))
  snoutGeo.scale(0.95, 0.78, snoutLen)
  const snout = new THREE.Mesh(snoutGeo, creamMat)
  snout.position.set(0, -0.045, 0.19)
  headPivot.add(snout)

  ;[-1, 1].forEach((side) => {
    const eyeGeo = reg(new THREE.SphereGeometry(0.026, 8, 8))
    const eye = new THREE.Mesh(eyeGeo, darkMat)
    eye.position.set(side * 0.092, 0.028, 0.195)
    headPivot.add(eye)
  })

  const leftEarPivot = new THREE.Group()
  const rightEarPivot = new THREE.Group()
  headPivot.add(leftEarPivot, rightEarPivot)

  if (isBunny) {
    ;[-1, 1].forEach((side) => {
      const ep = side < 0 ? leftEarPivot : rightEarPivot
      ep.position.set(side * 0.095, 0.18, -0.02)
      ep.rotation.z = side * -0.18
      const earGeo = reg(new THREE.CapsuleGeometry(0.056, 0.3, 8, 12))
      earGeo.scale(1.0, 1.0, 0.58)
      const ear = new THREE.Mesh(earGeo, furMat)
      ear.position.y = 0.18
      ep.add(ear)
      const innerGeo = reg(new THREE.CapsuleGeometry(0.032, 0.2, 6, 8))
      const inner = new THREE.Mesh(innerGeo, innerEarMat)
      inner.position.set(0, 0.17, 0.02)
      ep.add(inner)
    })
  } else {
    const earHeight = spec.species === 'fox' ? 0.22 : spec.species === 'raccoon' ? 0.14 : 0.18
    const earRadius = spec.species === 'raccoon' ? 0.078 : 0.072
    ;[-1, 1].forEach((side) => {
      const ep = side < 0 ? leftEarPivot : rightEarPivot
      ep.position.set(side * 0.135, 0.165, -0.01)
      ep.rotation.z = side * -0.28
      const earGeo = reg(
        spec.species === 'raccoon'
          ? new THREE.SphereGeometry(earRadius, 12, 10)
          : new THREE.ConeGeometry(earRadius, earHeight, 14),
      )
      const ear = new THREE.Mesh(earGeo, spec.species === 'fox' ? darkMat : headColorMat)
      ear.position.y = earHeight * 0.42
      ep.add(ear)
    })
  }

  const tailPivot = new THREE.Group()
  tailPivot.position.set(0, isBunny ? 0.28 : 0.44, isBunny ? -0.24 : -0.28)
  bodyRig.add(tailPivot)

  if (spec.species === 'raccoon') {
    const stripeHolder = new THREE.Group()
    stripeHolder.rotation.x = -0.82
    tailPivot.add(stripeHolder)
    for (let i = 0; i < 5; i += 1) {
      const t = i / 4
      const r = 0.088 + Math.sin(t * Math.PI) * 0.048
      const segGeo = reg(new THREE.SphereGeometry(r, 12, 10))
      const seg = new THREE.Mesh(segGeo, i % 2 === 0 ? darkMat : creamMat)
      seg.position.set(0, 0.08 + i * 0.095, -i * 0.02)
      stripeHolder.add(seg)
    }
  } else if (spec.species === 'fox') {
    const brush = new THREE.Group()
    brush.rotation.x = -0.92
    tailPivot.add(brush)
    const mainTailGeo = reg(new THREE.CapsuleGeometry(0.115, 0.26, 8, 12))
    const mainTail = new THREE.Mesh(mainTailGeo, furMat)
    mainTail.position.set(0, 0.2, 0)
    brush.add(mainTail)
    const tipGeo = reg(new THREE.ConeGeometry(0.112, 0.22, 12))
    const tip = new THREE.Mesh(tipGeo, creamMat)
    tip.position.set(0, 0.41, 0)
    brush.add(tip)
  } else if (spec.species === 'shiba') {
    const curlGeo = reg(new THREE.TorusGeometry(0.092, 0.048, 8, 16, Math.PI * 1.45))
    const curl = new THREE.Mesh(curlGeo, furMat)
    curl.position.set(0, 0.11, -0.02)
    curl.rotation.y = Math.PI * 0.5
    tailPivot.add(curl)
  } else if (spec.species === 'cat') {
    const catTailMat = spec.saddle ? makeMat(spec.saddle, 0.82, 0.03) : furMat
    for (let i = 0; i < 5; i += 1) {
      const segGeo = reg(new THREE.SphereGeometry(0.046, 10, 8))
      const seg = new THREE.Mesh(segGeo, i === 4 ? creamMat : catTailMat)
      seg.position.set(0, 0.06 + i * 0.085, -0.03 - Math.sin(i * 0.65) * 0.05)
      tailPivot.add(seg)
    }
  } else {
    const puffGeo = reg(new THREE.SphereGeometry(0.095, 12, 10))
    const puff = new THREE.Mesh(puffGeo, creamMat)
    tailPivot.add(puff)
  }

  root.scale.setScalar(spec.scale || 0.56)

  return {
    group: root,
    bodyRig,
    frontLeft,
    frontRight,
    backLeft,
    backRight,
    headPivot,
    tailPivot,
    spec,
  }
}

export default function OpeningMotion({ copy, onPortalOpen, onComplete }) {
  const stageRef = useRef(null)
  const webglWrapRef = useRef(null)
  const hudRef = useRef(null)
  const hudFillRef = useRef(null)
  const hudCodeRef = useRef(null)

  const speedRef = useRef(1)
  const portalNotifiedRef = useRef(false)
  const completedRef = useRef(false)

  const callbacksRef = useRef({ onPortalOpen, onComplete })
  callbacksRef.current = { onPortalOpen, onComplete }

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      callbacksRef.current.onPortalOpen?.()
      callbacksRef.current.onComplete?.()
      return undefined
    }

    const stage = stageRef.current
    const wrap = webglWrapRef.current
    if (!stage || !wrap) return undefined

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
      callbacksRef.current.onPortalOpen?.()
      callbacksRef.current.onComplete?.()
      return undefined
    }

    renderer.setPixelRatio(dpr)
    renderer.setSize(width, height)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.12
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    wrap.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    scene.background = new THREE.Color('#04060d')
    scene.fog = new THREE.FogExp2('#04060d', 0.022)

    const camera = new THREE.PerspectiveCamera(28, width / height, 0.1, 160)
    camera.position.set(0, 9.2, 12.0)
    camera.lookAt(0, 0.25, 0.1)

    const trackedDisposables = []

    const hemiLight = new THREE.HemisphereLight('#cfe0ff', '#1a1524', 1.25)
    scene.add(hemiLight)

    const keyLight = new THREE.DirectionalLight('#fff1d8', 2.45)
    keyLight.position.set(8.4, 12.5, -2.4)
    keyLight.castShadow = true
    keyLight.shadow.mapSize.width = 2048
    keyLight.shadow.mapSize.height = 2048
    keyLight.shadow.camera.near = 2
    keyLight.shadow.camera.far = 36
    const shadowBound = 8.5
    keyLight.shadow.camera.left = -shadowBound
    keyLight.shadow.camera.right = shadowBound
    keyLight.shadow.camera.top = shadowBound
    keyLight.shadow.camera.bottom = -shadowBound
    keyLight.shadow.bias = -0.0005
    keyLight.shadow.radius = 4.5
    scene.add(keyLight)

    const rimLight = new THREE.DirectionalLight('#7db4ff', 0.85)
    rimLight.position.set(-7.5, 6.0, 4.0)
    scene.add(rimLight)

    const maxAniso = renderer.capabilities.getMaxAnisotropy()
    const floorColorTex = buildFloorTextures(maxAniso)
    const inscriptionTextures = buildInscriptionTextures('SketchySaturn92', maxAniso)
    trackedDisposables.push(
      floorColorTex,
      inscriptionTextures.colorTex,
      inscriptionTextures.emissiveTex,
    )

    let unmounted = false
    if (document.fonts?.load) {
      Promise.all([
        document.fonts.load('500 180px "Cormorant Garamond"'),
        document.fonts.load('400 28px "DM Mono"'),
      ])
        .then(() => {
          if (!unmounted) inscriptionTextures.refresh()
        })
        .catch(() => {})
    }

    const floorGeo = new THREE.PlaneGeometry(28, 28)
    const floorMat = new THREE.MeshStandardMaterial({
      map: floorColorTex,
      roughness: 0.88,
      metalness: 0.05,
    })
    trackedDisposables.push(floorGeo, floorMat)

    const floorMesh = new THREE.Mesh(floorGeo, floorMat)
    floorMesh.rotation.x = -Math.PI * 0.5
    floorMesh.receiveShadow = true
    scene.add(floorMesh)

    const inlayGeo = new THREE.PlaneGeometry(6.8, 3.4)
    const inlayMat = new THREE.MeshStandardMaterial({
      map: inscriptionTextures.colorTex,
      emissiveMap: inscriptionTextures.emissiveTex,
      emissive: new THREE.Color('#f5dfb8'),
      emissiveIntensity: 0.28,
      transparent: true,
      roughness: 0.62,
      metalness: 0.18,
      depthWrite: false,
    })
    trackedDisposables.push(inlayGeo, inlayMat)

    const inlayMesh = new THREE.Mesh(inlayGeo, inlayMat)
    inlayMesh.rotation.x = -Math.PI * 0.5
    inlayMesh.position.set(0, 0.006, 0.25)
    inlayMesh.receiveShadow = true
    scene.add(inlayMesh)

    // Galactic Starfield high above for smooth warp transition
    const spaceStarsCount = 950
    const starPositions = new Float32Array(spaceStarsCount * 3)
    for (let i = 0; i < spaceStarsCount; i += 1) {
      starPositions[i * 3] = (Math.random() - 0.5) * 80
      starPositions[i * 3 + 1] = 2 + Math.random() * 58
      starPositions[i * 3 + 2] = -65 + Math.random() * 72
    }
    const starGeo = new THREE.BufferGeometry()
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3))
    const starMat = new THREE.PointsMaterial({
      color: '#f4efe6',
      size: 0.14,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    trackedDisposables.push(starGeo, starMat)
    scene.add(new THREE.Points(starGeo, starMat))

    // -------------------------------------------------------------------------
    // MAJESTIC SCALED-UP SS-92 SATURN CLIPPER (scale = 1.48, parked cleanly!)
    // At scale 1.48 and yaw = 0.26 (nose angled slightly front-left so camera sees the port boarding ramp clearly!):
    // Landing gear pads sit at local y = -0.455 -> world y = 0 when ship.position.y = 0.67!
    // -------------------------------------------------------------------------
    const SHIP_SCALE = 1.48
    const SHIP_PARK_X = 0.65
    const SHIP_PARK_Y = 0.67
    const SHIP_PARK_Z = -0.15
    const SHIP_PARK_YAW = 0.24

    const starship = createHeroSpacecraft(trackedDisposables, { showMiniCrew: false })
    starship.group.scale.setScalar(SHIP_SCALE)
    starship.landingGearGroup.visible = true
    starship.rampGroup.visible = true
    starship.rampGroup.scale.set(0.01, 1, 1)
    scene.add(starship.group)

    // Helper to convert Starship local coordinates (when parked) to exact World coordinates!
    const parkedMatrix = new THREE.Matrix4().compose(
      new THREE.Vector3(SHIP_PARK_X, SHIP_PARK_Y, SHIP_PARK_Z),
      new THREE.Quaternion().setFromEuler(new THREE.Euler(0, SHIP_PARK_YAW, 0)),
      new THREE.Vector3(SHIP_SCALE, SHIP_SCALE, SHIP_SCALE),
    )
    const toWorldParked = (lx, ly, lz) =>
      new THREE.Vector3(lx, ly, lz).applyMatrix4(parkedMatrix)

    // Exact Ramp Foot & Ramp Top Sill in World Coordinates (100% clear of wings, fins, and warp ring!)
    const worldRampSill = toWorldParked(-0.34, 0.28, -0.68)
    const worldRampFoot = toWorldParked(-1.42, -0.455, -0.68)
    worldRampFoot.y = 0

    // Ordered Queue Waiting Spots outside the Ramp Foot on the port-front floor (angled forward away from wing!)
    const queueDir = new THREE.Vector3()
      .subVectors(worldRampFoot, worldRampSill)
      .setY(0)
      .normalize()
      .add(new THREE.Vector3(-0.2, 0, -0.58))
      .normalize()

    // Five Realistic Pet-Scaled Clay Animals (scale = 0.54, ~1/3 ship width -> zero clipping!)
    const animalSpecs = [
      {
        species: 'raccoon',
        startX: -1.45,
        startZ: 1.95,
        strideFreq: 8.2,
        strideAmp: 0.45,
        tailFreq: 5.8,
        tailAmp: 0.28,
        phaseOffset: 0.1,
        fur: '#948b87',
        cream: '#f6f0e6',
        dark: '#2b262c',
        accent: '#84b0f6',
        scale: 0.56,
      },
      {
        species: 'shiba',
        startX: -3.25,
        startZ: 0.25,
        strideFreq: 8.6,
        strideAmp: 0.46,
        tailFreq: 9.0,
        tailAmp: 0.32,
        phaseOffset: 1.1,
        fur: '#dfa25f',
        cream: '#f7f0e4',
        accent: '#d9725b',
        whitePaws: true,
        scale: 0.54,
      },
      {
        species: 'bunny',
        startX: -2.55,
        startZ: 2.55,
        strideFreq: 7.4,
        strideAmp: 0.36,
        tailFreq: 6.0,
        tailAmp: 0.16,
        phaseOffset: 2.0,
        fur: '#f3ebe0',
        cream: '#fbf7f0',
        innerEar: '#e4b3ac',
        accent: '#75b0e8',
        scale: 0.54,
      },
      {
        species: 'cat',
        startX: -3.65,
        startZ: 1.65,
        strideFreq: 7.8,
        strideAmp: 0.38,
        tailFreq: 3.6,
        tailAmp: 0.34,
        phaseOffset: 0.8,
        fur: '#e4e6ee',
        saddle: '#6d7591',
        cream: '#f8f5ef',
        accent: '#e5c99b',
        whitePaws: true,
        scale: 0.53,
      },
      {
        species: 'fox',
        startX: -2.65,
        startZ: -1.65,
        strideFreq: 8.0,
        strideAmp: 0.44,
        tailFreq: 4.6,
        tailAmp: 0.26,
        phaseOffset: 2.7,
        fur: '#d87745',
        cream: '#f7f1ea',
        dark: '#262126',
        accent: '#9d86e9',
        scale: 0.54,
      },
    ]

    const animals = animalSpecs.map((spec, idx) => {
      const a = createClayAnimal(spec, trackedDisposables)
      a.group.position.set(spec.startX, 0, spec.startZ)

      // Precompute each animal's neat single-file queue spot outside the ramp foot, and exact cabin seat!
      const qDist = 0.42 + idx * 0.58
      const lateralFan = (idx - 2) * 0.16
      const queueSpot = worldRampFoot
        .clone()
        .addScaledVector(queueDir, qDist)
        .add(new THREE.Vector3(-queueDir.z * lateralFan, 0, queueDir.x * lateralFan))

      const seatSpec = starship.cabinSeats[idx]
      const worldSeat = toWorldParked(seatSpec.x, seatSpec.y, seatSpec.z)

      scene.add(a.group)
      return { ...a, queueSpot, worldSeat }
    })

    const handleResize = () => {
      width = window.innerWidth
      height = window.innerHeight
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }
    window.addEventListener('resize', handleResize)

    let rafId = 0
    let lastTime = performance.now()
    let elapsed = 0
    let passthroughApplied = false
    const tmpPos = new THREE.Vector3()
    const tmpNext = new THREE.Vector3()

    const renderFrame = (now) => {
      const dt = Math.min(64, Math.max(0, now - lastTime))
      lastTime = now
      elapsed += dt * speedRef.current

      const p = clamp(elapsed / TOTAL_DURATION_MS, 0, 1)
      const timeSec = elapsed * 0.001

      if (!portalNotifiedRef.current && p >= 0.84) {
        portalNotifiedRef.current = true
        callbacksRef.current.onPortalOpen?.()
      }

      if (!passthroughApplied && p >= 0.88) {
        passthroughApplied = true
        stage.classList.add('is-passthrough')
      }

      wrap.style.opacity = String(easeOutCubic(phase(p, 0, 0.05)))

      // -----------------------------------------------------------------------
      // 1. STARSHIP TOUCHDOWN -> RAMP & CANOPY DEPLOY -> SEAL -> LIFTOFF!
      // -----------------------------------------------------------------------
      const touchDown = easeOutCubic(phase(p, 0.04, 0.25))
      const liftoff = easeInCubic(phase(p, 0.75, 1.0))

      const shipX = lerp(3.4, SHIP_PARK_X, touchDown) - liftoff * 3.5
      const shipY = lerp(4.8, SHIP_PARK_Y, touchDown) + liftoff * 22.0
      const shipZ = lerp(-5.5, SHIP_PARK_Z, touchDown) - liftoff * 42.0

      starship.group.position.set(shipX, shipY, shipZ)
      const climbPitch = liftoff * 0.52
      const touchRoll = (1 - touchDown) * 0.18
      starship.group.rotation.set(climbPitch, SHIP_PARK_YAW * (1 - liftoff * 0.85), touchRoll)

      // Gull-wing canopy hinges open to starboard (p=0.23..0.31), closes smoothly (p=0.69..0.75)!
      const canopyOpen =
        easeOutCubic(phase(p, 0.23, 0.31)) * (1 - easeInOutCubic(phase(p, 0.69, 0.75)))
      starship.canopyHinge.rotation.z = -canopyOpen * 1.05

      // Port-forward boarding ramp extends smoothly from sill to floor (p=0.25..0.33), retracts (p=0.68..0.74)!
      const rampExtend =
        easeOutCubic(phase(p, 0.25, 0.33)) * (1 - easeInOutCubic(phase(p, 0.68, 0.74)))
      starship.rampGroup.visible = rampExtend > 0.02
      starship.rampGroup.scale.set(Math.max(0.01, rampExtend), 1, 1)

      // Retract landing gear right after liftoff begins (p > 0.77)
      starship.landingGearGroup.visible = p < 0.78

      // Engine throttle: soft idle while parked, full afterburner on liftoff!
      const throttle =
        p < 0.24
          ? 0.38 * (1 - touchDown * 0.7)
          : p < 0.72
            ? 0.12
            : 0.25 + easeOutCubic(phase(p, 0.72, 0.84)) * 1.25
      starship.setThrottle(throttle, timeSec)
      inlayMat.emissiveIntensity = 0.28 + touchDown * 0.65

      // -----------------------------------------------------------------------
      // 2. ZERO-CLIPPING SINGLE-FILE RAMP BOARDING ALGORITHM FOR ALL 5 ANIMALS!
      // -----------------------------------------------------------------------
      const walkToQueue = easeInOutCubic(phase(p, 0.02, 0.31))

      animals.forEach((a, idx) => {
        const { spec, queueSpot, worldSeat } = a

        // Staggered single-file ramp climb window for animal #idx (0..4):
        // Each animal waits at its queue spot, walks to ramp foot, climbs up the inclined ramp to sill,
        // and hops gently into its dedicated cabin seat!
        const bStart = 0.32 + idx * 0.068
        const bEnd = bStart + 0.088
        const bProg = clamp((p - bStart) / (bEnd - bStart), 0, 1)

        if (bProg >= 1) {
          // Seated safely inside the cabin! Switch to the ship-parented seat avatar so it flies with the ship!
          a.group.visible = false
          if (starship.crewSeatMeshes[idx]) {
            starship.crewSeatMeshes[idx].visible = true
          }
          return
        }

        a.group.visible = true
        if (starship.crewSeatMeshes[idx]) {
          starship.crewSeatMeshes[idx].visible = false
        }

        let pitchAngle = 0
        let isMoving = false

        if (p < bStart) {
          // Walking from initial gallery position to neat queue spot outside the ramp
          tmpPos.set(
            lerp(spec.startX, queueSpot.x, walkToQueue),
            0,
            lerp(spec.startZ, queueSpot.z, walkToQueue),
          )
          isMoving = p < 0.305
          // Face toward the boarding ramp sill while waiting in line!
          tmpNext.copy(worldRampFoot)
        } else if (bProg < 0.28) {
          // Segment A: Step from queueSpot onto exact Ramp Foot
          const u = easeInOutCubic(bProg / 0.28)
          tmpPos.lerpVectors(queueSpot, worldRampFoot, u)
          tmpNext.copy(worldRampSill)
          isMoving = true
        } else if (bProg < 0.78) {
          // Segment B: Physically climb UP the 34-deg inclined boarding ramp surface!
          const u = (bProg - 0.28) / 0.5
          tmpPos.lerpVectors(worldRampFoot, worldRampSill, u)
          tmpNext.copy(worldRampSill)
          pitchAngle = -0.46 // Tilt body upward matching ramp incline!
          isMoving = true
        } else {
          // Segment C: Hop over the cabin sill down into its own cabin seat!
          const u = easeOutCubic((bProg - 0.78) / 0.22)
          tmpPos.lerpVectors(worldRampSill, worldSeat, u)
          tmpPos.y += Math.sin(u * Math.PI) * 0.16
          tmpNext.copy(worldSeat).add(new THREE.Vector3(-0.2, 0, -1))
          isMoving = true
        }

        const heading = Math.atan2(tmpNext.x - tmpPos.x, tmpNext.z - tmpPos.z)
        const cycle = timeSec * spec.strideFreq + spec.phaseOffset
        const swing = isMoving ? Math.sin(cycle) * spec.strideAmp : 0
        const trotBob = isMoving ? Math.abs(Math.sin(cycle)) * 0.028 : 0

        a.group.position.set(tmpPos.x, tmpPos.y + trotBob, tmpPos.z)
        if (isMoving) {
          a.group.rotation.y = heading
        }
        a.bodyRig.rotation.x = pitchAngle
        a.frontLeft.rotation.x = swing
        a.backRight.rotation.x = swing
        a.frontRight.rotation.x = -swing
        a.backLeft.rotation.x = -swing
        a.tailPivot.rotation.y = Math.sin(timeSec * spec.tailFreq + spec.phaseOffset) * spec.tailAmp
      })

      // Reveal Deep-Space Stars during liftoff
      starMat.opacity = easeOutCubic(phase(p, 0.7, 0.9)) * 0.95

      // Camera Choreography:
      // Frames the port-front ramp clearly during single-file boarding, then swings behind the thrusters for liftoff!
      const boardCam = easeInOutCubic(phase(p, 0.2, 0.42))
      const chaseCam = easeInCubic(phase(p, 0.74, 1.0))

      const aspectZoom = width < 900 ? 1.18 : 1.0
      const camX = lerp(0, -2.6, boardCam) * (1 - chaseCam * 0.85)
      const camY = (lerp(9.2, 4.3, boardCam) + chaseCam * 16.5) * aspectZoom
      const camZ = (lerp(12.0, 6.8, boardCam) - chaseCam * 28.0) * aspectZoom

      const lookX = lerp(0, -0.2, boardCam) + chaseCam * (shipX - -0.2)
      const lookY = lerp(0.25, 0.78, boardCam) + chaseCam * 21.0
      const lookZ = lerp(0.1, -0.55, boardCam) - chaseCam * 43.0

      camera.position.set(camX, camY, camZ)
      camera.lookAt(lookX, lookY, lookZ)

      renderer.render(scene, camera)

      stage.style.opacity = String(1 - easeInOutCubic(phase(p, 0.88, 1.0)))

      if (hudFillRef.current) {
        hudFillRef.current.style.transform = `scaleX(${p.toFixed(3)})`
      }
      if (hudCodeRef.current) {
        if (p < 0.26) hudCodeRef.current.textContent = '01 · SS-92 LANDING AT STARPORT'
        else if (p < 0.71) hudCodeRef.current.textContent = '02 · CREW BOARDING VIA PORT RAMP'
        else hudCodeRef.current.textContent = '03 · LIFTOFF TO MILKY WAY'
      }
      if (hudRef.current) {
        hudRef.current.style.opacity = String(1 - easeOutCubic(phase(p, 0.82, 0.94)))
      }

      if (p < 1) {
        rafId = window.requestAnimationFrame(renderFrame)
      } else if (!completedRef.current) {
        completedRef.current = true
        callbacksRef.current.onComplete?.()
      }
    }

    rafId = window.requestAnimationFrame(renderFrame)

    return () => {
      unmounted = true
      window.cancelAnimationFrame(rafId)
      window.removeEventListener('resize', handleResize)
      trackedDisposables.forEach((item) => item.dispose?.())
      renderer.dispose()
      if (renderer.domElement.parentNode === wrap) {
        wrap.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div className="om-stage" ref={stageRef} aria-hidden="true">
      <div className="om-webgl-wrap" ref={webglWrapRef} />
      <div className="om-vignette" />

      <div className="om-hud" ref={hudRef}>
        <div className="om-hud__timeline">
          <i className="om-hud__dot" />
          <div className="om-hud__track">
            <div className="om-hud__fill" ref={hudFillRef} />
          </div>
          <span className="om-hud__code" ref={hudCodeRef}>
            01 · SS-92 LANDING AT STARPORT
          </span>
        </div>

        <button
          type="button"
          className="om-skip"
          onClick={() => {
            speedRef.current = 5.5
          }}
        >
          <span>{copy?.skipLabel}</span>
          <ArrowRight size={12} />
        </button>
      </div>
    </div>
  )
}
