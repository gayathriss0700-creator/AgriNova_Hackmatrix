"use client";
import { useState, useEffect } from "react";
import { Zap, Droplets, FlaskConical, TrendingUp, Bug, AlertTriangle, CalendarSync, CalendarClock, History, Target, Shield, Terminal, Signal, Lock, Cpu, Cloud, Activity, Satellite, CheckCircle2, BarChart3, CloudLightning } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import ModuleAIAdvisor from "@/components/ModuleAIAdvisor";

/* ─── XAI Insight Panel (matches .card-sm style) ─── */
const XAIPanel = ({ confidence, reason, indicators, satellite }: { confidence: number; reason: string; indicators: string[]; satellite: string }) => {
  const [loading, setLoading] = useState(true);
  useEffect(() => { setLoading(true); const t = setTimeout(() => setLoading(false), 1500); return () => clearTimeout(t); }, [confidence, reason]);

  if (loading) {
    return (
      <div className="card-sm" style={{ minHeight: 140, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--green-primary)', fontSize: 13, fontWeight: 500 }}>
          <Satellite size={16} className="animate-spin" /> Analyzing satellite & sensor data...
        </div>
        <div style={{ width: '60%', height: 4, background: 'var(--border-color)', borderRadius: 4, overflow: 'hidden' }}>
          <div style={{ width: '70%', height: '100%', background: 'var(--green-primary)', borderRadius: 4 }} className="animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="card-sm" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: '#15803d', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          <Terminal size={14} /> XAI Insight
        </div>
        <span className="badge badge-green" style={{ fontSize: 11 }}>{confidence}% confidence</span>
      </div>
      <p style={{ fontSize: 13, color: '#1f2937', lineHeight: 1.5, marginBottom: 8 }}>{reason}</p>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
          <strong style={{ color: '#374151' }}>Indicators:</strong> {indicators.join(", ")}
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
          <strong style={{ color: '#374151' }}>Satellite:</strong> {satellite}
        </div>
      </div>
    </div>
  );
};

/* ─── Risk Gauge (SVG circle) ─── */
const RiskGauge = ({ label, value, type }: { label: string; value: number; type: 'low' | 'med' | 'high' }) => {
  const color = type === 'high' ? '#dc2626' : type === 'med' ? '#eab308' : '#16a34a';
  const bg = type === 'high' ? '#fee2e2' : type === 'med' ? '#fef9c3' : '#dcfce7';
  const textColor = type === 'high' ? '#dc2626' : type === 'med' ? '#b45309' : '#15803d';
  const badgeClass = type === 'high' ? 'badge badge-red' : type === 'med' ? 'badge badge-yellow' : 'badge badge-green';

  return (
    <div className="card-sm" style={{ textAlign: 'center', padding: 16 }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>{label}</div>
      <div style={{ position: 'relative', width: 80, height: 80, margin: '0 auto 8px' }}>
        <svg width="80" height="80" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="40" cy="40" r="32" stroke="var(--border-color)" strokeWidth="6" fill="none" />
          <circle cx="40" cy="40" r="32" stroke={color} strokeWidth="6" fill="none"
            strokeDasharray={`${(value / 100) * 201} 201`} strokeLinecap="round"
            style={{ transition: 'stroke-dasharray 0.6s ease' }} />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: 18, fontWeight: 700, color: textColor }}>{Math.round(value)}</span>
        </div>
      </div>
      <span className={badgeClass}>{type === 'high' ? 'Critical' : type === 'med' ? 'Warning' : 'Safe'}</span>
    </div>
  );
};

export default function PrecisionEnginePage() {
  const [activeTab, setActiveTab] = useState<"soil" | "yield" | "harvest" | "climate">("soil");
  const [networkMode, setNetworkMode] = useState<"online" | "low_bandwidth" | "offline">("online");
  const [smsSent, setSmsSent] = useState(false);
  const [tempOffset, setTempOffset] = useState(0);
  const [iotData, setIotData] = useState({ moisture: 38, temp: 32.0, humidity: 55, wind: 12 });

  useEffect(() => {
    if (networkMode !== "online") return;
    const interval = setInterval(() => {
      setIotData(prev => ({
        moisture: Math.max(0, Math.min(100, prev.moisture + (Math.random() > 0.5 ? 1 : -1))),
        temp: +(prev.temp + (Math.random() > 0.5 ? 0.1 : -0.1)).toFixed(1),
        humidity: Math.max(0, Math.min(100, prev.humidity + (Math.random() > 0.5 ? 1 : -1))),
        wind: Math.max(0, prev.wind + (Math.random() > 0.5 ? 1 : -1))
      }));
    }, 2500);
    return () => clearInterval(interval);
  }, [networkMode]);

  const yieldData = [
    { year: '2020', yield: 3800 }, { year: '2021', yield: 3950 }, { year: '2022', yield: 3700 },
    { year: '2023', yield: 4100 }, { year: '2024', yield: 3900 }, { year: '2025', yield: 4250 },
  ];

  const tabs = [
    { id: 'soil' as const, icon: <Droplets size={14} />, label: 'Soil & Irrigation' },
    { id: 'yield' as const, icon: <TrendingUp size={14} />, label: 'Yield & Pest Risk' },
    { id: 'harvest' as const, icon: <CalendarSync size={14} />, label: 'Harvest & Rotation' },
    { id: 'climate' as const, icon: <Shield size={14} />, label: 'Risk Dashboard' },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
        <div>
          <div className="page-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Zap size={20} color="#16a34a" /> AI Precision Engine
          </div>
          <div className="page-subtitle">Hyper-local climate intelligence & precision agriculture decision support</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <ModuleAIAdvisor 
            moduleId="precision" 
            moduleName="Precision Ag Specialist" 
            moduleIcon="🎯" 
            contextData={{
              activeTab,
              networkMode,
              iotData,
              yieldData
            }}
          />
          <div className="badge badge-green" style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px' }}>
            <Lock size={11} /> AES-256 Secured
          </div>
          <select
            value={networkMode}
            onChange={e => setNetworkMode(e.target.value as any)}
            className="form-input"
            style={{ width: 'auto', padding: '4px 10px', fontSize: 12, fontWeight: 500, borderRadius: 8 }}
          >
            <option value="online">⚡ Online</option>
            <option value="low_bandwidth">📡 Low Bandwidth</option>
            <option value="offline">📵 Offline</option>
          </select>
        </div>
      </div>

      {/* Offline / Low-Band Alerts */}
      {networkMode === 'offline' && (
        <div className="card" style={{ marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fef2f2', borderColor: '#fecaca', padding: '14px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <AlertTriangle size={18} color="#dc2626" />
            <div>
              <div style={{ fontWeight: 600, fontSize: 14, color: '#991b1b' }}>Offline Mode Active</div>
              <div style={{ fontSize: 12, color: '#b91c1c' }}>Displaying cached predictions. Live IoT telemetry paused.</div>
            </div>
          </div>
          <button className="btn" onClick={() => setSmsSent(true)}
            style={{ background: smsSent ? '#16a34a' : 'white', color: smsSent ? 'white' : '#dc2626', border: smsSent ? 'none' : '1px solid #fca5a5', fontSize: 12 }}>
            {smsSent ? '✓ SMS Sent' : 'Request SMS Advisory'}
          </button>
        </div>
      )}
      {networkMode === 'low_bandwidth' && (
        <div className="card" style={{ marginBottom: 16, background: '#fefce8', borderColor: '#fde68a', padding: '10px 20px', fontSize: 13, color: '#92400e', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Zap size={14} color="#d97706" /> <strong>Low Bandwidth Mode:</strong> High-res satellite imagery disabled. Data compressed.
        </div>
      )}

      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap' }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={activeTab === tab.id ? 'btn btn-green' : 'btn btn-outline'}
            style={{ fontSize: 12, padding: '7px 14px', borderRadius: 8 }}>
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>

          {/* ═══ TAB 1: SOIL & IRRIGATION ═══ */}
          {activeTab === 'soil' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="card">
                <div className="section-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Zap size={14} color="#16a34a" /> Live IoT Sensor Dashboard
                </div>
                <div className="grid-3">
                  {[
                    { label: 'Soil Moisture', val: `${iotData.moisture}%`, sub: iotData.moisture < 40 ? '↓ Low' : 'Normal', subColor: iotData.moisture < 40 ? '#dc2626' : '#16a34a' },
                    { label: 'Soil pH', val: '6.8', sub: 'Optimal', subColor: '#16a34a' },
                    { label: 'Temperature', val: `${iotData.temp}°C`, sub: 'Normal', subColor: '#d97706' },
                    { label: 'Humidity', val: `${iotData.humidity}%`, sub: 'Normal', subColor: '#2563eb' },
                    { label: 'Rainfall (24h)', val: '0 mm', sub: 'Dry', subColor: '#6b7280' },
                    { label: 'Wind Speed', val: `${iotData.wind} km/h`, sub: 'Breezy', subColor: '#6b7280' },
                  ].map((s, i) => (
                    <div key={i} className="card-sm">
                      <div className="stat-label">{s.label}</div>
                      <div className="stat-value">{s.val}</div>
                      <div style={{ fontSize: 11, fontWeight: 600, color: s.subColor, marginTop: 4 }}>{s.sub}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid-2">
                <div className="card">
                  <div className="section-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Droplets size={14} color="#2563eb" /> Smart Irrigation
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Status:</span>
                    <span className="badge badge-red">Action Required</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13, color: '#374151', marginBottom: 12 }}>
                    <div><strong>Water Quantity:</strong> 15 mm / Acre</div>
                    <div><strong>Optimal Window:</strong> 5:00 AM – 7:00 AM</div>
                    <div><strong>Next Schedule:</strong> In 3 Days</div>
                  </div>
                  <div style={{ background: '#fefce8', border: '1px solid #fde68a', borderRadius: 8, padding: 12, fontSize: 12, color: '#92400e' }}>
                    💡 Use drip irrigation targeting the root zone. Avoid overhead sprinklers at 32°C.
                  </div>
                  <div style={{ marginTop: 12 }}>
                    <XAIPanel confidence={92} reason="Soil moisture dropped below critical wilting point (38%). High temperature accelerates evapotranspiration."
                      indicators={["Soil Moisture 38%", "Temp 32°C", "Rain 0mm"]} satellite="NDWI shows deep red stress in Sector B." />
                  </div>
                </div>

                <div className="card">
                  <div className="section-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <FlaskConical size={14} color="#16a34a" /> Fertilizer Engine
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13, color: '#374151', marginBottom: 12 }}>
                    <div><strong>Recommendation:</strong> Urea (46% N) + DAP</div>
                    <div><strong>Dosage:</strong> 45 kg/ha (Urea), 20 kg/ha (DAP)</div>
                    <div><strong>Application:</strong> After irrigation (Evening)</div>
                  </div>
                  <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, padding: 12, fontSize: 12, color: '#15803d' }}>
                    🌱 <strong>Organic Alternative:</strong> Vermicompost (2 tons/ha) + Neem Cake (200 kg/ha)
                  </div>
                  <div style={{ marginTop: 12 }}>
                    <XAIPanel confidence={88} reason="Nitrogen at 78 kg/ha, below the 90 kg/ha target for optimal tillering."
                      indicators={["N: 78", "P: 42", "pH: 6.8"]} satellite="EVI shows slight yellowing in north quadrant." />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ═══ TAB 2: YIELD & PEST RISK ═══ */}
          {activeTab === 'yield' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="card">
                <div className="section-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <BarChart3 size={14} color="#16a34a" /> Crop Yield Forecasting
                </div>
                <div className="grid-2">
                  <div style={{ height: 220 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={yieldData} margin={{ top: 5, right: 10, bottom: 0, left: -20 }}>
                        <defs>
                          <linearGradient id="yieldGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#16a34a" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                        <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} domain={['dataMin - 100', 'dataMax + 100']} />
                        <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} />
                        <Area type="monotone" dataKey="yield" stroke="#16a34a" strokeWidth={3} fillOpacity={1} fill="url(#yieldGrad)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 12 }}>
                    <div className="card-sm" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                      <div className="stat-label">Expected Yield</div>
                      <div className="stat-value stat-positive">4,250 kg/ha</div>
                    </div>
                    <div className="card-sm">
                      <div className="stat-label">vs Last Year</div>
                      <div className="stat-value stat-positive">+12%</div>
                      <div style={{ fontSize: 11, color: '#16a34a', marginTop: 2 }}>↑ Above regional average</div>
                    </div>
                  </div>
                </div>
                <div style={{ marginTop: 12 }}>
                  <XAIPanel confidence={85} reason="Ideal pH and targeted fertilization offset the mild moisture stress early in the season."
                    indicators={["NDVI 0.72 avg", "GDD: 1200"]} satellite="NDVI timeline shows robust vegetative growth." />
                </div>
              </div>

              <div className="grid-2">
                <div className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <div className="section-title" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 0 }}>
                      <Bug size={14} color="#dc2626" /> Pest Outbreak Prediction
                    </div>
                    <span className="badge badge-red">75% Risk</span>
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: '#1f2937', marginBottom: 4 }}>Fall Armyworm (FAW)</div>
                  <div style={{ width: '100%', height: 6, background: '#e5e7eb', borderRadius: 4, marginBottom: 8 }}>
                    <div style={{ width: '75%', height: '100%', background: '#dc2626', borderRadius: 4 }} />
                  </div>
                  <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: 12, fontSize: 12, color: '#991b1b', marginBottom: 12 }}>
                    <strong>Prevention:</strong> Set up pheromone traps. Apply Neem oil (10000 ppm) at 3ml/L.
                  </div>
                  <XAIPanel confidence={89} reason="Dry days followed by high humidity creates perfect microclimate for FAW hatching."
                    indicators={["Humidity > 70%", "Temp 28-32°C"]} satellite="SAR imagery detects irregular canopy density." />
                </div>

                <div className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <div className="section-title" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 0 }}>
                      <AlertTriangle size={14} color="#d97706" /> Disease Risk Prediction
                    </div>
                    <span className="badge badge-yellow">Pre-Infection</span>
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: '#1f2937', marginBottom: 4 }}>Northern Corn Leaf Blight</div>
                  <div style={{ width: '100%', height: 6, background: '#e5e7eb', borderRadius: 4, marginBottom: 4 }}>
                    <div style={{ width: '62%', height: '100%', background: '#eab308', borderRadius: 4 }} />
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#b45309', marginBottom: 8 }}>62% Probability</div>
                  <div style={{ background: '#fefce8', border: '1px solid #fde68a', borderRadius: 8, padding: 12, fontSize: 12, color: '#92400e', marginBottom: 12 }}>
                    <strong>Prevention:</strong> Improve canopy airflow. Apply Mancozeb 75% WP before next rain.
                  </div>
                  <XAIPanel confidence={82} reason="Prolonged leaf wetness (>8h) and moderate temps (20-25°C) favor fungal germination."
                    indicators={["Leaf Wetness > 8h", "Temp 22°C"]} satellite="Multispectral: no symptoms yet; purely predictive." />
                </div>
              </div>
            </div>
          )}

          {/* ═══ TAB 3: HARVEST & ROTATION ═══ */}
          {activeTab === 'harvest' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="card">
                <div className="section-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <CalendarClock size={14} color="#ea580c" /> Harvest Planner & Crop Calendar
                </div>

                {/* Timeline */}
                <div style={{ position: 'relative', margin: '24px 0 32px', padding: '0 8px' }}>
                  <div style={{ position: 'absolute', top: '50%', left: 0, width: '100%', height: 3, background: '#e5e7eb', transform: 'translateY(-50%)', zIndex: 0 }} />
                  <div style={{ position: 'absolute', top: '50%', left: 0, width: '80%', height: 3, background: '#ea580c', transform: 'translateY(-50%)', zIndex: 0 }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1 }}>
                    {['Sowing', 'Germination', 'Vegetative', 'Flowering'].map(step => (
                      <div key={step} style={{ textAlign: 'center', width: 64 }}>
                        <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#ea580c', margin: '0 auto 6px', border: '2px solid white', boxShadow: '0 0 0 1px #ea580c' }} />
                        <div style={{ fontSize: 10, fontWeight: 600, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.02em' }}>{step}</div>
                      </div>
                    ))}
                    <div style={{ textAlign: 'center', width: 64 }}>
                      <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#ea580c', color: 'white', margin: '0 auto 6px', border: '3px solid white', boxShadow: '0 0 0 1px #ea580c, 0 0 8px rgba(234,88,12,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700 }}>5</div>
                      <div style={{ fontSize: 10, fontWeight: 700, color: '#ea580c', textTransform: 'uppercase' }}>Fruiting</div>
                    </div>
                    <div style={{ textAlign: 'center', width: 64 }}>
                      <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#d1d5db', margin: '0 auto 6px', border: '2px solid white' }} />
                      <div style={{ fontSize: 10, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase' }}>Harvest</div>
                    </div>
                  </div>
                </div>

                <div className="grid-4" style={{ marginBottom: 16 }}>
                  {[
                    { label: 'Harvest Readiness', val: '75%', color: '#ea580c' },
                    { label: 'Best Harvest Date', val: '24th Oct 2026', color: '#1f2937' },
                    { label: 'Harvest Window', val: '22 Oct – 28 Oct', color: '#1f2937' },
                    { label: 'Market Price', val: '₹2250/q 📈', color: '#16a34a' },
                  ].map((item, i) => (
                    <div key={i} className="card-sm">
                      <div className="stat-label">{item.label}</div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: item.color }}>{item.val}</div>
                    </div>
                  ))}
                </div>

                <XAIPanel confidence={91} reason="Grain filling is 80% complete based on Growing Degree Days (GDD)."
                  indicators={["GDD 1850/2100", "Moisture 18%"]} satellite="EVI declining normally, indicating natural senescence." />
              </div>

              <div className="card">
                <div className="section-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <History size={14} color="#16a34a" /> Historical Cultivation Records & AI Rotation
                </div>
                <div style={{ overflowX: 'auto', marginBottom: 16 }}>
                  <table style={{ width: '100%', fontSize: 13, textAlign: 'left', borderCollapse: 'collapse', minWidth: 650 }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                        {['Season', 'Crop', 'Yield', 'Fertilizer', 'Disease', 'Weather'].map(h => (
                          <th key={h} className="stat-label" style={{ padding: '8px 12px', marginBottom: 0 }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{ borderBottom: '1px solid #f3f4f6' }}><td style={{ padding: '8px 12px', fontWeight: 500 }}>Kharif &apos;25</td><td style={{ padding: '8px 12px' }}>Maize</td><td style={{ padding: '8px 12px', fontWeight: 600, color: '#16a34a' }}>4.1 t/ha</td><td style={{ padding: '8px 12px', color: '#6b7280' }}>Urea + DAP</td><td style={{ padding: '8px 12px', color: '#9ca3af' }}>None</td><td style={{ padding: '8px 12px', color: '#6b7280' }}>Normal Rain</td></tr>
                      <tr style={{ borderBottom: '1px solid #f3f4f6' }}><td style={{ padding: '8px 12px', fontWeight: 500 }}>Rabi &apos;25</td><td style={{ padding: '8px 12px' }}>Wheat</td><td style={{ padding: '8px 12px', fontWeight: 600, color: '#16a34a' }}>3.8 t/ha</td><td style={{ padding: '8px 12px', color: '#6b7280' }}>NPK 19:19</td><td style={{ padding: '8px 12px', color: '#d97706', fontWeight: 500 }}>Mild Rust</td><td style={{ padding: '8px 12px', color: '#6b7280' }}>Cold Wave</td></tr>
                      <tr><td style={{ padding: '8px 12px', fontWeight: 500 }}>Kharif &apos;24</td><td style={{ padding: '8px 12px' }}>Cotton</td><td style={{ padding: '8px 12px', fontWeight: 600, color: '#dc2626' }}>1.8 t/ha</td><td style={{ padding: '8px 12px', color: '#6b7280' }}>Urea</td><td style={{ padding: '8px 12px', color: '#dc2626', fontWeight: 500 }}>Bollworm</td><td style={{ padding: '8px 12px', color: '#d97706' }}>Drought</td></tr>
                    </tbody>
                  </table>
                </div>

                <div className="grid-2">
                  <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: 16 }}>
                    <div className="stat-label">AI Recommendation</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#14532d', marginBottom: 12 }}>Plant Legumes (Chickpea)</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13, color: '#15803d' }}>
                      <div style={{ display: 'flex', alignItems: 'start', gap: 6 }}><CheckCircle2 size={14} style={{ marginTop: 2, flexShrink: 0 }} /> <span><strong>Soil-friendly:</strong> Fixes atmospheric N, breaks pest cycles.</span></div>
                      <div style={{ display: 'flex', alignItems: 'start', gap: 6 }}><CheckCircle2 size={14} style={{ marginTop: 2, flexShrink: 0 }} /> <span><strong>Profitability:</strong> Est. ₹45,000/acre.</span></div>
                      <div style={{ display: 'flex', alignItems: 'start', gap: 6 }}><CheckCircle2 size={14} style={{ marginTop: 2, flexShrink: 0 }} /> <span><strong>Sustainability:</strong> 9.5/10 Rating.</span></div>
                    </div>
                  </div>
                  <XAIPanel confidence={94} reason="Continuous cereal cropping depletes soil Nitrogen. A legume break crop is critical."
                    indicators={["N: 78 (Low)", "Soil OC: 0.6%"]} satellite="NDVI shows declining peak biomass over 3 seasons." />
                </div>
              </div>
            </div>
          )}

          {/* ═══ TAB 4: RISK DASHBOARD ═══ */}
          {activeTab === 'climate' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="card">
                <div className="section-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Cloud size={14} color="#6b7280" /> Climate & Bio-Threat Simulator
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>Real-time holistic risk assessment across 8 vectors.</div>

                <div className="grid-2" style={{ marginBottom: 20 }}>
                  {/* Overall Score */}
                  <div className="card-sm" style={{ background: 'linear-gradient(135deg, #064e3b, #065f46)', color: 'white', border: '1px solid #059669' }}>
                    <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', opacity: 0.7, marginBottom: 8 }}>Overall Risk Score</div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                      <span style={{ fontSize: 48, fontWeight: 800, lineHeight: 1 }}>{Math.round(Math.min(100, Math.max(0, 58 + tempOffset * 8)))}</span>
                      <span style={{ fontSize: 16, opacity: 0.5 }}>/100</span>
                    </div>
                    <div style={{ marginTop: 8, display: 'inline-block', padding: '3px 10px', borderRadius: 12, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em',
                      background: 58 + tempOffset * 8 > 75 ? 'rgba(239,68,68,0.25)' : 58 + tempOffset * 8 > 50 ? 'rgba(234,179,8,0.25)' : 'rgba(34,197,94,0.25)',
                      color: 58 + tempOffset * 8 > 75 ? '#fca5a5' : 58 + tempOffset * 8 > 50 ? '#fde68a' : '#86efac'
                    }}>
                      {58 + tempOffset * 8 > 75 ? 'Critical' : 58 + tempOffset * 8 > 50 ? 'Elevated' : 'Normal'}
                    </div>
                  </div>

                  {/* Simulator */}
                  <div className="card-sm">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14, color: '#1f2937' }}>Interactive Climate Modeler</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Drag to simulate temperature shifts</div>
                      </div>
                      <div style={{ fontSize: 22, fontWeight: 700, color: '#2563eb', background: '#eff6ff', padding: '4px 12px', borderRadius: 8, border: '1px solid #bfdbfe' }}>
                        {tempOffset > 0 ? '+' : ''}{tempOffset}°C
                      </div>
                    </div>
                    <input type="range" min="-2" max="5" step="0.5" value={tempOffset} onChange={e => setTempOffset(parseFloat(e.target.value))}
                      style={{ width: '100%', accentColor: '#16a34a' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text-muted)', fontWeight: 500, marginTop: 6 }}>
                      <span>-2°C (Cooler)</span><span>Current</span><span>+5°C (Heatwave)</span>
                    </div>
                  </div>
                </div>

                <div className="grid-4">
                  <RiskGauge label="Heatwave" value={Math.min(100, Math.max(0, 40 + tempOffset * 18))} type={40 + tempOffset * 18 > 80 ? 'high' : 40 + tempOffset * 18 > 50 ? 'med' : 'low'} />
                  <RiskGauge label="Drought" value={Math.min(100, Math.max(0, 30 + tempOffset * 12))} type={30 + tempOffset * 12 > 80 ? 'high' : 30 + tempOffset * 12 > 50 ? 'med' : 'low'} />
                  <RiskGauge label="Heavy Rain" value={Math.min(100, Math.max(0, 45 - tempOffset * 5))} type={45 - tempOffset * 5 > 80 ? 'high' : 45 - tempOffset * 5 > 50 ? 'med' : 'low'} />
                  <RiskGauge label="Flood" value={Math.min(100, Math.max(0, 12 - tempOffset * 2))} type={12 - tempOffset * 2 > 80 ? 'high' : 12 - tempOffset * 2 > 50 ? 'med' : 'low'} />
                  <RiskGauge label="Cyclone" value={18} type="low" />
                  <RiskGauge label="Frost" value={Math.min(100, Math.max(0, 5 - tempOffset * 10))} type={5 - tempOffset * 10 > 50 ? 'high' : 5 - tempOffset * 10 > 25 ? 'med' : 'low'} />
                  <RiskGauge label="Pest (FAW)" value={Math.min(100, Math.max(0, 75 + tempOffset * 8))} type={75 + tempOffset * 8 > 80 ? 'high' : 75 + tempOffset * 8 > 50 ? 'med' : 'low'} />
                  <RiskGauge label="Disease" value={Math.min(100, Math.max(0, 62 - tempOffset * 5))} type={62 - tempOffset * 5 > 80 ? 'high' : 62 - tempOffset * 5 > 50 ? 'med' : 'low'} />
                </div>
              </div>
            </div>
          )}

        </motion.div>
      </AnimatePresence>
    </div>
  );
}
