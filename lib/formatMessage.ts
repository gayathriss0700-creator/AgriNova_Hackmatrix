/**
 * Lightweight markdown-to-HTML converter for AI chat messages.
 * Handles: bold, italic, inline code, numbered lists, bullet lists,
 * headings, and paragraph breaks — without pulling in a heavy library.
 */

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function inlineFormat(line: string): string {
  let s = escapeHtml(line);
  // Bold: **text** or __text__
  s = s.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  s = s.replace(/__(.+?)__/g, "<strong>$1</strong>");
  // Italic: *text* or _text_ (but not inside bold)
  s = s.replace(/(?<!\*)\*([^*]+?)\*(?!\*)/g, "<em>$1</em>");
  s = s.replace(/(?<!_)_([^_]+?)_(?!_)/g, "<em>$1</em>");
  // Inline code
  s = s.replace(/`([^`]+?)`/g, '<code style="background:#f1f5f9;padding:1px 5px;border-radius:3px;font-size:0.9em;">$1</code>');
  return s;
}

export function formatMessage(raw: string): string {
  if (!raw) return "";

  const lines = raw.split("\n");
  const parts: string[] = [];
  let inList: "ol" | "ul" | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Empty line — close any open list, add spacing
    if (!trimmed) {
      if (inList) {
        parts.push(inList === "ol" ? "</ol>" : "</ul>");
        inList = null;
      }
      continue;
    }

    // Heading: ### text
    const headingMatch = trimmed.match(/^(#{1,4})\s+(.+)$/);
    if (headingMatch) {
      if (inList) {
        parts.push(inList === "ol" ? "</ol>" : "</ul>");
        inList = null;
      }
      const level = headingMatch[1].length;
      const sizes: Record<number, string> = { 1: "1.1em", 2: "1.05em", 3: "1em", 4: "0.95em" };
      parts.push(
        `<div style="font-weight:700;font-size:${sizes[level] || "1em"};margin:8px 0 4px;">${inlineFormat(headingMatch[2])}</div>`
      );
      continue;
    }

    // Numbered list: 1. text, 2. text, etc.
    const olMatch = trimmed.match(/^(\d+)[.)]\s+(.+)$/);
    if (olMatch) {
      if (inList !== "ol") {
        if (inList) parts.push("</ul>");
        parts.push('<ol style="margin:4px 0;padding-left:20px;">');
        inList = "ol";
      }
      parts.push(`<li style="margin:2px 0;">${inlineFormat(olMatch[2])}</li>`);
      continue;
    }

    // Bullet list: - text, * text, • text
    const ulMatch = trimmed.match(/^[-*•]\s+(.+)$/);
    if (ulMatch) {
      if (inList !== "ul") {
        if (inList) parts.push("</ol>");
        parts.push('<ul style="margin:4px 0;padding-left:20px;">');
        inList = "ul";
      }
      parts.push(`<li style="margin:2px 0;">${inlineFormat(ulMatch[1])}</li>`);
      continue;
    }

    // Regular paragraph
    if (inList) {
      parts.push(inList === "ol" ? "</ol>" : "</ul>");
      inList = null;
    }
    parts.push(`<p style="margin:4px 0;">${inlineFormat(trimmed)}</p>`);
  }

  if (inList) {
    parts.push(inList === "ol" ? "</ol>" : "</ul>");
  }

  return parts.join("");
}
