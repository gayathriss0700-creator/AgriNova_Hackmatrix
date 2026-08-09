import { NextRequest, NextResponse } from "next/server";
import { runAgentPipeline, TOTAL_AGENTS } from "@/lib/agentSystem";

// ─────────────────────────────────────────────────────────────────────────────
// AgriNova 25-Agent Multi-Agent Chat API
// Routes queries through Orchestrator → Reasoning → Specialists → Validator
// ─────────────────────────────────────────────────────────────────────────────

// ── LLM Provider Calls ───────────────────────────────────────────────────────

interface CallResult {
  message?: string;
  error?: string;
  status?: number;
}

async function callAnthropic(
  apiKey: string,
  messages: { role: string; content: string }[],
  model: string
): Promise<CallResult> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30_000);

  try {
    const systemMsg = messages.find(m => m.role === "system");
    const userMessages = messages.filter(m => m.role !== "system");

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model,
        max_tokens: 3000,
        system: systemMsg?.content,
        messages: userMessages,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const status = response.status;
      const errorType = errorData?.error?.type || "";

      if (status === 401 || errorType === "authentication_error") {
        return { error: "invalid_key", status: 401 };
      }
      if (status === 429 || errorType === "rate_limit_error") {
        return { error: "quota", status: 429 };
      }
      console.error("Anthropic API error:", errorData);
      return { error: `api_error_${status}`, status };
    }

    const data = await response.json();
    const content = data.content?.[0]?.text;
    if (!content) {
      return { error: "empty_response", status: 200 };
    }
    return { message: content };
  } catch (err: unknown) {
    clearTimeout(timeout);
    if (err instanceof Error && err.name === "AbortError") {
      return { error: "timeout", status: 504 };
    }
    return { error: "network", status: 503 };
  }
}

async function callOpenAICompatible(
  baseUrl: string,
  apiKey: string,
  model: string,
  messages: { role: string; content: string }[],
  providerName: string
): Promise<CallResult> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30_000);

  let response: Response;
  try {
    response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        max_tokens: 3000,
        temperature: 0.7,
      }),
      signal: controller.signal,
    });
  } catch (err: unknown) {
    clearTimeout(timeout);
    if (err instanceof Error && err.name === "AbortError") {
      return { error: "timeout", status: 504 };
    }
    return { error: "network", status: 503 };
  }

  clearTimeout(timeout);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const status = response.status;
    const code = errorData.error?.code ?? "";
    const msg: string = errorData.error?.message ?? "";

    if (status === 401 || code === "invalid_api_key") {
      return { error: "invalid_key", status: 401 };
    }
    if (status === 429) {
      const isQuota = msg.includes("quota") || code === "insufficient_quota" || msg.includes("rate_limit_exceeded");
      return { error: isQuota ? "quota" : "rate_limit", status: 429 };
    }
    if (status >= 500) {
      console.error(`${providerName} server error (${status}):`, errorData);
      return { error: "server_error", status: 503 };
    }
    console.error(`${providerName} API error (${status}):`, errorData);
    return { error: `api_error_${status}`, status };
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    return { error: "empty_response", status: 200 };
  }
  return { message: content };
}

// ── Unified LLM Call (Anthropic → Groq → OpenAI fallback chain) ─────────────

