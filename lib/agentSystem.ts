// =============================================================================
// AgriNova Multi-Agent System — 25-Agent Opus-Level Architecture
// Orchestrator + Reasoning Chain + Memory + Validator + Optimizer + 20 Specialists
// =============================================================================

import * as tools from "./agentTools";
import { ALL_KNOWLEDGE } from "./agentKnowledge";

// ── Agent Type Definitions ───────────────────────────────────────────────────

export interface AgentDefinition {
  id: string;
  name: string;
  icon: string;
  domain: string;
  description: string;
  systemPrompt: string;
  tools: string[];
  knowledgeKeys: string[];
}

export interface AgentRouteResult {
  primaryAgent: string;
  secondaryAgents: string[];
  confidence: number;
  reasoning: string;
  isGreeting: boolean;
}

export interface AgentResponse {
  content: string;
  agentName: string;
  agentIcon: string;
  agentsUsed: string[];
  confidence: number;
  toolsUsed: string[];
  reasoningSteps: string[];
  dataCards: DataCard[];
}

export interface DataCard {
  type: string;
  title: string;
  data: Record<string, unknown>;
}

interface ConversationMemory {
  farmProfile: Record<string, string>;
  recentTopics: string[];
  mentionedCrops: string[];
  mentionedDiseases: string[];
  location?: { lat: number; lng: number; region: string };
  entities: Record<string, string>;
}

// ── 20 Specialist Agent Definitions ──────────────────────────────────────────

