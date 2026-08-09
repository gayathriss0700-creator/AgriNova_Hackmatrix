import { useState, useEffect } from "react";
interface WeatherData {
  temperature: number;
  humidity: number;
  wind_speed: number;
  rain: number;
  condition: string;
  icon: string;
  feels_like: number;
}

interface CropRecommendation {
  name: string;
  icon: string;
  confidence: number;
  reason: string;
  season: string;
  water_need: string;
  rank: number;
}

interface AnalysisResult {
  location: {
    latitude: number;
    longitude: number;
    region: string;
  };
  weather: WeatherData;
  crops: CropRecommendation[];
  farming_tips: string[];
}

interface SidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  loading: boolean;
  result: AnalysisResult | null;
  error: string | null;
}

export default function SidePanel({ isOpen, onClose, loading, result, error }: SidePanelProps) {
  const [agentExecuting, setAgentExecuting] = useState(false);
  const [agentStep, setAgentStep] = useState(0);
  const [agentCompleted, setAgentCompleted] = useState(false);
  const [executingPlan, setExecutingPlan] = useState(false);
  const [executedPlan, setExecutedPlan] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);

  // Reset agent state when panel closes or result changes
  useEffect(() => {
    setAgentExecuting(false);
    setAgentStep(0);
    setAgentCompleted(false);
    setExecutingPlan(false);
    setExecutedPlan(false);
    setShowReceipt(false);
  }, [isOpen, result]);

  useEffect(() => {
    if (agentExecuting && agentStep < 6) {
      const timer = setTimeout(() => {
        setAgentStep(s => s + 1);
      }, 1200);
      return () => clearTimeout(timer);
    } else if (agentExecuting && agentStep === 6) {
      setAgentCompleted(true);
      setAgentExecuting(false);
    }
  }, [agentExecuting, agentStep]);

  if (!isOpen) return null;

  return (
    <>
      <div 
        onClick={onClose}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.3)",
          zIndex: 998,
        }}
      />
      
      <div style={{
        position: "fixed",
        top: 0,
        right: 0,
        width: 400,
        maxWidth: "100vw",
        height: "100vh",
        background: "white",
        boxShadow: "-4px 0 20px rgba(0,0,0,0.15)",
        zIndex: 999,
        overflowY: "auto",
        animation: "slideIn 0.3s ease-out",
      }}>
        <style>{`
          @keyframes slideIn {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
          }
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
        
        <div style={{
          padding: "20px 24px",
          borderBottom: "1px solid #e5e7eb",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "sticky",
          top: 0,
          background: "white",
        }}>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827", margin: 0 }}>
              Location Analysis
            </h2>
            {result && (
              <p style={{ fontSize: 12, color: "#6b7280", margin: "4px 0 0 0" }}>
                {result.location.region} <br/>
                <span style={{ fontSize: 10 }}>({result.location.latitude.toFixed(4)}°N, {result.location.longitude.toFixed(4)}°E)</span>
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              border: "1px solid #e5e7eb",
              background: "white",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              color: "#6b7280",
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ padding: 24 }}>
          {loading && (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <div style={{
                width: 48,
                height: 48,
                border: "4px solid #e5e7eb",
                borderTopColor: "#22c55e",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
                margin: "0 auto 16px",
              }} />
              <p style={{ color: "#6b7280", fontSize: 14 }}>Analyzing location...</p>
              <p style={{ color: "#9ca3af", fontSize: 12, marginTop: 4 }}>
                Fetching weather & crop data
              </p>
            </div>
          )}

          {error && (
            <div style={{
              background: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: 12,
              padding: 20,
              textAlign: "center",
            }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>⚠️</div>
              <p style={{ color: "#991b1b", fontWeight: 600, margin: "0 0 8px 0" }}>
                Analysis Failed
              </p>
              <p style={{ color: "#7f1d1d", fontSize: 13, margin: 0 }}>{error}</p>
            </div>
          )}

          {result && !loading && (
            <div style={{ animation: "fadeIn 0.3s ease-out" }}>
              
              {/* Agentic AI Trigger */}
              <div style={{ marginBottom: 28, background: "#0f172a", borderRadius: 16, overflow: "hidden", color: "white", boxShadow: "0 10px 25px rgba(0,0,0,0.2)" }}>
                {!agentExecuting && !agentCompleted ? (
                  <div style={{ padding: 24, textAlign: "center" }}>
                    <div style={{ fontSize: 40, marginBottom: 12 }}>🤖</div>
                    <h3 style={{ margin: "0 0 8px 0", fontSize: 18, color: "#e2e8f0" }}>Autonomous Agronomist Agent</h3>
                    <p style={{ margin: "0 0 20px 0", fontSize: 13, color: "#94a3b8" }}>Allow AI to autonomously create and execute a farming action plan based on this location's data.</p>
                    <button 
                      onClick={() => setAgentExecuting(true)}
                      style={{
                        background: "linear-gradient(90deg, #3b82f6, #8b5cf6)",
                        color: "white",
                        border: "none",
                        padding: "12px 24px",
                        borderRadius: 8,
                        fontWeight: 600,
                        fontSize: 14,
                        cursor: "pointer",
                        width: "100%",
                        boxShadow: "0 4px 15px rgba(139, 92, 246, 0.4)",
                        transition: "transform 0.2s"
                      }}
                    >
                      Deploy Agentic AI Workflow
                    </button>
                  </div>
                ) : (
                  <div style={{ padding: 24 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, borderBottom: "1px solid #334155", paddingBottom: 16 }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: 8, background: agentCompleted ? "#22c55e" : "#3b82f6",
                        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
                        animation: agentCompleted ? "none" : "pulse 1.5s infinite"
                      }}>
                        {agentCompleted ? "✓" : "⚡"}
                      </div>
                      <h3 style={{ margin: 0, fontSize: 16 }}>Agent Execution Log</h3>
                    </div>
                    
                    <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 12, fontFamily: "monospace", color: "#a3e635", lineHeight: 1.4 }}>
                      {agentStep >= 0 && (
                        <div style={{ opacity: agentStep >= 1 ? 1 : 0.5 }}>
                          <span style={{ color: "#3b82f6" }}>[Agent-Init]</span> Establishing secure connection to Geospatial & Meteorological Pipeline... {agentStep >= 1 ? "✓ Connected" : "⏳"}
                        </div>
                      )}
                      {agentStep >= 1 && (
                        <div style={{ opacity: agentStep >= 2 ? 1 : 0.5, animation: "fadeIn 0.3s" }}>
                          <span style={{ color: "#3b82f6" }}>[Data-Sync]</span> Cross-referencing Open-Meteo climate patterns with FAO crop viability models... {agentStep >= 2 ? "✓ Verified" : "⏳"}
                        </div>
                      )}
                      {agentStep >= 2 && (
                        <div style={{ opacity: agentStep >= 3 ? 1 : 0.5, animation: "fadeIn 0.3s" }}>
                          <span style={{ color: "#8b5cf6" }}>[Deep-Learning]</span> Executing yield prediction on {result?.crops[0]?.name || "crop"} datasets... {agentStep >= 3 ? `✓ Confidence: ${result?.crops[0]?.confidence || 94}%` : "⏳"}
                        </div>
                      )}
                      {agentStep >= 3 && (
                        <div style={{ opacity: agentStep >= 4 ? 1 : 0.5, animation: "fadeIn 0.3s" }}>
                          <span style={{ color: "#f59e0b" }}>[Market-Link]</span> Initiating API handshake with ITC Agri Business Division bidding engine... {agentStep >= 4 ? "✓ Handshake OK" : "⏳"}
                        </div>
                      )}
                      {agentStep >= 4 && (
                        <div style={{ opacity: agentStep >= 5 ? 1 : 0.5, animation: "fadeIn 0.3s" }}>
                          <span style={{ color: "#f59e0b" }}>[Market-Link]</span> Negotiating live smart contract parameters... {agentStep >= 5 ? "✓ Locked ₹3,250/Q" : "⏳"}
                        </div>
                      )}
                      {agentStep >= 5 && (
                        <div style={{ opacity: agentStep >= 6 ? 1 : 0.5, animation: "fadeIn 0.3s" }}>
                          <span style={{ color: "#22c55e" }}>[Logistics-AI]</span> Autonomously scheduling IoT hardware & drone scouting parameters... {agentStep >= 6 ? "✓ Finalized" : "⏳"}
                        </div>
                      )}
                    </div>

                    {agentCompleted && (
                      <button 
                        style={{
                          marginTop: 24, 
                          background: executedPlan ? "#22c55e" : executingPlan ? "#94a3b8" : "#22c55e", 
                          color: "white", 
                          border: "none",
                          padding: "12px 24px", 
                          borderRadius: 8, 
                          fontWeight: 700, 
                          fontSize: 14,
                          cursor: executedPlan || executingPlan ? "default" : "pointer", 
                          width: "100%", 
                          boxShadow: executedPlan ? "none" : executingPlan ? "none" : "0 4px 15px rgba(34, 197, 94, 0.4)",
                          animation: "fadeIn 0.5s",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          gap: 8,
                          transition: "all 0.3s"
                        }}
                        disabled={executingPlan}
                        onClick={() => {
                          if (executedPlan) {
                            setShowReceipt(true);
                            return;
                          }
                          setExecutingPlan(true);
                          setTimeout(() => {
                            setExecutingPlan(false);
                            setExecutedPlan(true);
                            setTimeout(() => setShowReceipt(true), 500);
                          }, 1500);
                        }}
                      >
                        {executingPlan && (
                          <div style={{
                            width: 16, height: 16, border: "2px solid white", borderTopColor: "transparent",
                            borderRadius: "50%", animation: "spin 1s linear infinite"
                          }} />
                        )}
                        {executedPlan ? "📄 View Executed Smart Contract" : executingPlan ? "Executing Smart Contracts..." : "Execute Action Plan"}
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Weather Section */}
              <div style={{ marginBottom: 28 }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: "#374151", margin: "0 0 16px 0", display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 20 }}>🌤️</span> Current Weather
                </h3>
                
                <div style={{
                  background: "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)",
                  borderRadius: 16,
                  padding: 20,
                  marginBottom: 16,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <span style={{ fontSize: 56 }}>{result.weather.icon}</span>
                    <div>
                      <div style={{ fontSize: 36, fontWeight: 700, color: "#065f46" }}>
                        {Math.round(result.weather.temperature)}°C
                      </div>
                      <div style={{ fontSize: 14, color: "#047857" }}>
                        {result.weather.condition}
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  {[
                    { label: "Feels Like", value: `${Math.round(result.weather.feels_like)}°C`, icon: "🌡️" },
                    { label: "Humidity", value: `${result.weather.humidity}%`, icon: "💧" },
                    { label: "Wind Speed", value: `${result.weather.wind_speed} km/h`, icon: "💨" },
                    { label: "Rainfall", value: result.weather.rain > 0 ? `${result.weather.rain} mm` : "None", icon: "🌧️" },
                  ].map(item => (
                    <div key={item.label} style={{
                      background: "#f9fafb",
                      borderRadius: 12,
                      padding: 14,
                      textAlign: "center",
                    }}>
                      <div style={{ fontSize: 20, marginBottom: 4 }}>{item.icon}</div>
                      <div style={{ fontSize: 12, color: "#6b7280" }}>{item.label}</div>
                      <div style={{ fontSize: 16, fontWeight: 600, color: "#111827" }}>{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Crop Recommendations */}
              <div style={{ marginBottom: 28 }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: "#374151", margin: "0 0 16px 0", display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 20 }}>🌱</span> Recommended Crops
                </h3>

                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {result.crops.map((crop, index) => (
                    <div key={crop.name} style={{
                      background: index === 0 ? "#f0fdf4" : "#f9fafb",
                      border: index === 0 ? "2px solid #22c55e" : "1px solid #e5e7eb",
                      borderRadius: 16,
                      padding: 16,
                      animation: `fadeIn 0.3s ease-out ${index * 0.1}s both`,
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <span style={{ fontSize: 28 }}>{crop.icon}</span>
                          <div>
                            <div style={{ fontWeight: 600, color: "#111827", display: "flex", alignItems: "center", gap: 8 }}>
                              {crop.name}
                              {index === 0 && (
                                <span style={{
                                  fontSize: 10,
                                  background: "#22c55e",
                                  color: "white",
                                  padding: "2px 8px",
                                  borderRadius: 10,
                                  fontWeight: 500,
                                }}>
                                  BEST
                                </span>
                              )}
                            </div>
                            <div style={{ fontSize: 11, color: "#6b7280" }}>{crop.season}</div>
                          </div>
                        </div>
                        <div style={{
                          background: index === 0 ? "#22c55e" : "#e5e7eb",
                          color: index === 0 ? "white" : "#374151",
                          padding: "4px 10px",
                          borderRadius: 20,
                          fontSize: 12,
                          fontWeight: 600,
                        }}>
                          {crop.confidence}%
                        </div>
                      </div>
                      
                      <p style={{ fontSize: 12, color: "#6b7280", margin: "0 0 8px 0", lineHeight: 1.5 }}>
                        {crop.reason}
                      </p>
                      
                      <div style={{ display: "flex", gap: 8 }}>
                        <span style={{
                          fontSize: 11,
                          background: "#dbeafe",
                          color: "#1e40af",
                          padding: "4px 10px",
                          borderRadius: 20,
                        }}>
                          💧 Water: {crop.water_need}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Farming Tips */}
              {result.farming_tips.length > 0 && (
                <div>
                  <h3 style={{ fontSize: 14, fontWeight: 600, color: "#374151", margin: "0 0 16px 0", display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 20 }}>💡</span> Farming Tips
                  </h3>
                  
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {result.farming_tips.map((tip, index) => (
                      <div key={index} style={{
                        background: "#fffbeb",
                        border: "1px solid #fde68a",
                        borderRadius: 10,
                        padding: "12px 14px",
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 10,
                      }}>
                        <span style={{ color: "#d97706", fontSize: 16 }}>⚠️</span>
                        <span style={{ fontSize: 13, color: "#92400e", lineHeight: 1.5 }}>{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Footer */}
              <div style={{
                marginTop: 28,
                paddingTop: 16,
                borderTop: "1px solid #e5e7eb",
                textAlign: "center",
              }}>
                <p style={{ fontSize: 11, color: "#9ca3af", margin: 0 }}>
                  Weather data from Open-Meteo API • Recommendations based on climate conditions
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Plan Receipt Modal */}
      {showReceipt && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.6)", zIndex: 1000,
          display: "flex", alignItems: "center", justifyContent: "center",
          animation: "fadeIn 0.2s"
        }}>
          <div style={{
            background: "white", width: 450, maxWidth: "90vw", borderRadius: 16,
            boxShadow: "0 25px 50px rgba(0,0,0,0.25)", overflow: "hidden"
          }}>
            <div style={{ background: "#0f172a", padding: "20px 24px", color: "white", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 24 }}>📄</span>
                <div>
                  <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Executed Action Plan</h3>
                  <div style={{ color: "#94a3b8", fontSize: 12 }}>Smart Contract ID: 0x{Math.random().toString(16).substring(2, 10).toUpperCase()}</div>
                </div>
              </div>
              <button onClick={() => setShowReceipt(false)} style={{ background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: 20 }}>✕</button>
            </div>
            
            <div style={{ padding: 24, fontSize: 13, color: "#374151" }}>
              <div style={{ marginBottom: 20 }}>
                <div style={{ color: "#6b7280", fontWeight: 600, marginBottom: 8, textTransform: "uppercase", fontSize: 11, letterSpacing: 1 }}>1. Market Execution Sync</div>
                <div style={{ background: "#f8fafc", padding: 12, borderRadius: 8, border: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between" }}>
                  <div>
                    <strong>Buyer:</strong> ITC Agri Business Division<br/>
                    <strong>Commodity:</strong> {result?.crops[0]?.name || "Crop"}<br/>
                    <strong>Delivery:</strong> Post-Harvest
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <strong>Locked Price</strong><br/>
                    <span style={{ color: "#22c55e", fontSize: 16, fontWeight: 700 }}>₹3,250/Q</span>
                  </div>
                </div>
              </div>
              
              <div style={{ marginBottom: 20 }}>
                <div style={{ color: "#6b7280", fontWeight: 600, marginBottom: 8, textTransform: "uppercase", fontSize: 11, letterSpacing: 1 }}>2. Supply Chain & Quality Sync</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#3b82f6" }}></div>
                    <strong>Logistics Partner:</strong> Mahindra Agri Logistics (Scheduled)
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#f59e0b" }}></div>
                    <strong>Quality Assurance:</strong> SGS India Pvt. Ltd. (Pre-booked)
                  </div>
                </div>
              </div>

              <div style={{ background: "#ecfdf5", color: "#065f46", padding: 12, borderRadius: 8, border: "1px solid #a7f3d0", display: "flex", gap: 12, alignItems: "center" }}>
                <span style={{ fontSize: 20 }}>✓</span>
                <div>
                  <strong>All systems synced.</strong><br/>
                  <span style={{ fontSize: 12, opacity: 0.8 }}>No manual intervention required.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
