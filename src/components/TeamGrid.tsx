import React, { useState } from "react";
import { Linkedin, Mail, Award, BookOpen, GraduationCap, ArrowUpRight } from "lucide-react";

interface TeamMember {
  name: string;
  role: string;
  title: string;
  domain: string;
  academicAnchor: string;
  publications: string[];
  bio: string;
  iconSeed: string; // custom color palette seed
  linkedin: string;
}

const OPERATIONAL_TEAM: TeamMember[] = [
  {
    name: "Maja Engelstoft, PhD",
    role: "Chief Executive Officer",
    title: "Translational Biotech Executive & Former CBMR Researcher",
    domain: "CORPORATE DEVELOPMENT & TRANSLATIONAL MEDICINE",
    academicAnchor: "PhD, University of Copenhagen (Copenhagen Bioscience PhD Programme)",
    publications: [
      "WO2020197926A1, 'GPCR Combination Therapies' (Kallyope) — co-inventor.",
      "Prior R&D tenure at Kallyope, Inc. (NYC), on gut-brain axis GPCR drug discovery."
    ],
    bio: "Dr. Engelstoft trained as a metabolic physiologist at the University of Copenhagen before moving into industry drug discovery, most recently as a Drug Discovery Scientist at Kallyope. She directs Heureka's operational alignment, partnerships, and clinical timeline strategy.",
    iconSeed: "blue",
    linkedin: "https://www.linkedin.com/in/maja-engelstoft-7808b610",
  },
  {
    name: "Jonas Odgaard Petersen",
    role: "Chief Scientific Officer",
    title: "Co-Founder, Ousia Pharma & Assistant Professor, University of Copenhagen",
    domain: "PEPTIDE SYNTHESIS & MOLECULAR MODELING",
    academicAnchor: "Clemmensen Group, Novo Nordisk Foundation Center for Basic Metabolic Research",
    publications: [
      "Petersen JO, et al. 'GLP-1-directed NMDA receptor antagonism for obesity treatment.' Nature, 2024.",
      "Petersen J, Finan B, Johansen VBI, Müller TD, Clemmensen C. 'The evolving landscape of obesity pharmacotherapy.' Nature Reviews Drug Discovery, 2026."
    ],
    bio: "Jonas co-founded Ousia Pharma alongside Christoffer Clemmensen and is an Assistant Professor in the Clemmensen Group at CBMR, where his work spans GLP-1 receptor pharmacology and peptide bioconjugate design. At Heureka he leads synthesis and molecular engineering of the hepatocyte-targeting platform.",
    iconSeed: "indigo",
    linkedin: "https://www.linkedin.com/in/jonas-odgaard-petersen-09139a95",
  },
  {
    name: "Christoffer Merrild",
    role: "Co-founder & Chief Operating Officer",
    title: "PhD Fellow, Novo Nordisk Foundation Center for Basic Metabolic Research",
    domain: "MOLECULAR BIOLOGY & IN VIVO PHARMACOLOGY",
    academicAnchor: "Clemmensen Group, University of Copenhagen",
    publications: [
      "Petersen J, Merrild C, Lund J, Holm S, Clemmensen C. 'Lead-in calorie restriction enhances the weight-lowering efficacy of incretin hormone-based pharmacotherapies in mice.' Molecular Metabolism, 2024.",
      "Merrild C, et al. 'Sustained weight loss with combined LEAP2 and semaglutide treatment in mice.' 2025."
    ],
    bio: "Christoffer is a PhD fellow in the Clemmensen Group at CBMR, where his in vivo research spans glucagon-receptor signaling, incretin-based combination pharmacotherapy, and rodent models of diet-induced obesity. At Heureka, he applies this molecular and in vivo expertise to lead conjugate validation, alongside coordinating the venture's operational infrastructure and financing.",
    iconSeed: "teal",
    linkedin: "https://www.linkedin.com/in/christoffer-merrild",
  },
  {
    name: "Joyceline Cuenco, PhD",
    role: "Scientist",
    title: "Postdoctoral Researcher, Novo Nordisk Foundation Center for Basic Metabolic Research",
    domain: "AMPK PHARMACOLOGY & HEPATIC MECHANISM OF ACTION",
    academicAnchor: "Sakamoto Group, Novo Nordisk Foundation Center for Basic Metabolic Research",
    publications: [
      "Longo M, Bishnu A, Risiglione P, Montava-Garriga L, Cuenco J, Sakamoto K, MacKintosh C, Ganley IG. 'Opposing roles for AMPK in regulating distinct mitophagy pathways.' Molecular Cell, 2024.",
      "Fraguas Bringas C, Ahangar MS, Cuenco J, Liu H, et al. 'Mechanism and cellular actions of the potent AMPK inhibitor BAY-3827.' Science Advances, 2025."
    ],
    bio: "Joyceline completed her PhD at Imperial College London, developing gut-hormone-based obesity therapeutics in Prof. Steve Bloom's lab, followed by a postdoctoral fellowship in immunometabolism at the Immediab Lab in Paris. She joined the Sakamoto Group at CBMR in 2022, where her research investigates novel AMPK activators in the liver and their mechanisms of action. At Heureka, she leads bench-level validation of the carrier-AMPK conjugate platform.",
    iconSeed: "amber",
    linkedin: "https://www.linkedin.com/in/joycuenco/",
  }
];

