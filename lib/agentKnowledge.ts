// =============================================================================
// AgriNova Multi-Agent System — Curated Knowledge Bases
// 20 Domain Knowledge Bases for 25-Agent Architecture
// =============================================================================

// ── Government Schemes Database ──────────────────────────────────────────────
export const GOVT_SCHEMES_KB: Record<string, {
  name: string; fullName: string; launched: string; benefits: string;
  eligibility: string; amount: string; howToApply: string; website: string;
  documents: string[];
}> = {
  "PM-KISAN": {
    name: "PM-KISAN",
    fullName: "Pradhan Mantri Kisan Samman Nidhi",
    launched: "2019",
    benefits: "Direct income support of ₹6,000 per year in 3 installments of ₹2,000 each, transferred directly to bank account",
    eligibility: "All land-holding farmer families with cultivable land. Excludes: institutional landholders, income tax payers, government employees, pensioners drawing ₹10,000+/month",
    amount: "₹6,000/year (₹2,000 every 4 months)",
    howToApply: "Visit pmkisan.gov.in → New Farmer Registration → Enter Aadhaar + bank details → Submit. OR visit nearest CSC/post office",
    website: "https://pmkisan.gov.in",
    documents: ["Aadhaar Card", "Bank Account (linked to Aadhaar)", "Land Records (Khasra/Khatauni)", "Mobile Number"],
  },
  "PMFBY": {
    name: "PMFBY",
    fullName: "Pradhan Mantri Fasal Bima Yojana",
    launched: "2016",
    benefits: "Crop insurance at subsidized premiums. Covers yield losses from natural calamities, pests, diseases. Add-on: prevented sowing, post-harvest losses (14 days), localized calamities",
    eligibility: "All farmers (loanee + non-loanee) growing notified crops. Voluntary for all since Kharif 2020",
    amount: "Premium: Kharif 2%, Rabi 1.5%, Commercial/Horticultural 5%. Government pays remaining premium. Sum insured = Scale of Finance",
    howToApply: "Through bank (loanee farmers auto-enrolled unless opted out), CSC, insurance company agent, or pmfby.gov.in",
    website: "https://pmfby.gov.in",
    documents: ["Aadhaar", "Bank Passbook", "Land Records", "Sowing Certificate", "Crop details"],
  },
  "KCC": {
    name: "KCC",
    fullName: "Kisan Credit Card",
    launched: "1998 (revised 2019)",
    benefits: "Short-term crop loans at 4% interest (with prompt repayment). Credit limit covers cultivation + post-harvest + maintenance + consumption. ATM-enabled card for withdrawal",
    eligibility: "All farmers (owner cultivators, tenant farmers, sharecroppers, SHGs, JLGs). Also covers: animal husbandry, fisheries",
    amount: "Credit limit based on Scale of Finance × area + 10% post-harvest + 20% maintenance. Max ₹3 lakh at subsidized rate. Interest: 7% (banks) - 3% (GOI subvention) = 4% effective for prompt repayment",
    howToApply: "Apply at any bank branch (commercial, cooperative, RRB) with land records. Single-page application form. Processing in 14 days",
    website: "https://www.pmkisan.gov.in/KCC",
    documents: ["Aadhaar", "Land Records", "Passport Photo", "Application Form"],
  },
  "SHC": {
    name: "SHC",
    fullName: "Soil Health Card Scheme",
    launched: "2015",
    benefits: "Free soil testing and nutrient-based fertilizer recommendations. Card shows: N, P, K, S, Zn, Fe, Cu, Mn, B levels + pH + EC + OC. Crop-wise fertilizer dosage recommendations",
    eligibility: "All farmers. Soil samples collected grid-wise (every 2.5 hectare for irrigated, 10 hectare for rainfed). Issued every 2 years",
    amount: "Free of cost. Government bears entire expense",
    howToApply: "Contact Block Agriculture Officer or visit soilhealth.dac.gov.in. Soil samples collected by trained staff. Card delivered in 3-4 weeks",
    website: "https://soilhealth.dac.gov.in",
    documents: ["Farm location details", "Previous soil test report (if any)"],
  },
  "eNAM": {
    name: "e-NAM",
    fullName: "National Agriculture Market (Electronic)",
    launched: "2016",
    benefits: "Online trading platform linking 1000+ mandis. Transparent price discovery, competitive bidding, real-time price info. Reduces intermediaries, better price realization for farmers",
    eligibility: "All farmers, traders, commission agents, FPOs registered on the platform",
    amount: "No registration fee. Saves 2-5% commission typically lost to intermediaries",
    howToApply: "Register at enam.gov.in with Aadhaar + bank account. Or register at nearest e-NAM enabled mandi",
    website: "https://enam.gov.in",
    documents: ["Aadhaar", "Bank Account", "Mobile Number", "Land Records (for farmers)"],
  },
  "PKVY": {
    name: "PKVY",
    fullName: "Paramparagat Krishi Vikas Yojana",
    launched: "2015",
    benefits: "Promotes organic farming through cluster approach. Financial assistance for 3-year conversion period. Covers: inputs, certification (PGS), marketing, value addition",
    eligibility: "Group of 50+ farmers forming a cluster of 50 acres. Priority: SC/ST farmers, women farmers, small/marginal farmers",
    amount: "₹50,000/hectare over 3 years (₹31,000 for inputs + ₹8,800 for certification + ₹10,200 for value addition/marketing)",
    howToApply: "Through State Agriculture Department → District Agriculture Officer → Form cluster → Apply under PKVY",
    website: "https://pgsindia-ncof.gov.in",
    documents: ["Cluster formation documents", "Land records", "Aadhaar", "Bank account"],
  },
  "SMAM": {
    name: "SMAM",
    fullName: "Sub-Mission on Agricultural Mechanization",
    launched: "2014",
    benefits: "Subsidy on farm machinery and equipment. Custom Hiring Centres (CHC), Farm Machinery Banks, hi-tech hubs. Training on modern machinery use",
    eligibility: "Individual farmers, FPOs, cooperatives, SHGs, entrepreneurs for CHC. Higher subsidy for SC/ST/Small/Marginal/Women/NE farmers",
    amount: "40-50% subsidy for individual farmers (50-80% for SC/ST/Small/Marginal/NE). Up to ₹10 lakh for CHC establishment",
    howToApply: "Apply online at agrimachinery.nic.in → Select equipment → Upload documents → Approval → Purchase → Claim subsidy",
    website: "https://agrimachinery.nic.in",
    documents: ["Aadhaar", "Land Records", "Bank Account", "Quotation from dealer", "Caste certificate (if applicable)"],
  },
};

