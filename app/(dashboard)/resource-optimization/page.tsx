"use client";
import { useState } from "react";
import { Settings2, TrendingUp, Droplets, Leaf, Bug, Sprout, DollarSign, BarChart3, Zap, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { motion } from "framer-motion";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip } from "recharts";
import ModuleAIAdvisor from "@/components/ModuleAIAdvisor";

const metrics = [
  { label: "Water Saving", value: 32, unit: "%", icon: "💧", color: "#2563eb", before: 12500, after: 8500, beforeUnit: "L/ha", change: "-32%", desc: "Drip irrigation + rain adjustment" },
  { label: "Fertilizer Reduction", value: 22, unit: "%", icon: "🧪", color: "#8b5cf6", before: 280, after: 218, beforeUnit: "kg/ha", change: "-22%", desc: "Precision NPK dosing" },
  { label: "Pesticide Reduction", value: 40, unit: "%", icon: "🐛", color: "#16a34a", before: 3.2, after: 1.9, beforeUnit: "L/ha", change: "-40%", desc: "IPM + predictive pest alerts" },
  { label: "Carbon Reduction", value: 280, unit: "kg", icon: "🌍", color: "#059669", before: 850, after: 570, beforeUnit: "kg CO₂e", change: "-33%", desc: "Reduced input + organic practices" },
  { label: "Yield Improvement", value: 15, unit: "%", icon: "🌾", color: "#f59e0b", before: 3900, after: 4500, beforeUnit: "kg/ha", change: "+15%", desc: "Optimized timing & nutrient management" },
  { label: "Cost Saving", value: 18500, unit: "₹", icon: "💰", color: "#16a34a", before: 85000, after: 66500, beforeUnit: "₹/ha", change: "-22%", desc: "Reduced input costs with precision" },
  { label: "Profit Improvement", value: 28, unit: "%", icon: "📈", color: "#ea580c", before: 42000, after: 54000, beforeUnit: "₹/ha", change: "+28%", desc: "Higher yield + lower costs" },
  { label: "Efficiency Score", value: 85, unit: "/100", icon: "⚡", color: "#3b82f6", before: 62, after: 85, beforeUnit: "/100", change: "+37%", desc: "Overall resource utilization" },
];

const radarData = [
  { metric: "Water", value: 85 }, { metric: "Fertilizer", value: 78 },
  { metric: "Pesticide", value: 90 }, { metric: "Carbon", value: 82 },
  { metric: "Yield", value: 88 }, { metric: "Cost", value: 75 },
  { metric: "Profit", value: 80 }, { metric: "Labor", value: 72 },
];

const suggestions = [
  { title: "Switch to Micro-Sprinkler for Zone B", impact: "+8% water efficiency", priority: "high", icon: "💧" },
  { title: "Apply Neem cake instead of chemical pesticide", impact: "-25% pesticide use", priority: "high", icon: "🌿" },
  { title: "Install soil moisture sensors (IoT)", impact: "+15% irrigation precision", priority: "medium", icon: "📡" },
  { title: "Implement crop rotation with legumes", impact: "+30% soil N fixation", priority: "medium", icon: "🔄" },
  { title: "Use solar-powered pump for irrigation", impact: "-40% energy cost", priority: "low", icon: "☀️" },
  { title: "Aggregate produce via FPO for better price", impact: "+12% market price", priority: "low", icon: "🤝" },
];

export default function ResourceOptimizationPage() {
  const [showBefore, setShowBefore] = useState(false);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
        <div>
          <div className="page-title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Settings2 size={20} color="#16a34a" /> Farm Resource Optimization
          </div>
          <div className="page-subtitle">AI-driven resource efficiency analysis with before/after impact comparison</div>
        </div>
        <button onClick={() => setShowBefore(!showBefore)} className="btn btn-outline" style={{ fontSize: 12, display: "flex", alignItems: "center", gap: 6, padding: "6px 14px" }}>
          {showBefore ? "Hide" : "Show"} Before/After
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid-4" style={{ marginBottom: 16 }}>
        {metrics.map((m, i) => (
          <motion.div key={i} className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} whileHover={{ y: -4 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <span style={{ fontSize: 28 }}>{m.icon}</span>
              <span style={{ fontSize: 18, fontWeight: 800, color: m.color, display: "flex", alignItems: "center", gap: 2 }}>
                {m.change.startsWith("+") ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {m.change}
              </span>
            </div>
            <div className="stat-label">{m.label}</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: m.color, marginTop: 2 }}>
              {m.value.toLocaleString()}{m.unit}
            </div>
            {showBefore && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginTop: 8, display: "flex", gap: 8 }}>
                <div style={{ flex: 1, padding: "6px 8px", borderRadius: 6, background: "#fee2e2", textAlign: "center" }}>
                  <div style={{ fontSize: 9, color: "#dc2626", fontWeight: 600 }}>Before</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#991b1b" }}>{m.before.toLocaleString()} {m.beforeUnit}</div>
                </div>
                <div style={{ flex: 1, padding: "6px 8px", borderRadius: 6, background: "#dcfce7", textAlign: "center" }}>
                  <div style={{ fontSize: 9, color: "#16a34a", fontWeight: 600 }}>After</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#15803d" }}>{m.after.toLocaleString()} {m.beforeUnit}</div>
                </div>
              </motion.div>
            )}
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 6 }}>{m.desc}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid-2" style={{ marginBottom: 16 }}>
        {/* Radar Chart */}
        <div className="card">
          <div className="section-title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <BarChart3 size={14} color="#16a34a" /> Efficiency Radar
          </div>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} margin={{ top: 20, right: 40, bottom: 20, left: 40 }}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="metric" tick={{ fill: "#6b7280", fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 12 }} />
                <Radar name="Efficiency" dataKey="value" stroke="#16a34a" fill="#16a34a" fillOpacity={0.2} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Suggestions */}
        <div className="card">
          <div className="section-title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Zap size={14} color="#f59e0b" /> AI Optimization Suggestions
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {suggestions.map((s, i) => {
              const priorityColor = s.priority === "high" ? "#dc2626" : s.priority === "medium" ? "#f59e0b" : "#16a34a";
              return (
                <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                  style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 10, background: `${priorityColor}06`, border: `1px solid ${priorityColor}15` }}>
                  <span style={{ fontSize: 20 }}>{s.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-dark)" }}>{s.title}</div>
                    <div style={{ fontSize: 11, color: "#16a34a", fontWeight: 600, marginTop: 2 }}>{s.impact}</div>
                  </div>
                  <span style={{ fontSize: 9, fontWeight: 700, color: priorityColor, textTransform: "uppercase", padding: "2px 8px", borderRadius: 10, background: `${priorityColor}15` }}>{s.priority}</span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      <ModuleAIAdvisor
        moduleId="resource-optimization"
        moduleName="Resource Optimization"
        moduleIcon="⚙️"
        contextData={{ metrics: metrics.map(m => ({ label: m.label, value: m.value, unit: m.unit, before: m.before, after: m.after, change: m.change })), suggestions: suggestions.map(s => ({ title: s.title, impact: s.impact, priority: s.priority })), radarData }}
      />
    </div>
  );
}
