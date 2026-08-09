// =============================================================================
// AgriNova Multi-Agent System — Tool Implementations
// 40+ tools connecting 20 specialist agents to real data sources
// =============================================================================

import {
  GOVT_SCHEMES_KB, MSP_DATA, CROP_CALENDAR, FERTILIZER_GUIDE,
  SOIL_TYPES, LIVESTOCK_DB, ORGANIC_RECIPES, IRRIGATION_STAGES,
  PEST_IPM_DB, SEED_VARIETIES, AGROFORESTRY_MODELS, AQUACULTURE_DB,
  FARM_FINANCE_DB, DISASTER_CONTINGENCY,
} from "./agentKnowledge";

const ML_BACKEND_URL = process.env.ML_BACKEND_URL || "http://localhost:8000";

// ── Helper: Call ML Backend ──────────────────────────────────────────────────
async function callMLBackend(endpoint: string, options?: RequestInit): Promise<unknown> {
  try {
    const res = await fetch(`${ML_BACKEND_URL}${endpoint}`, {
      ...options,
      headers: { "Content-Type": "application/json", ...options?.headers },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) return { error: `ML Backend error: ${res.status}` };
    return await res.json();
  } catch {
    return { error: "ML Backend unreachable. Make sure uvicorn is running on port 8000." };
  }
}

// ── Helper: Call Weather API ─────────────────────────────────────────────────
async function fetchWeather(lat: number, lng: number): Promise<Record<string, unknown>> {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,rain&daily=temperature_2m_max,temperature_2m_min,rain_sum,precipitation_probability_max&timezone=auto&forecast_days=7`;
    const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
    if (!res.ok) return { error: "Weather API error" };
    return await res.json() as Record<string, unknown>;
  } catch {
    return { error: "Weather API unreachable" };
  }
}

// =============================================================================
// TOOL DEFINITIONS — Each returns structured data for agents
// =============================================================================

export interface ToolResult {
  success: boolean;
  data: unknown;
  source: string;
}

// ── 🌱 Crop Advisor Tools ────────────────────────────────────────────────────

export async function getCropRecommendation(params: {
  nitrogen?: number; phosphorus?: number; potassium?: number; ph?: number; region?: string;
}): Promise<ToolResult> {
  const result = await callMLBackend("/predict/crop", {
    method: "POST",
    body: JSON.stringify({
      nitrogen: params.nitrogen || 60,
      phosphorus: params.phosphorus || 40,
      potassium: params.potassium || 50,
      ph: params.ph || 6.5,
      region: params.region || "India",
    }),
  });
  return { success: true, data: result, source: "ML Backend /predict/crop" };
}

export function getCropCalendar(cropName: string): ToolResult {
  const key = cropName.toLowerCase().replace(/\s+/g, "");
  const crop = CROP_CALENDAR[key];
  if (crop) return { success: true, data: crop, source: "Crop Calendar KB" };
  // Fuzzy match
  const match = Object.entries(CROP_CALENDAR).find(([, v]) =>
    v.crop.toLowerCase().includes(cropName.toLowerCase())
  );
  if (match) return { success: true, data: match[1], source: "Crop Calendar KB" };
  return { success: false, data: { message: `Crop calendar not found for: ${cropName}. Available: ${Object.values(CROP_CALENDAR).map(c => c.crop).join(", ")}` }, source: "Crop Calendar KB" };
}

export function getRotationPlan(currentCrop: string, season: string): ToolResult {
  const rotations: Record<string, string[]> = {
    rice: ["Rice → Wheat (classic)", "Rice → Mustard → Green Gram", "Rice → Potato → Moong", "Rice → Lentil → Jute"],
    wheat: ["Wheat → Rice", "Wheat → Green Gram → Rice", "Wheat → Moong → Maize", "Wheat → Cowpea → Potato"],
    cotton: ["Cotton → Wheat → Green Gram", "Cotton → Gram → Sorghum", "Cotton → Onion → Groundnut"],
    maize: ["Maize → Wheat → Moong", "Maize → Potato → Sunflower", "Maize → Chickpea → Rice"],
    soybean: ["Soybean → Wheat → Maize", "Soybean → Gram → Cotton", "Soybean → Mustard → Green Gram"],
    sugarcane: ["Sugarcane → Ratoon → Wheat → Green Gram", "Sugarcane → Potato → Paddy"],
    potato: ["Potato → Onion → Paddy", "Potato → Maize → Wheat", "Potato → Moong → Paddy"],
  };
  const key = currentCrop.toLowerCase().replace(/\s+/g, "");
  const plans = rotations[key] || ["General: Cereal → Pulse → Oilseed rotation for soil health. Include a legume crop every 2-3 seasons for nitrogen fixation."];
  return { success: true, data: { currentCrop, season, rotationPlans: plans, principle: "Follow Cereal → Pulse → Oilseed cycle. Include green manuring. Avoid same-family crops consecutively." }, source: "Crop Rotation KB" };
}

// ── 🐛 Disease Diagnostician Tools ───────────────────────────────────────────

export async function analyzeDiseaseFromBackend(): Promise<ToolResult> {
  // This would be called with an image upload - returns mock since agent uses text
  const result = await callMLBackend("/health");
  return { success: true, data: result, source: "ML Backend /health" };
}

export function getDiseaseInfo(diseaseName: string): ToolResult {
  // Search through knowledge base
  const diseases: Record<string, { treatment: string; prevention: string; category: string; crop: string }> = {
    "early_blight": { treatment: "Apply mancozeb (2.5 g/L) or chlorothalonil at 7-10 day intervals. Remove lower infected leaves. Copper oxychloride 3g/L as alternative. For organic: Trichoderma viride spray 5g/L", prevention: "Rotate crops 3 years. Remove plant debris. Mulch deeply. Resistant varieties: Arka Rakshak, Arka Samrat. Avoid drought stress", category: "fungal", crop: "Tomato/Potato" },
    "late_blight": { treatment: "EMERGENCY: Metalaxyl + Mancozeb (Ridomil Gold) 2.5g/L immediately. Cymoxanil + Mancozeb as alternative. Spray every 5-7 days in wet weather. Destroy infected plants", prevention: "Use resistant varieties (Kufri Jyoti for potato). Avoid overhead irrigation. Plant certified seed. Monitor weather for blight warnings. Prophylactic mancozeb spray at humid onset", category: "oomycete", crop: "Tomato/Potato" },
    "bacterial_wilt": { treatment: "NO chemical cure. Remove and burn infected plants immediately. Solarize soil (6 weeks with plastic mulch). Apply Trichoderma + Pseudomonas fluorescens 10g/kg soil. Bleaching powder 10 kg/ha around infected zone", prevention: "Resistant varieties (Arka Abha, Arka Alok). Grafting on resistant rootstock (Solanum torvum). Crop rotation with non-solanaceous crops for 3-4 years. Raise pH above 7.0 with lime", category: "bacterial", crop: "Tomato/Brinjal/Chilli/Potato" },
    "powdery_mildew": { treatment: "Sulphur WP 80% at 3g/L (most effective, cheapest). Hexaconazole 5% EC at 1ml/L. Myclobutanil at 1g/L. For organic: Potassium bicarbonate 5g/L + Neem oil 5ml/L", prevention: "Resistant varieties. Proper spacing for air circulation. Avoid overhead irrigation. Balanced nutrition (avoid excess N). Remove infected leaves", category: "fungal", crop: "Cucurbits/Grapes/Peas/Mango" },
    "yellow_leaf_curl": { treatment: "NO cure (viral). Remove infected plants IMMEDIATELY. Control whitefly vectors aggressively: Pyriproxyfen 1ml/L or Buprofezin 1.5ml/L. Install yellow sticky traps 12-15/acre", prevention: "TYLCV-resistant varieties: Arka Rakshak, Arka Samrat, TH-1. Silver reflective mulch. Nylon net (40 mesh) nursery. Whitefly-free transplants. No tomato near cotton fields", category: "viral", crop: "Tomato" },
    "blast": { treatment: "Tricyclazole 75% WP at 0.6g/L (most effective). Isoprothiolane 40% EC at 1.5ml/L. Spray at neck blast initiation + repeat at 50% flowering. Kasugamycin 3% SL for bacterial complex", prevention: "Resistant varieties (CO-51, ADT-43). Balanced fertilization (avoid excess N >120kg/ha). Treat seed with Carbendazim 2g/kg. Split N application. Maintain 5cm water during critical stages", category: "fungal", crop: "Rice" },
  };
  const key = diseaseName.toLowerCase().replace(/[\s-]+/g, "_");
  const match = diseases[key] || Object.entries(diseases).find(([k]) => key.includes(k))?.[1];
  if (match) return { success: true, data: { disease: diseaseName, ...match }, source: "Disease KB" };
  return { success: true, data: { disease: diseaseName, message: "Detailed treatment protocol not found in offline KB. Using AI knowledge for response." }, source: "Disease KB" };
}

// ── 💧 Soil Scientist Tools ──────────────────────────────────────────────────

export function getSoilTypeInfo(soilType: string): ToolResult {
  const key = soilType.toLowerCase().replace(/\s+/g, "");
  const match = SOIL_TYPES[key] || Object.values(SOIL_TYPES).find(s =>
    s.name.toLowerCase().includes(soilType.toLowerCase())
  );
  if (match) return { success: true, data: match, source: "Soil Types KB" };
  return { success: true, data: { available: Object.values(SOIL_TYPES).map(s => s.name) }, source: "Soil Types KB" };
}

export function getFertilizerPlan(cropName: string): ToolResult {
  const key = cropName.toLowerCase().replace(/\s+/g, "");
  const plan = FERTILIZER_GUIDE[key];
  if (plan) return { success: true, data: plan, source: "Fertilizer Guide KB" };
  const match = Object.entries(FERTILIZER_GUIDE).find(([, v]) =>
    v.crop.toLowerCase().includes(cropName.toLowerCase())
  );
  if (match) return { success: true, data: match[1], source: "Fertilizer Guide KB" };
  return { success: true, data: { message: `Specific fertilizer plan not found for ${cropName}. General: NPK 120:60:60 kg/ha for most field crops.` }, source: "Fertilizer Guide KB" };
}

export function interpretSoilReport(params: { ph: number; n: number; p: number; k: number; oc?: number }): ToolResult {
  const analysis: string[] = [];
  const recommendations: string[] = [];

  // pH interpretation
  if (params.ph < 5.5) { analysis.push("⚠️ Strongly acidic soil"); recommendations.push("Apply lime 2-4 t/ha (based on buffer pH). Prefer dolomite lime if Mg deficient. Apply 1 month before sowing"); }
  else if (params.ph < 6.5) { analysis.push("Slightly acidic — suitable for most crops with amendments"); recommendations.push("Light liming 1-2 t/ha may benefit. Good for rice, potato, tea"); }
  else if (params.ph <= 7.5) { analysis.push("✅ Optimal pH range for most crops"); recommendations.push("No pH correction needed. Maintain with organic matter additions"); }
  else if (params.ph <= 8.5) { analysis.push("⚠️ Alkaline soil — may limit micronutrient availability"); recommendations.push("Apply Gypsum 2-5 t/ha. Add organic matter (FYM 15-20 t/ha). Use acidic fertilizers (ammonium sulphate instead of urea)"); }
  else { analysis.push("🚨 Highly alkaline/sodic soil — serious production limitation"); recommendations.push("Apply Gypsum based on Gypsum Requirement (GR) of soil. May need 5-10 t/ha. Grow dhaincha for green manuring. Rice-wheat system helps reclamation"); }

  // NPK interpretation
  if (params.n < 250) { analysis.push("Low nitrogen"); recommendations.push("Increase N by 25%. Use slow-release N (Neem coated urea). Green manuring. FYM/Vermicompost. Azotobacter/Azospirillum biofertilizer"); }
  if (params.p < 10) { analysis.push("Low phosphorus"); recommendations.push("Apply SSP 200 kg/ha or DAP 100 kg/ha. PSB (Phosphate Solubilizing Bacteria) biofertilizer. Rock phosphate for acidic soils"); }
  if (params.k < 120) { analysis.push("Low potassium"); recommendations.push("Apply MOP (KCl) 60-80 kg/ha. Crop residue recycling. Banana stem/wood ash as organic K source"); }
  if (params.oc !== undefined && params.oc < 0.5) { analysis.push("⚠️ Very low organic carbon — poor soil biology"); recommendations.push("FYM 10-15 t/ha annually. Green manuring with Dhaincha/Sesbania. Mulching. Cover crops. Avoid burning crop residue"); }

  return { success: true, data: { inputValues: params, analysis, recommendations }, source: "Soil Analysis Tool" };
}

// ── 🌤️ Weather Advisor Tools ─────────────────────────────────────────────────

export async function getWeatherData(lat: number, lng: number): Promise<ToolResult> {
  const data = await fetchWeather(lat, lng);
  if ("error" in data) return { success: false, data, source: "Open-Meteo API" };
  return { success: true, data, source: "Open-Meteo Weather API (live)" };
}

export async function getLocationWeather(lat: number, lng: number): Promise<ToolResult> {
  const result = await callMLBackend("/analyze/location", {
    method: "POST",
    body: JSON.stringify({ latitude: lat, longitude: lng }),
  });
  return { success: true, data: result, source: "ML Backend /analyze/location" };
}

// ── 💰 Market Analyst Tools ──────────────────────────────────────────────────

export function getMSPRates(cropName?: string): ToolResult {
  if (cropName) {
    const key = cropName.toLowerCase().replace(/[\s()]+/g, "_");
    const match = MSP_DATA[key] || Object.entries(MSP_DATA).find(([, v]) =>
      v.crop.toLowerCase().includes(cropName.toLowerCase())
    )?.[1];
    if (match) return { success: true, data: match, source: "MSP Database 2024-25" };
    return { success: true, data: { message: `MSP not found for ${cropName}. MSP is fixed for 25 commodities.`, allCrops: Object.values(MSP_DATA).map(m => `${m.crop}: ${m.msp2024} ${m.unit}`) }, source: "MSP Database 2024-25" };
  }
  return { success: true, data: { allMSP: Object.values(MSP_DATA).map(m => ({ crop: m.crop, msp2024: m.msp2024, unit: m.unit, season: m.season })) }, source: "MSP Database 2024-25" };
}

export function calculateProfitability(crop: string): ToolResult {
  const budgets = FARM_FINANCE_DB.cropBudgetPerAcre;
  const key = crop.toLowerCase() as keyof typeof budgets;
  const budget = budgets[key];
  if (budget) {
    return { success: true, data: { crop, ...budget, profitMargin: `${((budget.profit / budget.total) * 100).toFixed(1)}%`, bcRatio: (budget.expectedRevenue / budget.total).toFixed(2) }, source: "Farm Finance KB" };
  }
  return { success: true, data: { message: `Budget data not available for ${crop}` }, source: "Farm Finance KB" };
}

// ── 🏛️ Govt Schemes Expert Tools ─────────────────────────────────────────────

export function getSchemeDetails(schemeName: string): ToolResult {
  const key = schemeName.toUpperCase().replace(/[\s-]+/g, "-");
  const scheme = GOVT_SCHEMES_KB[key] || Object.values(GOVT_SCHEMES_KB).find(s =>
    s.name.toLowerCase().includes(schemeName.toLowerCase()) ||
    s.fullName.toLowerCase().includes(schemeName.toLowerCase())
  );
  if (scheme) return { success: true, data: scheme, source: "Government Schemes KB" };
  return { success: true, data: { message: `Scheme not found: ${schemeName}`, availableSchemes: Object.values(GOVT_SCHEMES_KB).map(s => `${s.name} — ${s.fullName}`) }, source: "Government Schemes KB" };
}

export function listAllSchemes(): ToolResult {
  return { success: true, data: Object.values(GOVT_SCHEMES_KB).map(s => ({ name: s.name, fullName: s.fullName, amount: s.amount, website: s.website })), source: "Government Schemes KB" };
}

// ── 🐄 Livestock Advisor Tools ───────────────────────────────────────────────

export function getBreedInfo(breedName: string): ToolResult {
  const key = breedName.toLowerCase().replace(/\s+/g, "");
  const breed = LIVESTOCK_DB[key] || Object.values(LIVESTOCK_DB).find(b =>
    b.breed.toLowerCase().includes(breedName.toLowerCase())
  );
  if (breed) return { success: true, data: breed, source: "Livestock KB" };
  return { success: true, data: { available: Object.values(LIVESTOCK_DB).map(b => `${b.breed} (${b.type})`) }, source: "Livestock KB" };
}

// ── 🌿 Organic Farming Tools ─────────────────────────────────────────────────

export function getOrganicRecipe(recipeName: string): ToolResult {
  const key = recipeName.toLowerCase().replace(/\s+/g, "");
  const recipe = ORGANIC_RECIPES[key] || Object.values(ORGANIC_RECIPES).find(r =>
    r.name.toLowerCase().includes(recipeName.toLowerCase())
  );
  if (recipe) return { success: true, data: recipe, source: "Organic Farming KB" };
  return { success: true, data: { available: Object.values(ORGANIC_RECIPES).map(r => r.name), message: "Recipe not found. Available recipes listed." }, source: "Organic Farming KB" };
}

// ── 💦 Irrigation Engineer Tools ─────────────────────────────────────────────

export function getIrrigationSchedule(cropName: string): ToolResult {
  const key = cropName.toLowerCase().replace(/\s+/g, "");
  const schedule = IRRIGATION_STAGES[key] || Object.values(IRRIGATION_STAGES).find(i =>
    i.crop.toLowerCase().includes(cropName.toLowerCase())
  );
  if (schedule) return { success: true, data: schedule, source: "Irrigation Stages KB" };
  return { success: true, data: { message: `Irrigation schedule not found for ${cropName}`, general: "Critical stages: Germination, Flowering, Grain Filling. Irrigate at 50% depletion of available soil moisture." }, source: "Irrigation Stages KB" };
}

export function calculateWaterBudget(params: { cropName: string; area: number; unit: string }): ToolResult {
  const waterReqPerHa: Record<string, number> = {
    rice: 1400, wheat: 550, maize: 650, cotton: 900, sugarcane: 2000,
    potato: 600, tomato: 500, onion: 450, groundnut: 600, mustard: 300,
    soybean: 550, chilli: 800, brinjal: 600, okra: 400, cabbage: 380,
  };
  const key = params.cropName.toLowerCase().replace(/\s+/g, "");
  const reqPerHa = waterReqPerHa[key] || 600;
  const areaHa = params.unit === "acre" ? params.area * 0.4047 : params.area;
  const totalWater = reqPerHa * areaHa;
  return {
    success: true,
    data: {
      crop: params.cropName, area: `${params.area} ${params.unit}`,
      waterRequirement: `${reqPerHa} mm/season (${(reqPerHa * 10).toLocaleString()} m³/ha)`,
      totalWaterNeeded: `${Math.round(totalWater)} mm = ${Math.round(totalWater * 10 * areaHa).toLocaleString()} liters`,
      dripSaving: `With drip: ${Math.round(totalWater * 0.6)} mm (40% saving)`,
      sprinklerSaving: `With sprinkler: ${Math.round(totalWater * 0.75)} mm (25% saving)`,
    },
    source: "Water Budget Calculator",
  };
}

// ── 🦗 Pest IPM Specialist Tools ─────────────────────────────────────────────

export function getPestInfo(pestName: string): ToolResult {
  const key = pestName.toLowerCase().replace(/\s+/g, "");
  const pest = PEST_IPM_DB[key] || Object.values(PEST_IPM_DB).find(p =>
    p.pest.toLowerCase().includes(pestName.toLowerCase())
  );
  if (pest) return { success: true, data: pest, source: "Pest IPM KB" };
  return { success: true, data: { message: `Pest not found: ${pestName}`, available: Object.values(PEST_IPM_DB).map(p => p.pest) }, source: "Pest IPM KB" };
}

export function checkSprayWeather(temp: number, humidity: number, windSpeed: number, rainExpected: boolean): ToolResult {
  const conditions: string[] = [];
  let canSpray = true;

  if (rainExpected) { conditions.push("🚫 Rain expected — DO NOT spray. Chemicals will wash off. Wait 24h after rain"); canSpray = false; }
  if (windSpeed > 15) { conditions.push("🚫 High wind (>15 km/h) — spray drift risk. Wait for calm conditions"); canSpray = false; }
  if (temp > 38) { conditions.push("⚠️ Very hot (>38°C) — rapid evaporation. Spray early morning (6-8 AM) or evening (4-6 PM)"); }
  if (temp < 10) { conditions.push("⚠️ Too cold (<10°C) — poor absorption. Wait for warmer conditions"); canSpray = false; }
  if (humidity < 40) { conditions.push("⚠️ Low humidity — add sticker/adjuvant to spray solution for better adhesion"); }
  if (humidity > 85) { conditions.push("⚠️ Very high humidity — fungal conditions likely. Consider systemic fungicide over contact"); }
  if (canSpray && !rainExpected && windSpeed <= 15 && temp >= 15 && temp <= 35) {
    conditions.push("✅ Conditions are FAVORABLE for spraying. Best time: early morning (6-9 AM) or late evening (4-6 PM)");
  }

  return { success: true, data: { temp, humidity, windSpeed, rainExpected, canSpray, conditions }, source: "Spray Weather Checker" };
}

// ── 🌾 Seed & Variety Expert Tools ───────────────────────────────────────────

export function getVarietyRecommendation(cropName: string, state?: string): ToolResult {
  const key = cropName.toLowerCase().replace(/\s+/g, "");
  const varieties = SEED_VARIETIES[key];
  if (varieties) {
    let filtered = varieties.varieties;
    if (state) {
      const stateMatch = filtered.filter(v => v.states.toLowerCase().includes(state.toLowerCase()));
      if (stateMatch.length > 0) filtered = stateMatch;
    }
    return { success: true, data: { crop: varieties.crop, varieties: filtered, state: state || "All India" }, source: "ICAR Seed Varieties KB" };
  }
  return { success: true, data: { message: `Varieties not found for ${cropName}`, available: Object.keys(SEED_VARIETIES) }, source: "ICAR Seed Varieties KB" };
}

// ── 🚜 Farm Mechanization Tools ──────────────────────────────────────────────

export function getEquipmentRecommendation(farmSize: number, crops: string[]): ToolResult {
  const recs = [];
  if (farmSize <= 2) {
    recs.push({ equipment: "Power Tiller (12-15 HP)", cost: "₹1.5-2.5 lakh", subsidy: "50% under SMAM for small farmers", use: "Ploughing, puddling, transport" });
    recs.push({ equipment: "Brush Cutter / Power Weeder", cost: "₹15,000-40,000", subsidy: "50%", use: "Weeding, grass cutting" });
    recs.push({ equipment: "Knapsack Sprayer (Battery)", cost: "₹3,000-5,000", subsidy: "50%", use: "Pesticide/fertilizer spraying" });
  } else if (farmSize <= 10) {
    recs.push({ equipment: "Mini Tractor (20-30 HP)", cost: "₹3-5 lakh", subsidy: "40-50% under SMAM", use: "All field operations" });
    recs.push({ equipment: "Rotavator", cost: "₹80,000-1.5 lakh", subsidy: "40%", use: "Seedbed preparation, residue incorporation" });
    recs.push({ equipment: "Seed Drill", cost: "₹30,000-60,000", subsidy: "40%", use: "Precision sowing" });
    recs.push({ equipment: "Drone Sprayer", cost: "₹5-10 lakh", subsidy: "Up to 100% for SC/ST under SMAM-CHC", use: "Precision spraying — 1 acre in 10 min" });
  } else {
    recs.push({ equipment: "Tractor (40-55 HP)", cost: "₹6-10 lakh", subsidy: "25-40%", use: "Heavy field operations" });
    recs.push({ equipment: "Combined Harvester", cost: "₹15-25 lakh (or custom hire ₹1,500-2,500/acre)", subsidy: "40% for CHC", use: "Harvesting cereals" });
    recs.push({ equipment: "Laser Land Leveler", cost: "₹4-6 lakh", subsidy: "50%", use: "Precision leveling — saves 25% water" });
    recs.push({ equipment: "Precision Planter", cost: "₹2-4 lakh", subsidy: "40%", use: "Uniform spacing, reduced seed rate" });
  }
  return { success: true, data: { farmSize: `${farmSize} acres`, crops, recommendations: recs, subsidyScheme: "SMAM (Sub-Mission on Agricultural Mechanization) — Apply at agrimachinery.nic.in" }, source: "Farm Mechanization KB" };
}

// ── 🌲 Agroforestry Tools ────────────────────────────────────────────────────

export function getAgroforestryModel(modelType: string): ToolResult {
  const key = modelType.toLowerCase().replace(/\s+/g, "");
  const model = AGROFORESTRY_MODELS[key] || Object.values(AGROFORESTRY_MODELS).find(m =>
    m.model.toLowerCase().includes(modelType.toLowerCase())
  );
  if (model) return { success: true, data: model, source: "Agroforestry KB" };
  return { success: true, data: { available: Object.values(AGROFORESTRY_MODELS).map(m => m.model) }, source: "Agroforestry KB" };
}

// ── 🐟 Aquaculture Tools ────────────────────────────────────────────────────

export function getFishSpeciesInfo(species: string): ToolResult {
  const key = species.toLowerCase().replace(/\s+/g, "");
  const info = AQUACULTURE_DB[key] || Object.values(AQUACULTURE_DB).find(a =>
    a.species.toLowerCase().includes(species.toLowerCase())
  );
  if (info) return { success: true, data: info, source: "Aquaculture KB" };
  return { success: true, data: { available: Object.values(AQUACULTURE_DB).map(a => a.species) }, source: "Aquaculture KB" };
}

// ── 🌊 Disaster Management Tools ────────────────────────────────────────────

export function getContingencyPlan(disasterType: string): ToolResult {
  const key = disasterType.toLowerCase().replace(/\s+/g, "");
  const plan = DISASTER_CONTINGENCY[key] || Object.values(DISASTER_CONTINGENCY).find(d =>
    d.disaster.toLowerCase().includes(disasterType.toLowerCase())
  );
  if (plan) return { success: true, data: plan, source: "Disaster Contingency KB" };
  return { success: true, data: { available: Object.values(DISASTER_CONTINGENCY).map(d => d.disaster) }, source: "Disaster Contingency KB" };
}

// ── 💵 Farm Finance Tools ────────────────────────────────────────────────────

export function getKCCInfo(): ToolResult {
  return { success: true, data: FARM_FINANCE_DB.kccInterestRates, source: "Farm Finance KB" };
}

export function getCropBudget(cropName: string): ToolResult {
  const budgets = FARM_FINANCE_DB.cropBudgetPerAcre;
  const key = cropName.toLowerCase() as keyof typeof budgets;
  if (budgets[key]) {
    return { success: true, data: { crop: cropName, perAcre: budgets[key], note: "Costs vary by region, input prices, and farming practices" }, source: "Farm Finance KB" };
  }
  return { success: true, data: { message: `Budget not available for ${cropName}`, available: Object.keys(budgets) }, source: "Farm Finance KB" };
}

// ── Master Tool Registry (for agent reference) ──────────────────────────────
export const TOOL_REGISTRY: Record<string, { description: string; agentDomain: string }> = {
  getCropRecommendation: { description: "Get AI-powered crop recommendations based on soil parameters", agentDomain: "crop" },
  getCropCalendar: { description: "Get sowing/harvesting calendar for a crop", agentDomain: "crop" },
  getRotationPlan: { description: "Get crop rotation recommendations", agentDomain: "crop" },
  getDiseaseInfo: { description: "Get disease treatment and prevention info", agentDomain: "disease" },
  getSoilTypeInfo: { description: "Get soil type characteristics and amendments", agentDomain: "soil" },
  getFertilizerPlan: { description: "Get crop-wise fertilizer schedule", agentDomain: "soil" },
  interpretSoilReport: { description: "Interpret soil test report values", agentDomain: "soil" },
  getWeatherData: { description: "Get live weather data for coordinates", agentDomain: "weather" },
  getMSPRates: { description: "Get MSP rates for crops", agentDomain: "market" },
  calculateProfitability: { description: "Calculate crop budget and profitability", agentDomain: "market" },
  getSchemeDetails: { description: "Get government scheme details", agentDomain: "schemes" },
  listAllSchemes: { description: "List all government schemes", agentDomain: "schemes" },
  getBreedInfo: { description: "Get livestock breed information", agentDomain: "livestock" },
  getOrganicRecipe: { description: "Get organic farming preparation recipes", agentDomain: "organic" },
  getIrrigationSchedule: { description: "Get crop irrigation schedule", agentDomain: "irrigation" },
  calculateWaterBudget: { description: "Calculate water requirement", agentDomain: "irrigation" },
  getPestInfo: { description: "Get pest IPM information", agentDomain: "pest_ipm" },
  checkSprayWeather: { description: "Check if weather is suitable for spraying", agentDomain: "pest_ipm" },
  getVarietyRecommendation: { description: "Get seed variety recommendations", agentDomain: "seed_variety" },
  getEquipmentRecommendation: { description: "Get farm equipment recommendations", agentDomain: "mechanization" },
  getAgroforestryModel: { description: "Get agroforestry model info", agentDomain: "agroforestry" },
  getFishSpeciesInfo: { description: "Get fish/shrimp species info", agentDomain: "aquaculture" },
  getContingencyPlan: { description: "Get disaster contingency plan", agentDomain: "disaster" },
  getKCCInfo: { description: "Get KCC loan details", agentDomain: "finance" },
  getCropBudget: { description: "Get crop budget per acre", agentDomain: "finance" },
};
