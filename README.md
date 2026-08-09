# AgriNova 🌾

**AI-Powered Hyper-Local Climate Intelligence & Precision Agriculture Decision Support Platform**

AgriNova is a comprehensive agricultural technology platform that combines real-time weather intelligence, AI-powered crop advisory, disease detection, satellite-based vegetation analysis, and a 25-agent conversational AI system to help Indian farmers make data-driven decisions.

## Problem

Indian farmers face compounding challenges:
- **Unpredictable climate** — Erratic monsoons, droughts, floods, and heat waves
- **Information asymmetry** — Limited access to expert agronomic advice
- **Disease outbreaks** — Late detection leads to crop loss
- **Market volatility** — Inability to time sales for maximum profit
- **Resource waste** — Over-irrigation, excess fertilizer, poor soil management

## Solution

AgriNova provides farmers with an intelligent copilot that integrates:
1. **Real-time weather intelligence** via Open-Meteo API
2. **25-agent conversational AI** system powered by Llama 3.3 70B (via Groq)
3. **Disease detection pipeline** using TensorFlow/Keras (PlantVillage 38-class)
4. **Satellite vegetation analysis** (NDVI computation from Sentinel-2)
5. **Rule-based soil & fertilizer recommendations** grounded in ICAR guidelines
6. **Multilingual voice assistant** (English, Hindi, Malayalam) via Whisper + Edge TTS

## Target Users

- Smallholder farmers across India's 15 agro-climatic zones
- Agricultural extension officers
- Farm cooperatives (FPOs)

## Architecture

                        AGRINOVA
                           │
                    Next.js Frontend
                    (Vercel Deployed)
                           │
              ┌────────────┼────────────┐
              │            │            │
         API Routes    Static Pages   Components
         (Next.js)                   (33 Modules)
              │
              ├─── /api/chat ──────────► 25-Agent System
              │                          (agentSystem.ts)
              │                              │
              │                    ┌─────────┼─────────┐
              │                    │         │         │
              │               Orchestrator  Tools  Knowledge
              │                    │         │      (40K KB)
              │                    ▼         ▼
              │               Groq LLM   ML Backend
              │              (Llama 3.3)     │
              │                              │
              ├─── /api/satellite ──────► FastAPI Backend
              │                          (Python/uvicorn)
              ├─── /api/news ───────────► Groq LLM
              ├─── /api/transcribe ─────► Groq Whisper
              ├─── /api/tts ────────────► Edge TTS
              │
              └─── Open-Meteo API (Weather — no key needed)
