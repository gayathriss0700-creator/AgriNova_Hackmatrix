"use client";
import { useState } from "react";
import { LineChart as LineChartIcon, TrendingUp, Calendar, Award, ArrowUpRight, ArrowDownRight, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import ModuleAIAdvisor from "@/components/ModuleAIAdvisor";

const crops = [
  { name: "Rice", today: 2180, unit: "₹/quintal", change: "+2.3%", positive: true, color: "#16a34a", msp: 2203 },
  { name: "Wheat", today: 2275, unit: "₹/quintal", change: "+1.8%", positive: true, color: "#f59e0b", msp: 2275 },
  { name: "Maize", today: 2090, unit: "₹/quintal", change: "-0.5%", positive: false, color: "#3b82f6", msp: 2090 },
  { name: "Cotton", today: 6620, unit: "₹/quintal", change: "+3.1%", positive: true, color: "#8b5cf6", msp: 7121 },
  { name: "Sugarcane", today: 315, unit: "₹/quintal", change: "+0.8%", positive: true, color: "#ea580c", msp: 315 },
  { name: "Soybean", today: 4600, unit: "₹/quintal", change: "-1.2%", positive: false, color: "#dc2626", msp: 4892 },
];

const sevenDayForecast = [
  { day: "Today", rice: 2180, wheat: 2275, maize: 2090 },
  { day: "Day 2", rice: 2195, wheat: 2280, maize: 2085 },
  { day: "Day 3", rice: 2210, wheat: 2290, maize: 2080 },
  { day: "Day 4", rice: 2225, wheat: 2285, maize: 2095 },
  { day: "Day 5", rice: 2240, wheat: 2300, maize: 2090 },
  { day: "Day 6", rice: 2250, wheat: 2310, maize: 2100 },
  { day: "Day 7", rice: 2260, wheat: 2305, maize: 2105 },
];

const thirtyDayForecast = [
  { week: "W1", price: 2180, lower: 2140, upper: 2220 },
  { week: "W2", price: 2240, lower: 2190, upper: 2290 },
  { week: "W3", price: 2280, lower: 2220, upper: 2340 },
  { week: "W4", price: 2320, lower: 2250, upper: 2390 },
];

export default function PriceForecastPage() {
  const [selectedCrop, setSelectedCrop] = useState("Rice");
  const crop = crops.find(c => c.name === selectedCrop) || crops[0];
  const bestDay = "Day 7";
  const bestPrice = 2260;
  const trendLabel = "Bullish";
  const confidence = 82;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
        <div>
          <div className="page-title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <LineChartIcon size={20} color="#16a34a" /> Commodity Price Forecast
          </div>
          <div className="page-subtitle">AI-powered market price prediction with optimal selling recommendations</div>
        </div>
      </div>

      {/* Today's Prices */}
      <div className="grid-3" style={{ marginBottom: 16 }}>
        {crops.map((c, i) => (
          <motion.div key={i} className="card" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            onClick={() => setSelectedCrop(c.name)}
            style={{ cursor: "pointer", border: selectedCrop === c.name ? `2px solid ${c.color}` : undefined }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div className="stat-label">{c.name}</div>
                <div style={{ fontSize: 26, fontWeight: 800, color: c.color, marginTop: 2 }}>₹{c.today.toLocaleString()}</div>
                <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{c.unit}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: c.positive ? "#16a34a" : "#dc2626", display: "flex", alignItems: "center", gap: 2 }}>
                  {c.positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  {c.change}
                </span>
                <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 4 }}>MSP: ₹{c.msp}</div>
              </div>
            </div>
            {/* Price vs MSP bar */}
            <div style={{ marginTop: 8 }}>
              <div style={{ width: "100%", height: 4, background: "var(--border-color)", borderRadius: 2 }}>
                <div style={{ width: `${Math.min(100, (c.today / c.msp) * 100)}%`, height: "100%", background: c.today >= c.msp ? "#16a34a" : "#dc2626", borderRadius: 2 }} />
              </div>
              <div style={{ fontSize: 10, color: c.today >= c.msp ? "#16a34a" : "#dc2626", fontWeight: 600, marginTop: 2 }}>
                {c.today >= c.msp ? "Above MSP ✓" : `Below MSP by ₹${c.msp - c.today}`}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Selling Recommendation */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ marginBottom: 16, background: "linear-gradient(135deg, #064e3b, #065f46)", color: "white", border: "1px solid #059669" }}>
        <div className="grid-4">
          <div>
            <div style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", opacity: 0.6, letterSpacing: "0.05em" }}>Best Selling Date</div>
            <div style={{ fontSize: 24, fontWeight: 800, marginTop: 4 }}>{bestDay}</div>
            <div style={{ fontSize: 11, opacity: 0.7 }}>Expected: ₹{bestPrice}/quintal</div>
          </div>
          <div>
            <div style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", opacity: 0.6, letterSpacing: "0.05em" }}>Market Trend</div>
            <div style={{ fontSize: 24, fontWeight: 800, marginTop: 4, color: "#86efac" }}>📈 {trendLabel}</div>
            <div style={{ fontSize: 11, opacity: 0.7 }}>Prices expected to rise</div>
          </div>
          <div>
            <div style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", opacity: 0.6, letterSpacing: "0.05em" }}>Forecast Confidence</div>
            <div style={{ fontSize: 24, fontWeight: 800, marginTop: 4 }}>{confidence}%</div>
            <div style={{ fontSize: 11, opacity: 0.7 }}>High confidence</div>
          </div>
          <div>
            <div style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", opacity: 0.6, letterSpacing: "0.05em" }}>Recommendation</div>
            <div style={{ fontSize: 16, fontWeight: 700, marginTop: 4, color: "#fde68a" }}>Hold & sell by {bestDay}</div>
            <div style={{ fontSize: 11, opacity: 0.7 }}>Potential gain: ₹80/quintal</div>
          </div>
        </div>
      </motion.div>

      {/* Charts */}
      <div className="grid-2" style={{ marginBottom: 16 }}>
        <div className="card">
          <div className="section-title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <TrendingUp size={14} color="#16a34a" /> 7-Day Price Forecast
          </div>
          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sevenDayForecast} margin={{ top: 5, right: 10, bottom: 0, left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#9ca3af", fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#9ca3af", fontSize: 12 }} domain={["auto", "auto"]} />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="rice" name="Rice" stroke="#16a34a" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="wheat" name="Wheat" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="maize" name="Maize" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="section-title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <BarChart3 size={14} color="#8b5cf6" /> 30-Day {selectedCrop} Forecast (with confidence band)
          </div>
          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={thirtyDayForecast} margin={{ top: 5, right: 10, bottom: 0, left: -10 }}>
                <defs>
                  <linearGradient id="pf_band" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16a34a" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fill: "#9ca3af", fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#9ca3af", fontSize: 12 }} domain={["auto", "auto"]} />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 12 }} />
                <Area type="monotone" dataKey="upper" name="Upper Bound" stroke="none" fill="#16a34a" fillOpacity={0.08} />
                <Area type="monotone" dataKey="lower" name="Lower Bound" stroke="none" fill="#16a34a" fillOpacity={0.08} />
                <Area type="monotone" dataKey="price" name="Forecast" stroke="#16a34a" strokeWidth={3} fill="url(#pf_band)" dot={{ r: 5 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Multi-crop Table */}
      <div className="card">
        <div className="section-title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Award size={14} color="#f59e0b" /> Multi-Crop Price Comparison
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: "2px solid var(--border-color)" }}>
                {["Commodity", "Today's Price", "MSP", "vs MSP", "7-Day Trend", "Recommendation"].map(h => (
                  <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontWeight: 700, fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {crops.map((c, i) => (
                <tr key={i} style={{ borderBottom: "1px solid var(--border-color)" }}>
                  <td style={{ padding: "10px 14px", fontWeight: 600, color: c.color }}>{c.name}</td>
                  <td style={{ padding: "10px 14px", fontWeight: 700, color: "var(--text-dark)" }}>₹{c.today.toLocaleString()}</td>
                  <td style={{ padding: "10px 14px", color: "var(--text-muted)" }}>₹{c.msp.toLocaleString()}</td>
                  <td style={{ padding: "10px 14px" }}>
                    <span className={`badge ${c.today >= c.msp ? "badge-green" : "badge-red"}`}>
                      {c.today >= c.msp ? "Above" : "Below"}
                    </span>
                  </td>
                  <td style={{ padding: "10px 14px", color: c.positive ? "#16a34a" : "#dc2626", fontWeight: 600 }}>
                    {c.positive ? "↗ Rising" : "↘ Falling"}
                  </td>
                  <td style={{ padding: "10px 14px", fontSize: 12, color: "var(--text-muted)" }}>
                    {c.positive ? "Hold for higher price" : "Sell now or wait"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ModuleAIAdvisor
        moduleId="price-forecast"
        moduleName="Price Forecast"
        moduleIcon="💰"
        contextData={{ selectedCrop, cropPrice: crop.today, msp: crop.msp, change: crop.change, bestDay, bestPrice, trendLabel, confidence, crops: crops.map(c => ({ name: c.name, today: c.today, msp: c.msp, change: c.change })) }}
      />
    </div>
  );
}