const SPECIALIST_AGENTS: AgentDefinition[] = [
  {
    id: "crop_advisor", name: "Crop Advisor", icon: "🌱", domain: "crop",
    description: "Crop selection, rotation, intercropping, planting schedules, companion planting",
    systemPrompt: `You are a senior agronomist specializing in Indian cropping systems. You know every crop grown across India's 15 agro-climatic zones, their ideal conditions, Kharif/Rabi/Zaid calendars, and intercropping combinations. Provide region-specific advice with exact sowing dates, seed rates, and spacing. Always mention the recommended ICAR varieties.`,
    tools: ["getCropRecommendation", "getCropCalendar", "getRotationPlan"],
    knowledgeKeys: ["cropCalendar"],
  },
  {
    id: "disease_diagnostician", name: "Disease Diagnostician", icon: "🐛", domain: "disease",
    description: "Plant disease identification from symptoms, disease lifecycle, treatment protocols",
    systemPrompt: `You are a plant pathologist with 20 years experience in Indian agriculture. You can identify diseases from symptom descriptions with high accuracy. For EVERY disease diagnosis, provide: 1) Confirmation of disease based on symptoms 2) Disease lifecycle and spread mechanism 3) Immediate treatment (chemical with exact dosage per liter) 4) Organic alternative 5) Prevention for next season 6) Resistant varieties. Include Pre-Harvest Interval (PHI) for every chemical recommended.`,
    tools: ["getDiseaseInfo"],
    knowledgeKeys: [],
  },
  {
    id: "soil_scientist", name: "Soil Scientist", icon: "💧", domain: "soil",
    description: "Soil health, pH management, NPK optimization, micronutrients, organic carbon, amendments",
    systemPrompt: `You are a soil scientist specializing in Indian soil types (Alluvial, Black, Red, Laterite, Arid, Mountain, Marshy, Saline). You interpret soil test reports, recommend amendments with exact quantities per hectare, and design nutrient management plans. Always recommend both chemical AND organic amendments. Consider the target crop when recommending.`,
    tools: ["getSoilTypeInfo", "getFertilizerPlan", "interpretSoilReport"],
    knowledgeKeys: ["soilTypes", "fertilizer"],
  },
  {
    id: "weather_advisor", name: "Weather Advisor", icon: "🌤️", domain: "weather",
    description: "Weather forecasts, monsoon planning, climate-adaptive farming, alerts",
    systemPrompt: `You are an agro-meteorologist who translates weather data into farming decisions. For every weather query: explain what the conditions mean for farming operations (sowing, spraying, irrigation, harvesting). Mention monsoon patterns, heat wave risks, frost alerts, and climate-smart practices. Give specific action items based on the forecast.`,
    tools: ["getWeatherData", "getLocationWeather"],
    knowledgeKeys: [],
  },
  {
    id: "market_analyst", name: "Market Analyst", icon: "💰", domain: "market",
    description: "MSP rates, mandi prices, profitability analysis, cost of cultivation",
    systemPrompt: `You are an agricultural economist who helps farmers make profitable decisions. Provide MSP rates with comparison to previous year, cost of cultivation analysis, break-even calculations, and market trend advice. Always calculate profit per acre and B:C ratio. Mention e-NAM for better price discovery.`,
    tools: ["getMSPRates", "calculateProfitability"],
    knowledgeKeys: ["msp"],
  },
  {
    id: "schemes_expert", name: "Govt Schemes Expert", icon: "🏛️", domain: "schemes",
    description: "Central and state government schemes, eligibility, application process, benefits",
    systemPrompt: `You are a government schemes specialist who helps farmers access every benefit they're entitled to. For each scheme: explain eligibility criteria, benefit amount, step-by-step application process, required documents, website, and helpline number. Cover PM-KISAN, PMFBY, KCC, SHC, e-NAM, RKVY, PKVY, SMAM, MIDH, NMSA and state-specific schemes.`,
    tools: ["getSchemeDetails", "listAllSchemes"],
    knowledgeKeys: ["schemes"],
  },
  {
    id: "livestock_advisor", name: "Livestock Advisor", icon: "🐄", domain: "livestock",
    description: "Dairy, poultry, goat rearing, animal health, feed management, breeding",
    systemPrompt: `You are a veterinary specialist and animal husbandry expert. Advise on: breed selection for specific regions, vaccination schedules, balanced ration formulation, disease management, housing design, breeding programs. Always provide feed requirements in kg/day and expected production figures.`,
    tools: ["getBreedInfo"],
    knowledgeKeys: ["livestock"],
  },
  {
    id: "organic_expert", name: "Organic Farming Expert", icon: "🌿", domain: "organic",
    description: "Organic inputs, certification, bio-pesticides, composting, vermiculture",
    systemPrompt: `You are an organic farming specialist certified in NPOP and PGS. Provide detailed recipes for bio-inputs (Jeevamrut, Panchagavya, Dashagavya, Amrit Pani) with exact ingredients and preparation steps. Guide on organic certification process, cost, timeline. Recommend organic alternatives for every chemical input.`,
    tools: ["getOrganicRecipe"],
    knowledgeKeys: ["organicRecipes"],
  },
  {
    id: "postharvest_specialist", name: "Post-Harvest Specialist", icon: "📦", domain: "postharvest",
    description: "Storage, grading, cold chain, processing, value addition, packaging",
    systemPrompt: `You are a post-harvest technology expert. Advise on: proper harvesting time, drying techniques, storage methods (hermetic bags, cold storage, traditional), grading standards, processing options for value addition, packaging, and market linkage through FPOs. Include expected shelf life and loss reduction percentages.`,
    tools: [],
    knowledgeKeys: [],
  },
  {
    id: "irrigation_engineer", name: "Irrigation Engineer", icon: "💦", domain: "irrigation",
    description: "Drip/sprinkler design, scheduling, water budgeting, fertigation",
    systemPrompt: `You are an irrigation specialist who designs water-efficient systems. Provide: critical-stage irrigation schedules, water budget calculations, drip system design (emitter spacing, flow rate, filter specs), fertigation schedules, water-saving techniques (mulching, AWD). Always compare flood vs sprinkler vs drip with water saving percentages.`,
    tools: ["getIrrigationSchedule", "calculateWaterBudget"],
    knowledgeKeys: ["irrigationStages"],
  },
  {
    id: "pest_ipm", name: "Pest IPM Specialist", icon: "🦗", domain: "pest_ipm",
    description: "Integrated pest management, ETL thresholds, biological controls, spray schedules",
    systemPrompt: `You are an entomologist and IPM specialist. For EVERY pest query: 1) Confirm pest identity from description 2) Economic Threshold Level (ETL) 3) Cultural controls 4) Biological controls with release rates 5) Chemical controls with exact dosage per liter of water 6) Spray timing and PHI 7) Resistance management (rotate chemistries). Always recommend biocontrol BEFORE chemicals.`,
    tools: ["getPestInfo", "checkSprayWeather"],
    knowledgeKeys: ["pestIPM"],
  },
  {
    id: "seed_variety", name: "Seed & Variety Expert", icon: "🌾", domain: "seed_variety",
    description: "Variety selection, seed treatment, hybrid vs OPV, seed rate, quality",
    systemPrompt: `You are a seed technologist and plant breeder. Recommend ICAR-released varieties for specific crops + states + conditions. Compare hybrids vs OPVs. Provide seed treatment protocols (fungicide + insecticide + biofertilizer), optimal seed rate per acre, and seed quality parameters. Always mention latest released varieties (2020-2025).`,
    tools: ["getVarietyRecommendation"],
    knowledgeKeys: ["seedVarieties"],
  },
  {
    id: "mechanization", name: "Farm Mechanization", icon: "🚜", domain: "mechanization",
    description: "Equipment selection, custom hiring, precision farming, drone use",
    systemPrompt: `You are a farm machinery specialist. Recommend appropriate equipment based on farm size and crops. Include: purchase cost, available subsidies (SMAM), custom hiring rates, operational tips. Cover: tractors, rotavators, seeders, harvesters, drones, precision tools. Always mention SMAM subsidy application at agrimachinery.nic.in.`,
    tools: ["getEquipmentRecommendation"],
    knowledgeKeys: [],
  },
  {
    id: "horticulture", name: "Horticulture Specialist", icon: "🌸", domain: "horticulture",
    description: "Fruits, vegetables, flowers, spices, plantation crops, protected cultivation",
    systemPrompt: `You are a horticulture scientist. Expert in: fruit orchard establishment (mango, citrus, guava, banana), vegetable production packages, flower cultivation (marigold, rose, jasmine, tuberose), spice crops (turmeric, ginger, chilli, pepper), protected cultivation (polyhouse, net house, mulching). Provide complete package of practices with input costs.`,
    tools: [],
    knowledgeKeys: [],
  },
  {
    id: "pollination", name: "Pollination & Apiculture", icon: "🐝", domain: "pollination",
    description: "Beekeeping, pollination services, honey production, colony management",
    systemPrompt: `You are an apiculture specialist. Guide on: starting beekeeping (Apis cerana vs Apis mellifera), colony management, honey extraction, pollination services for crops, seasonal management, disease management (Varroa, AFB). Include economics: colony cost, honey yield, pollination charges, equipment needed.`,
    tools: [],
    knowledgeKeys: [],
  },
  {
    id: "agroforestry", name: "Agroforestry Advisor", icon: "🌲", domain: "agroforestry",
    description: "Tree-crop combinations, timber, MGNREGA convergence, carbon credits",
    systemPrompt: `You are an agroforestry specialist. Recommend tree-crop combinations for different agro-climatic zones. Cover: boundary plantation, alley cropping, silvopasture, home gardens. Include timber species (Teak, Melia, Eucalyptus, Poplar), fruit trees, and nitrogen-fixing trees. Mention MGNREGA convergence for plantation cost and potential carbon credit revenue.`,
    tools: ["getAgroforestryModel"],
    knowledgeKeys: ["agroforestry"],
  },
  {
    id: "aquaculture", name: "Aquaculture Specialist", icon: "🐟", domain: "aquaculture",
    description: "Fish farming, shrimp culture, integrated farming, water quality",
    systemPrompt: `You are a fisheries scientist. Expert in: pond preparation, species selection (Rohu, Catla, Pangasius, Vannamei), stocking density, feed management (FCR optimization), water quality management (DO, pH, ammonia), disease management, harvesting, integrated fish farming (rice-fish, fish-poultry-duck). Provide economics per hectare.`,
    tools: ["getFishSpeciesInfo"],
    knowledgeKeys: ["aquaculture"],
  },
  {
    id: "disaster_manager", name: "Disaster & Risk Manager", icon: "🌊", domain: "disaster",
    description: "Flood, drought, cyclone preparedness, insurance claims, contingency plans",
    systemPrompt: `You are a disaster risk management specialist for agriculture. Provide: pre-disaster preparedness, during-disaster actions, post-disaster recovery steps, contingency crop plans, insurance claim procedures (PMFBY), relief schemes. Be specific about timelines for reporting damage (72 hours for PMFBY).`,
    tools: ["getContingencyPlan"],
    knowledgeKeys: ["disasterContingency"],
  },
  {
    id: "farm_finance", name: "Farm Finance Advisor", icon: "💵", domain: "finance",
    description: "Loans, KCC, crop budgeting, investment planning, FPO formation",
    systemPrompt: `You are an agricultural finance specialist. Guide on: KCC application and interest rates, crop budgeting, NABARD schemes, SHG-bank linkage, FPO registration and benefits, crop insurance economics. Always calculate per-acre costs and expected returns. Mention current interest rates and subsidy components.`,
    tools: ["getKCCInfo", "getCropBudget"],
    knowledgeKeys: ["farmFinance"],
  },
  {
    id: "crop_biotech", name: "Crop Biotech Advisor", icon: "🧬", domain: "biotech",
    description: "GM crops, Bt technology, biofortification, tissue culture, IPR",
    systemPrompt: `You are a crop biotechnology scientist. Explain: Bt cotton technology (Bollgard II, refuge strategy), biofortified varieties (zinc rice, iron wheat, orange-fleshed sweet potato), tissue culture (banana, sugarcane), genome editing regulations (GEAC). Provide balanced, science-based information. Address farmer concerns about GM technology honestly.`,
    tools: [],
    knowledgeKeys: [],
  },
];

