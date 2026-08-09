"use client";
import { useState, useEffect } from "react";
import { Brain, Shield, AlertTriangle, CheckCircle2, ChevronDown, ChevronUp, Satellite, Thermometer, Droplets, Bug, Leaf, Activity, Zap, BarChart3 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ModuleAIAdvisor from "@/components/ModuleAIAdvisor";

/* ─── Types ─── */
interface XAIPrediction {
  id: string;
  category: string;
  icon: string;
  prediction: string;
  confidence: number;
  riskLevel: "low" | "medium" | "high" | "critical";
  reason: string;
  environmentalIndicators: { label: string; value: string; status: "good" | "warning" | "danger" }[];
  historicalComparison: string;
  satelliteEvidence: string;
  weatherEvidence: string;
  soilEvidence: string;
  aiExplanation: string;
  color: string;
}

/* ─── Prediction Data ─── */
const predictions: XAIPrediction[] = [
  {
    id: "disease", category: "Disease Detection", icon: "🦠",
    prediction: "Leaf Blight", confidence: 96,
    riskLevel: "high",
    reason: "High humidity combined with warm temperatures creates optimal conditions for fungal pathogen proliferation. Leaf texture analysis shows early-stage lesion formation patterns.",
    environmentalIndicators: [
      { label: "Humidity", value: "89%", status: "danger" },
      { label: "Temperature", value: "31°C", status: "warning" },
      { label: "Leaf Wetness", value: "12h", status: "danger" },
      { label: "Wind Speed", value: "8 km/h", status: "good" },
    ],
    historicalComparison: "Similar conditions in Kharif 2024 led to 40% crop loss in adjacent farms. Current onset is 2 weeks earlier than last year.",
    satelliteEvidence: "Sentinel-2 NDVI dropped from 0.82 to 0.71 in the northern quadrant over 10 days. EVI anomaly detected at -0.15 standard deviations.",
    weatherEvidence: "3 consecutive days of >85% humidity with overnight temperatures not dropping below 25°C. No rain forecast for 5 days.",
    soilEvidence: "Soil pH at 6.2 (slightly acidic), organic matter at 2.1%. Waterlogged patches detected in low-lying areas of Field B.",
    aiExplanation: "Our ensemble model (Random Forest + CNN) analyzed 847 similar historical cases across Tamil Nadu. The combination of prolonged leaf wetness (>8h), high relative humidity (>85%), and moderate temperature (28-33°C) has a 96% correlation with Leaf Blight onset within 5-7 days. Satellite multispectral analysis confirms vegetation stress patterns consistent with early fungal infection.",
    color: "#dc2626",
  },
  {
    id: "pest", category: "Pest Risk Assessment", icon: "🐛",
    prediction: "Fall Armyworm (FAW)", confidence: 89,
    riskLevel: "high",
    reason: "Dry spell followed by humidity spike creates ideal microclimate for Fall Armyworm egg hatching and larval development in maize crops.",
    environmentalIndicators: [
      { label: "Humidity", value: "72%", status: "warning" },
      { label: "Temperature", value: "28°C", status: "warning" },
      { label: "Dry Days", value: "5 days", status: "danger" },
      { label: "Moon Phase", value: "Waning", status: "good" },
    ],
    historicalComparison: "FAW outbreaks in this region typically peak in August. Current pheromone trap counts are 3x above seasonal average.",
    satelliteEvidence: "SAR imagery shows irregular canopy density patterns in 2.1 ha of the maize field. Spectral signature consistent with larval feeding damage.",
    weatherEvidence: "Temperature oscillation between 25-32°C with evening dew formation provides optimal conditions for moth flight and oviposition.",
    soilEvidence: "Well-drained soil after dry spell allows pupation. No nematode biocontrol agents detected in recent soil samples.",
    aiExplanation: "The pest risk model incorporates real-time pheromone trap data, satellite canopy analysis, and a 5-year regional outbreak database. Pattern matching indicates 89% probability of significant FAW infestation within 10 days. The model recommends immediate deployment of pheromone traps and preventive Neem oil application.",
    color: "#f59e0b",
  },
  {
    id: "yield", category: "Yield Quality Prediction", icon: "🌾",
    prediction: "Grade A Quality Expected", confidence: 85,
    riskLevel: "low",
    reason: "Current growth trajectory, NDVI values, and soil nutrient levels indicate above-average grain filling and quality parameters.",
    environmentalIndicators: [
      { label: "NDVI Avg", value: "0.76", status: "good" },
      { label: "GDD", value: "1850°C", status: "good" },
      { label: "N Uptake", value: "92 kg/ha", status: "good" },
      { label: "Grain Fill", value: "78%", status: "good" },
    ],
    historicalComparison: "Current season NDVI is 8% above the 5-year average. Yield trajectory exceeds last Kharif by 12%.",
    satelliteEvidence: "Time-series NDVI shows consistent upward trend during vegetative phase. Peak biomass achieved 5 days ahead of schedule.",
    weatherEvidence: "Adequate rainfall during critical growth stages. No heat stress events recorded during flowering period.",
    soilEvidence: "NPK levels within optimal range. pH stable at 6.8. Organic carbon at 0.8% supports healthy microbial activity.",
    aiExplanation: "Yield quality model integrates NDVI time-series, Growing Degree Days (GDD), soil nutrient availability, and weather patterns during critical phenological stages. The model predicts Grade A quality with 85% confidence based on 342 similar historical season profiles in the region.",
    color: "#16a34a",
  },
  {
    id: "irrigation", category: "Irrigation Intelligence", icon: "💧",
    prediction: "Immediate Irrigation Required", confidence: 92,
    riskLevel: "medium",
    reason: "Soil moisture has fallen below the critical threshold for the current growth stage. Evapotranspiration rate exceeds natural replenishment.",
    environmentalIndicators: [
      { label: "Soil Moisture", value: "35%", status: "danger" },
      { label: "ET Rate", value: "6.2 mm/day", status: "warning" },
      { label: "Root Depth", value: "45 cm", status: "good" },
      { label: "Rainfall (7d)", value: "0 mm", status: "danger" },
    ],
    historicalComparison: "Moisture levels are 15% below the optimal range for this growth stage compared to successful harvests.",
    satelliteEvidence: "NDWI (Normalized Difference Water Index) shows progressive decline from 0.28 to 0.15 over the last 15 days.",
    weatherEvidence: "No significant rainfall expected for the next 7 days. Daytime temperatures averaging 33°C increase water demand.",
    soilEvidence: "Sandy loam soil with moderate water-holding capacity. Deeper soil layers showing stress at 45cm depth.",
    aiExplanation: "The irrigation decision model uses a soil water balance approach combining real-time moisture sensor data, satellite NDWI, weather forecasts, and crop-specific water requirements. At 35% soil moisture during the grain-filling stage, the model recommends 18mm of irrigation within the next 24 hours to prevent yield loss.",
    color: "#2563eb",
  },
  {
    id: "soil_health", category: "Soil Health Assessment", icon: "🏔️",
    prediction: "Moderate Health - Action Needed", confidence: 78,
    riskLevel: "medium",
    reason: "Soil organic carbon is below optimal levels and micronutrient deficiency detected. Continued monoculture is depleting soil biome diversity.",
    environmentalIndicators: [
      { label: "Organic Carbon", value: "0.6%", status: "warning" },
      { label: "pH Level", value: "6.8", status: "good" },
      { label: "CEC", value: "18 meq", status: "good" },
      { label: "Zinc", value: "0.4 ppm", status: "danger" },
    ],
    historicalComparison: "Organic carbon has declined 15% over 3 consecutive cereal seasons. Zinc levels are 40% below recommended.",
    satelliteEvidence: "Bare soil spectral analysis shows lower reflectance in the SWIR band, indicating reduced organic matter compared to 2023.",
    weatherEvidence: "High temperatures and low rainfall accelerate organic matter decomposition. Soil biology activity reduced during dry spells.",
    soilEvidence: "Lab analysis confirms Zn deficiency (0.4 ppm vs 1.0 ppm recommended). Beneficial mycorrhizal colonization at only 35%.",
    aiExplanation: "Soil health model integrates laboratory analysis, satellite bare-soil spectral signatures, and a 3-year nutrient trend database. The declining organic carbon trend and micronutrient deficiency suggest soil fatigue from consecutive cereal cropping. The model recommends a legume rotation and targeted Zinc Sulphate application.",
    color: "#92400e",
  },
];

/* ─── Risk badge colors ─── */
const riskConfig = {
  low: { bg: "#dcfce7", color: "#15803d", label: "LOW RISK" },
  medium: { bg: "#fef9c3", color: "#b45309", label: "MEDIUM RISK" },
  high: { bg: "#fee2e2", color: "#dc2626", label: "HIGH RISK" },
  critical: { bg: "#fef2f2", color: "#991b1b", label: "CRITICAL" },
};

/* ─── Confidence Gauge ─── */
const ConfidenceGauge = ({ value, color }: { value: number; color: string }) => {
  const circumference = 2 * Math.PI * 38;
  const progress = (value / 100) * circumference;
  return (
    <div style={{ position: "relative", width: 90, height: 90 }}>
      <svg width="90" height="90" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="45" cy="45" r="38" stroke="var(--border-color)" strokeWidth="6" fill="none" />
        <circle cx="45" cy="45" r="38" stroke={color} strokeWidth="6" fill="none"
          strokeDasharray={`${progress} ${circumference}`} strokeLinecap="round"
          style={{ transition: "stroke-dasharray 1s ease" }}
        />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: 22, fontWeight: 800, color }}>{value}%</span>
      </div>
    </div>
  );
};

