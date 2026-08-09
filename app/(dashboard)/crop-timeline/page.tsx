"use client";
import { useState } from "react";
import { CalendarDays, ChevronRight, CheckCircle2, Clock, Leaf, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ModuleAIAdvisor from "@/components/ModuleAIAdvisor";

interface CropStage {
  id: number; name: string; icon: string; dateRange: string; duration: string;
  status: "completed" | "active" | "upcoming";
  description: string; tasks: string[]; tips: string[];
  color: string;
}

const stages: CropStage[] = [
  { id: 1, name: "Land Preparation", icon: "🚜", dateRange: "1 Jun – 15 Jun", duration: "15 days", status: "completed",
    description: "Prepare the field through plowing, leveling, and incorporating organic matter. Ensure proper drainage infrastructure.",
    tasks: ["Deep plowing (20-25 cm)", "Apply FYM 10 t/ha", "Level the field", "Repair bunds and channels", "Soil testing"],
    tips: ["Test soil before preparation", "Incorporate green manure crop residues", "Ensure proper puddling for rice"], color: "#92400e" },
  { id: 2, name: "Seed Selection", icon: "🌰", dateRange: "16 Jun – 20 Jun", duration: "5 days", status: "completed",
    description: "Select certified seeds of recommended varieties. Treat seeds with fungicide and biofertilizers.",
    tasks: ["Procure certified seeds (40 kg/ha)", "Seed treatment with Carbendazim", "Rhizobium inoculation", "Germination test (>85%)"],
    tips: ["Use locally adapted varieties", "BPT-5204 recommended for Tamil Nadu", "Maintain seed-to-soil contact"], color: "#16a34a" },
  { id: 3, name: "Sowing / Transplanting", icon: "🌱", dateRange: "21 Jun – 30 Jun", duration: "10 days", status: "completed",
    description: "Transplant 25-day-old seedlings at recommended spacing. Maintain 2-3 cm standing water.",
    tasks: ["Nursery raising (25 days)", "Transplant 2-3 seedlings/hill", "Spacing: 20×15 cm", "Maintain 2-3 cm water level"],
    tips: ["Transplant before sunset", "Avoid deep planting", "Use SRI method for higher yields"], color: "#059669" },
  { id: 4, name: "Vegetative Growth", icon: "🌿", dateRange: "1 Jul – 5 Aug", duration: "35 days", status: "completed",
    description: "Active tillering and vegetative growth phase. Apply split nitrogen doses and manage water levels.",
    tasks: ["First N top-dress (21 DAT)", "Second N top-dress (42 DAT)", "Weed management", "Maintain 5 cm water", "Monitor for pests"],
    tips: ["Use LCC for nitrogen management", "Control weeds within 45 days", "Monitor for BPH and stem borer"], color: "#22c55e" },
  { id: 5, name: "Flowering", icon: "🌸", dateRange: "6 Aug – 20 Aug", duration: "15 days", status: "active",
    description: "Panicle initiation and flowering stage. Critical phase — avoid any water stress and protect from pests.",
    tasks: ["Third N top-dress (PI stage)", "Maintain 5 cm water", "Pest surveillance (twice/week)", "No field drainage", "Foliar spray of KCl 1%"],
    tips: ["Most critical growth stage", "Any stress now directly reduces yield", "Monitor for neck blast disease"], color: "#ec4899" },
  { id: 6, name: "Grain Formation", icon: "🌾", dateRange: "21 Aug – 15 Sep", duration: "25 days", status: "upcoming",
    description: "Grain filling and maturation. Gradually reduce water. Monitor grain moisture for harvest timing.",
    tasks: ["Reduce irrigation gradually", "Monitor grain moisture", "Bird scaring if needed", "Prepare harvesting equipment"],
    tips: ["Drain field 15 days before harvest", "Check grain moisture (20-22% ideal)", "Avoid late nitrogen application"], color: "#f59e0b" },
  { id: 7, name: "Harvest", icon: "🚜", dateRange: "16 Sep – 25 Sep", duration: "10 days", status: "upcoming",
    description: "Harvest when 80% of panicles are golden. Use combine harvester or manual cutting.",
    tasks: ["Harvest at 20-22% grain moisture", "Thresh within 24 hours", "Dry to 14% moisture", "Clean and bag grain"],
    tips: ["Early morning harvest reduces shattering", "Avoid delayed harvest (>5 days)", "Grade based on quality parameters"], color: "#ea580c" },
  { id: 8, name: "Post-Harvest Storage", icon: "🏪", dateRange: "26 Sep – 5 Oct", duration: "10 days", status: "upcoming",
    description: "Proper drying, cleaning, grading, and storage. Ensure moisture below 14% for safe storage.",
    tasks: ["Sun-dry to 14% moisture", "Clean and grade grain", "Store in clean, dry godown", "Apply Neem leaf layers", "Record weight and grade"],
    tips: ["Use hermetic storage bags (PICS)", "Stack on dunnage, away from walls", "Check every 15 days for pests"], color: "#8b5cf6" },
  { id: 9, name: "Market / Sell", icon: "🏪", dateRange: "6 Oct onwards", duration: "Ongoing", status: "upcoming",
    description: "Sell through APMC mandi, direct procurement, or e-NAM platform for best price realization.",
    tasks: ["Check MSP and market prices", "Register on e-NAM portal", "Arrange transport to mandi", "Keep quality certificates ready", "Explore FPO aggregation"],
    tips: ["Compare prices across mandis", "Sell in phased manner for better returns", "Store if price is below MSP"], color: "#16a34a" },
];

export default function CropTimelinePage() {
  const [selectedStage, setSelectedStage] = useState<number>(5); // Active stage
  const activeIdx = stages.findIndex(s => s.status === "active");

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
        <div>
          <div className="page-title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <CalendarDays size={20} color="#16a34a" /> Crop Growth Timeline
          </div>
          <div className="page-subtitle">Interactive crop calendar with stage-wise guidance for Rice (Kharif 2026)</div>
        </div>
        <span className="badge badge-green" style={{ padding: "4px 10px" }}>
          Stage {activeIdx + 1}/9 — {stages[activeIdx]?.name}
        </span>
      </div>

      {/* Interactive Timeline */}
      <div className="card" style={{ marginBottom: 16, padding: "24px 20px", overflowX: "auto" }}>
        <div style={{ position: "relative", minWidth: 800, padding: "0 20px" }}>
          {/* Track line */}
          <div style={{ position: "absolute", top: 28, left: 40, right: 40, height: 4, background: "var(--border-color)", zIndex: 0 }} />
          <div style={{ position: "absolute", top: 28, left: 40, width: `${((activeIdx + 0.5) / stages.length) * 100}%`, height: 4, background: "linear-gradient(90deg, #16a34a, #22c55e)", zIndex: 0, borderRadius: 2 }} />

          {/* Stage nodes */}
          <div style={{ display: "flex", justifyContent: "space-between", position: "relative", zIndex: 1 }}>
            {stages.map((stage, i) => {
              const isSelected = selectedStage === stage.id;
              const isActive = stage.status === "active";
              const isCompleted = stage.status === "completed";
              return (
                <motion.div key={stage.id} whileHover={{ scale: 1.1 }}
                  onClick={() => setSelectedStage(stage.id)}
                  style={{ textAlign: "center", cursor: "pointer", width: 80 }}>
                  <div style={{
                    width: isActive ? 36 : 28, height: isActive ? 36 : 28,
                    borderRadius: "50%", margin: `${isActive ? 12 : 16}px auto 8px`,
                    background: isCompleted ? "#16a34a" : isActive ? stage.color : "var(--border-color)",
                    color: "white", display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: isActive ? 18 : 14,
                    border: isSelected ? "3px solid #0f172a" : isActive ? `3px solid ${stage.color}40` : "2px solid white",
                    boxShadow: isActive ? `0 0 15px ${stage.color}40` : isSelected ? "0 0 10px rgba(0,0,0,0.2)" : "none",
                    transition: "all 0.3s",
                  }}>
                    {isCompleted ? <CheckCircle2 size={14} /> : stage.icon}
                  </div>
                  <div style={{ fontSize: 10, fontWeight: isSelected || isActive ? 700 : 500, color: isActive ? stage.color : isCompleted ? "#16a34a" : "var(--text-muted)", lineHeight: 1.2 }}>
                    {stage.name}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Stage Detail */}
      <AnimatePresence mode="wait">
        {stages.filter(s => s.id === selectedStage).map(stage => (
          <motion.div key={stage.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
            <div className="grid-2" style={{ gap: 16 }}>
              {/* Info Card */}
              <div className="card">
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: `${stage.color}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>
                    {stage.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: 20, fontWeight: 700, color: "var(--text-dark)" }}>{stage.name}</div>
                    <div style={{ display: "flex", gap: 12, fontSize: 12, color: "var(--text-muted)" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 4 }}><CalendarDays size={12} /> {stage.dateRange}</span>
                      <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Clock size={12} /> {stage.duration}</span>
                    </div>
                  </div>
                  <span className={`badge ${stage.status === "completed" ? "badge-green" : stage.status === "active" ? "badge-yellow" : ""}`} style={{ marginLeft: "auto", fontSize: 10 }}>
                    {stage.status === "completed" ? "✓ Completed" : stage.status === "active" ? "In Progress" : "Upcoming"}
                  </span>
                </div>
                <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.6, marginBottom: 16 }}>{stage.description}</p>

                {/* Tips */}
                <div style={{ background: "#fefce8", border: "1px solid #fde68a", borderRadius: 10, padding: 14 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#b45309", marginBottom: 8 }}>💡 Expert Tips</div>
                  {stage.tips.map((tip, j) => (
                    <div key={j} style={{ fontSize: 12, color: "#92400e", marginBottom: 4, display: "flex", alignItems: "flex-start", gap: 6 }}>
                      <span>•</span> {tip}
                    </div>
                  ))}
                </div>
              </div>

              {/* Tasks */}
              <div className="card">
                <div className="section-title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <CheckCircle2 size={14} color={stage.color} /> Stage Tasks
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {stage.tasks.map((task, j) => (
                    <div key={j} style={{
                      display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", borderRadius: 10,
                      background: stage.status === "completed" ? "#f0fdf4" : `${stage.color}06`,
                      border: `1px solid ${stage.status === "completed" ? "#bbf7d0" : `${stage.color}20`}`,
                    }}>
                      <div style={{
                        width: 24, height: 24, borderRadius: "50%",
                        background: stage.status === "completed" ? "#16a34a" : stage.status === "active" ? `${stage.color}20` : "var(--border-color)",
                        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                      }}>
                        {stage.status === "completed" ? <CheckCircle2 size={14} color="white" /> : <span style={{ fontSize: 10, fontWeight: 700, color: stage.color }}>{j + 1}</span>}
                      </div>
                      <span style={{ fontSize: 13, color: stage.status === "completed" ? "#16a34a" : "var(--text-dark)", fontWeight: 500 }}>{task}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      <ModuleAIAdvisor
        moduleId="crop-timeline"
        moduleName="Crop Timeline"
        moduleIcon="🌱"
        contextData={{ activeStage: stages.find(s => s.status === "active")?.name || "Flowering", completedStages: stages.filter(s => s.status === "completed").length, totalStages: stages.length, stages: stages.map(s => ({ name: s.name, status: s.status, dateRange: s.dateRange })) }}
      />
    </div>
  );
}