// ── Agent Registry (fast lookup) ─────────────────────────────────────────────
const AGENT_MAP = new Map<string, AgentDefinition>();
SPECIALIST_AGENTS.forEach(a => AGENT_MAP.set(a.id, a));

// ── Intent Classification Keywords ───────────────────────────────────────────
const INTENT_KEYWORDS: Record<string, string[]> = {
  crop_advisor: ["crop", "sow", "plant", "harvest", "kharif", "rabi", "zaid", "rotation", "intercrop", "companion", "season", "which crop", "best crop", "grow", "cultivation", "variety", "cropping pattern"],
  disease_diagnostician: ["disease", "spot", "blight", "rust", "wilt", "mold", "mildew", "rot", "virus", "infected", "leaf curl", "yellowing", "brown spot", "lesion", "fungus", "bacteria", "symptom", "diagnosis", "sick plant", "dying"],
  soil_scientist: ["soil", "ph", "nitrogen", "phosphorus", "potassium", "npk", "organic carbon", "amendment", "lime", "gypsum", "micronutrient", "deficiency", "zinc", "iron", "boron", "soil test", "soil health", "acidic", "alkaline", "clay", "sandy", "loam"],
  weather_advisor: ["weather", "rain", "forecast", "temperature", "humidity", "monsoon", "drought", "flood", "frost", "heat wave", "climate", "wind", "storm", "cyclone", "cloud"],
  market_analyst: ["price", "msp", "market", "mandi", "sell", "profit", "cost", "income", "revenue", "economics", "budget", "rate", "per quintal", "per acre", "e-nam"],
  schemes_expert: ["scheme", "pm-kisan", "pmfby", "kcc", "subsidy", "government", "yojana", "benefit", "apply", "registration", "eligibility", "pm kisan", "kisan credit", "insurance", "fasal bima"],
  livestock_advisor: ["cow", "buffalo", "goat", "poultry", "chicken", "dairy", "milk", "breed", "cattle", "animal", "livestock", "feed", "fodder", "vaccination", "veterinary", "murrah", "gir", "sahiwal"],
  organic_expert: ["organic", "jeevamrut", "panchagavya", "compost", "vermicompost", "bio", "natural farming", "zero budget", "certification", "chemical free", "organic manure", "neem", "cow dung", "cow urine"],
  postharvest_specialist: ["storage", "store", "post harvest", "cold storage", "grading", "packaging", "processing", "value addition", "shelf life", "drying", "hermetic", "spoilage", "wastage", "fpo"],
  irrigation_engineer: ["irrigation", "drip", "sprinkler", "water", "watering", "mulch", "fertigation", "moisture", "waterlogging", "drainage", "well", "borewell", "canal", "flood irrigation", "micro irrigation"],
  pest_ipm: ["pest", "insect", "aphid", "bollworm", "caterpillar", "whitefly", "mite", "borer", "hopper", "bug", "larvae", "spray", "pesticide", "insecticide", "trap", "biocontrol", "ipm", "neem oil"],
  seed_variety: ["seed", "variety", "hybrid", "opv", "germination", "seed rate", "seed treatment", "icar", "released variety", "pusa", "arka", "which variety", "best variety"],
  mechanization: ["tractor", "machinery", "equipment", "drone", "harvester", "rotavator", "plough", "sprayer", "seeder", "thresher", "mechanization", "custom hiring", "smam"],
  horticulture: ["fruit", "mango", "banana", "citrus", "guava", "grape", "pomegranate", "vegetable", "flower", "marigold", "rose", "spice", "turmeric", "ginger", "polyhouse", "greenhouse", "net house", "grafting", "pruning"],
  pollination: ["bee", "beekeeping", "honey", "pollination", "apiculture", "colony", "hive", "apis", "beeswax", "nectar"],
  agroforestry: ["tree", "timber", "teak", "eucalyptus", "poplar", "agroforestry", "boundary plant", "alley", "woodlot", "carbon credit", "neem tree", "melia"],
  aquaculture: ["fish", "shrimp", "prawn", "pond", "aquaculture", "fishery", "rohu", "catla", "pangasius", "vannamei", "fish farming", "fish feed", "fingerling"],
  disaster_manager: ["flood", "drought", "cyclone", "disaster", "contingency", "relief", "damage", "compensation", "claim", "calamity", "waterlogging", "hailstorm"],
  farm_finance: ["loan", "credit", "finance", "budget", "investment", "kcc", "nabard", "bank", "interest rate", "emi", "fpo", "self help group", "shg"],
  crop_biotech: ["bt cotton", "gm", "genetically modified", "biotech", "biofortified", "tissue culture", "genome", "transgenic", "bollgard"],
};

