"use client";
import { useState } from "react";
import { Check, Star } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PricingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleUpgrade = () => {
    setLoading(true);
    // Simulate checkout flow
    setTimeout(() => {
      localStorage.setItem("is_pro_user", "true");
      setLoading(false);
      router.push("/overview");
    }, 2000);
  };

  return (
    <div style={{ padding: "40px 24px", maxWidth: 1000, margin: "0 auto", textAlign: "center" }}>
      <div style={{ display: "inline-block", padding: "6px 12px", background: "rgba(34,197,94,0.1)", color: "#16a34a", borderRadius: 20, fontSize: 13, fontWeight: 600, marginBottom: 16 }}>
        Upgrade to Pro Max
      </div>
      <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 16 }}>Unlock the full power of Agri Nova</h1>
      <p style={{ fontSize: 18, color: "#64748b", maxWidth: 600, margin: "0 auto 48px" }}>
        Get access to satellite imagery, carbon sequestration tracking, and the Opus-level 25-agent swarm AI.
      </p>

      <div style={{ display: "flex", gap: 32, justifyContent: "center", flexWrap: "wrap", alignItems: "stretch" }}>
        
        {/* Free Tier */}
        <div className="card" style={{ flex: "1 1 300px", maxWidth: 400, textAlign: "left", display: "flex", flexDirection: "column" }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Basic</h2>
          <div style={{ fontSize: 36, fontWeight: 800, marginBottom: 24 }}>₹0<span style={{ fontSize: 16, color: "#94a3b8", fontWeight: 500 }}>/month</span></div>
          <div style={{ flex: 1 }}>
            <Feature text="Farm Setup & Basic Overview" />
            <Feature text="Current Weather & Forecasts" />
            <Feature text="Basic Crop Price Checker" />
            <Feature text="Community Forums" />
          </div>
          <button className="btn" disabled style={{ width: "100%", marginTop: 24, background: "#f1f5f9", color: "#64748b", border: "none" }}>Current Plan</button>
        </div>

        {/* Pro Tier */}
        <div className="card" style={{ flex: "1 1 300px", maxWidth: 400, textAlign: "left", background: "var(--bg-card)", border: "2px solid #22c55e", position: "relative", display: "flex", flexDirection: "column" }}>
          <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: "#22c55e", color: "white", padding: "4px 12px", borderRadius: 12, fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
            <Star size={14} /> MOST POPULAR
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Pro Max</h2>
          <div style={{ fontSize: 36, fontWeight: 800, marginBottom: 24 }}>₹999<span style={{ fontSize: 16, color: "#94a3b8", fontWeight: 500 }}>/month</span></div>
          <div style={{ flex: 1 }}>
            <Feature text="Everything in Basic" />
            <Feature text="Sentinel-2 Satellite Maps (10m res)" />
            <Feature text="25-Agent Swarm AI Assistant" />
            <Feature text="Predictive Market Analytics" />
            <Feature text="Carbon Sequestration Engine" />
            <Feature text="Priority 24/7 Support" />
          </div>
          <button className="btn btn-green" onClick={handleUpgrade} disabled={loading} style={{ width: "100%", marginTop: 24 }}>
            {loading ? "Processing..." : "Upgrade to Pro"}
          </button>
        </div>

      </div>
    </div>
  );
}

function Feature({ text }: { text: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, fontSize: 15 }}>
      <Check size={18} color="#22c55e" />
      <span>{text}</span>
    </div>
  );
}
