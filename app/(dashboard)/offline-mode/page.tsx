"use client";
import { useState, useEffect } from "react";
import { WifiOff, Wifi, HardDrive, RefreshCw, Download, CheckCircle2, AlertTriangle, Cloud, CloudOff, Smartphone, Zap, Database, ToggleLeft, ToggleRight } from "lucide-react";
import { motion } from "framer-motion";
import ModuleAIAdvisor from "@/components/ModuleAIAdvisor";

interface CachedModule {
  name: string; icon: string; size: string; lastSync: string;
  cached: boolean; essential: boolean;
}

const modules: CachedModule[] = [
  { name: "Farm Setup Data", icon: "🌾", size: "2.4 MB", lastSync: "2 min ago", cached: true, essential: true },
  { name: "Weather Forecast", icon: "🌤️", size: "1.1 MB", lastSync: "5 min ago", cached: true, essential: true },
  { name: "Soil Analysis Report", icon: "🏔️", size: "0.8 MB", lastSync: "10 min ago", cached: true, essential: true },
  { name: "NDVI/Satellite Data", icon: "🛰️", size: "12.5 MB", lastSync: "1 hour ago", cached: true, essential: false },
  { name: "AI Predictions Cache", icon: "🤖", size: "3.2 MB", lastSync: "15 min ago", cached: true, essential: true },
  { name: "Crop Prices", icon: "💰", size: "0.5 MB", lastSync: "30 min ago", cached: true, essential: false },
  { name: "Crop Timeline", icon: "📅", size: "0.3 MB", lastSync: "1 hour ago", cached: true, essential: false },
  { name: "Community Posts", icon: "💬", size: "4.8 MB", lastSync: "2 hours ago", cached: false, essential: false },
  { name: "Historical Analytics", icon: "📊", size: "8.2 MB", lastSync: "3 hours ago", cached: false, essential: false },
  { name: "Helpline Numbers", icon: "📞", size: "0.1 MB", lastSync: "24 hours ago", cached: true, essential: true },
];

