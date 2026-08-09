import WebSocket from "ws";

const EDGE_WSS = "wss://speech.platform.bing.com/consumer/speech/synthesize/readaloud/edge/v1";

// A static token that Edge TTS uses — this is a well-known public token
// extracted from the Edge browser's built-in read-aloud feature.
const EDGE_TOKEN = "6A5AA1D4EAFF4E9FB37E23D68491D6F4";

export const EDGE_TTS_VOICES: Record<string, string> = {
  // ── Languages with native Edge TTS neural voices ───────────────
  en: "en-IN-NeerjaNeural",
  hi: "hi-IN-SwaraNeural",
  ta: "ta-IN-PallaviNeural",
  te: "te-IN-ShrutiNeural",
  kn: "kn-IN-SapnaNeural",
  ml: "ml-IN-MidhunNeural",
  bn: "bn-IN-TanishaaNeural",
  gu: "gu-IN-DhwaniNeural",
  mr: "mr-IN-AarohiNeural",
  pa: "pa-IN-OjasNeural",
  as: "as-IN-YashicaNeural",
  or: "or-IN-SubhashiniNeural",
  ur: "ur-IN-SalmanNeural",
  ne: "ne-NP-HemkalaNeural",

  // ── Fallback voices for languages without native Edge TTS support ──
  // These use the closest widely-understood voice so TTS doesn't fail silently.
  sa:  "hi-IN-SwaraNeural",    // Sanskrit → Hindi (closest Devanagari)
  ks:  "ur-IN-SalmanNeural",   // Kashmiri → Urdu (similar script/phonetics)
  sd:  "ur-IN-SalmanNeural",   // Sindhi → Urdu (similar script/phonetics)
  mai: "hi-IN-SwaraNeural",    // Maithili → Hindi (closely related)
  bo:  "as-IN-YashicaNeural",  // Bodo → Assamese (same region - NE India)
  doi: "hi-IN-SwaraNeural",    // Dogri → Hindi (closely related)
  mni: "bn-IN-TanishaaNeural", // Manipuri → Bengali (similar script)
  kok: "mr-IN-AarohiNeural",   // Konkani → Marathi (closely related)
  sat: "hi-IN-SwaraNeural",    // Santali → Hindi (widely understood fallback)
};

function uuidv4(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

function buildSsml(text: string, voiceName: string): string {
  const escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
  const lang = voiceName.split("-").slice(0, 2).join("-");
  return (
    `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="https://www.w3.org/2001/mstts" xml:lang="${lang}">` +
    `<voice name="${voiceName}">` +
    `<prosody rate="0%" pitch="0%">${escaped}</prosody>` +
    `</voice>` +
    `</speak>`
  );
}

export async function synthesize(text: string, voiceName: string): Promise<ArrayBuffer> {
  const connectionId = uuidv4();
  const requestId = uuidv4();

  const wsUrl = `${EDGE_WSS}?TrustedClientToken=${EDGE_TOKEN}&ConnectionId=${connectionId}`;

  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    let timeout: NodeJS.Timeout;

    const ws = new WebSocket(wsUrl, undefined, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36 Edg/130.0.0.0",
      },
    });

    const cleanup = () => {
      clearTimeout(timeout);
      ws.close();
    };

    const fail = (err: Error) => {
      cleanup();
      reject(err);
    };

    timeout = setTimeout(() => fail(new Error("TTS synthesis timed out")), 30000);

    ws.on("open", () => {
      const now = new Date().toISOString().replace(/\.\d{3}Z$/, ".000Z");

      ws.send(`X-Timestamp:${now}\r\nContent-Type:application/json; charset=utf-8\r\nPath:speech.config\r\n\r\n` +
        JSON.stringify({
          context: {
            synthesis: {
              audio: {
                metadataoptions: {},
                outputformat: "audio-24khz-48kbitrate-mono-mp3",
              },
            },
          },
        })
      );

      const ssml = buildSsml(text, voiceName);
      ws.send(
        `X-RequestId:${requestId}\r\nContent-Type:application/ssml+xml\r\nPath:ssml\r\n\r\n${ssml}`
      );
    });

    ws.on("message", (data: Buffer) => {
      if (Buffer.isBuffer(data)) {
        const headerEnd = data.indexOf("\r\n\r\n");
        if (headerEnd === -1) {
          chunks.push(data);
          return;
        }

        const header = data.subarray(0, headerEnd).toString("utf-8");
        const body = data.subarray(headerEnd + 4);

        if (header.includes("Path:audio")) {
          chunks.push(body);
        } else if (header.includes("Path:done") || header.includes("Path:turn.end")) {
          cleanup();
          const result = Buffer.concat(chunks);
          resolve(result.buffer.slice(result.byteOffset, result.byteOffset + result.byteLength));
        }
      }
    });

    ws.on("error", (err) => fail(err));
    ws.on("close", () => {
      if (chunks.length > 0) {
        cleanup();
        const result = Buffer.concat(chunks);
        resolve(result.buffer.slice(result.byteOffset, result.byteOffset + result.byteLength));
      }
    });
  });
}

export async function synthesizeStreaming(
  text: string,
  voiceName: string,
  callbacks: {
    onAudio: (chunk: Buffer) => void;
    onEnd: () => void;
    onError: (err: Error) => void;
  }
): Promise<void> {
  const connectionId = uuidv4();
  const requestId = uuidv4();

  const wsUrl = `${EDGE_WSS}?TrustedClientToken=${EDGE_TOKEN}&ConnectionId=${connectionId}`;

  return new Promise((resolve, reject) => {
    let timeout: NodeJS.Timeout;

    const ws = new WebSocket(wsUrl, undefined, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36 Edg/130.0.0.0",
      },
    });

    const cleanup = () => {
      clearTimeout(timeout);
      ws.close();
    };

    const fail = (err: Error) => {
      cleanup();
      reject(err);
      callbacks.onError(err);
    };

    timeout = setTimeout(() => fail(new Error("TTS synthesis timed out")), 30000);

    ws.on("open", () => {
      const now = new Date().toISOString().replace(/\.\d{3}Z$/, ".000Z");

      ws.send(`X-Timestamp:${now}\r\nContent-Type:application/json; charset=utf-8\r\nPath:speech.config\r\n\r\n` +
        JSON.stringify({
          context: {
            synthesis: {
              audio: {
                metadataoptions: {},
                outputformat: "audio-24khz-48kbitrate-mono-mp3",
              },
            },
          },
        })
      );

      const ssml = buildSsml(text, voiceName);
      ws.send(
        `X-RequestId:${requestId}\r\nContent-Type:application/ssml+xml\r\nPath:ssml\r\n\r\n${ssml}`
      );
    });

    ws.on("message", (data: Buffer) => {
      if (Buffer.isBuffer(data)) {
        const headerEnd = data.indexOf("\r\n\r\n");
        if (headerEnd === -1) return;

        const header = data.subarray(0, headerEnd).toString("utf-8");
        const body = data.subarray(headerEnd + 4);

        if (header.includes("Path:audio")) {
          callbacks.onAudio(body);
        } else if (header.includes("Path:done") || header.includes("Path:turn.end")) {
          cleanup();
          callbacks.onEnd();
          resolve();
        }
      }
    });

    ws.on("error", (err) => fail(err));
    ws.on("close", () => {
      cleanup();
      callbacks.onEnd();
      resolve();
    });
  });
}

export function getEdgeTTSVoice(language: string): string | null {
  return EDGE_TTS_VOICES[language] || null;
}