// ── MSP & Market Data ────────────────────────────────────────────────────────
export const MSP_DATA: Record<string, { crop: string; msp2024: number; msp2023: number; unit: string; season: string; costA2FL: number }> = {
  paddy_common: { crop: "Paddy (Common)", msp2024: 2300, msp2023: 2183, unit: "₹/quintal", season: "Kharif", costA2FL: 1455 },
  paddy_grade_a: { crop: "Paddy (Grade A)", msp2024: 2320, msp2023: 2203, unit: "₹/quintal", season: "Kharif", costA2FL: 1455 },
  jowar_hybrid: { crop: "Jowar (Hybrid)", msp2024: 3371, msp2023: 3180, unit: "₹/quintal", season: "Kharif", costA2FL: 2165 },
  bajra: { crop: "Bajra", msp2024: 2625, msp2023: 2500, unit: "₹/quintal", season: "Kharif", costA2FL: 1546 },
  ragi: { crop: "Ragi", msp2024: 4290, msp2023: 3846, unit: "₹/quintal", season: "Kharif", costA2FL: 2751 },
  maize: { crop: "Maize", msp2024: 2225, msp2023: 2090, unit: "₹/quintal", season: "Kharif", costA2FL: 1394 },
  tur: { crop: "Tur/Arhar", msp2024: 7550, msp2023: 7000, unit: "₹/quintal", season: "Kharif", costA2FL: 4573 },
  moong: { crop: "Moong", msp2024: 8682, msp2023: 8558, unit: "₹/quintal", season: "Kharif", costA2FL: 5765 },
  urad: { crop: "Urad", msp2024: 6950, msp2023: 6950, unit: "₹/quintal", season: "Kharif", costA2FL: 4298 },
  groundnut: { crop: "Groundnut", msp2024: 6783, msp2023: 6377, unit: "₹/quintal", season: "Kharif", costA2FL: 4195 },
  soybean_yellow: { crop: "Soybean (Yellow)", msp2024: 4892, msp2023: 4600, unit: "₹/quintal", season: "Kharif", costA2FL: 3261 },
  cotton_medium: { crop: "Cotton (Medium Staple)", msp2024: 7121, msp2023: 6620, unit: "₹/quintal", season: "Kharif", costA2FL: 4424 },
  cotton_long: { crop: "Cotton (Long Staple)", msp2024: 7521, msp2023: 7020, unit: "₹/quintal", season: "Kharif", costA2FL: 4424 },
  wheat: { crop: "Wheat", msp2024: 2275, msp2023: 2125, unit: "₹/quintal", season: "Rabi", costA2FL: 1128 },
  barley: { crop: "Barley", msp2024: 1850, msp2023: 1735, unit: "₹/quintal", season: "Rabi", costA2FL: 1082 },
  gram: { crop: "Gram (Chana)", msp2024: 5440, msp2023: 5335, unit: "₹/quintal", season: "Rabi", costA2FL: 3391 },
  masur: { crop: "Masur (Lentil)", msp2024: 6425, msp2023: 6000, unit: "₹/quintal", season: "Rabi", costA2FL: 3596 },
  mustard: { crop: "Rapeseed/Mustard", msp2024: 5650, msp2023: 5450, unit: "₹/quintal", season: "Rabi", costA2FL: 3140 },
  safflower: { crop: "Safflower", msp2024: 5800, msp2023: 5650, unit: "₹/quintal", season: "Rabi", costA2FL: 4038 },
  sugarcane: { crop: "Sugarcane", msp2024: 340, msp2023: 315, unit: "₹/quintal (FRP)", season: "Year-round", costA2FL: 185 },
};

