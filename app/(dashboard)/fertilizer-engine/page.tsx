"use client";
import { useState } from "react";
import { FlaskConical, Leaf, TrendingUp, Calendar, CheckCircle2, ArrowUpRight, Zap } from "lucide-react";
import { motion } from "framer-motion";
import ModuleAIAdvisor from "@/components/ModuleAIAdvisor";

const nutrients = [
  { name: "Nitrogen (N)", value: 78, target: 120, unit: "kg/ha", dosage: "45 kg/ha Urea (46% N)", color: "#16a34a", icon: "🟢", schedule: "Week 1, 3, 5", improvement: "+18% vegetative growth" },
  { name: "Phosphorus (P)", value: 42, target: 60, unit: "kg/ha", dosage: "20 kg/ha DAP (18-46-0)", color: "#3b82f6", icon: "🔵", schedule: "Week 1 (basal)", improvement: "+12% root development" },
  { name: "Potassium (K)", value: 55, target: 80, unit: "kg/ha", dosage: "25 kg/ha MOP (60% K₂O)", color: "#8b5cf6", icon: "🟣", schedule: "Week 2, 4", improvement: "+15% disease resistance" },
  { name: "Organic Compost", value: 60, target: 100, unit: "%", dosage: "2 tons/ha Vermicompost", color: "#92400e", icon: "🟤", schedule: "Pre-sowing", improvement: "+20% soil health" },
  { name: "Zinc (Zn)", value: 0.4, target: 1.0, unit: "ppm", dosage: "25 kg/ha ZnSO₄", color: "#f59e0b", icon: "🟡", schedule: "Week 2", improvement: "+10% grain quality" },
  { name: "Iron (Fe)", value: 3.2, target: 5.0, unit: "ppm", dosage: "10 kg/ha FeSO₄", color: "#dc2626", icon: "🔴", schedule: "Week 3", improvement: "+8% chlorophyll" },
];

const applicationSchedule = [
  { week: "Pre-Sowing", tasks: ["Apply Vermicompost (2 t/ha)", "Incorporate into soil"], status: "completed" },
  { week: "Week 1", tasks: ["Basal dose: DAP 20 kg/ha", "First Urea split: 15 kg/ha"], status: "completed" },
  { week: "Week 2", tasks: ["MOP first dose: 12 kg/ha", "ZnSO₄: 25 kg/ha"], status: "active" },
  { week: "Week 3", tasks: ["Second Urea split: 15 kg/ha", "FeSO₄ foliar spray"], status: "upcoming" },
  { week: "Week 4", tasks: ["MOP second dose: 13 kg/ha"], status: "upcoming" },
  { week: "Week 5", tasks: ["Third Urea split: 15 kg/ha", "Micronutrient foliar spray"], status: "upcoming" },
];

