import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, ExternalLink, Github, Sparkles } from "lucide-react";
import { Project } from "../types";

const PROJECTS: Project[] = [
  {
    id: "helix",
    title: "Helix 3D Visualizer",
    subtitle: "Creative Coding / WebGL & Canvas",
    description: "An interactive, double-helix 3D particles system that responds in real-time to audio frequencies. Engineered using pure vector mathematics and native Canvas 2D render loops for extreme performance.",
    tags: ["HTML5 Canvas", "Vector Math", "Audio Synthesis", "TypeScript"],
    image: "https://picsum.photos/seed/helix/800/500?blur=1",
    githubUrl: "https://github.com/Naomi-Theron/RIDZ-CODER",
  },
  {
    id: "omniscribe",
    title: "OmniScribe AI",
    subtitle: "AI Infrastructure / Node.js & Gemini",
    description: "A secure, serverless document intelligence platform that transcribes high-volume audio, isolates separate speaker voices, and extracts key insights using server-side Gemini intelligence.",
    tags: ["Gemini AI", "Express", "Serverless", "WebSockets"],
    image: "https://picsum.photos/seed/scribe/800/500?blur=1",
    githubUrl: "https://github.com/Naomi-Theron/RIDZ-CODER",
  },
  {
    id: "obsidian",
    title: "Obsidian 3D Grid",
    subtitle: "Creative UI / CSS 3D & React",
    description: "A gorgeous, bento-grid dashboard composed of high-fidelity glassmorphic cards. Each card implements real-time hardware-accelerated 3D tilt and fluid particle ripples based on mouse-pointer collision vectors.",
    tags: ["React", "Tailwind CSS", "Framer Motion", "CSS 3D Transforms"],
    image: "https://picsum.photos/seed/obsidian/800/500?blur=1",
    githubUrl: "https://github.com/Naomi-Theron/RIDZ-CODER",
  },
  {
    id: "cosmic",
    title: "Cosmic Code Sandbox",
    subtitle: "Educational Tool / Virtual Machine",
    description: "An in-browser virtual editing suite that lets visitors edit, hot-reload, and run graphics routines. It supports canvas-based script compilation and outputs beautiful, real-time reactive art on a virtual 3D monitor.",
    tags: ["AST Parser", "Compiler", "Dynamic Evaluation", "Vite"],
    image: "https://picsum.photos/seed/cosmic/800/500?blur=1",
    githubUrl: "https://github.com/Naomi-Theron/RIDZ-CODER",
  }
];

