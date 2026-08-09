"use client";
import { useState } from "react";
import { CloudRain, TrendingDown, Droplets, Leaf, AlertTriangle, Activity, ThermometerSun, ArrowDownRight, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import ModuleAIAdvisor from "@/components/ModuleAIAdvisor";

const ndviTrend = [
  { month: "Mar", ndvi: 0.82 }, { month: "Apr", ndvi: 0.79 }, { month: "May", ndvi: 0.74 },
  { month: "Jun", ndvi: 0.71 }, { month: "Jul", ndvi: 0.68 }, { month: "Aug", ndvi: 0.65 },
];

const moistureTrend = [
  { month: "Mar", moisture: 52 }, { month: "Apr", moisture: 48 }, { month: "May", moisture: 42 },
  { month: "Jun", moisture: 38 }, { month: "Jul", moisture: 35 }, { month: "Aug", moisture: 31 },
];

const recoveryProjection = [
  { week: "W1", current: 0.65, projected: 0.65 },
  { week: "W2", current: null, projected: 0.67 },
  { week: "W3", current: null, projected: 0.70 },
  { week: "W4", current: null, projected: 0.73 },
  { week: "W5", current: null, projected: 0.76 },
  { week: "W6", current: null, projected: 0.78 },
];

const droughtScale = [
  { level: "D0", label: "Abnormally Dry", color: "#fde68a", threshold: "SPI -0.5 to -0.7" },
  { level: "D1", label: "Moderate Drought", color: "#fbbf24", threshold: "SPI -0.8 to -1.2" },
  { level: "D2", label: "Severe Drought", color: "#f59e0b", threshold: "SPI -1.3 to -1.5" },
  { level: "D3", label: "Extreme Drought", color: "#ea580c", threshold: "SPI -1.6 to -1.9" },
  { level: "D4", label: "Exceptional Drought", color: "#dc2626", threshold: "SPI ≤ -2.0" },
];

export default function DroughtMonitorPage() {
  const currentSPI = -0.9;
  const currentLevel = 1; // D1
  const vegetationStress = 42;
  const waterDeficit = 35;
  const soilMoisture = 31;
  const recoveryWeeks = 4;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
        <div>
          <div className="page-title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <CloudRain size={20} color="#f59e0b" /> Drought Monitoring System
          </div>
          <div className="page-subtitle">Vegetation stress analysis, water deficit tracking, and recovery projections</div>
        </div>
        <span className="badge badge-yellow" style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 10px" }}>
          <AlertTriangle size={11} /> D1 - Moderate Drought
        </span>
      </div>

      {/* Key Metrics */}
      <div className="grid-4" style={{ marginBottom: 16 }}>
        {[
          { label: "Vegetation Stress", value: `${vegetationStress}%`, icon: "🌿", color: "#d97706", sub: "Moderate stress", trend: <ArrowUpRight size={10} /> },
          { label: "Water Deficit", value: `${waterDeficit}mm`, icon: "💧", color: "#dc2626", sub: "Below normal", trend: <ArrowUpRight size={10} /> },
          { label: "Soil Moisture", value: `${soilMoisture}%`, icon: "🏔️", color: "#92400e", sub: "Critically low", trend: <ArrowDownRight size={10} /> },
          { label: "SPI Index", value: currentSPI.toString(), icon: "📊", color: "#f59e0b", sub: "Moderate drought", trend: null },
        ].map((m, i) => (
          <motion.div key={i} className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div className="stat-label">{m.label}</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: m.color, marginTop: 4 }}>{m.value}</div>
                <div style={{ fontSize: 11, color: m.color, marginTop: 4, display: "flex", alignItems: "center", gap: 4, fontWeight: 600 }}>
                  {m.trend} {m.sub}
                </div>
              </div>
              <span style={{ fontSize: 28 }}>{m.icon}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Drought Severity Scale */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="section-title" style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <ThermometerSun size={14} color="#f59e0b" /> Drought Severity Classification
        </div>
        <div style={{ display: "flex", gap: 4, marginBottom: 12 }}>
          {droughtScale.map((d, i) => (
            <motion.div key={i} initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ delay: i * 0.1 }}
              style={{
                flex: 1, height: i === currentLevel ? 60 : 44, background: d.color, borderRadius: 8,
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                border: i === currentLevel ? "3px solid #0f172a" : "none",
                boxShadow: i === currentLevel ? "0 4px 15px rgba(0,0,0,0.2)" : "none",
                transition: "all 0.3s",
              }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: i >= 3 ? "white" : "#1f2937" }}>{d.level}</div>
              {i === currentLevel && <div style={{ fontSize: 8, fontWeight: 700, color: "#1f2937" }}>CURRENT</div>}
            </motion.div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {droughtScale.map((d, i) => (
            <div key={i} style={{ flex: 1, textAlign: "center", fontSize: 10, color: "var(--text-muted)", fontWeight: i === currentLevel ? 700 : 400 }}>
              {d.label}
            </div>
          ))}
        </div>
      </div>

      {/* Charts */}
      <div className="grid-2" style={{ marginBottom: 16 }}>
        <div className="card">
          <div className="section-title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Leaf size={14} color="#16a34a" /> NDVI Trend (6 Months)
          </div>
          <div style={{ height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ndviTrend} margin={{ top: 5, right: 10, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="dm_ndvi" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#9ca3af", fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#9ca3af", fontSize: 12 }} domain={[0.5, 0.9]} />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 12 }} />
                <Area type="monotone" dataKey="ndvi" name="NDVI" stroke="#f59e0b" strokeWidth={3} fill="url(#dm_ndvi)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="section-title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Activity size={14} color="#16a34a" /> Recovery Projection
          </div>
          <div style={{ height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={recoveryProjection} margin={{ top: 5, right: 10, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fill: "#9ca3af", fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#9ca3af", fontSize: 12 }} domain={[0.6, 0.85]} />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 12 }} />
                <Line type="monotone" dataKey="current" name="Current" stroke="#dc2626" strokeWidth={3} dot={{ r: 5 }} connectNulls={false} />
                <Line type="monotone" dataKey="projected" name="Projected Recovery" stroke="#16a34a" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="card">
        <div className="section-title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <AlertTriangle size={14} color="#d97706" /> Drought Mitigation Recommendations
        </div>
        <div className="grid-2" style={{ gap: 12 }}>
          {[
            { title: "Immediate Actions", items: ["Switch to drip/micro-sprinkler irrigation", "Apply organic mulch (5-8 cm layer)", "Reduce fertilizer application by 30%", "Harvest rain water from farm ponds"], color: "#dc2626", icon: "🚨" },
            { title: "Short-term (1-2 weeks)", items: ["Plant drought-tolerant cover crops", "Implement deficit irrigation strategy", "Monitor soil moisture twice daily", "Apply anti-transpirant spray on foliage"], color: "#f59e0b", icon: "⚠️" },
            { title: "Medium-term (2-4 weeks)", items: ["Construct check dams for water harvesting", "Apply gypsum for soil moisture retention", "Consider crop insurance claim if D2+", "Contact local Krishi Vigyan Kendra"], color: "#3b82f6", icon: "📋" },
            { title: "Recovery Phase", items: ["Gradual return to normal irrigation", "Soil health restoration with green manure", "Monitor NDVI weekly for improvement", `Est. recovery: ${recoveryWeeks} weeks`], color: "#16a34a", icon: "🌱" },
          ].map((sec, i) => (
            <div key={i} style={{ background: `${sec.color}08`, border: `1px solid ${sec.color}20`, borderRadius: 12, padding: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <span style={{ fontSize: 18 }}>{sec.icon}</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: sec.color }}>{sec.title}</span>
              </div>
              {sec.items.map((item, j) => (
                <div key={j} style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 6, display: "flex", alignItems: "flex-start", gap: 6 }}>
                  <span style={{ color: sec.color }}>•</span> {item}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <ModuleAIAdvisor
        moduleId="drought-monitor"
        moduleName="Drought Monitor"
        moduleIcon="☀️"
        contextData={{ currentSPI, currentLevel: "D1", vegetationStress, waterDeficit, soilMoisture, recoveryWeeks, ndviTrend, moistureTrend }}
      />
    </div>
  );
}
