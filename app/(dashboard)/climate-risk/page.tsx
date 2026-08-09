"use client";
import { useState } from "react";
import { ShieldAlert, AlertTriangle, CloudRain, Thermometer, Wind, Zap, CloudLightning, Snowflake, Cloud, Activity } from "lucide-react";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import ModuleAIAdvisor from "@/components/ModuleAIAdvisor";

/* ─── Risk data ─── */
interface ClimateRisk {
  id: string; name: string; icon: string; value: number; trend: "rising" | "falling" | "stable";
  recommendation: string; color: string;
}

const risks: ClimateRisk[] = [
  { id: "flood", name: "Flood Risk", icon: "🌊", value: 22, trend: "stable", recommendation: "Low risk. Maintain drainage channels and check bund integrity before monsoon intensifies.", color: "#2563eb" },
  { id: "heatwave", name: "Heatwave Risk", icon: "🔥", value: 68, trend: "rising", recommendation: "Elevated risk. Apply mulching to reduce soil temperature. Irrigate during early morning. Consider shade nets for nurseries.", color: "#dc2626" },
  { id: "cyclone", name: "Cyclone Risk", icon: "🌀", value: 15, trend: "stable", recommendation: "Low risk. No cyclonic activity expected in the next 14 days. Monitor IMD advisories.", color: "#6366f1" },
  { id: "drought", name: "Drought Risk", icon: "☀️", value: 45, trend: "rising", recommendation: "Moderate risk. Soil moisture declining. Switch to drip irrigation and apply organic mulch to reduce evaporation by 30%.", color: "#f59e0b" },
  { id: "rain", name: "Heavy Rainfall", icon: "⛈️", value: 38, trend: "falling", recommendation: "Moderate risk. Intermittent heavy showers possible. Ensure field drainage. Delay fertilizer application if rain >15mm expected.", color: "#0ea5e9" },
  { id: "cold", name: "Cold Wave", icon: "❄️", value: 5, trend: "stable", recommendation: "Negligible risk. Minimum temperatures well above threshold for the current season.", color: "#06b6d4" },
  { id: "lightning", name: "Lightning", icon: "⚡", value: 32, trend: "falling", recommendation: "Low-moderate risk. Thunderstorm activity possible in afternoons. Avoid open field work between 2-5 PM.", color: "#eab308" },
  { id: "wind", name: "Wind Damage", icon: "💨", value: 18, trend: "stable", recommendation: "Low risk. Wind speeds within normal range. Ensure crop staking for tall varieties.", color: "#64748b" },
];

const trendData = [
  { month: "Jan", flood: 10, heat: 15, drought: 20, rain: 25 },
  { month: "Feb", flood: 8, heat: 25, drought: 30, rain: 15 },
  { month: "Mar", flood: 5, heat: 45, drought: 50, rain: 10 },
  { month: "Apr", flood: 8, heat: 65, drought: 55, rain: 15 },
  { month: "May", flood: 15, heat: 80, drought: 60, rain: 30 },
  { month: "Jun", flood: 35, heat: 55, drought: 35, rain: 65 },
  { month: "Jul", flood: 55, heat: 40, drought: 15, rain: 80 },
  { month: "Aug*", flood: 22, heat: 68, drought: 45, rain: 38 },
];

/* ─── Risk Gauge Component ─── */
const RiskGauge = ({ risk }: { risk: ClimateRisk }) => {
  const getColor = (v: number) => v > 70 ? "#dc2626" : v > 50 ? "#f59e0b" : v > 30 ? "#eab308" : "#16a34a";
  const getLabel = (v: number) => v > 70 ? "Critical" : v > 50 ? "High" : v > 30 ? "Moderate" : "Low";
  const getBg = (v: number) => v > 70 ? "#fee2e2" : v > 50 ? "#fef3c7" : v > 30 ? "#fef9c3" : "#dcfce7";
  const color = getColor(risk.value);
  const circumference = 2 * Math.PI * 32;

  return (
    <div className="card-sm" style={{ textAlign: "center", padding: 16 }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>{risk.name}</div>
      <div style={{ position: "relative", width: 80, height: 80, margin: "0 auto 8px" }}>
        <svg width="80" height="80" style={{ transform: "rotate(-90deg)" }}>
          <circle cx="40" cy="40" r="32" stroke="var(--border-color)" strokeWidth="6" fill="none" />
          <motion.circle cx="40" cy="40" r="32" stroke={color} strokeWidth="6" fill="none"
            initial={{ strokeDasharray: "0 201" }}
            animate={{ strokeDasharray: `${(risk.value / 100) * circumference} ${circumference}` }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            strokeLinecap="round" />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: 20 }}>{risk.icon}</span>
        </div>
      </div>
      <div style={{ fontSize: 22, fontWeight: 800, color, marginBottom: 4 }}>{risk.value}%</div>
      <span style={{ background: getBg(risk.value), color, padding: "3px 10px", borderRadius: 12, fontSize: 10, fontWeight: 700 }}>
        {getLabel(risk.value)}
      </span>
      <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 6, display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
        {risk.trend === "rising" ? "📈" : risk.trend === "falling" ? "📉" : "➡️"} {risk.trend}
      </div>
    </div>
  );
};

