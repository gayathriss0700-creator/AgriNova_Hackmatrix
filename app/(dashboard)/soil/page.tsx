"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Wifi, RefreshCw, CheckCircle2, AlertTriangle, Smartphone, Bot, PlayCircle } from "lucide-react";
import ModuleAIAdvisor from "@/components/ModuleAIAdvisor";

const NutrientRadarChart = dynamic(() => import("@/components/NutrientRadarChart"), {
  ssr: false,
  loading: () => <div className="skeleton" style={{ height: 320 }} />
});

const radarData = [
  { subject: "N", A: 78, fullMark: 100 },
  { subject: "P", A: 42, fullMark: 100 },
  { subject: "K", A: 95, fullMark: 100 },
  { subject: "pH", A: 68, fullMark: 100 },
  { subject: "OC", A: 70, fullMark: 100 },
  { subject: "Moisture", A: 38, fullMark: 100 },
];

// Removed static recommendations array

export default function SoilPage() {
  const [analyzing, setAnalyzing] = useState(false);
  const [messages, setMessages] = useState<{agent: string, role: string, text: string}[]>([]);
  const [recommendations, setRecommendations] = useState([
    { icon: "⏳", title: "System Standing By", desc: "Swarm AI is currently idle. Waiting for user command to initiate soil analysis.", priority: "medium" },
    { icon: "📡", title: "Satellite Data Synced", desc: "Latest SAR multi-spectral imagery acquired. Ready for Agentic processing.", priority: "low" },
    { icon: "🤖", title: "25 Agents Available", desc: "The full Agentic Swarm is online and ready to debate optimal crop interventions.", priority: "low" },
  ]);
  
  const runAgenticAnalysis = () => {
    setAnalyzing(true);
    setMessages([]);
    
    const script = [
      { agent: "Data Aggregation Agent", role: "Database Sync", text: "Pulling latest environmental profile for active field. Current moisture levels detected at 38% (Critical)." },
      { agent: "Hydrologist Agent", role: "Water Management", text: "Received moisture data. Analyzing 10-year historical evaporation rates. Current deficit requires immediate 15mm irrigation to prevent crop stress." },
      { agent: "Chemist Agent", role: "Nutrient Specialist", text: "Hold on. NPK levels are 78/42/95. The low moisture is preventing optimal Nitrogen absorption. We cannot just add water; we need to buffer the pH first." },
      { agent: "Master Agronomist Agent", role: "Lead Decision Maker", text: "Consensus reached. Generating optimal treatment plan: 1) Apply 2L/Acre soil pH buffer. 2) Follow with 15mm localized drip irrigation." }
    ];

    script.forEach((msg, index) => {
      setTimeout(() => {
        setMessages(prev => [...prev, msg]);
      }, (index + 1) * 1800);
    });

    setTimeout(() => {
      setAnalyzing(false);
      setRecommendations([
        { icon: "🧪", title: "ACTION REQUIRED: pH Buffer", desc: "Apply 2L/Acre soil pH buffer immediately. Current moisture deficit is blocking Nitrogen absorption.", priority: "high" },
        { icon: "💧", title: "ACTION REQUIRED: 15mm Irrigation", desc: "Follow pH buffer with 15mm localized drip irrigation to normalize soil evaporation rates.", priority: "high" },
        { icon: "🛑", title: "HALT: Nitrogen Fertilisation", desc: "Do not apply additional Nitrogen. Existing 78 kg/ha is sufficient once pH is buffered.", priority: "low" },
      ]);
    }, (script.length + 1) * 1800);
  };

  const soilProfile = [
    { label: "Nitrogen (N)", value: 78, ideal: "60–90 kg/ha", status: "good", unit: "kg/ha" },
    { label: "Phosphorus (P)", value: 42, ideal: "30–60 kg/ha", status: "good", unit: "kg/ha" },
    { label: "Potassium (K)", value: 95, ideal: "80–120 kg/ha", status: "good", unit: "kg/ha" },
    { label: "Moisture", value: 38, ideal: "40–60%", status: "low", unit: "%" },
    { label: "pH Level", value: 6.8, ideal: "6.0–7.5", status: "good", unit: "" },
    { label: "Organic C.", value: 2.1, ideal: "1.5–3.0%", status: "good", unit: "%" },
  ];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
        <div>
          <div className="page-title" style={{ marginBottom: 4 }}>AI Soil Analytics (Satellite-Derived)</div>
          <div className="page-subtitle" style={{ marginBottom: 0 }}>Multi-agent swarm intelligence for soil parameter estimation and intervention planning</div>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <ModuleAIAdvisor 
            moduleId="soil" 
            moduleName="Agronomist" 
            moduleIcon="🌱" 
            contextData={{
              radarData,
              soilProfile,
              recommendations
            }}
          />
        <button 
          onClick={runAgenticAnalysis}
          disabled={analyzing}
          style={{
            padding: "10px 24px",
            background: analyzing ? "#334155" : "linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            fontWeight: 600,
            cursor: analyzing ? "not-allowed" : "pointer",
            fontSize: 14,
            display: "flex",
            alignItems: "center",
            gap: 8,
            boxShadow: analyzing ? "none" : "0 4px 12px rgba(139, 92, 246, 0.4)",
            transition: "all 0.3s"
          }}
        >
          {analyzing ? <RefreshCw size={18} className="spin" /> : <PlayCircle size={18} />}
          {analyzing ? "Swarm AI Analyzing..." : "Run 25-Agent Swarm Analysis"}
        </button>
        </div>
      </div>

      {/* Agentic AI Terminal */}
      {(analyzing || messages.length > 0) && (
        <div className="card" style={{ marginBottom: 20, background: "#0f172a", border: "1px solid #1e293b", padding: 0, overflow: "hidden" }}>
          <div style={{ background: "#1e293b", padding: "12px 20px", fontSize: 12, fontWeight: 700, color: "#cbd5e1", borderBottom: "1px solid #334155", display: "flex", alignItems: "center", gap: 8 }}>
            <Bot size={16} color="#8b5cf6" />
            LIVE AGENTIC SWARM FEED
          </div>
          <div style={{ padding: 20, minHeight: 120, display: "flex", flexDirection: "column", gap: 12 }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: "flex", gap: 12, animation: "fadeInUp 0.4s ease-out" }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(139, 92, 246, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: "1px solid rgba(139, 92, 246, 0.3)" }}>
                  <Bot size={18} color="#a78bfa" />
                </div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#a78bfa" }}>{m.agent}</span>
                    <span style={{ fontSize: 10, color: "#64748b", background: "#1e293b", padding: "2px 6px", borderRadius: 4 }}>{m.role}</span>
                  </div>
                  <div style={{ fontSize: 13, color: "#e2e8f0", lineHeight: 1.5 }}>
                    {m.text}
                  </div>
                </div>
              </div>
            ))}
            {analyzing && (
              <div style={{ display: "flex", gap: 12, animation: "fadeInUp 0.4s ease-out" }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(51, 65, 85, 0.5)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <RefreshCw size={14} color="#64748b" className="spin" />
                </div>
                <div style={{ fontSize: 13, color: "#64748b", display: "flex", alignItems: "center" }}>
                  Agents are communicating...
                </div>
              </div>
            )}
            {!analyzing && messages.length > 0 && (
              <div style={{ marginTop: 12, padding: "12px 16px", background: "rgba(34, 197, 94, 0.1)", border: "1px solid rgba(34, 197, 94, 0.2)", borderRadius: 8, color: "#22c55e", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 8, animation: "fadeInUp 0.4s ease-out" }}>
                <CheckCircle2 size={18} /> Swarm Consensus Reached. Treatment plan generated below.
              </div>
            )}
          </div>
        </div>
      )}

      <div className="grid-3" style={{ marginBottom: 20 }}>
        {soilProfile.map((s) => {
          const pct = Math.min(100, s.label === "pH Level" ? ((s.value - 4) / 4) * 100 : s.label === "Organic C." ? s.value * 30 : s.value);
          const color = s.status === "good" ? "#22c55e" : s.status === "low" ? "#eab308" : "#ef4444";
          return (
            <div key={s.label} className="card-sm" style={{ position: "relative", overflow: "hidden" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#1f2937", display: "flex", alignItems: "center", gap: 6 }}>
                  {s.label}
                </div>
                <span className={`badge ${s.status === "good" ? "badge-green" : "badge-yellow"}`}>{s.status}</span>
              </div>
              <div style={{ fontSize: 22, fontWeight: 700, color: "#111827", marginBottom: 4 }}>
                {s.value}{s.unit}
              </div>
              <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 8 }}>Ideal: {s.ideal}</div>
              <div style={{ height: 5, borderRadius: 3, background: "#f0f0f0" }}>
                <div style={{ height: "100%", borderRadius: 3, background: color, width: `${pct}%`, transition: "width 1s ease" }} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid-2" style={{ marginBottom: 20 }}>
        <div className="card">
          <div className="section-title">Nutrient Balance Radar</div>
          <NutrientRadarChart data={radarData} />
        </div>

        <div className="card">
          <div className="section-title">AI Soil Recommendations</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {recommendations.map((r, i) => (
              <div key={i} className={`alert-item alert-item-${r.priority === "high" ? "red" : r.priority === "medium" ? "yellow" : "green"}`}>
                <span style={{ fontSize: 24 }}>{r.icon}</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#1f2937" }}>{r.title}</div>
                  <div style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>{r.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scan {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}} />
    </div>
  );
}
