import React, { useState, useEffect, useRef } from "react";
import { Play, RotateCcw, FileCode, CheckCircle, AlertTriangle, HelpCircle } from "lucide-react";
import { SandboxFile } from "../types";

const INITIAL_FILES: SandboxFile[] = [
  {
    id: "helix",
    name: "Helix3D.js",
    description: "Draws an audio-reactive double helix in 3D perspective.",
    code: `// Helix3D Render Routine
// Edit properties below and click 'Run Compiler'!

const nodes = 35;
const radius = 60;
const speed = 0.04;

ctx.fillStyle = "rgba(5, 7, 12, 0.25)";
ctx.fillRect(0, 0, width, height);

const cx = width / 2;
const cy = height / 2;

// Draw Double Helix
for (let i = 0; i < nodes; i++) {
  const theta = (i / nodes) * Math.PI * 4 + time * speed;
  const z1 = Math.sin(theta) * radius;
  const x1 = Math.cos(theta) * radius;
  const y = (i / nodes) * (height * 0.7) - (height * 0.35);

  // Projection
  const fov = 200;
  const scale1 = fov / (z1 + fov + 100);
  const px1 = x1 * scale1 + cx;
  const py1 = y * scale1 + cy;

  // Strand 2 (Opposite Phase)
  const z2 = Math.sin(theta + Math.PI) * radius;
  const x2 = Math.cos(theta + Math.PI) * radius;
  const scale2 = fov / (z2 + fov + 100);
  const px2 = x2 * scale2 + cx;
  const py2 = y * scale2 + cy;

  // Draw node 1
  ctx.fillStyle = \`rgba(52, 211, 153, \${0.3 + scale1 * 0.7})\`;
  ctx.beginPath();
  ctx.arc(px1, py1, 3.5 * scale1, 0, Math.PI * 2);
  ctx.fill();

  // Draw node 2
  ctx.fillStyle = \`rgba(6, 182, 212, \${0.3 + scale2 * 0.7})\`;
  ctx.beginPath();
  ctx.arc(px2, py2, 3.5 * scale2, 0, Math.PI * 2);
  ctx.fill();

  // Connecting rungs
  if (i % 2 === 0) {
    ctx.strokeStyle = \`rgba(148, 163, 184, \${0.15 * ((scale1 + scale2)/2)})\`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(px1, py1);
    ctx.lineTo(px2, py2);
    ctx.stroke();
  }
}`
  },
  {
    id: "matrix",
    name: "MatrixRain.js",
    description: "Generates vertical streams of flowing digital code.",
    code: `// Matrix Rain Render Routine
// Try editing the character set or the color values!

const charSize = 10;
const columns = Math.floor(width / charSize);

// Initialize drops on first run
if (!state.drops || state.drops.length !== columns) {
  state.drops = Array(columns).fill(0).map(() => Math.random() * -50);
}

ctx.fillStyle = "rgba(5, 7, 12, 0.08)";
ctx.fillRect(0, 0, width, height);

ctx.fillStyle = "#10b981"; // Matrix Emerald Green
ctx.font = \`\${charSize}px monospace\`;

const chars = "01011001011100010101ABCDEFXYZ$@#%&";

for (let i = 0; i < columns; i++) {
  const text = chars[Math.floor(Math.random() * chars.length)];
  const x = i * charSize;
  const y = state.drops[i] * charSize;

  // Draw character
  ctx.fillText(text, x, y);

  // Spawn trail effect
  if (Math.random() > 0.97) {
    ctx.fillStyle = "#fff";
    ctx.fillText(text, x, y);
    ctx.fillStyle = "#10b981";
  }

  // Increment drop coordinates
  if (y > height && Math.random() > 0.975) {
    state.drops[i] = 0;
  } else {
    state.drops[i]++;
  }
}`
  },
  {
    id: "starfield",
    name: "Hyperdrive.js",
    description: "Draws stars projecting outward at warp speed.",
    code: `// Hyperdrive Starfield Routine
// Edit warp velocity and star volume!

const numStars = 80;
const velocity = 3.5;

if (!state.stars) {
  state.stars = Array(numStars).fill(null).map(() => ({
    x: (Math.random() - 0.5) * 600,
    y: (Math.random() - 0.5) * 600,
    z: Math.random() * 600
  }));
}

ctx.fillStyle = "rgba(5, 7, 12, 0.2)";
ctx.fillRect(0, 0, width, height);

const cx = width / 2;
const cy = height / 2;

state.stars.forEach(star => {
  star.z -= velocity;
  if (star.z <= 0) {
    star.x = (Math.random() - 0.5) * 600;
    star.y = (Math.random() - 0.5) * 600;
    star.z = 600;
  }

  const fov = 150;
  const scale = fov / (star.z + fov);
  const px = star.x * scale + cx;
  const py = star.y * scale + cy;

  if (px >= 0 && px < width && py >= 0 && py < height) {
    const depthOpacity = Math.min(1, (600 - star.z) / 200);
    ctx.fillStyle = \`rgba(6, 182, 212, \${depthOpacity * scale * 2})\`;
    ctx.beginPath();
    ctx.arc(px, py, 1.5 * scale, 0, Math.PI * 2);
    ctx.fill();
  }
});`
  }
];