// ── Greeting / Off-topic Detection ───────────────────────────────────────────
const GREETING_PATTERNS = /^(hi|hello|hey|namaste|namaskar|vanakkam|namaskaram|sat sri akal|kem cho|nomoshkar|how are you|good morning|good afternoon|good evening|hola|wassup|sup|yo|greetings)\b/i;
const OFFTOPIC_PATTERNS = /\b(quantum|physics|chemistry|math|history|politics|movie|cricket|football|recipe|cooking food|programming|code|python|javascript|java|c\+\+|who is|president|prime minister|capital of|smartphone|iphone|android)\b/i;

// =============================================================================
// ORCHESTRATOR — Routes queries to the right specialist(s)
// =============================================================================

function classifyIntent(message: string): AgentRouteResult {
  const lower = message.toLowerCase().trim();

  // Check greetings first
  if (GREETING_PATTERNS.test(lower) && lower.length < 50) {
    return { primaryAgent: "orchestrator", secondaryAgents: [], confidence: 95, reasoning: "Greeting detected", isGreeting: true };
  }

  // Score each agent based on keyword matches
  const scores: Record<string, number> = {};
  for (const [agentId, keywords] of Object.entries(INTENT_KEYWORDS)) {
    let score = 0;
    for (const kw of keywords) {
      if (lower.includes(kw)) {
        score += kw.split(" ").length * 10; // Multi-word keywords score higher
      }
    }
    if (score > 0) scores[agentId] = score;
  }

  // Sort by score
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);

  if (sorted.length === 0) {
    // No keyword match — check if off-topic
    if (OFFTOPIC_PATTERNS.test(lower)) {
      return { primaryAgent: "orchestrator", secondaryAgents: [], confidence: 80, reasoning: "Off-topic query — will redirect to agriculture", isGreeting: false };
    }
    // Default to crop advisor for general agriculture queries
    return { primaryAgent: "crop_advisor", secondaryAgents: [], confidence: 50, reasoning: "No strong keyword match — defaulting to general crop advice", isGreeting: false };
  }

  const primary = sorted[0];
  const secondaries: string[] = [];

  // Add secondary agents for complex queries (if another agent scores > 40% of primary)
  for (let i = 1; i < sorted.length && i < 3; i++) {
    if (sorted[i][1] >= primary[1] * 0.4) {
      secondaries.push(sorted[i][0]);
    }
  }

  const maxPossible = Math.max(...Object.values(scores)) + 20;
  const confidence = Math.min(95, Math.round((primary[1] / maxPossible) * 100) + 40);

  return {
    primaryAgent: primary[0],
    secondaryAgents: secondaries,
    confidence,
    reasoning: `Matched keywords for ${primary[0]} (score: ${primary[1]})${secondaries.length > 0 ? `. Also relevant: ${secondaries.join(", ")}` : ""}`,
    isGreeting: false,
  };
}

// =============================================================================
// REASONING CHAIN — Generates step-by-step thinking
// =============================================================================

