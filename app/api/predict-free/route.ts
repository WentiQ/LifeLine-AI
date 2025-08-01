import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const symptoms = Array.isArray(body.symptoms)
      ? body.symptoms.map((s: string) => s.trim().toLowerCase())
      : [];

    // Call your deployed FastAPI model
    const response = await fetch("https://web-production-6742f.up.railway.app/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ symptom_names: symptoms }),
    });

    if (!response.ok) {
      throw new Error("Prediction service error");
    }

    const result = await response.json();

    return NextResponse.json({
      primaryDiagnosis: result.top_prediction,
      confidence: result.confidence,
      rankedPredictions: result.ranked_predictions,
    });
  } catch (error) {
    return NextResponse.json(
      {
        primaryDiagnosis: "Analysis Error",
        confidence: 0,
        rankedPredictions: [],
      },
      { status: 500 }
    );
  }
}