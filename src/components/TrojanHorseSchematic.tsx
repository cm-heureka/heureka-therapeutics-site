import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Activity, ShieldAlert, Zap, Layers, RefreshCw, Check, ArrowRight } from "lucide-react";

interface Stage {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  icon: React.ComponentType<{ className?: string }>;
}

const STAGES: Stage[] = [
  {
    id: 0,
    title: "1. Receptor Binding",
    subtitle: "GPCR Target Binding",
    description: "The therapeutic conjugate binds selectively to target peptide GPCRs on the surface of liver cells.",
    badge: "TARGET BINDING",
    icon: Layers,
  },
  {
    id: 1,
    title: "2. Internalization",
    subtitle: "Vesicle Intake",
    description: "Upon binding, the receptor-conjugate complex is internalized, bringing the therapeutic inside the cell.",
    badge: "CELL ENTRY",
    icon: Activity,
  },
  {
    id: 2,
    title: "3. Late Endosome",
    subtitle: "Drug Release",
    description: "Inside the late endosome, acidic processes cleave the linker, releasing the active drug.",
    badge: "LINKER CLEAVAGE",
    icon: ShieldAlert,
  },
  {
    id: 3,
    title: "4. Receptor Recycling & Action",
    subtitle: "AMPK Activation",
    description: "The empty receptor recycles back to the cell surface, while the released drug activates AMPK to assist cellular clearance.",
    badge: "CELL CLEANING",
    icon: Zap,
  },
];

// Shared geometry for the Stage-2 (Internalization) plasma-membrane invagination.
// Both the boundary lines AND the phospholipid heads are derived from this single
// centerline function, so the lipid dots always sit exactly on the membrane curve.
const MEMBRANE_FLAT_Y = 130;
const PIT_X_START = 175;
const PIT_X_END = 375;
const PIT_DEPTH = 78;

const membraneCenterY = (x: number): number => {
  if (x <= PIT_X_START || x >= PIT_X_END) return MEMBRANE_FLAT_Y;
  const t = (x - PIT_X_START) / (PIT_X_END - PIT_X_START);
  return MEMBRANE_FLAT_Y + PIT_DEPTH * Math.sin(t * Math.PI);
};