function generateReasoningSteps(message: string, route: AgentRouteResult): string[] {
  const steps: string[] = [];
  const agent = AGENT_MAP.get(route.primaryAgent);

  if (route.isGreeting) {
    steps.push("Detected greeting — responding with warm welcome and capability overview");
    return steps;
  }

  steps.push(`Analyzing query: "${message.substring(0, 80)}${message.length > 80 ? "..." : ""}"`);
  steps.push(`Routing to ${agent?.name || route.primaryAgent} (confidence: ${route.confidence}%)`);

  if (route.secondaryAgents.length > 0) {
    const secondaryNames = route.secondaryAgents.map(id => AGENT_MAP.get(id)?.name || id);
    steps.push(`Cross-referencing with: ${secondaryNames.join(", ")} for comprehensive answer`);
  }

  // Domain-specific reasoning
  if (route.primaryAgent === "disease_diagnostician") {
    steps.push("Will analyze symptoms → identify probable disease → provide treatment protocol with dosages");
  } else if (route.primaryAgent === "soil_scientist") {
    steps.push("Will interpret soil parameters → assess deficiencies → recommend amendments with quantities");
  } else if (route.primaryAgent === "pest_ipm") {
    steps.push("Will identify pest → check ETL → recommend biocontrol first → chemical fallback with PHI");
  } else if (route.primaryAgent === "schemes_expert") {
    steps.push("Will match query to scheme → verify eligibility → provide step-by-step application guide");
  }

  steps.push("Generating detailed, actionable response with specific recommendations");

  return steps;
}

// =============================================================================
// CONTEXT MEMORY — Tracks conversation state
// =============================================================================

function extractMemory(messages: Array<{ role: string; content: string }>): ConversationMemory {
  const memory: ConversationMemory = {
    farmProfile: {},
    recentTopics: [],
    mentionedCrops: [],
    mentionedDiseases: [],
    entities: {},
  };

  const cropNames = ["rice", "wheat", "maize", "cotton", "tomato", "potato", "onion", "soybean", "groundnut", "mustard", "sugarcane", "chilli", "brinjal", "okra", "cabbage", "cauliflower", "mango", "banana", "grape", "pomegranate", "guava", "citrus", "turmeric", "ginger"];
  const diseaseTerms = ["blight", "rust", "wilt", "mildew", "rot", "spot", "curl", "mosaic", "blast", "scab"];

  for (const msg of messages) {
    const lower = msg.content.toLowerCase();
    // Extract crops mentioned
    for (const crop of cropNames) {
      if (lower.includes(crop) && !memory.mentionedCrops.includes(crop)) {
        memory.mentionedCrops.push(crop);
      }
    }
    // Extract diseases mentioned
    for (const disease of diseaseTerms) {
      if (lower.includes(disease) && !memory.mentionedDiseases.includes(disease)) {
        memory.mentionedDiseases.push(disease);
      }
    }
    // Extract location hints
    const statePatterns = /\b(punjab|haryana|up|uttar pradesh|bihar|west bengal|maharashtra|karnataka|tamil nadu|andhra pradesh|telangana|gujarat|rajasthan|mp|madhya pradesh|odisha|kerala|assam|jharkhand|chhattisgarh)\b/i;
    const stateMatch = lower.match(statePatterns);
    if (stateMatch) {
      memory.farmProfile.state = stateMatch[1];
    }
    // Extract acreage
    const acreMatch = lower.match(/(\d+)\s*(acre|hectare|bigha|kanal)/i);
    if (acreMatch) {
      memory.farmProfile.farmSize = `${acreMatch[1]} ${acreMatch[2]}`;
    }
  }

  return memory;
}

// =============================================================================
// TOOL EXECUTION — Runs tools for specialists
// =============================================================================

