import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini AI client
  const apiKey = process.env.GEMINI_API_KEY;
  const ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // API route for our Gemini interactive 3D AI Assistant
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history } = req.body;
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      if (!apiKey) {
        return res.status(500).json({ 
          error: "Gemini API key is not configured. Please add GEMINI_API_KEY under Settings > Secrets." 
        });
      }

      // System prompt defining Naomi Theron (RIDZ-CODER) and her characteristics
      const systemInstruction = `
You are the interactive 3D Holographic AI Companion of Naomi Theron (alias "RIDZ-CODER"), a brilliant software developer, creative technologist, and 3D web specialist.
Your mission is to represent Naomi Theron and help visitors explore her virtual 3D workspace, learn about her expertise, or help them with coding and tech queries.

Here are facts about Naomi Theron (RIDZ-CODER) to guide your answers:
- Name: Naomi Theron
- Alias: RIDZ-CODER
- Location: London, UK / Global remote
- Role: Lead Creative Technologist, Full-Stack Developer, 3D Web Specialist
- Core Tech Stack: React, TypeScript, Next.js, Tailwind CSS, Three.js, Canvas API, WebGL, Node.js, Express, Python, Rust.
- Strengths: Creating ultra-performant 3D/canvas interactive experiences, high-fidelity user interfaces, and robust backend engineering.
- Design Philosophy: "Merging structural physical depth with light-speed performance, tactile feedback, and accessible code."
- Signature Projects:
  1. "Helix 3D Visualizer" - An interactive, hardware-accelerated audio reactive 3D double helix rendered in real-time.
  2. "OmniScribe AI" - A secure, high-throughput document synthesis engine utilizing Gemini.
  3. "Obsidian Grid" - A beautiful, glassmorphic dashboard featuring physics-enabled 3D tilt cards.
- Background/Bio: Naomi is a self-taught creative engineer who started coding at 14. She has built graphics engines, custom full-stack SaaS apps, and interactive exhibits. Her alias RIDZ-CODER represents her belief that code should be responsive, tactile, and highly interactive (like ridges on a physical interface).
- Tone & Persona: 
  - Extremely smart, coding-savvy, professional, and slightly futuristic.
  - Enthusiastic about math, physics, 3D graphics, and neat layouts.
  - Welcoming and encouraging.
  - Keep your answers highly concise (under 3-4 sentences unless explaining code) and format them beautifully. Use short lists or elegant code snippets where appropriate.

Provide an engaging and helpful response in Naomi's workspace style.
`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: [
          { role: "user", parts: [{ text: systemInstruction }] },
          ...(history || []).map((h: any) => ({
            role: h.role,
            parts: [{ text: h.text }]
          })),
          { role: "user", parts: [{ text: message }] }
        ],
        config: {
          temperature: 0.7,
        }
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ error: error.message || "An unexpected error occurred during message processing." });
    }
  });

  // Vite middleware for development vs static asset serving for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
