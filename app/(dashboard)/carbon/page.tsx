"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, Legend } from "recharts";
import ProLock from "@/components/ProLock";
import { motion, AnimatePresence } from "framer-motion";
import ModuleAIAdvisor from "@/components/ModuleAIAdvisor";

// Sample Data for Carbon Accumulation over years
const carbonData = [
  { year: "2020", soc: 1.2, sequestered: 320 },
  { year: "2021", soc: 1.4, sequestered: 450 },
  { year: "2022", soc: 1.7, sequestered: 710 },
  { year: "2023", soc: 2.1, sequestered: 1050 },
  { year: "2024", soc: 2.6, sequestered: 1450 },
  { year: "2025", soc: 3.2, sequestered: 1980 },
  { year: "2026", soc: 3.8, sequestered: 2450 },
];

export default function CarbonCreditsPage() {
  const [loading, setLoading] = useState(false);
  const [synced, setSynced] = useState(false);
  const [executingExchange, setExecutingExchange] = useState(false);
  const [listed, setListed] = useState(false);
  
  // Stats
  const carbonPricePerTon = 2500; // INR
  const totalSequestered = carbonData[carbonData.length - 1].sequestered;
  const estimatedValue = totalSequestered * carbonPricePerTon;

  const handleAnalyze = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSynced(true);
    }, 2000);
  };

  const handleListMarketplace = () => {
    setExecutingExchange(true);
    setTimeout(() => {
      setExecutingExchange(false);
      setListed(true);
    }, 1500);
  };

  return (
    <ProLock featureName="Pro Max Carbon Engine">
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div>
            <div className="page-title">Carbon Sequestration Engine</div>
            <div className="page-subtitle">Track Soil Organic Carbon (SOC), verify carbon credits, and monetize your regenerative farming practices.</div>
          </div>
          <ModuleAIAdvisor 
            moduleId="carbon" 
            moduleName="Sustainability Auditor" 
            moduleIcon="🍃" 
            contextData={{
              totalSequestered,
              estimatedValue,
              carbonPricePerTon,
              synced
            }}
          />
        </div>

        <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
          <button
            onClick={handleAnalyze}
            disabled={loading || synced}
            style={{
              padding: "10px 24px",
              background: loading ? "#9ca3af" : synced ? "#334155" : "#10b981",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              fontWeight: 600,
              cursor: loading || synced ? "not-allowed" : "pointer",
              fontSize: 14,
              transition: "all 0.2s"
            }}
          >
            {loading ? "Aggregating Satellite & AI Data..." : synced ? "Analysis Complete & Verified ✓" : "Run Carbon AI Model"}
          </button>
        </div>

        {/* Top Metric Cards */}
        <div className="grid-3" style={{ marginBottom: 32 }}>
          <div className="card-sm" style={{ borderTop: "4px solid #10b981", position: "relative", overflow: "hidden", boxShadow: "0 4px 15px rgba(0,0,0,0.05)" }}>
            <div style={{ position: "absolute", top: -10, right: -10, fontSize: 80, opacity: 0.05 }}>🍃</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div className="stat-label">Total Verified Carbon</div>
              {synced && <span style={{ fontSize: 10, background: "rgba(16,185,129,0.15)", color: "#10b981", padding: "4px 8px", borderRadius: 4, fontWeight: 800, letterSpacing: 0.5 }}>VCS VERIFIED</span>}
            </div>
            <div style={{ fontSize: 36, fontWeight: 800, color: "#10b981", letterSpacing: "-1px" }}>
              {synced ? totalSequestered.toLocaleString() : "—"} <span style={{ fontSize: 16, fontWeight: 600, color: "var(--text-secondary, #64748b)", letterSpacing: "0px" }}>Tons CO₂e</span>
            </div>
            <div style={{ fontSize: 13, color: "#10b981", marginTop: 8, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: "#10b981", boxShadow: "0 0 10px rgba(16,185,129,0.5)" }}></span>
              +470 Tons sequestered this year
            </div>
          </div>
          
          <div className="card-sm" style={{ borderTop: "4px solid #f59e0b", position: "relative", overflow: "hidden", boxShadow: "0 4px 15px rgba(0,0,0,0.05)" }}>
            <div style={{ position: "absolute", top: -10, right: -10, fontSize: 80, opacity: 0.05, fontWeight: "bold" }}>₹</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div className="stat-label">Current Market Value</div>
              <span style={{ fontSize: 20 }}>📈</span>
            </div>
            <div style={{ fontSize: 36, fontWeight: 800, color: "#f59e0b", letterSpacing: "-1px" }}>
              {synced ? `₹${(estimatedValue / 100000).toFixed(2)}L` : "—"}
            </div>
            <div style={{ fontSize: 13, color: "var(--text-secondary, #64748b)", marginTop: 8, display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ opacity: 0.7 }}>Live Trading:</span> <strong style={{ color: "var(--text-primary, #0f172a)" }}>₹2,500 / Ton</strong> (Indigo Ag)
            </div>
          </div>
          
          <div className="card-sm" style={{ borderTop: "4px solid #3b82f6", position: "relative", overflow: "hidden", boxShadow: "0 4px 15px rgba(0,0,0,0.05)" }}>
            <div style={{ position: "absolute", top: -10, right: -10, fontSize: 80, opacity: 0.05 }}>🪨</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div className="stat-label">Soil Organic Carbon (SOC)</div>
              <span style={{ fontSize: 20 }}>📊</span>
            </div>
            <div style={{ fontSize: 36, fontWeight: 800, color: "#3b82f6", letterSpacing: "-1px" }}>
              {synced ? "3.8%" : "—"}
            </div>
            {synced && (
              <div style={{ marginTop: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--text-secondary, #64748b)", marginBottom: 4, fontWeight: 600 }}>
                  <span>Depleted</span>
                  <span style={{ color: "#3b82f6" }}>Optimal</span>
                  <span>Excess</span>
                </div>
                <div style={{ width: "100%", height: 6, background: "rgba(59, 130, 246, 0.1)", borderRadius: 3, overflow: "hidden" }}>
                  <motion.div initial={{ width: 0 }} animate={{ width: "76%" }} transition={{ duration: 1.5, ease: "easeOut" }} style={{ height: "100%", background: "linear-gradient(90deg, #3b82f6, #60a5fa)", borderRadius: 3 }} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Charts & Marketplace Section */}
        {synced && (
          <AnimatePresence>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid-2"
            >
              {/* Left Column: Charts */}
              <div className="card" style={{ padding: 24 }}>
                <h3 style={{ margin: "0 0 4px 0", color: "var(--text-primary, #0f172a)", fontSize: 18, display: "flex", alignItems: "center", gap: 8 }}>
                  Historical Carbon Accumulation
                </h3>
                <p style={{ color: "var(--text-secondary, #64748b)", fontSize: 13, marginBottom: 24 }}>Cumulative tons of CO₂e sequestered since 2020.</p>
                
                <div style={{ height: 300, width: "100%" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={carbonData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorCarbon" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color, #e2e8f0)" vertical={false} />
                      <XAxis dataKey="year" stroke="var(--text-secondary, #64748b)" tick={{ fill: 'var(--text-secondary, #64748b)', fontSize: 12 }} axisLine={false} tickLine={false} />
                      <YAxis stroke="var(--text-secondary, #64748b)" tick={{ fill: 'var(--text-secondary, #64748b)', fontSize: 12 }} axisLine={false} tickLine={false} />
                      <RechartsTooltip 
                        contentStyle={{ backgroundColor: "var(--bg-card, #fff)", border: "1px solid var(--border-color, #e2e8f0)", borderRadius: 8, color: "var(--text-primary, #0f172a)", boxShadow: "0 4px 15px rgba(0,0,0,0.1)" }}
                        itemStyle={{ color: "#10b981", fontWeight: "bold" }}
                      />
                      <Area type="monotone" dataKey="sequestered" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorCarbon)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Right Column: Marketplace Integration */}
              <div className="card" style={{ padding: 24, display: "flex", flexDirection: "column" }}>
                <h3 style={{ margin: "0 0 4px 0", color: "var(--text-primary, #0f172a)", fontSize: 18, display: "flex", alignItems: "center", gap: 8 }}>
                  Carbon Marketplace
                </h3>
                <p style={{ color: "var(--text-secondary, #64748b)", fontSize: 13, marginBottom: 24 }}>Connect your verified credits to global buyers.</p>
                
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
                  {/* Indigo Ag Integration */}
                  <div style={{ background: listed ? "#ecfdf5" : "var(--bg-card, #fff)", border: listed ? "1px solid #10b981" : "1px solid var(--border-color, #e2e8f0)", borderRadius: 16, padding: 24, boxShadow: "0 2px 10px rgba(0,0,0,0.02)", transition: "all 0.3s" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                        <div style={{ width: 48, height: 48, borderRadius: 12, background: listed ? "#10b981" : "#0f172a", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "900", color: "#fff", fontSize: 24, boxShadow: "0 4px 10px rgba(0,0,0,0.1)", transition: "all 0.3s" }}>I</div>
                        <div>
                          <div style={{ color: "var(--text-primary, #0f172a)", fontWeight: 700, fontSize: 18, display: "flex", alignItems: "center", gap: 8 }}>Indigo Ag Carbon {listed && <span style={{ color: "#10b981", fontSize: 18 }}>✓</span>}</div>
                          <div style={{ color: listed ? "#10b981" : "#22c55e", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
                            {!listed && <span style={{ width: 6, height: 6, background: "#22c55e", borderRadius: "50%", display: "inline-block", boxShadow: "0 0 8px #22c55e" }}></span>}
                            {listed ? "Contract Settled" : "Live Bid: Active"}
                          </div>
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ color: "var(--text-primary, #0f172a)", fontWeight: 800, fontSize: 24, letterSpacing: "-0.5px" }}>₹2,500</div>
                        <div style={{ color: "var(--text-secondary, #64748b)", fontSize: 12, fontWeight: 500 }}>per Ton CO₂e</div>
                      </div>
                    </div>
                    
                    <div style={{ background: listed ? "white" : "rgba(59, 130, 246, 0.05)", border: listed ? "1px solid #a7f3d0" : "1px solid rgba(59, 130, 246, 0.1)", padding: 20, borderRadius: 12, marginBottom: 20 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, alignItems: "center" }}>
                        <span style={{ color: "var(--text-secondary, #64748b)", fontSize: 14, fontWeight: 500 }}>{listed ? "Remaining Eligible Credits:" : "Eligible Verified Credits:"}</span>
                        <span style={{ color: listed ? "#ef4444" : "var(--text-primary, #0f172a)", fontWeight: 700, fontSize: 16 }}>{listed ? "0 Tons" : "2,450 Tons"}</span>
                      </div>
                      <div style={{ height: 1, background: "var(--border-color, #e2e8f0)", width: "100%", margin: "12px 0" }}></div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ color: "var(--text-secondary, #64748b)", fontSize: 14, fontWeight: 500 }}>{listed ? "Bank Transfer Initiated:" : "Estimated Bank Transfer:"}</span>
                        <span style={{ color: "#10b981", fontWeight: 800, fontSize: 22 }}>₹61,25,000</span>
                      </div>
                    </div>

                    <button
                      onClick={handleListMarketplace}
                      disabled={listed || executingExchange}
                      style={{
                        width: "100%",
                        padding: "14px 0",
                        background: listed ? "#10b981" : executingExchange ? "#94a3b8" : "linear-gradient(90deg, #3b82f6, #2563eb)",
                        color: "#fff",
                        border: "none",
                        borderRadius: 10,
                        fontWeight: 700,
                        fontSize: 15,
                        cursor: listed || executingExchange ? "default" : "pointer",
                        transition: "all 0.3s",
                        boxShadow: listed || executingExchange ? "none" : "0 4px 15px rgba(37, 99, 235, 0.3)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: 8
                      }}
                    >
                      {executingExchange && (
                          <div style={{
                            width: 16, height: 16, border: "2px solid white", borderTopColor: "transparent",
                            borderRadius: "50%", animation: "spin 1s linear infinite"
                          }} />
                        )}
                      {listed ? "✓ 2,450 Tons Transferred to Indigo Ag" : executingExchange ? "Executing Exchange Contract..." : "Execute Smart Contract & Sell"}
                    </button>
                  </div>
                  
                  {/* Nori Integration */}
                  <div style={{ background: "var(--bg-body, #f8fafc)", border: "1px dashed var(--border-color, #cbd5e1)", borderRadius: 16, padding: 20, opacity: listed ? 0.3 : 0.8, transition: "opacity 0.5s" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                        <div style={{ width: 40, height: 40, borderRadius: 10, background: "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", color: "#64748b", fontSize: 16 }}>N</div>
                        <div>
                          <div style={{ color: "var(--text-primary, #334155)", fontWeight: 600, fontSize: 15 }}>Nori Marketplace</div>
                          <div style={{ color: "var(--text-secondary, #64748b)", fontSize: 13 }}>{listed ? "Auction Closed" : "₹2,100 / Ton (Outbid by Indigo Ag)"}</div>
                        </div>
                      </div>
                      <button disabled={true} style={{ padding: "8px 16px", background: "transparent", border: "1px solid var(--border-color, #cbd5e1)", color: "var(--text-secondary, #64748b)", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "not-allowed" }}>
                        {listed ? "Closed" : "Connect"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        )}

      </div>
    </ProLock>
  );
}
