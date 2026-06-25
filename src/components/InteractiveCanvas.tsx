import React, { useEffect, useRef, useState } from "react";

interface InteractiveCanvasProps {
  sectionIndex: number; // 0: Hero, 1: Mission, 2: Technology, 3: Biology, 4: Bench, 5: Contact/Footer
}

interface Particle {
  // Current 3D position
  x: number;
  y: number;
  z: number;
  // Current speed/velocity
  vx: number;
  vy: number;
  vz: number;
  // Target coordinates to morph into
  tx: number;
  ty: number;
  tz: number;
  // Visual aspects
  color: string;
  size: number;
  originalSize: number;
}

export const InteractiveCanvas: React.FC<InteractiveCanvasProps> = ({ sectionIndex }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const indexRef = useRef(sectionIndex);

  // Mouse interactivity coordinates for subtle parallax tilt
  const mouseRef = useRef({ x: 0, y: 0, tx: 0, ty: 0 });

  // Update tracking ref for target morph index
  useEffect(() => {
    indexRef.current = sectionIndex;
  }, [sectionIndex]);

  // Track cursor movement for interactive fluid drift
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      // Map to [-1, 1] range with damping values
      mouseRef.current.tx = (e.clientX / innerWidth) * 2 - 1;
      mouseRef.current.ty = (e.clientY / innerHeight) * 2 - 1;
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Initialize and run Canvas Render loops
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Resize canvas beautifully based on device resolution
    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    // Create 700 stable morphing particles
    const particleCount = 700;
    const initialParticles: Particle[] = [];

    // Colors matching theme: slate gray, soft white, peptide coral (#f43f5e) and metabolism cyan (#0ea5e9)
    const colorPalette = [
      "rgba(255, 255, 255, 0.4)", // soft white
      "rgba(244, 63, 94, 0.35)",  // coral pink
      "rgba(14, 165, 233, 0.35)", // metabolism cyan
      "rgba(251, 113, 133, 0.25)", // pale pink
      "rgba(255, 255, 255, 0.15)", // faint dust
    ];

    for (let i = 0; i < particleCount; i++) {
      // Pick random initial coordinate inside box
      const x = (Math.random() * 2 - 1) * 3;
      const y = (Math.random() * 2 - 1) * 3;
      const z = (Math.random() * 2 - 1) * 3;

      const baseSize = 1.05 + Math.random() * 1.85;

      initialParticles.push({
        x,
        y,
        z,
        vx: 0,
        vy: 0,
        vz: 0,
        tx: 0,
        ty: 0,
        tz: 0,
        color: colorPalette[i % colorPalette.length],
        size: baseSize,
        originalSize: baseSize,
      });
    }

    particlesRef.current = initialParticles;

    // Helper functions to generate target shapes relative to active Section
    const setShapeTargets = (targetIndex: number) => {
      const particles = particlesRef.current;
      const total = particles.length;

      particles.forEach((p, i) => {
        // Preset shape formulas based on current layout section
        if (targetIndex === 0) {
          // ----------------------------------------------------
          // 0: HERO - Double-Lobed Wavy Saddle (Anatomical Liver Symmetry)
          // Two interconnected concentric wavy rings representing the asymmetric left and right
          // liver lobes — restored from the original site design.
          // ----------------------------------------------------
          const isRightLobe = i < total * 0.65;
          if (isRightLobe) {
            const subIdx = i;
            const dots = Math.floor(total * 0.65);
            const ringCount = 8;
            const ring = subIdx % ringCount;
            const ringIdx = Math.floor(subIdx / ringCount);
            const angle = (ringIdx * Math.PI * 2) / (dots / ringCount);
            const radius = 0.05 + (ring / ringCount) * 0.44;

            p.tx = 0.22 + radius * Math.cos(angle);
            p.ty = -0.05 + radius * Math.sin(angle) * 0.75; // slightly flattened anatomically
            p.tz = Math.sin(angle * 5 + ring * 0.6) * 0.12;
          } else {
            const subIdx = i - Math.floor(total * 0.65);
            const dots = total - Math.floor(total * 0.65);
            const ringCount = 6;
            const ring = subIdx % ringCount;
            const ringIdx = Math.floor(subIdx / ringCount);
            const angle = (ringIdx * Math.PI * 2) / (dots / ringCount);
            const radius = 0.04 + (ring / ringCount) * 0.28;

            p.tx = -0.32 + radius * Math.cos(angle);
            p.ty = 0.08 + radius * Math.sin(angle) * 0.75;
            p.tz = Math.cos(angle * 4 + ring * 0.5) * 0.08 - 0.04;
          }
        } else if (targetIndex === 1) {
          // ----------------------------------------------------
          // 1: NARRATIVE/MISSION - The Classic Wavy Metabolic Disc (Rippling Resonance)
          // Mathematical polar concentric rings undulating smoothly with high-fidelity Z-frequency
          // waves — restored from the original site design.
          // ----------------------------------------------------
          const ringCount = 10;
          const ring = i % ringCount;
          const dotsInRing = total / ringCount;
          const ringIdx = Math.floor(i / ringCount);
          const angle = (ringIdx * Math.PI * 2) / dotsInRing;
          const radius = 0.08 + (ring / ringCount) * 0.58;

          const waves = 6;
          const zWave = Math.sin(angle * waves - ring * 0.8) * 0.16;

          p.tx = radius * Math.cos(angle);
          p.ty = radius * Math.sin(angle);
          p.tz = zWave;
        } else if (targetIndex === 2) {
          // ----------------------------------------------------
          // 2: CARRIER STRATEGY - Peptide Carrier Ribbon Delivering a Payload
          // ~70% of particles form a twisting open ribbon arc (the targeting peptide); the
          // remainder cluster into a compact molecular blob at its terminus (the small-molecule payload).
          // ----------------------------------------------------
          const carrierCount = Math.floor(total * 0.7);
          if (i < carrierCount) {
            const lanes = 4;
            const lane = i % lanes;
            const subIdx = Math.floor(i / lanes);
            const totalSub = carrierCount / lanes;
            const progress = subIdx / totalSub; // 0 to 1 along the carrier's length

            const archAngle = progress * Math.PI * 1.6 - 0.8;
            const archR = 0.46;
            const ribbonOffset = (lane - 1.5) * 0.045;
            const twist = progress * Math.PI * 6; // secondary-structure twist along the arc

            p.tx = archR * Math.cos(archAngle);
            p.ty = archR * Math.sin(archAngle) * 0.6 + Math.cos(twist) * ribbonOffset;
            p.tz = Math.sin(twist) * ribbonOffset + Math.sin(progress * Math.PI * 3) * 0.05;
          } else {
            const j = i - carrierCount;
            const payloadTotal = total - carrierCount;
            const termAngle = Math.PI * 1.6 - 0.8; // matches the carrier's progress = 1 terminus
            const termX = 0.46 * Math.cos(termAngle);
            const termY = 0.46 * Math.sin(termAngle) * 0.6;

            // Compact fibonacci-sphere cluster standing in for the small-molecule payload
            const golden = Math.PI * (3 - Math.sqrt(5));
            const yFrac = payloadTotal > 1 ? 1 - (j / (payloadTotal - 1)) * 2 : 0;
            const radiusAtY = Math.sqrt(Math.max(0, 1 - yFrac * yFrac));
            const theta2 = golden * j;
            const clusterR = 0.12;

            p.tx = termX + Math.cos(theta2) * radiusAtY * clusterR;
            p.ty = termY + yFrac * clusterR;
            p.tz = Math.sin(theta2) * radiusAtY * clusterR;
          }
        } else if (targetIndex === 3) {
          // ----------------------------------------------------
          // 3: SPECIFIC BIOLOGY - A Single Hepatocyte
          // A dense central nucleus cluster surrounded by a wavy hexagonal lattice shell,
          // mirroring both the cell's nucleus and the hexagonal hepatic lobule grid it sits within.
          // ----------------------------------------------------
          const nucleusCount = Math.floor(total * 0.12);
          if (i < nucleusCount) {
            const golden = Math.PI * (3 - Math.sqrt(5));
            const yFrac = nucleusCount > 1 ? 1 - (i / (nucleusCount - 1)) * 2 : 0;
            const radiusAtY = Math.sqrt(Math.max(0, 1 - yFrac * yFrac));
            const theta = golden * i;
            const nucR = 0.13;

            p.tx = Math.cos(theta) * radiusAtY * nucR;
            p.ty = yFrac * nucR * 0.8;
            p.tz = Math.sin(theta) * radiusAtY * nucR;
          } else {
            const j = i - nucleusCount;
            const hexTotal = total - nucleusCount;
            const hexLayers = 8;
            const layer = j % hexLayers;
            const pointsInLayer = hexTotal / hexLayers;
            const layerIdx = Math.floor(j / hexLayers);
            const angle = (layerIdx * Math.PI * 2) / pointsInLayer;

            const localAngle = angle % (Math.PI / 3);
            const hexFactor = Math.cos(Math.PI / 6) / Math.cos(localAngle - Math.PI / 6);

            const baseR = 0.16 + (layer / hexLayers) * 0.46; // gap left around the nucleus
            const radius = baseR * hexFactor;

            p.tx = radius * Math.cos(angle);
            p.ty = radius * Math.sin(angle);
            p.tz = Math.sin(angle * 6 + layer) * 0.12 - layer * 0.01;
          }
        } else if (targetIndex === 4) {
          // ----------------------------------------------------
          // 4: BENCH - Endosomal Vesicle with Internalized Cargo
          // A hollow membrane shell (receptor network nodes) enclosing a small interior cluster
          // representing the trapped peptide-conjugate cargo, mirroring the MoA's early endosome.
          // ----------------------------------------------------
          const cargoCount = Math.floor(total * 0.1);
          if (i < cargoCount) {
            const golden = Math.PI * (3 - Math.sqrt(5));
            const yFrac = cargoCount > 1 ? 1 - (i / (cargoCount - 1)) * 2 : 0;
            const radiusAtY = Math.sqrt(Math.max(0, 1 - yFrac * yFrac));
            const theta = golden * i;
            const cargoR = 0.1;

            p.tx = Math.cos(theta) * radiusAtY * cargoR;
            p.ty = yFrac * cargoR;
            p.tz = Math.sin(theta) * radiusAtY * cargoR;
          } else {
            const j = i - cargoCount;
            const shellTotal = total - cargoCount;
            const latRings = 14;
            const pointsPerLat = shellTotal / latRings;
            const latIdx = Math.floor(j / pointsPerLat);
            const lonIdx = j % pointsPerLat;

            const theta = (latIdx / (latRings - 1)) * Math.PI;
            const phi = (lonIdx / pointsPerLat) * Math.PI * 2;

            const baseRadius = 0.45 * Math.sin(theta);
            const wavyRadius = baseRadius * (1.0 + 0.14 * Math.sin(phi * 5 + latIdx * 1.5));

            p.tx = wavyRadius * Math.cos(phi);
            p.ty = 0.45 * Math.cos(theta);
            p.tz = wavyRadius * Math.sin(phi);
          }
        } else {
          // ----------------------------------------------------
          // 5: FOOTER - GPCR-like Globular Receptor Bundle
          // A single continuous chain snaking through the membrane seven times (the real 7-
          // transmembrane topology): each helix connects to the next via a short loop at the
          // end it shares, alternating top/bottom like a true GPCR — not seven disconnected rods.
          // ----------------------------------------------------
          const coreCount = Math.floor(total * 0.15);
          const helixTotalCount = total - coreCount;

          if (i < helixTotalCount) {
            const numHelices = 7;
            const bundleR = 0.22;

            // 13 segments: TM0, loop0, TM1, loop1, ... TM5, loop5, TM6 (TMs are 3x longer than loops)
            const segWeights = [3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3];
            const totalWeight = 27;
            const u = (i / helixTotalCount) * totalWeight;
            let acc = 0;
            let segIdx = segWeights.length - 1;
            let localS = 1;
            for (let s = 0; s < segWeights.length; s++) {
              if (u < acc + segWeights[s]) {
                segIdx = s;
                localS = (u - acc) / segWeights[s];
                break;
              }
              acc += segWeights[s];
            }

            if (segIdx % 2 === 0) {
              // Transmembrane helix h: even h runs top-to-bottom, odd h runs bottom-to-top,
              // so consecutive helices always meet at the same end (no diagonal jump).
              const h = segIdx / 2;
              const heightT = h % 2 === 0 ? 1 - 2 * localS : 2 * localS - 1;
              const splay = 1 + 0.18 * heightT * heightT; // barrel splays slightly at top/bottom
              const angleOffset = (h / numHelices) * Math.PI * 2;

              const axisX = bundleR * splay * Math.cos(angleOffset);
              const axisZ = bundleR * splay * Math.sin(angleOffset);

              const localCoilTurns = 2.2;
              const localCoilR = 0.045 * Math.sin(Math.PI * localS); // tapers to 0 at both ends so it
              const localAngle = localS * Math.PI * 2 * localCoilTurns + h * 0.8; // matches the loops exactly

              p.tx = axisX + Math.cos(localAngle) * localCoilR;
              p.ty = heightT * 0.42;
              p.tz = axisZ + Math.sin(localAngle) * localCoilR;
            } else {
              // Connecting loop between helix h and helix h+1, bulging outward beyond the
              // bundle radius — the intracellular/extracellular loops of a real GPCR.
              const l = (segIdx - 1) / 2;
              const angleStart = (l / numHelices) * Math.PI * 2;
              const angleEnd = ((l + 1) / numHelices) * Math.PI * 2;
              const angle = angleStart + (angleEnd - angleStart) * localS;

              const sharedHeightT = l % 2 === 0 ? -1 : 1; // even loops join at the bottom, odd at the top
              const baseSplay = 1 + 0.18 * sharedHeightT * sharedHeightT;
              const loopR = bundleR * baseSplay + 0.1 * Math.sin(Math.PI * localS);
              const heightBulge = sharedHeightT * 0.08 * Math.sin(Math.PI * localS);

              p.tx = loopR * Math.cos(angle);
              p.ty = sharedHeightT * 0.42 + heightBulge;
              p.tz = loopR * Math.sin(angle);
            }
          } else {
            // Small bound-ligand cluster at the bundle's core
            const j = i - helixTotalCount;
            const golden = Math.PI * (3 - Math.sqrt(5));
            const yFrac = coreCount > 1 ? 1 - (j / (coreCount - 1)) * 2 : 0;
            const radiusAtY = Math.sqrt(Math.max(0, 1 - yFrac * yFrac));
            const theta2 = golden * j;
            const coreR = 0.1;

            p.tx = Math.cos(theta2) * radiusAtY * coreR;
            p.ty = yFrac * coreR;
            p.tz = Math.sin(theta2) * radiusAtY * coreR;
          }
        }
      });
    };

    // Keep rotation angles stable over frames
    let angleX = 0;
    let angleY = 0;

    // Active anim loop
    const render = () => {
      // Clear canvas with deep space translucent black to allow path trails (very subtle trailing)
      ctx.fillStyle = "#030509";
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

      const targetIdx = indexRef.current;
      setShapeTargets(targetIdx);

      const particles = particlesRef.current;
      const width = window.innerWidth;
      const height = window.innerHeight;
      const centerX = width / 2;
      const centerY = height / 2;

      // Project size mapping
      const fov = 400; // perspective lens field of view
      const viewScale = Math.min(width, height) * 0.35; // scalar responsive scale

      // Rotate camera coordinate angles slowly + incorporate scroll variables
      angleY += 0.0035;
      angleX = Math.sin(angleY * 0.3) * 0.2; // slow organic axial wobble

      // Smoothly interpolate mouse tracker coordinate values (Damping: mouse.x moves toward target)
      const mouse = mouseRef.current;
      mouse.x += (mouse.tx - mouse.x) * 0.06;
      mouse.y += (mouse.ty - mouse.y) * 0.06;

      // Combine default slow spins with user mouse coordinates
      const currentAngleY = angleY + mouse.x * 0.35;
      const currentAngleX = angleX + mouse.y * 0.35;

      const cosY = Math.cos(currentAngleY);
      const sinY = Math.sin(currentAngleY);
      const cosX = Math.cos(currentAngleX);
      const sinX = Math.sin(currentAngleX);

      // Math arrays to quickly render beautiful connections for constellations in Bench / Target segments
      const projectedNodes: { screenX: number; screenY: number; z: number; originalIdx: number }[] = [];

      // Sub-structure boundaries, mirrored from setShapeTargets, used to color accent clusters distinctly.
      // House style: every section's main structure draws from the same default particle palette;
      // only the meaningful "highlight" sub-cluster within each shape gets an accent color.
      const carrierCount = Math.floor(particles.length * 0.7); // targetIdx 2: carrier ribbon vs. payload cluster
      const nucleusCount = Math.floor(particles.length * 0.12); // targetIdx 3: nucleus vs. hexagonal lattice
      const cargoCount = Math.floor(particles.length * 0.1); // targetIdx 4: internalized cargo vs. vesicle shell
      const gpcrCoreCount = Math.floor(particles.length * 0.15); // targetIdx 5: bound ligand vs. helix bundle
      const gpcrHelixTotal = particles.length - gpcrCoreCount;

      particles.forEach((p, idx) => {
        // Physics update: spring-driven easing morph toward target coords
        const springPower = 0.035; // Morph speed setting
        const friction = 0.83; // Velocity damping

        // Acceleration
        const ax = (p.tx - p.x) * springPower;
        const ay = (p.ty - p.y) * springPower;
        const az = (p.tz - p.z) * springPower;

        // Velocity
        p.vx = (p.vx + ax) * friction;
        p.vy = (p.vy + ay) * friction;
        p.vz = (p.vz + az) * friction;

        // Position
        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;

        // Apply slow rotating transform relative to Center 
        // 1. Pivot Y
        let rx1 = p.x * cosY - p.z * sinY;
        let rz1 = p.x * sinY + p.z * cosY;
        // 2. Pivot X
        let ry2 = p.y * cosX - rz1 * sinX;
        let rz2 = p.y * sinX + rz1 * cosX;

        // Push forward on Z axis to prevent divide by zero / division errors and configure depth sorting
        const cameraZ = rz2 + 2.5;

        // Perspective projection formula
        const projectionFactor = fov / (fov + cameraZ * viewScale * 0.4);
        const screenX = centerX + rx1 * viewScale * projectionFactor;
        const screenY = centerY + ry2 * viewScale * projectionFactor;

        // Skip rendering if behind camera scope
        if (cameraZ <= 0.1) return;

        // Dynamically adjust alpha of particles based on depth/z
        const calculatedAlpha = Math.max(0.16, Math.min(0.88, 1.1 - cameraZ * 0.28));
        const depthAdjustedSize = p.originalSize * projectionFactor * (1.5 - cameraZ * 0.35);

        // Store index nodes for network lines rendering on target stages (skip the internalized cargo cluster
        // so the constellation lines only trace the vesicle's membrane shell, like a receptor network)
        if (targetIdx === 4 && idx >= cargoCount && idx % 3 === 0) {
          projectedNodes.push({
            screenX,
            screenY,
            z: cameraZ,
            originalIdx: idx,
          });
        }

        // Draw particle node
        ctx.beginPath();
        ctx.arc(screenX, screenY, Math.max(0.4, depthAdjustedSize), 0, Math.PI * 2);
        
        // Custom hue offsets based on depth and section. House rule: structural/majority particles
        // always draw from the same default palette for a consistent look across every section;
        // only the meaningful highlight sub-cluster in each shape gets a distinct accent color.
        let fillStyleStr = p.color;
        const useDefaultPalette = () => {
          try {
            return p.color.replace(/, [\d.]+\)/, `, ${calculatedAlpha})`);
          } catch (e) {
            return "rgba(255, 255, 255, 0.2)";
          }
        };

        if (targetIdx === 0) {
          // Liver lobes: warm rose-coral, matching the original site's narrative coloring
          fillStyleStr = `rgba(244, 63, 94, ${calculatedAlpha * 0.85})`;
        } else if (targetIdx === 1) {
          // Wavy metabolic disc: pure default palette, no accent override
          fillStyleStr = useDefaultPalette();
        } else if (targetIdx === 2) {
          // Carrier strategy: blue/white peptide ribbon, coral payload cluster at its terminus
          fillStyleStr = idx >= carrierCount
            ? `rgba(244, 63, 94, ${calculatedAlpha * 0.85})`
            : `rgba(59, 130, 246, ${calculatedAlpha * 0.75})`;
        } else if (targetIdx === 3) {
          // Hepatocyte: warm bright nucleus core, cyan/coral hexagonal lattice shell
          fillStyleStr = idx < nucleusCount
            ? `rgba(255, 244, 230, ${calculatedAlpha * 0.9})`
            : idx % 2 === 0
            ? `rgba(14, 165, 233, ${calculatedAlpha * 0.8})`
            : `rgba(251, 113, 133, ${calculatedAlpha * 0.8})`;
        } else if (targetIdx === 4) {
          // Vesicle, toned down slightly: coral internalized cargo, default-palette membrane shell
          const dimmedAlpha = calculatedAlpha * 0.88;
          fillStyleStr = idx < cargoCount
            ? `rgba(244, 63, 94, ${dimmedAlpha * 0.95})`
            : (() => {
                try {
                  return p.color.replace(/, [\d.]+\)/, `, ${dimmedAlpha})`);
                } catch (e) {
                  return "rgba(255, 255, 255, 0.18)";
                }
              })();
        } else if (targetIdx === 5) {
          // GPCR-like bundle: coral bound-ligand core, default-palette helix bundle
          fillStyleStr = idx >= gpcrHelixTotal
            ? `rgba(244, 63, 94, ${Math.min(0.9, calculatedAlpha * 1.1)})`
            : useDefaultPalette();
        } else {
          // Fallback: pure default palette
          fillStyleStr = useDefaultPalette();
        }
        ctx.fillStyle = fillStyleStr;
        
        ctx.fill();
      });

      // RENDER INTELLECTUAL CONNECTIONS (Constellation lines between close points)
      // Only draw connections for Section 3 (Biology Eye) and 4 (Bench Network) to preserve aesthetic minimalism
      if (targetIdx === 4) {
        ctx.lineWidth = 0.4;
        for (let i = 0; i < projectedNodes.length; i++) {
          const nodeA = projectedNodes[i];
          for (let j = i + 1; j < projectedNodes.length; j++) {
            const nodeB = projectedNodes[j];

            // Distance math
            const dx = nodeA.screenX - nodeB.screenX;
            const dy = nodeA.screenY - nodeB.screenY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            // If close, draw connection line with alpha fading over distance
            if (dist < 55) {
              const lineAlpha = (1 - dist / 55) * 0.08 * (1.5 - (nodeA.z + nodeB.z)/2 * 0.3);
              ctx.beginPath();
              ctx.moveTo(nodeA.screenX, nodeA.screenY);
              ctx.lineTo(nodeB.screenX, nodeB.screenY);
              ctx.strokeStyle = `rgba(255, 255, 255, ${lineAlpha})`;
              ctx.stroke();
            }
          }
        }
      } else if (targetIdx === 3) {
        // Draw elegant concentric contour circles mapping structural levels of biological activation
        ctx.lineWidth = 0.35;
        const outerCircleAlpha = Math.sin(angleY * 2) * 0.04 + 0.08;
        ctx.beginPath();
        ctx.arc(centerX, centerY, viewScale * 0.72, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(244, 63, 94, ${outerCircleAlpha})`;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(centerX, centerY, viewScale * 0.45, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(14, 165, 233, 0.06)`;
        ctx.stroke();
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    // Clean up function
    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* 2D Canvas Layer drawing absolute mathematical beauty */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block transform translate-z-0 transition-opacity duration-1000 ease-in-out opacity-100"
      />
    </div>
  );
};
