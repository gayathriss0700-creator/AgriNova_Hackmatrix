"use client";
import { useState, useEffect, MouseEvent } from "react";
import { 
  Navigation, Battery, Signal, Wind, 
  Map, Scan, AlertTriangle, CheckCircle2,
  Camera, Zap, Maximize2, Radio, Target, Send, Trash2
} from "lucide-react";
import ModuleAIAdvisor from "@/components/ModuleAIAdvisor";
import "./drone.css"; 

interface SprayTarget {
  id: string;
  x: number;
  y: number;
  lat: string;
  lng: string;
  status: 'pending' | 'spraying' | 'completed';
}

export default function DroneOperations() {
  const [isScanning, setIsScanning] = useState(false);
  const [altitude, setAltitude] = useState(120);
  const [battery, setBattery] = useState(87);
  const [scanProgress, setScanProgress] = useState(0);
  const [sprayTargets, setSprayTargets] = useState<SprayTarget[]>([]);
  const [manualLat, setManualLat] = useState("");
  const [manualLng, setManualLng] = useState("");

  // Telemetry simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setAltitude(prev => prev + (Math.random() * 2 - 1));
      if(isScanning) {
        setBattery(prev => Math.max(0, prev - 0.1));
        setScanProgress(prev => {
          if (prev >= 100) {
            setIsScanning(false);
            return 100;
          }
          return prev + 2;
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isScanning]);

  const startScan = () => {
    setIsScanning(true);
    setScanProgress(0);
  };

  const handleFeedClick = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    // Generate mock coordinates based on base farm location
    const baseLat = 34.0522;
    const baseLng = -118.2437;
    const randOffset = () => (Math.random() * 0.0050 - 0.0025).toFixed(5);
    
    const newTarget: SprayTarget = {
      id: Math.random().toString(36).substr(2, 9),
      x,
      y,
      lat: (baseLat + parseFloat(randOffset())).toFixed(5),
      lng: (baseLng + parseFloat(randOffset())).toFixed(5),
      status: 'pending'
    };
    
    setSprayTargets([...sprayTargets, newTarget]);
  };

  const removeTarget = (id: string) => {
    setSprayTargets(sprayTargets.filter(t => t.id !== id));
  };

  const handleManualAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualLat || !manualLng) return;
    
    // Convert lat/lng to approximate x/y for the UI mockup
    const baseLat = 34.0522;
    const baseLng = -118.2437;
    const x = Math.max(0, Math.min(100, 50 + (parseFloat(manualLng) - baseLng) * 10000));
    const y = Math.max(0, Math.min(100, 50 + (baseLat - parseFloat(manualLat)) * 10000));

    const newTarget: SprayTarget = {
      id: Math.random().toString(36).substr(2, 9),
      x,
      y,
      lat: parseFloat(manualLat).toFixed(5),
      lng: parseFloat(manualLng).toFixed(5),
      status: 'pending'
    };
    
    setSprayTargets([...sprayTargets, newTarget]);
    setManualLat("");
    setManualLng("");
  };

  const dispatchSprayer = () => {
    if(sprayTargets.length === 0) return;
    setSprayTargets(targets => targets.map(t => ({...t, status: 'spraying'})));
    setTimeout(() => {
      setSprayTargets(targets => targets.map(t => ({...t, status: 'completed'})));
    }, 3000);
  };

  return (
    <div className="drone-container fade-in">
      
      <header className="drone-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", width: "100%" }}>
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Navigation className="text-primary" size={32} />
            Drone Operations
          </h1>
          <p className="text-secondary-foreground">Real-time aerial scanning and precision spraying</p>
        </div>
        
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <ModuleAIAdvisor 
            moduleId="drone" 
            moduleName="Flight Operations Chief" 
            moduleIcon="🚁" 
            contextData={{
              altitude,
              battery,
              isScanning,
              sprayTargetsCount: sprayTargets.length
            }}
          />
          <div className="drone-telemetry-badge">
            <div className="status-dot pulsing"></div>
            <span>Drone Connected (UAV-Alpha)</span>
          </div>
        </div>
      </header>

      <div className="drone-grid">
        
        {/* Main Viewport */}
        <div className="drone-viewport-card glass-panel">
          <div className="viewport-header">
            <h3>Live Camera Feed (Click to mark spray targets)</h3>
            <div className="flex items-center gap-4">
              <span className="rec-indicator"><span className="red-dot"></span> REC</span>
              <Maximize2 size={18} className="cursor-pointer hover-text-primary transition-colors" />
            </div>
          </div>
          
          <div className="viewport-screen" onClick={handleFeedClick} style={{cursor: 'crosshair'}}>
            {/* Simulated Drone Camera Overlay */}
            <div className="hud-overlay">
              <div className="crosshair"></div>
              <div className="hud-corner top-left"></div>
              <div className="hud-corner top-right"></div>
              <div className="hud-corner bottom-left"></div>
              <div className="hud-corner bottom-right"></div>
              
              <div className="hud-stats">
                <div>ALT: {altitude.toFixed(1)}m</div>
                <div>SPD: 12.4 km/h</div>
                <div>YAW: 45°</div>
              </div>
            </div>

            {/* Scanning Overlay */}
            {isScanning && (
              <div className="scan-overlay">
                <div className="scan-line"></div>
                <div className="scan-text">Analyzing Crop Health... {scanProgress}%</div>
              </div>
            )}
            
            {/* Spray Target Markers */}
            {sprayTargets.map((target, index) => (
              <div 
                key={target.id}
                className={`spray-marker ${target.status}`}
                style={{left: `${target.x}%`, top: `${target.y}%`}}
              >
                <div className="marker-ring"></div>
                <div className="marker-dot"></div>
                <div className="marker-label">T-{index + 1}</div>
              </div>
            ))}
            
            {/* Mock Feed BG */}
            <div className="mock-feed-bg"></div>
          </div>

          <div className="viewport-controls">
            <button 
              className={`drone-btn ${isScanning ? 'scanning' : 'primary'}`}
              onClick={startScan}
              disabled={isScanning}
            >
              {isScanning ? <><Scan size={18} className="spin-slow" /> Scanning Sector...</> : <><Scan size={18} /> Initiate Area Scan</>}
            </button>
            <button 
              className={`drone-btn outline ${sprayTargets.length > 0 ? 'action-ready' : ''}`}
              onClick={dispatchSprayer}
              disabled={sprayTargets.length === 0}
            >
              <Send size={18} /> Dispatch Sprayer
            </button>
          </div>
        </div>

        {/* Telemetry Panel */}
        <div className="drone-sidebar">
          
          <div className="glass-panel stat-card mb-6">
            <h3 className="section-title">Telemetry</h3>
            <div className="stats-grid">
              
              <div className="stat-item">
                <div className="stat-icon-wrapper blue">
                  <Battery size={20} />
                </div>
                <div className="stat-details">
                  <span className="stat-label">Battery</span>
                  <span className="stat-value">{battery.toFixed(0)}%</span>
                </div>
              </div>

              <div className="stat-item">
                <div className="stat-icon-wrapper green">
                  <Signal size={20} />
                </div>
                <div className="stat-details">
                  <span className="stat-label">Signal</span>
                  <span className="stat-value">Excellent</span>
                </div>
              </div>

              <div className="stat-item">
                <div className="stat-icon-wrapper orange">
                  <Wind size={20} />
                </div>
                <div className="stat-details">
                  <span className="stat-label">Wind</span>
                  <span className="stat-value">14 km/h</span>
                </div>
              </div>
              
              <div className="stat-item">
                <div className="stat-icon-wrapper purple">
                  <Radio size={20} />
                </div>
                <div className="stat-details">
                  <span className="stat-label">Latency</span>
                  <span className="stat-value">24ms</span>
                </div>
              </div>

            </div>
          </div>

          {/* Spray Targets Panel */}
          <div className="glass-panel alert-card h-full flex flex-col">
             <h3 className="section-title flex items-center justify-between">
               <div className="flex items-center gap-2">
                 <Target className="text-primary" size={20} /> 
                 Spray Targets
               </div>
               <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">{sprayTargets.length} Marked</span>
             </h3>
             <div className="p-4 flex-1 overflow-y-auto max-h-[300px]">
               {sprayTargets.length === 0 ? (
                 <div className="text-center text-secondary-foreground opacity-70 py-8 text-sm">
                   Click on the camera feed to mark geo-locations for precision spraying.
                 </div>
               ) : (
                 <ul className="target-list flex flex-col gap-3">
                   {sprayTargets.map((target, idx) => (
                     <li key={target.id} className="target-item flex justify-between items-center p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                       <div>
                         <div className="font-semibold text-sm flex items-center gap-2">
                           <span className={`status-blob ${target.status}`}></span>
                           Target {idx + 1}
                         </div>
                         <div className="text-xs font-mono text-slate-400 mt-1">
                           {target.lat}, {target.lng}
                         </div>
                       </div>
                       <button onClick={() => removeTarget(target.id)} className="text-slate-500 hover:text-red-400 transition-colors">
                         <Trash2 size={16} />
                       </button>
                     </li>
                   ))}
                 </ul>
               )}
             </div>
             
             {/* Manual Coordinate Entry */}
             <div className="p-4 border-t border-slate-700/50 bg-slate-800/30">
               <div className="flex items-center justify-between mb-3">
                 <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Add Geo-Location Manually</h4>
                 
                 {/* Preset Dropdown */}
                 <select 
                   className="bg-slate-900 border border-slate-700 rounded text-xs text-slate-300 px-2 py-1 focus:outline-none focus:border-primary"
                   onChange={(e) => {
                     const [lat, lng] = e.target.value.split(',');
                     if(lat && lng) {
                       setManualLat(lat);
                       setManualLng(lng);
                     }
                   }}
                   defaultValue=""
                 >
                   <option value="" disabled>Presets...</option>
                   <option value="34.0531,-118.2421">North Sector</option>
                   <option value="34.0515,-118.2452">South Field</option>
                   <option value="34.0544,-118.2410">Irrigation Zone A</option>
                 </select>
               </div>
               
               <form onSubmit={handleManualAdd} className="flex gap-2">
                 <input 
                   type="number" 
                   step="0.00001"
                   placeholder="Lat (e.g. 34.05)" 
                   className="flex-1 bg-slate-900 border border-slate-700 rounded px-2 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-primary transition-colors"
                   value={manualLat}
                   onChange={(e) => setManualLat(e.target.value)}
                 />
                 <input 
                   type="number" 
                   step="0.00001"
                   placeholder="Lng (e.g. -118.2)" 
                   className="flex-1 bg-slate-900 border border-slate-700 rounded px-2 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-primary transition-colors"
                   value={manualLng}
                   onChange={(e) => setManualLng(e.target.value)}
                 />
                 <button 
                   type="submit" 
                   disabled={!manualLat || !manualLng}
                   className="bg-primary/20 text-primary hover:bg-primary hover:text-black transition-all px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[40px]"
                 >
                   <Map size={16} />
                 </button>
               </form>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