// ── Crop Calendar ────────────────────────────────────────────────────────────
export const CROP_CALENDAR: Record<string, {
  crop: string; season: string; sowingWindow: string; harvestWindow: string;
  duration: string; regions: string; waterReq: string; idealTemp: string;
}> = {
  rice: { crop: "Rice (Paddy)", season: "Kharif", sowingWindow: "June-July (nursery: May-June)", harvestWindow: "October-November", duration: "120-150 days", regions: "Punjab, Haryana, UP, WB, AP, TN, Bihar", waterReq: "1200-1500 mm", idealTemp: "25-35°C" },
  wheat: { crop: "Wheat", season: "Rabi", sowingWindow: "October 25 - November 25 (North); November-December (Central)", harvestWindow: "March-April", duration: "120-150 days", regions: "Punjab, Haryana, UP, MP, Rajasthan, Bihar", waterReq: "450-650 mm (4-6 irrigations)", idealTemp: "15-25°C" },
  maize: { crop: "Maize", season: "Kharif/Rabi/Spring", sowingWindow: "Kharif: June-July; Rabi: October-November; Spring: January-February", harvestWindow: "Kharif: Sep-Oct; Rabi: Mar-Apr; Spring: May-Jun", duration: "90-120 days", regions: "Karnataka, Bihar, MP, Rajasthan, UP, AP", waterReq: "500-800 mm", idealTemp: "21-30°C" },
  cotton: { crop: "Cotton", season: "Kharif", sowingWindow: "April-May (irrigated); June-July (rainfed)", harvestWindow: "October-January (multiple pickings)", duration: "150-180 days", regions: "Gujarat, Maharashtra, Telangana, AP, Rajasthan, Punjab, Haryana", waterReq: "700-1200 mm (6-8 irrigations)", idealTemp: "25-35°C" },
  groundnut: { crop: "Groundnut", season: "Kharif/Rabi", sowingWindow: "Kharif: June-July; Rabi: November-December (in South)", harvestWindow: "Kharif: Oct-Nov; Rabi: Mar-Apr", duration: "100-130 days", regions: "Gujarat, Rajasthan, AP, TN, Karnataka, Maharashtra", waterReq: "500-700 mm", idealTemp: "25-30°C" },
  soybean: { crop: "Soybean", season: "Kharif", sowingWindow: "June 20 - July 10 (avoid late sowing)", harvestWindow: "October-November", duration: "90-120 days", regions: "MP, Maharashtra, Rajasthan, Karnataka", waterReq: "450-700 mm", idealTemp: "26-30°C" },
  mustard: { crop: "Mustard", season: "Rabi", sowingWindow: "October 15 - November 15", harvestWindow: "February-March", duration: "110-140 days", regions: "Rajasthan, UP, MP, Haryana, Gujarat, WB", waterReq: "250-400 mm (2-3 irrigations)", idealTemp: "15-25°C" },
  potato: { crop: "Potato", season: "Rabi", sowingWindow: "October (early); October 25 - November 15 (main); December-January (late/hills)", harvestWindow: "February-March", duration: "90-120 days", regions: "UP, WB, Bihar, Gujarat, MP, Punjab", waterReq: "500-700 mm (8-12 irrigations)", idealTemp: "15-22°C" },
  tomato: { crop: "Tomato", season: "Year-round", sowingWindow: "June-July (Kharif); Nov-Dec (Rabi); Jan-Feb (Spring/Summer)", harvestWindow: "60-90 days after transplanting", duration: "90-150 days", regions: "All India — AP, Karnataka, MP, Maharashtra, TN, UP", waterReq: "400-600 mm", idealTemp: "20-27°C" },
  onion: { crop: "Onion", season: "Kharif/Late Kharif/Rabi", sowingWindow: "Kharif: May-June; Late Kharif: Aug-Sep; Rabi: Nov-Dec (main)", harvestWindow: "Kharif: Oct-Nov; Rabi: Apr-May", duration: "130-150 days", regions: "Maharashtra, Karnataka, Gujarat, MP, Rajasthan, Bihar", waterReq: "350-550 mm", idealTemp: "15-25°C" },
  sugarcane: { crop: "Sugarcane", season: "Spring/Autumn", sowingWindow: "Spring: Feb-March; Autumn: Oct-Nov (subtropical). Year-round (tropical)", harvestWindow: "12-18 months after planting", duration: "12-18 months", regions: "UP, Maharashtra, Karnataka, TN, Gujarat, Bihar", waterReq: "1500-2500 mm", idealTemp: "27-38°C" },
  chilli: { crop: "Chilli", season: "Kharif/Rabi", sowingWindow: "Nursery: May-June (Kharif); Sep-Oct (Rabi). Transplant 30-40 days later", harvestWindow: "Green: 60-70 DAT; Dry: 90-120 DAT", duration: "120-150 days", regions: "AP, Telangana, Karnataka, Maharashtra, MP, Rajasthan", waterReq: "600-1250 mm", idealTemp: "20-30°C" },
};

// ── Fertilizer & Soil Guide ──────────────────────────────────────────────────
export const FERTILIZER_GUIDE: Record<string, {
  crop: string; nPerHa: number; pPerHa: number; kPerHa: number;
  schedule: string; organicAlt: string; micronutrients: string;
}> = {
  rice: { crop: "Rice", nPerHa: 120, pPerHa: 60, kPerHa: 60, schedule: "Basal: 50% P + 100% K + 25% N at transplanting. 1st top-dress: 25% N at 21 DAT (tillering). 2nd top-dress: 25% N at 42 DAT. 3rd top-dress: 25% N at panicle initiation", organicAlt: "FYM 10 t/ha + Vermicompost 2 t/ha + Azolla (dual cropping) + PSB 5 kg/ha", micronutrients: "ZnSO4 25 kg/ha (basal). If deficient: FeSO4 20 kg/ha spray (0.5% solution)" },
  wheat: { crop: "Wheat", nPerHa: 150, pPerHa: 60, kPerHa: 40, schedule: "Basal: 50% N + 100% P + 100% K at sowing. 1st top-dress: 25% N at CRI (21 DAS). 2nd top-dress: 25% N at booting/heading", organicAlt: "FYM 10 t/ha + Vermicompost 2.5 t/ha + Azotobacter 5 kg/ha + PSB 5 kg/ha seed treatment", micronutrients: "ZnSO4 25 kg/ha basal. MnSO4 5 kg/ha if pH > 8. Foliar spray: 0.5% ZnSO4 + 2.5% Urea at tillering" },
  cotton: { crop: "Cotton", nPerHa: 150, pPerHa: 60, kPerHa: 60, schedule: "Basal: 100% P + 50% K + 10% N. 30 DAS: 25% N + 25% K. 60 DAS: 25% N + 25% K. 90 DAS: 25% N. Flowering: 15% N foliar if needed", organicAlt: "FYM 12 t/ha + Neem cake 500 kg/ha + Azospirillum 5 kg/ha + PSB 5 kg/ha", micronutrients: "Borax 10 kg/ha + MgSO4 25 kg/ha basal. Foliar: 0.2% Boron at squaring + 1% MgSO4 at flowering" },
  tomato: { crop: "Tomato", nPerHa: 200, pPerHa: 100, kPerHa: 150, schedule: "Basal: 50% N + 100% P + 50% K at transplanting. 1st top-dress: 25% N + 25% K at 30 DAT. 2nd top-dress: 25% N + 25% K at flowering/fruiting", organicAlt: "FYM 25 t/ha + Vermicompost 5 t/ha + Neem cake 1 t/ha + Panchagavya spray every 15 days", micronutrients: "Borax 10 kg/ha + CaSO4 500 kg/ha basal. Foliar: 0.2% Boron + 0.5% CaCl2 at flowering (prevents BER)" },
  potato: { crop: "Potato", nPerHa: 180, pPerHa: 80, kPerHa: 100, schedule: "Basal: 50% N + 100% P + 50% K at planting. 1st top-dress: 25% N + 25% K at 30 DAP (earthing up). 2nd top-dress: 25% N + 25% K at 45 DAP", organicAlt: "FYM 20 t/ha + Vermicompost 3 t/ha + PSB 5 kg/ha + Trichoderma 2.5 kg/ha for soil treatment", micronutrients: "ZnSO4 25 kg/ha + MgSO4 25 kg/ha basal. Foliar: 0.5% ZnSO4 + 1% KNO3 at tuber initiation" },
};