const buildMembraneLine = (offset: number, x0 = 10, x1 = 540, step = 6): string => {
  const points: string[] = [];
  for (let x = x0; x <= x1; x += step) {
    const y = membraneCenterY(x) + offset;
    points.push(`${points.length === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  return points.join(" ");
};

const buildMembraneBand = (x0 = 10, x1 = 540, step = 6): string => {
  const top: string[] = [];
  const bottom: string[] = [];
  for (let x = x0; x <= x1; x += step) {
    top.push(`${x.toFixed(1)} ${(membraneCenterY(x) - 10).toFixed(1)}`);
    bottom.push(`${x.toFixed(1)} ${(membraneCenterY(x) + 10).toFixed(1)}`);
  }
  const forward = top.map((p, i) => `${i === 0 ? "M" : "L"} ${p}`).join(" ");
  const backward = bottom.reverse().map((p) => `L ${p}`).join(" ");
  return `${forward} ${backward} Z`;
};

export const TrojanHorseSchematic: React.FC = () => {
  const [activeStage, setActiveStage] = useState<number>(0);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);

  // Auto rotate through stages to keep site feeling alive and animated
  useEffect(() => {
    if (!autoRotate) return;
    const interval = setInterval(() => {
      setActiveStage((prev) => (prev + 1) % STAGES.length);
    }, 8500);
    return () => clearInterval(interval);
  }, [autoRotate]);

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start bg-[#07090f]/90 p-6 md:p-8 rounded-2xl border border-white/5 backdrop-blur-xl relative overflow-hidden">
      
      {/* Decorative subtle ambient background grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff02_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      {/* Left panel: Functional Stage Selection */}
      <div className="lg:col-span-5 flex flex-col justify-between h-full relative z-10">
        <div>
          <div className="flex items-center justify-between mb-5">
            <span className="font-mono text-[10px] tracking-widest text-[#f43f5e] uppercase flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f43f5e] animate-ping" />
              HEPATIC TARGETING SYSTEM (HTS)
            </span>
            <button
              onClick={() => setAutoRotate(!autoRotate)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded border text-[9px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
                autoRotate
                  ? "bg-[#f43f5e]/10 text-[#fda4af] border-[#f43f5e]/20"
                  : "bg-white/5 text-gray-400 border-white/5 hover:border-white/10"
              }`}
            >
              <RefreshCw className={`w-2.5 h-2.5 ${autoRotate ? "animate-spin" : ""}`} style={{ animationDuration: autoRotate ? "4s" : "0s" }} />
              {autoRotate ? "Auto-playing" : "Paused"}
            </button>
          </div>

          <h3 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-white mb-2">
            Mechanism of Action
          </h3>
          <p className="text-xs md:text-sm text-gray-400 font-light leading-relaxed mb-6">
            Click on each developmental stage to dynamically step through Heureka's tissue-selective therapeutic journey—from target receptor binding to intracellular AMPK heterotrimer activation.
          </p>
        </div>

        <div className="space-y-3">
          {STAGES.map((stage) => {
            const Icon = stage.icon;
            const isActive = stage.id === activeStage;
            return (
              <button
                key={stage.id}
                onClick={() => {
                  setActiveStage(stage.id);
                  setAutoRotate(false);
                }}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-300 relative group cursor-pointer ${
                  isActive
                    ? "bg-[#0a0d17] border-white/10 shadow-[0_5px_25px_rgba(244,63,94,0.08)]"
                    : "bg-transparent border-transparent hover:bg-white/[0.02]"
                }`}
              >
                {/* Lateral high-contrast crimson tag */}
                {isActive && (
                  <motion.div
                    layoutId="heurekaMoAIndicator"
                    className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-[#f43f5e] to-[#ec4899] rounded-l-xl"
                  />
                )}

                <div className="flex gap-3.5">
                  <div
                    className={`p-2.5 rounded-lg border transition-colors ${
                      isActive
                        ? "bg-[#f43f5e]/10 border-[#f43f5e]/20 text-[#fda4af]"
                        : "bg-white/5 border-white/5 text-gray-500 group-hover:text-gray-300"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-mono text-[9px] tracking-widest text-[#f43f5e] font-bold uppercase">
                        {stage.badge}
                      </span>
                      {isActive && (
                        <span className="text-[9px] font-mono text-[#fda4af] flex items-center gap-1">
                          Active State <Check className="w-2.5 h-2.5" />
                        </span>
                      )}
                    </div>
                    <h4
                      className={`font-display text-sm font-semibold tracking-tight transition-colors ${
                        isActive ? "text-white" : "text-gray-400 group-hover:text-gray-200"
                      }`}
                    >
                      {stage.title}
                    </h4>
                    
                    <AnimatePresence initial={false}>
                      {isActive && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <p className="text-xs text-gray-300 font-light leading-relaxed mt-2 pt-1 border-t border-white/5">
                            {stage.description}
                          </p>
                          <div className="mt-2.5 flex items-center gap-1.5 text-[10px] uppercase font-semibold font-mono text-[#fda4af]">
                            <span>{stage.subtitle}</span>
                            <ArrowRight className="w-3 h-3 text-[#f43f5e]" />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right panel: Animated SVG Cell Membrane Biology Art Board */}
      <div className="lg:col-span-7 h-[420px] md:h-[480px] bg-[#030509]/80 rounded-2xl border border-white/5 relative overflow-hidden flex flex-col items-center justify-between p-4 shadow-[inset_0_4px_30px_rgba(0,0,0,0.8)]">
        
        {/* Soft bioluminescent spot backdrops */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#f43f5e]/5 rounded-full filter blur-[70px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-56 h-56 bg-[#3b82f6]/5 rounded-full filter blur-[60px] pointer-events-none" />

        {/* Dynamic biological art label overlays */}
        <div className="w-full flex justify-between items-center z-10 text-[9px] font-mono uppercase tracking-wider text-gray-500">
          <span>Hepatocyte Microenvironment</span>
          <span className="text-[#fda4af]">{STAGES[activeStage].subtitle}</span>
        </div>

        {/* Dynamic Vector Cellular Board */}
        <svg
          viewBox="0 0 550 420"
          className="w-full h-full select-none"
          xmlns="http://www.w3.org/2000/svg"
          referrerPolicy="no-referrer"
        >
          {/* DEFINITIONS */}
          <defs>
            {/* Soft pink to blue gradient for molecules */}
            <linearGradient id="conjugateLinkerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="50%" stopColor="#9333ea" />
              <stop offset="100%" stopColor="#f43f5e" />
            </linearGradient>

            {/* Glowing background circles */}
            <radialGradient id="endosomeGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#1e1b4b" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#0f172a" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#020617" stopOpacity="0" />
            </radialGradient>

            {/* Lysosome color gradient */}
            <radialGradient id="lysosomeGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#31102f" stopOpacity="0.85" />
              <stop offset="70%" stopColor="#180c1d" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#030712" stopOpacity="0" />
            </radialGradient>

            {/* Glow filters */}
            <filter id="softMoAGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* ==================================================== */}
          {/* CANVAS STAGE 1 (INDEX 0): RECEPTOR BINDING & HOMING  */}
          {/* ==================================================== */}
          <AnimatePresence mode="wait">
            {activeStage === 0 && (
              <motion.g
                key="moa_step_0"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.4 }}
              >
                {/* Horizontal Plasma Membrane bilayer with Phospholipids */}
                <g>
                  <rect x="10" y="120" width="530" height="20" fill="rgba(255, 255, 255, 0.02)" rx="4" />
                  <line x1="10" y1="120" x2="540" y2="120" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                  <line x1="10" y1="140" x2="540" y2="140" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                  
                  {/* Phospholipid heads along top and bottom */}
                  {Array.from({ length: 25 }).map((_, idx) => {
                    const cx = 20 + idx * 21;
                    if (cx > 200 && cx < 340) return null; // Skip GPCR region
                    return (
                      <g key={idx} opacity="0.35">
                        <circle cx={cx} cy="116" r="3" fill="#94a3b8" />
                        <line x1={cx} y1="119" x2={cx} y2="125" stroke="#64748b" strokeWidth="0.8" />
                        <line x1={cx} y1="135" x2={cx} y2="141" stroke="#64748b" strokeWidth="0.8" />
                        <circle cx={cx} cy="144" r="3" fill="#94a3b8" />
                      </g>
                    );
                  })}
                </g>

                {/* GPCR Target Receptor: 7-Transmembrane GPCR (Pink/Crimson Helices) */}
                <g transform="translate(210, 80)">
                  {/* 7 Helices across Membrane (y=120 to y=140 in canvas coordinates. Translates aligned perfectly) */}
                  {Array.from({ length: 7 }).map((_, i) => {
                    const hx = 12 + i * 15;
                    const hy = 32;
                    return (
                      <g key={i}>
                        <rect
                          x={hx}
                          y={hy}
                          width="11"
                          height="36"
                          rx="4"
                          fill="url(#conjugateLinkerGrad)"
                          fillOpacity="0.85"
                          stroke="#fda4af"
                          strokeWidth="1"
                        />
                        <line x1={hx + 3} y1={hy + 4} x2={hx + 3} y2={hy + 32} stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
                      </g>
                    );
                  })}

                  {/* Labels positioned in Cytosol to avoid any overlap with extracellular conjugate */}
                  <text x="57" y="105" textAnchor="middle" fill="#fda4af" className="text-[9px] font-mono tracking-widest font-semibold">
                    TARGET GPCR RECEPTOR
                  </text>
                  <text x="57" y="118" textAnchor="middle" fill="rgba(255,255,255,0.4)" className="text-[8px] font-mono uppercase tracking-wider">
                    Cytosol Domain
                  </text>
                </g>

                {/* Biological boundaries annotations */}
                <text x="25" y="60" fill="rgba(255, 255, 255, 0.2)" className="text-[8px] font-mono uppercase tracking-widest">
                  Extracellular Space
                </text>
                <text x="25" y="220" fill="rgba(255, 255, 255, 0.2)" className="text-[8px] font-mono uppercase tracking-widest">
                  Cytosol Volume
                </text>

                {/* Active Conjugate molecule: Intact compact therapeutic molecule chain */}
                <motion.g
                  initial={{ x: 265, y: -20, opacity: 0 }}
                  animate={{ x: 265, y: 104, opacity: 1 }}
                  transition={{ 
                    duration: 3, 
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatType: "reverse",
                    repeatDelay: 0.5
                  }}
                >
                  {/* Blue Peptide segment */}
                  <g transform="translate(-25, -10)">
                    {Array.from({ length: 4 }).map((_, k) => {
                      const kx = -10 + k * 6;
                      const ky = Math.sin(k * 1.5) * 1.5;
                      return (
                        <circle key={k} cx={kx} cy={ky} r="2.5" fill="#2563eb" stroke="#93c5fd" strokeWidth="0.8" />
                      );
                    })}
                    <text x="-4" y="-12" textAnchor="middle" fill="#60a5fa" className="text-[7.5px] font-mono uppercase font-bold tracking-wider">
                      Peptide
                    </text>
                  </g>

                  {/* Gray Linker segment */}
                  <g transform="translate(3, -10)">
                    <line x1="-18" y1="0" x2="18" y2="0" stroke="#cbd5e1" strokeWidth="1.8" strokeDasharray="1 1" />
                    <circle cx="0" cy="0" r="2.2" fill="#64748b" />
                    <text x="0" y="14" textAnchor="middle" fill="#cbd5e1" className="text-[7.5px] font-mono lowercase font-bold tracking-wider">
                      linker
                    </text>
                  </g>

                  {/* Pink AMPK activator */}
                  <g transform="translate(31, -10)">
                    <polygon
                      points="0,-6 5.2,-3 5.2,3 0,6 -5.2,3 -5.2,-3"
                      fill="rgba(244, 63, 94, 0.2)"
                      stroke="#f43f5e"
                      strokeWidth="1.2"
                    />
                    <circle cx="0" cy="0" r="1.5" fill="#fb7185" />
                    <text x="0" y="-12" textAnchor="middle" fill="#fda4af" className="text-[7.5px] font-mono font-bold tracking-wider">
                      AMPK Activator
                    </text>
                  </g>
                </motion.g>

                {/* Pathway callout */}
                <g transform="translate(35, 255)">
                  <rect x="0" y="0" width="160" height="120" rx="8" fill="rgba(255,255,255,0.01)" stroke="rgba(255,255,255,0.05)" />
                  <rect x="0" y="0" width="160" height="24" rx="8" fill="rgba(37,99,235,0.1)" stroke="rgba(37,99,235,0.15)" />
                  <text x="80" y="15" textAnchor="middle" fill="#93c5fd" className="text-[8px] font-mono font-bold tracking-wider uppercase">
                    RECEPTOR ACTIONS
                  </text>
                  <text x="12" y="48" fill="#cbd5e1" className="text-[7.5px] font-sans font-medium">
                    • Stimulates lipolysis
                  </text>
                  <text x="12" y="74" fill="#cbd5e1" className="text-[7.5px] font-sans font-medium">
                    • Reduces lipogenesis
                  </text>
                  <text x="12" y="100" fill="#cbd5e1" className="text-[7.5px] font-sans font-medium">
                    • Raises hepatic cAMP
                  </text>
                </g>
              </motion.g>
            )}

            {/* ==================================================== */}
            {/* CANVAS STAGE 2 (INDEX 1): VECTOR INTERNALIZATION     */}
            {/* ==================================================== */}
            {activeStage === 1 && (
              <motion.g
                key="moa_step_1"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.4 }}
              >
                {/* CONSISTENT CELL MEMBRANE BILAYER — boundary lines and phospholipid heads
                    are both derived from membraneCenterY(), so they always coincide exactly. */}
                <g>
                  <path d={buildMembraneBand()} fill="rgba(255, 255, 255, 0.02)" />
                  <path d={buildMembraneLine(-10)} stroke="rgba(255,255,255,0.06)" strokeWidth="1" fill="none" />
                  <path d={buildMembraneLine(10)} stroke="rgba(255,255,255,0.06)" strokeWidth="1" fill="none" />

                  {/* Phospholipid beads, sampled at the exact same x-positions used for the flat membrane in stages 1 & 4 */}
                  {Array.from({ length: 25 }).map((_, idx) => {
                    const cx = 20 + idx * 21;
                    if (cx > 540) return null;
                    const centerY = membraneCenterY(cx);
                    return (
                      <g key={idx} opacity="0.35">
                        <circle cx={cx} cy={centerY - 14} r="3" fill="#94a3b8" />
                        <line x1={cx} y1={centerY - 11} x2={cx} y2={centerY - 5} stroke="#64748b" strokeWidth="0.8" />
                        <line x1={cx} y1={centerY + 5} x2={cx} y2={centerY + 11} stroke="#64748b" strokeWidth="0.8" />
                        <circle cx={cx} cy={centerY + 14} r="3" fill="#94a3b8" />
                      </g>
                    );
                  })}
                </g>

                {/* GPCR Target Receptor, enlarged, transversing the bilayer at the pit's deepest point */}
                <g transform={`translate(275, ${membraneCenterY(275)})`}>
                  {/* 7 helices, sized like the Stage 1 receptor, following the membrane's own
                      curvature so each one sits exactly on the dipping bilayer rather than floating. */}
                  {Array.from({ length: 7 }).map((_, h) => {
                    const xOffset = (h - 3) * 13;
                    const localY = membraneCenterY(275 + xOffset) - membraneCenterY(275);

                    return (
                      <g key={h} transform={`translate(${xOffset}, ${localY})`}>
                        <rect
                          x="-5.5"
                          y="-18"
                          width="11"
                          height="36"
                          rx="4"
                          fill="url(#conjugateLinkerGrad)"
                          fillOpacity="0.85"
                          stroke="#fda4af"
                          strokeWidth="1"
                        />
                        <line x1="-2.5" y1="-14" x2="-2.5" y2="14" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
                      </g>
                    );
                  })}

                </g>

                {/* Bound receptor-conjugate complex — the same Peptide/linker/AMPK Activator design as
                    Stage 1, still attached on the extracellular face it bound to. Placed well up inside
                    the open mouth of the invaginating pit, clear of both the funnel walls and the receptor. */}
                <g transform="translate(275, 158)">
                  {/* Blue Peptide segment */}
                  <g transform="translate(-25, -10)">
                    {Array.from({ length: 4 }).map((_, k) => {
                      const kx = -10 + k * 6;
                      const ky = Math.sin(k * 1.5) * 1.5;
                      return (
                        <circle key={k} cx={kx} cy={ky} r="2.5" fill="#2563eb" stroke="#93c5fd" strokeWidth="0.8" />
                      );
                    })}
                    <text x="-4" y="-12" textAnchor="middle" fill="#60a5fa" className="text-[7.5px] font-mono uppercase font-bold tracking-wider">
                      Peptide
                    </text>
                  </g>

                  {/* Gray Linker segment */}
                  <g transform="translate(3, -10)">
                    <line x1="-18" y1="0" x2="18" y2="0" stroke="#cbd5e1" strokeWidth="1.8" strokeDasharray="1 1" />
                    <circle cx="0" cy="0" r="2.2" fill="#64748b" />
                    <text x="0" y="14" textAnchor="middle" fill="#cbd5e1" className="text-[7.5px] font-mono lowercase font-bold tracking-wider">
                      linker
                    </text>
                  </g>

                  {/* Pink AMPK activator */}
                  <g transform="translate(31, -10)">
                    <polygon
                      points="0,-6 5.2,-3 5.2,3 0,6 -5.2,3 -5.2,-3"
                      fill="rgba(244, 63, 94, 0.2)"
                      stroke="#f43f5e"
                      strokeWidth="1.2"
                    />
                    <circle cx="0" cy="0" r="1.5" fill="#fb7185" />
                    <text x="0" y="-12" textAnchor="middle" fill="#fda4af" className="text-[7.5px] font-mono font-bold tracking-wider">
                      AMPK Activator
                    </text>
                  </g>
                </g>

                {/* Entire arrow as a single robust path to guarantee perfect synchronization */}
                <g transform="translate(275, 235)">
                  <motion.g
                    animate={{ y: [0, 8, 0] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  >
                    <path
                      d="M 0 0 L 0 35 M -6 27 L 0 35 L 6 27"
                      stroke="#f43f5e"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    />
                  </motion.g>
                  <text x="0" y="52" textAnchor="middle" fill="#fda4af" className="text-[8.5px] font-mono uppercase tracking-widest leading-none font-semibold">
                    Receptor-mediated Internalisation
                  </text>
                </g>

                <text x="275" y="60" textAnchor="middle" fill="#60a5fa" className="text-[9px] font-mono tracking-wider font-semibold">
                  CLATHRIN-COATED MEMBRANE VEHICLE
                </text>
              </motion.g>
            )}

            {/* ==================================================== */}
            {/* CANVAS STAGE 3 (INDEX 2): LATE ENDOSOME              */}
            {/* ==================================================== */}
            {activeStage === 2 && (
              <motion.g
                key="moa_step_2"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.4 }}
              >
                {/* LATE ENDOSOME Organelle with consistent concentric double membrane bilayer */}
                <circle cx="275" cy="200" r="105" fill="url(#lysosomeGlow)" stroke="rgba(244,63,94,0.15)" strokeWidth="1" />
                <circle cx="275" cy="200" r="99" fill="none" stroke="rgba(244,63,94,0.1)" strokeWidth="1" />
                <circle cx="275" cy="200" r="93" fill="none" stroke="rgba(244,63,94,0.1)" strokeWidth="1" strokeDasharray="3 3" />

                {/* Just call it late endosome, extremely clean */}
                <text x="275" y="125" textAnchor="middle" fill="#fda4af" className="text-[10px] font-mono tracking-widest font-bold uppercase">
                  LATE ENDOSOME
                </text>

                {/* Symmetrical empty GPCR receptor (7-Transmembrane) crossing the late endosome membrane bilayer.
                    The helix bundle is rotated to cross the membrane at an angle, but its label is kept
                    in its own un-rotated group so the text stays horizontal and readable. */}
                <g transform="translate(195, 140) rotate(-45)">
                  {Array.from({ length: 7 }).map((_, i) => {
                    const hx = -15 + i * 5;
                    return (
                      <rect
                        key={i}
                        x={hx}
                        y="-10"
                        width="4"
                        height="20"
                        rx="1"
                        fill="url(#conjugateLinkerGrad)"
                        stroke="#fda4af"
                        strokeWidth="0.5"
                      />
                    );
                  })}
                </g>
                <text x="211" y="160" textAnchor="middle" fill="rgba(255,255,255,0.4)" className="text-[7px] font-mono uppercase tracking-wider">
                  Empty GPCR
                </text>

                {/* Linker cleavage event, centered on the organelle with generous spacing so labels never collide */}
                <g>
                  {/* Left: Peptide Portion */}
                  <g transform="translate(208, 195)">
                    {Array.from({ length: 4 }).map((_, k) => {
                      const kx = -8 + k * 5.5;
                      const ky = Math.sin(k * 1.5) * 1.5;
                      return (
                        <circle key={k} cx={kx} cy={ky} r="2.2" fill="#2563eb" stroke="#93c5fd" strokeWidth="0.6" />
                      );
                    })}
                    <path d="M 14 0 L 55 0" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="1.5 1" />
                    <text x="3" y="18" textAnchor="middle" fill="#60a5fa" className="text-[7.5px] font-mono uppercase tracking-wider font-semibold">
                      Peptide
                    </text>
                  </g>

                  {/* Center: Scissors & Cleavage Site indicator, sitting at the endosome's true center */}
                  <g transform="translate(275, 195)">
                    <circle cx="0" cy="0" r="12" fill="rgba(239, 68, 68, 0.15)" stroke="#ef4444" strokeWidth="0.8" className="animate-pulse" />

                    <g transform="translate(0, -18) rotate(-15)">
                      <line x1="-5" y1="-5" x2="3" y2="3" stroke="#fca5a5" strokeWidth="1.2" strokeLinecap="round" />
                      <circle cx="-6.5" cy="-6.5" r="1.8" stroke="#fca5a5" strokeWidth="1.2" fill="none" />
                      <line x1="5" y1="-5" x2="-3" y2="3" stroke="#fca5a5" strokeWidth="1.2" strokeLinecap="round" />
                      <circle cx="6.5" cy="-6.5" r="1.8" stroke="#fca5a5" strokeWidth="1.2" fill="none" />
                    </g>

                    <text x="0" y="34" textAnchor="middle" fill="#cbd5e1" className="text-[7.5px] font-mono uppercase tracking-widest font-semibold">
                      Cleaved Linker
                    </text>
                  </g>

                  {/* Right: Liberated AMPK Drug separating */}
                  <g transform="translate(342, 195)">
                    <path d="M -55 0 L -12 0" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="1.5 1" />

                    <polygon
                      points="0,-5 4.33,-2.5 4.33,2.5 0,5 -4.33,2.5 -4.33,-2.5"
                      fill="rgba(244, 63, 94, 0.2)"
                      stroke="#f43f5e"
                      strokeWidth="1.2"
                    />
                    <circle cx="0" cy="0" r="1.5" fill="#fb7185" />
                    <text x="0" y="18" textAnchor="middle" fill="#fda4af" className="text-[7.5px] font-mono font-bold tracking-wider uppercase">
                      AMPK Activator
                    </text>
                  </g>
                </g>

                {/* 3. Escaping drug - animated escaping from late endosome into cytosol, well clear of the organelle's outer ring */}
                <motion.g
                  initial={{ x: 342, y: 195, opacity: 0.2 }}
                  animate={{ x: 432, y: 195, opacity: 1 }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeOut" }}
                >
                  <polygon
                    points="0,-7 6.06,-3.5 6.06,3.5 0,7 -6.06,3.5 -6.06,-3.5"
                    fill="rgba(244, 63, 94, 0.2)"
                    stroke="#f43f5e"
                    strokeWidth="1.2"
                  />
                  <circle cx="0" cy="0" r="2" fill="#fb7185" />
                </motion.g>

                {/* Label for escaping drug, placed well below its resting position so it never overlaps the moving icon */}
                <text x="432" y="232" textAnchor="middle" fill="#fda4af" className="text-[8px] font-mono font-bold tracking-wider uppercase">
                  AMPK Activator
                </text>
              </motion.g>
            )}

            {/* ==================================================== */}
            {/* CANVAS STAGE 4 (INDEX 3): RECYCLING & AMPK RESET     */}
            {/* ==================================================== */}
            {activeStage === 3 && (
              <motion.g
                key="moa_step_3"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.4 }}
              >
                {/* CONSISTENT CELL MEMBRANE BILAYER */}
                <g>
                  <rect x="10" y="120" width="530" height="20" fill="rgba(255, 255, 255, 0.02)" rx="4" />
                  <line x1="10" y1="120" x2="540" y2="120" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                  <line x1="10" y1="140" x2="540" y2="140" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                  
                  {/* Symmetrical Phospholipid heads */}
                  {Array.from({ length: 25 }).map((_, idx) => {
                    const cx = 20 + idx * 21;
                    if (cx > 350 && cx < 490) return null; // Skip GPCR release/recycle region
                    return (
                      <g key={idx} opacity="0.35">
                        <circle cx={cx} cy="116" r="3" fill="#94a3b8" />
                        <line x1={cx} y1="119" x2={cx} y2="125" stroke="#64748b" strokeWidth="0.8" />
                        <line x1={cx} y1="135" x2={cx} y2="141" stroke="#64748b" strokeWidth="0.8" />
                        <circle cx={cx} cy="144" r="3" fill="#94a3b8" />
                      </g>
                    );
                  })}
                  
                  <text x="25" y="105" fill="rgba(255, 255, 255, 0.2)" className="text-[8px] font-mono uppercase tracking-widest">
                    Plasma Membrane
                  </text>
                </g>
                  
                {/* GPCR Recycling Endosome Vesicle */}
                <g transform="translate(420, 188)">
                  {/* CONSISTENT concentric double membrane bilayer */}
                  <circle cx="0" cy="0" r="32" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                  <circle cx="0" cy="0" r="38" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                  
                  {/* GPCR helices embedded symmetrically crossing the circular membrane nicely facing outwards (towards PM above) */}
                  {Array.from({ length: 7 }).map((_, h) => {
                    const angle = Math.PI * 1.5 + (h - 3) * 0.18; // top half facing the plasma membrane
                    const vx = 35 * Math.cos(angle);
                    const vy = 35 * Math.sin(angle);
                    const rotAngle = (angle * 180) / Math.PI - 90;
                    return (
                      <g key={h} transform={`translate(${vx}, ${vy}) rotate(${rotAngle})`}>
                        <rect
                          x="-2.5"
                          y="-7"
                          width="5"
                          height="14"
                          rx="1.5"
                          fill="url(#conjugateLinkerGrad)"
                          stroke="#fda4af"
                          strokeWidth="0.5"
                        />
                      </g>
                    );
                  })}
                  
                  {/* Recycling curved arrow moving upwards toward Plasma Membrane */}
                  <path d="M 0 -38 Q 20 -55 25 -65" stroke="#ec4899" strokeWidth="1.8" strokeLinecap="round" fill="none" strokeDasharray="3 2" />
                  <polygon points="25,-65 19,-61 23,-57" fill="#ec4899" />
                  
                  <text x="0" y="55" textAnchor="middle" fill="rgba(255, 255, 255, 0.4)" className="text-[7.5px] font-mono uppercase tracking-wider">
                    RECYCLING VESICLE
                  </text>
                </g>

                {/* THE AMPK COMPLEX HETEROTRIMER */}
                <g transform="translate(140, 240)">
                  <circle cx="60" cy="50" r="85" fill="rgba(37,99,235,0.04)" className="animate-pulse" />

                  {/* Lobe 1: ALPHA subunit */}
                  <g transform="translate(30, 25)">
                    <circle cx="0" cy="0" r="33" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="2.5" />
                    <text x="0" y="5" textAnchor="middle" fill="#fff" className="font-display text-lg font-bold">
                      α
                    </text>
                    <text x="0" y="16" textAnchor="middle" fill="#93c5fd" className="text-[7px] font-mono tracking-widest uppercase">
                      Alpha
                    </text>
                  </g>

                  {/* Lobe 2: BETA subunit */}
                  <g transform="translate(90, 25)">
                    <circle cx="0" cy="0" r="30" fill="#172554" stroke="#2563eb" strokeWidth="2" />
                    <text x="0" y="4" textAnchor="middle" fill="#fff" className="font-display text-base font-bold">
                      β
                    </text>
                    <text x="0" y="14" textAnchor="middle" fill="#93c5fd" className="text-[7px] font-mono tracking-widest uppercase">
                      Beta
                    </text>
                  </g>

                  {/* Lobe 3: GAMMA subunit */}
                  <g transform="translate(60, 75)">
                    <circle cx="0" cy="0" r="28" fill="#1d4ed8" stroke="#60a5fa" strokeWidth="1.8" />
                    <text x="0" y="3" textAnchor="middle" fill="#fff" className="font-display text-base font-bold">
                      γ
                    </text>
                    <text x="0" y="13" textAnchor="middle" fill="#93c5fd" className="text-[7px] font-mono tracking-widest uppercase">
                      Gamma
                    </text>
                  </g>

                  {/* Scientific header */}
                  <text x="60" y="-15" textAnchor="middle" fill="#93c5fd" className="text-[9px] font-mono font-bold tracking-widest uppercase">
                    AMPK COMPONENT
                  </text>

                  {/* Consistent simple hexagon drug docked to regulatory site */}
                  <g transform="translate(60, 42)">
                    <rect x="-12" y="-12" width="24" height="24" rx="4" fill="#020617" stroke="#fda4af" strokeWidth="1" />
                    
                    <polygon
                      points="0,-8 6.93,-4 6.93,4 0,8 -6.93,4 -6.93,-4"
                      fill="#f43f5e"
                      stroke="#fda4af"
                      strokeWidth="1"
                    />
                    
                    <circle cx="0" cy="0" r="1.5" fill="#fff" />
                    <circle cx="0" cy="0" r="14" fill="none" stroke="#e11d48" strokeWidth="1.5" strokeDasharray="2 1" className="animate-spin" style={{ animationDuration: '6s' }} />
                  </g>

                  {/* Activated Phosphorylation glow tags */}
                  <g transform="translate(0, 10)">
                    <circle cx="0" cy="15" r="9.5" fill="#ec4899" filter="url(#softMoAGlow)" />
                    <text x="0" y="18" textAnchor="middle" fill="#fff" className="text-[9px] font-mono font-bold">P</text>
                    
                    <circle cx="120" cy="15" r="9.5" fill="#ec4899" filter="url(#softMoAGlow)" />
                    <text x="120" y="18" textAnchor="middle" fill="#fff" className="text-[9px] font-mono font-bold">P</text>
                  </g>
                </g>

                {/* Left Bottom Column: AMPK-derived hepatic metabolic responses */}
                <g transform="translate(372, 248)">
                  <rect x="0" y="0" width="162" height="140" rx="8" fill="rgba(255,255,255,0.01)" stroke="rgba(255,255,255,0.05)" />
                  <rect x="0" y="0" width="162" height="24" rx="8" fill="rgba(244,63,94,0.1)" stroke="rgba(244,63,94,0.15)" />
                  <text x="81" y="15" textAnchor="middle" fill="#fda4af" className="text-[8px] font-mono font-bold tracking-wider uppercase">
                    AMPK ACTIVATION
                  </text>

                  <text x="10" y="46" fill="#cbd5e1" className="text-[7.5px] font-sans font-medium">
                    • Inhibits lipogenesis
                  </text>
                  <text x="10" y="68" fill="#cbd5e1" className="text-[7.5px] font-sans font-medium">
                    • Promotes fat oxidation
                  </text>
                  <text x="10" y="90" fill="#cbd5e1" className="text-[7.5px] font-sans font-medium">
                    • Suppresses gluconeogenesis
                  </text>
                  <text x="10" y="112" fill="#cbd5e1" className="text-[7.5px] font-sans font-medium">
                    • Restores metabolic balance
                  </text>
                </g>
              </motion.g>
            )}
          </AnimatePresence>
        </svg>

        {/* Bottom Interactive Step Indicator Row */}
        <div className="w-full flex justify-between items-center bg-black/40 border border-white/5 p-2 rounded-xl z-10 font-mono text-[9px] mt-1">
          <div className="flex items-center gap-1.5 text-gray-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Interactive Simulator</span>
          </div>

          {/* Stepper nodes */}
          <div className="flex gap-2.5">
            {STAGES.map((stg) => {
              const isActive = stg.id === activeStage;
              return (
                <button
                  key={stg.id}
                  onClick={() => {
                    setActiveStage(stg.id);
                    setAutoRotate(false);
                  }}
                  className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#f43f5e] text-white border-[#f43f5e] shadow-[0_0_8px_rgba(244,63,94,0.5)]"
                      : "bg-[#0b0f19] text-gray-500 border-white/10 hover:border-white/20 hover:text-gray-300"
                  }`}
                >
                  {stg.id + 1}
                </button>
              );
            })}
          </div>

          <div className="text-gray-400 uppercase tracking-widest">
            Heureka Tx
          </div>
        </div>
      </div>
    </div>
  );
};
