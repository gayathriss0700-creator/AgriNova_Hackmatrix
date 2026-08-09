"use client";
import { useState } from "react";
import { ExternalLink, Clock } from "lucide-react";
import NewsDetailModal from "./NewsDetailModal";

interface News {
  id: string;
  title: string;
  summary: string;
  source: string;
  category: string;
  publishedAt: string;
  imageUrl: string | null;
  url: string;
  aiSentiment?: "Bullish" | "Bearish" | "Neutral";
}

interface NewsSectionProps {
  news: News[];
}

export default function NewsSection({ news }: NewsSectionProps) {
  const [selectedNews, setSelectedNews] = useState<News | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHrs / 24);

    if (diffHrs < 1) return "Just now";
    if (diffHrs < 24) return `${diffHrs}h ago`;
    if (diffDays === 1) return "Yesterday";
    return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  };

  const handleNewsClick = (item: News) => {
    setSelectedNews(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedNews(null);
  };

  const categoryColors: Record<string, string> = {
    Schemes: "linear-gradient(135deg, #16a34a, #15803d)",
    Weather: "linear-gradient(135deg, #0ea5e9, #0284c7)",
    Market: "linear-gradient(135deg, #f59e0b, #d97706)",
    "Crop Health": "linear-gradient(135deg, #ef4444, #dc2626)",
    Logistics: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
    Production: "linear-gradient(135deg, #6366f1, #4f46e5)",
  };

  return (
    <>
      <div className="news-grid">
        {news.map((item) => (
          <div
            key={item.id}
            className="news-card"
            onClick={() => handleNewsClick(item)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && handleNewsClick(item)}
          >
            <div className="news-card-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span className="news-category" style={{ background: categoryColors[item.category] || "#6b7280", padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 700, color: "#fff", textTransform: "uppercase" }}>
                  {item.category}
                </span>
                {item.aiSentiment && (
                  <span style={{ 
                    fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 4, 
                    background: item.aiSentiment === "Bullish" ? "rgba(16, 185, 129, 0.15)" : item.aiSentiment === "Bearish" ? "rgba(239, 68, 68, 0.15)" : "rgba(100, 116, 139, 0.15)",
                    color: item.aiSentiment === "Bullish" ? "#059669" : item.aiSentiment === "Bearish" ? "#dc2626" : "#475569" 
                  }}>
                    {item.aiSentiment === "Bullish" ? "📈 Bullish" : item.aiSentiment === "Bearish" ? "📉 Bearish" : "➖ Neutral"}
                  </span>
                )}
              </div>
              <span className="news-source" style={{ fontSize: 11, color: "var(--text-secondary, #64748b)", fontWeight: 500 }}>{item.source}</span>
            </div>

            <div className="news-title">{item.title}</div>
            <div className="news-summary">{item.summary}</div>

            <div className="news-footer">
              <div className="news-time">
                <Clock size={10} style={{ display: "inline", marginRight: 4 }} />
                {formatTime(item.publishedAt)}
              </div>
              <span className="news-read-more">
                Read more <ExternalLink size={10} style={{ display: "inline", marginLeft: 2 }} />
              </span>
            </div>
          </div>
        ))}
      </div>

      <NewsDetailModal
        news={selectedNews}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
}