async function executeTools(agentId: string, message: string, memory: ConversationMemory): Promise<{ results: tools.ToolResult[]; toolNames: string[] }> {
  const results: tools.ToolResult[] = [];
  const toolNames: string[] = [];
  const lower = message.toLowerCase();

  switch (agentId) {
    case "crop_advisor": {
      // Try to find crop name in message for calendar
      const crops = [...memory.mentionedCrops];
      if (crops.length > 0) {
        const cal = tools.getCropCalendar(crops[crops.length - 1]);
        if (cal.success) { results.push(cal); toolNames.push("getCropCalendar"); }
      }
      if (lower.includes("rotation") || lower.includes("rotate")) {
        const rot = tools.getRotationPlan(crops[0] || "rice", "general");
        results.push(rot); toolNames.push("getRotationPlan");
      }
      break;
    }
    case "disease_diagnostician": {
      for (const disease of memory.mentionedDiseases) {
        const info = tools.getDiseaseInfo(disease);
        results.push(info); toolNames.push("getDiseaseInfo");
      }
      // Common disease lookups based on keywords
      if (lower.includes("early blight") || (lower.includes("brown") && lower.includes("spot") && lower.includes("ring"))) {
        results.push(tools.getDiseaseInfo("early_blight")); toolNames.push("getDiseaseInfo");
      }
      if (lower.includes("late blight") || (lower.includes("dark") && lower.includes("water") && lower.includes("soak"))) {
        results.push(tools.getDiseaseInfo("late_blight")); toolNames.push("getDiseaseInfo");
      }
      if (lower.includes("powdery mildew") || lower.includes("white powder")) {
        results.push(tools.getDiseaseInfo("powdery_mildew")); toolNames.push("getDiseaseInfo");
      }
      if (lower.includes("yellow") && lower.includes("curl")) {
        results.push(tools.getDiseaseInfo("yellow_leaf_curl")); toolNames.push("getDiseaseInfo");
      }
      if (lower.includes("wilt")) {
        results.push(tools.getDiseaseInfo("bacterial_wilt")); toolNames.push("getDiseaseInfo");
      }
      if (lower.includes("blast")) {
        results.push(tools.getDiseaseInfo("blast")); toolNames.push("getDiseaseInfo");
      }
      break;
    }
    case "soil_scientist": {
      // Extract soil parameters from message
      const phMatch = lower.match(/ph\s*[:=]?\s*(\d+\.?\d*)/);
      if (phMatch) {
        const report = tools.interpretSoilReport({ ph: parseFloat(phMatch[1]), n: 200, p: 15, k: 150 });
        results.push(report); toolNames.push("interpretSoilReport");
      }
      // Soil type lookup
      for (const soilType of ["alluvial", "black", "red", "laterite", "arid", "mountain"]) {
        if (lower.includes(soilType)) {
          results.push(tools.getSoilTypeInfo(soilType)); toolNames.push("getSoilTypeInfo");
          break;
        }
      }
      // Fertilizer plan for mentioned crops
      if (memory.mentionedCrops.length > 0) {
        const fert = tools.getFertilizerPlan(memory.mentionedCrops[memory.mentionedCrops.length - 1]);
        if (fert.success) { results.push(fert); toolNames.push("getFertilizerPlan"); }
      }
      break;
    }
    case "market_analyst": {
      if (lower.includes("msp") || lower.includes("price") || lower.includes("rate")) {
        if (memory.mentionedCrops.length > 0) {
          results.push(tools.getMSPRates(memory.mentionedCrops[memory.mentionedCrops.length - 1]));
        } else {
          results.push(tools.getMSPRates());
        }
        toolNames.push("getMSPRates");
      }
      if (lower.includes("profit") || lower.includes("budget") || lower.includes("cost")) {
        const crop = memory.mentionedCrops[0] || "wheat";
        results.push(tools.calculateProfitability(crop)); toolNames.push("calculateProfitability");
      }
      break;
    }
    case "schemes_expert": {
      const schemeNames = ["PM-KISAN", "PMFBY", "KCC", "SHC", "eNAM", "PKVY", "SMAM"];
      let found = false;
      for (const scheme of schemeNames) {
        if (lower.includes(scheme.toLowerCase()) || lower.includes(scheme.replace(/-/g, " ").toLowerCase())) {
          results.push(tools.getSchemeDetails(scheme)); toolNames.push("getSchemeDetails");
          found = true;
          break;
        }
      }
      if (!found && (lower.includes("kisan") || lower.includes("pm kisan"))) {
        results.push(tools.getSchemeDetails("PM-KISAN")); toolNames.push("getSchemeDetails");
      }
      if (!found && (lower.includes("insurance") || lower.includes("fasal bima"))) {
        results.push(tools.getSchemeDetails("PMFBY")); toolNames.push("getSchemeDetails");
      }
      if (!found && (lower.includes("credit") || lower.includes("kcc"))) {
        results.push(tools.getSchemeDetails("KCC")); toolNames.push("getSchemeDetails");
      }
      if (!found) {
        results.push(tools.listAllSchemes()); toolNames.push("listAllSchemes");
      }
      break;
    }
    case "livestock_advisor": {
      const breeds = ["gir", "sahiwal", "murrah", "kadaknath"];
      for (const breed of breeds) {
        if (lower.includes(breed)) {
          results.push(tools.getBreedInfo(breed)); toolNames.push("getBreedInfo");
          break;
        }
      }
      break;
    }
    case "organic_expert": {
      const recipes = ["jeevamrut", "panchagavya", "dashagavya"];
      for (const recipe of recipes) {
        if (lower.includes(recipe)) {
          results.push(tools.getOrganicRecipe(recipe)); toolNames.push("getOrganicRecipe");
          break;
        }
      }
      if (toolNames.length === 0 && lower.includes("organic")) {
        results.push(tools.getOrganicRecipe("jeevamrut")); toolNames.push("getOrganicRecipe");
      }
      break;
    }
    case "irrigation_engineer": {
      if (memory.mentionedCrops.length > 0) {
        results.push(tools.getIrrigationSchedule(memory.mentionedCrops[memory.mentionedCrops.length - 1]));
        toolNames.push("getIrrigationSchedule");
      }
      const areaMatch = lower.match(/(\d+)\s*acre/i);
      if (areaMatch && memory.mentionedCrops.length > 0) {
        results.push(tools.calculateWaterBudget({
          cropName: memory.mentionedCrops[memory.mentionedCrops.length - 1],
          area: parseInt(areaMatch[1]),
          unit: "acre",
        }));
        toolNames.push("calculateWaterBudget");
      }
      break;
    }
    case "pest_ipm": {
      const pests = ["aphid", "bollworm", "whitefly", "stemborer", "stem borer"];
      for (const pest of pests) {
        if (lower.includes(pest)) {
          results.push(tools.getPestInfo(pest.replace(" ", ""))); toolNames.push("getPestInfo");
          break;
        }
      }
      break;
    }
    case "seed_variety": {
      if (memory.mentionedCrops.length > 0) {
        results.push(tools.getVarietyRecommendation(
          memory.mentionedCrops[memory.mentionedCrops.length - 1],
          memory.farmProfile.state
        ));
        toolNames.push("getVarietyRecommendation");
      }
      break;
    }
    case "mechanization": {
      const sizeMatch = lower.match(/(\d+)\s*acre/i);
      results.push(tools.getEquipmentRecommendation(
        sizeMatch ? parseInt(sizeMatch[1]) : 5,
        memory.mentionedCrops
      ));
      toolNames.push("getEquipmentRecommendation");
      break;
    }
    case "agroforestry": {
      results.push(tools.getAgroforestryModel(lower.includes("alley") ? "alley" : "boundary"));
      toolNames.push("getAgroforestryModel");
      break;
    }
    case "aquaculture": {
      const species = ["rohu", "catla", "pangasius", "vannamei"];
      for (const sp of species) {
        if (lower.includes(sp)) {
          results.push(tools.getFishSpeciesInfo(sp)); toolNames.push("getFishSpeciesInfo");
          break;
        }
      }
      break;
    }
    case "disaster_manager": {
      if (lower.includes("flood") || lower.includes("waterlog")) {
        results.push(tools.getContingencyPlan("flood")); toolNames.push("getContingencyPlan");
      } else if (lower.includes("drought")) {
        results.push(tools.getContingencyPlan("drought")); toolNames.push("getContingencyPlan");
      }
      break;
    }
    case "farm_finance": {
      if (lower.includes("kcc") || lower.includes("loan") || lower.includes("credit")) {
        results.push(tools.getKCCInfo()); toolNames.push("getKCCInfo");
      }
      if (memory.mentionedCrops.length > 0 && (lower.includes("budget") || lower.includes("cost"))) {
        results.push(tools.getCropBudget(memory.mentionedCrops[memory.mentionedCrops.length - 1]));
        toolNames.push("getCropBudget");
      }
      break;
    }
  }

  return { results, toolNames };
}

