import { X, Download, FileText, CheckCircle2 } from "lucide-react";

interface ApplicationReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  scheme: any;
  farmData: any;
  referenceId: string;
}

export default function ApplicationReceiptModal({ isOpen, onClose, scheme, farmData, referenceId }: ApplicationReceiptModalProps) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0, 
      background: "rgba(15, 23, 42, 0.7)", backdropFilter: "blur(4px)",
      zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center",
      padding: 20
    }}>
      <div style={{
        background: "var(--bg-card, #ffffff)", borderRadius: 16, width: "100%", maxWidth: 500,
        boxShadow: "0 20px 40px rgba(0,0,0,0.2)", overflow: "hidden", animation: "slideUp 0.3s ease-out"
      }}>
        {/* Header */}
        <div style={{ background: "linear-gradient(135deg, #10b981, #059669)", padding: "24px 20px", color: "white", position: "relative" }}>
          <button 
            onClick={onClose}
            style={{ position: "absolute", top: 16, right: 16, background: "rgba(255,255,255,0.2)", border: "none", color: "white", borderRadius: "50%", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
          >
            <X size={18} />
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <div style={{ background: "white", borderRadius: "50%", width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <CheckCircle2 color="#059669" size={24} />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Application Successful</h2>
              <div style={{ fontSize: 13, opacity: 0.9 }}>Agentic AI submission complete</div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: 24 }}>
          <div style={{ border: "1px dashed var(--border-color, #cbd5e1)", borderRadius: 12, padding: 16, marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <span style={{ color: "var(--text-secondary, #64748b)", fontSize: 13, fontWeight: 500 }}>Reference ID</span>
              <span style={{ fontWeight: 700, fontFamily: "monospace", color: "var(--text-primary, #1e293b)" }}>{referenceId}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <span style={{ color: "var(--text-secondary, #64748b)", fontSize: 13, fontWeight: 500 }}>Scheme Name</span>
              <span style={{ fontWeight: 600, color: "var(--text-primary, #1e293b)", textAlign: "right" }}>{scheme.name}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <span style={{ color: "var(--text-secondary, #64748b)", fontSize: 13, fontWeight: 500 }}>Benefit Amount</span>
              <span style={{ fontWeight: 600, color: "#059669" }}>{scheme.benefit}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-secondary, #64748b)", fontSize: 13, fontWeight: 500 }}>Submission Date</span>
              <span style={{ fontWeight: 600, color: "var(--text-primary, #1e293b)" }}>{new Date().toLocaleDateString()}</span>
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary, #1e293b)", marginBottom: 12 }}>Data Injected by AI:</h3>
            <div style={{ background: "var(--bg-sidebar, #f8fafc)", borderRadius: 8, padding: 12, fontSize: 13, color: "var(--text-secondary, #475569)", display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", gap: 8 }}><CheckCircle2 size={14} color="#10b981" /> Verified Aadhaar Integration</div>
              <div style={{ display: "flex", gap: 8 }}><CheckCircle2 size={14} color="#10b981" /> {farmData?.landArea || 10} Acres Land Record Attached</div>
              <div style={{ display: "flex", gap: 8 }}><CheckCircle2 size={14} color="#10b981" /> Digital Signature Applied</div>
            </div>
          </div>

          {/* Barcode mockup */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 24, opacity: 0.6 }}>
             <div style={{ height: 40, width: "80%", background: "repeating-linear-gradient(90deg, #000, #000 2px, transparent 2px, transparent 4px, #000 4px, #000 5px, transparent 5px, transparent 8px, #000 8px, #000 12px, transparent 12px, transparent 14px)", borderRadius: 4 }}></div>
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <button 
              onClick={onClose}
              style={{ flex: 1, padding: "12px", background: "transparent", border: "1px solid var(--border-color, #cbd5e1)", borderRadius: 8, fontWeight: 600, color: "var(--text-primary, #334155)", cursor: "pointer" }}
            >
              Close
            </button>
            <button 
              onClick={() => alert("Downloading officially stamped PDF...")}
              style={{ flex: 2, padding: "12px", background: "#0f172a", border: "none", borderRadius: 8, fontWeight: 600, color: "white", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, cursor: "pointer" }}
            >
              <Download size={16} /> Download Official Receipt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
