import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, MessageSquare, Terminal, RefreshCw, Bot } from "lucide-react";
import { ChatMessage } from "../types";

export default function HologramChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "model",
      text: "Holographic matrix loaded. I am the AI Companion of Naomi Theron (RIDZ-CODER). Ask me about her creative coding projects, her technical stack, or anything you'd like to build!",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Suggested Prompts
  const SUGGESTED_PROMPTS = [
    "What are Naomi's strengths?",
    "Tell me about Helix 3D Visualizer.",
    "What is her design philosophy?",
    "Write a 3D canvas shader joke!"
  ];

  // Auto-scroll to bottom of chat
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: ChatMessage = {
      id: Math.random().toString(),
      role: "user",
      text,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    try {
      // Map history for the model API (role should map correctly)
      const history = messages
        .filter(msg => msg.id !== "welcome")
        .map((msg) => ({
          role: msg.role === "user" ? "user" : "model",
          text: msg.text
        }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history })
      });

      const data = await response.json();

      if (response.ok && data.text) {
        const botMessage: ChatMessage = {
          id: Math.random().toString(),
          role: "model",
          text: data.text,
          timestamp: new Date()
        };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        throw new Error(data.error || "Communication failure.");
      }
    } catch (err: any) {
      console.error(err);
      const errorMessage: ChatMessage = {
        id: Math.random().toString(),
        role: "model",
        text: `Error: Unable to synthesize response. Ensure GEMINI_API_KEY is configured in your Settings > Secrets panel. Details: ${err.message}`,
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: "welcome",
        role: "model",
        text: "Holographic matrix re-loaded. Ask me about Naomi's key development projects, full-stack strengths, or ask me for a quick code snippet!",
        timestamp: new Date()
      }
    ]);
  };

  return (
    <div id="hologram-chat-panel" className="w-full max-w-4xl mx-auto py-12 px-4 select-none">
      <div className="flex flex-col lg:flex-row items-stretch gap-6 rounded-2xl border border-white/10 bg-slate-950/75 backdrop-blur-xl p-6 overflow-hidden min-h-[500px] lg:h-[540px]">
        
        {/* Left Side: 3D Pulsing Holographic Core Indicator */}
        <div className="w-full lg:w-1/3 flex flex-col justify-between items-center p-4 border-b lg:border-b-0 lg:border-r border-white/5 pb-6 lg:pb-0">
          <div className="text-center w-full">
            <div className="inline-flex items-center gap-1.5 text-[10px] font-mono text-cyan-400 border border-cyan-500/30 bg-cyan-950/20 px-2.5 py-1 rounded-full uppercase tracking-wider mb-3">
              <Bot className="w-3.5 h-3.5" />
              Interactive AI Node
            </div>
            <h3 className="text-lg font-display font-semibold text-white">
              AI Hologram Core
            </h3>
            <p className="text-[11px] text-slate-500 font-mono mt-1">
              PROXIED // MODEL: GEMINI 3.5
            </p>
          </div>

          {/* Hologram Pulse Core Visualizer */}
          <div className="relative w-40 h-40 flex items-center justify-center my-6 lg:my-0">
            {/* Pulsing ring 3 */}
            <div className="absolute inset-0 rounded-full border border-cyan-500/5 animate-pulse scale-105" />
            {/* Pulsing ring 2 */}
            <div className="absolute inset-4 rounded-full border border-emerald-500/10 animate-ping opacity-35" />
            {/* Pulsing ring 1 */}
            <div className="absolute inset-8 rounded-full border-2 border-cyan-500/20 animate-spin" style={{ animationDuration: "12s" }} />
            
            {/* Core Core */}
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center shadow-[0_0_50px_rgba(6,182,212,0.6)] group hover:scale-110 transition-transform duration-300">
              <Sparkles className="w-7 h-7 text-black animate-pulse" />
            </div>

            {/* Orbiting particles */}
            <div className="absolute w-2.5 h-2.5 rounded-full bg-cyan-400 top-2 left-1/2 animate-bounce" />
            <div className="absolute w-1.5 h-1.5 rounded-full bg-emerald-400 bottom-6 right-8 animate-pulse" />
          </div>

          <div className="w-full">
            <p className="text-[10px] text-slate-500 font-mono text-center leading-relaxed">
              This intelligence layer uses Google Gemini API proxying on Express server nodes to prevent client key leaking.
            </p>
          </div>
        </div>

        {/* Right Side: Chat Window */}
        <div className="flex-1 flex flex-col justify-between h-[400px] lg:h-full overflow-hidden pt-4 lg:pt-0">
          
          {/* Messages Header */}
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wide">Signal Terminal</span>
            </div>

            <button
              id="hologram-reset-btn"
              onClick={handleResetChat}
              title="Reset Chat Matrix"
              className="p-1.5 rounded-lg border border-white/5 bg-white/5 text-slate-500 hover:text-white hover:border-white/10 transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Messages Flow */}
          <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1 scrollbar-thin">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-xl px-4 py-2.5 text-xs leading-relaxed font-sans border ${
                    msg.role === "user"
                      ? "bg-emerald-950/30 border-emerald-500/20 text-emerald-200"
                      : "bg-[#06080e]/95 border-white/5 text-slate-300 shadow-md"
                  }`}
                >
                  {/* Speaker Label */}
                  <div className="flex items-center gap-1 mb-1 opacity-40 text-[9px] font-mono uppercase tracking-wider">
                    {msg.role === "user" ? <Terminal className="w-2.5 h-2.5" /> : <Bot className="w-2.5 h-2.5" />}
                    {msg.role === "user" ? "Visitor Node" : "Hologram AI"}
                  </div>
                  <p className="whitespace-pre-line">{msg.text}</p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex flex-col items-start">
                <div className="bg-[#06080e]/95 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-slate-400 flex items-center gap-2 shadow-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                  <span className="font-mono text-[10px] uppercase text-slate-500 ml-1">Decoding signal...</span>
                </div>
              </div>
            )}
            <div ref={scrollRef} />
          </div>

          {/* Prompt Chips */}
          {messages.length === 1 && !isTyping && (
            <div className="py-2.5 border-t border-white/5 flex flex-wrap gap-2">
              {SUGGESTED_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleSendMessage(prompt)}
                  className="px-2.5 py-1 rounded-lg border border-white/5 bg-white/[0.02] hover:border-emerald-500/20 hover:bg-emerald-950/10 text-[10px] font-mono text-slate-400 hover:text-emerald-400 transition-all cursor-pointer"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {/* Input Box */}
          <div className="flex items-center gap-2 pt-3 border-t border-white/5">
            <input
              id="hologram-chat-input"
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSendMessage(inputValue);
              }}
              placeholder="Ask the AI Companion about Naomi Theron..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900/40 border border-white/5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/30 focus:border-emerald-500/30 font-mono"
            />
            <button
              id="hologram-send-btn"
              onClick={() => handleSendMessage(inputValue)}
              className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500 hover:text-black transition-all cursor-pointer shadow-[0_0_15px_-5px_rgba(52,211,153,0.3)]"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
