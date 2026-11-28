import * as THREE from 'three'

/**
 * Sculpted 3D "SS-92 Saturn Clipper" Hero Spacecraft.
 * Local coordinate convention:
 *   Nose points toward -Z, Stern thrusters at +Z, Dorsal up +Y, Wings along +/-X.
 * Includes:
 *   - Retractable 3-point landing gear struts
 *   - Retractable Port-Forward Boarding Ramp at z = -0.72 (100% clear in front of left wing!)
 *   - Starboard-hinged panoramic crystal canopy + 5 spacious cabin seats
 */
export function createHeroSpacecraft(trackedDisposables, { showMiniCrew = true } = {}) {
  const root = new THREE.Group()

  const reg = (item) => {
    if (trackedDisposables) trackedDisposables.push(item)
    return item
  }

  const hullMat = reg(
    new THREE.MeshStandardMaterial({
      color: '#f1ede4',
      roughness: 0.32,
      metalness: 0.18,
    }),
  )

  const darkCarbonMat = reg(
    new THREE.MeshStandardMaterial({
      color: '#2c364f',
      emissive: '#101726',
      emissiveIntensity: 0.25,
      roughness: 0.46,
      metalness: 0.22,
    }),
  )

  const goldTrimMat = reg(
    new THREE.MeshStandardMaterial({
      color: '#e8cfa4',
      emissive: '#785e37',
      emissiveIntensity: 0.28,
      roughness: 0.32,
      metalness: 0.32,
    }),
  )

  const cyanGlowMat = reg(
    new THREE.MeshStandardMaterial({
      color: '#8cc8ff',
      emissive: '#5eaeff',
      emissiveIntensity: 1.4,
      roughness: 0.15,
      metalness: 0.2,
    }),
  )

  const canopyGlassMat = reg(
    new THREE.MeshStandardMaterial({
      color: '#9ec8ff',
      emissive: '#1e3a68',
      emissiveIntensity: 0.35,
      transparent: true,
      opacity: 0.36,
      roughness: 0.06,
      metalness: 0.25,
      side: THREE.DoubleSide,
    }),
  )

  // ---------------------------------------------------------------------------
  // 1. SLEEK AERODYNAMIC TEARDROP FUSELAGE (Nose -> -Z, Stern -> +Z)
  // ---------------------------------------------------------------------------
  const profilePts = []
  const steps = 28
  for (let i = 0; i <= steps; i += 1) {
    const t = i / steps
    const radius =
      Math.sin(Math.pow(t, 0.62) * Math.PI) * 0.56 + (t > 0.75 ? (t - 0.75) * 0.28 : 0)
    const y = (t - 0.5) * 3.8
    profilePts.push(new THREE.Vector2(Math.max(0.015, radius), y))
  }

  const latheGeo = reg(new THREE.LatheGeometry(profilePts, 36))
  latheGeo.rotateX(Math.PI * 0.5)
  latheGeo.scale(0.94, 0.62, 1.0)

  const fuselage = new THREE.Mesh(latheGeo, hullMat)
  fuselage.castShadow = true
  fuselage.receiveShadow = true
  root.add(fuselage)

  const bellyGeo = reg(latheGeo.clone())
  bellyGeo.scale(0.96, 0.52, 0.98)
  const belly = new THREE.Mesh(bellyGeo, darkCarbonMat)
  belly.position.y = -0.09
  root.add(belly)

  const noseConeGeo = reg(new THREE.ConeGeometry(0.14, 0.52, 24))
  noseConeGeo.rotateX(-Math.PI * 0.5)
  const noseCone = new THREE.Mesh(noseConeGeo, goldTrimMat)
  noseCone.position.set(0, -0.01, -2.02)
  root.add(noseCone)

  const spineGeo = reg(new THREE.BoxGeometry(0.06, 0.07, 1.65))
  const spine = new THREE.Mesh(spineGeo, goldTrimMat)
  spine.position.set(0, 0.31, 0.72)
  root.add(spine)

  // ---------------------------------------------------------------------------
  // 2. SWEPT AFT DELTA WINGS (Positioned z > 0.05 so forward cabin z = -0.72 is 100% clear!)
  // ---------------------------------------------------------------------------
  const wingShape = new THREE.Shape()
  wingShape.moveTo(0.34, -0.25)
  wingShape.lineTo(1.88, 0.68)
  wingShape.lineTo(1.96, 1.12)
  wingShape.lineTo(0.42, 1.22)
  wingShape.closePath()

  const wingExtrude = reg(
    new THREE.ExtrudeGeometry(wingShape, {
      depth: 0.055,
      bevelEnabled: true,
      bevelThickness: 0.022,
      bevelSize: 0.03,
      bevelSegments: 3,
    }),
  )
  wingExtrude.rotateX(Math.PI * 0.5)

  const rightWing = new THREE.Mesh(wingExtrude, hullMat)
  rightWing.position.set(0, -0.02, 0.22)
  rightWing.rotation.z = -0.05
  rightWing.castShadow = true
  root.add(rightWing)

  const leftWing = new THREE.Mesh(wingExtrude, hullMat)
  leftWing.scale.x = -1
  leftWing.position.set(0, -0.02, 0.22)
  leftWing.rotation.z = 0.05
  leftWing.castShadow = true
  root.add(leftWing)

  ;[-1, 1].forEach((side) => {
    const finGeo = reg(new THREE.BoxGeometry(0.045, 0.44, 0.56))
    const fin = new THREE.Mesh(finGeo, darkCarbonMat)
    fin.position.set(side * 1.9, 0.16, 1.08)
    fin.rotation.z = side * -0.32
    fin.rotation.x = 0.22
    root.add(fin)

    const trimGeo = reg(new THREE.CylinderGeometry(0.02, 0.02, 1.82, 10))
    const trim = new THREE.Mesh(trimGeo, goldTrimMat)
    trim.position.set(side * 1.12, 0.0, 0.42)
    trim.rotation.z = Math.PI * 0.5
    trim.rotation.y = side * -0.54
    root.add(trim)

    const navLightGeo = reg(new THREE.SphereGeometry(0.045, 10, 10))
    const navMat = reg(
      new THREE.MeshBasicMaterial({
        color: side > 0 ? '#72d6ff' : '#ff9b73',
      }),
    )
    const nav = new THREE.Mesh(navLightGeo, navMat)
    nav.position.set(side * 1.96, 0.34, 1.2)
    root.add(nav)
  })

  // Twin Stern Dorsal V-Tails
  ;[-1, 1].forEach((side) => {
    const vTailShape = new THREE.Shape()
    vTailShape.moveTo(0, 0)
    vTailShape.lineTo(0.52, 0)
    vTailShape.lineTo(0.78, 0.58)
    vTailShape.lineTo(0.42, 0.6)
    vTailShape.closePath()

    const vTailGeo = reg(
      new THREE.ExtrudeGeometry(vTailShape, {
        depth: 0.035,
        bevelEnabled: true,
        bevelThickness: 0.012,
        bevelSize: 0.015,
      }),
    )
    vTailGeo.rotateY(-Math.PI * 0.5)
    const vTail = new THREE.Mesh(vTailGeo, darkCarbonMat)
    vTail.position.set(side * 0.38, 0.18, 1.08)
    vTail.rotation.z = side * -0.34
    root.add(vTail)
  })

  // ---------------------------------------------------------------------------
  // 3. SPACIOUS FORWARD CABIN WELL, STARBOARD GULL-WING CANOPY & PORT BOARDING RAMP!
  // ---------------------------------------------------------------------------
  const cockpitWellGeo = reg(new THREE.BoxGeometry(0.62, 0.18, 1.16))
  const cockpitWell = new THREE.Mesh(cockpitWellGeo, darkCarbonMat)
  cockpitWell.position.set(0, 0.22, -0.62)
  root.add(cockpitWell)

  // Cabin Coaming Gold Sill
  const sillGeo = reg(new THREE.BoxGeometry(0.68, 0.04, 1.22))
  const sill = new THREE.Mesh(sillGeo, goldTrimMat)
  sill.position.set(0, 0.29, -0.62)
  root.add(sill)

  // Local seat coordinates inside the forward cabin (z = -1.04 .. -0.22)
  const cabinSeats = [
    { x: 0.0, y: 0.28, z: -0.98, color: '#948b87', ears: 'round' }, // Seat 0: Raccoon Captain
    { x: -0.15, y: 0.28, z: -0.72, color: '#dfa25f', ears: 'point' }, // Seat 1: Shiba
    { x: 0.15, y: 0.28, z: -0.72, color: '#f3ebe0', ears: 'bunny' }, // Seat 2: Bunny
    { x: -0.15, y: 0.28, z: -0.42, color: '#6d7591', ears: 'point' }, // Seat 3: Kitten
    { x: 0.15, y: 0.28, z: -0.42, color: '#d87745', ears: 'point' }, // Seat 4: Fox
  ]

  const miniCrewGroup = new THREE.Group()
  root.add(miniCrewGroup)
  const crewSeatMeshes = []

  cabinSeats.forEach((c) => {
    const seatAvatar = new THREE.Group()
    seatAvatar.position.set(c.x, c.y, c.z)
    seatAvatar.visible = showMiniCrew

    const cMat = reg(new THREE.MeshStandardMaterial({ color: c.color, roughness: 0.8 }))
    const torsoGeo = reg(new THREE.SphereGeometry(0.088, 12, 10))
    const torso = new THREE.Mesh(torsoGeo, cMat)
    torso.position.y = 0.04
    seatAvatar.add(torso)

    const hGeo = reg(new THREE.SphereGeometry(0.095, 14, 12))
    const hMesh = new THREE.Mesh(hGeo, cMat)
    hMesh.position.y = 0.15
    seatAvatar.add(hMesh)

    ;[-1, 1].forEach((s) => {
      const eGeo = reg(
        c.ears === 'bunny'
          ? new THREE.CapsuleGeometry(0.022, 0.1, 6, 8)
          : new THREE.ConeGeometry(0.032, 0.075, 10),
      )
      const eMesh = new THREE.Mesh(eGeo, cMat)
      eMesh.position.set(s * 0.055, c.ears === 'bunny' ? 0.27 : 0.23, 0)
      eMesh.rotation.z = s * -0.2
      seatAvatar.add(eMesh)
    })

    miniCrewGroup.add(seatAvatar)
    crewSeatMeshes.push(seatAvatar)
  })

  // Starboard-Hinged Gull-Wing Panoramic Canopy (opens to +X so -X port ramp is 100% open!)
  const canopyHinge = new THREE.Group()
  canopyHinge.position.set(0.34, 0.3, -0.62)
  root.add(canopyHinge)

  const canopyGeo = reg(new THREE.SphereGeometry(0.42, 32, 22, 0, Math.PI * 2, 0, Math.PI * 0.52))
  canopyGeo.scale(0.88, 0.68, 1.92)
  const canopy = new THREE.Mesh(canopyGeo, canopyGlassMat)
  canopy.position.set(-0.34, -0.02, 0)
  canopyHinge.add(canopy)

  const canopyArchGeo = reg(new THREE.TorusGeometry(0.37, 0.018, 10, 32, Math.PI))
  const canopyArch = new THREE.Mesh(canopyArchGeo, goldTrimMat)
  canopyArch.position.set(-0.34, 0.0, -0.18)
  canopyHinge.add(canopyArch)

  // Port-Forward Extendable Boarding Ramp (at z = -0.68, completely in front of left wing!)
  // Sill at (-0.34, 0.26, -0.68) -> Ground foot at (-1.38, -0.46, -0.68) when ship is at y = 0.46!
  const rampGroup = new THREE.Group()
  rampGroup.position.set(-0.34, 0.26, -0.68)
  rampGroup.visible = false
  root.add(rampGroup)

  const rampLen = 1.28
  const rampPlankGeo = reg(new THREE.BoxGeometry(rampLen, 0.032, 0.36))
  rampPlankGeo.translate(-rampLen * 0.5, 0, 0)
  const rampPlank = new THREE.Mesh(rampPlankGeo, darkCarbonMat)
  rampPlank.castShadow = true
  rampPlank.receiveShadow = true
  rampGroup.add(rampPlank)

  // Glowing side guide rails on the boarding ramp
  ;[-0.165, 0.165].forEach((rz) => {
    const railGeo = reg(new THREE.BoxGeometry(rampLen, 0.022, 0.022))
    railGeo.translate(-rampLen * 0.5, 0.026, rz)
    const rail = new THREE.Mesh(railGeo, goldTrimMat)
    rampGroup.add(rail)
  })

  // Step treads along the ramp
  for (let s = 1; s <= 6; s += 1) {
    const treadGeo = reg(new THREE.BoxGeometry(0.02, 0.012, 0.28))
    treadGeo.translate((-rampLen / 7) * s, 0.02, 0)
    rampGroup.add(new THREE.Mesh(treadGeo, cyanGlowMat))
  }
  // Angle ramp downward at ~34.5 deg so (-1.05, -0.72, 0) touches y=0 when ship is at y=0.46
  rampGroup.rotation.z = 0.6

  // Retractable 3-Point Landing Gear Struts
  const landingGearGroup = new THREE.Group()
  landingGearGroup.visible = false
  root.add(landingGearGroup)
  ;[
    [0, -0.28, -1.25],
    [-0.78, -0.22, 0.55],
    [0.78, -0.22, 0.55],
  ].forEach(([gx, gy, gz]) => {
    const strutGeo = reg(new THREE.CylinderGeometry(0.025, 0.025, 0.28, 10))
    const strut = new THREE.Mesh(strutGeo, darkCarbonMat)
    strut.position.set(gx, gy - 0.06, gz)
    landingGearGroup.add(strut)

    const padGeo = reg(new THREE.CylinderGeometry(0.085, 0.095, 0.03, 14))
    const pad = new THREE.Mesh(padGeo, goldTrimMat)
    pad.position.set(gx, -0.44, gz)
    landingGearGroup.add(pad)
  })

  // ---------------------------------------------------------------------------
  // 4. SIGNATURE GYROSCOPIC "SATURN-92" WARP RING (Aft z = +0.92)
  // ---------------------------------------------------------------------------
  const warpRingGroup = new THREE.Group()
  warpRingGroup.position.set(0, 0.02, 0.92)
  warpRingGroup.rotation.x = 0.22
  root.add(warpRingGroup)

  const outerWarpGeo = reg(new THREE.TorusGeometry(1.08, 0.032, 14, 64))
  warpRingGroup.add(new THREE.Mesh(outerWarpGeo, goldTrimMat))

  const innerWarpGeo = reg(new THREE.TorusGeometry(0.98, 0.016, 10, 56))
  warpRingGroup.add(new THREE.Mesh(innerWarpGeo, cyanGlowMat))

  for (let i = 0; i < 4; i += 1) {
    const a = (i * Math.PI) / 2
    const nodeGeo = reg(new THREE.SphereGeometry(0.055, 12, 10))
    const node = new THREE.Mesh(nodeGeo, cyanGlowMat)
    node.position.set(Math.cos(a) * 1.03, Math.sin(a) * 1.03, 0)
    warpRingGroup.add(node)
  }

  // ---------------------------------------------------------------------------
  // 5. TRIPLE ION-PLASMA ENGINE NACELLES & SHOCK-DIAMOND PLUMES (+Z STERN)
  // ---------------------------------------------------------------------------
  const plumeOuterMat = reg(
    new THREE.MeshBasicMaterial({
      color: '#5eaaff',
      transparent: true,
      opacity: 0.78,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  )
  const plumeCoreMat = reg(
    new THREE.MeshBasicMaterial({
      color: '#fff4d8',
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  )

  const plumes = []
  const enginePositions = [
    { x: 0, y: 0.0, z: 1.85, r: 0.24, plumeLen: 2.3 },
    { x: -0.58, y: -0.02, z: 1.52, r: 0.16, plumeLen: 1.65 },
    { x: 0.58, y: -0.02, z: 1.52, r: 0.16, plumeLen: 1.65 },
  ]

  enginePositions.forEach((ep) => {
    const bellGeo = reg(new THREE.CylinderGeometry(ep.r * 0.78, ep.r, 0.42, 24))
    bellGeo.rotateX(Math.PI * 0.5)
    const bell = new THREE.Mesh(bellGeo, darkCarbonMat)
    bell.position.set(ep.x, ep.y, ep.z)
    root.add(bell)

    const rimGeo = reg(new THREE.TorusGeometry(ep.r, 0.02, 10, 24))
    const rim = new THREE.Mesh(rimGeo, goldTrimMat)
    rim.position.set(ep.x, ep.y, ep.z + 0.21)
    root.add(rim)

    const coreDiskGeo = reg(new THREE.CircleGeometry(ep.r * 0.82, 20))
    const coreDisk = new THREE.Mesh(coreDiskGeo, cyanGlowMat)
    coreDisk.position.set(ep.x, ep.y, ep.z + 0.2)
    root.add(coreDisk)

    const plumeHolder = new THREE.Group()
    plumeHolder.position.set(ep.x, ep.y, ep.z + 0.21)
    root.add(plumeHolder)

    const outGeo = reg(new THREE.ConeGeometry(ep.r * 0.95, ep.plumeLen, 20))
    outGeo.translate(0, -ep.plumeLen * 0.5, 0)
    outGeo.rotateX(-Math.PI * 0.5)
    plumeHolder.add(new THREE.Mesh(outGeo, plumeOuterMat))

    const inGeo = reg(new THREE.ConeGeometry(ep.r * 0.52, ep.plumeLen * 0.68, 16))
    inGeo.translate(0, -ep.plumeLen * 0.34, 0)
    inGeo.rotateX(-Math.PI * 0.5)
    plumeHolder.add(new THREE.Mesh(inGeo, plumeCoreMat))

    plumes.push(plumeHolder)
  })

  const engineLight = new THREE.PointLight('#74b8ff', 3.5, 12)
  engineLight.position.set(0, 0, 2.5)
  root.add(engineLight)

  return {
    group: root,
    warpRingGroup,
    canopyHinge,
    rampGroup,
    landingGearGroup,
    miniCrewGroup,
    crewSeatMeshes,
    cabinSeats,
    plumes,
    engineLight,
    setThrottle(power = 1, timeSec = 0) {
      const flicker = 0.9 + Math.sin(timeSec * 46) * 0.1
      const p = Math.max(0, power)
      plumeOuterMat.opacity = Math.min(0.88, p * 0.78) * flicker
      plumeCoreMat.opacity = Math.min(1, p * 0.96) * flicker
      plumes.forEach((pl, idx) => {
        const s = Math.max(0.01, (0.35 + p * 0.85) * (idx === 0 ? flicker : 2 - flicker))
        pl.scale.set(1, 1, s)
      })
      engineLight.intensity = p * 5.5
      warpRingGroup.rotation.z = timeSec * (0.9 + p * 1.1)
    },
  }
}