// ── Soil Types of India ──────────────────────────────────────────────────────
export const SOIL_TYPES: Record<string, {
  name: string; regions: string; characteristics: string; bestCrops: string;
  phRange: string; amendments: string;
}> = {
  alluvial: { name: "Alluvial Soil", regions: "Indo-Gangetic Plains (UP, Bihar, Punjab, Haryana, WB), River deltas", characteristics: "Rich in potash, deficient in phosphorus and nitrogen. Sandy loam to clay loam texture. Well-drained, fertile", bestCrops: "Rice, wheat, sugarcane, maize, pulses, oilseeds, vegetables, fruits", phRange: "6.5-8.5", amendments: "Add phosphatic fertilizers (DAP/SSP). FYM/compost for nitrogen. Green manuring with Dhaincha/Sesbania" },
  black: { name: "Black Soil (Regur)", regions: "Deccan Plateau (Maharashtra, MP, Gujarat, Karnataka, AP, Telangana)", characteristics: "High clay content, swells when wet, cracks when dry. Rich in calcium, magnesium, potash. Self-ploughing. Moisture-retentive. Deficient in nitrogen, phosphorus, organic matter", bestCrops: "Cotton, soybean, jowar, wheat, gram, sunflower, sugarcane", phRange: "7.2-8.5", amendments: "Gypsum for improving soil structure. Organic matter (FYM 10-15 t/ha). Phosphatic fertilizers. Avoid waterlogging" },
  red: { name: "Red Soil", regions: "Eastern & Southern Plateau (TN, Karnataka, Odisha, Chhattisgarh, parts of AP, WB)", characteristics: "Red color from iron oxide. Sandy to clay texture. Porous, friable. Deficient in nitrogen, phosphorus, humus, lime", bestCrops: "Millets (ragi, bajra), groundnut, tobacco, rice, pulses, potato", phRange: "5.5-7.0 (acidic to neutral)", amendments: "Lime application for acidic soils. Heavy doses of FYM/compost. Green manuring. Phosphatic fertilizers. Mulching to retain moisture" },
  laterite: { name: "Laterite Soil", regions: "Western Ghats, Eastern Ghats, parts of Kerala, Karnataka, TN, WB, Odisha", characteristics: "Rich in iron and aluminium oxides. Poor in nitrogen, phosphorus, potassium, calcium, magnesium. Acidic. Hardens when exposed", bestCrops: "Cashew, rubber, tea, coffee, coconut, rice, ragi, arecanut", phRange: "5.0-6.5 (acidic)", amendments: "Heavy liming. Organic manure (FYM 15-20 t/ha). Green manuring. Rock phosphate. Mulching" },
  arid: { name: "Arid/Desert Soil", regions: "Rajasthan, parts of Gujarat, Haryana, Punjab (western)", characteristics: "Sandy, low organic matter, low moisture-holding. Rich in phosphate, deficient in nitrogen. High soil temperature", bestCrops: "Bajra, guar, moth bean, cluster bean, cumin, mustard, date palm", phRange: "7.5-9.0 (alkaline)", amendments: "Gypsum for alkali correction. Organic matter. Drip irrigation essential. Mulching. Wind breaks" },
  mountain: { name: "Mountain/Forest Soil", regions: "Himalayan region, Western Ghats slopes, NE India", characteristics: "Rich in humus/organic matter. Acidic. Varies from sandy loam to silty clay. Good structure", bestCrops: "Tea, coffee, spices (cardamom, pepper), fruits (apple, pear, plum), rice (terrace)", phRange: "5.0-6.5 (acidic)", amendments: "Lime if too acidic. Terrace farming for erosion control. Mulching. Contour bunding" },
};

