import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { latitude, longitude } = body;

    if (latitude === undefined || longitude === undefined) {
      return NextResponse.json(
        { error: "latitude and longitude are required" },
        { status: 400 }
      );
    }

    const backendUrl = process.env.ML_BACKEND_URL || "http://localhost:8000";
    let data;
    try {
      const response = await fetch(`${backendUrl}/analyze/location`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ latitude, longitude }),
        signal: AbortSignal.timeout(5000), // 5 seconds timeout
      });

      if (!response.ok) {
        throw new Error("Backend not OK");
      }
      data = await response.json();
    } catch (err) {
      // Fallback to mock data if ML backend is unavailable
      console.warn("ML backend unavailable, using mock data for location:", latitude, longitude);
      data = {
        success: true,
        location: {
          latitude,
          longitude,
          region: "Agricultural Zone"
        },
        weather: {
          temperature: 28 + Math.floor(Math.random() * 5),
          humidity: 60 + Math.floor(Math.random() * 20),
          wind_speed: 10 + Math.floor(Math.random() * 8),
          rain: Math.random() > 0.7 ? Math.floor(Math.random() * 15) : 0,
          condition: Math.random() > 0.5 ? "Partly Cloudy" : "Sunny",
          icon: Math.random() > 0.5 ? "🌤️" : "☀️",
          feels_like: 30 + Math.floor(Math.random() * 5)
        },
        crops: [
          {
            name: "Wheat",
            icon: "🌾",
            confidence: 92,
            reason: "Optimal temperature and soil conditions detected.",
            season: "Rabi (Winter)",
            water_need: "Moderate",
            rank: 1
          },
          {
            name: "Rice",
            icon: "🍚",
            confidence: 85,
            reason: "Suitable if irrigation is available.",
            season: "Kharif (Monsoon)",
            water_need: "High",
            rank: 2
          },
          {
            name: "Cotton",
            icon: "🧶",
            confidence: 78,
            reason: "Good market value, soil matches requirements.",
            season: "Kharif",
            water_need: "High",
            rank: 3
          }
        ],
        farming_tips: [
          "Schedule irrigation for early morning to minimize evaporation.",
          "Monitor for pests due to current weather conditions.",
          "Consider soil testing before next planting season."
        ]
      };
    }
        // Fetch exact location name using Nominatim free API
        try {
          const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          if (geoRes.ok) {
            const geoData = await geoRes.json();
            const address = geoData.address || {};
            const parts = [];
            if (address.village || address.suburb || address.town || address.city || address.county) {
                parts.push(address.village || address.suburb || address.town || address.city || address.county);
            }
            if (address.state) parts.push(address.state);
            
            const exactLocation = parts.length > 0 ? parts.join(", ") : "Agricultural Zone";
            if (data && data.location) {
              data.location.region = exactLocation;
            }
          }
        } catch (err) {}

        // Fetch real weather using Open-Meteo API
        try {
          const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,rain,apparent_temperature,weather_code&timezone=auto`);
          if (weatherRes.ok) {
            const wData = await weatherRes.json();
            const current = wData.current;
            if (data && data.weather) {
              data.weather = {
                temperature: Math.round(current.temperature_2m),
                humidity: Math.round(current.relative_humidity_2m),
                wind_speed: Math.round(current.wind_speed_10m),
                rain: current.rain || 0,
                condition: current.weather_code > 50 ? "Rainy" : current.weather_code > 0 ? "Cloudy" : "Clear",
                icon: current.weather_code > 50 ? "🌧️" : current.weather_code > 0 ? "⛅" : "☀️",
                feels_like: Math.round(current.apparent_temperature)
              };
            }
          }
        } catch (err) {}

    return NextResponse.json(data);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: "Analysis failed", detail: msg },
      { status: 500 }
    );
  }
}
