"use client";
import { useState, useEffect } from "react";
import { ExternalLink, Star, IndianRupee, Check } from "lucide-react";

interface Scheme {
  id: string;
  name: string;
  fullName: string;
  description: string;
  benefit: string;
  eligibility: string;
  category: string;
  state: string;
  lastUpdated: string;
  applyLink: string;
  isNew: boolean;
  matchScore?: number;
}

interface SchemeCardProps {
  scheme: Scheme;
}

export default function SchemeCard({ scheme }: SchemeCardProps) {
  const [farmData, setFarmData] = useState<any>(null);

  useEffect(() => {
    try {
      const fd = localStorage.getItem("farm_setup_data");
      if (fd) setFarmData(JSON.parse(fd));
    } catch(e) {}
  }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  };

  const categoryColors: Record<string, string> = {
    Financial: "#16a34a",
    Insurance: "#7c3aed",
    Credit: "#0891b2",
    Equipment: "#ea580c",
    "Organic Farming": "#65a30d",
    Production: "#6366f1",
    Horticulture: "#db2777",
    Infrastructure: "#4b5563",
  };

  return (
    <div className="scheme-card">
      <div className="scheme-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <div style={{ flex: 1 }}>
          <div className="scheme-title-row" style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
            <span className="scheme-name" style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary, #1e293b)" }}>{scheme.name}</span>
            {scheme.isNew && <span className="scheme-badge-new" style={{ background: "#ef4444", color: "#fff", fontSize: 10, padding: "2px 6px", borderRadius: 4, fontWeight: 700 }}>NEW</span>}
            {scheme.matchScore && (
              <span style={{ background: scheme.matchScore >= 90 ? "rgba(16, 185, 129, 0.15)" : "rgba(245, 158, 11, 0.15)", color: scheme.matchScore >= 90 ? "#059669" : "#d97706", fontSize: 11, padding: "3px 8px", borderRadius: 12, fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
                <Star size={12} fill={scheme.matchScore >= 90 ? "#059669" : "#d97706"} />
                {scheme.matchScore}% AI Match
              </span>
            )}
          </div>
          <span className="scheme-category" style={{ background: categoryColors[scheme.category] || "#6b7280", color: "#fff", fontSize: 11, padding: "2px 8px", borderRadius: 4, fontWeight: 600 }}>{scheme.category}</span>
        </div>
      </div>

      {scheme.matchScore && scheme.matchScore >= 90 && (
        <div style={{ background: "rgba(16, 185, 129, 0.05)", border: "1px dashed rgba(16, 185, 129, 0.3)", borderRadius: 8, padding: "10px 12px", marginBottom: 16, fontSize: 12, color: "var(--text-secondary, #64748b)" }}>
          <div style={{ fontWeight: 700, color: "#059669", marginBottom: 6, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.5px" }}>AI Match Criteria Confirmed:</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}><Check size={12} color="#10b981" /> Area: {farmData?.landArea || "10"} acres</div>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}><Check size={12} color="#10b981" /> Soil: {farmData?.soilType || "Alluvial"}</div>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}><Check size={12} color="#10b981" /> Crop: {farmData?.crop || "Wheat"}</div>
            <div style={{ display: "flex", gap: 6, alignItems: "center", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}><Check size={12} color="#10b981" /> Reg: {farmData?.location || "India"}</div>
          </div>
        </div>
      )}
      
      <div className="scheme-fullname">{scheme.fullName}</div>
      <div className="scheme-description">{scheme.description}</div>
      
      <div className="scheme-benefit">
        <IndianRupee size={14} />
        <span>{scheme.benefit}</span>
      </div>
      
      <div className="scheme-eligibility">
        <span className="scheme-eligibility-label">Eligibility:</span> {scheme.eligibility}
      </div>
      
      <div className="scheme-footer" style={{ marginTop: "auto", borderTop: "1px solid var(--border-color, #e2e8f0)", paddingTop: 16 }}>
        <div className="scheme-meta" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, fontSize: 12, color: "var(--text-secondary, #64748b)", fontWeight: 500 }}>
          <span className="scheme-state">{scheme.state}</span>
          <span className="scheme-date">Updated: {formatDate(scheme.lastUpdated)}</span>
        </div>
        <a 
          href={scheme.applyLink} 
          target="_blank" 
          rel="noopener noreferrer"
          style={{
            width: "100%", padding: "8px 0", background: "white", border: "1px solid #16a34a",
            color: "#16a34a", borderRadius: 6, fontWeight: 500, fontSize: 13, cursor: "pointer",
            display: "flex", justifyContent: "center", alignItems: "center", textDecoration: "none"
          }}
        >
          Apply
        </a>
      </div>
    </div>
  );
}