// ── Livestock Database ───────────────────────────────────────────────────────
export const LIVESTOCK_DB: Record<string, {
  type: string; breed: string; origin: string; characteristics: string;
  milkYield?: string; meatYield?: string; eggYield?: string; feedRequirement: string;
}> = {
  gir: { type: "Dairy Cattle", breed: "Gir", origin: "Gujarat (Gir forest)", characteristics: "Distinctive curved horns, red-spotted white body. Heat tolerant, tick resistant. A2 milk protein", milkYield: "8-12 liters/day (up to 20L in peak). Lactation: 300-320 days. Fat: 4.5-5.0%", feedRequirement: "Green fodder: 25-30 kg/day + Dry fodder: 5-6 kg + Concentrate: 3-4 kg (1 kg per 2.5L milk)" },
  sahiwal: { type: "Dairy Cattle", breed: "Sahiwal", origin: "Punjab/Rajasthan (Montgomery district)", characteristics: "Brownish-red, loose skin. Best indigenous dairy breed. Heat tolerant, docile", milkYield: "10-16 liters/day. Lactation: 300-305 days. Fat: 4.5%. Total lactation: 2000-3000L", feedRequirement: "Green fodder: 30 kg/day + Dry fodder: 5 kg + Concentrate: 4 kg" },
  murrah: { type: "Dairy Buffalo", breed: "Murrah", origin: "Haryana/Punjab (Hisar, Rohtak)", characteristics: "Jet black, tightly curled horns. Highest milk yielding buffalo breed. Wall eyes", milkYield: "12-20 liters/day. Lactation: 305 days. Fat: 7-8%. Total lactation: 1800-2500L", feedRequirement: "Green fodder: 35-40 kg/day + Dry fodder: 8-10 kg + Concentrate: 4-5 kg (1 kg per 2L milk)" },
  kadaknath: { type: "Poultry", breed: "Kadaknath", origin: "MP (Jhabua, Dhar, Alirajpur)", characteristics: "Black-feathered, black meat, black bones. Low cholesterol, high protein, medicinal value. Premium pricing", eggYield: "80-100 eggs/year. Egg weight: 45-50g", feedRequirement: "Starter: 50g/day (0-6 weeks). Grower: 80g/day (6-20 weeks). Layer: 110-120g/day. Free-range supplement: 30%" },
};

// ── Organic Farming Recipes ──────────────────────────────────────────────────
export const ORGANIC_RECIPES: Record<string, {
  name: string; ingredients: string; preparation: string; application: string;
  benefits: string; frequency: string;
}> = {
  jeevamrut: { name: "Jeevamrut (Liquid Biofertilizer)", ingredients: "200L water + 10 kg fresh cow dung + 10L cow urine + 2 kg jaggery (gud) + 2 kg pulse flour (besan) + handful of soil from under a tree (original farm soil)", preparation: "Mix all ingredients in a 200L drum. Stir clockwise daily for 5 minutes. Keep covered with cloth (not airtight). Ready in 5-7 days when it develops a whitish layer. Use within 7 days of preparation", application: "Drench: Dilute 10L Jeevamrut in 200L water per acre via irrigation. Foliar spray: 5% solution (10L in 200L) every 15 days. Seed treatment: Soak seeds for 30 minutes before sowing", benefits: "Introduces billions of beneficial microorganisms. Enhances soil biology. Improves nutrient availability. Stimulates root growth. Increases microbial biomass in soil 10x within 30 days", frequency: "Every 15 days during crop growth. Reduce to monthly after crop establishment" },
  panchagavya: { name: "Panchagavya (5 Cow Products)", ingredients: "5L fresh cow milk + 3L cow curd + 2L cow ghee + 3L cow urine + 5 kg fresh cow dung + 3L sugarcane juice + 3L tender coconut water + 12 ripe bananas + 2L toddy (or grape juice)", preparation: "Step 1: Mix cow dung + cow ghee, ferment 3 days. Step 2: Add remaining ingredients, stir twice daily. Step 3: Ready in 15-18 days. Smells like country liquor when ready. Filter before use", application: "Foliar spray: 3% solution (3L in 100L water) every 15 days. Seed treatment: 3% solution soak 20 min. Soil drench: 5% solution. Drip: 5L/acre every month", benefits: "Growth promoter + pest repellent. Contains growth hormones (IAA, GA), beneficial microbes. Improves flowering, fruiting. Enhances natural immunity of plants", frequency: "Foliar: Every 15 days. Pre-bloom: 2 sprays at 10-day interval for better fruit set" },
  dashagavya: { name: "Dashagavya (10-Ingredient Bio-formulation)", ingredients: "All Panchagavya ingredients + Neem leaves extract 2L + Vitex (Nirgundi) leaves extract 2L + Ginger-garlic-chilli paste 500g + Asafoetida (hing) 200g + Lemon juice 1L", preparation: "Prepare base Panchagavya (15 days). Add remaining ingredients on Day 16. Ferment 5 more days. Filter and store in shade. Shelf life: 6 months in cool place", application: "Foliar: 2% solution every 15 days. Soil drench: 3% solution monthly", benefits: "All Panchagavya benefits + pest repellent action from neem, Vitex, ginger-garlic-chilli. Dual action: nutrition + pest management", frequency: "Every 15 days, alternating with Jeevamrut for best results" },
};