export default function FertilizerEnginePage() {
  const [selectedNutrient, setSelectedNutrient] = useState<number | null>(null);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
        <div>
          <div className="page-title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <FlaskConical size={20} color="#16a34a" /> Fertilizer Recommendation Engine
          </div>
          <div className="page-subtitle">Precision nutrient management with AI-optimized dosage and scheduling</div>
        </div>
      </div>

      {/* Context Info */}
      <div className="card" style={{ marginBottom: 16, padding: "14px 20px" }}>
        <div className="grid-4">
          {[
            { label: "Crop", value: "Rice (Kharif)", icon: "🌾" },
            { label: "Growth Stage", value: "Vegetative (Tillering)", icon: "🌱" },
            { label: "Soil Type", value: "Sandy Loam (pH 6.8)", icon: "🏔️" },
            { label: "Weather", value: "31°C / 72% Humidity", icon: "🌤️" },
          ].map((c, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 24 }}>{c.icon}</span>
              <div>
                <div className="stat-label">{c.label}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-dark)" }}>{c.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dosage Cards */}
      <div className="section-title" style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <Leaf size={14} color="#16a34a" /> Nutrient Dosage Recommendations
      </div>
      <div className="grid-3" style={{ marginBottom: 20 }}>
        {nutrients.map((n, i) => {
          const pct = Math.min(100, (n.value / n.target) * 100);
          const deficit = n.target - n.value;
          const isSelected = selectedNutrient === i;
          return (
            <motion.div
              key={i}
              className="card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ y: -4 }}
              onClick={() => setSelectedNutrient(isSelected ? null : i)}
              style={{ cursor: "pointer", border: isSelected ? `2px solid ${n.color}` : undefined }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 20 }}>{n.icon}</span>
                  <span style={{ fontWeight: 700, fontSize: 14, color: "var(--text-dark)" }}>{n.name}</span>
                </div>
                <span className={`badge ${pct >= 80 ? "badge-green" : pct >= 50 ? "badge-yellow" : "badge-red"}`}>
                  {pct >= 80 ? "Adequate" : pct >= 50 ? "Low" : "Deficient"}
                </span>
              </div>

              {/* Progress bar */}
              <div style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--text-muted)", marginBottom: 4 }}>
                  <span>Current: {n.value} {n.unit}</span>
                  <span>Target: {n.target} {n.unit}</span>
                </div>
                <div style={{ width: "100%", height: 8, background: "var(--border-color)", borderRadius: 4, overflow: "hidden" }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                    style={{ height: "100%", background: n.color, borderRadius: 4 }}
                  />
                </div>
              </div>

              {/* Dosage */}
              <div style={{ background: `${n.color}10`, border: `1px solid ${n.color}30`, borderRadius: 8, padding: 12, marginBottom: 8 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: n.color, marginBottom: 4 }}>RECOMMENDED DOSAGE</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-dark)" }}>{n.dosage}</div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--text-muted)" }}>
                <span>📅 {n.schedule}</span>
                <span style={{ color: "#16a34a", fontWeight: 600, display: "flex", alignItems: "center", gap: 2 }}>
                  <ArrowUpRight size={10} /> {n.improvement}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Application Schedule & Expected Improvement */}
      <div className="grid-2">
        <div className="card">
          <div className="section-title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Calendar size={14} color="#ea580c" /> Application Schedule
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {applicationSchedule.map((s, i) => (
              <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 20 }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: "50%",
                    background: s.status === "completed" ? "#16a34a" : s.status === "active" ? "#ea580c" : "var(--border-color)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    border: s.status === "active" ? "3px solid #fed7aa" : "none",
                  }}>
                    {s.status === "completed" && <CheckCircle2 size={12} color="white" />}
                    {s.status === "active" && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "white" }} />}
                  </div>
                  {i < applicationSchedule.length - 1 && (
                    <div style={{ width: 2, height: 40, background: s.status === "completed" ? "#16a34a" : "var(--border-color)" }} />
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: s.status === "active" ? "#ea580c" : "var(--text-dark)", marginBottom: 4 }}>{s.week}</div>
                  {s.tasks.map((t, j) => (
                    <div key={j} style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 2, display: "flex", alignItems: "center", gap: 4 }}>
                      <span style={{ color: s.status === "completed" ? "#16a34a" : "#9ca3af" }}>{s.status === "completed" ? "✓" : "○"}</span> {t}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="section-title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <TrendingUp size={14} color="#16a34a" /> Expected Improvement
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { label: "Yield Improvement", value: "+18%", color: "#16a34a", desc: "From optimized NPK balance" },
              { label: "Grain Quality", value: "+12%", color: "#3b82f6", desc: "Better protein content" },
              { label: "Root Strength", value: "+15%", color: "#8b5cf6", desc: "Enhanced P availability" },
              { label: "Disease Resistance", value: "+20%", color: "#ea580c", desc: "Better K uptake" },
              { label: "Soil Health", value: "+25%", color: "#92400e", desc: "Organic matter restoration" },
              { label: "Cost Efficiency", value: "-22%", color: "#16a34a", desc: "Precision reduces waste" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", borderRadius: 10, background: `${item.color}08`, border: `1px solid ${item.color}20` }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-dark)" }}>{item.label}</div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{item.desc}</div>
                </div>
                <span style={{ fontSize: 20, fontWeight: 800, color: item.color }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ModuleAIAdvisor
        moduleId="fertilizer-engine"
        moduleName="Fertilizer Engine"
        moduleIcon="🧪"
        contextData={{ crop: "Rice (Kharif)", growthStage: "Vegetative (Tillering)", soilType: "Sandy Loam (pH 6.8)", nutrients: nutrients.map(n => ({ name: n.name, value: n.value, target: n.target, unit: n.unit, dosage: n.dosage })), applicationSchedule }}
      />
    </div>
  );
}