const ADVISOR_TEAM: TeamMember[] = [
  {
    name: "Prof. Kei Sakamoto",
    role: "Co-founder & Scientific Advisor",
    title: "Professor & Group Leader, CBMR, University of Copenhagen",
    domain: "AMPK REGULATION & BIOENERGETICS",
    academicAnchor: "Novo Nordisk Foundation Center for Basic Metabolic Research · 25,500+ citations, h-index 79",
    publications: [
      "Foretz M, Hébrard S, Leclerc J, Sakamoto K, et al. 'Metformin inhibits hepatic gluconeogenesis in mice independently of the LKB1/AMPK pathway.' J Clin Invest, 2010.",
      "Hawley SA, ... Sakamoto K, et al. 'The ancient drug salicylate directly activates AMP-activated protein kinase.' Science, 2012."
    ],
    bio: "Prof. Sakamoto is a world-renowned authority on AMPK signaling and energy metabolism. Formerly Programme Leader at the MRC Protein Phosphorylation Unit (Dundee) and Head of Metabolic Health at the Nestlé Institute of Health Sciences, he now leads the Sakamoto Group at CBMR and guides Heureka's biological target validation.",
    iconSeed: "cyan",
    linkedin: "https://www.linkedin.com/in/kei-sakamoto-95672088",
  },
  {
    name: "Assoc. Prof. Christoffer Clemmensen",
    role: "Co-founder & Scientific Advisor",
    title: "Associate Professor & Group Leader, CBMR, University of Copenhagen",
    domain: "METABOLIC PHARMACOLOGY & OBESITY",
    academicAnchor: "Clemmensen Group, Novo Nordisk Foundation Center for Basic Metabolic Research · 11,300+ citations, h-index 48",
    publications: [
      "Finan B, Clemmensen C, et al. 'Chemical hybridization of glucagon and thyroid hormone optimizes therapeutic impact for metabolic disease.' Cell, 2016.",
      "Clemmensen C, et al. 'Animal models of obesity and diabetes mellitus.' Nature Reviews Endocrinology, 2018."
    ],
    bio: "Dr. Clemmensen leads the Clemmensen Group at CBMR, studying the biological regulation of body weight and developing new therapeutic strategies for obesity and its metabolic comorbidities. He also co-founded Ousia Pharma (seed-financed by Omega Funds) and advises Heureka on metabolic pharmacology.",
    iconSeed: "rose",
    linkedin: "https://www.linkedin.com/in/christoffer-clemmensen-14b6a920",
  },
  {
    name: "Prof. Nicolai J. Wewer Albrechtsen",
    role: "Scientific Advisor",
    title: "Professor, Dept. of Clinical Biochemistry, Copenhagen University Hospital – Bispebjerg",
    domain: "METABOLIC PROTEOMICS & GLUCAGON BIOLOGY",
    academicAnchor: "University of Copenhagen · 10,000+ citations, h-index 57",
    publications: [
      "Janah L, Kjeldsen S, Galsgaard KD, et al., Wewer Albrechtsen NJ. 'Glucagon receptor signaling and glucagon resistance.' International Journal of Molecular Sciences, 2019.",
      "Niu L, ... Wewer Albrechtsen NJ, et al. 'Plasma proteome profiling discovers novel proteins associated with non-alcoholic fatty liver disease.' Molecular Systems Biology, 2019."
    ],
    bio: "Prof. Wewer Albrechtsen is a clinical biochemist whose lab applies proteomics to metabolic and liver disease, with a particular focus on glucagon biology and plasma biomarker discovery in NAFLD/MASLD. His work informs Heureka's translational biomarker strategy.",
    iconSeed: "violet",
    linkedin: "https://www.linkedin.com/in/nicolai-jacob-wewer-albrechtsen-25bb1717",
  }
];