// ── Irrigation Critical Stages ───────────────────────────────────────────────
export const IRRIGATION_STAGES: Record<string, {
  crop: string; criticalStages: string[]; totalIrrigations: string; method: string; waterPerIrrigation: string;
}> = {
  wheat: { crop: "Wheat", criticalStages: ["CRI - Crown Root Initiation (21 DAS) — MOST CRITICAL", "Tillering (40-45 DAS)", "Late Jointing (60-65 DAS)", "Flowering (80-85 DAS)", "Milk Stage (95-100 DAS)", "Dough Stage (110-115 DAS)"], totalIrrigations: "4-6 irrigations depending on soil type and rainfall", method: "Flood (border strip) or Sprinkler. Drip not common for wheat", waterPerIrrigation: "60-70 mm per irrigation (600-700 m³/ha)" },
  rice: { crop: "Rice (Paddy)", criticalStages: ["Transplanting — maintain 2-3 cm standing water", "Tillering (20-25 DAT) — 5 cm standing water for max tillers", "Panicle Initiation (50-55 DAT) — CRITICAL, no moisture stress", "Flowering (70-75 DAT) — MOST CRITICAL, 5 cm standing water", "Grain Filling (85-95 DAT) — 3-5 cm water", "Drain 10-15 days before harvest"], totalIrrigations: "Continuous flooding or AWD (Alternate Wetting and Drying)", method: "Puddled field with continuous flooding. SRI: AWD saves 30-40% water", waterPerIrrigation: "50 mm per cycle in AWD. Total: 1200-1500 mm season" },
  potato: { crop: "Potato", criticalStages: ["Planting — light irrigation immediately", "Stolon Formation (20-25 DAP) — CRITICAL", "Tuber Initiation (30-35 DAP) — MOST CRITICAL", "Tuber Bulking (45-65 DAP) — maintain consistent moisture", "Tuber Maturation (75-90 DAP) — reduce irrigation", "Stop irrigation 10 days before harvest"], totalIrrigations: "8-12 irrigations at 7-10 day intervals", method: "Furrow irrigation (most common) or Drip (most efficient, 30-40% water saving)", waterPerIrrigation: "40-50 mm per irrigation in furrow. 15-20 mm in drip" },
  tomato: { crop: "Tomato", criticalStages: ["Transplanting — immediate irrigation", "Flowering (30-40 DAT) — CRITICAL, no water stress", "Fruit Set (40-55 DAT) — MOST CRITICAL", "Fruit Development (55-80 DAT) — consistent moisture", "Avoid overwatering during ripening — reduces flavor, causes cracking"], totalIrrigations: "Drip: daily/alternate day. Furrow: every 5-7 days", method: "Drip irrigation (BEST — prevents foliar diseases). Mulching + Drip saves 40-60% water", waterPerIrrigation: "3-5 liters/plant/day via drip. 40-50 mm per furrow irrigation" },
};

// ── Pest IPM Database ────────────────────────────────────────────────────────
export const PEST_IPM_DB: Record<string, {
  pest: string; crops: string; identification: string; etl: string;
  biologicalControl: string; chemicalControl: string; sprayTiming: string;
}> = {
  aphids: { pest: "Aphids (Aphis spp.)", crops: "Mustard, wheat, vegetables, pulses, cotton", identification: "Small (1-3mm) soft-bodied insects, green/yellow/black. Found on undersides of leaves, young shoots. Cause curling, yellowing, honeydew secretion + sooty mold", etl: "50-100 aphids per plant or 10% plants infested", biologicalControl: "Release ladybird beetles (Coccinella septempunctata) @ 1000/ha. Lacewing (Chrysoperla carnea) @ 10,000 eggs/ha. Parasitoid: Aphidius colemani. Neem oil 5ml/L spray", chemicalControl: "Imidacloprid 17.8% SL @ 0.5 ml/L (systemic). Thiamethoxam 25% WG @ 0.3 g/L. Dimethoate 30% EC @ 1.7 ml/L. Acetamiprid 20% SP @ 0.3 g/L", sprayTiming: "Early morning or late evening. Repeat after 10-15 days if needed. PHI: Imidacloprid 40 days, Dimethoate 21 days" },
  bollworm: { pest: "American Bollworm (Helicoverpa armigera)", crops: "Cotton, tomato, chickpea, pigeonpea, chilli, okra", identification: "Caterpillar (30-40mm), greenish-brown with lateral stripes. Bores into bolls/fruits/pods. Most destructive pest in India. ₹10,000 crore annual losses", etl: "1 larva per plant (cotton). 1 larva per meter row (chickpea). 5% fruit damage (tomato)", biologicalControl: "Trichogramma chilonis @ 1.5 lakh/ha (3 releases at 7-day interval). NPV (HaNPV) @ 250 LE/ha. Bt spray (Dipel 8L) @ 1 kg/ha. Pheromone traps (Helilure) @ 5/ha for monitoring", chemicalControl: "Spinosad 45% SC @ 0.3 ml/L (safest). Emamectin benzoate 5% SG @ 0.4 g/L. Chlorantraniliprole 18.5% SC @ 0.3 ml/L. Indoxacarb 14.5% SC @ 0.5 ml/L. AVOID pyrethroids (resistance)", sprayTiming: "At 5% boll/fruit damage. Evening spray for better efficacy. Rotate chemistry. PHI: Spinosad 7 days, Emamectin 14 days" },
  whitefly: { pest: "Whitefly (Bemisia tabaci)", crops: "Cotton, tomato, chilli, brinjal, okra, tobacco, pulses", identification: "Tiny (1mm) white-winged insects on leaf undersides. Heavy honeydew/sooty mold. Vector for TYLCV (Tomato Yellow Leaf Curl Virus), CLCuV (Cotton Leaf Curl Virus)", etl: "5-10 adults per leaf (cotton). 10 adults per plant (tomato). ANY presence in virus-prone areas = act immediately", biologicalControl: "Encarsia formosa parasitoid @ 5000/ha. Chrysoperla carnea @ 10,000/ha. Yellow sticky traps @ 12-15/ha. Neem oil 5 ml/L + Neem seed extract 5%. Reflective silver mulch reduces 50% landing", chemicalControl: "Pyriproxyfen 10% EC @ 1 ml/L (IGR, very effective). Buprofezin 25% SC @ 1.5 ml/L. Diafenthiuron 50% WP @ 1 g/L. Spiromesifen 22.9% SC @ 0.7 ml/L. Avoid neonicotinoids for resistance management", sprayTiming: "Early morning when adults are sluggish. Target undersides of leaves. Use high volume (500L/ha). PHI: Pyriproxyfen 14 days" },
  stemBorer: { pest: "Stem Borer (Scirpophaga incertulas / Chilo partellus)", crops: "Rice (Yellow Stem Borer), Maize/Sorghum (Chilo), Sugarcane (Chilo)", identification: "Dead heart (vegetative stage) — central leaf dries. White ear (reproductive) — chaffy panicles. Larvae bore into stems, pupate inside", etl: "5% Dead Heart or 2% White Ear", biologicalControl: "Trichogramma japonicum @ 50,000/ha (rice) at egg stage. Light traps @ 1/ha to attract moths. Egg parasitoid: Telenomus spp. Remove and destroy dead hearts manually", chemicalControl: "Cartap hydrochloride 4G @ 25 kg/ha in paddy water. Chlorantraniliprole 0.4% GR @ 10 kg/ha. Fipronil 0.3% GR @ 25 kg/ha. For spray: Chlorantraniliprole 18.5% SC @ 0.3 ml/L", sprayTiming: "Apply granules at 20-25 DAT (early infestation). Spray at moth emergence peak. Use pheromone traps for monitoring timing" },
};

