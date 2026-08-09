"use client";
import { useState, useRef, useEffect } from "react";
import { Bot, Send, Sparkles, ChevronDown, ChevronUp, Loader2, X, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* ─── Types ─── */
interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ModuleAIAdvisorProps {
  moduleId: string;
  moduleName: string;
  moduleIcon: string;
  contextData: Record<string, unknown>;
}

/* ─── Typing animation component ─── */
const TypingText = ({ text }: { text: string }) => {
  const [displayed, setDisplayed] = useState("");
  const idx = useRef(0);

  useEffect(() => {
    idx.current = 0;
    setDisplayed("");
    const interval = setInterval(() => {
      idx.current += 2;
      setDisplayed(text.slice(0, idx.current));
      if (idx.current >= text.length) clearInterval(interval);
    }, 8);
    return () => clearInterval(interval);
  }, [text]);

  return <span>{displayed}{displayed.length < text.length ? "▊" : ""}</span>;
};

/* ─── Main Component ─── */
export default function ModuleAIAdvisor({ moduleId, moduleName, moduleIcon, contextData }: ModuleAIAdvisorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasInsight, setHasInsight] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const callAdvisor = async (userQuestion?: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/module-advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          moduleId,
          moduleName,
          contextData,
          userQuestion,
          history: messages.slice(-6),
        }),
      });

      if (!res.ok) throw new Error(`API error ${res.status}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setMessages(prev => [
        ...prev,
        ...(userQuestion ? [{ role: "user" as const, content: userQuestion }] : []),
        { role: "assistant" as const, content: data.message },
      ]);
      setHasInsight(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to get AI response");
    } finally {
      setLoading(false);
    }
  };

  const handleSend = () => {
    if (!input.trim() || loading) return;
    const q = input.trim();
    setInput("");
    callAdvisor(q);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const generateInsight = () => {
    if (!hasInsight && !loading) {
      callAdvisor();
    }
    setIsOpen(true);
  };

  return (
    <>
      {/* ── Floating trigger button ── */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, type: "spring" }}
          onClick={generateInsight}
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #16a34a, #22c55e)",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 20px rgba(34,197,94,0.4), 0 0 40px rgba(34,197,94,0.15)",
            zIndex: 1000,
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Bot size={26} />
          {!hasInsight && (
            <motion.div
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              style={{
                position: "absolute",
                top: -2,
                right: -2,
                width: 16,
                height: 16,
                borderRadius: "50%",
                background: "#f59e0b",
                border: "2px solid #fff",
              }}
            />
          )}
        </motion.button>
      )}

      {/* ── Advisor Panel ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: "spring", damping: 25 }}
            style={{
              position: "fixed",
              bottom: 24,
              right: 24,
              width: 400,
              maxHeight: "70vh",
              background: "var(--bg-card)",
              borderRadius: 16,
              border: "1px solid var(--border-color)",
              boxShadow: "0 8px 40px rgba(0,0,0,0.15), 0 0 0 1px rgba(34,197,94,0.1)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              zIndex: 1000,
            }}
          >
            {/* Header */}
            <div style={{
              background: "linear-gradient(135deg, #16a34a, #15803d)",
              padding: "14px 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              color: "#fff",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: "rgba(255,255,255,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 18,
                }}>
                  {moduleIcon}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>AI Advisor</div>
                  <div style={{ fontSize: 10, opacity: 0.85 }}>{moduleName}</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <button
                  onClick={() => setIsOpen(false)}
                  style={{
                    background: "rgba(255,255,255,0.15)",
                    border: "none",
                    borderRadius: 6,
                    width: 28, height: 28,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", color: "#fff",
                  }}
                >
                  <ChevronDown size={16} />
                </button>
              </div>
            </div>

            {/* Messages area */}
            <div
              ref={scrollRef}
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "12px 14px",
                display: "flex",
                flexDirection: "column",
                gap: 10,
                minHeight: 200,
                maxHeight: "calc(70vh - 130px)",
              }}
            >
              {messages.length === 0 && !loading && (
                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 12,
                  padding: "30px 20px",
                  textAlign: "center",
                  color: "var(--text-muted)",
                }}>
                  <Sparkles size={32} color="#22c55e" style={{ opacity: 0.5 }} />
                  <div style={{ fontSize: 13, fontWeight: 600 }}>AI Advisor Ready</div>
                  <div style={{ fontSize: 11, lineHeight: 1.5 }}>
                    Click <strong>&quot;Generate Insight&quot;</strong> for an AI analysis of your {moduleName.toLowerCase()} data, or ask any question below.
                  </div>
                  <button
                    onClick={() => callAdvisor()}
                    disabled={loading}
                    style={{
                      marginTop: 8,
                      padding: "8px 20px",
                      borderRadius: 8,
                      border: "none",
                      background: "linear-gradient(135deg, #16a34a, #22c55e)",
                      color: "#fff",
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <Sparkles size={14} /> Generate Insight
                  </button>
                </div>
              )}

              {messages.map((msg, i) => (
                <div
                  key={i}
                  style={{
                    alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                    maxWidth: "88%",
                  }}
                >
                  {msg.role === "assistant" && (
                    <div style={{
                      display: "flex", alignItems: "center", gap: 6,
                      marginBottom: 4,
                      fontSize: 10, fontWeight: 600, color: "#16a34a",
                    }}>
                      <Bot size={12} /> AI Advisor
                    </div>
                  )}
                  <div
                    style={{
                      padding: "10px 14px",
                      borderRadius: msg.role === "user"
                        ? "12px 12px 4px 12px"
                        : "12px 12px 12px 4px",
                      background: msg.role === "user"
                        ? "linear-gradient(135deg, #16a34a, #22c55e)"
                        : "var(--bg-page)",
                      color: msg.role === "user" ? "#fff" : "var(--text-dark)",
                      fontSize: 12,
                      lineHeight: 1.6,
                      border: msg.role === "assistant" ? "1px solid var(--border-color)" : "none",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {i === messages.length - 1 && msg.role === "assistant"
                      ? <TypingText text={msg.content} />
                      : msg.content
                    }
                  </div>
                </div>
              ))}

              {loading && (
                <div style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "10px 14px",
                  borderRadius: 12,
                  background: "var(--bg-page)",
                  border: "1px solid var(--border-color)",
                  alignSelf: "flex-start",
                  fontSize: 12,
                  color: "var(--text-muted)",
                }}>
                  <Loader2 size={14} className="animate-spin" style={{ animation: "spin 1s linear infinite" }} />
                  Analyzing your {moduleName.toLowerCase()} data...
                </div>
              )}

              {error && (
                <div style={{
                  padding: "10px 14px",
                  borderRadius: 12,
                  background: "#fef2f2",
                  border: "1px solid #fecaca",
                  color: "#dc2626",
                  fontSize: 12,
                  alignSelf: "flex-start",
                }}>
                  ⚠️ {error}
                </div>
              )}
            </div>

            {/* Input area */}
            <div style={{
              padding: "10px 12px",
              borderTop: "1px solid var(--border-color)",
              display: "flex",
              gap: 8,
              alignItems: "center",
              background: "var(--bg-card)",
            }}>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Ask about ${moduleName.toLowerCase()}...`}
                disabled={loading}
                style={{
                  flex: 1,
                  padding: "10px 14px",
                  borderRadius: 10,
                  border: "1px solid var(--border-color)",
                  background: "var(--bg-page)",
                  color: "var(--text-dark)",
                  fontSize: 12,
                  outline: "none",
                  fontFamily: "inherit",
                }}
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  border: "none",
                  background: input.trim() ? "linear-gradient(135deg, #16a34a, #22c55e)" : "var(--border-color)",
                  color: input.trim() ? "#fff" : "var(--text-muted)",
                  cursor: input.trim() ? "pointer" : "default",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Send size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Keyframe for loader spin */}
      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}