export default function OfflineModePage() {
  const [isOnline, setIsOnline] = useState(true);
  const [autoSync, setAutoSync] = useState(true);
  const [lowBandwidth, setLowBandwidth] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [moduleStates, setModuleStates] = useState(modules);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    if (typeof window !== "undefined") {
      setIsOnline(navigator.onLine);
      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);
      return () => { window.removeEventListener("online", handleOnline); window.removeEventListener("offline", handleOffline); };
    }
  }, []);

  const toggleModuleCache = (idx: number) => {
    setModuleStates(prev => prev.map((m, i) => i === idx ? { ...m, cached: !m.cached } : m));
  };

  const syncNow = () => {
    setSyncing(true);
    setTimeout(() => {
      setModuleStates(prev => prev.map(m => m.cached ? { ...m, lastSync: "Just now" } : m));
      setSyncing(false);
    }, 2000);
  };

  const cachedCount = moduleStates.filter(m => m.cached).length;
  const totalSize = moduleStates.filter(m => m.cached).reduce((acc, m) => acc + parseFloat(m.size), 0).toFixed(1);
  const storageUsed = 42;
  const storageTotal = 100;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
        <div>
          <div className="page-title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <WifiOff size={20} color="#8b5cf6" /> Offline Mode
          </div>
          <div className="page-subtitle">Manage offline data, sync settings, and low-bandwidth operation</div>
        </div>
        <span className={`badge ${isOnline ? "badge-green" : "badge-red"}`} style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 10px" }}>
          {isOnline ? <Wifi size={11} /> : <WifiOff size={11} />}
          {isOnline ? "Online" : "Offline"}
        </span>
      </div>

      {/* Status Banner */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="card"
        style={{
          marginBottom: 16, padding: "16px 24px",
          background: isOnline ? "linear-gradient(135deg, #064e3b, #065f46)" : "linear-gradient(135deg, #7f1d1d, #991b1b)",
          color: "white", border: `1px solid ${isOnline ? "#059669" : "#dc2626"}`,
        }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {isOnline ? <Cloud size={32} /> : <CloudOff size={32} />}
            <div>
              <div style={{ fontSize: 18, fontWeight: 700 }}>{isOnline ? "Connected — All Systems Online" : "Offline — Using Cached Data"}</div>
              <div style={{ fontSize: 12, opacity: 0.7 }}>{isOnline ? `${cachedCount} modules cached locally • Last sync: Just now` : "Working with locally stored data • Sync when connected"}</div>
            </div>
          </div>
          {isOnline && (
            <button onClick={syncNow} disabled={syncing}
              style={{ padding: "8px 20px", borderRadius: 10, background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)", color: "white", cursor: "pointer", fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
              <RefreshCw size={14} className={syncing ? "animate-spin" : ""} style={syncing ? { animation: "spin 1s linear infinite" } : {}} />
              {syncing ? "Syncing..." : "Sync Now"}
            </button>
          )}
        </div>
      </motion.div>

      {/* Controls & Storage */}
      <div className="grid-3" style={{ marginBottom: 16 }}>
        {/* Auto Sync */}
        <div className="card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <RefreshCw size={16} color="#16a34a" />
              <span style={{ fontSize: 14, fontWeight: 700, color: "var(--text-dark)" }}>Auto Sync</span>
            </div>
            <p style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.5, marginBottom: 12 }}>
              Automatically sync data when connected to Wi-Fi. Saves mobile data.
            </p>
          </div>
          <button onClick={() => setAutoSync(!autoSync)}
            style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            {autoSync ? <ToggleRight size={36} color="#16a34a" /> : <ToggleLeft size={36} color="#9ca3af" />}
            <span style={{ fontSize: 13, fontWeight: 600, color: autoSync ? "#16a34a" : "var(--text-muted)" }}>{autoSync ? "Enabled" : "Disabled"}</span>
          </button>
        </div>

        {/* Low Bandwidth */}
        <div className="card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <Smartphone size={16} color="#f59e0b" />
              <span style={{ fontSize: 14, fontWeight: 700, color: "var(--text-dark)" }}>Low Bandwidth Mode</span>
            </div>
            <p style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.5, marginBottom: 12 }}>
              Reduces image quality and disables animations. Ideal for 2G/3G networks.
            </p>
          </div>
          <button onClick={() => setLowBandwidth(!lowBandwidth)}
            style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            {lowBandwidth ? <ToggleRight size={36} color="#f59e0b" /> : <ToggleLeft size={36} color="#9ca3af" />}
            <span style={{ fontSize: 13, fontWeight: 600, color: lowBandwidth ? "#f59e0b" : "var(--text-muted)" }}>{lowBandwidth ? "Enabled" : "Disabled"}</span>
          </button>
        </div>

        {/* Storage */}
        <div className="card">
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <HardDrive size={16} color="#3b82f6" />
            <span style={{ fontSize: 14, fontWeight: 700, color: "var(--text-dark)" }}>Local Storage</span>
          </div>
          <div style={{ textAlign: "center", marginBottom: 12 }}>
            <div style={{ position: "relative", width: 80, height: 80, margin: "0 auto" }}>
              <svg width="80" height="80" style={{ transform: "rotate(-90deg)" }}>
                <circle cx="40" cy="40" r="32" stroke="var(--border-color)" strokeWidth="8" fill="none" />
                <circle cx="40" cy="40" r="32" stroke="#3b82f6" strokeWidth="8" fill="none"
                  strokeDasharray={`${(storageUsed / storageTotal) * 201} 201`} strokeLinecap="round" />
              </svg>
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 16, fontWeight: 800, color: "#3b82f6" }}>{storageUsed}%</span>
              </div>
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-dark)" }}>{totalSize} MB / {storageTotal} MB</div>
            <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{cachedCount}/{moduleStates.length} modules cached</div>
          </div>
        </div>
      </div>

      {/* Module List */}
      <div className="card">
        <div className="section-title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Database size={14} color="#8b5cf6" /> Cached Data Inventory
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {moduleStates.map((mod, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
              style={{
                display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 10,
                background: mod.cached ? "#f0fdf4" : "var(--bg-card)",
                border: `1px solid ${mod.cached ? "#bbf7d0" : "var(--border-color)"}`,
              }}>
              <span style={{ fontSize: 20 }}>{mod.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-dark)" }}>{mod.name}</span>
                  {mod.essential && <span style={{ fontSize: 8, fontWeight: 700, color: "#dc2626", background: "#fee2e2", padding: "1px 6px", borderRadius: 6 }}>ESSENTIAL</span>}
                </div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
                  {mod.size} • Last sync: {mod.lastSync}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {mod.cached ? (
                  <span style={{ fontSize: 11, color: "#16a34a", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
                    <CheckCircle2 size={12} /> Cached
                  </span>
                ) : (
                  <span style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
                    <AlertTriangle size={12} /> Not cached
                  </span>
                )}
                <button onClick={() => toggleModuleCache(i)}
                  style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                  {mod.cached ?
                    <ToggleRight size={28} color="#16a34a" /> :
                    <ToggleLeft size={28} color="#9ca3af" />}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <ModuleAIAdvisor
        moduleId="offline-mode"
        moduleName="Offline Mode"
        moduleIcon="📶"
        contextData={{ networkStatus: "Online", syncStatus: "synced", cachedModules: 8, totalModules: 15, storageUsed: "47 MB", lastSync: "2 min ago" }}
      />
    </div>
  );
}