// ── Seed Variety Database (ICAR Released) ────────────────────────────────────
export const SEED_VARIETIES: Record<string, {
  crop: string; varieties: Array<{ name: string; released: string; duration: string; yield: string; features: string; states: string }>;
}> = {
  wheat: {
    crop: "Wheat",
    varieties: [
      { name: "HD-3226 (Pusa Yashasvi)", released: "2020", duration: "145 days", yield: "62-65 q/ha", features: "High yielding, resistant to yellow rust + brown rust + leaf blight. Bread wheat", states: "Punjab, Haryana, Rajasthan, UP (NWPZ)" },
      { name: "DBW-187 (Karan Vandana)", released: "2019", duration: "143 days", yield: "58-62 q/ha", features: "Irrigated timely sown. Good chapati quality. Resistant to rusts", states: "UP, Bihar, WB, Jharkhand (NEPZ)" },
      { name: "HI-1634 (Pusa Malvi)", released: "2021", duration: "118 days", yield: "45-50 q/ha", features: "Restricted irrigation (3 irrigations). Drought tolerant. Good for limited water areas", states: "MP, Gujarat, Rajasthan (CZ)" },
    ]
  },
  rice: {
    crop: "Rice",
    varieties: [
      { name: "Pusa Basmati 1847", released: "2021", duration: "135 days", yield: "50-55 q/ha", features: "Bacterial Blight resistant. Long slender grain. Aroma. Replaces PB-1121 in BB-prone areas", states: "Punjab, Haryana, UP, Uttarakhand" },
      { name: "DRR Dhan 50 (Samba Masuri improved)", released: "2018", duration: "145 days", yield: "55-60 q/ha", features: "BPH resistant. Fine grain. Good cooking quality. Replaces old Samba Masuri", states: "AP, Telangana, Karnataka, TN" },
      { name: "CR Dhan 801 (Sahbhagi Dhan)", released: "2018", duration: "110 days", yield: "40-45 q/ha", features: "Drought tolerant (rainfed upland). Direct-seeded rice compatible. Saving 30% water", states: "Odisha, Jharkhand, Chhattisgarh, WB (Eastern India)" },
    ]
  },
  tomato: {
    crop: "Tomato",
    varieties: [
      { name: "Pusa Rohini", released: "IARI", duration: "120-140 days", yield: "300-400 q/ha", features: "Determinate. TLCV tolerant. Firm fruits. Good shelf life. Suitable for fresh market + processing", states: "All India" },
      { name: "Arka Rakshak (F1 Hybrid)", released: "IIHR Bangalore", duration: "140 days", yield: "750-800 q/ha", features: "Triple disease resistant (ToLCV + Bacterial Wilt + Early Blight). Large firm fruits (90-100g). Best hybrid for open field", states: "All India, especially South & Western India" },
      { name: "Arka Samrat (F1 Hybrid)", released: "IIHR", duration: "140 days", yield: "800-900 q/ha", features: "Triple resistant. Square round fruits. Excellent shelf life (25-30 days). Processing + fresh", states: "All India" },
    ]
  },
};

// ── Agroforestry Models ──────────────────────────────────────────────────────
export const AGROFORESTRY_MODELS: Record<string, {
  model: string; trees: string; crops: string; spacing: string;
  economics: string; benefits: string; regions: string;
}> = {
  boundary: { model: "Boundary Plantation", trees: "Teak, Eucalyptus, Poplar, Neem, Subabul, Melia dubia", crops: "Any field crop (no interference)", spacing: "Trees at 3-5m on bunds/boundaries. Single/double row", economics: "Additional income ₹50,000-2,00,000/acre after 5-15 years. No loss to crop area", benefits: "Windbreak, boundary marking, timber income, carbon credits, increased property value", regions: "All India — species selection varies by zone" },
  alley: { model: "Alley Cropping", trees: "Subabul, Gliricidia, Melia dubia, Poplar (North), Casuarina (South)", crops: "Turmeric, ginger, vegetables, pulses, fodder crops between alleys", spacing: "Trees in rows 8-10m apart, crops in alleys. 200-300 trees/acre", economics: "Crop income + timber after 5-8 years. Leaf mulch saves ₹5,000-10,000/acre on fertilizer", benefits: "Nutrient recycling (N-fixation for leguminous trees), moisture conservation, microclimate moderation, soil erosion control", regions: "Semi-arid and dryland areas — Rajasthan, MP, Maharashtra, Karnataka" },
};

