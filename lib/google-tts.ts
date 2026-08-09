/**
 * Multi-language Text-to-Speech using Google Translate's TTS endpoint.
 * Supports all 22 Indian languages. Free, no API key needed.
 * 
 * Falls back gracefully — splits long text into chunks (Google TTS has a ~200 char limit).
 */

// Google Translate TTS has a character limit per request (~200 chars).
// We split text into sentence-level chunks and concatenate the audio.
const MAX_CHUNK_LENGTH = 180;

/** Supported language codes for Google TTS */
const SUPPORTED_LANGS = new Set([
  "en", "hi", "ta", "te", "kn", "ml", "bn", "gu", "mr", "pa",
  "as", "or", "ur", "ne", "sa", "ks", "sd", "mai", "mni", "kok",
  // Fallback languages for those without native Google TTS support
]);

/** Map unsupported language codes to closest supported one */
const LANG_FALLBACK: Record<string, string> = {
  bo: "hi",     // Bodo → Hindi
  doi: "hi",    // Dogri → Hindi
  sat: "hi",    // Santali → Hindi
  mai: "hi",    // Maithili → Hindi
  kok: "mr",    // Konkani → Marathi
  mni: "bn",    // Manipuri → Bengali
  sa: "hi",     // Sanskrit → Hindi
  ks: "ur",     // Kashmiri → Urdu
  sd: "hi",     // Sindhi → Hindi
};

function getGoogleLang(lang: string): string {
  if (SUPPORTED_LANGS.has(lang)) return lang;
  return LANG_FALLBACK[lang] || "hi";
}

/** Split text into speakable chunks at sentence/phrase boundaries */
function splitIntoChunks(text: string): string[] {
  // Remove markdown formatting
  const clean = text
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/#{1,4}\s+/g, "")
    .replace(/[*_`]/g, "")
    .trim();

  if (clean.length <= MAX_CHUNK_LENGTH) return [clean];

  const chunks: string[] = [];
  // Split by sentence boundaries (. ! ? newline)
  const sentences = clean.split(/(?<=[.!?\n])\s+/);
  let current = "";

  for (const sentence of sentences) {
    if (!sentence.trim()) continue;
    
    if (current.length + sentence.length + 1 <= MAX_CHUNK_LENGTH) {
      current += (current ? " " : "") + sentence;
    } else {
      if (current) chunks.push(current);
      
      // If single sentence is too long, split by comma/semicolon
      if (sentence.length > MAX_CHUNK_LENGTH) {
        const parts = sentence.split(/(?<=[,;:])\s+/);
        let sub = "";
        for (const part of parts) {
          if (sub.length + part.length + 1 <= MAX_CHUNK_LENGTH) {
            sub += (sub ? " " : "") + part;
          } else {
            if (sub) chunks.push(sub);
            // If still too long, hard-split by words
            if (part.length > MAX_CHUNK_LENGTH) {
              const words = part.split(/\s+/);
              let w = "";
              for (const word of words) {
                if (w.length + word.length + 1 <= MAX_CHUNK_LENGTH) {
                  w += (w ? " " : "") + word;
                } else {
                  if (w) chunks.push(w);
                  w = word;
                }
              }
              sub = w;
            } else {
              sub = part;
            }
          }
        }
        current = sub;
      } else {
        current = sentence;
      }
    }
  }
  if (current) chunks.push(current);
  
  return chunks.filter(c => c.trim().length > 0);
}

/** Fetch audio for a single chunk from Google Translate TTS */
async function fetchChunkAudio(text: string, lang: string): Promise<ArrayBuffer> {
  const googleLang = getGoogleLang(lang);
  const encoded = encodeURIComponent(text);
  const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${googleLang}&client=tw-ob&q=${encoded}`;

  const response = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      "Referer": "https://translate.google.com/",
    },
  });

  if (!response.ok) {
    throw new Error(`Google TTS returned ${response.status}`);
  }

  return response.arrayBuffer();
}

/** 
 * Synthesize full text to speech, returning concatenated MP3 audio.
 * Handles long text by splitting into chunks.
 */
export async function googleTtsSynthesize(text: string, lang: string): Promise<Buffer> {
  const chunks = splitIntoChunks(text);
  
  if (chunks.length === 0) {
    throw new Error("No text to synthesize");
  }

  const audioBuffers: Buffer[] = [];
  
  for (const chunk of chunks) {
    try {
      const audio = await fetchChunkAudio(chunk, lang);
      audioBuffers.push(Buffer.from(audio));
    } catch (error) {
      console.warn(`Google TTS chunk failed for "${chunk.substring(0, 30)}...":`, error);
      // Continue with remaining chunks even if one fails
    }
  }

  if (audioBuffers.length === 0) {
    throw new Error("All Google TTS chunks failed");
  }

  return Buffer.concat(audioBuffers);
}

/** Get the effective Google TTS language code */
export function getGoogleTTSLang(lang: string): string {
  return getGoogleLang(lang);
}