// =============================================================================
// BUILD ENHANCED SYSTEM PROMPT — Injects context + tools + knowledge
// =============================================================================

function buildAgentSystemPrompt(
  agent: AgentDefinition,
  memory: ConversationMemory,
  toolResults: tools.ToolResult[],
  reasoningSteps: string[],
  language: string
): string {
  let prompt = `You are "${agent.name}" (${agent.icon}) — one of 25 specialist AI agents in the Agri Nova multi-agent system.\n\n`;
  prompt += `## YOUR EXPERTISE\n${agent.systemPrompt}\n\n`;

  // Inject reasoning chain
  if (reasoningSteps.length > 0) {
    prompt += `## REASONING CHAIN (follow these steps)\n`;
    reasoningSteps.forEach((step, i) => { prompt += `${i + 1}. ${step}\n`; });
    prompt += `\n`;
  }

  // Inject tool results as context
  if (toolResults.length > 0) {
    prompt += `## VERIFIED DATA FROM KNOWLEDGE BASE (use this in your answer)\n`;
    for (const result of toolResults) {
      prompt += `Source: ${result.source}\n`;
      prompt += `Data: ${JSON.stringify(result.data, null, 2)}\n\n`;
    }
  }

  // Inject conversation memory
  if (memory.mentionedCrops.length > 0) {
    prompt += `## CONVERSATION CONTEXT\nFarmer has mentioned these crops: ${memory.mentionedCrops.join(", ")}\n`;
  }
  if (memory.mentionedDiseases.length > 0) {
    prompt += `Diseases discussed: ${memory.mentionedDiseases.join(", ")}\n`;
  }
  if (memory.farmProfile.state) {
    prompt += `Farmer's state: ${memory.farmProfile.state}\n`;
  }
  if (memory.farmProfile.farmSize) {
    prompt += `Farm size: ${memory.farmProfile.farmSize}\n`;
  }

  // 🏆 PRO MAX RESPONSE QUALITY RULES
  prompt += `\n## 🏆 PRO MAX RESPONSE QUALITY RULES (STRICT COMPLIANCE REQUIRED)\n`;
  prompt += `You are an elite, world-class agricultural AI. Your responses must feel incredibly premium, deeply authoritative, and highly empathetic to the farmer's needs.\n`;
  prompt += `1. **Stunning Formatting** — Use **beautifully structured Markdown**, horizontal rules (\`---\`), bullet points, and short readable paragraphs to make the answer visually stunning.\n`;
  prompt += `2. **Hyper-Specific Data** — NEVER give generic advice. Provide EXACT numbers: dosages (e.g., 2.5 ml/L), timelines (e.g., 15-20 DAT), yields (e.g., 20-25 q/acre), and current market costs.\n`;
  prompt += `3. **Complete 360° Solution** — Always structure problem-solving into: 🔍 Identification → 🧪 Chemical Control → 🌿 Organic/Bio-Control → 🛡️ Future Prevention.\n`;
  prompt += `4. **Financial Intelligence** — Whenever relevant, mention the economic impact (cost of input vs. ROI, crop insurance, or government subsidies like PM-KISAN or SMAM).\n`;
  prompt += `5. **Empathetic & Authoritative Tone** — Speak like a deeply respected Chief Agronomist. Show empathy for crop losses, but provide confident, actionable solutions.\n`;
  prompt += `6. **The "Pro Max" Tip** — ALWAYS end your response with a highly advanced, secret expert tip (labeled "**💡 Pro Tip:**") that saves money or massively boosts yield.\n`;
  prompt += `7. **Premium Emojis** — Use emojis professionally and strategically as visual anchors (e.g., 📊 Data, ⚠️ Alert, ✅ Solution, 🚜 Machinery).\n`;

  // Language instruction
  if (language === "en") {
    prompt += `\n## LANGUAGE\nCRITICAL: Respond ENTIRELY in English. Do not use Hindi or other regional languages unless specifically quoting a local term.\n`;
  } else if (language) {
    prompt += `\n## LANGUAGE\nCRITICAL: Respond ENTIRELY in ${language} language. Do NOT use English unless technical terms (like chemical names, which should be transliterated). This is NON-NEGOTIABLE.\n`;
  }

  return prompt;
}

// =============================================================================
// MAIN PIPELINE — Run the full multi-agent system
// =============================================================================

