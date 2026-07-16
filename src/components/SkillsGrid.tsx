import React, { useState, useRef } from "react";
import { LayoutGrid, Cpu, Database, Network, Code, Layers } from "lucide-react";

interface SkillItem {
  id: string;
  category: string;
  icon: React.ReactNode;
  description: string;
  technologies: string[];
  gradient: string;
  stats: string;
}

const SKILL_ITEMS: SkillItem[] = [
  {
    id: "frontend",
    category: "3D Frontend Architect",
    icon: <LayoutGrid className="w-6 h-6 text-emerald-400" />,
    description: "Creating highly interactive user interfaces that feature deep CSS 3D perspectives, custom canvas animations, and fluid state machines.",
    technologies: ["React 19", "TypeScript", "Tailwind v4", "Framer Motion", "Canvas 2D/WebGL"],
    gradient: "from-emerald-500/10 via-emerald-500/2 to-transparent",
    stats: "LPT: 0.12s (Speed)"
  },
  {
    id: "backend",
    category: "Distributed Backend Nodes",
    icon: <Database className="w-6 h-6 text-cyan-400" />,
    description: "Engineering robust full-stack services, Express routing architectures, and high-performance WebSockets bridges optimized for scaling.",
    technologies: ["Node.js", "Express 4", "esbuild", "WebSockets", "Docker / Cloud Run"],
    gradient: "from-cyan-500/10 via-cyan-500/2 to-transparent",
    stats: "Uptime: 100%"
  },
  {
    id: "ai",
    category: "AI Pipeline Integration",
    icon: <Cpu className="w-6 h-6 text-purple-400" />,
    description: "Implementing state-of-the-art LLM pipelines. Crafting secure, server-side Gemini prompt engines, document parsers, and embeddings structures.",
    technologies: ["@google/genai SDK", "Semantic Search", "Prompt Engineering", "JSON schemas"],
    gradient: "from-purple-500/10 via-purple-500/2 to-transparent",
    stats: "Inference: 0.45s"
  },
  {
    id: "creative",
    category: "Creative Mathematics",
    icon: <Network className="w-6 h-6 text-amber-400" />,
    description: "Designing physics engines, procedural particles, starfields, double-helix projections, and audio frequencies visualizers using pure vector math.",
    technologies: ["Trigonometry", "Vector Physics", "Procedural Generation", "AudioNodes"],
    gradient: "from-amber-500/10 via-amber-500/2 to-transparent",
    stats: "FPS: 60 (Locked)"
  }
];

function TiltCard({ skill }: { skill: SkillItem; key?: string }) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    
    // Normalized cursor coordinates (-0.5 to 0.5)
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    // Apply multiplier for maximum pitch and yaw
    setTilt({
      x: -y * 18, // Pitch
      y: x * 18,  // Yaw
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative rounded-2xl border border-white/10 bg-slate-950/60 backdrop-blur-xl p-6 overflow-hidden transition-all duration-300 ease-out flex flex-col justify-between h-[250px] group shadow-lg"
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(${isHovered ? "20px" : "0px"})`,
        transformStyle: "preserve-3d",
      }}
    >
      {/* Dynamic Back-Gradient Flare */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${skill.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none -z-10`}
      />

      {/* Floating Gloss Reflection */}
      <div
        className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.01] to-white/[0.04] pointer-events-none"
        style={{ transform: "translateZ(10px)" }}
      />

      <div style={{ transform: "translateZ(30px)" }}>
        {/* Header Icon + Label */}
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
            {skill.icon}
          </div>
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
            {skill.stats}
          </span>
        </div>

        {/* Category Description */}
        <h3 className="text-md font-display font-semibold text-white group-hover:text-emerald-400 transition-colors">
          {skill.category}
        </h3>
        <p className="text-xs text-slate-400 line-clamp-3 mt-2 leading-relaxed">
          {skill.description}
        </p>
      </div>

      {/* Tech Chips */}
      <div 
        className="flex flex-wrap gap-1 mt-4" 
        style={{ transform: "translateZ(20px)" }}
      >
        {skill.technologies.slice(0, 3).map((tech) => (
          <span
            key={tech}
            className="text-[9px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/5 text-slate-400"
          >
            {tech}
          </span>
        ))}
        {skill.technologies.length > 3 && (
          <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-950/20 text-emerald-400 border border-emerald-500/10">
            +{skill.technologies.length - 3} more
          </span>
        )}
      </div>
    </div>
  );
}

export default function SkillsGrid() {
  return (
    <div id="skills-grid-panel" className="w-full max-w-5xl mx-auto py-12 px-4 select-none">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-950/20 text-cyan-400 text-xs font-mono uppercase tracking-wider mb-3">
          <Layers className="w-3.5 h-3.5" />
          Technical Registry
        </div>
        <h2 className="text-3xl md:text-4xl font-display font-bold text-white tracking-tight">
          Capabilities Bento Grid
        </h2>
        <p className="text-sm text-slate-400 mt-2 max-w-xl mx-auto">
          Hover over individual bento panels to tilt them in 3D. Naomi's structures are highly optimized for rendering fidelity and hardware acceleration.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {SKILL_ITEMS.map((skill) => (
          <TiltCard key={skill.id} skill={skill} />
        ))}
      </div>
    </div>
  );
}
