"use client";
import { useState } from "react";
import { Sprout, TrendingUp, Calendar, Award, BarChart3, Target, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { motion } from "framer-motion";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import ModuleAIAdvisor from "@/components/ModuleAIAdvisor";

const historicalYield = [
  { year: "2020", actual: 3800, predicted: 3750, regional: 3500 },
  { year: "2021", actual: 3950, predicted: 3900, regional: 3600 },
  { year: "2022", actual: 3700, predicted: 3750, regional: 3400 },
  { year: "2023", actual: 4100, predicted: 4050, regional: 3700 },
  { year: "2024", actual: 3900, predicted: 3950, regional: 3550 },
  { year: "2025", actual: 4250, predicted: 4200, regional: 3800 },
  { year: "2026*", actual: null, predicted: 4500, regional: 3900 },
];

const comparisonData = [
  { name: "Your Farm", yield: 4500, fill: "#16a34a" },
  { name: "District Avg", yield: 3900, fill: "#3b82f6" },
  { name: "State Avg", yield: 3600, fill: "#8b5cf6" },
  { name: "National Avg", yield: 3200, fill: "#d97706" },
];

export default function YieldForecastPage() {
  const [cropType, setCropType] = useState("Rice");
  const [farmArea, setFarmArea] = useState("5.4");

  const expectedYield = 4500;
  const confidence = 87;
  const harvestDate = "24 Oct 2026";
  const totalProduction = (parseFloat(farmArea) * expectedYield / 1000).toFixed(1);
  const qualityGrade = "Grade A";

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
        <div>
          <div className="page-title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Sprout size={20} color="#16a34a" /> Crop Yield Forecasting
          </div>
          <div className="page-subtitle">AI-powered yield prediction with historical analysis and regional benchmarking</div>
        </div>
      </div>

      {/* Input Panel */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="section-title" style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <Target size={14} color="#16a34a" /> Prediction Parameters
        </div>
        <div className="grid-4">
          <div>
            <div className="stat-label">Farm Area (ha)</div>
            <input className="form-input" value={farmArea} onChange={e => setFarmArea(e.target.value)} style={{ marginTop: 4 }} />
          </div>
          <div>
            <div className="stat-label">Crop Type</div>
            <select className="form-select" value={cropType} onChange={e => setCropType(e.target.value)} style={{ marginTop: 4 }}>
              <option>Rice</option><option>Wheat</option><option>Maize</option><option>Cotton</option><option>Sugarcane</option>
            </select>
          </div>
          <div>
            <div className="stat-label">Soil Health</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#16a34a", marginTop: 8 }}>Good (78/100)</div>
          </div>
          <div>
            <div className="stat-label">Current NDVI</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#16a34a", marginTop: 8 }}>0.76 (Healthy)</div>
          </div>
        </div>
      </div>

      {/* Output Cards */}
      <div className="grid-3" style={{ marginBottom: 16 }}>
        {[
          { label: "Expected Yield", value: `${expectedYield.toLocaleString()} kg/ha`, icon: "🌾", color: "#16a34a", sub: "+12% vs last year", subIcon: <ArrowUpRight size={12} /> },
          { label: "Yield Confidence", value: `${confidence}%`, icon: "🎯", color: "#3b82f6", sub: "High confidence", subIcon: null },
          { label: "Best Harvest Date", value: harvestDate, icon: "📅", color: "#ea580c", sub: "Window: 22-28 Oct", subIcon: null },
          { label: "Est. Production", value: `${totalProduction} tons`, icon: "📦", color: "#8b5cf6", sub: `${farmArea} ha × ${expectedYield} kg/ha`, subIcon: null },
          { label: "Expected Quality", value: qualityGrade, icon: "⭐", color: "#f59e0b", sub: "Premium market eligible", subIcon: null },
          { label: "vs Regional Avg", value: "+15.4%", icon: "📊", color: "#16a34a", sub: "Above district average", subIcon: <ArrowUpRight size={12} /> },
        ].map((card, i) => (
          <motion.div key={i} className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div className="stat-label">{card.label}</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: card.color, marginTop: 4 }}>{card.value}</div>
                <div style={{ fontSize: 11, color: card.color, marginTop: 4, display: "flex", alignItems: "center", gap: 4, fontWeight: 600 }}>
                  {card.subIcon} {card.sub}
                </div>
              </div>
              <span style={{ fontSize: 32 }}>{card.icon}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid-2" style={{ marginBottom: 16 }}>
        <div className="card">
          <div className="section-title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <TrendingUp size={14} color="#16a34a" /> Historical Yield Trend
          </div>
          <div style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={historicalYield} margin={{ top: 5, right: 10, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="yf_actual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16a34a" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="yf_pred" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fill: "#9ca3af", fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#9ca3af", fontSize: 12 }} domain={[3000, 5000]} />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Area type="monotone" dataKey="actual" name="Actual Yield" stroke="#16a34a" strokeWidth={3} fill="url(#yf_actual)" connectNulls={false} />
                <Area type="monotone" dataKey="predicted" name="AI Predicted" stroke="#3b82f6" strokeWidth={2} strokeDasharray="5 5" fill="url(#yf_pred)" />
                <Area type="monotone" dataKey="regional" name="Regional Avg" stroke="#d97706" strokeWidth={1.5} fill="none" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="section-title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <BarChart3 size={14} color="#16a34a" /> Yield Comparison
          </div>
          <div style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData} margin={{ top: 5, right: 10, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#9ca3af", fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#9ca3af", fontSize: 12 }} domain={[0, 5000]} />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 12 }} />
                <Bar dataKey="yield" name="Yield (kg/ha)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* XAI Panel */}
      <div className="card-sm" style={{ background: "#f0fdf4", border: "1px solid #bbf7d0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8, fontSize: 12, fontWeight: 700, color: "#15803d", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          <Award size={14} /> AI Yield Analysis
        </div>
        <p style={{ fontSize: 13, color: "#1f2937", lineHeight: 1.6, margin: 0 }}>
          The yield forecast model integrates NDVI time-series (current: 0.76), Growing Degree Days (1850°C-days accumulated), soil nutrient status (N: 92 kg/ha), and precipitation patterns. Based on 342 similar historical profiles, the model predicts {expectedYield.toLocaleString()} kg/ha with {confidence}% confidence. The current trajectory exceeds the regional average by 15.4%, attributed to optimal fertilization timing and adequate irrigation management.
        </p>
      </div>

      <ModuleAIAdvisor
        moduleId="yield-forecast"
        moduleName="Yield Forecast"
        moduleIcon="🌾"
        contextData={{ cropType, farmArea, expectedYield, confidence, soilHealth: "78/100", ndvi: 0.76, harvestDate, totalProduction, qualityGrade, historicalYield }}
      />
    </div>
  );
}
