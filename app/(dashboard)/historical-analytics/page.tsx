"use client";
import { useState } from "react";
import { History, TrendingUp, ArrowUpRight, ArrowDownRight, Calendar, BarChart3, Leaf, Cloud, Droplets } from "lucide-react";
import { motion } from "framer-motion";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import ModuleAIAdvisor from "@/components/ModuleAIAdvisor";

type Season = "kharif" | "rabi" | "zaid";

const seasonData: Record<Season, { label: string; period: string; crop: string }> = {
  kharif: { label: "Kharif", period: "Jun – Nov", crop: "Rice" },
  rabi: { label: "Rabi", period: "Nov – Mar", crop: "Wheat" },
  zaid: { label: "Zaid", period: "Mar – Jun", crop: "Vegetables" },
};

const ndviComparison = [
  { month: "Jun", previous: 0.45, current: 0.48 }, { month: "Jul", previous: 0.62, current: 0.68 },
  { month: "Aug", previous: 0.71, current: 0.76 }, { month: "Sep", previous: 0.68, current: 0.74 },
  { month: "Oct", previous: 0.55, current: 0.62 }, { month: "Nov", previous: 0.42, current: 0.48 },
];

const yieldComparison = [
  { year: "2021", kharif: 3600, rabi: 3200, zaid: 2800 },
  { year: "2022", kharif: 3400, rabi: 3100, zaid: 2600 },
  { year: "2023", kharif: 3900, rabi: 3400, zaid: 3000 },
  { year: "2024", kharif: 3800, rabi: 3350, zaid: 2900 },
  { year: "2025", kharif: 4100, rabi: 3550, zaid: 3200 },
  { year: "2026*", kharif: 4500, rabi: null, zaid: null },
];

const weatherHistory = [
  { month: "Jun", prev_rain: 120, curr_rain: 145, prev_temp: 30, curr_temp: 31 },
  { month: "Jul", prev_rain: 180, curr_rain: 165, prev_temp: 29, curr_temp: 30 },
  { month: "Aug", prev_rain: 200, curr_rain: 140, prev_temp: 28, curr_temp: 31 },
  { month: "Sep", prev_rain: 160, curr_rain: 0, prev_temp: 29, curr_temp: 0 },
  { month: "Oct", prev_rain: 80, curr_rain: 0, prev_temp: 28, curr_temp: 0 },
];

interface ComparisonMetric {
  label: string; prev: string; curr: string; change: string; positive: boolean; icon: string;
}

const comparisonMetrics: ComparisonMetric[] = [
  { label: "Average NDVI", prev: "0.68", curr: "0.76", change: "+11.8%", positive: true, icon: "🌿" },
  { label: "Expected Yield", prev: "3,800 kg/ha", curr: "4,500 kg/ha", change: "+18.4%", positive: true, icon: "🌾" },
  { label: "Total Rainfall", prev: "740 mm", curr: "450 mm*", change: "-39.2%", positive: false, icon: "🌧️" },
  { label: "Avg Temperature", prev: "28.8°C", curr: "30.5°C", change: "+1.7°C", positive: false, icon: "🌡️" },
  { label: "Soil pH", prev: "6.5", curr: "6.8", change: "+0.3", positive: true, icon: "🏔️" },
  { label: "Carbon Footprint", prev: "850 kg CO₂e", curr: "570 kg CO₂e", change: "-33%", positive: true, icon: "🌍" },
  { label: "Water Usage", prev: "12,500 L/ha", curr: "8,500 L/ha", change: "-32%", positive: true, icon: "💧" },
  { label: "Input Cost", prev: "₹85,000/ha", curr: "₹66,500/ha", change: "-22%", positive: true, icon: "💰" },
];

const historicalRecords = [
  { season: "Kharif 2025", crop: "Rice", yield: "4,100 kg/ha", ndvi: 0.74, rainfall: "740 mm", grade: "A" },
  { season: "Rabi 2024-25", crop: "Wheat", yield: "3,550 kg/ha", ndvi: 0.72, rainfall: "120 mm", grade: "A" },
  { season: "Kharif 2024", crop: "Rice", yield: "3,800 kg/ha", ndvi: 0.68, rainfall: "680 mm", grade: "B+" },
  { season: "Rabi 2023-24", crop: "Wheat", yield: "3,350 kg/ha", ndvi: 0.66, rainfall: "105 mm", grade: "B+" },
  { season: "Kharif 2023", crop: "Rice", yield: "3,900 kg/ha", ndvi: 0.71, rainfall: "720 mm", grade: "A" },
  { season: "Rabi 2022-23", crop: "Wheat", yield: "3,400 kg/ha", ndvi: 0.69, rainfall: "110 mm", grade: "B" },
];

