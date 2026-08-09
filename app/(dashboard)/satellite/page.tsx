"use client";
import { useState, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";
import ProLock from "@/components/ProLock";
import { motion, AnimatePresence } from "framer-motion";
import ModuleAIAdvisor from "@/components/ModuleAIAdvisor";

const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });

type Hotspot = {
  id: number;
  x: number;
  y: number;
  type: string;
  severity: string;
  message: string;
};

type TimelineData = {
  date: string;
  dateString: string;
  avg_ndvi: number;
  images: {
    ndvi: string;
    ndwi: string;
    ndsi: string;
  };
  hotspots: Hotspot[];
};

type NDVIResult = {
  stats: { 
    avg_ndvi: number; 
    yield_estimate: string; 
    yield_change: string; 
    worst_zone: string; 
    worst_ndvi: number;
    financial_risk: {
      potential_loss: string;
      cost_to_fix: string;
      net_roi: string;
    };
  };
  weather: string;
  advice: string;
  timeline: TimelineData[];
  trend: { date: string; ndvi: number }[];
  field: string;
  crop: string;
  bbox: number[];
};

export default function SatellitePage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<NDVIResult | null>(null);
  const [error, setError] = useState("");
  const [farmData, setFarmData] = useState<{location: string; landArea: string; crop: string; lat?: number; lng?: number} | null>(null);
  
  const [lens, setLens] = useState<"ndvi" | "ndwi" | "ndsi">("ndvi");
  const [timeIndex, setTimeIndex] = useState(0);

  // Action Report States
  const [activeReportHotspot, setActiveReportHotspot] = useState<Hotspot | null>(null);
  const [reportStatus, setReportStatus] = useState<"idle" | "generating" | "ready">("idle");
  const [reportOpen, setReportOpen] = useState(false);
  const [openTooltipId, setOpenTooltipId] = useState<number | null>(null);

  // Load farm data from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("farm_setup_data");
      if (stored) {
        const data = JSON.parse(stored);
        setFarmData(data);
      }
    } catch (e) {
      console.error("Failed to load farm data:", e);
    }
  }, []);

  const getBbox = () => {
    if (farmData?.lat && farmData?.lng) {
      const buffer = 0.05; 
      return [
        farmData.lng - buffer,
        farmData.lat - buffer,
        farmData.lng + buffer,
        farmData.lat + buffer
      ];
    }
    return [77.5, 12.8, 78.0, 13.2];
  };

  const analyzeField = useCallback(async () => {
    setLoading(true);
    setError("");
    setResult(null);
    setTimeIndex(0);
    setLens("ndvi");
    setReportStatus("idle");
    setReportOpen(false);
    
    const bbox = getBbox();
    const cropType = farmData?.crop || "Wheat";
    const fieldName = farmData?.location || "My Field";
    
    try {
      const res = await fetch("/api/satellite/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bbox: bbox,
          crop_type: cropType,
          field_name: fieldName,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || data.detail || "Analysis failed");
      }
      setResult(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [farmData]);

  const exportAnalysisData = () => {
    if (!result) return;
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert("Please allow popups to generate the report.");
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Agri Nova - Executive Satellite Report</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap');
          body { font-family: 'Inter', sans-serif; color: #1e293b; line-height: 1.6; padding: 0; margin: 0; background: #f8fafc; }
          .page { max-width: 850px; margin: 0 auto; background: white; padding: 40px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); min-height: 100vh; }
          .header { display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 20px; border-bottom: 4px solid #16a34a; margin-bottom: 30px; }
          .logo { font-size: 32px; font-weight: 800; color: #16a34a; letter-spacing: -1px; }
          .logo-sub { font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 2px; display: block; margin-top: 4px; }
          .meta-box { text-align: right; }
          .meta-title { font-size: 20px; font-weight: 800; color: #0f172a; margin-bottom: 12px; }
          .meta-grid { display: grid; grid-template-columns: auto auto; gap: 4px 16px; font-size: 13px; text-align: left; }
          .meta-label { color: #64748b; font-weight: 600; text-align: right; }
          .meta-value { color: #0f172a; font-weight: 600; }
          
          .hero-section { display: flex; gap: 20px; margin-bottom: 30px; }
          .hero-image { flex: 1; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; position: relative; }
          .hero-image img { width: 125%; height: 300px; object-fit: cover; object-position: left center; display: block; }
          .hero-image-overlay { position: absolute; bottom: 10px; left: 10px; background: rgba(15, 23, 42, 0.8); color: white; padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight: 600; }
          
          .metrics-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; flex: 1; }
          .metric-card { background: #f8fafc; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0; display: flex; flex-direction: column; justify-content: center; }
          .metric-label { font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 8px; letter-spacing: 0.5px; }
          .metric-val { font-size: 28px; font-weight: 800; color: #0f172a; }
          .metric-val.green { color: #16a34a; }
          .metric-val.red { color: #dc2626; }
          
          .section { margin-bottom: 30px; }
          .section-title { font-size: 18px; font-weight: 800; color: #0f172a; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
          .section-title::before { content: ''; display: block; width: 4px; height: 18px; background: #16a34a; border-radius: 2px; }
          
          .ai-box { background: #f0fdf4; border: 1px solid #bbf7d0; padding: 24px; border-radius: 12px; font-size: 14px; color: #166534; line-height: 1.8; }
          
          .hotspot-table { width: 100%; border-collapse: collapse; font-size: 14px; }
          .hotspot-table th { background: #f1f5f9; text-align: left; padding: 12px; color: #475569; font-weight: 600; font-size: 12px; text-transform: uppercase; border-bottom: 2px solid #cbd5e1; }
          .hotspot-table td { padding: 16px 12px; border-bottom: 1px solid #e2e8f0; vertical-align: top; }
          .severity-badge { background: #fee2e2; color: #dc2626; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: 700; text-transform: uppercase; }
          
          .footer { margin-top: 50px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 20px; }
          
          @media print {
            body { background: white; }
            .page { box-shadow: none; padding: 0; max-width: 100%; }
            button { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="page">
          <div class="header">
            <div>
              <div class="logo">Agri Nova</div>
              <div class="logo-sub">Agentic AI Intelligence</div>
            </div>
            <div class="meta-box">
              <div class="meta-title">Executive Satellite Report</div>
              <div class="meta-grid">
                <div class="meta-label">Date/Time:</div>
                <div class="meta-value">${new Date().toLocaleString()}</div>
                
                <div class="meta-label">Location:</div>
                <div class="meta-value">${farmData?.location || 'Unknown Field'}</div>
                
                <div class="meta-label">Coordinates:</div>
                <div class="meta-value">${result.bbox[0].toFixed(4)}°E, ${result.bbox[1].toFixed(4)}°N</div>
                
                <div class="meta-label">Target Crop:</div>
                <div class="meta-value">${farmData?.crop || 'Not Specified'}</div>
              </div>
            </div>
          </div>

          <div class="hero-section">
            <div class="hero-image">
              <img src="${currentTimeline?.images[lens] || currentTimeline?.images.ndvi}" alt="Satellite Scan" />
              <div class="hero-image-overlay">Resolution: 10m/px • Multi-Spectral SAR</div>
            </div>
            
            <div class="metrics-grid">
              <div class="metric-card">
                <div class="metric-label">Average NDVI</div>
                <div class="metric-val green">${result.stats.avg_ndvi}</div>
              </div>
              <div class="metric-card">
                <div class="metric-label">Projected Yield</div>
                <div class="metric-val">${result.stats.yield_estimate}</div>
              </div>
              <div class="metric-card">
                <div class="metric-label">AI Financial ROI</div>
                <div class="metric-val green">${result.stats.financial_risk.net_roi}</div>
              </div>
              <div class="metric-card" style="background: #fef2f2; border-color: #fecaca;">
                <div class="metric-label" style="color: #dc2626;">Potential Loss Risk</div>
                <div class="metric-val red">${result.stats.financial_risk.potential_loss}</div>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">AI Agronomist Diagnosis</div>
            <div class="ai-box">
              <strong>Executive Summary:</strong><br>
              ${result.advice.replace(/\n/g, '<br>')}
            </div>
          </div>

          <div class="section">
            <div class="section-title">Critical Intervention Zones (Hotspots)</div>
            <table class="hotspot-table">
              <thead>
                <tr>
                  <th style="width: 15%">Status</th>
                  <th style="width: 25%">Zone Classification</th>
                  <th style="width: 60%">AI Intervention Plan</th>
                </tr>
              </thead>
              <tbody>
                ${result.timeline[0]?.hotspots.map((h: any) => `
                  <tr>
                    <td><span class="severity-badge">Critical</span></td>
                    <td style="font-weight: 600; color: #0f172a;">${h.type}</td>
                    <td style="color: #475569;">${h.message}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <div class="footer">
            Report uniquely generated by Agri Nova Multi-Agent Swarm Framework.<br>
            CONFIDENTIAL • DO NOT DISTRIBUTE WITHOUT AUTHORIZATION
          </div>
        </div>
        <script>
          window.onload = () => { setTimeout(() => { window.print(); }, 500); };
        </script>
      </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  const generateReport = (hotspot: Hotspot) => {
    setActiveReportHotspot(hotspot);
    setReportStatus("generating");
    setTimeout(() => {
      setReportStatus("ready");
      setReportOpen(true);
    }, 1500); // Simulated AI generation time
  };

  const currentTimeline = result ? result.timeline[timeIndex] : null;

  const getLensColor = () => {
    if (lens === "ndvi") return "#22c55e"; // Green
    if (lens === "ndwi") return "#3b82f6"; // Blue
    return "#eab308"; // Yellow/Brown
  };

  const getLensTitle = () => {
    if (lens === "ndvi") return "NDVI (Crop Health)";
    if (lens === "ndwi") return "NDWI (Water Moisture)";
    return "NDSI (Soil Quality)";
  };

  return (
    <ProLock featureName="Pro Max Satellite Suite">
      <div>
        <div className="page-title">Actionable Satellite Intelligence</div>
        <div className="page-subtitle">Interactive multi-spectral imagery, financial risk engines, and AI intervention planning.</div>

        <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
          <button
            onClick={analyzeField}
            disabled={loading}
            style={{
              padding: "10px 24px",
              background: loading ? "#9ca3af" : "#22c55e",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              fontSize: 14,
            }}
          >
            {loading ? "Analyzing Field..." : "Deploy Satellite AI"}
          </button>
          
          {result && (
            <button
              onClick={exportAnalysisData}
              style={{
                padding: "10px 24px",
                background: "transparent",
                color: "#475569",
                border: "1px solid #cbd5e1",
                borderRadius: 8,
                fontWeight: 600,
                cursor: "pointer",
                fontSize: 14,
                display: "flex",
                alignItems: "center",
                gap: 8
              }}
            >
              📄 Export Analysis Report
            </button>
          )}
        </div>

        {error && <p style={{ color: "#ef4444", marginBottom: 20, fontSize: 13 }}>{error}</p>}

        {/* AI Agent for Satellite */}
        <div style={{ marginBottom: 20 }}>
          <ModuleAIAdvisor 
            moduleId="satellite" 
            moduleName="Satellite Analyst AI" 
            moduleIcon="🛰️" 
            contextData={result ? { 
              avg_ndvi: result.stats.avg_ndvi,
              yield_estimate: result.stats.yield_estimate,
              worst_zone: result.stats.worst_zone,
              hotspots_count: result.timeline[0]?.hotspots.length || 0,
              advice: result.advice
            } : { status: "Waiting for user to scan area" }} 
          />
        </div>

        {/* Top Metric Cards */}
        <div className="grid-3" style={{ marginBottom: 20 }}>
          {result && currentTimeline ? (
            <>
              <div className="card-sm" style={{ borderTop: `3px solid ${getLensColor()}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <div className="stat-label">Avg NDVI</div>
                  <span style={{ fontSize: 20 }}>🌿</span>
                </div>
                <div style={{ fontSize: 26, fontWeight: 700, color: getLensColor() }}>{currentTimeline.avg_ndvi}</div>
                <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>Date: {currentTimeline.dateString}</div>
              </div>
              <div className="card-sm" style={{ borderTop: "3px solid #8b5cf6", background: "linear-gradient(180deg, #ffffff 0%, #f3f4f6 100%)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <div className="stat-label">AI Financial ROI</div>
                  <span style={{ fontSize: 20 }}>💰</span>
                </div>
                <div style={{ fontSize: 22, fontWeight: 800, color: "#16a34a" }}>{result.stats.financial_risk.net_roi}</div>
                <div style={{ display: "flex", gap: 12, marginTop: 4, fontSize: 11, color: "#475569" }}>
                  <span>Risk: <span style={{color: "#ef4444", fontWeight: 600}}>{result.stats.financial_risk.potential_loss}</span></span>
                  <span>Cost: <span style={{color: "#374151", fontWeight: 600}}>{result.stats.financial_risk.cost_to_fix}</span></span>
                </div>
              </div>
              <div className="card-sm" style={{ borderTop: "3px solid #ef4444" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <div className="stat-label">Critical Hotspots</div>
                  <span style={{ fontSize: 20 }}>⚠️</span>
                </div>
                <div style={{ fontSize: 26, fontWeight: 700, color: "#ef4444" }}>{currentTimeline.hotspots.length}</div>
                <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>Requires immediate attention</div>
              </div>
            </>
          ) : (
            [
              { label: "Avg NDVI", value: "—", desc: "Run analysis to fetch", color: "#9ca3af", icon: "🌿" },
              { label: "AI Financial ROI", value: "—", desc: "Calculated risk & reward", color: "#9ca3af", icon: "💰" },
              { label: "Critical Hotspots", value: "—", desc: "Scanning field anomalies", color: "#9ca3af", icon: "⚠️" },
            ].map((c, i) => (
              <div key={i} className="card-sm" style={{ borderTop: `3px solid ${c.color}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <div className="stat-label">{c.label}</div>
                  <span style={{ fontSize: 20 }}>{c.icon}</span>
                </div>
                <div style={{ fontSize: 26, fontWeight: 700, color: c.color }}>{c.value}</div>
                <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>{c.desc}</div>
              </div>
            ))
          )}
        </div>

        {/* 4D Map Viewer */}
        <div className="card" style={{ marginBottom: 20, padding: 0, overflow: "hidden", border: "1px solid #1e293b", background: "#0f172a" }}>
          
          {/* Header & Lens Toggles */}
          <div style={{ padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #1e293b", background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)" }}>
            <div>
              <div className="section-title" style={{ margin: 0, color: "#f8fafc" }}>🛰️ {getLensTitle()}</div>
              <p style={{ margin: "4px 0 0 0", fontSize: 13, color: "#94a3b8" }}>{result ? currentTimeline?.dateString : "Ready to scan"} • 10m Resolution</p>
            </div>
            {result && (
              <div style={{ display: "flex", gap: 8, background: "#0f172a", padding: 4, borderRadius: 8, border: "1px solid #334155" }}>
                <button 
                  onClick={() => setLens("ndvi")}
                  style={{ padding: "6px 12px", background: lens === "ndvi" ? "#22c55e" : "transparent", color: lens === "ndvi" ? "white" : "#94a3b8", border: "none", borderRadius: 4, fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}
                >NDVI</button>
                <button 
                  onClick={() => setLens("ndwi")}
                  style={{ padding: "6px 12px", background: lens === "ndwi" ? "#3b82f6" : "transparent", color: lens === "ndwi" ? "white" : "#94a3b8", border: "none", borderRadius: 4, fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}
                >NDWI</button>
                <button 
                  onClick={() => setLens("ndsi")}
                  style={{ padding: "6px 12px", background: lens === "ndsi" ? "#eab308" : "transparent", color: lens === "ndsi" ? "white" : "#94a3b8", border: "none", borderRadius: 4, fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}
                >NDSI</button>
              </div>
            )}
          </div>
          
          {/* Image & Hotspots */}
          {result && currentTimeline ? (
            <div style={{ position: "relative", minHeight: 400, overflow: "hidden" }}>
              <AnimatePresence mode="wait">
                <motion.img
                  key={`${lens}-${timeIndex}`}
                  src={currentTimeline.images[lens]}
                  initial={{ opacity: 0.5, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0.5 }}
                  transition={{ duration: 0.4 }}
                  style={{ width: "125%", height: 400, objectFit: "cover", objectPosition: "left center", display: "block", filter: lens === "ndvi" ? "contrast(1.1) saturate(1.2)" : "contrast(1.2)" }}
                />
              </AnimatePresence>

              {/* Grid Overlay */}
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)", pointerEvents: "none" }} />
              
              {/* AI Hotspots */}
              {currentTimeline.hotspots.map(hotspot => (
                <div key={hotspot.id} className="hotspot-container" style={{ position: "absolute", top: `${hotspot.y}%`, left: `${hotspot.x}%`, zIndex: 10 }}
                     onClick={() => setOpenTooltipId(openTooltipId === hotspot.id ? null : hotspot.id)}>
                  <div className="hotspot-pulse"></div>
                  <div className="hotspot-dot"></div>
                  <div className="hotspot-tooltip" style={{
                    opacity: openTooltipId === hotspot.id ? 1 : 0,
                    visibility: openTooltipId === hotspot.id ? "visible" : "hidden",
                    pointerEvents: openTooltipId === hotspot.id ? "auto" : "none",
                    transform: openTooltipId === hotspot.id ? "translateY(0)" : "translateY(10px)"
                  }}>
                    <strong>{hotspot.type}</strong>
                    <p>{hotspot.message}</p>
                    <button 
                      onClick={(e) => { e.stopPropagation(); generateReport(hotspot); setOpenTooltipId(null); }}
                      style={{ marginTop: 10, width: "100%", padding: "6px 0", background: "#8b5cf6", color: "white", border: "none", borderRadius: 4, fontSize: 11, fontWeight: 600, cursor: "pointer" }}
                    >
                      {reportStatus === "generating" && activeReportHotspot?.id === hotspot.id ? "⏳ Generating..." : "⚡ Generate Treatment Plan"}
                    </button>
                  </div>
                </div>
              ))}

              {/* AI Treatment Plan Panel */}
              <AnimatePresence>
                {reportOpen && activeReportHotspot && (
                  <motion.div 
                    initial={{ x: 400, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 400, opacity: 0 }}
                    style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: 340, background: "rgba(15, 23, 42, 0.95)", backdropFilter: "blur(8px)", borderLeft: "1px solid #334155", zIndex: 30, display: "flex", flexDirection: "column" }}
                  >
                    <div style={{ padding: "16px 20px", borderBottom: "1px solid #334155", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ color: "#8b5cf6", fontSize: 10, fontWeight: 700, letterSpacing: 1, display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#8b5cf6", animation: "pulse-ring 2s infinite" }} />
                          AI INTERVENTION PLAN
                        </div>
                        <div style={{ color: "white", fontWeight: 600, marginTop: 4 }}>Zone Analysis - {activeReportHotspot.type}</div>
                      </div>
                      <button onClick={() => { setReportOpen(false); setReportStatus("idle"); }} style={{ background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: 20 }}>✕</button>
                    </div>
                    <div style={{ flex: 1, padding: 20, overflowY: "auto" }}>
                      
                      <div style={{ background: "rgba(139, 92, 246, 0.1)", border: "1px solid rgba(139, 92, 246, 0.3)", padding: 16, borderRadius: 8, marginBottom: 20 }}>
                        <div style={{ fontSize: 11, color: "#cbd5e1", fontWeight: 600, marginBottom: 8, textTransform: "uppercase" }}>Diagnosis</div>
                        <div style={{ color: "#f8fafc", fontSize: 14, lineHeight: 1.5 }}>
                          {activeReportHotspot.message}
                        </div>
                      </div>

                      <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600, marginBottom: 12, textTransform: "uppercase" }}>Recommended Treatment (Software Plan)</div>
                      
                      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        <div style={{ background: "#1e293b", padding: 12, borderRadius: 6, borderLeft: "3px solid #22c55e" }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: "#f8fafc" }}>Irrigation Schedule Optimization</div>
                          <div style={{ fontSize: 12, color: "#cbd5e1", marginTop: 4 }}>Decrease Zone C drip rate by 15% for 48 hours to resolve pooling.</div>
                        </div>
                        <div style={{ background: "#1e293b", padding: 12, borderRadius: 6, borderLeft: "3px solid #3b82f6" }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: "#f8fafc" }}>Biomass Threat Detected</div>
                          <div style={{ fontSize: 12, color: "#cbd5e1", marginTop: 4 }}>AI recommends application of Trichoderma viride at 2L/Acre.</div>
                        </div>
                        <div style={{ background: "#1e293b", padding: 12, borderRadius: 6, borderLeft: "3px solid #eab308" }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: "#f8fafc" }}>API Sync Ready</div>
                          <div style={{ fontSize: 12, color: "#cbd5e1", marginTop: 4 }}>Analysis data is ready for export via REST API to farm management systems.</div>
                        </div>
                      </div>

                      <button onClick={exportAnalysisData} style={{ width: "100%", marginTop: 24, padding: "10px 0", background: "#334155", color: "white", border: "1px solid #475569", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }} className="hover:bg-slate-600">
                        Export Analysis Report 📄
                      </button>

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Corner Info */}
              <div style={{ position: "absolute", bottom: 12, left: 12, background: "rgba(15, 23, 42, 0.9)", padding: "6px 10px", borderRadius: 4, border: "1px solid #334155", color: "#64748b", fontSize: 10 }}>
                📍 {result.bbox[0].toFixed(2)}°E, {result.bbox[1].toFixed(2)}°N
              </div>

            </div>
          ) : (
            <div className="satellite-scanner-container" style={{ minHeight: 400, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16, padding: 40 }}>
              {loading ? (
                <>
                  <div className="satellite-laser scanning" />
                  <div className="satellite-grid-overlay" />
                  <div style={{ fontSize: 64, zIndex: 20 }}>🛰️</div>
                  <div style={{ color: "#64748b", fontSize: 16, zIndex: 20, fontWeight: 600 }}>Initializing multi-spectral scanning...</div>
                </>
              ) : (
                <div style={{ maxWidth: 600, textAlign: "left", background: "rgba(30, 41, 59, 0.5)", padding: 30, borderRadius: 12, border: "1px solid #334155", zIndex: 20 }}>
                  <h3 style={{ color: "#f8fafc", marginTop: 0, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 24 }}>🛰️</span> How this feature works
                  </h3>
                  <p style={{ color: "#94a3b8", lineHeight: 1.6, marginBottom: 20 }}>
                    Agri Nova connects directly to Sentinel-2 satellites to provide 10-meter resolution, multi-spectral imagery of your exact farm coordinates.
                  </p>
                  <ul style={{ color: "#cbd5e1", paddingLeft: 20, lineHeight: 1.8, marginBottom: 24 }}>
                    <li><strong>Multi-Spectral Lenses:</strong> Switch between NDVI (Crop Health), NDWI (Water Moisture), and NDSI (Soil Salinity) to see what the human eye can't.</li>
                    <li><strong>4D Time-lapse:</strong> Drag the timeline slider at the bottom to see how your crop health has changed over the past 60 days.</li>
                    <li><strong>AI Intervention Planning:</strong> The AI automatically flags critical anomalies (red pulsing dots). Click them to instantly generate a step-by-step software treatment plan.</li>
                  </ul>
                  <button
                    onClick={analyzeField}
                    style={{
                      padding: "12px 24px",
                      background: "#22c55e",
                      color: "#fff",
                      border: "none",
                      borderRadius: 8,
                      fontWeight: 600,
                      cursor: "pointer",
                      fontSize: 14,
                      width: "100%",
                      boxShadow: "0 4px 12px rgba(34, 197, 94, 0.3)"
                    }}
                  >
                    Start Satellite Scan Now
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Timeline Slider */}
          {result && (
            <div style={{ padding: "20px", background: "#1e293b", borderTop: "1px solid #334155" }}>
              <div style={{ display: "flex", justifyContent: "space-between", color: "#94a3b8", fontSize: 12, fontWeight: 600, marginBottom: 8 }}>
                <span>Historical Data (4D View)</span>
                <span>{currentTimeline?.dateString}</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max={result.timeline.length - 1} 
                value={result.timeline.length - 1 - timeIndex} 
                onChange={(e) => {
                  setTimeIndex(result.timeline.length - 1 - parseInt(e.target.value));
                }}
                style={{ width: "100%", accentColor: "#22c55e", cursor: "pointer" }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", color: "#64748b", fontSize: 10, marginTop: 4 }}>
                {result.timeline.slice().reverse().map((t, i) => (
                  <span key={i}>{t.date}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {result?.advice && (
          <div className="card" style={{ marginBottom: 20, borderLeft: "4px solid #22c55e" }}>
            <div className="section-title">AI Agronomist Advice</div>
            <div style={{ fontSize: 14, lineHeight: 1.7, whiteSpace: "pre-wrap", color: "#374151" }}>
              {result.advice}
            </div>
          </div>
        )}

        <div className="card" style={{ marginBottom: 20 }}>
          <div className="section-title">Historical NDVI Trend</div>
          {result ? (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={result.trend}>
                <defs>
                  <linearGradient id="ndviG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} domain={[0, 1]} />
                <RechartsTooltip contentStyle={{ borderRadius: 8, border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", fontSize: 12 }} />
                <Area type="monotone" dataKey="ndvi" stroke="#22c55e" strokeWidth={2} fill="url(#ndviG)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center", color: "#9ca3af" }}>Deploy AI to see trend</div>
          )}
        </div>
        
        {/* CSS for Hotspots & Sliders */}
        <style>{`
          .hotspot-container {
            position: absolute;
            cursor: pointer;
            margin-top: -5px;
            margin-left: -5px;
          }
          .hotspot-pulse {
            position: absolute;
            top: -10px;
            left: -10px;
            width: 30px;
            height: 30px;
            background: rgba(239, 68, 68, 0.4);
            border-radius: 50%;
            animation: pulse-ring 2s infinite;
          }
          .hotspot-dot {
            position: absolute;
            top: 0;
            left: 0;
            width: 10px;
            height: 10px;
            background: #ef4444;
            border-radius: 50%;
            box-shadow: 0 0 8px #ef4444, 0 0 15px #ef4444;
          }
          .hotspot-tooltip {
            position: absolute;
            bottom: 25px;
            left: -100px;
            width: 220px;
            background: #1e293b;
            color: #f8fafc;
            padding: 12px;
            border-radius: 8px;
            font-size: 12px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.5);
            border: 1px solid #334155;
            transition: all 0.2s;
            z-index: 50;
          }
          .hotspot-tooltip strong {
            display: block;
            color: #ef4444;
            margin-bottom: 4px;
            font-size: 13px;
          }
          .hotspot-tooltip p {
            margin: 0;
            line-height: 1.4;
          }
          @keyframes pulse-ring {
            0% { transform: scale(0.33); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.6); }
            80%, 100% { transform: scale(2); box-shadow: 0 0 0 20px rgba(239, 68, 68, 0); }
          }
          
          /* Custom Slider Styling */
          input[type=range] {
            -webkit-appearance: none; 
            background: transparent; 
          }
          input[type=range]::-webkit-slider-thumb {
            -webkit-appearance: none;
            height: 16px;
            width: 16px;
            border-radius: 50%;
            background: #22c55e;
            cursor: pointer;
            margin-top: -6px;
            box-shadow: 0 0 10px rgba(34, 197, 94, 0.8);
            transition: transform 0.1s;
          }
          input[type=range]::-webkit-slider-thumb:hover {
            transform: scale(1.2);
          }
          input[type=range]::-webkit-slider-runnable-track {
            width: 100%;
            height: 4px;
            cursor: pointer;
            background: #334155;
            border-radius: 2px;
          }
        `}</style>

      </div>
    </ProLock>
  );
}
