"use client";
import { useState } from "react";
import { Box, Activity, Leaf, Cloud, Droplets, Bug, Sprout, Zap, Thermometer, Shield, ChevronDown, ChevronUp, Satellite } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ModuleAIAdvisor from "@/components/ModuleAIAdvisor";

interface TwinSection {
  id: string; name: string; icon: string; value: string; status: "good" | "warning" | "critical";
  trend: string; detail: string; subMetrics: { label: string; value: string }[];
  color: string;
}

const sections: TwinSection[] = [
  { id: "crop_health", name: "Crop Health", icon: "🌿", value: "82/100", status: "good", trend: "+5% vs last week",
    detail: "Vegetation is in healthy condition. NDVI at 0.76 indicates strong chlorophyll activity. No significant stress detected in recent satellite imagery.",
    subMetrics: [{ label: "NDVI", value: "0.76" }, { label: "LAI", value: "3.8" }, { label: "Chlorophyll", value: "42 SPAD" }, { label: "Canopy Cover", value: "85%" }], color: "#16a34a" },
  { id: "weather", name: "Weather Status", icon: "🌤️", value: "31°C", status: "warning", trend: "Heatwave alert",
    detail: "Temperature 3°C above seasonal average. High evapotranspiration rate. Humidity at 72% with intermittent cloud cover. Rain expected in 3 days.",
    subMetrics: [{ label: "Temp", value: "31°C" }, { label: "Humidity", value: "72%" }, { label: "Wind", value: "12 km/h" }, { label: "Rain (7d)", value: "25 mm" }], color: "#f59e0b" },
  { id: "soil", name: "Soil Condition", icon: "🏔️", value: "pH 6.8", status: "good", trend: "Stable",
    detail: "Soil health within optimal parameters. Organic carbon slightly below target. Zinc deficiency detected — foliar spray recommended.",
    subMetrics: [{ label: "pH", value: "6.8" }, { label: "Organic C", value: "0.6%" }, { label: "N-P-K", value: "78-42-55" }, { label: "Moisture", value: "31%" }], color: "#92400e" },
  { id: "water", name: "Water System", icon: "💧", value: "35%", status: "critical", trend: "Below threshold",
    detail: "Soil moisture critically low at 35%. Irrigation required within 24 hours. Drip system pressure at 2.1 bar — within normal range.",
    subMetrics: [{ label: "Soil Moisture", value: "35%" }, { label: "ET Rate", value: "6.2 mm/d" }, { label: "System Pressure", value: "2.1 bar" }, { label: "Flow Rate", value: "4.5 L/h" }], color: "#2563eb" },
  { id: "ndvi", name: "NDVI Monitor", icon: "🛰️", value: "0.76", status: "good", trend: "Healthy vegetation",
    detail: "NDVI values indicate strong photosynthetic activity. Northern quadrant showing slight decline (-0.04) — monitor for disease or nutrient stress.",
    subMetrics: [{ label: "Zone A", value: "0.78" }, { label: "Zone B", value: "0.65" }, { label: "Zone C", value: "0.82" }, { label: "Avg", value: "0.76" }], color: "#22c55e" },
  { id: "yield", name: "Yield Prediction", icon: "🌾", value: "4,500 kg/ha", status: "good", trend: "+15% vs regional",
    detail: "AI model predicts Grade A quality yield. Current trajectory exceeds district average by 15.4%. Confidence: 87%.",
    subMetrics: [{ label: "Expected", value: "4,500 kg/ha" }, { label: "Production", value: "24.3 tons" }, { label: "Quality", value: "Grade A" }, { label: "Confidence", value: "87%" }], color: "#f59e0b" },
  { id: "disease", name: "Disease Risk", icon: "🦠", value: "96%", status: "critical", trend: "Leaf Blight detected",
    detail: "High probability of Leaf Blight onset. Fungal pathogen conditions present: high humidity (89%), warm temperatures (31°C), prolonged leaf wetness.",
    subMetrics: [{ label: "Disease", value: "Leaf Blight" }, { label: "Probability", value: "96%" }, { label: "Onset", value: "5-7 days" }, { label: "Spread", value: "Zone A" }], color: "#dc2626" },
  { id: "pest", name: "Pest Status", icon: "🐛", value: "89%", status: "critical", trend: "FAW alert active",
    detail: "Fall Armyworm risk elevated. Pheromone trap counts 3x above seasonal average in maize fields. Preventive action recommended.",
    subMetrics: [{ label: "Pest", value: "FAW" }, { label: "Risk", value: "89%" }, { label: "Traps", value: "3x above avg" }, { label: "Target", value: "Maize field" }], color: "#ea580c" },
  { id: "carbon", name: "Carbon & ESG", icon: "🌍", value: "570 kg", status: "good", trend: "-33% reduction",
    detail: "Carbon footprint reduced by 33% through precision agriculture practices. Eligible for 2.8 carbon credits based on current emission profile.",
    subMetrics: [{ label: "CO₂e", value: "570 kg" }, { label: "Credits", value: "2.8" }, { label: "Reduction", value: "-33%" }, { label: "Rating", value: "A" }], color: "#059669" },
  { id: "risk", name: "Overall Risk", icon: "⚡", value: "30/100", status: "warning", trend: "2 high alerts",
    detail: "Overall risk score considers disease (96%), pest (89%), drought (45%), and climate risks. 2 items require immediate attention.",
    subMetrics: [{ label: "Climate", value: "30%" }, { label: "Disease", value: "96%" }, { label: "Pest", value: "89%" }, { label: "Drought", value: "45%" }], color: "#6366f1" },
];