export default function HistoricalAnalyticsPage() {
  const [selectedSeason, setSelectedSeason] = useState<Season>("kharif");

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
        <div>
          <div className="page-title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <History size={20} color="#8b5cf6" /> Historical Analytics
          </div>
          <div className="page-subtitle">Season-over-season comparison with multi-metric trend analysis</div>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {(Object.keys(seasonData) as Season[]).map(s => (
            <button key={s} onClick={() => setSelectedSeason(s)}
              className={`btn ${selectedSeason === s ? "btn-primary" : "btn-outline"}`}
              style={{ fontSize: 12, padding: "6px 14px" }}>
              {seasonData[s].label}
            </button>
          ))}
        </div>
      </div>

      {/* Comparison Cards */}
      <div className="grid-4" style={{ marginBottom: 16 }}>
        {comparisonMetrics.map((m, i) => (
          <motion.div key={i} className="card-sm" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
              <span style={{ fontSize: 22 }}>{m.icon}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: m.positive ? "#16a34a" : "#dc2626", display: "flex", alignItems: "center", gap: 2 }}>
                {m.positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {m.change}
              </span>
            </div>
            <div className="stat-label">{m.label}</div>
            <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
              <div style={{ flex: 1, padding: "4px 6px", borderRadius: 6, background: "#f3f4f6", textAlign: "center" }}>
                <div style={{ fontSize: 8, color: "#9ca3af", fontWeight: 600 }}>PREV</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#6b7280" }}>{m.prev}</div>
              </div>
              <div style={{ flex: 1, padding: "4px 6px", borderRadius: 6, background: "#f0fdf4", textAlign: "center" }}>
                <div style={{ fontSize: 8, color: "#16a34a", fontWeight: 600 }}>CURR</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#15803d" }}>{m.curr}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid-2" style={{ marginBottom: 16 }}>
        <div className="card">
          <div className="section-title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Leaf size={14} color="#16a34a" /> NDVI Comparison (Previous vs Current)
          </div>
          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ndviComparison} margin={{ top: 5, right: 10, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="ha_curr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16a34a" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#9ca3af", fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#9ca3af", fontSize: 12 }} domain={[0.3, 0.9]} />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Area type="monotone" dataKey="previous" name="Previous Season" stroke="#9ca3af" strokeWidth={2} strokeDasharray="5 5" fill="none" />
                <Area type="monotone" dataKey="current" name="Current Season" stroke="#16a34a" strokeWidth={3} fill="url(#ha_curr)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="section-title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <BarChart3 size={14} color="#8b5cf6" /> Multi-Year Yield Trend
          </div>
          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={yieldComparison} margin={{ top: 5, right: 10, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fill: "#9ca3af", fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#9ca3af", fontSize: 12 }} domain={[0, 5000]} />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="kharif" name="Kharif" fill="#16a34a" radius={[4, 4, 0, 0]} />
                <Bar dataKey="rabi" name="Rabi" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="zaid" name="Zaid" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="card">
        <div className="section-title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Calendar size={14} color="#8b5cf6" /> Historical Records
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: "2px solid var(--border-color)" }}>
                {["Season", "Crop", "Yield", "Avg NDVI", "Rainfall", "Grade"].map(h => (
                  <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontWeight: 700, fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {historicalRecords.map((r, i) => (
                <tr key={i} style={{ borderBottom: "1px solid var(--border-color)" }}>
                  <td style={{ padding: "10px 14px", fontWeight: 600, color: "var(--text-dark)" }}>{r.season}</td>
                  <td style={{ padding: "10px 14px", color: "var(--text-muted)" }}>{r.crop}</td>
                  <td style={{ padding: "10px 14px", fontWeight: 600, color: "#16a34a" }}>{r.yield}</td>
                  <td style={{ padding: "10px 14px" }}>
                    <span style={{ color: r.ndvi > 0.7 ? "#16a34a" : "#d97706", fontWeight: 600 }}>{r.ndvi}</span>
                  </td>
                  <td style={{ padding: "10px 14px", color: "#2563eb" }}>{r.rainfall}</td>
                  <td style={{ padding: "10px 14px" }}>
                    <span className={`badge ${r.grade === "A" ? "badge-green" : "badge-yellow"}`}>{r.grade}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ModuleAIAdvisor
        moduleId="historical-analytics"
        moduleName="Historical Analytics"
        moduleIcon="📊"
        contextData={{ yieldComparison, ndviComparison, weatherHistory, seasonData }}
      />
    </div>
  );
}