export default function CodingSandbox() {
  const [files, setFiles] = useState<SandboxFile[]>(INITIAL_FILES);
  const [activeFileId, setActiveFileId] = useState("helix");
  const [editedCode, setEditedCode] = useState(INITIAL_FILES[0].code);
  const [compilerError, setCompilerError] = useState<string | null>(null);
  const [isCompiling, setIsCompiling] = useState(false);
  const [compileSuccess, setCompileSuccess] = useState(true);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const monitorRef = useRef<HTMLDivElement | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);
  const stateRef = useRef<Record<string, any>>({});
  
  // Track active file selection to load code
  const activeFile = files.find((f) => f.id === activeFileId) || files[0];

  useEffect(() => {
    setEditedCode(activeFile.code);
    stateRef.current = {}; // Reset state machine variables
    setCompilerError(null);
  }, [activeFileId, files]);

  // Handle virtual 3D monitor mouse rotation (Tactile feedback)
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = monitorRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    
    // Scale down tilt coefficients
    setTilt({
      x: -dy * 0.08, // vertical pitch
      y: dx * 0.08,   // horizontal yaw
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  // Compiler Logic: Compiles standard javascript canvas code
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 320);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 240);

    const handleResize = () => {
      width = canvas.width = canvas.parentElement?.clientWidth || 320;
      height = canvas.height = canvas.parentElement?.clientHeight || 240;
    };
    window.addEventListener("resize", handleResize);

    let compiledFunc: Function | null = null;
    try {
      // Evaluate editedCode dynamically in a clean execution context
      compiledFunc = new Function(
        "ctx",
        "width",
        "height",
        "time",
        "state",
        editedCode
      );
      setCompilerError(null);
    } catch (err: any) {
      setCompilerError(err.message || "Compilation failed. Check syntax.");
      setCompileSuccess(false);
    }

    let time = 0;
    const renderLoop = () => {
      time++;
      if (compiledFunc) {
        try {
          compiledFunc(ctx, width, height, time, stateRef.current);
        } catch (err: any) {
          setCompilerError(err.message || "Runtime error inside compilation.");
          compiledFunc = null; // stop execution
          setCompileSuccess(false);
        }
      }
      animationFrameIdRef.current = requestAnimationFrame(renderLoop);
    };

    if (compiledFunc) {
      renderLoop();
    }

    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      window.removeEventListener("resize", handleResize);
    };
  }, [editedCode]);

  const handleCompile = () => {
    setIsCompiling(true);
    setCompileSuccess(false);
    setTimeout(() => {
      setIsCompiling(false);
      // Try to re-evaluate the code to double check syntax
      try {
        new Function(
          "ctx",
          "width",
          "height",
          "time",
          "state",
          editedCode
        );
        // Save back to file state so changes are preserved in the session
        setFiles(prev => prev.map(f => f.id === activeFileId ? { ...f, code: editedCode } : f));
        setCompilerError(null);
        setCompileSuccess(true);
        stateRef.current = {}; // Flush sandbox memory
      } catch (err: any) {
        setCompilerError(err.message || "Compilation failed. Syntax error.");
        setCompileSuccess(false);
      }
    }, 600);
  };

  const handleReset = () => {
    const original = INITIAL_FILES.find((f) => f.id === activeFileId);
    if (original) {
      setEditedCode(original.code);
      stateRef.current = {};
      setCompilerError(null);
      setCompileSuccess(true);
    }
  };

  return (
    <div id="coding-sandbox-panel" className="w-full max-w-5xl mx-auto py-12 px-4">
      <div className="flex flex-col md:flex-row items-stretch gap-6 h-auto md:h-[560px]">
        {/* Left Console: File selector and Source Code */}
        <div className="flex-1 flex flex-col rounded-2xl border border-white/10 bg-slate-950/75 backdrop-blur-xl p-5 overflow-hidden">
          <div className="flex items-center justify-between pb-4 border-b border-white/5">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-500/80" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                <span className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <span className="text-xs font-mono text-slate-500 ml-2">sandbox://ridz-coder/term</span>
            </div>
            
            {/* Active File Label */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 text-[11px] font-mono text-slate-400">
              <FileCode className="w-3.5 h-3.5 text-emerald-400" />
              {activeFile.name}
            </div>
          </div>

          {/* Core File Selector */}
          <div className="flex items-center gap-2 py-3 overflow-x-auto scrollbar-none border-b border-white/5">
            {files.map((file) => (
              <button
                key={file.id}
                onClick={() => setActiveFileId(file.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono border transition-all shrink-0 cursor-pointer ${
                  activeFileId === file.id
                    ? "bg-emerald-950/30 border-emerald-500/40 text-emerald-400 shadow-[0_0_15px_-5px_rgba(52,211,153,0.3)]"
                    : "bg-slate-900/20 border-white/5 text-slate-400 hover:text-white hover:border-white/10"
                }`}
              >
                <span>{file.name}</span>
              </button>
            ))}
          </div>

          <div className="text-[11px] text-slate-500 font-mono py-1 px-1 bg-white/5 border border-white/5 rounded-md mt-2 flex items-center gap-2">
            <HelpCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>{activeFile.description} Feel free to edit the parameters below!</span>
          </div>

          {/* Editor Area */}
          <div className="flex-1 min-h-[220px] mt-3 relative rounded-xl overflow-hidden border border-white/5">
            <textarea
              id="sandbox-code-editor"
              value={editedCode}
              onChange={(e) => setEditedCode(e.target.value)}
              className="w-full h-full p-4 bg-[#04060a] text-slate-300 font-mono text-xs leading-relaxed focus:outline-none focus:ring-1 focus:ring-emerald-500/40 resize-none overflow-y-auto"
              spellCheck={false}
            />
            {compilerError && (
              <div className="absolute bottom-3 left-3 right-3 p-3 rounded-lg border border-red-500/20 bg-red-950/90 text-[11px] font-mono text-red-400 flex items-start gap-2 max-h-[80px] overflow-y-auto">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{compilerError}</span>
              </div>
            )}
            {!compilerError && compileSuccess && (
              <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md bg-emerald-950/80 border border-emerald-500/30 text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-emerald-400" />
                COMPILED
              </div>
            )}
          </div>

          {/* Console Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-4">
            <button
              id="sandbox-reset-btn"
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-white/10 hover:border-white/20 text-xs font-mono text-slate-400 hover:text-white transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Default Reset
            </button>

            <button
              id="sandbox-compile-btn"
              onClick={handleCompile}
              disabled={isCompiling}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-xs font-mono text-black font-semibold hover:opacity-90 disabled:opacity-50 transition-all cursor-pointer shadow-[0_0_20px_-5px_rgba(52,211,153,0.5)]"
            >
              <Play className={`w-3.5 h-3.5 ${isCompiling ? "animate-spin" : ""}`} />
              {isCompiling ? "Compiling..." : "Run Compiler"}
            </button>
          </div>
        </div>

        {/* Right Console: 3D Holographic Screen Monitor */}
        <div className="flex-1 flex flex-col justify-center items-center">
          <div
            id="3d-sandbox-monitor-stage"
            ref={monitorRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative w-full max-w-[420px] aspect-[4/3] rounded-3xl border border-white/10 bg-slate-900/10 p-4 shadow-[0_0_60px_-20px_rgba(6,182,212,0.15)] flex flex-col transition-all duration-300 ease-out cursor-crosshair group overflow-visible"
            style={{
              transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
              transformStyle: "preserve-3d",
            }}
          >
            {/* Floating Gloss Reflection overlay */}
            <div className="absolute inset-4 rounded-2xl bg-gradient-to-tr from-transparent via-white/[0.03] to-white/[0.08] pointer-events-none z-10" />

            {/* Simulated 3D Bezel / Shadow elements */}
            <div 
              className="absolute -inset-1 rounded-[28px] border border-cyan-500/10 pointer-events-none"
              style={{ transform: "translateZ(-10px)" }}
            />
            <div 
              className="absolute -inset-2 rounded-[32px] border border-white/5 pointer-events-none"
              style={{ transform: "translateZ(-20px)" }}
            />

            {/* Virtual Monitor Screen Frame */}
            <div className="relative flex-1 rounded-2xl bg-[#05070c] border border-white/5 overflow-hidden flex flex-col shadow-inner">
              
              {/* Screen CRT Scanlines Overlay */}
              <div className="absolute inset-0 bg-scanlines pointer-events-none z-20 mix-blend-overlay opacity-30" />
              
              {/* Pulse Indicator */}
              <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2 py-1 rounded-md border border-white/5 text-[9px] font-mono text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                COMPILED NODE
              </div>

              {/* Rendering Canvas */}
              <div className="flex-1 relative w-full h-full bg-[#05070c]">
                <canvas
                  id="sandbox-render-canvas"
                  ref={canvasRef}
                  className="w-full h-full block"
                />
              </div>

              {/* Console Footnote */}
              <div className="h-8 bg-[#090d16] border-t border-white/5 flex items-center justify-between px-3 text-[10px] font-mono text-slate-500 z-10">
                <span>VIRTUAL_SCREEN // 0xCC1</span>
                <span>FPS: 60.0</span>
              </div>
            </div>
            
            {/* Monitor Stand Base (Behind) */}
            <div 
              className="absolute -bottom-8 left-1/2 -translateX-1/2 w-32 h-8 bg-slate-950/80 border border-white/10 rounded-b-xl border-t-0 -z-10 shadow-lg pointer-events-none flex items-center justify-center text-[8px] font-mono text-slate-600"
              style={{ transform: "translateZ(-30px) translateX(-50%)" }}
            >
              RIDZ-COMPILER
            </div>
          </div>

          <p className="text-[11px] font-mono text-slate-500 text-center mt-12 max-w-sm">
            Hover over and drag near the virtual monitor to tilt the CRT matrix grid in 3D perspective space.
          </p>
        </div>
      </div>
    </div>
  );
}
