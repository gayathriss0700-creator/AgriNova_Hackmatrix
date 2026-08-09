import { NextRequest, NextResponse } from "next/server";

// ─────────────────────────────────────────────────────────────────────────────
// AgriNova Module AI Advisor — Context-Aware Intelligence for Every Module
// ─────────────────────────────────────────────────────────────────────────────

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
        max_tokens: 1500,
        system: systemMsg?.content,
        messages: userMessages,
      }),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const status = response.status;
      if (status === 401) return { error: "invalid_key", status: 401 };
      if (status === 429) return { error: "quota", status: 429 };
      return { error: `api_error_${status}`, status };
    }

    const data = await response.json();
    return { message: data.content?.[0]?.text || "" };
  } catch (err: unknown) {
    clearTimeout(timeout);
    if (err instanceof Error && err.name === "AbortError") return { error: "timeout", status: 504 };
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

  try {
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ model, messages, max_tokens: 1500, temperature: 0.7 }),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const status = response.status;
      if (status === 401) return { error: "invalid_key", status: 401 };
      if (status === 429) return { error: "quota", status: 429 };
      return { error: `api_error_${status}`, status };
    }

    const data = await response.json();
    return { message: data.choices?.[0]?.message?.content || "" };
  } catch (err: unknown) {
    clearTimeout(timeout);
    if (err instanceof Error && err.name === "AbortError") return { error: "timeout", status: 504 };
    return { error: "network", status: 503 };
  }
}

// ── Unified LLM Call (same fallback chain as main chat) ──────────────────────

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

  // 1. Anthropic
  if (anthropicKey && anthropicKey.length > 20) {
    const result = await callAnthropic(anthropicKey, conversationHistory, "claude-sonnet-4-20250514");
    if (result.message) return result.message;
    lastError = `Anthropic: ${result.error}`;
  }

  // 2. Groq (free, fast)
  if (groqKey && groqKey.length > 20) {
    const result = await callOpenAICompatible(
      "https://api.groq.com/openai/v1", groqKey,
      "llama-3.3-70b-versatile", conversationHistory, "Groq"
    );
    if (result.message) return result.message;
    lastError = `Groq: ${result.error}`;

    // Fallback to smaller model
    if (result.error === "rate_limit" || result.error === "server_error") {
      const fallback = await callOpenAICompatible(
        "https://api.groq.com/openai/v1", groqKey,
        "llama-3.1-8b-instant", conversationHistory, "Groq-Fallback"
      );
      if (fallback.message) return fallback.message;
    }
  }

  // 3. OpenAI
  if (openaiKey && openaiKey.length > 50) {
    const result = await callOpenAICompatible(
      "https://api.openai.com/v1", openaiKey,
      "gpt-4o-mini", conversationHistory, "OpenAI"
    );
    if (result.message) return result.message;
    lastError = `OpenAI: ${result.error}`;
  }

  return `Unable to generate insight. ${lastError || "No API key configured."}`;
}

// ── Module-specific system prompts ───────────────────────────────────────────

