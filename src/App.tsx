import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowDown, 
  MapPin, 
  Mail, 
  ShieldCheck, 
  Volume2, 
  VolumeX, 
  Globe, 
  ChevronRight, 
  ExternalLink,
  Lock,
  Compass,
  CheckCircle2
} from "lucide-react";

import { HeurekaLogo, DeltaIcon, DeltaTxIcon } from "./components/Logo";
import { InteractiveCanvas } from "./components/InteractiveCanvas";
import { TrojanHorseSchematic } from "./components/TrojanHorseSchematic";
import { TeamGrid } from "./components/TeamGrid";

export default function App() {
  const [activeSection, setActiveSection] = useState<number>(0);
  
  // Contact Portal Form States
  const [email, setEmail] = useState<string>("");
  const [topic, setTopic] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [portalStatus, setPortalStatus] = useState<"idle" | "validating" | "encrypting" | "success">("idle");
  const [portalLog, setPortalLog] = useState<string[]>([]);
  
  // Custom navigation menu
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  // References to page sections to handle scroll-spy interaction
  const sectionIds = ["hero", "mission", "technology", "biology", "team_and_roots", "inquire_and_footer"];

  // Handle intersection observer to spy on scrolling sections
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -40% 0px", // triggers when section dominates screen
      threshold: 0.1,
    };

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          const index = sectionIds.indexOf(sectionId);
          if (index !== -1) {
            setActiveSection(index);
          }
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Handle inquiry portal routing and formatting
  const handlePortalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !topic || !description) return;

    setPortalStatus("validating");
    setPortalLog(["Initializing Copenhagen inquiry gateway...", "Parsing submission payload..."]);
    
    setTimeout(() => {
      setPortalStatus("encrypting");
      setPortalLog((prev) => [
        ...prev,
        "Structuring communication template...",
        "Validating router channels for curious@heureka.bio...",
        "Preparing standard outbound dispatch payload..."
      ]);

      setTimeout(() => {
        setPortalStatus("success");
        setPortalLog((prev) => [
          ...prev,
          "Inquiry formatting complete.",
          "Redirecting to local mail client...",
          `Success: Ready for dispatch from ${email}`
        ]);

        // Construct standard mailto link to guarantee actual email sending to curious@heureka.bio
        const mailtoUrl = `mailto:curious@heureka.bio?subject=${encodeURIComponent(
          `Heureka Inquiry: ${topic}`
        )}&body=${encodeURIComponent(
          `Hello Heureka Team,\n\nI would like to inquire about: ${topic}\n\nDescription:\n${description}\n\nKind regards,\n${email}`
        )}`;
        
        // Launch default mail application natively with fallback for iframe sandbox restrictions
        try {
          window.location.href = mailtoUrl;
        } catch (err) {
          console.warn("Mail application launch blocked by iframe sandbox restrictions. Fallback link is available.", err);
        }

      }, 1500);
    }, 1200);
  };

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  return (
    <div className="relative min-h-screen selection:bg-[#f43f5e]/30 selection:text-white text-gray-200 bg-[#030509] overflow-x-hidden font-sans antialiased">
      
      {/* 3D WEBGL PARTICLE WORLD (FIXED UNDERLAY CANVAS ENGINE) */}
      <div className="fixed inset-0 w-full h-full pointer-events-none z-0">
        <InteractiveCanvas sectionIndex={activeSection} />
      </div>

      {/* AMBIENT LUXURY RADIAL BLOOMS */}
      <div className="fixed -top-1/4 -left-1/4 w-[70vw] h-[70vh] rounded-full pointer-events-none z-0 filter blur-[90px] ambient-light-blue" />
      <div className="fixed -bottom-1/4 -right-1/4 w-[70vw] h-[70vh] rounded-full pointer-events-none z-0 filter blur-[90px] ambient-light-pink" />

      {/* HEADER: TYPOGRAPHIC MINIMALISM */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-b from-[#030509]/80 to-transparent backdrop-blur-md border-b border-white/[0.03]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Typographic brand mark */}
          <div onClick={() => handleScrollTo("hero")}>
            <HeurekaLogo className="h-8" />
          </div>

          {/* Desktop Modular Navigation Rails */}
          <nav className="hidden md:flex items-center gap-x-8">
            <button 
              onClick={() => handleScrollTo("mission")}
              className={`text-xs font-mono tracking-widest uppercase transition-colors cursor-pointer ${
                activeSection === 1 ? "text-[#fda4af]" : "text-gray-400 hover:text-white"
              }`}
            >
              / Mission
            </button>
            <button 
              onClick={() => handleScrollTo("technology")}
              className={`text-xs font-mono tracking-widest uppercase transition-colors cursor-pointer ${
                activeSection === 2 ? "text-[#fda4af]" : "text-gray-400 hover:text-white"
              }`}
            >
              / Carrier Strategy
            </button>
            <button 
              onClick={() => handleScrollTo("biology")}
              className={`text-xs font-mono tracking-widest uppercase transition-colors cursor-pointer ${
                activeSection === 3 ? "text-[#fda4af]" : "text-gray-400 hover:text-white"
              }`}
            >
              / Biology
            </button>
            <button
              onClick={() => handleScrollTo("team_and_roots")}
              className={`text-xs font-mono tracking-widest uppercase transition-colors cursor-pointer ${
                activeSection === 4 ? "text-[#fda4af]" : "text-gray-400 hover:text-white"
              }`}
            >
              / Team
            </button>
          </nav>

          {/* Inline CTA / Gateways */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleScrollTo("inquire_and_footer")}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/5 hover:bg-[#f43f5e]/15 hover:text-[#fda4af] hover:border-[#f43f5e]/30 border border-white/10 text-xs font-mono tracking-wider uppercase transition-all shadow-[0_2px_12px_rgba(0,0,0,0.4)] cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5 text-[#f43f5e]" />
              Inquiry Portal
            </button>

            {/* Mobile Hamburger toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-400 hover:text-white focus:outline-none transition-colors cursor-pointer"
            >
              <div className="space-y-1.5 w-5">
                <span className={`block h-[1.5px] bg-current transition-transform duration-300 ${isMenuOpen ? "transform rotate-45 translate-y-1.5" : ""}`} />
                <span className={`block h-[1.5px] bg-current transition-opacity duration-300 ${isMenuOpen ? "opacity-0" : ""}`} />
                <span className={`block h-[1.5px] bg-current transition-transform duration-300 ${isMenuOpen ? "transform -rotate-45 -translate-y-1.5" : ""}`} />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE HEADER SLIDEOUT PANELS */}
      <div 
        className={`fixed inset-0 z-30 bg-[#030509]/95 backdrop-blur-2xl transition-all duration-300 transform ${
          isMenuOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col justify-center h-full p-8 space-y-8">
          <button 
            onClick={() => handleScrollTo("mission")}
            className="text-left font-display text-4xl font-semibold tracking-tight text-white hover:text-[#fda4af] transition-colors"
          >
            Our Mission
          </button>
          <button 
            onClick={() => handleScrollTo("technology")}
            className="text-left font-display text-4xl font-semibold tracking-tight text-white hover:text-[#fda4af] transition-colors"
          >
            Carrier Strategy
          </button>
          <button 
            onClick={() => handleScrollTo("biology")}
            className="text-left font-display text-4xl font-semibold tracking-tight text-white hover:text-[#fda4af] transition-colors"
          >
            Biology
          </button>
          <button 
            onClick={() => handleScrollTo("team_and_roots")}
            className="text-left font-display text-4xl font-semibold tracking-tight text-white hover:text-[#fda4af] transition-colors"
          >
            Copenhagen Roots
          </button>
          <button 
            onClick={() => handleScrollTo("inquire_and_footer")}
            className="text-left font-display text-4xl font-semibold tracking-tight text-[#f43f5e] hover:text-white transition-colors"
          >
            Partnership & Briefs
          </button>

          <div className="pt-8 border-t border-white/5 space-y-4">
            <div className="flex items-center gap-2 text-gray-500 font-mono text-xs">
              <MapPin className="w-3.5 h-3.5" />
              Copenhagen, Denmark // CBMR Ecosystem
            </div>
            <p className="text-gray-500 text-xs font-light">
              Developing hepatocyte-selective peptide conjugates to resolve the global liability of obesity-driven liver congestion.
            </p>
          </div>
        </div>
      </div>

      {/* FIXED ANCHORS: PROGRESS GAUGE */}
      
      {/* 1. Left positioning segment counter (01 / 06) */}
      <div className="fixed bottom-10 left-6 z-20 hidden md:flex items-center gap-x-4 mix-blend-difference selection:text-white">
        <span className="font-mono text-xs text-[#fda4af]">
          0{activeSection + 1}
        </span>
        <div className="h-[1px] w-12 bg-white/20 relative">
          <motion.div 
            className="absolute top-0 bottom-0 left-0 bg-[#f43f5e]"
            style={{ width: `${((activeSection + 1) / 6) * 100}%` }}
            layout
          />
        </div>
        <span className="font-mono text-[10px] text-gray-500 uppercase tracking-widest">
          06 Chapters
        </span>
      </div>

      {/* CUSTOM MARQUEE ANIMATION CSS (inject helper class if necessary) */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 16s linear infinite;
        }
      `}</style>

      {/* SECTIONS LAYOUT GRID */}
      <main className="relative z-10 max-w-7xl mx-auto px-6">
        
        {/* ========================================== */}
        {/* SECTION 0: HERO - REVITALIZING THE LIVER   */}
        {/* ========================================== */}
        <section 
          id="hero" 
          className="min-h-screen py-32 flex flex-col justify-center relative overflow-hidden"
        >
          {/* Left-Aligned Structural Panel */}
          <div className="max-w-3xl mt-12">
            
            {/* Giant display typography targeting absolute scientific authority */}
            <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight text-white leading-[1.05] mb-6">
              Revitalizing the <br />
              <span className="bg-gradient-to-r from-white via-[#fda4af] to-[#f43f5e] bg-clip-text text-transparent">
                Liver.
              </span>
            </h1>

            {/* Deep scientific paragraph with partner orientation */}
            <p className="text-base md:text-lg text-gray-300 font-light leading-relaxed mb-10 max-w-2xl">
              Heureka Therapeutics is developing first-in-class, liver-targeted peptide conjugates designed specifically for obesity-driven MASLD/MASH.
              Rationally designed conjugates direct high-potency AMPK activation to hepatocytes—minimizing systemic liability while restoring metabolic function.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                onClick={() => handleScrollTo("technology")}
                className="px-6 py-3.5 rounded-lg bg-gradient-to-r from-[#f43f5e] to-[#fb7185] hover:opacity-90 text-white font-mono text-xs uppercase tracking-widest font-semibold transition-all shadow-[0_4px_24px_rgba(244,63,94,0.3)] hover:shadow-[0_4px_32px_rgba(244,63,94,0.45)] flex items-center justify-center gap-2 cursor-pointer"
              >
                Explore The Strategy
                <ChevronRight className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => handleScrollTo("mission")}
                className="px-6 py-3.5 rounded-lg border border-white/10 hover:border-white/25 bg-white/5 hover:bg-white/10 text-white font-mono text-xs uppercase tracking-widest font-medium transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                Our Scientific Origin
              </button>
            </div>
          </div>

          {/* Organic Floating Scroll hint */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-500 font-mono text-[9px] uppercase tracking-widest animate-bounce mt-12">
            <span>Scroll to Analyze</span>
            <ArrowDown className="w-3 h-3 text-[#f43f5e]" />
          </div>
        </section>

        {/* ========================================== */}
        {/* SECTION 1: MISSION - THE ARCHIMEDEAN SEARCH */}
        {/* ========================================== */}
        <section 
          id="mission" 
          className="min-h-screen py-32 flex flex-col justify-center relative border-t border-white/[0.03]"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content Card */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] tracking-widest text-[#f43f5e] uppercase">
                  // THE NARRATIVE
                </span>
                <span className="h-[1px] w-8 bg-gray-700" />
                <span className="font-mono text-[10px] text-gray-500 font-light">CHAPTER 02</span>
              </div>

              <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-white">
                Heureka!<br />
                <span className="font-sans italic font-light text-2xl text-gray-400">/heúrēka/ — &ldquo;I have found it.&rdquo;</span>
              </h2>

              <p className="text-base text-gray-300 font-light leading-relaxed">
                For over three decades, activating AMPK (AMP-activated protein kinase) has been hailed as the holy grail of metabolic therapies. It is the body&apos;s ultimate cellular energy sensor, capable of wiping out lipid congestion in hepatocytes. Yet, systemic efforts stalled—plagued by off-target toxicity.
              </p>

              <blockquote className="border-l-2 border-[#f43f5e] pl-4 text-xs md:text-sm font-sans italic text-[#fda4af] font-light leading-relaxed my-6 bg-[#f43f5e]/5 py-3 pr-2 rounded-r-lg">
                &ldquo;By linking AMPK-activating payloads with a tissue-targeted guide molecule, the AMPK-drug remains inert in circulation but triggers localized fat clearance in the liver.&rdquo;
              </blockquote>
            </div>

            {/* Right floating telemetry modular card */}
            <div className="lg:col-span-5">
              <div className="glass-panel rounded-2xl p-6 border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.5)] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#f43f5e]/10 rounded-full filter blur-[30px] pointer-events-none" />

                <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
                  <div className="font-mono text-[9px] uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
                    CLINICAL BURDEN PROFILE
                  </div>
                  <span className="font-mono text-[9px] text-[#fda4af]">MASLD / MASH</span>
                </div>

                <div className="space-y-6">
                  <div>
                    <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block mb-1">
                      Global MASLD Adult Prevalence
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-display font-medium text-white tracking-tight">
                        ~30%
                      </span>
                      <span className="text-xs text-rose-400 font-mono font-medium">[Global Liver Pandemic]</span>
                    </div>
                    <div className="w-full bg-white/5 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div className="bg-gradient-to-r from-blue-500 to-[#f43f5e] h-full rounded-full w-[30%]" />
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block mb-1">
                      MASLD to MASH Progression Rate
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-display font-medium text-white tracking-tight">
                        ~20%
                      </span>
                      <span className="text-xs text-[#fda4af] font-mono font-medium">[Inflammation & Fibrosis]</span>
                    </div>
                    <div className="w-full bg-white/5 h-1.5 rounded-full mt-2">
                      <div className="bg-rose-500 h-full rounded-full w-[20%]" />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/5 space-y-3">
                    <p className="text-[10.5px] font-normal text-gray-400 leading-relaxed font-sans">
                      MASLD represents a massive metabolic healthcare crisis, with progressive inflammation (MASH) driving elevated risk of cirrhosis, end-stage liver failure, and hepatocellular carcinoma.
                    </p>
                    <div className="flex items-center justify-between text-gray-500 text-[9px] font-mono pt-1">
                      <a 
                        href="https://www.nature.com/articles/s41598-025-91312-5" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-blue-400 hover:text-blue-300 hover:underline flex items-center gap-1 transition-colors font-semibold"
                        id="disease-burden-citation-link"
                      >
                        Scientific Reports (2025) ↗
                      </a>
                      <span>DISEASE EPIDEMIOLOGY</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ========================================== */}
        {/* SECTION 2: TECHNOLOGY - THE TROJAN HORSE */}
        {/* ========================================== */}
        <section 
          id="technology" 
          className="min-h-screen py-32 flex flex-col justify-center relative border-t border-white/[0.03]"
        >
          <div className="space-y-12">
            <div className="max-w-3xl space-y-4">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] tracking-widest text-[#f43f5e] uppercase">
                  // THE MECHANISTIC ENGINE
                </span>
                <span className="h-[1px] w-8 bg-gray-700" />
                <span className="font-mono text-[10px] text-gray-500 font-light">CHAPTER 03</span>
              </div>
              
              <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-white">
                Conjugate Chemistry & Selective GPCR Targeting.
              </h2>
              <p className="text-base text-gray-300 font-light leading-relaxed">
                Rather than treating the liver by bathing the entire human body in potent AMPK activators, our conjugates direct their small-molecule payload to receptors on the hepatocyte surface, delivering synergistic intracellular lipid clearance.
              </p>
            </div>

            {/* Embedded Clickable Molecular Mechanism Schematic Map */}
            <TrojanHorseSchematic />
          </div>
        </section>

        {/* ========================================== */}
        {/* SECTION 3: BIOLOGY - AMPK RESET PARADIGM   */}
        {/* ========================================== */}
        <section 
          id="biology" 
          className="min-h-screen py-32 flex flex-col justify-center relative border-t border-white/[0.03]"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Column 1: Image representation and interactive list items */}
            <div className="lg:col-span-5 order-2 lg:order-1">
              <div className="glass-panel rounded-2xl p-6 border border-white/10 bg-[#07090f]/60 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-rose-500 to-emerald-500 animate-pulse" />

                <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-gray-400 flex items-center gap-1">
                    <Compass className="w-3.5 h-3.5 text-[#0ea5e9]" />
                    Therapeutic Pathway
                  </span>
                  <span className="font-mono text-[9px] text-[#fda4af]">MASLD/MASH COMPASS</span>
                </div>

                <div className="space-y-4">
                  <div className="p-3.5 rounded-lg border border-white/5 bg-[#030509]/80 flex gap-3.5">
                    <span className="text-xs font-mono text-[#fda4af] font-semibold">A</span>
                    <div>
                      <h4 className="font-display text-xs font-medium text-white">HEPATOCYTE-RESTRICTED DELIVERY</h4>
                      <p className="text-[11px] text-gray-400 mt-1 font-light leading-relaxed">
                        Our peptide carrier binds a target GPCR highly expressed on hepatocytes, using receptor-mediated endocytosis to keep AMPK activation out of systemic circulation.
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-lg border border-white/5 bg-[#030509]/80 flex gap-3.5">
                    <span className="text-xs font-mono text-cyan-400 font-semibold">B</span>
                    <div>
                      <h4 className="font-display text-xs font-medium text-white">SELF-BALANCING DUAL ACTION</h4>
                      <p className="text-[11px] text-gray-400 mt-1 font-light leading-relaxed">
                        Inside the hepatocyte, the released AMPK activator phosphorylates ACC to reduce lipogenesis, complementing the carrier peptide's own favorable glycaemic profile.
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-lg border border-white/5 bg-[#030509]/80 flex gap-3.5">
                    <span className="text-xs font-mono text-emerald-400 font-semibold">C</span>
                    <div>
                      <h4 className="font-display text-xs font-medium text-white">VALIDATED IN TRANSLATIONAL MASH MODELS</h4>
                      <p className="text-[11px] text-gray-400 mt-1 font-light leading-relaxed">
                        In the GAN-DIO mouse model ranked #1 by the LITMUS consortium, our unoptimized lead conjugate matched the MASH benefit of semaglutide and survodutide.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Column 2: Text explaining specific AMPK biology */}
            <div className="lg:col-span-7 order-1 lg:order-2 space-y-6">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] tracking-widest text-[#f43f5e] uppercase">
                  // BIOLOGICAL SPECIFICITY
                </span>
                <span className="h-[1px] w-8 bg-gray-700" />
                <span className="font-mono text-[10px] text-gray-500 font-light">CHAPTER 04</span>
              </div>

              <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-white">
                Restoring Liver Function and Metabolite Homeostasis.
              </h2>

              <p className="text-base text-gray-300 font-light leading-relaxed">
                In obesity-driven MASLD/MASH, hepatocytes accumulate triglycerides faster than they can clear them. The resulting lipotoxic stress activates hepatic stellate cells, driving the chronic inflammation and fibrosis that can progress to cirrhosis.
              </p>

              <p className="text-sm text-gray-400 font-light leading-relaxed">
                Our approach turns a G protein-coupled receptor (GPCR) that is highly expressed on hepatocytes into a delivery address for the liver. A peptide ligand for this receptor is conjugated to a potent AMPK activator; once the receptor binds and internalises the conjugate, the activator is concentrated inside hepatocytes rather than throughout the body. By pairing a hepatocyte-directed GPCR ligand with an intracellular metabolic effector, we aim to restore the liver's metabolic balance at the site of disease. Our lead conjugate is currently being refined in a dedicated medicinal-chemistry programme.
              </p>

              <div className="pt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs font-mono text-gray-500">
                <span>✓ GPCR-Restricted AMPK Activation</span>
                <span>✓ Synergistic, Self-Balancing Mechanism</span>
                <span>✓ Composition-of-Matter IP Filed</span>
              </div>
            </div>

          </div>
        </section>

        {/* ========================================== */}
        {/* SECTION 4: COPENHAGEN ADVISORY / TEAM     */}
        {/* ========================================== */}
        <section 
          id="team_and_roots" 
          className="min-h-screen py-32 flex flex-col justify-center relative border-t border-white/[0.03]"
        >
          <div className="space-y-16">
            
            {/* Top Academic Heritage Block */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-gradient-to-r from-blue-950/15 via-[#f43f5e]/5 to-transparent p-6 md:p-8 rounded-2xl border border-white/5 backdrop-blur-sm">
              <div className="lg:col-span-4 flex flex-col items-center lg:items-start text-center lg:text-left">
                <div className="p-3.5 rounded-full bg-white/5 border border-white/10 mb-4 inline-block">
                  <DeltaIcon className="w-10 h-10 text-white" />
                </div>
                <h3 className="font-display text-xl font-semibold text-white tracking-tight">University of Copenhagen</h3>
                <p className="text-xs text-gray-400 font-mono tracking-wide mt-1 uppercase text-[#fda4af]">Novo Nordisk Foundation Center for Basic Metabolic Research</p>
              </div>

              <div className="lg:col-span-8 space-y-4 text-xs md:text-sm font-light text-gray-300 leading-relaxed">
                <span className="font-mono text-[9px] uppercase tracking-widest text-gray-500 block">
                  // THE BENCH TO BEDSIDE ANCHOR
                </span>
                <p>
                  Heureka Therapeutics is academically founded in rigorous research at the Novo Nordisk Foundation Center for Basic Metabolic Research (CBMR). Our team brings decades of experience within metabolic research and drug development.
                </p>
                <p className="text-xs text-gray-400 font-light">
                  Heureka's conjugates grew out of rigorous academic assay validation, quantitative biological chemistry, and peer-reviewed metabolic research.
                </p>
              </div>
            </div>

            {/* Modular Team Profile Component */}
            <TeamGrid />

          </div>
        </section>

        {/* ========================================== */}
        {/* SECTION 5: INQUIRE / INQUIRY PORTAL        */}
        {/* ========================================== */}
        <section 
          id="inquire_and_footer" 
          className="min-h-screen py-32 flex flex-col justify-between relative border-t border-white/[0.03]"
        >
          {/* Main Action Form and description */}
          <div className="max-w-4xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center my-auto">
            
            {/* Left pitch and partner details */}
            <div className="lg:col-span-6 space-y-6">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] tracking-widest text-[#f43f5e] uppercase">
                  // PRECLINICAL DIALOGUE
                </span>
                <span className="h-[1px] w-8 bg-gray-700" />
                <span className="font-mono text-[10px] text-gray-500 font-light">CHAPTER 06 // INQUIRIES</span>
              </div>

              <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-white">
                Are you curious?
              </h2>

              <p className="text-sm md:text-base text-gray-300 font-light leading-relaxed">
                Learn more about us and our approach to combating a burgeoning epidemic. We invite inquiries from specialized biotech venture portfolios, pharmaceutical metabolic leads, and academic specialists.
              </p>

              <div className="space-y-4 font-mono text-[11px] text-gray-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#fda4af]" />
                  <span>Copenhagen Academic Liaison Established</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span>curious@heureka.bio // Direct Inquiry Routing</span>
                </div>
              </div>
            </div>

            {/* Right Interactive Custom Inquiry Portal Form Card */}
            <div className="lg:col-span-6">
              <div className="glass-panel-heavy rounded-2xl p-6 md:p-8 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-[#f43f5e]" />

                <div className="flex justify-between items-center mb-6">
                  <span className="text-[10px] font-mono tracking-widest text-gray-400 uppercase flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-[#f43f5e]" />
                    Heureka Tx Inquiry Portal
                  </span>
                  <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-widest">
                    ACTIVE
                  </span>
                </div>

                {portalStatus === "idle" && (
                  <form onSubmit={handlePortalSubmit} className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-wider text-gray-400 mb-1.5">
                        Inquiry Topic
                      </label>
                      <input 
                        type="text" 
                        required
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="e.g., Preclinical Data request, Collaboration opportunity"
                        className="w-full bg-[#030509] border border-white/10 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#f43f5e]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-wider text-gray-400 mb-1.5">
                        Contact Email
                      </label>
                      <input 
                        type="email" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="academic@institution.org"
                        className="w-full bg-[#030509] border border-white/10 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#f43f5e]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-wider text-gray-400 mb-1.5">
                        Description of Inquiry
                      </label>
                      <textarea 
                        required
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Detail how we can collaborate, share data, or partner..."
                        className="w-full bg-[#030509] border border-white/10 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#f43f5e] resize-none"
                      />
                    </div>

                    <p className="text-[10px] text-gray-500 font-light leading-relaxed">
                      By submitting, your inquiry will be prepared and formatted. A final click will open your local email client to dispatch the message directly to our team.
                    </p>

                    <button
                      type="submit"
                      className="w-full py-3 rounded-lg bg-[#f43f5e] hover:bg-[#fda4af] text-white hover:text-black font-mono text-xs uppercase tracking-widest font-semibold transition-all shadow-[0_2px_12px_rgba(244,63,94,0.2)] cursor-pointer"
                    >
                      Process & Format Inquiry
                    </button>
                  </form>
                )}

                {/* Inquiry processing loaders */}
                {(portalStatus === "validating" || portalStatus === "encrypting") && (
                  <div className="space-y-6 py-6 font-mono text-xs">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-8 h-8 rounded-full border-2 border-[#f43f5e] border-t-transparent animate-spin" />
                      <span className="text-[#fda4af] uppercase tracking-widest text-[10px] font-bold">
                        {portalStatus === "validating" ? "Configuring Gateway Route..." : "Routing Payload to Outbound..."}
                      </span>
                    </div>

                    <div className="bg-black/40 rounded-lg p-3.5 border border-white/5 space-y-1.5 max-h-48 overflow-y-auto">
                      {portalLog.map((log, index) => (
                        <div key={index} className="text-[10px] text-emerald-400 leading-relaxed flex items-start gap-1">
                          <span className="text-[#f43f5e]">&gt;</span>
                          <span>{log}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Process Success result page layout */}
                {portalStatus === "success" && (
                  <div className="space-y-6 py-4 text-center font-sans">
                    <div className="flex justify-center">
                      <div className="p-3.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                        <CheckCircle2 className="w-8 h-8" />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-display text-base font-semibold text-white">Inquiry Formatted Successfully</h4>
                      <p className="text-xs text-gray-400 font-light max-w-xs mx-auto leading-relaxed">
                        Your inquiry has been formulated. If your mail client did not launch automatically, click the button below to dispatch the message to <span className="text-[#fda4af] font-mono font-bold">curious@heureka.bio</span>.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <a
                        href={`mailto:curious@heureka.bio?subject=${encodeURIComponent(
                          `Heureka Inquiry: ${topic}`
                        )}&body=${encodeURIComponent(
                          `Hello Heureka Team,\n\nI would like to inquire about: ${topic}\n\nDescription:\n${description}\n\nKind regards,\n${email}`
                        )}`}
                        className="inline-flex items-center justify-center w-full py-3 px-4 rounded-lg bg-gradient-to-r from-[#f43f5e] to-[#fb7185] hover:opacity-95 text-white font-mono text-xs uppercase tracking-widest font-semibold transition-all shadow-[0_2px_12px_rgba(244,63,94,0.3)] cursor-pointer"
                      >
                        <Mail className="w-4 h-4 mr-2" />
                        Send via Mail Client
                      </a>
                    </div>

                    <div className="bg-black/30 rounded-lg p-3.5 border border-white/5 text-left font-mono text-[9px] text-[#fda4af] space-y-1">
                      <p>STATUS: DIRECT ROUTING READY</p>
                      <p>TARGET ADDRESS: curious@heureka.bio</p>
                      <p>SENDER PROTOCOL: {email}</p>
                    </div>

                    <button
                      onClick={() => {
                        setPortalStatus("idle");
                        setEmail("");
                        setTopic("");
                        setDescription("");
                      }}
                      className="text-xs font-mono tracking-wider uppercase text-gray-400 hover:text-white underline cursor-pointer"
                    >
                      Write Another Inquiry
                    </button>
                  </div>
                )}

              </div>
            </div>

          </div>

          {/* MINIMAL FOOTER SIGN OFF */}
          <footer className="pt-24 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 pb-2">
            
            {/* Logo and Copenhagen descriptor text */}
            <div className="flex items-center gap-3">
              <DeltaIcon className="w-7 h-7 text-gray-500" />
              <div className="text-left font-sans">
                <p className="text-xs font-medium text-white tracking-tight">Heureka Therapeutics</p>
                <p className="text-[10px] text-gray-500 font-light font-mono">COPENHAGEN, DENMARK // © {new Date().getFullYear()}</p>
              </div>
            </div>

            {/* Middle academic declaration */}
            <p className="text-[10px] text-gray-500 font-light tracking-wide text-center max-w-xl leading-relaxed">
              Heureka Therapeutics ApS is a University of Copenhagen spin-out from the Novo Nordisk Foundation Center for Basic Metabolic Research. We are a biotechnology company developing liver-targeted therapeutics for metabolic disease.
            </p>

            {/* Right email linkages */}
            <div className="flex gap-4 items-center">
              <a 
                href="mailto:curious@heureka.bio" 
                className="text-[11px] font-mono text-gray-400 hover:text-[#fda4af] flex items-center gap-1 border-b border-dashed border-gray-600 pb-0.5"
              >
                curious@heureka.bio
              </a>
            </div>

          </footer>
        </section>

      </main>

    </div>
  );
}
