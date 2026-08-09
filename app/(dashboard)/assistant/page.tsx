"use client";
import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { Send, Bot, User, Mic, MicOff, Loader2, Volume2, VolumeX, ChevronDown, ChevronUp, Sparkles, Zap, Shield, Brain } from "lucide-react";
import { formatMessage } from "@/lib/formatMessage";
import { motion, AnimatePresence } from "framer-motion";
import { voiceService } from "@/services/voiceService";
import type { LanguageCode, ChatMessage } from "@/lib/types";
import { useLocale, LocaleProvider } from "@/contexts/LocaleContext";
import ProLock from "@/components/ProLock";

const LANGUAGES: Record<string, { name: string; native: string }> = {
  en: { name: "English", native: "English" },
  ml: { name: "Malayalam", native: "മലയാളം" },
  hi: { name: "Hindi", native: "हिंदी" },
  bn: { name: "Bengali", native: "বাংলা" },
  ta: { name: "Tamil", native: "தமிழ்" },
  te: { name: "Telugu", native: "తెలుగు" },
  mr: { name: "Marathi", native: "मराठी" },
  gu: { name: "Gujarati", native: "ગુજરાતી" },
  pa: { name: "Punjabi", native: "ਪੰਜਾਬੀ" },
  kn: { name: "Kannada", native: "ಕನ್ನಡ" },
  or: { name: "Odia", native: "ଓଡ଼ିଆ" },
  as: { name: "Assamese", native: "অসমীয়া" },
  ne: { name: "Nepali", native: "नेपाली" },
  ur: { name: "Urdu", native: "اردو" },
  sa: { name: "Sanskrit", native: "संस्कृतम्" },
  ks: { name: "Kashmiri", native: "कॉशुर" },
  sd: { name: "Sindhi", native: "सिन्धी" },
  mai: { name: "Maithili", native: "मैथिली" },
  bo: { name: "Bodo", native: "बरʼ" },
  doi: { name: "Dogri", native: "डोगरी" },
  mni: { name: "Manipuri", native: "মৈতৈলোন্" },
  kok: { name: "Konkani", native: "कोंकणी" },
  sat: { name: "Santali", native: "ᱥᱟᱱᱛᱟᱲᱤ" },
};

const QUICK_QUESTION_META = [
  { icon: "💧", agent: "Soil" },
  { icon: "🌱", agent: "Crop" },
  { icon: "🐛", agent: "Disease" },
  { icon: "💦", agent: "Irrigation" },
  { icon: "🦗", agent: "Pest IPM" }
];

const AGENT_LIST = [
  { icon: "🌱", name: "Crop Advisor" },
  { icon: "🐛", name: "Disease Diagnostician" },
  { icon: "💧", name: "Soil Scientist" },
  { icon: "🌤️", name: "Weather Advisor" },
  { icon: "💰", name: "Market Analyst" },
  { icon: "🏛️", name: "Govt Schemes" },
  { icon: "🐄", name: "Livestock Advisor" },
  { icon: "🌿", name: "Organic Expert" },
  { icon: "📦", name: "Post-Harvest" },
  { icon: "💦", name: "Irrigation Engineer" },
  { icon: "🦗", name: "Pest IPM" },
  { icon: "🌾", name: "Seed & Variety" },
  { icon: "🚜", name: "Mechanization" },
  { icon: "🌸", name: "Horticulture" },
  { icon: "🐝", name: "Apiculture" },
  { icon: "🌲", name: "Agroforestry" },
  { icon: "🐟", name: "Aquaculture" },
  { icon: "🌊", name: "Disaster Mgmt" },
  { icon: "💵", name: "Farm Finance" },
  { icon: "🧬", name: "Crop Biotech" },
];

function formatTime() {
  return new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}

// ── Thinking Animation Component ─────────────────────────────────────────────
function ThinkingIndicator({ stage }: { stage: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ display: "flex", alignItems: "center", gap: 10 }}
    >
      <div style={{
        width: 32, height: 32, borderRadius: "50%",
        background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
        display: "flex", alignItems: "center", justifyContent: "center",
        position: "relative",
      }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          style={{ position: "absolute", inset: -3, borderRadius: "50%", border: "2px solid transparent", borderTopColor: "#22c55e", borderRightColor: "#22c55e" }}
        />
        <Brain size={14} color="white" />
      </div>
      <div style={{
        padding: "8px 14px", borderRadius: "12px",
        background: "linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)",
        border: "1px solid #bbf7d0", fontSize: 13, color: "#15803d",
        display: "flex", alignItems: "center", gap: 8,
      }}>
        <motion.div
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <Sparkles size={14} />
        </motion.div>
        {stage}
      </div>
    </motion.div>
  );
}