export default function ThreeDCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % PROJECTS.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + PROJECTS.length) % PROJECTS.length);
  };

  const getCardStyle = (index: number) => {
    const total = PROJECTS.length;
    // Calculate the circular distance relative to currentIndex
    let diff = index - currentIndex;
    
    // Normalize difference for circular carousel (-total/2 to total/2)
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;

    const isActive = diff === 0;
    const isLeft = diff === -1 || (diff > 0 && total > 2 && diff === total - 1);
    const isRight = diff === 1 || (diff < 0 && total > 2 && diff === -(total - 1));

    if (isActive) {
      return {
        transform: "translateX(0%) translateZ(100px) rotateY(0deg) scale(1)",
        zIndex: 10,
        opacity: 1,
        pointerEvents: "auto" as const,
        filter: "blur(0px)",
      };
    } else if (isLeft) {
      return {
        transform: "translateX(-45%) translateZ(0px) rotateY(28deg) scale(0.82)",
        zIndex: 5,
        opacity: 0.45,
        pointerEvents: "auto" as const,
        filter: "blur(2px)",
      };
    } else if (isRight) {
      return {
        transform: "translateX(45%) translateZ(0px) rotateY(-28deg) scale(0.82)",
        zIndex: 5,
        opacity: 0.45,
        pointerEvents: "auto" as const,
        filter: "blur(2px)",
      };
    } else {
      return {
        transform: "translateX(0%) translateZ(-150px) rotateY(0deg) scale(0.65)",
        zIndex: 1,
        opacity: 0,
        pointerEvents: "none" as const,
        filter: "blur(4px)",
      };
    }
  };

  return (
    <div id="3d-portfolio-carousel-container" className="relative w-full max-w-5xl mx-auto py-12 px-4 select-none">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-950/20 text-emerald-400 text-xs font-mono uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          Featured Deployments
        </div>
        <h2 className="text-3xl md:text-4xl font-display font-bold text-white tracking-tight">
          3D Interactive Projects
        </h2>
        <p className="text-sm text-slate-400 mt-2 max-w-xl mx-auto">
          Explore Naomi's premium software architectures. Each node represents a fully functional repository built for extreme speed and tactile feedback.
        </p>
      </div>

      {/* 3D Stage */}
      <div 
        className="relative h-[480px] md:h-[500px] w-full overflow-visible flex items-center justify-center"
        style={{ perspective: "1000px" }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          {PROJECTS.map((project, index) => {
            const style = getCardStyle(index);
            const isActive = index === currentIndex;

            return (
              <div
                key={project.id}
                id={`project-card-${project.id}`}
                onClick={() => {
                  if (!isActive) setCurrentIndex(index);
                }}
                className="absolute w-[92%] max-w-[420px] h-[400px] rounded-2xl border border-white/10 bg-slate-950/80 backdrop-blur-xl transition-all duration-700 ease-out flex flex-col overflow-hidden group cursor-pointer shadow-[0_0_50px_-15px_rgba(16,185,129,0.15)]"
                style={{
                  transform: style.transform,
                  zIndex: style.zIndex,
                  opacity: style.opacity,
                  pointerEvents: style.pointerEvents,
                  filter: style.filter,
                  transformStyle: "preserve-3d",
                }}
              >
                {/* Image Section */}
                <div className="relative h-44 overflow-hidden border-b border-white/5">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/25 to-transparent z-10" />
                  <img
                    src={project.image}
                    alt={project.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                  />
                  
                  {/* Glowing Edge Border */}
                  <div className="absolute bottom-4 left-4 z-20 flex items-center gap-1.5 px-2 py-0.5 rounded-md border border-cyan-500/30 bg-cyan-950/45 text-[10px] font-mono uppercase tracking-wider text-cyan-400">
                    {project.subtitle}
                  </div>
                </div>

                {/* Content Section */}
                <div className="flex-1 p-6 flex flex-col justify-between" style={{ transform: "translateZ(30px)" }}>
                  <div>
                    <h3 className="text-xl font-display font-semibold text-white group-hover:text-emerald-400 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-3 mt-2 font-sans leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  <div>
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-mono text-slate-500 px-2 py-0.5 rounded-md bg-white/5 border border-white/5"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-between pt-3 border-t border-white/5">
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-white transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Github className="w-3.5 h-3.5" />
                        Source
                      </a>

                      <button
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 hover:bg-emerald-500 hover:border-emerald-500 text-xs font-mono text-emerald-400 hover:text-black transition-all duration-300"
                        onClick={(e) => {
                          e.stopPropagation();
                          alert(`Launching production preview for "${project.title}"! All RIDZ-CODER nodes are currently operational.`);
                        }}
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Initialize
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-center gap-6 mt-4">
        <button
          id="carousel-prev-btn"
          onClick={handlePrev}
          className="p-3 rounded-full border border-white/10 bg-slate-900/40 hover:bg-emerald-950/20 hover:border-emerald-500/40 text-slate-400 hover:text-emerald-400 transition-all cursor-pointer backdrop-blur-md"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <span className="text-xs font-mono text-slate-500">
          NODE <span className="text-emerald-400">{currentIndex + 1}</span> / {PROJECTS.length}
        </span>

        <button
          id="carousel-next-btn"
          onClick={handleNext}
          className="p-3 rounded-full border border-white/10 bg-slate-900/40 hover:bg-emerald-950/20 hover:border-emerald-500/40 text-slate-400 hover:text-emerald-400 transition-all cursor-pointer backdrop-blur-md"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
