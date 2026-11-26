'use client';

import React, { useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { createSphereTextureSet } from '@/lib/sphereTextures';
import { SPHERE_MODE_PALETTES } from '@/constants/sphereWired';
import type { SphereEnergyMode } from '@/types/sphereWired';

gsap.registerPlugin(useGSAP);

interface WiredSphereCanvasProps {
  scrollProgressRef: React.MutableRefObject<number>;
  energyMode?: SphereEnergyMode;
}

// Pre-allocated math helpers outside render loop (zero GC per frame)
const _targetColorRim = new THREE.Color();
const _targetColorEmissive = new THREE.Color();
const _targetColorAccent = new THREE.Color();
const _nodeMatrix = new THREE.Matrix4();
const _nodePos = new THREE.Vector3();
const _nodeQuat = new THREE.Quaternion();
const _nodeScale = new THREE.Vector3();

function detectSoftwareWebGL(): boolean {
  try {
    const probeCanvas = document.createElement('canvas');
    const gl = probeCanvas.getContext('webgl2');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param));
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return true;
  }
}

export default function WiredSphereCanvas({
  scrollProgressRef,
  energyMode = 'mesh',
}: WiredSphereCanvasProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const fallbackRef = useRef<HTMLDivElement | null>(null);
  const modeRef = useRef<SphereEnergyMode>(energyMode);

  useGSAP(() => {
    modeRef.current = energyMode;
  }, [energyMode]);

  useGSAP(
    () => {
    const container = mountRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const isSoftwareGl = detectSoftwareWebGL();

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      fallbackRef.current?.classList.remove('hidden');
      fallbackRef.current?.classList.add('flex');
      return;
    }

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.setPixelRatio(
      isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2)
    );
    renderer.setClearColor(0x000000, 0);

    const initialWidth = container.clientWidth || window.innerWidth;
    const initialHeight = container.clientHeight || window.innerHeight;
    renderer.setSize(initialWidth, initialHeight);
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      36,
      initialWidth / initialHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 9.6);

    // Mandatory studio environment reflection for dark chrome & titanium bevels
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envRT = pmremGenerator.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envRT.texture;
    pmremGenerator.dispose();

    // Procedural PBR textures
    const maxAniso = renderer.capabilities.getMaxAnisotropy();
    const textures = createSphereTextureSet(maxAniso);

    // Master sphere rig positioned dynamically for desktop vs mobile
    const rigGroup = new THREE.Group();
    scene.add(rigGroup);

    // Interactive rotating core group (multi-part composite procedural sculpture)
    const sphereAssembly = new THREE.Group();
    rigGroup.add(sphereAssembly);

    const disposables: Array<{ dispose: () => void }> = [];

    // --- MATERIALS (Varied roughness >= 0.25 & metalness for sculptural depth) ---
    const coreArmorMat = new THREE.MeshPhysicalMaterial({
      color: 0x261d3d,
      map: textures.albedoMap,
      bumpMap: textures.bumpMap,
      bumpScale: 0.14,
      roughnessMap: textures.roughnessMap,
      roughness: 0.92,
      metalness: 0.96,
      clearcoat: 0.9,
      clearcoatRoughness: 0.14,
      emissive: new THREE.Color(0xb968ff),
      emissiveMap: textures.emissiveMap,
      emissiveIntensity: 1.55,
      envMapIntensity: 1.35,
    });
    disposables.push(coreArmorMat);

    const polishedChromeMat = new THREE.MeshPhysicalMaterial({
      color: 0x2d2248,
      metalness: 0.98,
      roughness: 0.12,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      envMapIntensity: 1.7,
    });
    disposables.push(polishedChromeMat);

    const satinTitaniumMat = new THREE.MeshStandardMaterial({
      color: 0x161026,
      metalness: 0.82,
      roughness: 0.44,
      envMapIntensity: 1.1,
    });
    disposables.push(satinTitaniumMat);

    const fiberVeinMat = new THREE.MeshStandardMaterial({
      color: 0xe9d5ff,
      emissive: new THREE.Color(0xc084fc),
      emissiveIntensity: 2.2,
      roughness: 0.2,
      metalness: 0.4,
    });
    disposables.push(fiberVeinMat);

    // --- PART 1: Primary Sculpted Core Sphere ---
    const coreGeo = new THREE.SphereGeometry(2.14, 72, 72);
    disposables.push(coreGeo);
    const coreMesh = new THREE.Mesh(coreGeo, coreArmorMat);
    sphereAssembly.add(coreMesh);

    // --- PART 2 & 3: Concentric Polar Turbine Crowns (Top-Left & Opposite Pole) ---
    const buildConcentricCrown = (axisDir: THREE.Vector3) => {
      const crownGroup = new THREE.Group();
      const radii = [1.46, 1.24, 1.01, 0.78, 0.56];
      const heights = [1.56, 1.76, 1.91, 2.02, 2.09];

      radii.forEach((radius, idx) => {
        const ringGeo = new THREE.TorusGeometry(
          radius,
          idx % 2 === 0 ? 0.068 : 0.044,
          18,
          64
        );
        disposables.push(ringGeo);
        const ringMesh = new THREE.Mesh(
          ringGeo,
          idx % 2 === 0 ? polishedChromeMat : satinTitaniumMat
        );
        ringMesh.position.z = heights[idx];
        crownGroup.add(ringMesh);

        // Luminous hairline accent ring nested between machined steps
        if (idx === 1 || idx === 3) {
          const glowRingGeo = new THREE.TorusGeometry(
            radius - 0.075,
            0.011,
            10,
            64
          );
          disposables.push(glowRingGeo);
          const glowRing = new THREE.Mesh(glowRingGeo, fiberVeinMat);
          glowRing.position.z = heights[idx] + 0.015;
          crownGroup.add(glowRing);
        }
      });

      // Central domed obsidian lens cap
      const capGeo = new THREE.CylinderGeometry(0.45, 0.5, 0.14, 40);
      capGeo.rotateX(Math.PI / 2);
      disposables.push(capGeo);
      const capMesh = new THREE.Mesh(capGeo, polishedChromeMat);
      capMesh.position.z = 2.09;
      crownGroup.add(capMesh);

      // Milled radial turbine teeth via InstancedMesh (32 teeth per crown)
      const toothCount = 32;
      const toothGeo = new THREE.BoxGeometry(0.038, 0.15, 0.055);
      disposables.push(toothGeo);
      const teethInstanced = new THREE.InstancedMesh(
        toothGeo,
        polishedChromeMat,
        toothCount
      );
      for (let i = 0; i < toothCount; i++) {
        const angle = (i / toothCount) * Math.PI * 2;
        const r = 1.35;
        _nodePos.set(Math.cos(angle) * r, Math.sin(angle) * r, 1.66);
        _nodeQuat.setFromAxisAngle(new THREE.Vector3(0, 0, 1), angle + Math.PI / 2);
        _nodeScale.set(1, 1, 1);
        _nodeMatrix.compose(_nodePos, _nodeQuat, _nodeScale);
        teethInstanced.setMatrixAt(i, _nodeMatrix);
      }
      teethInstanced.instanceMatrix.needsUpdate = true;
      teethInstanced.computeBoundingSphere();
      crownGroup.add(teethInstanced);

      // Align crown along diagonal pole vector
      crownGroup.quaternion.setFromUnitVectors(
        new THREE.Vector3(0, 0, 1),
        axisDir.clone().normalize()
      );
      return crownGroup;
    };

    const primaryPole = new THREE.Vector3(-0.46, 0.6, 0.66);
    sphereAssembly.add(buildConcentricCrown(primaryPole));
    sphereAssembly.add(
      buildConcentricCrown(primaryPole.clone().negate())
    );

    // --- PART 4 & 5: Equatorial Sculpted Armor Rib Bands ---
    const ribConfigs = [
      { rx: 0.72, ry: -0.45, rz: 0.25, radius: 2.18, tube: 0.048, mat: polishedChromeMat },
      { rx: 0.72, ry: -0.45, rz: 0.25, radius: 2.15, tube: 0.088, mat: satinTitaniumMat },
      { rx: -0.64, ry: 0.52, rz: -0.3, radius: 2.17, tube: 0.042, mat: polishedChromeMat },
      { rx: 1.48, ry: 0.2, rz: 0.42, radius: 2.16, tube: 0.036, mat: polishedChromeMat },
    ];
    ribConfigs.forEach((cfg) => {
      const geo = new THREE.TorusGeometry(cfg.radius, cfg.tube, 16, 84);
      disposables.push(geo);
      const mesh = new THREE.Mesh(geo, cfg.mat);
      mesh.rotation.set(cfg.rx, cfg.ry, cfg.rz);
      sphereAssembly.add(mesh);
    });

    // --- PART 6: Surface Fiber-Optic Energy Conduits ---
    const conduitCurves = [
      { rx: 0.72, ry: -0.45, rz: 0.25, radius: 2.205 },
      { rx: -0.64, ry: 0.52, rz: -0.3, radius: 2.2 },
    ];
    conduitCurves.forEach((cfg) => {
      const geo = new THREE.TorusGeometry(cfg.radius, 0.012, 10, 96);
      disposables.push(geo);
      const mesh = new THREE.Mesh(geo, fiberVeinMat);
      mesh.rotation.set(cfg.rx, cfg.ry, cfg.rz);
      sphereAssembly.add(mesh);
    });

    // --- PART 7: Fresnel Violet Rim Glow Halo Shell ---
    const fresnelGeo = new THREE.SphereGeometry(2.26, 56, 56);
    disposables.push(fresnelGeo);
    const fresnelMat = new THREE.ShaderMaterial({
      uniforms: {
        uColorA: { value: new THREE.Color(0xc084fc) },
        uColorB: { value: new THREE.Color(0x6366f1) },
        uTime: { value: 0 },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vViewDir;
        void main() {
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          vNormal = normalize(normalMatrix * normal);
          vViewDir = normalize(-mvPosition.xyz);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 uColorA;
        uniform vec3 uColorB;
        uniform float uTime;
        varying vec3 vNormal;
        varying vec3 vViewDir;
        void main() {
          float ndotv = clamp(dot(normalize(vNormal), normalize(vViewDir)), 0.0, 1.0);
          float fresnel = pow(1.0 - ndotv, 3.4);
          float wave = 0.5 + 0.5 * sin(vNormal.y * 3.5 + uTime * 0.9);
          vec3 col = mix(uColorB, uColorA, wave);
          gl_FragColor = vec4(col * 1.45, fresnel * 0.88);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.FrontSide,
    });
    disposables.push(fresnelMat);
    const fresnelMesh = new THREE.Mesh(fresnelGeo, fresnelMat);
    rigGroup.add(fresnelMesh);

    // --- PART 8, 9, 10: Delicate Tilted Orbital Wire Rings & Data-Packet Nodes ---
    const orbitGroup = new THREE.Group();
    rigGroup.add(orbitGroup);

    const orbitSpecs = [
      { rx: 1.18, ry: 0.36, rz: -0.28, a: 2.92, b: 2.52, speed: 0.24, opacity: 0.62, color: 0xd8b4fe },
      { rx: 1.38, ry: -0.58, rz: 0.45, a: 3.12, b: 2.38, speed: -0.19, opacity: 0.52, color: 0xa78bfa },
      { rx: 0.85, ry: 0.72, rz: 0.82, a: 2.74, b: 2.66, speed: 0.16, opacity: 0.46, color: 0x93c5fd },
    ];

    const orbitCurves: THREE.CatmullRomCurve3[] = [];
    const orbitPivotGroups: THREE.Group[] = [];

    orbitSpecs.forEach((spec) => {
      const pts: THREE.Vector3[] = [];
      const steps = 96;
      for (let i = 0; i < steps; i++) {
        const t = (i / steps) * Math.PI * 2;
        pts.push(new THREE.Vector3(Math.cos(t) * spec.a, Math.sin(t) * spec.b, 0));
      }
      const curve = new THREE.CatmullRomCurve3(pts, true);
      orbitCurves.push(curve);

      const tubeGeo = new THREE.TubeGeometry(curve, 112, 0.011, 6, true);
      disposables.push(tubeGeo);
      const tubeMat = new THREE.MeshBasicMaterial({
        color: spec.color,
        transparent: true,
        opacity: spec.opacity,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      disposables.push(tubeMat);

      const pivot = new THREE.Group();
      pivot.rotation.set(spec.rx, spec.ry, spec.rz);
      pivot.add(new THREE.Mesh(tubeGeo, tubeMat));
      orbitGroup.add(pivot);
      orbitPivotGroups.push(pivot);
    });

    // Instanced luminous beads sliding along orbital trajectories
    const nodesPerOrbit = 10;
    const beadGeo = new THREE.SphereGeometry(0.036, 12, 12);
    disposables.push(beadGeo);
    const beadMat = new THREE.MeshBasicMaterial({
      color: 0xf5e8ff,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    disposables.push(beadMat);

    const orbitNodes: Array<{
      mesh: THREE.InstancedMesh;
      curve: THREE.CatmullRomCurve3;
      speed: number;
      offsets: number[];
    }> = [];

    orbitSpecs.forEach((spec, idx) => {
      const inst = new THREE.InstancedMesh(beadGeo, beadMat, nodesPerOrbit);
      inst.frustumCulled = false;
      orbitPivotGroups[idx].add(inst);
      const offsets: number[] = [];
      for (let j = 0; j < nodesPerOrbit; j++) {
        offsets.push(j / nodesPerOrbit + (idx * 0.13));
      }
      orbitNodes.push({
        mesh: inst,
        curve: orbitCurves[idx],
        speed: spec.speed * 0.16,
        offsets,
      });
    });

    // --- PART 11: Floating 3D Energy Sparkles / Cosmic Dust ---
    const particleCount = 190;
    const pPositions = new Float32Array(particleCount * 3);
    const pColors = new Float32Array(particleCount * 3);
    const cViolet = new THREE.Color(0xc084fc);
    const cCyan = new THREE.Color(0x93c5fd);
    const cWhite = new THREE.Color(0xffffff);

    for (let i = 0; i < particleCount; i++) {
      const radius = 2.45 + Math.random() * 2.1;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pPositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pPositions[i * 3 + 2] = radius * Math.cos(phi);

      const pick = i % 3 === 0 ? cWhite : i % 3 === 1 ? cViolet : cCyan;
      pColors[i * 3] = pick.r;
      pColors[i * 3 + 1] = pick.g;
      pColors[i * 3 + 2] = pick.b;
    }

    const particlesGeo = new THREE.BufferGeometry();
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
    particlesGeo.setAttribute('color', new THREE.BufferAttribute(pColors, 3));
    disposables.push(particlesGeo);

    const particlesMat = new THREE.PointsMaterial({
      size: 0.11,
      map: textures.particleMap,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });
    disposables.push(particlesMat);

    const particlesPoints = new THREE.Points(particlesGeo, particlesMat);
    rigGroup.add(particlesPoints);

    // --- STUDIO LIGHTING RIG (High-Contrast Metallic Obsidian + Vivid Violet Rims) ---
    const hemiLight = new THREE.HemisphereLight(0xd8b4fe, 0x110820, 0.75);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xf3e8ff, 2.8);
    keyLight.position.set(-4.5, 5.2, 5.8);
    scene.add(keyLight);

    const rimLightTopRight = new THREE.PointLight(0xd946ef, 36, 18, 1.7);
    rimLightTopRight.position.set(5.2, 3.6, 2.2);
    scene.add(rimLightTopRight);

    const rimLightBottomLeft = new THREE.PointLight(0x9333ea, 28, 16, 1.7);
    rimLightBottomLeft.position.set(-2.6, -4.4, 2.8);
    scene.add(rimLightBottomLeft);

    const accentLightCyan = new THREE.PointLight(0x38bdf8, 14, 15, 1.8);
    accentLightCyan.position.set(4.4, -3.2, -1.6);
    scene.add(accentLightCyan);

    // Responsive layout helper: positions sphere cleanly on right half on desktop
    let basePosX = 1.95;
    let basePosY = -0.1;
    let baseScale = 1.02;

    const updateLayoutMetrics = () => {
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      renderer.setPixelRatio(
        isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2)
      );

      if (w >= 1280) {
        basePosX = 2.02;
        basePosY = -0.06;
        baseScale = 1.06;
      } else if (w >= 1024) {
        basePosX = 1.75;
        basePosY = -0.06;
        baseScale = 0.94;
      } else if (w >= 768) {
        basePosX = 1.15;
        basePosY = -0.25;
        baseScale = 0.82;
      } else {
        basePosX = 0;
        basePosY = -1.25;
        baseScale = 0.68;
      }
      rigGroup.scale.setScalar(baseScale);
    };
    updateLayoutMetrics();

    // Pointer tracking for smooth mousemove + lerp interaction
    const targetMouse = { x: 0, y: 0 };
    const smoothMouse = { x: 0, y: 0 };

    const handleMouseMove = (e: MouseEvent) => {
      targetMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      targetMouse.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };

    const handleMouseLeave = () => {
      targetMouse.x = 0;
      targetMouse.y = 0;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    window.addEventListener('resize', updateLayoutMetrics);

    // WebGL context loss/restore guards
    const handleContextLost = (e: Event) => {
      e.preventDefault();
    };
    const handleContextRestored = () => {
      updateLayoutMetrics();
    };
    renderer.domElement.addEventListener('webglcontextlost', handleContextLost);
    renderer.domElement.addEventListener(
      'webglcontextrestored',
      handleContextRestored
    );

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // Animation loop with software WebGL fence pacing
    let frameId = 0;
    let disposed = false;
    let lastTime = performance.now();
    let elapsed = 0;
    let autoSpinY = 0;
    let autoSpinX = 0;

    function afterDraw(cb: () => void) {
      if (disposed) return;
      const gl = renderer.getContext() as WebGL2RenderingContext | null;
      if (!gl || typeof gl.fenceSync !== 'function') {
        frameId = window.setTimeout(cb, 80);
        return;
      }
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (disposed) {
          if (sync) gl.deleteSync(sync);
          return;
        }
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    const tick = () => {
      if (disposed) return;
      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.08);
      lastTime = now;

      const palette = SPHERE_MODE_PALETTES[modeRef.current];
      const motionFactor = prefersReducedMotion ? 0 : 1;

      elapsed += dt * motionFactor;

      // Smooth frame-rate-independent lerp toward cursor position
      const lerpAlpha = 1 - Math.exp(-4.2 * dt);
      smoothMouse.x = THREE.MathUtils.lerp(
        smoothMouse.x,
        targetMouse.x * motionFactor,
        lerpAlpha
      );
      smoothMouse.y = THREE.MathUtils.lerp(
        smoothMouse.y,
        targetMouse.y * motionFactor,
        lerpAlpha
      );

      // Slow automatic rotation + interactive mouse tilt
      autoSpinY += dt * 0.14 * palette.spinMult * motionFactor;
      autoSpinX += dt * 0.032 * palette.spinMult * motionFactor;

      const scrollP = scrollProgressRef.current || 0;

      sphereAssembly.rotation.y = autoSpinY + smoothMouse.x * 0.55 + scrollP * 1.1;
      sphereAssembly.rotation.x =
        Math.sin(autoSpinX) * 0.18 - smoothMouse.y * 0.38 + scrollP * 0.35;
      sphereAssembly.rotation.z = smoothMouse.x * -0.09;

      // Subtle floating levitation + parallax displacement from cursor and scroll
      const floatY = Math.sin(elapsed * 0.9) * 0.08 * motionFactor;
      rigGroup.position.x = basePosX + smoothMouse.x * 0.28;
      rigGroup.position.y = basePosY + floatY + smoothMouse.y * 0.22 - scrollP * 0.55;
      rigGroup.position.z = -scrollP * 1.4;

      // Independent counter-rotation on orbital wire rings & energy dust
      orbitGroup.rotation.y = -elapsed * 0.08 + smoothMouse.x * 0.35;
      orbitGroup.rotation.x = smoothMouse.y * -0.25;
      particlesPoints.rotation.y = elapsed * 0.045;
      particlesPoints.rotation.x = elapsed * 0.018;

      // Advance sliding luminous data beads along orbital loops
      orbitNodes.forEach(({ mesh, curve, speed, offsets }) => {
        for (let i = 0; i < offsets.length; i++) {
          const u = ((offsets[i] + elapsed * speed) % 1 + 1) % 1;
          curve.getPointAt(u, _nodePos);
          const pulse = 0.72 + 0.35 * Math.sin(elapsed * 3.0 + i * 1.3);
          _nodeQuat.identity();
          _nodeScale.setScalar(pulse);
          _nodeMatrix.compose(_nodePos, _nodeQuat, _nodeScale);
          mesh.setMatrixAt(i, _nodeMatrix);
        }
        mesh.instanceMatrix.needsUpdate = true;
      });

      // Dynamic interactive rim-light response & smooth energy mode tinting
      rimLightTopRight.position.x = 5.2 + smoothMouse.x * 1.4;
      rimLightTopRight.position.y = 3.6 + smoothMouse.y * 1.2;

      const colorLerp = 1 - Math.exp(-3.0 * dt);
      _targetColorRim.setHex(palette.rim);
      _targetColorEmissive.setHex(palette.emissive);
      _targetColorAccent.setHex(palette.accent);

      rimLightTopRight.color.lerp(_targetColorRim, colorLerp);
      coreArmorMat.emissive.lerp(_targetColorEmissive, colorLerp);
      fiberVeinMat.emissive.lerp(_targetColorEmissive, colorLerp);
      accentLightCyan.color.lerp(_targetColorAccent, colorLerp);
      fresnelMat.uniforms.uColorA.value.lerp(_targetColorRim, colorLerp);
      fresnelMat.uniforms.uColorB.value.lerp(_targetColorAccent, colorLerp);
      fresnelMat.uniforms.uTime.value = elapsed;

      renderer.render(scene, camera);

      if (prefersReducedMotion) {
        return;
      }

      if (isSoftwareGl) {
        afterDraw(tick);
      }
    };

    if (prefersReducedMotion || isSoftwareGl) {
      tick();
    } else {
      gsap.ticker.add(tick);
    }

    return () => {
      disposed = true;
      gsap.ticker.remove(tick);
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', updateLayoutMetrics);
      renderer.domElement.removeEventListener(
        'webglcontextlost',
        handleContextLost
      );
      renderer.domElement.removeEventListener(
        'webglcontextrestored',
        handleContextRestored
      );
      disposables.forEach((d) => d.dispose());
      textures.dispose();
      envRT.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [scrollProgressRef]);

  return (
    <div className="relative w-full h-full pointer-events-none select-none">
      <div ref={mountRef} aria-hidden="true" className="w-full h-full" />
      <div
        ref={fallbackRef}
        aria-hidden="true"
        className="hidden absolute inset-0 items-center justify-end pr-[clamp(1rem,6vw,7rem)]"
      >
        <div
          className="w-[clamp(18rem,40vw,36rem)] aspect-square rounded-full"
          style={{
            background:
              'radial-gradient(circle at 35% 30%, #c084fc 0%, #3b1764 38%, #10091e 72%, #080511 100%)',
            boxShadow:
              '0 0 90px rgba(168, 85, 247, 0.45), inset -18px -20px 55px rgba(8, 5, 17, 0.85)',
          }}
        />
      </div>
    </div>
  );
}