const MODULE_PROMPTS: Record<string, string> = {
  "yield-forecast": `You are an expert crop yield analyst for Indian agriculture. The user is viewing their Yield Forecast dashboard. Analyze the provided farm data (crop type, area, NDVI, soil health, historical yields) and provide:
1. A personalized yield prediction assessment
2. Key factors influencing the yield (positive and negative)
3. 2-3 specific, actionable recommendations to improve yield
4. Comparison with regional benchmarks
Keep your response concise (150-200 words), practical, and farmer-friendly. Use bullet points. Include specific numbers.`,

  "climate-risk": `You are a climate risk analyst for agriculture. The user is viewing their Climate Risk dashboard. Analyze the risk values provided (flood, heatwave, cyclone, drought, rainfall, cold wave, lightning, wind) and provide:
1. Priority assessment — which risks need immediate attention
2. Crop-specific impact for each high risk
3. 2-3 actionable mitigation steps ranked by urgency
4. Insurance and contingency recommendations
Keep your response concise (150-200 words), practical. Use bullet points.`,

  "digital-twin": `You are a precision agriculture expert analyzing a Digital Farm Twin. Review all sensor data (crop health, weather, soil, water, NDVI, yield prediction, disease risk, pest status, carbon/ESG, overall risk) and provide:
1. Overall farm health assessment (1 sentence)
2. Top 3 critical actions needed RIGHT NOW
3. Which systems are performing well vs need attention
4. 24-hour action plan
Keep your response concise (150-200 words). Prioritize critical items first.`,

  "finance": `You are the Farm CFO & CTO (Chief Financial & Technology Officer). Analyze the farm's financial data (income, expenses, net profit, transactions) and provide:
1. A brief overview of the farm's financial health.
2. Specific insights on expenses and where to cut costs or invest in ag-tech (CTO aspect).
3. Profit margin analysis and actionable recommendations to increase revenue.
Keep your response concise (150-200 words). ALWAYS use Indian Rupees (₹) for all monetary values. Speak directly to the farmer.`,

  "water-intelligence": `You are an irrigation scientist and water management expert. Analyze the water data (daily requirement, weekly schedule, rainfall, irrigation method, efficiency) and provide:
1. Water efficiency assessment
2. Optimal irrigation schedule for this week
3. Water-saving opportunities (specific quantities)
4. Best irrigation method recommendation with reasoning
Keep your response concise (150-200 words). Include specific water savings in liters.`,

  "fertilizer-engine": `You are a soil scientist and nutrient management expert. Analyze the NPK data, soil conditions, and crop requirements and provide:
1. Current nutrient status assessment
2. Precise fertilizer dosage recommendation (specific products and quantities per hectare)
3. Application timing and method
4. Cost-effective alternatives (organic options)
Keep your response concise (150-200 words). Include exact dosages.`,

  "xai-engine": `You are an AI transparency expert explaining agricultural predictions. Analyze the AI predictions (disease, pest, yield, etc.) with their confidence scores and evidence and provide:
1. Plain-language explanation of WHY the AI made each prediction
2. Which evidence factors are most important
3. How confident you are in each prediction and why
4. What the farmer should do based on these predictions
Keep your response concise (150-200 words). Make complex AI decisions understandable.`,

  "home": `You are the AgriNova Platform Guide. The user is on the main landing page of the AgriNova Operating System. Provide:
1. A warm welcome and a brief explanation of how AgriNova's 25 AI agents and satellite data can transform their farm.
2. A suggestion on where they should start (e.g., Farm Setup or Overview dashboard).
3. A brief highlight of the "Master Pro Plan" features.
Keep your response concise (150-200 words). Be encouraging and professional.`,

  "setup": `You are the Farm Configuration Expert. The user is in the Farm Setup Wizard. Provide:
1. Reassurance that setting up their farm profile (crop type, area, location) is crucial for accurate AI predictions.
2. Tips on how to best answer the setup questions (e.g., providing accurate coordinates for satellite data).
3. Next steps after they complete the setup.
Keep your response concise (150-200 words). Use bullet points and be helpful.`,

  "crop-price": `You are the Lead Market Analyst for agricultural commodities. Analyze the live crop prices, best markets, and trends, and provide:
1. An overall market sentiment for the selected crop.
2. The most profitable market currently available to sell to.
3. An assessment of price volatility and whether to hold or sell now.
Keep your response concise (150-200 words). Use bullet points and exact price figures in ₹.`,

  "farmers-hub": `You are a Government Extension Worker and Agriculture News Analyst. Analyze the latest government schemes, news trends, and subsidies, and provide:
1. A summary of the most relevant scheme the farmer should apply for today based on the categories.
2. A key highlight from today's agriculture news.
3. Actionable steps on how to leverage these schemes or adapt to the news.
Keep your response concise (150-200 words). Use bullet points.`,

  "drought-monitor": `You are a drought management specialist. Analyze the drought severity data (D0-D4 scale, NDVI trends, soil moisture, recovery projections) and provide:
1. Current drought severity assessment
2. Crop-specific impact analysis
3. Immediate water conservation measures (3 specific actions)
4. Recovery timeline and contingency crop plan
Keep your response concise (150-200 words). Prioritize immediate survival actions.`,

  "flood-prediction": `You are a flood risk analyst and disaster preparedness expert. Analyze the flood probability data (zone risks, rainfall projections, terrain analysis) and provide:
1. Risk assessment — when and where flooding is most likely
2. Pre-flood preparation checklist (3 items)
3. Crop protection strategies
4. Insurance and claim procedures (PMFBY timeline)
Keep your response concise (150-200 words). Focus on actionable preparedness.`,

  "crop-timeline": `You are a crop phenology and agronomy expert. Analyze the current growth stage data and provide:
1. What stage the crop is in and what's happening biologically
2. Critical tasks for THIS stage (top 3)
3. What to watch for in the NEXT stage
4. Common mistakes farmers make at this stage
Keep your response concise (150-200 words). Be very specific about timing.`,

  "resource-optimization": `You are a farm efficiency and resource management expert. Analyze the resource metrics (water, fertilizer, pesticide savings, carbon reduction, yield improvement, cost savings) and provide:
1. Overall efficiency score assessment
2. Top 3 optimization actions ranked by ROI
3. Estimated payback period for each recommendation
4. Quick wins vs long-term investments
Keep your response concise (150-200 words). Include specific cost/savings numbers.`,

  "historical-analytics": `You are an agricultural data analyst. Analyze the historical data (multi-year yields, NDVI trends, season comparisons, weather patterns) and provide:
1. Key patterns and trends over the years
2. What went well vs what went wrong in each season
3. Data-driven prediction for next season
4. Lessons learned and strategic recommendations
Keep your response concise (150-200 words). Reference specific years and numbers.`,

  "price-forecast": `You are a commodity market analyst for agricultural products. Analyze the price data (current prices, 7/30-day forecasts, selling recommendations) and provide:
1. Market timing advice — sell now or hold?
2. Price trend analysis for each crop
3. Storage cost vs price appreciation calculation
4. Best selling strategy (when, where, how much)
Keep your response concise (150-200 words). Include specific price targets.`,

  "gis-dashboard": `You are a GIS and spatial analysis expert for precision agriculture. Analyze the map data (active layers, zone information, farm boundaries, soil types, vegetation indices) and provide:
1. Spatial analysis summary — what the map data reveals
2. Zone-specific recommendations (which zones need attention)
3. Optimal resource allocation across zones
4. Satellite imagery insights
Keep your response concise (150-200 words). Reference specific zones.`,

  "production-readiness": `You are a DevOps and ML deployment expert for agricultural AI systems. Analyze the production readiness data (architecture, ML models, API endpoints, performance metrics) and provide:
1. Overall production readiness assessment
2. Critical gaps that need addressing before deployment
3. Performance optimization recommendations
4. Monitoring and alerting suggestions
Keep your response concise (150-200 words). Focus on reliability.`,

  "offline-mode": `You are a mobile and offline-first application expert. Analyze the offline mode data (sync status, cached modules, network state, storage usage) and provide:
1. Current offline readiness assessment
2. Which modules are most critical to cache
3. Data freshness recommendations
4. Low-bandwidth optimization tips
Keep your response concise (150-200 words). Focus on field conditions.`,

  "overview": `You are the Farm Operations Director. Analyze the high-level dashboard metrics (alerts, recent activities, yields, weather) and provide:
1. A quick summary of current farm status.
2. The most critical alerts needing immediate attention.
3. 24-hour action items for the farm owner.
Keep your response concise (150-200 words). Speak authoritatively but supportively.`,

  "analytics": `You are the Lead Data Scientist. Analyze the analytical metrics (chart data, engagement, comparative trends) and provide:
1. Key takeaways from the data trends.
2. Areas of inefficiency or unexpected dips.
3. Data-driven strategic recommendations for the next week.
Keep your response concise (150-200 words). Use specific percentages and numbers.`,

  "weather": `You are a Senior Agricultural Meteorologist. Analyze the current weather and 7-day forecast data and provide:
1. Summary of upcoming significant weather events (rain, heatwaves, frost).
2. Immediate operational advice (e.g., delay spraying, increase irrigation).
3. Long-term climate considerations for the current crop.
Keep your response concise (150-200 words). Focus on the intersection of weather and farming.`,

  "soil": `You are a Certified Agronomist. Analyze the soil health data (pH, moisture, NPK, organic matter) and provide:
1. Overall soil health score assessment.
2. Identification of any critical deficiencies or toxicities.
3. Specific amendment and remediation recommendations.
Keep your response concise (150-200 words). Give exact actionable steps.`,

  "farm-map": `You are a Geospatial Surveyor AI. Analyze the farm map and field boundary data and provide:
1. Insights on field utilization and zone mapping.
2. Potential areas for expansion or boundary correction.
3. Tips for optimizing the spatial layout of the farm.
Keep your response concise (150-200 words). Think spatially.`,

  "precision": `You are a Precision Ag Specialist. Analyze the VRT (Variable Rate Technology) and precision data and provide:
1. Assessment of current precision application efficiency.
2. Areas where inputs (seed/fertilizer) are being over or under applied.
3. Equipment calibration or mapping recommendations.
Keep your response concise (150-200 words). Focus on high-tech farming methods.`,

  "carbon": `You are a Sustainability & Carbon Auditor. Analyze the carbon sequestration, emissions, and eco-score data and provide:
1. Current carbon footprint analysis.
2. Opportunities to earn more carbon credits.
3. Regenerative practices to improve the farm's eco-score.
Keep your response concise (150-200 words). Frame advice around sustainability and profitability.`,

  "drone": `You are the Flight Operations Chief. Analyze the drone flight logs, battery stats, and aerial insights and provide:
1. Assessment of drone fleet health and battery optimization.
2. Key findings from recent aerial surveys.
3. Recommendations for the next optimal flight path or mission.
Keep your response concise (150-200 words). Speak in terms of aerial intelligence.`,

  "scan": `You are an Expert Plant Pathology AI. Review the crop scan diagnostics (disease detections, confidence scores) and provide:
1. A secondary validation of the primary detection.
2. Immediate quarantine or treatment advice based on the pathogen.
3. Preventative measures to stop the spread.
Keep your response concise (150-200 words). Act as a highly specialized disease expert.`,

  "community": `You are the AgriNova Community Moderator & Knowledge Expert. Analyze the trending topics, unanswered questions, and user discussions and provide:
1. A summary of what farmers are currently struggling with the most.
2. Key knowledge gaps in the community.
3. Recommendations on how the user can contribute or what topics they should read up on.
Keep your response concise (150-200 words). Foster a sense of community and shared learning.`
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/module-advisor
// ─────────────────────────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { moduleId, moduleName, contextData, userQuestion, history } = body;

    if (!moduleId || !moduleName) {
      return NextResponse.json({ error: "moduleId and moduleName are required" }, { status: 400 });
    }

    // Check API keys
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
          "Add a Groq key (free) at https://console.groq.com/ to your .env.local:\n" +
          "GROQ_API_KEY=gsk_your-key-here",
      });
    }

    // Build the system prompt
    const basePrompt = MODULE_PROMPTS[moduleId] ||
      `You are an AI agricultural advisor for the "${moduleName}" module. Analyze the provided data and give 3-4 specific, actionable insights. Keep your response under 200 words.`;

    const contextString = contextData
      ? `\n\n## Current Dashboard Data:\n${JSON.stringify(contextData, null, 2)}`
      : "";

    const systemPrompt = `${basePrompt}${contextString}\n\nIMPORTANT: You are embedded inside the AgriNova farming app. Respond as a knowledgeable farming advisor. Use simple language. Be specific with numbers and recommendations. Format with bullet points and emojis for readability.`;

    // Build message history
    const messages: { role: string; content: string }[] = [];

    if (history && Array.isArray(history)) {
      for (const msg of history) {
        messages.push({ role: msg.role, content: msg.content });
      }
    }

    if (userQuestion) {
      messages.push({ role: "user", content: userQuestion });
    } else {
      messages.push({
        role: "user",
        content: `Analyze my ${moduleName} dashboard data and provide your expert assessment with actionable recommendations.`,
      });
    }

    const response = await callLLM(systemPrompt, messages);

    if (!response) {
      return NextResponse.json({ error: "Failed to generate response" }, { status: 500 });
    }

    return NextResponse.json({ message: response, moduleId });

  } catch (error) {
    console.error("Module advisor error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
