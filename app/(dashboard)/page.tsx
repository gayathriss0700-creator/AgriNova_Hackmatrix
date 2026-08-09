"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Leaf, ChevronRight, Activity, CloudRain, Satellite, Bot, Shield, BarChart3, Smartphone, ArrowRight } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import ModuleAIAdvisor from "@/components/ModuleAIAdvisor";

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div style={{ minHeight: "100vh", background: "#020617", color: "#f8fafc", fontFamily: "var(--font-geist-sans), sans-serif", overflowX: "hidden" }}>
      
      {/* Navbar */}
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 48px", borderBottom: "1px solid rgba(255,255,255,0.05)", backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 50, background: "rgba(2,6,23,0.8)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Leaf size={18} color="white" />
          </div>
          <span style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.5px" }}>Agri Nova</span>
        </div>
        <div style={{ display: "flex", gap: 32, fontSize: 14, fontWeight: 500, color: "#94a3b8" }}>
          <a href="#features" style={{ cursor: "pointer", transition: "color 0.2s" }} onMouseOver={e => e.currentTarget.style.color = "#fff"} onMouseOut={e => e.currentTarget.style.color = "#94a3b8"}>Features</a>
          <a href="#satellite" style={{ cursor: "pointer", transition: "color 0.2s" }} onMouseOver={e => e.currentTarget.style.color = "#fff"} onMouseOut={e => e.currentTarget.style.color = "#94a3b8"}>Satellite Data</a>
          <a href="#pricing" style={{ cursor: "pointer", transition: "color 0.2s" }} onMouseOver={e => e.currentTarget.style.color = "#fff"} onMouseOut={e => e.currentTarget.style.color = "#94a3b8"}>Pro</a>
        </div>
        <div style={{ display: "flex", gap: 16 }}>
          <Link href="/login">
            <button style={{ padding: "8px 16px", borderRadius: 8, fontSize: 14, fontWeight: 600, color: "#fff", background: "transparent", border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer", transition: "all 0.2s" }} onMouseOver={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"} onMouseOut={e => e.currentTarget.style.background = "transparent"}>
              Sign In
            </button>
          </Link>
          <Link href={user ? "/overview" : "/signup"}>
            <button style={{ padding: "8px 16px", borderRadius: 8, fontSize: 14, fontWeight: 600, color: "#000", background: "#fff", border: "none", cursor: "pointer", transition: "transform 0.2s" }} onMouseOver={e => e.currentTarget.style.transform = "scale(1.05)"} onMouseOut={e => e.currentTarget.style.transform = "scale(1)"}>
              {user ? "Go to Dashboard" : "Get Started"}
            </button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ position: "relative", padding: "120px 24px", textAlign: "center", overflow: "hidden" }}>
        {/* Vercel-like mesh gradient background */}
        <div style={{
          position: "absolute",
          top: "50%", left: "50%", transform: "translate(-50%, -50%)",
          width: "80vw", height: "80vw", maxWidth: 1000, maxHeight: 1000,
          background: "radial-gradient(circle, rgba(34,197,94,0.15) 0%, rgba(2,6,23,0) 70%)",
          zIndex: 0,
          pointerEvents: "none"
        }} />
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} style={{ position: "relative", zIndex: 1, maxWidth: 900, margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px", borderRadius: 99, background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", color: "#4ade80", fontSize: 14, fontWeight: 500, marginBottom: 32 }}>
            <SparklesIcon size={16} /> Agri Nova Pro is now live
          </div>
          
          <h1 style={{ fontSize: "clamp(48px, 6vw, 84px)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.1, marginBottom: 24, backgroundImage: "linear-gradient(180deg, #fff 0%, #a1a1aa 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            The Operating System <br /> for Modern Agriculture.
          </h1>
          
          <p style={{ fontSize: "clamp(18px, 2vw, 22px)", color: "#94a3b8", maxWidth: 650, margin: "0 auto 48px", lineHeight: 1.6 }}>
            Harness the power of 25 specialist AI agents, Sentinel-2 satellite imagery, and real-time market data to dramatically increase your farm's yield and profitability.
          </p>
          
          <div style={{ display: "flex", gap: 16, justifyContent: "center", alignItems: "center" }}>
            <Link href={user ? "/overview" : "/signup"}>
              <button style={{ padding: "16px 32px", borderRadius: 12, fontSize: 16, fontWeight: 600, color: "#000", background: "#fff", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, transition: "transform 0.2s" }} onMouseOver={e => e.currentTarget.style.transform = "scale(1.05)"} onMouseOut={e => e.currentTarget.style.transform = "scale(1)"}>
                {user ? "Enter Dashboard" : "Start Free Trial"} <ArrowRight size={18} />
              </button>
            </Link>
            <a href="#features">
              <button style={{ padding: "16px 32px", borderRadius: 12, fontSize: 16, fontWeight: 600, color: "#fff", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, transition: "background 0.2s" }} onMouseOver={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"} onMouseOut={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}>
                Explore Features
              </button>
            </a>
          </div>
        </motion.div>
      </section>

      {/* Bento Grid Features */}
      <section id="features" style={{ padding: "80px 24px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <h2 style={{ fontSize: 36, fontWeight: 700, letterSpacing: "-1px", marginBottom: 16 }}>Enterprise-grade tools, built for farmers.</h2>
          <p style={{ color: "#94a3b8", fontSize: 18, maxWidth: 600, margin: "0 auto" }}>Everything you need to monitor, analyze, and optimize your farm from anywhere in the world.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
          {/* Feature 1 */}
          <div style={{ background: "linear-gradient(145deg, rgba(30,41,59,0.5) 0%, rgba(15,23,42,0.5) 100%)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 24, padding: 32, gridColumn: "span 2 / span 2" }}>
            <Satellite size={32} color="#22c55e" style={{ marginBottom: 20 }} />
            <h3 style={{ fontSize: 24, fontWeight: 600, marginBottom: 12 }}>Sentinel-2 Satellite Integration</h3>
            <p style={{ color: "#94a3b8", fontSize: 16, lineHeight: 1.6, marginBottom: 24 }}>
              Get 10m resolution NDVI maps of your farm updated every 5 days. Detect crop stress weeks before it becomes visible to the naked eye.
            </p>
            <div style={{ width: "100%", height: 200, background: "#0f172a", borderRadius: 12, overflow: "hidden", position: "relative" }}>
               {/* Mock satellite visual */}
               <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "url('https://images.unsplash.com/photo-1593444458586-213fb46e12e1?auto=format&fit=crop&q=80&w=800') center/cover", opacity: 0.6, filter: "contrast(1.2) sepia(1) hue-rotate(80deg) saturate(3)" }} />
            </div>
          </div>

          {/* Feature 2 */}
          <div style={{ background: "linear-gradient(145deg, rgba(30,41,59,0.5) 0%, rgba(15,23,42,0.5) 100%)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 24, padding: 32 }}>
            <Bot size={32} color="#3b82f6" style={{ marginBottom: 20 }} />
            <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>Opus-level AI Assistant</h3>
            <p style={{ color: "#94a3b8", fontSize: 15, lineHeight: 1.6 }}>
              Chat with a swarm of 25 specialized AI agents trained on agronomy, weather, and market economics. Supports 23 Indian languages.
            </p>
          </div>

          {/* Feature 3 */}
          <div style={{ background: "linear-gradient(145deg, rgba(30,41,59,0.5) 0%, rgba(15,23,42,0.5) 100%)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 24, padding: 32 }}>
            <BarChart3 size={32} color="#f59e0b" style={{ marginBottom: 20 }} />
            <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>Live Market Analytics</h3>
            <p style={{ color: "#94a3b8", fontSize: 15, lineHeight: 1.6 }}>
              High-precision price predictions across all Indian districts. Know exactly when and where to sell for maximum profit.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: "40px 24px", borderTop: "1px solid rgba(255,255,255,0.05)", textAlign: "center", color: "#64748b", marginTop: 80 }}>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <Leaf size={16} /> <span style={{ fontWeight: 600 }}>Agri Nova Systems</span>
        </div>
        <p style={{ fontSize: 14 }}>© 2026 Agri Nova. All rights reserved. Built for the future of farming.</p>
      </footer>

      <ModuleAIAdvisor
        moduleId="home"
        moduleName="Platform Guide"
        moduleIcon="🌟"
        contextData={{
          isAuthenticated: !!user,
          viewingFeatures: true
        }}
      />
    </div>
  );
}

function SparklesIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
      <path d="M5 3v4"/>
      <path d="M19 17v4"/>
      <path d="M3 5h4"/>
      <path d="M17 19h4"/>
    </svg>
  );
}