```

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for full details.

---

## AI Architecture

### 25-Agent Multi-Agent System

AgriNova implements a real multi-agent architecture (not a chatbot):

| Layer | Component | Function |
|---|---|---|
| **Orchestrator** | Intent Classifier | Routes queries to specialist agents via keyword scoring |
| **Reasoning** | Context Builder | Builds conversation memory, extracts farm profile |
| **Specialists** | 20 Domain Agents | Crop, Disease, Soil, Weather, Market, Schemes, Livestock, Organic, Post-Harvest, Irrigation, Pest IPM, Seed, Mechanization, Horticulture, Pollination, Agroforestry, Aquaculture, Disaster, Finance, Biotech |
| **Tools** | 40+ Functions | getCropRecommendation, getWeatherData, getMSPRates, getDiseaseInfo, getSoilTypeInfo, etc. |
| **Knowledge** | 40K+ tokens | ICAR guidelines, MSP rates, government schemes, crop calendars, soil types |
| **Validator** | Response QA | Validates agent output before returning |

See [docs/AGENT_ARCHITECTURE.md](docs/AGENT_ARCHITECTURE.md) for full details.

### ML Models

| Model | Purpose | Dataset | Status |
|---|---|---|---|
| Disease Classifier | 38-class plant disease detection | PlantVillage (54K images) | Code complete (requires `.keras` weights to run) |
| MobileNetV2 | Non-plant image rejection filter | ImageNet | LIVE — Pre-trained weights |
| Crop Recommender | NPK/pH-based crop suggestion | Rule-based | LIVE — Deterministic rules |

See [docs/ML_DOCUMENTATION.md](docs/ML_DOCUMENTATION.md) for full details.

---

## Feature Status

### 🟢 LIVE & AUTHENTICATED
| Feature | Technology | Evidence |
|---|---|---|
| Weather Intelligence | Open-Meteo API | Real-time data, no API key needed |
| Farm Assistant (Chat) | Groq + Llama 3.3 70B | 25-agent routing, real LLM responses |
| Voice Transcription | Groq Whisper v3 | Real speech-to-text |
| Text-to-Speech | Edge TTS | Real voice synthesis |
| Crop Recommendation | Rule-based (NPK/pH/weather) | Deterministic, explainable |
| Soil Analysis | Rule-based (ICAR guidelines) | Deterministic, explainable |
| News Generation | Groq LLM | AI-generated agricultural news |
| Authentication | Supabase | Strict 401 error enforcement |
| CI/CD | GitHub Actions | Automated Linting & Build Verification |

### 🟡 REQUIRES CREDENTIALS / WEIGHTS
*(These features are fully built and programmed defensively. They will legitimately fail with 503 errors if credentials or weights are missing, rather than injecting fake data)*
| Feature | Requirements to Run |
|---|---|
| Satellite/NDVI | Requires active `SENTINEL_HUB_CLIENT_ID` and `SENTINEL_HUB_CLIENT_SECRET` |
| Disease Detection | Requires trained `.keras` weights placed in `ml-backend/disease_model` |
| Database Ops | Requires active `NEXT_PUBLIC_SUPABASE_URL` |

### 🔴 DEMO/SIMULATED (UI ONLY)
| Feature | Status |
|---|---|
| Digital Twin | UI visualization only |
| Drone Operations | UI simulation |
| GIS Dashboard | Static visualization |
| Finance Tracking | Client-side computed |
| Carbon Credits | Static estimates |
| Flood/Drought Prediction | Rule-based indicators |

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 15 (App Router), React 19, TypeScript |
| **Styling** | Vanilla CSS, Lucide React icons |
| **Backend** | FastAPI (Python), uvicorn |
| **AI/LLM** | Groq Cloud (Llama 3.3 70B, Whisper v3) |
| **ML** | TensorFlow/Keras, MobileNetV2 |
| **Weather** | Open-Meteo API (free, no key) |
| **Voice** | Edge TTS, Groq Whisper |
| **Database** | Supabase |
| **Deployment** | Vercel (frontend), local (backend) |

---

## Installation

### Prerequisites
- Node.js 18+
- Python 3.10+
- npm or yarn

### Frontend Setup
```bash
git clone https://github.com/harikrishnanudt877-art/7.2.git
cd 7.2
npm install
cp .env.example .env.local
# Edit .env.local with your API keys
npm run dev
```

### Backend Setup
```bash
cd ml-backend
pip install -r requirements.txt
python main.py
# FastAPI runs on http://localhost:8000
# Swagger docs at http://localhost:8000/docs
```

## Environment Variables

See [.env.example](.env.example) for all required variables. The only **required** key to boot is:

| Variable | Required | Purpose |
|---|---|---|
| `GROQ_API_KEY` | ✅ Yes | Powers chat, transcription, news |
| `ML_BACKEND_URL` | Optional | Default: `http://localhost:8000` |
| `NEXT_PUBLIC_SUPABASE_URL` | Optional | Supabase connection |
| `SENTINEL_HUB_CLIENT_ID` | Optional | Real satellite imagery |

---

## API Documentation

See [docs/API.md](docs/API.md) for full endpoint documentation.

FastAPI Swagger UI available at: `http://localhost:8000/docs`