export default function XAIEnginePage() {
  const [expandedId, setExpandedId] = useState<string | null>("disease");

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
        <div>
          <div className="page-title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Brain size={20} color="#16a34a" /> Explainable AI Engine
          </div>
          <div className="page-subtitle">Transparent, interpretable AI predictions with full evidence trails</div>
        </div>
        <div className="badge badge-green" style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 10px" }}>
          <Zap size={11} /> 5 Active Predictions
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid-4" style={{ marginBottom: 20, gridTemplateColumns: "repeat(4, 1fr)" }}>
        {[
          { label: "Avg Confidence", val: "88%", icon: "🎯", color: "#16a34a" },
          { label: "High Risk Alerts", val: "2", icon: "🚨", color: "#dc2626" },
          { label: "Models Active", val: "5", icon: "🤖", color: "#3b82f6" },
          { label: "Data Sources", val: "12", icon: "📡", color: "#8b5cf6" },
        ].map((s, i) => (
          <div key={i} className="card-sm" style={{ textAlign: "center" }}>
            <div style={{ fontSize: 24, marginBottom: 4 }}>{s.icon}</div>
            <div className="stat-label">{s.label}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: s.color }}>{s.val}</div>
          </div>
        ))}
      </div>

      {/* Prediction Cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {predictions.map((pred, idx) => {
          const isExpanded = expandedId === pred.id;
          const risk = riskConfig[pred.riskLevel];
          return (
            <motion.div
              key={pred.id}
              className="card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              style={{ overflow: "hidden" }}
            >
              {/* Card Header */}
              <div
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}
                onClick={() => setExpandedId(isExpanded ? null : pred.id)}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{ fontSize: 36 }}>{pred.icon}</div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{pred.category}</div>
                    <div style={{ fontSize: 20, fontWeight: 700, color: "var(--text-dark)" }}>{pred.prediction}</div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <ConfidenceGauge value={pred.confidence} color={pred.color} />
                  <div style={{ textAlign: "center" }}>
                    <div style={{ background: risk.bg, color: risk.color, padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700, marginBottom: 4 }}>
                      {risk.label}
                    </div>
                  </div>
                  {isExpanded ? <ChevronUp size={20} color="var(--text-muted)" /> : <ChevronDown size={20} color="var(--text-muted)" />}
                </div>
              </div>

              {/* Expanded Details */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ overflow: "hidden" }}
                  >
                    <div style={{ borderTop: "1px solid var(--border-color)", marginTop: 16, paddingTop: 16 }}>
                      {/* Reason */}
                      <div style={{ background: `${pred.color}08`, border: `1px solid ${pred.color}25`, borderRadius: 12, padding: 16, marginBottom: 16 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: pred.color, marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}>
                          <AlertTriangle size={14} /> Reason Behind Prediction
                        </div>
                        <p style={{ fontSize: 13, color: "var(--text-dark)", lineHeight: 1.6, margin: 0 }}>{pred.reason}</p>
                      </div>

                      {/* Environmental Indicators */}
                      <div style={{ marginBottom: 16 }}>
                        <div className="stat-label" style={{ marginBottom: 10 }}>Environmental Indicators</div>
                        <div className="grid-4">
                          {pred.environmentalIndicators.map((ind, j) => (
                            <div key={j} className="card-sm" style={{
                              padding: 12, textAlign: "center",
                              borderColor: ind.status === "danger" ? "#fecaca" : ind.status === "warning" ? "#fde68a" : "#bbf7d0",
                              background: ind.status === "danger" ? "#fef2f2" : ind.status === "warning" ? "#fefce8" : "#f0fdf4",
                            }}>
                              <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 4 }}>{ind.label}</div>
                              <div style={{ fontSize: 18, fontWeight: 700, color: ind.status === "danger" ? "#dc2626" : ind.status === "warning" ? "#d97706" : "#16a34a" }}>{ind.value}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Evidence Grid */}
                      <div className="grid-2" style={{ marginBottom: 16, gap: 12 }}>
                        <div className="card-sm" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8, fontSize: 12, fontWeight: 700, color: "#15803d" }}>
                            <Satellite size={14} /> Satellite Evidence
                          </div>
                          <p style={{ fontSize: 12, color: "#374151", lineHeight: 1.5, margin: 0 }}>{pred.satelliteEvidence}</p>
                        </div>
                        <div className="card-sm" style={{ background: "#eff6ff", borderColor: "#bfdbfe" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8, fontSize: 12, fontWeight: 700, color: "#1d4ed8" }}>
                            <Thermometer size={14} /> Weather Evidence
                          </div>
                          <p style={{ fontSize: 12, color: "#374151", lineHeight: 1.5, margin: 0 }}>{pred.weatherEvidence}</p>
                        </div>
                        <div className="card-sm" style={{ background: "#fefce8", borderColor: "#fde68a" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8, fontSize: 12, fontWeight: 700, color: "#b45309" }}>
                            <Leaf size={14} /> Soil Evidence
                          </div>
                          <p style={{ fontSize: 12, color: "#374151", lineHeight: 1.5, margin: 0 }}>{pred.soilEvidence}</p>
                        </div>
                        <div className="card-sm" style={{ background: "#fdf4ff", borderColor: "#e9d5ff" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8, fontSize: 12, fontWeight: 700, color: "#7c3aed" }}>
                            <Activity size={14} /> Historical Comparison
                          </div>
                          <p style={{ fontSize: 12, color: "#374151", lineHeight: 1.5, margin: 0 }}>{pred.historicalComparison}</p>
                        </div>
                      </div>

                      {/* AI Explanation */}
                      <div style={{ background: "#0f172a", borderRadius: 12, padding: 20 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                          <Brain size={16} color="#a3e635" />
                          <span style={{ fontSize: 13, fontWeight: 700, color: "#a3e635", letterSpacing: "0.05em" }}>AI EXPLANATION</span>
                        </div>
                        <p style={{ fontSize: 13, color: "#cbd5e1", lineHeight: 1.7, margin: 0, fontFamily: "monospace" }}>{pred.aiExplanation}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      <ModuleAIAdvisor
        moduleId="xai-engine"
        moduleName="Explainable AI"
        moduleIcon="🧠"
        contextData={{ predictions: predictions.map(p => ({ category: p.category, prediction: p.prediction, confidence: p.confidence, riskLevel: p.riskLevel, reason: p.reason })) }}
      />
    </div>
  );
}
