import React, { useState, useEffect } from "react";
import { Terminal, Cpu, Globe, ArrowDown, Mail, CheckCircle2, User, HelpCircle, Code } from "lucide-react";
import ThreeDBackground from "./components/ThreeDBackground";
import ThreeDCarousel from "./components/ThreeDCarousel";
import CodingSandbox from "./components/CodingSandbox";
import SkillsGrid from "./components/SkillsGrid";
import HologramChat from "./components/HologramChat";

export default function App() {
  const [localTime, setLocalTime] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMsg, setContactMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Update Dynamic Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setLocalTime(now.toLocaleTimeString("en-GB", { hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactEmail.trim() || !contactMsg.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setContactEmail("");
      setContactMsg("");
      setTimeout(() => setIsSubmitted(false), 5000);
    }, 1500);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div id="ridz-portfolio-root" className="min-h-screen text-slate-100 font-sans relative overflow-x-hidden selection:bg-emerald-500/35 selection:text-white">
      {/* 3D Kinetic Canvas Background */}
      <ThreeDBackground />

      {/* Main Container */}
      <div className="relative z-10 w-full flex flex-col min-h-screen">
        
        {/* TOP HEADER: Command Terminal Bar */}
        <header id="top-terminal-header" className="w-full border-b border-white/5 bg-slate-950/40 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
            
            {/* Title / Alias */}
            <div 
              onClick={() => scrollToSection("hero-anchor")} 
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/35 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Terminal className="w-4.5 h-4.5 text-emerald-400" />
              </div>
              <div>
                <span className="font-display font-bold text-white tracking-wider text-sm">RIDZ-CODER</span>
                <span className="text-[10px] font-mono text-slate-500 block">v3.5.0 // ONLINE</span>
              </div>
            </div>

            {/* Navigation Nodes */}
            <nav className="hidden md:flex items-center gap-6">
              <button 
                onClick={() => scrollToSection("projects-anchor")}
                className="text-xs font-mono text-slate-400 hover:text-white hover:border-b hover:border-emerald-500/40 pb-1 pt-1 transition-all cursor-pointer"
              >
                /projects
              </button>
              <button 
                onClick={() => scrollToSection("sandbox-anchor")}
                className="text-xs font-mono text-slate-400 hover:text-white hover:border-b hover:border-emerald-500/40 pb-1 pt-1 transition-all cursor-pointer"
              >
                /sandbox
              </button>
              <button 
                onClick={() => scrollToSection("skills-anchor")}
                className="text-xs font-mono text-slate-400 hover:text-white hover:border-b hover:border-emerald-500/40 pb-1 pt-1 transition-all cursor-pointer"
              >
                /capabilities
              </button>
              <button 
                onClick={() => scrollToSection("ai-chat-anchor")}
                className="text-xs font-mono text-slate-400 hover:text-white hover:border-b hover:border-emerald-500/40 pb-1 pt-1 transition-all cursor-pointer"
              >
                /companion
              </button>
            </nav>

            {/* Quick Stats Grid */}
            <div className="flex items-center gap-4 text-right">
              <div className="hidden sm:block">
                <span className="text-[10px] font-mono text-slate-500 block">UTC COORD</span>
                <span className="text-xs font-mono text-cyan-400 font-medium">{localTime || "00:00:00"}</span>
              </div>
              
              {/* Core CTA */}
              <button
                onClick={() => scrollToSection("contact-anchor")}
                className="px-4 py-1.5 rounded-lg border border-emerald-500/30 bg-emerald-950/15 hover:bg-emerald-500 hover:text-black text-xs font-mono text-emerald-400 font-medium transition-all cursor-pointer shadow-[0_0_15px_-5px_rgba(52,211,153,0.3)]"
              >
                Connect
              </button>
            </div>

          </div>
        </header>

        {/* SECTION 1: Dynamic Hero Stage */}
        <section id="hero-anchor" className="w-full flex-1 max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-32 flex flex-col justify-center items-center text-center">
          
          {/* Subtle Node Tracker */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/5 bg-slate-900/30 backdrop-blur-md text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-6 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            VIRTUAL PERSPECTIVE ACTIVE // PORT 3000
          </div>

          {/* Heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-extrabold text-white tracking-tight leading-none">
            Naomi Theron
          </h1>
          <h2 className="text-xl md:text-3xl font-mono text-emerald-400 mt-4 uppercase tracking-wider font-semibold">
            &lt; RIDZ-CODER /&gt;
          </h2>

          <p className="text-slate-400 text-sm md:text-base mt-6 max-w-xl mx-auto leading-relaxed">
            Lead Creative Technologist & Full-Stack Developer specializing in high-performance 3D graphics compilation, secure server-side AI pipelines, and responsive web systems.
          </p>

          {/* Core Action Deck */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-10">
            <button
              onClick={() => scrollToSection("projects-anchor")}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-sm font-mono text-black font-semibold hover:opacity-95 transition-all shadow-[0_0_30px_-5px_rgba(52,211,153,0.5)] flex items-center gap-2 cursor-pointer"
            >
              Initialize Workspace
              <ArrowDown className="w-4 h-4 animate-bounce" />
            </button>

            <button
              onClick={() => scrollToSection("ai-chat-anchor")}
              className="px-6 py-3 rounded-xl border border-white/10 hover:border-cyan-500/40 bg-slate-900/40 hover:bg-cyan-950/15 text-sm font-mono text-slate-300 hover:text-cyan-400 transition-all backdrop-blur-md flex items-center gap-2 cursor-pointer"
            >
              AI Hologram Chat
              <Cpu className="w-4 h-4 text-cyan-400" />
            </button>
          </div>

          {/* Floating Hardware Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-4xl border border-white/5 bg-slate-950/20 backdrop-blur-md rounded-2xl p-6 mt-20 md:mt-32">
            <div className="text-center md:text-left border-r border-white/5">
              <span className="text-[10px] font-mono text-slate-500 block uppercase">Deployment Core</span>
              <span className="text-xs font-mono text-slate-300 font-medium flex items-center justify-center md:justify-start gap-1.5 mt-1">
                <Globe className="w-3.5 h-3.5 text-emerald-400" />
                Cloud Run // NGINX
              </span>
            </div>
            <div className="text-center md:text-left border-r border-white/5 pl-2">
              <span className="text-[10px] font-mono text-slate-500 block uppercase">Fidelity Lock</span>
              <span className="text-xs font-mono text-slate-300 font-medium flex items-center justify-center md:justify-start gap-1.5 mt-1">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                60.0 FPS // Lock
              </span>
            </div>
            <div className="text-center md:text-left border-r border-white/5 pl-2">
              <span className="text-[10px] font-mono text-slate-500 block uppercase">Client Pipeline</span>
              <span className="text-xs font-mono text-slate-300 font-medium flex items-center justify-center md:justify-start gap-1.5 mt-1">
                <User className="w-3.5 h-3.5 text-purple-400" />
                Vite 6 // React 19
              </span>
            </div>
            <div className="text-center md:text-left pl-2">
              <span className="text-[10px] font-mono text-slate-500 block uppercase">Server Engine</span>
              <span className="text-xs font-mono text-slate-300 font-medium flex items-center justify-center md:justify-start gap-1.5 mt-1">
                <Code className="w-3.5 h-3.5 text-amber-400" />
                Node // Express 4
              </span>
            </div>
          </div>

        </section>

        {/* SECTION 2: 3D Project Slider Deck */}
        <section id="projects-anchor" className="w-full border-t border-white/5 bg-gradient-to-b from-slate-950/30 to-transparent py-16">
          <ThreeDCarousel />
        </section>

        {/* SECTION 3: Live 3D Coding Sandbox */}
        <section id="sandbox-anchor" className="w-full border-t border-white/5 bg-gradient-to-b from-transparent to-slate-950/40 py-16">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-950/20 text-emerald-400 text-xs font-mono uppercase tracking-wider mb-3">
              <Code className="w-3.5 h-3.5" />
              Runtime Shell
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white tracking-tight">
              Virtual CRT Code Sandbox
            </h2>
            <p className="text-sm text-slate-400 mt-2 max-w-xl mx-auto">
              Inspect or customize graphic drawing scripts inside our sandboxed execution context. Click Compile to render procedural calculations inside our 3D tilted CRT screen.
            </p>
          </div>
          <CodingSandbox />
        </section>

        {/* SECTION 4: Bento Capabilities Grid */}
        <section id="skills-anchor" className="w-full border-t border-white/5 py-16">
          <SkillsGrid />
        </section>

        {/* SECTION 5: Gemini AI Companion Chat Hologram */}
        <section id="ai-chat-anchor" className="w-full border-t border-white/5 bg-gradient-to-b from-transparent to-slate-950/40 py-16">
          <div className="text-center mb-4">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white tracking-tight">
              AI Hologram Companion
            </h2>
            <p className="text-sm text-slate-400 mt-2 max-w-xl mx-auto">
              Directly interrogate Naomi's digital hologram. Powered by real server-side Gemini intelligence to answer coding questions, bio profiles, or pipeline logic.
            </p>
          </div>
          <HologramChat />
        </section>

        {/* SECTION 6: Terminal Contact Nodes */}
        <section id="contact-anchor" className="w-full border-t border-white/5 py-16 max-w-4xl mx-auto px-4">
          <div className="rounded-2xl border border-white/10 bg-slate-950/75 backdrop-blur-xl p-8 relative overflow-hidden">
            
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-white/5 bg-white/5 text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-3">
                <Mail className="w-3.5 h-3.5 text-cyan-400" />
                Secure Ingress
              </div>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-white">
                Initialize Connection
              </h2>
              <p className="text-xs text-slate-400 mt-1.5 max-w-md mx-auto">
                Transmit a secure message node directly to Naomi Theron's private inbox. All telemetry packets are encrypted.
              </p>
            </div>

            {isSubmitted ? (
              <div className="text-center py-8 flex flex-col items-center justify-center gap-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-lg font-display font-semibold text-white">Message Synced</h3>
                <p className="text-xs text-slate-400 max-w-sm">
                  Packet successfully transmitted to ridzcoder@gmail.com. Naomi's inbox protocol will prioritize this handshake.
                </p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4 max-w-md mx-auto">
                <div>
                  <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">Inbound Node (Your Email)</label>
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900/40 border border-white/5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500/30 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">Payload Content (Message)</label>
                  <textarea
                    required
                    value={contactMsg}
                    onChange={(e) => setContactMsg(e.target.value)}
                    rows={4}
                    placeholder="Describe your design specifications or handshake proposals..."
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900/40 border border-white/5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500/30 font-mono resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-xs font-mono text-black font-semibold hover:opacity-90 disabled:opacity-50 transition-all cursor-pointer shadow-[0_0_20px_-5px_rgba(52,211,153,0.5)]"
                >
                  {isSubmitting ? "Transmitting Packet..." : "Transmit Payload"}
                </button>
              </form>
            )}
          </div>
        </section>

        {/* COMPREHENSIVE FOOTER */}
        <footer className="w-full border-t border-white/5 bg-slate-950/80 backdrop-blur-md mt-auto py-8">
          <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
            
            <div className="text-center md:text-left">
              <span className="text-xs font-mono text-slate-500">
                &copy; {new Date().getFullYear()} RIDZ-CODER // NAOMI THERON. ALL REPOSITORIES INTACT.
              </span>
              <p className="text-[10px] text-slate-600 font-mono mt-1">
                Designed with elegant mathematical coordinates, native canvas render cycles, and secure server-side Gemini intelligence.
              </p>
            </div>

            <div className="flex items-center gap-6">
              <a 
                href="https://github.com/Naomi-Theron/RIDZ-CODER" 
                target="_blank" 
                rel="noreferrer" 
                className="text-xs font-mono text-slate-400 hover:text-emerald-400 transition-colors"
              >
                [Github Repo]
              </a>
              <span className="text-xs font-mono text-slate-600">
                NODE_OK // PING: 12ms
              </span>
            </div>

          </div>
        </footer>

      </div>
    </div>
  );
}
