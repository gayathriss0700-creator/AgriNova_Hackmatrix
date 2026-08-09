import { NextRequest, NextResponse } from "next/server";
import { googleTtsSynthesize } from "@/lib/google-tts";
import { synthesize, getEdgeTTSVoice } from "@/lib/edge-tts";

export async function POST(request: NextRequest) {
  try {
    const { text, language } = await request.json();

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    // Strip markdown for cleaner speech
    const cleanText = text
      .replace(/\*\*(.+?)\*\*/g, "$1")
      .replace(/#{1,4}\s+/g, "")
      .replace(/[*_`]/g, "")
      .replace(/\n{2,}/g, ". ")
      .trim();

    // ── Strategy 1: Edge TTS (higher quality neural voices) ────────────
    const voiceName = getEdgeTTSVoice(language);
    if (voiceName) {
      try {
        const audioData = await synthesize(cleanText, voiceName);
        if (audioData && audioData.byteLength > 0) {
          return new Response(audioData, {
            headers: { "Content-Type": "audio/mpeg" },
          });
        }
      } catch (edgeErr) {
        console.warn("Edge TTS failed, trying Google TTS:", (edgeErr as Error)?.message);
      }
    }

    // ── Strategy 2: Google Translate TTS (free, all Indian languages) ──
    try {
      const audioBuffer = await googleTtsSynthesize(cleanText, language);
      if (audioBuffer && audioBuffer.byteLength > 0) {
        return new Response(new Uint8Array(audioBuffer), {
          headers: { "Content-Type": "audio/mpeg" },
        });
      }
    } catch (googleErr) {
      console.warn("Google TTS also failed:", (googleErr as Error)?.message);
    }

    // ── Both failed — let the client fall back to browser speechSynthesis ──
    return NextResponse.json(
      { error: "All TTS services unavailable", unsupported: true },
      { status: 501 }
    );
  } catch (error) {
    console.error("TTS error:", error);
    return NextResponse.json({ error: "TTS failed" }, { status: 500 });
  }
}