async function callLLM(
  systemPrompt: string,
  messages: { role: string; content: string }[]
): Promise<string | null> {
  const conversationHistory = [
    { role: "system", content: systemPrompt },
    ...messages,
  ];

  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  const groqKey = process.env.GROQ_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  let lastError = null;

  // 1. Try Anthropic Claude
  if (anthropicKey && anthropicKey.length > 20) {
    const result = await callAnthropic(anthropicKey, conversationHistory, "claude-sonnet-4-20250514");
    if (result.message) return result.message;
    lastError = `Anthropic: ${result.error}`;
    if (result.error !== "invalid_key" && result.error !== "quota") {
      console.warn("Anthropic failed:", result.error, "— trying Groq");
    }
  }

  // 2. Try Groq (free, fast)
  if (groqKey && groqKey.length > 20) {
    const result = await callOpenAICompatible(
      "https://api.groq.com/openai/v1", groqKey,
      "llama-3.3-70b-versatile", conversationHistory, "Groq"
    );
    if (result.message) return result.message;
    lastError = `Groq: ${result.error}`;
    
    // If Groq fails with rate limit or server error, maybe try a smaller model as fallback
    if (result.error === "rate_limit" || result.error === "server_error" || result.error === "timeout") {
       console.warn("Groq large model failed, trying smaller model fallback...");
       const fallbackResult = await callOpenAICompatible(
         "https://api.groq.com/openai/v1", groqKey,
         "llama-3.1-8b-instant", conversationHistory, "Groq-Fallback"
       );
       if (fallbackResult.message) return fallbackResult.message;
       lastError = `Groq Fallback: ${fallbackResult.error}`;
    }

    if (result.error !== "invalid_key" && result.error !== "quota") {
      console.warn("Groq failed:", result.error, "— trying OpenAI");
    }
  }

  // 3. Try OpenAI
  if (openaiKey && openaiKey.length > 50) {
    const result = await callOpenAICompatible(
      "https://api.openai.com/v1", openaiKey,
      "gpt-4o-mini", conversationHistory, "OpenAI"
    );
    if (result.message) return result.message;
    lastError = `OpenAI: ${result.error}`;
  }

  // If we reach here, all configured providers failed
  if (lastError?.includes("invalid_key")) {
    return "API Error: Your configured API key is invalid. Please check your .env file.";
  }
  if (lastError?.includes("quota") || lastError?.includes("rate_limit")) {
    return "API Error: You have exceeded your rate limit or quota on Groq. Please try again later or add an OpenAI key as a fallback.";
  }

  return `API Error: Providers failed to respond (${lastError || "unknown"}).`;
}

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/chat — Multi-Agent Pipeline
// ─────────────────────────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, language, voiceMode } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Invalid request: 'messages' must be a non-empty array." },
        { status: 400 }
      );
    }

    // Check if any API key is configured
    const groqKey = process.env.GROQ_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;
    const anthropicKey = process.env.ANTHROPIC_API_KEY;

    if (
      (!groqKey || groqKey.length <= 20) &&
      (!openaiKey || openaiKey.length <= 50) &&
      (!anthropicKey || anthropicKey.length <= 20)
    ) {
      return NextResponse.json({
        message:
          "🔑 No AI API key configured.\n\n" +
          "**Recommended (Free):** Get a Groq key at https://console.groq.com/ and add to .env:\n" +
          "GROQ_API_KEY=gsk_your-key-here\n\n" +
          "**Alternative:** Get an OpenAI key at https://platform.openai.com/api-keys and add:\n" +
          "OPENAI_API_KEY=sk-your-key-here",
      });
    }

    // Voice mode adjustments
    const voiceInstruction = voiceMode
      ? `\n\nVOICE MODE: Keep answers VERY SHORT (1-3 sentences max), conversational, natural. NO markdown formatting.`
      : "";

    // ── Run the 25-Agent Pipeline ────────────────────────────────────────────
    const conversationHistory = messages.map((m: { role: string; content: string }) => ({
      role: m.role,
      content: m.content,
    }));

    const userMessage = conversationHistory[conversationHistory.length - 1]?.content || "";

    const agentResponse = await runAgentPipeline(
      userMessage,
      conversationHistory.slice(0, -1), // History without current message
      language || "en",
      async (systemPrompt: string, msgs: Array<{ role: string; content: string }>) => {
        return callLLM(systemPrompt + voiceInstruction, msgs);
      }
    );

    // Return enhanced response with agent metadata
    return NextResponse.json({
      message: agentResponse.content,
      provider: "multi-agent",
      agentName: agentResponse.agentName,
      agentIcon: agentResponse.agentIcon,
      agentsUsed: agentResponse.agentsUsed,
      confidence: agentResponse.confidence,
      toolsUsed: agentResponse.toolsUsed,
      reasoningSteps: agentResponse.reasoningSteps,
      dataCards: agentResponse.dataCards,
      totalAgents: TOTAL_AGENTS,
    });

  } catch (error) {
    console.error("Chat API unexpected error:", error);
    return NextResponse.json(
      {
        message:
          "⚠️ Something went wrong on our end. Please refresh and try again.",
      },
      { status: 500 }
    );
  }
}
