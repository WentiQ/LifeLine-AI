import { type NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    interface PredictDiseaseRequestBody {
      symptoms?: string[];
      plan?: string;
      medicalHistory?: {
        additionalSymptoms?: string;
        conditions?: string;
        medications?: string;
        familyHistory?: string;
      };
      personalInfo?: {
        age?: string | number;
        gender?: string;
      };
    }

    const symptoms: string[] = Array.isArray((body as PredictDiseaseRequestBody).symptoms)
      ? (body as PredictDiseaseRequestBody).symptoms!.map((s: string) => s.trim().toLowerCase())
      : [];

    const plan = body.plan || "free";

    if (plan === "free") {
      const response = await fetch("https://web-production-6742f.up.railway.app/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptom_names: symptoms }),
      });

      if (!response.ok) {
        throw new Error("Python model error");
      }

      const result = await response.json();

      return NextResponse.json({
        primaryDiagnosis: result.top_prediction,
        confidence: result.confidence,
        recommendations: [
          "Consult with a healthcare professional for proper diagnosis",
          "Monitor symptoms closely and track any changes",
        ],
      });
    }

    const medicalHistory = body.medicalHistory || {};
    const personalInfo = body.personalInfo || {};

    const prompt = `You are an advanced medical AI assistant. Based on the following patient information, provide a comprehensive health analysis:

SYMPTOMS: ${symptoms.join(", ")}
ADDITIONAL SYMPTOMS: ${medicalHistory.additionalSymptoms || "None"}
AGE: ${personalInfo.age || "Unknown"}
GENDER: ${personalInfo.gender || "Unknown"}
EXISTING CONDITIONS: ${medicalHistory.conditions || "None"}
CURRENT MEDICATIONS: ${medicalHistory.medications || "None"}
FAMILY HISTORY: ${medicalHistory.familyHistory || "None"}

Please provide a detailed medical analysis in the following JSON format:
{
  "primaryDiagnosis": "Most likely condition",
  "confidence": 85,
  "riskLevel": "Low/Medium/High",
  "severity": "Mild/Moderate/Severe",
  "description": "Detailed explanation of the condition",
  "recommendations": ["Treatment recommendation 1", "Treatment recommendation 2"],
  "possibleCauses": ["Cause 1", "Cause 2"],
  "futureOutlook": {
    "withTreatment": "Outcome with treatment",
    "withoutTreatment": "Complications without treatment"
  },
  "suggestedTests": ["Test 1", "Test 2"],
  "urgency": "Non-urgent/Urgent/Emergency",
  "alternativeDiagnoses": [
    {"condition": "Alternative 1", "probability": 15},
    {"condition": "Alternative 2", "probability": 10}
  ],
  "lifestyle_recommendations": ["Lifestyle 1", "Lifestyle 2"],
  "followUp": "When to follow up",
  "foodRecommendations": ["Food 1", "Food 2"],
  "foodsToAvoid": ["Avoid 1", "Avoid 2"],
  "drugsOrMedicines": ["Drug 1", "Drug 2"],
  "remedies": ["Remedy 1", "Remedy 2"]
}

Important: This is for informational purposes only and should not replace professional medical advice.`;

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
      max_tokens: 2000,
    });

    const response = completion.choices[0].message.content;

    let analysisResult;
    try {
      const jsonMatch = response?.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : response;
      analysisResult = JSON.parse(jsonString || "{}");
    } catch {
      analysisResult = {
        primaryDiagnosis: "Medical Analysis Completed",
        confidence: 75,
        riskLevel: "Medium",
        severity: "Moderate",
        description:
          "Based on the symptoms provided, further medical evaluation is recommended for accurate diagnosis.",
        recommendations: [
          "Consult with a healthcare professional for proper diagnosis",
          "Monitor symptoms closely and track any changes",
          "Maintain a healthy lifestyle with proper rest and nutrition",
          "Follow up if symptoms persist or worsen",
        ],
        possibleCauses: [
          "Genetic predisposition",
          "Lifestyle factors",
          "Environmental triggers",
        ],
        futureOutlook: {
          withTreatment:
            "With proper medical care and treatment, most conditions can be effectively managed",
          withoutTreatment:
            "Untreated symptoms may persist or worsen over time",
        },
        suggestedTests: [
          "Complete medical examination",
          "Basic blood work",
          "Relevant diagnostic tests",
        ],
        urgency: "Non-urgent",
        alternativeDiagnoses: [
          { condition: "Multiple possible conditions", probability: 20 },
          { condition: "Requires professional evaluation", probability: 15 },
        ],
        lifestyle_recommendations: [
          "Regular sleep schedule",
          "Healthy diet",
          "Physical activity",
          "Stress management",
        ],
        followUp: "Within 1–2 weeks or sooner if symptoms worsen",
        foodRecommendations: ["Fresh fruits", "Lean proteins"],
        foodsToAvoid: ["Processed foods", "Excessive sugar"],
        drugsOrMedicines: [
          "Only those prescribed by a doctor",
          "Avoid self-medication",
        ],
        remedies: ["Hydration", "Rest"],
      };
    }

    return NextResponse.json(analysisResult);
  } catch (error) {
    console.error("Error in disease prediction:", error);
    return NextResponse.json(
      {
        error: "Failed to analyze symptoms",
        fallback: {
          primaryDiagnosis: "Analysis Unavailable",
          confidence: 0,
          riskLevel: "Unknown",
          recommendations: [
            "Please consult with a healthcare professional",
            "Try the analysis again later",
          ],
          possibleCauses: [
            "Insufficient data for analysis",
            "Error in processing the request",
          ],
          futureOutlook: {
            withTreatment: "Professional medical evaluation recommended",
            withoutTreatment: "Symptoms should be evaluated by a doctor",
          },
          suggestedTests: ["Complete medical examination"],
          urgency: "Consult healthcare provider",
          foodRecommendations: ["Better consult a nutritionist"],
          foodsToAvoid: ["Avoid self-diagnosing"],
          drugsOrMedicines: [
            "Consult a healthcare provider",
            "Avoid self-medicating",
          ],
          remedies: ["Consult a healthcare provider"],
        },
      },
      { status: 500 }
    );
  }
}