const statusConfig = {
  good: { bg: "#dcfce7", color: "#15803d", label: "OPTIMAL" },
  warning: { bg: "#fef9c3", color: "#b45309", label: "ATTENTION" },
  critical: { bg: "#fee2e2", color: "#dc2626", label: "CRITICAL" },
};

export default function DigitalTwinPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showAllMetrics, setShowAllMetrics] = useState(true);

  const criticalCount = sections.filter(s => s.status === "critical").length;
  const warningCount = sections.filter(s => s.status === "warning").length;
  const healthyCount = sections.filter(s => s.status === "good").length;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
        <div>
          <div className="page-title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Box size={20} color="#3b82f6" /> Digital Farm Twin
          </div>
          <div className="page-subtitle">Real-time virtual representation of your farm with live sensor data and AI analysis</div>
        </div>
      </div>

      {/* Summary Bar */}
      <div className="card" style={{ marginBottom: 16, padding: "14px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", gap: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#16a34a" }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-dark)" }}>{healthyCount} Optimal</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#f59e0b" }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-dark)" }}>{warningCount} Attention</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#dc2626", animation: "pulse 2s infinite" }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: "#dc2626" }}>{criticalCount} Critical</span>
            </div>
          </div>
          <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Last synced: 2 min ago</div>
        </div>
      </div>

      {/* Twin Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
        {sections.map((sec, i) => {
          const isExpanded = expandedId === sec.id;
          const status = statusConfig[sec.status];
          return (
            <motion.div key={sec.id} className="card" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.04 }}
              whileHover={{ y: -4, boxShadow: `0 8px 25px ${sec.color}15` }}
              onClick={() => setExpandedId(isExpanded ? null : sec.id)}
              style={{ cursor: "pointer", borderLeft: `4px solid ${sec.color}`, overflow: "hidden" }}>
              
              {/* Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 24 }}>{sec.icon}</span>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-dark)" }}>{sec.name}</div>
                    <div style={{ fontSize: 11, color: sec.color, fontWeight: 600 }}>{sec.trend}</div>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: sec.color }}>{sec.value}</div>
                  <span style={{ background: status.bg, color: status.color, padding: "2px 8px", borderRadius: 10, fontSize: 9, fontWeight: 700 }}>{status.label}</span>
                </div>
              </div>

              {/* Status Bar */}
              <div style={{ width: "100%", height: 4, background: "var(--border-color)", borderRadius: 2, marginBottom: 8 }}>
                <motion.div initial={{ width: 0 }} animate={{ width: sec.status === "good" ? "85%" : sec.status === "warning" ? "55%" : "25%" }}
                  style={{ height: "100%", background: sec.color, borderRadius: 2 }} transition={{ duration: 1, delay: i * 0.06 }} />
              </div>

              {/* Sub-metrics */}
              <div className="grid-2" style={{ gap: 6 }}>
                {sec.subMetrics.map((sm, j) => (
                  <div key={j} style={{ padding: "6px 8px", borderRadius: 6, background: `${sec.color}06`, border: `1px solid ${sec.color}12` }}>
                    <div style={{ fontSize: 9, color: "var(--text-muted)", fontWeight: 600 }}>{sm.label}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-dark)" }}>{sm.value}</div>
                  </div>
                ))}
              </div>

              {/* Expanded Detail */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                    <div style={{ marginTop: 12, padding: 12, borderRadius: 8, background: `${sec.color}06`, border: `1px solid ${sec.color}15` }}>
                      <p style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.6, margin: 0 }}>{sec.detail}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      <ModuleAIAdvisor
        moduleId="digital-twin"
        moduleName="Digital Farm Twin"
        moduleIcon="🏭"
        contextData={{ sections: sections.map(s => ({ name: s.name, value: s.value, status: s.status, trend: s.trend })), criticalCount, warningCount, healthyCount }}
      />
    </div>
  );
}