export const TeamGrid: React.FC = () => {
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  const renderGrid = (members: TeamMember[], sectionKey: string) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {members.map((member, idx) => {
        const cardKey = `${sectionKey}-${idx}`;

        return (
          <div
            key={cardKey}
            onMouseEnter={() => setHoveredKey(cardKey)}
            onMouseLeave={() => setHoveredKey(null)}
            onClick={() => setSelectedMember(member)}
            className="group relative rounded-xl border border-white/5 bg-[#07090f]/50 p-5 backdrop-blur-md transition-all duration-300 hover:border-white/10 hover:bg-[#0a0d16]/80 flex flex-col justify-between min-h-[280px] cursor-pointer"
          >
            {/* Geometric dynamic background highlight based on seed */}
            <div
              className={`absolute inset-0 rounded-xl opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none ${
                member.iconSeed === "cyan"
                  ? "bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.04),transparent_55%)]"
                  : member.iconSeed === "rose"
                  ? "bg-[radial-gradient(circle_at_top_right,rgba(244,63,94,0.04),transparent_55%)]"
                  : member.iconSeed === "blue"
                  ? "bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.04),transparent_55%)]"
                  : "bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.04),transparent_55%)]"
              }`}
            />

            <div>
              {/* Meta details header line */}
              <div className="flex justify-between items-center mb-4">
                <span className="font-mono text-[8px] tracking-widest text-gray-500 group-hover:text-gray-300 transition-colors uppercase">
                  {member.domain}
                </span>
                <div className="flex items-center gap-2">
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-gray-500 hover:text-[#0a66c2] transition-colors"
                    aria-label={`${member.name} on LinkedIn`}
                  >
                    <Linkedin className="w-3.5 h-3.5" />
                  </a>
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>
              </div>

              {/* Name & Academic Rank */}
              <h4 className="font-display text-lg font-medium tracking-tight text-white group-hover:text-[#fda4af] transition-colors">
                {member.name}
              </h4>
              <p className="font-mono text-[9px] uppercase tracking-wider text-[#fda4af] font-medium mt-0.5">
                {member.role}
              </p>

              {/* Subtitle & Affiliation */}
              <p className="text-xs text-gray-400 font-light mt-3 leading-relaxed">
                {member.title}
              </p>
              <p className="text-[10px] text-gray-500 font-sans mt-1.5 flex items-center gap-1">
                <GraduationCap className="w-3 h-3 text-gray-400 shrink-0" />
                <span className="line-clamp-1">{member.academicAnchor}</span>
              </p>
            </div>

            {/* Lower segment Action Trigger */}
            <div className="mt-6 pt-4 border-t border-white/[0.03] flex items-center justify-between text-gray-400 group-hover:text-white transition-colors">
              <span className="text-[10px] font-mono tracking-widest uppercase flex items-center gap-1">
                <BookOpen className="w-3 h-3 text-gray-400" />
                Scientific Brief
              </span>
              <ArrowUpRight className="w-3.5 h-3.5 transform transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-gray-500 group-hover:text-[#fda4af]" />
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="w-full">
      {/* Visual Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[9px] tracking-widest text-[#f43f5e] uppercase">
              // LEADERSHIP & SCIENTIFIC FOUNDERS
            </span>
            <span className="h-[1px] w-8 bg-gray-700" />
            <span className="font-mono text-[9px] text-gray-500 font-light">CHAPTER 05</span>
          </div>
          <h3 className="font-display text-2xl md:text-3xl font-semibold tracking-tight text-white mt-1">
            Team
          </h3>
        </div>
        <p className="text-xs text-gray-400 font-light max-w-md leading-relaxed md:text-right">
          Rooted in the metabolic research ecosystem of the University of Copenhagen (UCPH) and the Novo Nordisk Foundation Center.
        </p>
      </div>

      {/* Operational Team */}
      <div className="mb-4">
        <span className="font-mono text-[9px] tracking-widest text-gray-500 uppercase">
          Operational Team
        </span>
      </div>
      {renderGrid(OPERATIONAL_TEAM, "ops")}

      {/* Scientific Advisory Board */}
      <div className="mt-12 mb-4">
        <span className="font-mono text-[9px] tracking-widest text-gray-500 uppercase">
          Scientific Advisory Board
        </span>
      </div>
      {renderGrid(ADVISOR_TEAM, "advisor")}

      {/* POPUP DRAWER MODAL DETAILING RESEARCH CREDENTIALS */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-lg">
          <div
            className="w-full max-w-xl bg-[#07090f] border border-white/10 rounded-2xl p-6 md:p-8 relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Ambient Spotlight */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#f43f5e]/10 rounded-full filter blur-[50px] pointer-events-none" />

            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="font-mono text-[9px] tracking-widest text-[#f43f5e] uppercase">
                  {selectedMember.domain}
                </span>
                <h4 className="font-display text-2xl font-semibold tracking-tight text-white mt-1">
                  {selectedMember.name}
                </h4>
                <p className="font-mono text-xs text-[#fda4af] mt-0.5">
                  {selectedMember.role}
                </p>
              </div>
              <button
                onClick={() => setSelectedMember(null)}
                className="p-1 px-2 text-xs font-mono tracking-wider uppercase text-gray-500 hover:text-white rounded border border-white/5 hover:bg-white/5 cursor-pointer"
              >
                esc ✕
              </button>
            </div>

            <div className="space-y-5 text-sm font-light text-gray-300 leading-relaxed">
              <div>
                <span className="font-mono text-[9px] uppercase tracking-wider text-gray-500 block mb-1">
                  Academic / Corporate Position
                </span>
                <p className="text-white text-xs md:text-sm font-medium">
                  {selectedMember.title}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {selectedMember.academicAnchor}
                </p>
              </div>

              <div>
                <span className="font-mono text-[9px] uppercase tracking-wider text-gray-500 block mb-1">
                  Biomedical Core Thesis
                </span>
                <p className="text-gray-300 text-xs">
                  {selectedMember.bio}
                </p>
              </div>

              <div>
                <span className="font-mono text-[9px] uppercase tracking-wider text-gray-500 block mb-2 flex items-center gap-1">
                  <Award className="w-3 h-3 text-[#f43f5e]" />
                  Selected Publications & Intellectual Contributions
                </span>
                <ul className="space-y-1.5">
                  {selectedMember.publications.map((pub, i) => (
                    <li key={i} className="text-xs font-mono text-gray-400 border-l border-[#f43f5e]/30 pl-3 leading-relaxed">
                      {pub}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 mt-8 pt-5 border-t border-white/5">
              <span className="text-[10px] font-mono text-gray-500">
                COPENHAGEN, DENMARK // TRANSLATIONAL BIOTECH
              </span>
              <div className="flex gap-2">
                <a
                  href={selectedMember.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-gray-400 hover:text-[#0a66c2] border border-white/5 transition-all text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Linkedin className="w-3.5 h-3.5" />
                  LinkedIn
                </a>
                <a
                  href={`mailto:inquiry@heureka.bio?subject=Scientific%20Inquiry%20-%20${selectedMember.name}`}
                  className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/5 transition-all text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5" />
                  Contact Advisee
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
