import * as THREE from 'three';

export interface SphereTextureSet {
  albedoMap: THREE.CanvasTexture;
  bumpMap: THREE.CanvasTexture;
  roughnessMap: THREE.CanvasTexture;
  emissiveMap: THREE.CanvasTexture;
  particleMap: THREE.CanvasTexture;
  dispose: () => void;
}

/**
 * Generates high-resolution procedural PBR maps (albedo, bump, roughness, emissive)
 * depicting machined dark obsidian-titanium armor plates, concentric stepped grooves,
 * circuit conduits, and subtle glowing violet optical veins.
 */
export function createSphereTextureSet(maxAnisotropy: number): SphereTextureSet {
  const width = 1024;
  const height = 512;

  const albedoCanvas = document.createElement('canvas');
  albedoCanvas.width = width;
  albedoCanvas.height = height;
  const aCtx = albedoCanvas.getContext('2d')!;

  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = width;
  bumpCanvas.height = height;
  const bCtx = bumpCanvas.getContext('2d')!;

  const roughCanvas = document.createElement('canvas');
  roughCanvas.width = width;
  roughCanvas.height = height;
  const rCtx = roughCanvas.getContext('2d')!;

  const emissiveCanvas = document.createElement('canvas');
  emissiveCanvas.width = width;
  emissiveCanvas.height = height;
  const eCtx = emissiveCanvas.getContext('2d')!;

  // Base metallic obsidian surfaces
  const aGrad = aCtx.createLinearGradient(0, 0, 0, height);
  aGrad.addColorStop(0, '#1e1730');
  aGrad.addColorStop(0.5, '#130e20');
  aGrad.addColorStop(1, '#1c152d');
  aCtx.fillStyle = aGrad;
  aCtx.fillRect(0, 0, width, height);

  // Mid-level bump baseline
  bCtx.fillStyle = '#808080';
  bCtx.fillRect(0, 0, width, height);

  // Satin-polished baseline roughness (~0.24)
  rCtx.fillStyle = '#3d3d3d';
  rCtx.fillRect(0, 0, width, height);

  // Pitch black emissive baseline
  eCtx.fillStyle = '#000000';
  eCtx.fillRect(0, 0, width, height);

  // Subtle brushed-metal horizontal micro-grain across plates
  for (let y = 0; y < height; y += 2) {
    const shade = 18 + Math.floor((Math.sin(y * 0.37) * 0.5 + 0.5) * 14);
    aCtx.fillStyle = `rgba(${shade + 12}, ${shade + 4}, ${shade + 28}, 0.18)`;
    aCtx.fillRect(0, y, width, 1);

    const rGrain = 48 + Math.floor((Math.cos(y * 0.71) * 0.5 + 0.5) * 28);
    rCtx.fillStyle = `rgba(${rGrain}, ${rGrain}, ${rGrain}, 0.16)`;
    rCtx.fillRect(0, y, width, 1);
  }

  // Sculpted armor plates with beveled raised surfaces
  const plateRows = [
    { y: 54, h: 66, count: 6, offset: 0 },
    { y: 132, h: 98, count: 8, offset: 48 },
    { y: 244, h: 108, count: 6, offset: 18 },
    { y: 364, h: 86, count: 8, offset: 72 },
  ];

  plateRows.forEach((row, rowIdx) => {
    const segW = width / row.count;
    for (let i = 0; i < row.count; i++) {
      const x = (i * segW + row.offset) % width;
      const pad = 10;
      const pw = segW - pad * 2;
      const ph = row.h - 10;

      const drawPlate = (px: number) => {
        // Raised obsidian plate body
        const pGrad = aCtx.createLinearGradient(px, row.y, px, row.y + ph);
        pGrad.addColorStop(0, '#2a2242');
        pGrad.addColorStop(0.5, '#191329');
        pGrad.addColorStop(1, '#221a36');
        aCtx.fillStyle = pGrad;
        aCtx.fillRect(px, row.y, pw, ph);

        // Specular top bevel lip
        aCtx.strokeStyle = '#4c3b73';
        aCtx.lineWidth = 2;
        aCtx.strokeRect(px + 2, row.y + 2, pw - 4, ph - 4);

        // Bump: recessed trench around plate, raised polished center
        bCtx.fillStyle = '#242424';
        bCtx.fillRect(px - 4, row.y - 4, pw + 8, ph + 8);
        bCtx.fillStyle = '#d4d4d4';
        bCtx.fillRect(px + 3, row.y + 3, pw - 6, ph - 6);
        bCtx.strokeStyle = '#ffffff';
        bCtx.lineWidth = 3;
        bCtx.strokeRect(px + 5, row.y + 5, pw - 10, ph - 10);

        // Roughness: glossy top surfaces (dark), rougher recessed channels (light)
        rCtx.fillStyle = '#9c9c9c';
        rCtx.fillRect(px - 4, row.y - 4, pw + 8, ph + 8);
        rCtx.fillStyle = (i + rowIdx) % 2 === 0 ? '#1f1f1f' : '#303030';
        rCtx.fillRect(px + 3, row.y + 3, pw - 6, ph - 6);

        // Machined micro-rib notches inside alternate plates
        if ((i + rowIdx) % 2 === 0) {
          const ribCount = 9;
          const ribStart = px + 14;
          const ribStep = (pw - 28) / ribCount;
          for (let r = 0; r < ribCount; r++) {
            const rx = ribStart + r * ribStep;
            bCtx.fillStyle = '#383838';
            bCtx.fillRect(rx, row.y + ph * 0.25, ribStep * 0.45, ph * 0.5);
            bCtx.fillStyle = '#efefef';
            bCtx.fillRect(rx + ribStep * 0.48, row.y + ph * 0.25, ribStep * 0.35, ph * 0.5);

            aCtx.fillStyle = '#0d0917';
            aCtx.fillRect(rx, row.y + ph * 0.25, ribStep * 0.45, ph * 0.5);
          }
        }
      };

      drawPlate(x);
      if (x + pw > width) {
        drawPlate(x - width);
      }
    }
  });

  // Stepped diagonal circuit traces & parallel recessed grooves (signature Sphere Wired motif)
  const drawCircuitTrace = (
    points: Array<[number, number]>,
    lineWidth: number,
    emissiveColor: string | null,
    emissiveWidth = 2
  ) => {
    const trace = (ctx: CanvasRenderingContext2D, stroke: string, lw: number) => {
      ctx.save();
      ctx.beginPath();
      points.forEach(([px, py], idx) => {
        if (idx === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.strokeStyle = stroke;
      ctx.lineWidth = lw;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'miter';
      ctx.stroke();
      ctx.restore();
    };

    // Deep trench in bump + rough recessed bottom
    trace(bCtx, '#121212', lineWidth + 6);
    trace(bCtx, '#f4f4f4', Math.max(2, lineWidth - 3));
    trace(rCtx, '#a8a8a8', lineWidth + 5);
    trace(rCtx, '#181818', Math.max(2, lineWidth - 3));
    trace(aCtx, '#0b0714', lineWidth + 4);
    trace(aCtx, '#3a2d5c', Math.max(2, lineWidth - 3));

    if (emissiveColor) {
      trace(eCtx, emissiveColor, emissiveWidth);
    }
  };

  // Multi-lane parallel architectural circuit bands wrapping seamlessly across X
  for (let band = 0; band < 4; band++) {
    const baseY = 92 + band * 106;
    const isViolet = band % 2 === 0;
    const glow = isViolet ? 'rgba(186, 104, 255, 0.92)' : 'rgba(129, 140, 248, 0.8)';

    const mainPath: Array<[number, number]> = [
      [0, baseY],
      [140, baseY],
      [190, baseY + 34],
      [390, baseY + 34],
      [445, baseY - 22],
      [660, baseY - 22],
      [718, baseY + 26],
      [890, baseY + 26],
      [940, baseY],
      [1024, baseY],
    ];

    drawCircuitTrace(mainPath, 9, glow, 2.5);

    const parallelPath: Array<[number, number]> = mainPath.map(([px, py]) => [
      px,
      py + 14,
    ]);
    drawCircuitTrace(parallelPath, 5, null);
  }

  // Concentric polar machining rings near top and bottom poles
  for (let p = 0; p < 8; p++) {
    const topY = 8 + p * 6;
    const botY = height - 8 - p * 6;
    bCtx.fillStyle = p % 2 === 0 ? '#eaeaea' : '#1b1b1b';
    bCtx.fillRect(0, topY, width, 3);
    bCtx.fillRect(0, botY, width, 3);

    rCtx.fillStyle = p % 2 === 0 ? '#181818' : '#8e8e8e';
    rCtx.fillRect(0, topY, width, 3);
    rCtx.fillRect(0, botY, width, 3);

    if (p === 3 || p === 6) {
      eCtx.fillStyle = 'rgba(192, 132, 252, 0.85)';
      eCtx.fillRect(0, topY + 1, width, 1.5);
      eCtx.fillRect(0, botY + 1, width, 1.5);
    }
  }

  // Glowing optical node junctions along traces
  const nodePositions: Array<[number, number]> = [
    [190, 126],
    [445, 176],
    [718, 224],
    [390, 338],
    [660, 282],
    [890, 436],
  ];
  nodePositions.forEach(([nx, ny]) => {
    const grad = eCtx.createRadialGradient(nx, ny, 1, nx, ny, 14);
    grad.addColorStop(0, 'rgba(245, 208, 254, 1)');
    grad.addColorStop(0.4, 'rgba(168, 85, 247, 0.85)');
    grad.addColorStop(1, 'rgba(168, 85, 247, 0)');
    eCtx.fillStyle = grad;
    eCtx.beginPath();
    eCtx.arc(nx, ny, 14, 0, Math.PI * 2);
    eCtx.fill();
  });

  // Configure Three.js CanvasTextures with strict color space & anisotropy
  const albedoMap = new THREE.CanvasTexture(albedoCanvas);
  albedoMap.colorSpace = THREE.SRGBColorSpace;
  albedoMap.wrapS = THREE.RepeatWrapping;
  albedoMap.wrapT = THREE.ClampToEdgeWrapping;
  albedoMap.anisotropy = maxAnisotropy;

  const bumpMap = new THREE.CanvasTexture(bumpCanvas);
  bumpMap.wrapS = THREE.RepeatWrapping;
  bumpMap.wrapT = THREE.ClampToEdgeWrapping;
  bumpMap.anisotropy = maxAnisotropy;

  const roughnessMap = new THREE.CanvasTexture(roughCanvas);
  roughnessMap.wrapS = THREE.RepeatWrapping;
  roughnessMap.wrapT = THREE.ClampToEdgeWrapping;
  roughnessMap.anisotropy = maxAnisotropy;

  const emissiveMap = new THREE.CanvasTexture(emissiveCanvas);
  emissiveMap.colorSpace = THREE.SRGBColorSpace;
  emissiveMap.wrapS = THREE.RepeatWrapping;
  emissiveMap.wrapT = THREE.ClampToEdgeWrapping;
  emissiveMap.anisotropy = maxAnisotropy;

  // Soft glowing radial particle sprite
  const pCanvas = document.createElement('canvas');
  pCanvas.width = 64;
  pCanvas.height = 64;
  const pCtx = pCanvas.getContext('2d')!;
  const pGrad = pCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
  pGrad.addColorStop(0, 'rgba(255, 255, 255, 1)');
  pGrad.addColorStop(0.25, 'rgba(224, 185, 255, 0.9)');
  pGrad.addColorStop(0.6, 'rgba(147, 51, 234, 0.35)');
  pGrad.addColorStop(1, 'rgba(147, 51, 234, 0)');
  pCtx.fillStyle = pGrad;
  pCtx.fillRect(0, 0, 64, 64);

  const particleMap = new THREE.CanvasTexture(pCanvas);
  particleMap.colorSpace = THREE.SRGBColorSpace;

  return {
    albedoMap,
    bumpMap,
    roughnessMap,
    emissiveMap,
    particleMap,
    dispose: () => {
      albedoMap.dispose();
      bumpMap.dispose();
      roughnessMap.dispose();
      emissiveMap.dispose();
      particleMap.dispose();
    },
  };
}
