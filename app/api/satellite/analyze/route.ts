import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { bbox, crop_type, field_name } = body;

    if (!bbox || !Array.isArray(bbox) || bbox.length !== 4) {
      return NextResponse.json(
        { error: "bbox must be [min_lon, min_lat, max_lon, max_lat]" },
        { status: 400 }
      );
    }

    const readBase64 = (file: string) => {
      try {
        const filePath = path.join(process.cwd(), 'public', 'satellite', file);
        if (fs.existsSync(filePath)) {
          return `data:image/png;base64,${fs.readFileSync(filePath, 'base64')}`;
        }
      } catch (e) {
        console.error("Failed to read", file);
      }
      return "";
    };

    const imgNDVI = readBase64('ndvi.png');
    const imgNDWI = readBase64('ndwi.png');
    const imgNDSI = readBase64('ndsi.png');

    const mockData = {
      stats: { 
        avg_ndvi: 0.72, 
        yield_estimate: "4.5 Tons/Hectare",
        yield_change: "-10%",
        worst_zone: "North-West Sector", 
        worst_ndvi: 0.28,
        financial_risk: {
          potential_loss: "-₹1,15,400",
          cost_to_fix: "₹4,500",
          net_roi: "+₹1,10,900"
        }
      },
      weather: "Sunny, 28°C. Optimal conditions for vegetative growth phase. No rain expected next 3 days.",
      advice: "Overall crop health is excellent (Avg NDVI 0.72). However, the North-West Sector shows severe stress (NDVI 0.28). This pattern typically indicates localized water-logging or a nematode infestation. \n\nRecommended actions:\n1. Inspect the NW sector immediately for root rot.\n2. Adjust drip irrigation scheduling to reduce pooling in that depression.\n3. Apply targeted foliar nutrition (NPK) to the stressed yellow zones.",
      
      timeline: [
        {
          date: "Current",
          dateString: "August 05, 2026",
          avg_ndvi: 0.72,
          images: { ndvi: imgNDVI, ndwi: imgNDWI, ndsi: imgNDSI },
          hotspots: [
            { id: 1, x: 25, y: 30, type: "Water Stress", severity: "High", message: "Severe Water Stress Detected. AI recommends increasing drip irrigation by 15%." },
            { id: 2, x: 75, y: 65, type: "Pest Risk", severity: "Medium", message: "Early signs of leaf blight. Deploy drone for closer inspection." }
          ]
        },
        {
          date: "30 Days Ago",
          dateString: "July 05, 2026",
          avg_ndvi: 0.58,
          images: { ndvi: imgNDVI, ndwi: imgNDWI, ndsi: imgNDSI },
          hotspots: [
            { id: 1, x: 20, y: 35, type: "Nutrient Deficit", severity: "Low", message: "Low Nitrogen levels detected. Consider NPK application." }
          ]
        },
        {
          date: "60 Days Ago",
          dateString: "June 05, 2026",
          avg_ndvi: 0.35,
          images: { ndvi: imgNDVI, ndwi: imgNDWI, ndsi: imgNDSI },
          hotspots: []
        }
      ],

      trend: [
        { date: "May 05", ndvi: 0.15 },
        { date: "Jun 05", ndvi: 0.35 },
        { date: "Jul 05", ndvi: 0.58 },
        { date: "Aug 05", ndvi: 0.72 },
      ],
      zones: [
        { id: "Zone A (Central)", ndvi: "0.75 - 0.85", pct: 68, color: "#22c55e", status: "Healthy" },
        { id: "Zone B (East)", ndvi: "0.45 - 0.60", pct: 22, color: "#eab308", status: "Moderate Stress" },
        { id: "Zone C (North-West)", ndvi: "0.20 - 0.35", pct: 10, color: "#ef4444", status: "Severe Stress" },
      ],
      field: field_name || "Demo Field",
      crop: crop_type || "Wheat",
      bbox: bbox,
      is_mock: true,
      data_source: "SIMULATED"
    };

    let response;
    try {
      const backendUrl = process.env.ML_BACKEND_URL || "http://localhost:8000";
      response = await fetch(`${backendUrl}/analyze/ndvi`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bbox,
          crop_type: crop_type || "Unknown",
          field_name: field_name || "Field",
        }),
        signal: AbortSignal.timeout(4000), // very short timeout so demo doesn't hang
      });
    } catch (fetchErr) {
      console.warn("ML Backend unavailable:", fetchErr);
      return NextResponse.json({ error: "Satellite ML Backend unavailable." }, { status: 503 });
    }

    if (!response.ok) {
      console.warn(`ML Backend returned ${response.status}.`);
      return NextResponse.json({ error: "ML Backend analysis failed." }, { status: response.status });
    }

    const data = await response.json();

    // Expose raw backend data
    if (data.is_mock) {
       console.warn("ML Backend returned mock data");
    }

    return NextResponse.json(data);
  } catch (err: unknown) {
    console.error("Satellite API Error:", err);
    return NextResponse.json(
      { error: "Analysis failed." },
      { status: 500 }
    );
  }
}
