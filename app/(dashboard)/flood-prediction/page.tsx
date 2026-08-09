"use client";
import { useState } from "react";
import { Waves, AlertTriangle, Shield, MapPin, Clock, CheckCircle2, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import ModuleAIAdvisor from "@/components/ModuleAIAdvisor";

const rainfallData = [
  { day: "Day 1", actual: 12, threshold: 50 }, { day: "Day 2", actual: 28, threshold: 50 },
  { day: "Day 3", actual: 45, threshold: 50 }, { day: "Day 4", actual: 62, threshold: 50 },
  { day: "Day 5", actual: 35, threshold: 50 }, { day: "Day 6", actual: 18, threshold: 50 },
  { day: "Day 7", actual: 8, threshold: 50 },
];

const checklistItems = [
  { id: 1, text: "Clear drainage channels and field outlets", priority: "high" },
  { id: 2, text: "Reinforce field bunds and embankments", priority: "high" },
  { id: 3, text: "Move stored grain/fertilizer to higher ground", priority: "high" },
  { id: 4, text: "Prepare waterproof covers for harvested produce", priority: "medium" },
  { id: 5, text: "Ensure livestock have access to elevated shelter", priority: "medium" },
  { id: 6, text: "Document crop status for insurance claims (photo/video)", priority: "medium" },
  { id: 7, text: "Save emergency contacts: Block officer, SDRF, local helpline", priority: "low" },
  { id: 8, text: "Charge mobile phones and keep emergency kit ready", priority: "low" },
  { id: 9, text: "Monitor water level markers on nearby river/canal", priority: "medium" },
  { id: 10, text: "Prepare alternate seedlings for re-sowing if needed", priority: "low" },
];

export default function FloodPredictionPage() {
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());

  const toggleCheck = (id: number) => {
    setCheckedItems(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const floodProb = 22;
  const affectedArea = 0.8;
  const waterloggingRisk = 35;
  const cropDamage = 15;
  const recoveryDays = 12;

  const completedPct = Math.round((checkedItems.size / checklistItems.length) * 100);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
        <div>
          <div className="page-title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Waves size={20} color="#2563eb" /> Flood Impact Prediction
          </div>
          <div className="page-subtitle">Flood probability analysis, crop damage assessment, and emergency preparedness</div>
        </div>
        <span className="badge badge-green" style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 10px" }}>
          <Shield size={11} /> Low Flood Risk
        </span>
      </div>

      {/* Key Metrics */}
      <div className="grid-3" style={{ marginBottom: 16 }}>
        {[
          { label: "Flood Probability", value: `${floodProb}%`, desc: "Based on rainfall forecast + terrain analysis", color: "#16a34a", icon: "🌊" },
          { label: "Affected Farm Area", value: `${affectedArea} ha`, desc: "Low-lying zones at risk (of 5.4 ha total)", color: "#2563eb", icon: "📍" },
          { label: "Waterlogging Risk", value: `${waterloggingRisk}%`, desc: "Based on soil drainage capacity", color: "#f59e0b", icon: "💧" },
        ].map((m, i) => (
          <motion.div key={i} className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div className="stat-label">{m.label}</div>
                <div style={{ fontSize: 32, fontWeight: 800, color: m.color, marginTop: 4 }}>{m.value}</div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>{m.desc}</div>
              </div>
              <span style={{ fontSize: 36 }}>{m.icon}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid-2" style={{ marginBottom: 16 }}>
        {/* Crop Damage & Recovery */}
        <div className="card">
          <div className="section-title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <AlertTriangle size={14} color="#d97706" /> Crop Damage Assessment
          </div>
          <div className="grid-2" style={{ gap: 12, marginBottom: 16 }}>
            <div className="card-sm" style={{ textAlign: "center", background: "#f0fdf4", borderColor: "#bbf7d0" }}>
              <div className="stat-label">Crop Damage Risk</div>
              <div style={{ fontSize: 32, fontWeight: 800, color: "#16a34a" }}>{cropDamage}%</div>
              <span className="badge badge-green">Low</span>
            </div>
            <div className="card-sm" style={{ textAlign: "center" }}>
              <div className="stat-label">Recovery Time</div>
              <div style={{ fontSize: 32, fontWeight: 800, color: "#3b82f6" }}>{recoveryDays}</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)" }}>days (if flood occurs)</div>
            </div>
          </div>

          {/* Zone Risk Map Visualization */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-dark)", marginBottom: 8 }}>Farm Zone Risk Assessment</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {[
                { zone: "Zone A - North", risk: "Low", pct: 10, color: "#16a34a" },
                { zone: "Zone B - Central", risk: "Medium", pct: 35, color: "#f59e0b" },
                { zone: "Zone C - South", risk: "Low", pct: 15, color: "#16a34a" },
                { zone: "Zone D - Lowland", risk: "High", pct: 65, color: "#dc2626" },
              ].map((z, i) => (
                <div key={i} style={{ flex: "1 1 calc(50% - 4px)", padding: 12, borderRadius: 10, background: `${z.color}08`, border: `1px solid ${z.color}25` }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-dark)", marginBottom: 4 }}>{z.zone}</div>
                  <div style={{ width: "100%", height: 6, background: "var(--border-color)", borderRadius: 3, marginBottom: 4 }}>
                    <div style={{ width: `${z.pct}%`, height: "100%", background: z.color, borderRadius: 3 }} />
                  </div>
                  <div style={{ fontSize: 11, color: z.color, fontWeight: 700 }}>{z.risk} ({z.pct}%)</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Rainfall Chart */}
        <div className="card">
          <div className="section-title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Waves size={14} color="#2563eb" /> 7-Day Rainfall Forecast vs Flood Threshold
          </div>
          <div style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={rainfallData} margin={{ top: 5, right: 10, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="fp_rain" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#9ca3af", fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#9ca3af", fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 12 }} />
                <Area type="monotone" dataKey="actual" name="Rainfall (mm)" stroke="#2563eb" strokeWidth={3} fill="url(#fp_rain)" />
                <Area type="monotone" dataKey="threshold" name="Flood Threshold" stroke="#dc2626" strokeWidth={1.5} strokeDasharray="5 5" fill="none" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Preparedness Checklist */}
      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div className="section-title" style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 0 }}>
            <CheckCircle2 size={14} color="#16a34a" /> Flood Preparedness Checklist
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 100, height: 6, background: "var(--border-color)", borderRadius: 3 }}>
              <div style={{ width: `${completedPct}%`, height: "100%", background: "#16a34a", borderRadius: 3, transition: "width 0.3s" }} />
            </div>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#16a34a" }}>{completedPct}%</span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {checklistItems.map(item => {
            const isChecked = checkedItems.has(item.id);
            const priorityColor = item.priority === "high" ? "#dc2626" : item.priority === "medium" ? "#f59e0b" : "#16a34a";
            return (
              <motion.div key={item.id} whileHover={{ x: 4 }}
                onClick={() => toggleCheck(item.id)}
                style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 10,
                  background: isChecked ? "#f0fdf4" : "var(--bg-card)",
                  border: `1px solid ${isChecked ? "#bbf7d0" : "var(--border-color)"}`,
                  cursor: "pointer", transition: "all 0.2s",
                }}>
                <div style={{
                  width: 22, height: 22, borderRadius: 6,
                  border: `2px solid ${isChecked ? "#16a34a" : "var(--border-color)"}`,
                  background: isChecked ? "#16a34a" : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.2s", flexShrink: 0,
                }}>
                  {isChecked && <CheckCircle2 size={14} color="white" />}
                </div>
                <span style={{ flex: 1, fontSize: 13, color: isChecked ? "#16a34a" : "var(--text-dark)", textDecoration: isChecked ? "line-through" : "none", fontWeight: 500 }}>
                  {item.text}
                </span>
                <span style={{ fontSize: 9, fontWeight: 700, color: priorityColor, textTransform: "uppercase", padding: "2px 8px", borderRadius: 10, background: `${priorityColor}15` }}>
                  {item.priority}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>

      <ModuleAIAdvisor
        moduleId="flood-prediction"
        moduleName="Flood Prediction"
        moduleIcon="🌊"
        contextData={{ floodProb, affectedArea, waterloggingRisk, cropDamage, recoveryDays, rainfallData, completedPct }}
      />
    </div>
  );
}
