import { type NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// Helper to call local Python API for prediction
async function getLocalPrediction(symptoms: string[]) {
  try {
    const res = await fetch("http://localhost:5000/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ symptoms }),
    });
    if (!res.ok) throw new Error("Local model error");
    return await res.json(); // { predictedDisease: string, confidence: number }
  } catch {
    return { predictedDisease: "Unknown", confidence: 0 };
  }
}

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY, // Use env variable here
  baseURL: "https://openrouter.ai/api/v1",
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const symptoms = Array.isArray(body.symptoms) ? body.symptoms : [];

    // 1. Get local model prediction (dataset-based)
    const { predictedDisease, confidence } = await getLocalPrediction(symptoms);

    // 2. Prepare prompt for OpenRouter using only predictedDisease
    const prompt = `The most likely disease based on the user's symptoms is: ${predictedDisease}. Provide a brief explanation and 2-3 general recommendations.`;

    // 3. Call OpenRouter for explanation
    const completion = await openai.chat.completions.create({
      model: "deepseek/deepseek-r1-0528:free",
      messages: [
        {
          role: "system",
          content:
            "You are a medical AI assistant providing health analysis. Always emphasize that this is for informational purposes only and recommend consulting healthcare professionals. Respond only with valid JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.3,
      max_tokens: 600,
    });

    const response = completion.choices[0].message.content;

    let analysisResult;
    try {
      const jsonMatch = response?.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : response;
      analysisResult = JSON.parse(jsonString || "{}");
      // Overwrite confidence and primaryDiagnosis with local model's result
      analysisResult.confidence = confidence;
      analysisResult.primaryDiagnosis = predictedDisease;
    } catch {
      analysisResult = {
        primaryDiagnosis: predictedDisease,
        confidence: confidence,
        recommendations: [
          "Consult with a healthcare professional for proper diagnosis",
          "Monitor symptoms closely and track any changes",
        ],
      };
    }

    return NextResponse.json(analysisResult);
  } catch (error) {
    return NextResponse.json(
      {
        primaryDiagnosis: "Analysis Error",
        confidence: 0,
        recommendations: ["Please try again later."],
      },
      { status: 500 }
    );
  }
}