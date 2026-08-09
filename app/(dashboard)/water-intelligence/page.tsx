"use client";
import { useState } from "react";
import { Droplets, CloudRain, Calendar, TrendingDown, Zap, CheckCircle2, AlertTriangle, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import ModuleAIAdvisor from "@/components/ModuleAIAdvisor";

const weeklySchedule = [
  { day: "Mon", required: 18, rainfall: 0, irrigate: true },
  { day: "Tue", required: 16, rainfall: 0, irrigate: true },
  { day: "Wed", required: 15, rainfall: 5, irrigate: true },
  { day: "Thu", required: 12, rainfall: 12, irrigate: false },
  { day: "Fri", required: 10, rainfall: 8, irrigate: false },
  { day: "Sat", required: 14, rainfall: 2, irrigate: true },
  { day: "Sun", required: 16, rainfall: 0, irrigate: true },
];

/* ─── Water Gauge SVG ─── */
const WaterGauge = ({ level, max, label }: { level: number; max: number; label: string }) => {
  const pct = Math.min(100, (level / max) * 100);
  const color = pct > 70 ? "#16a34a" : pct > 40 ? "#d97706" : "#dc2626";
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ position: "relative", width: 120, height: 160, margin: "0 auto", borderRadius: "0 0 60px 60px", border: `3px solid ${color}`, overflow: "hidden", background: "var(--bg-card)" }}>
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: `${pct}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            background: `linear-gradient(180deg, ${color}40, ${color}90)`,
            borderRadius: "0 0 57px 57px",
          }}
        />
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 1 }}>
          <span style={{ fontSize: 28, fontWeight: 800, color }}>{level}</span>
          <span style={{ fontSize: 11, color: "var(--text-muted)" }}>mm</span>
        </div>
      </div>
      <div style={{ marginTop: 8, fontSize: 12, fontWeight: 600, color: "var(--text-dark)" }}>{label}</div>
    </div>
  );
};

export default function WaterIntelligencePage() {
  const [selectedMethod, setSelectedMethod] = useState("drip");

  const dailyReq = 18;
  const weeklyReq = 95;
  const savingPotential = 32;
  const rainAdjustment = -15;

  const methods = [
    { id: "drip", name: "Drip Irrigation", efficiency: "90%", water: "14 mm/day", cost: "Low", recommended: true },
    { id: "sprinkler", name: "Sprinkler", efficiency: "75%", water: "18 mm/day", cost: "Medium", recommended: false },
    { id: "flood", name: "Flood Irrigation", efficiency: "50%", water: "28 mm/day", cost: "High", recommended: false },
    { id: "furrow", name: "Furrow", efficiency: "65%", water: "22 mm/day", cost: "Low", recommended: false },
  ];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
        <div>
          <div className="page-title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Droplets size={20} color="#2563eb" /> Water Requirement Intelligence
          </div>
          <div className="page-subtitle">Smart irrigation scheduling with rain forecast adjustment and water optimization</div>
        </div>
      </div>

      {/* Decision Banner */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ marginBottom: 16, background: "#fef2f2", borderColor: "#fecaca", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: "#dc2626", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 24 }}>💧</div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#991b1b" }}>Irrigate Today</div>
            <div style={{ fontSize: 13, color: "#b91c1c" }}>Soil moisture at 35% — below critical threshold for grain-filling stage</div>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 24, fontWeight: 800, color: "#dc2626" }}>18 mm</div>
          <div style={{ fontSize: 11, color: "#991b1b" }}>Required Today</div>
        </div>
      </motion.div>

      {/* Gauges */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="section-title" style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
          <Droplets size={14} color="#2563eb" /> Water Requirement Overview
        </div>
        <div style={{ display: "flex", justifyContent: "space-around", alignItems: "flex-end", flexWrap: "wrap", gap: 24 }}>
          <WaterGauge level={dailyReq} max={30} label="Daily Requirement" />
          <WaterGauge level={weeklyReq} max={150} label="Weekly Requirement" />
          <div style={{ textAlign: "center" }}>
            <div style={{ position: "relative", width: 120, height: 120, margin: "0 auto" }}>
              <svg width="120" height="120" style={{ transform: "rotate(-90deg)" }}>
                <circle cx="60" cy="60" r="50" stroke="var(--border-color)" strokeWidth="8" fill="none" />
                <circle cx="60" cy="60" r="50" stroke="#16a34a" strokeWidth="8" fill="none"
                  strokeDasharray={`${(savingPotential / 100) * 314} 314`} strokeLinecap="round"
                  style={{ transition: "stroke-dasharray 1s ease" }} />
              </svg>
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 28, fontWeight: 800, color: "#16a34a" }}>{savingPotential}%</span>
              </div>
            </div>
            <div style={{ marginTop: 8, fontSize: 12, fontWeight: 600, color: "var(--text-dark)" }}>Water Saving Potential</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div className="card-sm" style={{ padding: 20, background: "#eff6ff", borderColor: "#bfdbfe" }}>
              <CloudRain size={32} color="#2563eb" style={{ margin: "0 auto 8px" }} />
              <div style={{ fontSize: 22, fontWeight: 700, color: "#1d4ed8" }}>{rainAdjustment} mm</div>
              <div style={{ fontSize: 11, color: "#2563eb" }}>Rain Forecast Adjustment</div>
              <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 4 }}>Rain expected Thu-Fri</div>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Schedule */}
      <div className="grid-2" style={{ marginBottom: 16 }}>
        <div className="card">
          <div className="section-title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Calendar size={14} color="#2563eb" /> Weekly Irrigation Schedule
          </div>
          <div style={{ height: 250 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklySchedule} margin={{ top: 5, right: 10, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#9ca3af", fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#9ca3af", fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 12 }} />
                <Bar dataKey="required" name="Water Needed (mm)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="rainfall" name="Expected Rain (mm)" fill="#22c55e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="section-title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Clock size={14} color="#2563eb" /> Daily Schedule
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {weeklySchedule.map((d, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 10, background: d.irrigate ? "#eff6ff" : "#f0fdf4", border: `1px solid ${d.irrigate ? "#bfdbfe" : "#bbf7d0"}` }}>
                <span style={{ fontWeight: 700, fontSize: 13, width: 36 }}>{d.day}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, color: "var(--text-dark)", fontWeight: 500 }}>
                    {d.irrigate ? `Irrigate ${d.required - d.rainfall} mm (5:00-7:00 AM)` : "Skip — Rain expected"}
                  </div>
                </div>
                {d.irrigate ? (
                  <span className="badge badge-red" style={{ fontSize: 10 }}>Action</span>
                ) : (
                  <span className="badge badge-green" style={{ fontSize: 10 }}>Skip</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Irrigation Methods */}
      <div className="card">
        <div className="section-title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Zap size={14} color="#16a34a" /> Best Irrigation Method
        </div>
        <div className="grid-4">
          {methods.map(m => (
            <motion.div
              key={m.id}
              whileHover={{ y: -4 }}
              onClick={() => setSelectedMethod(m.id)}
              className="card-sm"
              style={{
                cursor: "pointer",
                border: selectedMethod === m.id ? "2px solid #16a34a" : "1px solid var(--border-color)",
                background: selectedMethod === m.id ? "#f0fdf4" : "var(--bg-card)",
                position: "relative",
              }}
            >
              {m.recommended && (
                <span style={{ position: "absolute", top: -8, right: 8, background: "#16a34a", color: "white", fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: 10 }}>RECOMMENDED</span>
              )}
              <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-dark)", marginBottom: 8 }}>{m.name}</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 4 }}>Efficiency: <strong>{m.efficiency}</strong></div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 4 }}>Water: <strong>{m.water}</strong></div>
              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Cost: <strong>{m.cost}</strong></div>
            </motion.div>
          ))}
        </div>
      </div>

      <ModuleAIAdvisor
        moduleId="water-intelligence"
        moduleName="Water Intelligence"
        moduleIcon="💧"
        contextData={{ dailyReq, weeklyReq, savingPotential, rainAdjustment, selectedMethod, weeklySchedule, methods }}
      />
    </div>
  );
}