// ── Agent Badge Component ────────────────────────────────────────────────────
function AgentBadge({ icon, name, count }: { icon: string; name: string; count?: number }) {
  return (
    <span className="agent-badge-glow" style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: "2px 8px", borderRadius: 20,
      background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
      border: "1px solid #bbf7d0",
      fontSize: 10, fontWeight: 600, color: "#15803d",
      whiteSpace: "nowrap",
    }}>
      <span>{icon}</span> {name}
      {count && count > 1 && (
        <span style={{
          background: "#16a34a", color: "white", borderRadius: "50%",
          width: 16, height: 16, display: "inline-flex", alignItems: "center", justifyContent: "center",
          fontSize: 9, fontWeight: 700,
        }}>+{count - 1}</span>
      )}
    </span>
  );
}

// Confidence Meter was removed by request

// ── Main Component ───────────────────────────────────────────────────────────
function AssistantPageInner() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [micState, setMicState] = useState<"idle" | "listening" | "processing" | "speaking">("idle");
  const [isRecording, setIsRecording] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [playingMessage, setPlayingMessage] = useState<string | null>(null);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [thinkingStage, setThinkingStage] = useState("");
  const [expandedReasoning, setExpandedReasoning] = useState<string | null>(null);
  const [showAgents, setShowAgents] = useState(false);

  const { lang, setLang, t } = useLocale();
  const bottomRef = useRef<HTMLDivElement>(null);
  const prevLangRef = useRef(lang);

  useEffect(() => {
    if (!hasInitialized) {
      setMessages([{
        id: Date.now().toString(),
        role: "assistant",
        content: t.greeting,
        time: formatTime(),
        agentName: "Agri Nova AI",
        agentIcon: "🧠",
        confidence: 95,
      }]);
      setHasInitialized(true);
    }
  }, [t.greeting, hasInitialized]);

  useEffect(() => {
    if (hasInitialized && prevLangRef.current !== lang && prevLangRef.current) {
      prevLangRef.current = lang;
      voiceService.stopSpeech();
      setPlayingMessage(null);
      setMessages([{
        id: Date.now().toString(),
        role: "assistant",
        content: t.greeting,
        time: formatTime(),
        agentName: "Agri Nova AI",
        agentIcon: "🧠",
        confidence: 95,
      }]);
    }
    prevLangRef.current = lang;
  }, [lang, hasInitialized, t.greeting]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const placeholder = useMemo(() => t.placeholder, [t.placeholder]);

  useEffect(() => {
    setInput("");
  }, [t.placeholder]);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  async function sendToAI(userMessage: string) {
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: userMessage,
      time: formatTime(),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setIsLoading(true);
    setError(null);

    // Thinking animation stages
    setThinkingStage("🧠 Analyzing your query...");
    setTimeout(() => setThinkingStage("📋 Routing to specialist agent..."), 800);
    setTimeout(() => setThinkingStage("🔗 Building reasoning chain..."), 1600);
    setTimeout(() => setThinkingStage("🎯 Expert agent is working..."), 2400);

    const assistantMsgId = (Date.now() + 1).toString();
    const assistantMsg: ChatMessage = {
      id: assistantMsgId,
      role: "assistant",
      content: "",
      time: formatTime(),
    };
    setMessages([...newMessages, assistantMsg]);

    try {
      const conversationHistory = newMessages.map(m => ({
        role: m.role,
        content: m.content
      }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: conversationHistory,
          language: lang
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to get response");
      }

      setThinkingStage("✅ Validating response...");

      setTimeout(() => {
        setMessages(prev => prev.map(m =>
          m.id === assistantMsgId ? {
            ...m,
            content: data.message,
            agentName: data.agentName || "Agri Nova AI",
            agentIcon: data.agentIcon || "🧠",
            agentsUsed: data.agentsUsed,
            confidence: data.confidence,
            toolsUsed: data.toolsUsed,
            reasoningSteps: data.reasoningSteps,
            dataCards: data.dataCards,
          } : m
        ));
        setThinkingStage("");
      }, 300);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Something went wrong";
      setError(errorMessage);
      setMessages(prev => prev.map(m =>
        m.id === assistantMsgId ? {
          ...m,
          content: `⚠️ Sorry, I encountered an error: ${errorMessage}`
        } : m
      ));
      setThinkingStage("");
    } finally {
      setIsLoading(false);
    }
  }

  function sendMsg(text?: string) {
    const q = (text ?? input).trim();
    if (!q) return;
    setInput("");
    sendToAI(q);
  }

  async function toggleVoice() {
    if (micState === "speaking") {
      voiceService.stopSpeech();
      setPlayingMessage(null);
      setMicState("idle");
      return;
    }

    if (isRecording) {
      setMicState("processing");
      setIsRecording(false);

      voiceService.stopListening(lang, (text) => {
        setMicState("idle");
        setInput("");
        if (text.trim()) {
          sendToAI(text.trim());
        }
      }, (err) => {
        showToast(err);
        setMicState("idle");
        setInput("");
      });
      return;
    }

    if (micState === "listening") {
      voiceService.abortListening();
      setMicState("idle");
      setIsRecording(false);
      setInput("");
      return;
    }

    setMicState("listening");
    setIsRecording(true);

    voiceService.startListening(
      lang,
      (text) => {
        setMicState("idle");
        setIsRecording(false);
        setInput("");
        if (text.trim()) {
          sendToAI(text.trim());
        }
      },
      (err) => {
        showToast(err);
        setMicState("idle");
        setIsRecording(false);
        setInput("");
      },
      (interim) => {
        setInput(interim);
      }
    );
  }

  const playMessage = useCallback(async (msgId: string) => {
    const msg = messages.find(m => m.id === msgId);
    if (!msg || msg.role === "user" || !msg.content) return;

    if (playingMessage === msgId) {
      voiceService.stopAllPlayback();
      setPlayingMessage(null);
      return;
    }

    voiceService.stopAllPlayback();
    setPlayingMessage(msgId);

    try {
      await voiceService.cloudTextToSpeech(
        msg.content,
        lang,
        () => {},
        () => setPlayingMessage(null),
        () => setPlayingMessage(null)
      );
    } catch {
      setPlayingMessage(null);
    }
  }, [messages, playingMessage, lang]);

  const clearChat = () => {
    setMessages([{
      id: Date.now().toString(),
      role: "assistant",
      content: t.greeting,
      time: formatTime(),
      agentName: "Agri Nova AI",
      agentIcon: "🧠",
      confidence: 95,
    }]);
    setError(null);
    setExpandedReasoning(null);
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 16 }}>
        <div>
          <div className="page-title" style={{ marginBottom: 4, display: "flex", alignItems: "center", gap: 8 }}>
            <span>AI Farm Assistant</span>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 4,
              padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700,
              background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
              color: "white", letterSpacing: "0.5px",
            }}>
              <Zap size={11} /> 25 AGENTS
            </span>
          </div>
          <div className="page-subtitle" style={{ marginBottom: 0 }}>
            Powered by 25 specialist AI agents • 23 languages
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button
            onClick={clearChat}
            style={{
              padding: "6px 12px", borderRadius: "8px",
              border: "1px solid #e5e7eb", background: "white",
              color: "#6b7280", fontSize: 12, cursor: "pointer",
            }}
          >
            Clear Chat
          </button>
          <select
            value={lang}
            onChange={(e) => {
              const newLang = e.target.value as LanguageCode;
              setLang(newLang);
              setInput("");
            }}
            style={{
              padding: "6px 12px", borderRadius: "8px",
              border: "1px solid #e5e7eb", fontSize: 13,
              background: "#ffffff", color: "#374151",
              outline: "none", cursor: "pointer", fontWeight: 500
            }}
          >
            {Object.entries(LANGUAGES).map(([code, config]) => (
              <option key={code} value={code}>{config.native} ({config.name})</option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 20 }}>
        {/* Chat Area */}
        <div className="card chat-glass" style={{ display: "flex", flexDirection: "column", height: 600, padding: 0 }}>
          <div style={{ flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: 16 }}>
            <AnimatePresence>
            {messages.map((m, i) => (
              <motion.div 
                key={m.id}
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                style={{ display: "flex", gap: 12, alignItems: "flex-start", flexDirection: m.role === "user" ? "row-reverse" : "row" }}
              >
                {/* Avatar */}
                <div style={{
                  width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
                  background: m.role === "assistant"
                    ? "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)"
                    : "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  position: "relative", border: m.role === "assistant" ? "1.5px solid #86efac" : "1.5px solid #93c5fd",
                }}>
                  {m.role === "assistant" ? (
                    <span style={{ fontSize: 14 }}>{m.agentIcon || "🧠"}</span>
                  ) : (
                    <User size={16} color="#3b82f6" />
                  )}
                  {m.role === "assistant" && playingMessage === m.id && (
                    <motion.div
                      animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "2px solid #16a34a" }}
                    />
                  )}
                </div>

                {/* Message Content */}
                <div style={{ maxWidth: "78%" }}>
                  {/* Agent Badge (for assistant messages with content) */}
                  {m.role === "assistant" && m.content && m.agentName && (
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4, flexWrap: "wrap" }}>
                      <AgentBadge
                        icon={m.agentIcon || "🧠"}
                        name={m.agentName}
                        count={m.agentsUsed?.length}
                      />
                      {m.toolsUsed && m.toolsUsed.length > 0 && (
                        <span style={{ fontSize: 9, color: "#9ca3af", display: "flex", alignItems: "center", gap: 2 }}>
                          <Shield size={9} /> {m.toolsUsed.length} tools
                        </span>
                      )}
                    </div>
                  )}

                  {/* Message Bubble */}
                  <div className={m.role === "user" ? "premium-bubble-user" : "premium-bubble-ai"} style={{
                    padding: "12px 18px",
                    fontSize: 14, lineHeight: 1.6,
                  }}>
                    {m.role === "assistant" && m.content ? (
                      <div dangerouslySetInnerHTML={{ __html: formatMessage(m.content) }} />
                    ) : m.role === "assistant" && isLoading ? (
                      <span style={{ color: "#9ca3af", fontStyle: "italic" }}>Thinking...</span>
                    ) : (
                      m.content
                    )}

                    {/* Pro Max Interactive Data Cards */}
                    {m.dataCards && m.dataCards.length > 0 && (
                      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 12 }}>
                        {m.dataCards.map((card, idx) => (
                          <div key={idx} className="ai-data-card">
                            <div className="ai-data-card-title">
                              {card.type === 'weather' ? '🌤️' : card.type === 'soil' ? '🌱' : card.type === 'market' ? '📈' : '📊'} 
                              {card.title}
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 8 }}>
                              {Object.entries(card.data).map(([key, val]) => (
                                <div key={key} style={{ background: "rgba(255,255,255,0.5)", padding: "8px 12px", borderRadius: 8, border: "1px solid rgba(22,163,74,0.1)" }}>
                                  <div style={{ fontSize: 10, color: "#6b7280", textTransform: "uppercase", fontWeight: 600 }}>{key}</div>
                                  <div style={{ fontSize: 14, fontWeight: 700, color: "#111827", marginTop: 2 }}>{String(val)}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Footer: time, listen, reasoning toggle */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4, flexWrap: "wrap" }}>
                    <div style={{ fontSize: 10, color: "#9ca3af" }}>{m.time}</div>

                    {m.role === "assistant" && m.content && (
                      <button
                        onClick={() => playMessage(m.id)}
                        style={{
                          display: "flex", alignItems: "center", gap: 4,
                          padding: "2px 8px", borderRadius: 12,
                          border: playingMessage === m.id ? "1px solid #22c55e" : "1px solid #e5e7eb",
                          background: playingMessage === m.id ? "#f0fdf4" : "white",
                          color: playingMessage === m.id ? "#16a34a" : "#6b7280",
                          fontSize: 10, cursor: "pointer",
                        }}
                      >
                        {playingMessage === m.id ? <VolumeX size={12} /> : <Volume2 size={12} />}
                        {playingMessage === m.id ? "Stop" : "Listen"}
                      </button>
                    )}

                    {/* Multi-agent tag */}
                    {m.agentsUsed && m.agentsUsed.length > 1 && (
                      <span style={{
                        fontSize: 9, color: "#16a34a", fontWeight: 600,
                        display: "flex", alignItems: "center", gap: 3,
                        padding: "1px 6px", borderRadius: 8,
                        background: "#f0fdf4", border: "1px solid #dcfce7",
                      }}>
                        <Sparkles size={9} /> {m.agentsUsed.length} agents
                      </span>
                    )}

                    {/* Reasoning expandable */}
                    {m.reasoningSteps && m.reasoningSteps.length > 0 && (
                      <button
                        onClick={() => setExpandedReasoning(expandedReasoning === m.id ? null : m.id)}
                        style={{
                          display: "flex", alignItems: "center", gap: 3,
                          padding: "1px 6px", borderRadius: 8,
                          border: "1px solid #e5e7eb", background: "white",
                          fontSize: 9, color: "#6b7280", cursor: "pointer",
                        }}
                      >
                        <Brain size={9} /> Reasoning
                        {expandedReasoning === m.id ? <ChevronUp size={9} /> : <ChevronDown size={9} />}
                      </button>
                    )}
                  </div>

                  {/* Expanded Reasoning Steps */}
                  <AnimatePresence>
                    {expandedReasoning === m.id && m.reasoningSteps && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        style={{
                          marginTop: 6, padding: "8px 12px", borderRadius: 8,
                          background: "#fefce8", border: "1px solid #fef08a",
                          fontSize: 11, color: "#854d0e", overflow: "hidden",
                        }}
                      >
                        <div style={{ fontWeight: 700, marginBottom: 4, fontSize: 10 }}>🔗 AI Reasoning Chain</div>
                        {m.reasoningSteps.map((step, i) => (
                          <div key={i} style={{ display: "flex", gap: 6, marginBottom: 2 }}>
                            <span style={{ color: "#ca8a04", fontWeight: 700 }}>{i + 1}.</span>
                            <span>{step}</span>
                          </div>
                        ))}
                        {m.toolsUsed && m.toolsUsed.length > 0 && (
                          <div style={{ marginTop: 4, paddingTop: 4, borderTop: "1px solid #fef08a" }}>
                            <span style={{ fontWeight: 700, fontSize: 10 }}>🔧 Tools used: </span>
                            {m.toolsUsed.join(", ")}
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
            </AnimatePresence>

            {/* Thinking Animation */}
            {isLoading && thinkingStage && (
              <ThinkingIndicator stage={thinkingStage} />
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input Area */}
          <div style={{ display: "flex", gap: 10, padding: "16px 20px", borderTop: "1px solid rgba(0,0,0,0.05)", background: "rgba(255,255,255,0.4)", backdropFilter: "blur(10px)" }}>
            <input
              className="form-input"
              placeholder={isRecording ? "Speaking..." : placeholder}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !isRecording && !isLoading && sendMsg()}
              disabled={isLoading || isRecording}
              style={{
                background: isRecording ? "#f0fdf4" : undefined,
                border: isRecording ? "1px solid #22c55e" : undefined,
              }}
            />

            <button
              className={isRecording ? "voice-recording-btn" : ""}
              onClick={toggleVoice}
              disabled={isLoading}
              style={{
                background: isRecording ? "#ef4444" : "#f3f4f6",
                color: isRecording ? "white" : "#4b5563",
                border: "none", borderRadius: "8px",
                width: 42, height: 42,
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: isLoading ? "not-allowed" : "pointer",
                opacity: isLoading ? 0.5 : 1,
                transition: "all 0.2s", position: "relative",
              }}
            >
              {isRecording && (
                <motion.div
                  animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  style={{ position: "absolute", inset: 0, borderRadius: "8px", background: "#ef4444", zIndex: 0 }}
                />
              )}
              <div style={{ position: "relative", zIndex: 1 }}>
                {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
              </div>
            </button>

            <button
              className="btn btn-green"
              onClick={() => sendMsg()}
              disabled={isLoading || !input.trim() || isRecording}
              style={{
                minWidth: 42, height: 42,
                display: "flex", alignItems: "center", justifyContent: "center",
                opacity: (isLoading || !input.trim() || isRecording) ? 0.5 : 1,
              }}
            >
              {isLoading ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
            </button>
          </div>

          <style>{`
            .animate-spin { animation: spin 1s linear infinite; }
            @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          `}</style>
        </div>

        {/* Right Sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Agent-Tagged Quick Questions */}
          <div className="card" style={{ height: "fit-content" }}>
            <div className="section-title" style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Sparkles size={14} color="#16a34a" />
              {t.quickQuestionsTitle || "Quick Questions"}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {t.quickQuestions?.map((q, i) => (
                <button
                  key={i}
                  onClick={() => sendMsg(q)}
                  style={{
                    padding: "8px 10px", textAlign: "left",
                    background: "#f0fdf4", border: "1px solid #bbf7d0",
                    borderRadius: 8, fontSize: 11.5, color: "#15803d",
                    cursor: "pointer", fontFamily: "inherit",
                    display: "flex", alignItems: "flex-start", gap: 6,
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#dcfce7"; (e.currentTarget as HTMLElement).style.transform = "translateX(2px)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#f0fdf4"; (e.currentTarget as HTMLElement).style.transform = "none"; }}
                >
                  <span style={{ fontSize: 14, lineHeight: 1 }}>{QUICK_QUESTION_META[i]?.icon || "🌱"}</span>
                  <div>
                    <div style={{ lineHeight: 1.3 }}>{q}</div>
                    <div style={{ fontSize: 9, color: "#86efac", marginTop: 2, fontWeight: 600 }}>→ {QUICK_QUESTION_META[i]?.agent || "Assistant"} Agent</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 25 Agent Showcase */}
          <div className="card" style={{ height: "fit-content" }}>
            <button
              onClick={() => setShowAgents(!showAgents)}
              style={{
                width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
                background: "none", border: "none", cursor: "pointer",
                padding: 0, fontFamily: "inherit",
              }}
            >
              <div className="section-title" style={{ margin: 0, display: "flex", alignItems: "center", gap: 6 }}>
                <Brain size={14} color="#16a34a" />
                25 AI Agents
              </div>
              {showAgents ? <ChevronUp size={14} color="#6b7280" /> : <ChevronDown size={14} color="#6b7280" />}
            </button>

            <AnimatePresence>
              {showAgents && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  style={{ overflow: "hidden", marginTop: 8 }}
                >
                  {/* Meta Agents */}
                  <div style={{ marginBottom: 8 }}>
                    <div style={{ fontSize: 9, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 4 }}>
                      Meta Intelligence
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                      {[
                        { icon: "📋", name: "Orchestrator" },
                        { icon: "🔗", name: "Reasoning" },
                        { icon: "📝", name: "Memory" },
                        { icon: "🔍", name: "Validator" },
                        { icon: "✨", name: "Optimizer" },
                      ].map((a, i) => (
                        <span key={i} style={{
                          display: "inline-flex", alignItems: "center", gap: 3,
                          padding: "2px 6px", borderRadius: 12,
                          background: "#fef3c7", border: "1px solid #fde68a",
                          fontSize: 9, color: "#92400e",
                        }}>
                          {a.icon} {a.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Domain Specialists */}
                  <div style={{ fontSize: 9, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 4 }}>
                    Domain Specialists
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                    {AGENT_LIST.map((a, i) => (
                      <span key={i} style={{
                        display: "inline-flex", alignItems: "center", gap: 3,
                        padding: "2px 6px", borderRadius: 12,
                        background: "#f0fdf4", border: "1px solid #bbf7d0",
                        fontSize: 9, color: "#15803d",
                      }}>
                        {a.icon} {a.name}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 50, x: "-50%" }}
            style={{
              position: "fixed", bottom: 24, left: "50%",
              background: "#1f2937", color: "white",
              padding: "10px 20px", borderRadius: "99px",
              fontSize: 14, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              zIndex: 50, display: "flex", alignItems: "center", gap: 8
            }}
          >
            <Bot size={16} color="#4ade80" />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function AssistantPage() {
  return (
    <ProLock featureName="Opus AI Assistant">
      <LocaleProvider>
        <AssistantPageInner />
      </LocaleProvider>
    </ProLock>
  );
}