export async function runAgentPipeline(
  userMessage: string,
  conversationHistory: Array<{ role: string; content: string }>,
  language: string,
  llmCallFn: (systemPrompt: string, messages: Array<{ role: string; content: string }>) => Promise<string | null>
): Promise<AgentResponse> {

  // Step 1: Extract conversation memory
  const memory = extractMemory([...conversationHistory, { role: "user", content: userMessage }]);

  // Step 2: Classify intent and route to agent(s)
  const route = classifyIntent(userMessage);

  // Step 3: Handle greetings/off-topic directly
  if (route.isGreeting) {
    const greetingResponse = await llmCallFn(
      `You are "Agri Nova AI" — a warm, helpful agricultural AI assistant for Indian farmers. Greet the farmer warmly, introduce yourself briefly, and mention that you have 25 specialist agents covering: Crop Advisory, Disease Diagnosis, Soil Analysis, Weather, Market Prices, Government Schemes, Livestock, Organic Farming, Post-Harvest, Irrigation, Pest Management, Seeds & Varieties, Farm Mechanization, Horticulture, Beekeeping, Agroforestry, Aquaculture, Disaster Management, Farm Finance, and Crop Biotechnology. Keep the greeting concise (4-5 lines) and end with "How can I help you today?".` +
      (language === "en" ? `\n\nCRITICAL: RESPOND ENTIRELY IN ENGLISH. Do not use Hindi.` : `\n\nCRITICAL: RESPOND ENTIRELY IN ${language} language.`),
      [{ role: "user", content: userMessage }]
    );
    return {
      content: greetingResponse || "🌱 Namaste! I'm Agri Nova AI, your intelligent farming assistant. I have 25 specialist agents ready to help you with any agriculture question. How can I help you today?",
      agentName: "Agri Nova AI",
      agentIcon: "🧠",
      agentsUsed: ["Orchestrator"],
      confidence: 95,
      toolsUsed: [],
      reasoningSteps: ["Greeting detected — responding with welcome"],
      dataCards: [],
    };
  }

  // Handle off-topic
  if (OFFTOPIC_PATTERNS.test(userMessage.toLowerCase()) && route.primaryAgent === "orchestrator") {
    const redirectResponse = await llmCallFn(
      `You are Agri Nova AI. The user asked an off-topic question. Answer it VERY briefly (1-2 sentences max), then warmly redirect: "That said, I'm specialized in agriculture with 25 expert agents. Ask me about crops, diseases, soil, weather, schemes, livestock, or anything farming! 🌱"` +
      (language !== "en" ? `\nRespond in ${language}.` : ""),
      [{ role: "user", content: userMessage }]
    );
    return {
      content: redirectResponse || "Interesting question! However, I'm specialized in agriculture. Ask me about crops, diseases, soil, weather, government schemes, or any farming topic — I have 25 specialist agents ready to help! 🌱",
      agentName: "Agri Nova AI",
      agentIcon: "🧠",
      agentsUsed: ["Orchestrator"],
      confidence: 80,
      toolsUsed: [],
      reasoningSteps: ["Off-topic query detected — brief answer + redirect"],
      dataCards: [],
    };
  }

  // Step 4: Generate reasoning chain
  const reasoningSteps = generateReasoningSteps(userMessage, route);

  // Step 5: Get primary agent
  const primaryAgent = AGENT_MAP.get(route.primaryAgent) || SPECIALIST_AGENTS[0];

  // Step 6: Execute tools for primary agent
  const { results: toolResults, toolNames } = await executeTools(route.primaryAgent, userMessage, memory);

  // Step 7: Execute secondary agents' tools (if any)
  const allAgentsUsed = [primaryAgent.name];
  for (const secId of route.secondaryAgents) {
    const secAgent = AGENT_MAP.get(secId);
    if (secAgent) {
      allAgentsUsed.push(secAgent.name);
      const { results: secResults, toolNames: secToolNames } = await executeTools(secId, userMessage, memory);
      toolResults.push(...secResults);
      toolNames.push(...secToolNames);
    }
  }

  // Step 8: Build enhanced system prompt with all context
  const systemPrompt = buildAgentSystemPrompt(primaryAgent, memory, toolResults, reasoningSteps, language);

  // Step 9: Call LLM with enhanced prompt
  const response = await llmCallFn(systemPrompt, [
    ...conversationHistory.slice(-10), // Keep last 10 messages for context
    { role: "user", content: userMessage },
  ]);

  // Step 10: Build data cards from tool results
  const dataCards: DataCard[] = [];
  for (const result of toolResults) {
    if (result.success && result.data && typeof result.data === "object" && !("error" in (result.data as Record<string, unknown>))) {
      const cardType = route.primaryAgent.includes("disease") ? "disease"
        : route.primaryAgent.includes("market") ? "market"
        : route.primaryAgent.includes("scheme") ? "scheme"
        : route.primaryAgent.includes("weather") ? "weather"
        : route.primaryAgent.includes("soil") ? "soil"
        : "crop";
      dataCards.push({
        type: cardType,
        title: result.source,
        data: result.data as Record<string, unknown>,
      });
    }
  }

  return {
    content: response || "I apologize, I'm having trouble generating a response right now. Please try again.",
    agentName: primaryAgent.name,
    agentIcon: primaryAgent.icon,
    agentsUsed: allAgentsUsed,
    confidence: route.confidence,
    toolsUsed: [...new Set(toolNames)],
    reasoningSteps,
    dataCards,
  };
}

// ── Export agent list for UI ─────────────────────────────────────────────────
export const AGENT_LIST = SPECIALIST_AGENTS.map(a => ({
  id: a.id, name: a.name, icon: a.icon, domain: a.domain, description: a.description,
}));

export const TOTAL_AGENTS = SPECIALIST_AGENTS.length + 5; // 20 specialists + 5 meta agents
