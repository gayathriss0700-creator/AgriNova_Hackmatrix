"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { Globe, Layers, MapPin, Activity, Eye, EyeOff, ChevronDown, ChevronUp, Info, Maximize2, ZoomIn, ZoomOut, Satellite, Leaf, Sprout, Mountain, Cloud, Bug, ShieldAlert, Waves, Sun, Flame, LucideIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ModuleAIAdvisor from "@/components/ModuleAIAdvisor";
import dynamic from "next/dynamic";

const GISMap = dynamic(() => import("@/components/GISMap"), { ssr: false, loading: () => <div style={{width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#0f172a", color: "white"}}>Initializing GIS Engine...</div> });

/* ─── Types ─── */
interface LayerConfig {
  id: string;
  name: string;
  icon: LucideIcon;
  color: string;
  description: string;
  enabled: boolean;
  gradient: string[];
  unit: string;
}

/* ─── Farm center (default: Chithilappilly) ─── */
const FARM_CENTER: [number, number] = [10.5694, 76.1764];
const FARM_BOUNDARY: [number, number][] = [
  [10.570, 76.175], [10.571, 76.177], [10.569, 76.178],
  [10.567, 76.177], [10.566, 76.175], [10.568, 76.174],
];

/* ─── Layer definitions ─── */
const defaultLayers: LayerConfig[] = [
  { id: "satellite", name: "Satellite", icon: Satellite, color: "#3b82f6", description: "High-resolution satellite imagery", enabled: true, gradient: [], unit: "" },
  { id: "ndvi", name: "NDVI", icon: Leaf, color: "#22c55e", description: "Normalized Difference Vegetation Index", enabled: false, gradient: ["#d73027", "#fc8d59", "#fee08b", "#d9ef8b", "#1a9850"], unit: "Index" },
  { id: "evi", name: "EVI", icon: Sprout, color: "#16a34a", description: "Enhanced Vegetation Index (Simulated)", enabled: false, gradient: ["#a50026", "#f46d43", "#fdae61", "#a6d96a", "#006837"], unit: "Index" },
  { id: "soil", name: "Soil", icon: Mountain, color: "#92400e", description: "Soil composition & moisture layer", enabled: false, gradient: ["#f6e8c3", "#d8b365", "#8c510a", "#543005"], unit: "Moisture %" },
  { id: "weather", name: "Weather", icon: Cloud, color: "#0ea5e9", description: "Real-time weather overlay", enabled: false, gradient: ["#2166ac", "#67a9cf", "#f7f7f7", "#ef8a62", "#b2182b"], unit: "°C" },
  { id: "pest", name: "Pest Risk", icon: Bug, color: "#ef4444", description: "Predicted pest outbreak zones", enabled: false, gradient: ["#fee5d9", "#fcae91", "#fb6a4a", "#cb181d"], unit: "Risk %" },
  { id: "disease", name: "Disease", icon: ShieldAlert, color: "#dc2626", description: "Disease susceptibility zones", enabled: false, gradient: ["#edf8e9", "#bae4b3", "#74c476", "#238b45"], unit: "Severity" },
  { id: "flood", name: "Flood", icon: Waves, color: "#2563eb", description: "Flood risk assessment", enabled: false, gradient: ["#f7fbff", "#c6dbef", "#6baed6", "#2171b5"], unit: "Risk %" },
  { id: "drought", name: "Drought", icon: Sun, color: "#f59e0b", description: "Drought stress indicator", enabled: false, gradient: ["#ffffd4", "#fed98e", "#fe9929", "#cc4c02"], unit: "SPI" },
  { id: "heat", name: "Heat Stress", icon: Flame, color: "#dc2626", description: "Land surface temperature anomaly", enabled: false, gradient: ["#2166ac", "#67a9cf", "#fddbc7", "#ef8a62", "#b2182b"], unit: "°C" },
];

/* ─── Simulated zone data for popups & polygons ─── */
const zoneData = [
  { pos: [10.5698, 76.1755] as [number, number], name: "Zone A - North Field", ndvi: 0.78, health: "Good", crop: "Rice", area: "2.1 ha", moisture: 42,
    bounds: [[10.570, 76.175], [10.571, 76.176], [10.569, 76.177], [10.568, 76.175]] as [number, number][]
  },
  { pos: [10.5685, 76.1765] as [number, number], name: "Zone B - Central", ndvi: 0.65, health: "Moderate", crop: "Rice", area: "1.8 ha", moisture: 35,
    bounds: [[10.569, 76.177], [10.571, 76.177], [10.568, 76.178], [10.567, 76.176]] as [number, number][]
  },
  { pos: [10.5675, 76.1755] as [number, number], name: "Zone C - South Field", ndvi: 0.82, health: "Excellent", crop: "Maize", area: "1.5 ha", moisture: 48,
    bounds: [[10.568, 76.175], [10.567, 76.176], [10.566, 76.175], [10.567, 76.174]] as [number, number][]
  },
];

/* Helper to get color based on layer & zone value */
function getZoneColor(layerId: string, zone: typeof zoneData[0]) {
  if (layerId === "ndvi") {
    if (zone.ndvi > 0.8) return "#1a9850";
    if (zone.ndvi > 0.7) return "#a6d96a";
    return "#fdae61";
  }
  if (layerId === "soil") {
    if (zone.moisture > 45) return "#543005";
    if (zone.moisture > 40) return "#8c510a";
    return "#d8b365";
  }
  if (layerId === "pest") {
    if (zone.ndvi < 0.7) return "#cb181d";
    return "#fee5d9";
  }
  return "#22c55e"; // default
}

/* Helper to generate a procedural GIS raster grid overlay */
function generateRasterGrid(layerId: string) {
  const grid = [];
  const minLat = 11.012;
  const maxLat = 11.023;
  const minLng = 76.950;
  const maxLng = 76.963;
  const rows = 35;
  const cols = 35;
  const latStep = (maxLat - minLat) / rows;
  const lngStep = (maxLng - minLng) / cols;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const lat1 = minLat + r * latStep;
      const lat2 = lat1 + latStep;
      const lng1 = minLng + c * lngStep;
      const lng2 = lng1 + lngStep;
      
      // Mathematical noise functions to simulate natural distributions
      const noise = Math.sin(r * 0.3) * Math.cos(c * 0.3) + Math.sin((r + c) * 0.15);
      const normNoise = (noise + 2) / 4; // Normalized roughly 0 to 1

      let color = "#ffffff";
      let opacity = 0.5;

      if (layerId === "ndvi" || layerId === "evi") {
        color = normNoise > 0.7 ? "#16a34a" : normNoise > 0.4 ? "#84cc16" : "#eab308";
        opacity = 0.65;
      } else if (layerId === "soil") {
        color = normNoise > 0.6 ? "#451a03" : normNoise > 0.3 ? "#92400e" : "#d97706";
        opacity = 0.75;
      } else if (layerId === "pest") {
        color = normNoise > 0.8 ? "#ef4444" : normNoise > 0.65 ? "#f87171" : "transparent";
        opacity = normNoise > 0.65 ? 0.7 : 0;
      } else if (layerId === "disease") {
        color = normNoise < 0.2 ? "#991b1b" : normNoise < 0.35 ? "#dc2626" : "transparent";
        opacity = normNoise < 0.35 ? 0.7 : 0;
      } else if (layerId === "flood") {
        // Gradient focused on the lower terrain (bottom right)
        const floodRisk = (rows - r + c) / (rows + cols);
        color = floodRisk > 0.7 ? "#1e3a8a" : floodRisk > 0.55 ? "#2563eb" : "transparent";
        opacity = floodRisk > 0.55 ? 0.65 : 0;
      } else if (layerId === "drought" || layerId === "heat") {
        color = normNoise > 0.6 ? "#dc2626" : normNoise > 0.4 ? "#ea580c" : "#f59e0b";
        opacity = 0.65;
      }

      if (opacity > 0) {
         grid.push({
           bounds: [[lat1, lng1], [lat2, lng2]] as [[number, number], [number, number]],
           color,
           opacity
         });
      }
    }
  }
  return grid;
}

export default function GISDashboardPage() {
  const [layers, setLayers] = useState<LayerConfig[]>(defaultLayers);
  const [showLegend, setShowLegend] = useState(true);
  const [selectedZone, setSelectedZone] = useState<number | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [mapZoom, setMapZoom] = useState(16);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const handleZoneClick = (i: number) => {
    if (selectedZone === i) {
      setSelectedZone(null);
    } else {
      setSelectedZone(i);
    }
  };

  const handleZoomIn = () => setMapZoom(z => Math.min(z + 1, 19));
  const handleZoomOut = () => setMapZoom(z => Math.max(z - 1, 5));
  const handleHome = () => setMapZoom(16);
  const handleFullscreen = () => {
    if (!document.fullscreenElement && mapContainerRef.current) {
      mapContainerRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const toggleLayer = useCallback((id: string) => {
    setLayers(prev => prev.map(l => l.id === id ? { ...l, enabled: !l.enabled } : l));
  }, []);

  const activeLayer = layers.find(l => l.enabled && l.id !== "satellite") || null;



  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
        <div>
          <div className="page-title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Globe size={20} color="#16a34a" /> Advanced GIS Intelligence
          </div>
          <div className="page-subtitle">Multi-layer geospatial analysis with real-time farm intelligence</div>
        </div>
        <div className="badge badge-green" style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 10px" }}>
          <Activity size={11} /> Live Data
        </div>
      </div>

      {/* Main layout */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        
        {/* ─── Map Area ─── */}
        <div ref={mapContainerRef} className="card" style={{ padding: 0, overflow: "hidden", position: "relative", height: 600, width: "100%", backgroundColor: "#000" }}>
          
          <AnimatePresence>
            {!hasStarted && (
              <motion.div
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  position: "absolute",
                  inset: 0,
                  zIndex: 50,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "linear-gradient(rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.95))",
                  backdropFilter: "blur(4px)",
                  color: "white"
                }}
              >
                <div style={{ fontSize: 24, fontWeight: "bold", marginBottom: 16 }}>Chithilappilly Farm Base</div>
                <button 
                  onClick={() => setHasStarted(true)}
                  style={{
                    padding: "12px 24px",
                    background: "#16a34a",
                    color: "white",
                    border: "none",
                    borderRadius: 8,
                    fontSize: 16,
                    fontWeight: 600,
                    cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(22, 163, 74, 0.3)"
                  }}
                >
                  Touch for GIS Intelligence View
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <GISMap 
            center={FARM_CENTER} 
            zoom={mapZoom}
            activeLayerColor={activeLayer?.color || null}
            selectedZoneIndex={selectedZone}
            zoneData={zoneData}
            farmBoundary={FARM_BOUNDARY}
          />

          {/* White backdrop to hide baked-in non-working image buttons */}
          <div style={{ position: "absolute", top: 10, left: 10, width: 45, height: 120, background: "white", zIndex: 9, borderRadius: 6 }} />

          {/* Real Overlay Buttons (Top Left) */}
          <div style={{ position: "absolute", top: 16, left: 16, zIndex: 10, display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", flexDirection: "column", background: "white", borderRadius: 4, boxShadow: "0 2px 5px rgba(0,0,0,0.2)", overflow: "hidden" }}>
              <button onClick={handleZoomIn} style={{ width: 32, height: 32, border: "none", background: "white", cursor: "pointer", fontSize: 18, fontWeight: "bold", borderBottom: "1px solid #e5e7eb", display: "flex", alignItems: "center", justifyContent: "center", color: "#374151" }}>+</button>
              <button onClick={handleZoomOut} style={{ width: 32, height: 32, border: "none", background: "white", cursor: "pointer", fontSize: 18, fontWeight: "bold", display: "flex", alignItems: "center", justifyContent: "center", color: "#374151" }}>-</button>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", background: "white", borderRadius: 4, boxShadow: "0 2px 5px rgba(0,0,0,0.2)", overflow: "hidden" }}>
              <button onClick={handleHome} title="Reset Map" style={{ width: 32, height: 32, border: "none", background: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#374151" }}>
                <Globe size={16} />
              </button>
              <button onClick={handleFullscreen} title="Fullscreen" style={{ width: 32, height: 32, border: "none", background: "white", cursor: "pointer", borderTop: "1px solid #e5e7eb", display: "flex", alignItems: "center", justifyContent: "center", color: "#374151" }}>
                <Maximize2 size={16} />
              </button>
            </div>
          </div>

          {/* Simulated Layer Overlays */}
          <AnimatePresence>
            {activeLayer && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                exit={{ opacity: 0 }}
                style={{
                  position: "absolute", inset: 0, zIndex: 5, pointerEvents: "none",
                  backgroundColor: activeLayer.color,
                  mixBlendMode: "multiply"
                }}
              />
            )}
          </AnimatePresence>

          {/* Zone Highlighting (Simulated) */}
          <AnimatePresence>
            {selectedZone !== null && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                style={{
                  position: "absolute",
                  top: selectedZone === 0 ? "20%" : selectedZone === 1 ? "50%" : "70%",
                  left: selectedZone === 0 ? "30%" : selectedZone === 1 ? "60%" : "40%",
                  width: "150px", height: "150px",
                  border: "3px solid #22c55e",
                  borderRadius: "50%",
                  backgroundColor: "rgba(34, 197, 94, 0.2)",
                  zIndex: 6,
                  pointerEvents: "none",
                  transform: "translate(-50%, -50%)"
                }}
              />
            )}
          </AnimatePresence>

          {/* Legend */}
          {activeLayer && showLegend && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                position: "absolute", bottom: 16, left: 16, zIndex: 1000,
                background: "var(--bg-card)", borderRadius: 12, padding: 14,
                border: "1px solid var(--border-color)", boxShadow: "var(--shadow-card)",
                minWidth: 200,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text-dark)" }}>{activeLayer.name} Legend</span>
                <button onClick={() => setShowLegend(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", fontSize: 14 }}>✕</button>
              </div>
              <div style={{ display: "flex", height: 12, borderRadius: 6, overflow: "hidden", marginBottom: 6 }}>
                {activeLayer.gradient.map((c, i) => (
                  <div key={i} style={{ flex: 1, background: c }} />
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "var(--text-muted)" }}>
                <span>Low</span>
                <span>{activeLayer.unit}</span>
                <span>High</span>
              </div>
            </motion.div>
          )}
          {!showLegend && activeLayer && (
            <button onClick={() => setShowLegend(true)} style={{ position: "absolute", bottom: 16, left: 16, zIndex: 1000, padding: "6px 12px", borderRadius: 8, background: "var(--bg-card)", border: "1px solid var(--border-color)", cursor: "pointer", fontSize: 11, fontWeight: 600, color: "var(--text-dark)" }}>
              <Info size={12} /> Legend
            </button>
          )}

          {/* Active Layer Badge */}
          {activeLayer && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                position: "absolute", top: 16, left: 16, zIndex: 1000,
                background: activeLayer.color, color: "white",
                padding: "6px 14px", borderRadius: 20,
                fontSize: 12, fontWeight: 700,
                display: "flex", alignItems: "center", gap: 6,
                boxShadow: `0 4px 15px ${activeLayer.color}44`,
              }}
            >
              <span><activeLayer.icon size={16} /></span> {activeLayer.name} Layer Active
            </motion.div>
          )}
        </div>
      </div>

      {/* Zone Details */}
      <div className="grid-3" style={{ marginTop: 16 }}>
        {zoneData.map((zone, i) => (
          <motion.div
            key={i}
            className={`card ${selectedZone === i ? 'ring-2 ring-green-500' : ''}`}
            whileHover={{ y: -4 }}
            style={{ 
              cursor: "pointer", 
              transition: "all 0.3s",
              border: selectedZone === i ? "2px solid #16a34a" : undefined,
              boxShadow: selectedZone === i ? "0 8px 20px rgba(22,163,74,0.15)" : undefined,
              transform: selectedZone === i ? "scale(1.02)" : "scale(1)",
            }}
            onClick={() => handleZoneClick(i)}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: "var(--text-dark)" }}>{zone.name}</div>
              <span className={`badge ${zone.ndvi > 0.7 ? "badge-green" : "badge-yellow"}`}>{zone.health}</span>
            </div>
            <div className="grid-2" style={{ gap: 8 }}>
              <div className="card-sm" style={{ padding: 10, textAlign: "center" }}>
                <div className="stat-label">NDVI</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: zone.ndvi > 0.7 ? "#16a34a" : "#d97706" }}>{zone.ndvi}</div>
              </div>
              <div className="card-sm" style={{ padding: 10, textAlign: "center" }}>
                <div className="stat-label">Moisture</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#2563eb" }}>{zone.moisture}%</div>
              </div>
              <div className="card-sm" style={{ padding: 10, textAlign: "center" }}>
                <div className="stat-label">Crop</div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{zone.crop}</div>
              </div>
              <div className="card-sm" style={{ padding: 10, textAlign: "center" }}>
                <div className="stat-label">Area</div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{zone.area}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <ModuleAIAdvisor
        moduleId="gis-dashboard"
        moduleName="GIS Dashboard"
        moduleIcon="🌍"
        contextData={{ activeLayers: "NDVI, Soil Moisture, Weather, Vegetation", zoneCount: 4, totalFarmArea: "5.4 ha", farmCenter: "11.0168°N, 76.9558°E" }}
      />
      
      {/* Global styles for pulsing dots */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(255,255,255, 0.7); }
          70% { box-shadow: 0 0 0 10px rgba(255,255,255, 0); }
          100% { box-shadow: 0 0 0 0 rgba(255,255,255, 0); }
        }
        .leaflet-popup-content-wrapper {
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }
        .leaflet-popup-tip {
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }
      `}} />
    </div>
  );
}