export default function ClimateRiskPage() {
  const [expandedRisk, setExpandedRisk] = useState<string | null>(null);
  const [tempOffset, setTempOffset] = useState(0);

  const overallScore = Math.round(risks.reduce((s, r) => s + r.value, 0) / risks.length + tempOffset * 6);
  const overallColor = overallScore > 60 ? "#dc2626" : overallScore > 40 ? "#f59e0b" : "#16a34a";
  const overallLabel = overallScore > 60 ? "HIGH ALERT" : overallScore > 40 ? "ELEVATED" : "NORMAL";

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
        <div>
          <div className="page-title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <ShieldAlert size={20} color="#dc2626" /> Climate Risk Intelligence
          </div>
          <div className="page-subtitle">Real-time multi-hazard climate risk assessment with actionable advisories</div>
        </div>
      </div>

      {/* Overall Score + Simulator */}
      <div className="grid-2" style={{ marginBottom: 16 }}>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="card" style={{ background: "linear-gradient(135deg, #064e3b, #065f46)", color: "white", border: "1px solid #059669" }}>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", opacity: 0.7, marginBottom: 8 }}>Overall Climate Risk Score</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 8 }}>
            <span style={{ fontSize: 56, fontWeight: 800, lineHeight: 1 }}>{Math.min(100, Math.max(0, overallScore))}</span>
            <span style={{ fontSize: 18, opacity: 0.5 }}>/100</span>
          </div>
          <div style={{ display: "inline-block", padding: "4px 14px", borderRadius: 14, fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", background: `${overallColor}30`, color: overallColor === "#dc2626" ? "#fca5a5" : overallColor === "#f59e0b" ? "#fde68a" : "#86efac" }}>
            {overallLabel}
          </div>
          <div style={{ marginTop: 16, display: "flex", gap: 24, fontSize: 12, opacity: 0.8 }}>
            <div><strong>High Risks:</strong> {risks.filter(r => r.value > 50).length}</div>
            <div><strong>Rising Trends:</strong> {risks.filter(r => r.trend === "rising").length}</div>
            <div><strong>Data Sources:</strong> IMD, Sentinel, IoT</div>
          </div>
        </motion.div>

        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14, color: "var(--text-dark)" }}>Interactive Climate Modeler</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Simulate temperature shifts to see risk impact</div>
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#2563eb", background: "#eff6ff", padding: "4px 12px", borderRadius: 8, border: "1px solid #bfdbfe" }}>
              {tempOffset > 0 ? "+" : ""}{tempOffset}°C
            </div>
          </div>
          <input type="range" min="-2" max="5" step="0.5" value={tempOffset} onChange={e => setTempOffset(parseFloat(e.target.value))} style={{ width: "100%", accentColor: "#16a34a" }} />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "var(--text-muted)", fontWeight: 500, marginTop: 6 }}>
            <span>-2°C (Cooler)</span><span>Current</span><span>+5°C (Heatwave)</span>
          </div>
        </div>
      </div>

      {/* Risk Gauges Grid */}
      <div className="grid-4" style={{ marginBottom: 16 }}>
        {risks.map(r => <RiskGauge key={r.id} risk={{ ...r, value: Math.min(100, Math.max(0, r.value + tempOffset * (r.id === "heatwave" || r.id === "drought" ? 8 : r.id === "cold" ? -10 : 2))) }} />)}
      </div>

      {/* Recommendations */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="section-title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <AlertTriangle size={14} color="#d97706" /> Risk Advisories & Recommendations
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {risks.filter(r => r.value > 25).sort((a, b) => b.value - a.value).map(r => {
            const color = r.value > 50 ? "#dc2626" : r.value > 30 ? "#d97706" : "#16a34a";
            return (
              <motion.div key={r.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                onClick={() => setExpandedRisk(expandedRisk === r.id ? null : r.id)}
                style={{ padding: "12px 16px", borderRadius: 10, background: `${color}08`, border: `1px solid ${color}20`, cursor: "pointer" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 20 }}>{r.icon}</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text-dark)" }}>{r.name}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color }}>{r.value}%</span>
                  </div>
                  <span style={{ fontSize: 10, color: "var(--text-muted)" }}>{expandedRisk === r.id ? "▲" : "▼"}</span>
                </div>
                {expandedRisk === r.id && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.6, margin: "8px 0 0 30px" }}>
                    {r.recommendation}
                  </motion.p>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Trend Chart */}
      <div className="card">
        <div className="section-title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Activity size={14} color="#16a34a" /> Annual Risk Trend
        </div>
        <div style={{ height: 280 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData} margin={{ top: 5, right: 10, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#9ca3af", fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: "#9ca3af", fontSize: 12 }} domain={[0, 100]} />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 12 }} />
              <Area type="monotone" dataKey="heat" name="Heatwave" stroke="#dc2626" fill="#dc262620" strokeWidth={2} />
              <Area type="monotone" dataKey="drought" name="Drought" stroke="#f59e0b" fill="#f59e0b15" strokeWidth={2} />
              <Area type="monotone" dataKey="flood" name="Flood" stroke="#2563eb" fill="#2563eb15" strokeWidth={2} />
              <Area type="monotone" dataKey="rain" name="Heavy Rain" stroke="#0ea5e9" fill="#0ea5e915" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <ModuleAIAdvisor
        moduleId="climate-risk"
        moduleName="Climate Risk"
        moduleIcon="🌡️"
        contextData={{ risks: risks.map(r => ({ name: r.name, value: r.value, trend: r.trend })), overallScore, overallLabel, tempOffset }}
      />
    </div>
  );
}