// ── Aquaculture Database ─────────────────────────────────────────────────────
export const AQUACULTURE_DB: Record<string, {
  species: string; type: string; pondSize: string; stockingDensity: string;
  feedManagement: string; harvestTime: string; expectedYield: string; economics: string;
}> = {
  rohu: { species: "Rohu (Labeo rohita)", type: "Indian Major Carp — Composite Fish Culture", pondSize: "0.5-2 hectare, depth 1.5-2m. Rectangular preferred", stockingDensity: "8,000-10,000 fingerlings/ha in composite culture (Rohu 40% + Catla 30% + Mrigal 30%)", feedManagement: "Supplementary feed: Rice bran + Groundnut oil cake (1:1) @ 3-5% body weight. Feed twice daily. FCR: 2.5-3.0", harvestTime: "12-18 months. Market size: 800-1200g", expectedYield: "3,000-5,000 kg/ha/year in composite culture", economics: "Investment: ₹1.5-2.5 lakh/ha. Revenue: ₹3-6 lakh/ha. Profit: ₹1-3 lakh/ha/year" },
  vannamei: { species: "Pacific White Shrimp (L. vannamei)", type: "Brackishwater Shrimp Farming", pondSize: "0.5-1 ha, depth 1.2-1.5m. HDPE lined. Aerated", stockingDensity: "30-60 PL/m² (intensive). 15-30 PL/m² (semi-intensive)", feedManagement: "Commercial pelleted feed. FCR: 1.4-1.8. Feed 4-5 times/day. Use feed trays for monitoring. Reduce at low DO", harvestTime: "90-120 days. Harvest size: 20-30g (30-50 count)", expectedYield: "8,000-15,000 kg/ha/crop (2-3 crops/year possible)", economics: "Investment: ₹8-15 lakh/ha/crop. Revenue: ₹15-30 lakh/ha/crop. High risk — disease (WSD, EMS) is major threat" },
};

// ── Farm Finance Data ────────────────────────────────────────────────────────
export const FARM_FINANCE_DB = {
  kccInterestRates: {
    shortTerm: "7% p.a. (bank rate). With prompt repayment: 3% GOI subvention + 2% state subvention (some states) = effective 2-4%",
    mediumTerm: "9-11% p.a. for allied activities (dairy, poultry, fishery)",
    limit: "Up to ₹3 lakh at subsidized rate. Above ₹3 lakh at normal bank rate. Max limit reviewed every 5 years based on Scale of Finance",
    renewal: "Annual review. 5-year card validity. Enhancement: 10% increase each year for crop needs",
  },
  cropBudgetPerAcre: {
    wheat: { seeds: 2500, fertilizer: 4500, irrigation: 3000, pesticides: 1500, labor: 5000, misc: 1500, total: 18000, expectedRevenue: 35000, profit: 17000 },
    rice: { seeds: 2000, fertilizer: 5000, irrigation: 4000, pesticides: 2000, labor: 8000, misc: 2000, total: 23000, expectedRevenue: 42000, profit: 19000 },
    cotton: { seeds: 3500, fertilizer: 6000, irrigation: 5000, pesticides: 5000, labor: 10000, misc: 2500, total: 32000, expectedRevenue: 50000, profit: 18000 },
    tomato: { seeds: 4000, fertilizer: 8000, irrigation: 6000, pesticides: 5000, labor: 15000, misc: 4000, total: 42000, expectedRevenue: 100000, profit: 58000 },
  },
};

// ── Disaster & Contingency Plans ─────────────────────────────────────────────
export const DISASTER_CONTINGENCY: Record<string, {
  disaster: string; preparedness: string; duringDisaster: string;
  postDisaster: string; contingencyCrops: string; insurance: string;
}> = {
  flood: { disaster: "Flood / Waterlogging", preparedness: "Raise nursery beds. Pre-position seed stocks. Clean drainage channels. Ensure PMFBY enrollment. Store inputs at elevated locations", duringDisaster: "Do NOT enter floodwater in fields. Document damage (photos, GPS). Contact Block Agriculture Officer within 72 hours. Report on PMFBY app", postDisaster: "Drain fields ASAP. Apply Bleaching powder 10 kg/ha to prevent root rot. Re-transplant if possible. Apply Urea 20 kg/ha as foliar (2% solution). Salvage operations within 15 days", contingencyCrops: "Short-duration rice (Sahbhagi, CR Dhan 801). Toria (45-day mustard). Green gram (60-day). Fodder crops (oats, berseem) if season advanced", insurance: "File PMFBY claim within 72 hours of calamity. Intimation via: PMFBY app, CSC, bank, insurance company toll-free number. Documents: damage photos, land records, sowing certificate" },
  drought: { disaster: "Drought / Moisture Stress", preparedness: "Mulching (5-8 cm). Life-saving irrigation at critical stages. Antitranspirant spray (Kaolin 6%). Conservation furrows. Contingency seed stock", duringDisaster: "Prioritize water to most critical stage crops. Skip non-critical irrigations. Foliar spray KCl 1% for osmotic adjustment. Avoid fertilizer application during severe stress. Harvest rain in farm ponds", postDisaster: "Light irrigation to revive crops. Urea spray 2% for recovery. If crop lost: plant contingency crops. Apply for drought relief from district administration", contingencyCrops: "Bajra (HHB-67), Castor, Moth bean, Cluster bean, Guar, Short-duration pulses. Rainfed fallback crops depending on remaining season", insurance: "PMFBY covers drought (yield loss). Restructured weather-based crop insurance (RWBCIS) available in some areas. Contact PMFBY helpline: 1800-180-1551" },
};

// ── Export all knowledge bases ───────────────────────────────────────────────
export const ALL_KNOWLEDGE = {
  schemes: GOVT_SCHEMES_KB,
  msp: MSP_DATA,
  cropCalendar: CROP_CALENDAR,
  fertilizer: FERTILIZER_GUIDE,
  soilTypes: SOIL_TYPES,
  livestock: LIVESTOCK_DB,
  organicRecipes: ORGANIC_RECIPES,
  irrigationStages: IRRIGATION_STAGES,
  pestIPM: PEST_IPM_DB,
  seedVarieties: SEED_VARIETIES,
  agroforestry: AGROFORESTRY_MODELS,
  aquaculture: AQUACULTURE_DB,
  farmFinance: FARM_FINANCE_DB,
  disasterContingency: DISASTER_CONTINGENCY,
};
