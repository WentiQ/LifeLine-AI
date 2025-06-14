import { type NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: "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",
  baseURL: "https://openrouter.ai/api/v1",
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const symptoms = Array.isArray(body.symptoms) ? body.symptoms : [];
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
  "futureOutlook": {
    "withTreatment": "Expected outcome with proper treatment",
    "withoutTreatment": "Potential complications without treatment"
  },
  "suggestedTests": ["Test 1", "Test 2"],
  "urgency": "Non-urgent/Urgent/Emergency",
  "alternativeDiagnoses": [
    {"condition": "Alternative 1", "probability": 15},
    {"condition": "Alternative 2", "probability": 10}
  ],
  "lifestyle_recommendations": ["Lifestyle change 1", "Lifestyle change 2"],
  "followUp": "When to follow up with healthcare provider",

  "foodRecommendations": ["Foods to eat 1", "Foods to eat 2"],
  "foodsToAvoid": ["Food to avoid 1", "Food to avoid 2"],
  "medicines": ["Medicine 1", "Medicine 2"],
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
        futureOutlook: {
          withTreatment:
            "With proper medical care and treatment, most conditions can be effectively managed",
          withoutTreatment:
            "Untreated symptoms may persist or potentially worsen over time",
        },
        suggestedTests: [
          "Complete medical examination",
          "Basic blood work",
          "Relevant diagnostic tests as recommended by physician",
        ],
        urgency: "Non-urgent",
        alternativeDiagnoses: [
          { condition: "Multiple possible conditions", probability: 20 },
          { condition: "Requires professional evaluation", probability: 15 },
        ],
        lifestyle_recommendations: [
          "Maintain regular sleep schedule",
          "Stay hydrated and eat balanced meals",
          "Engage in appropriate physical activity",
          "Manage stress levels",
        ],
        followUp: "Within 1-2 weeks if symptoms persist, sooner if symptoms worsen",

        foodRecommendations: [
          "Include fresh fruits and vegetables",
          "Consume lean proteins like chicken and fish",
        ],
        foodsToAvoid: [
          "Limit processed foods and sugary snacks",
          "Avoid excessive salt and fried foods",
        ],
        medicines: [
          "Use medications prescribed by your healthcare provider",
          "Avoid self-medicating without professional advice",
        ],
        remedies: [
          "Rest adequately and stay hydrated",
          "Consider warm compresses for pain relief",
        ],
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
          futureOutlook: {
            withTreatment: "Professional medical evaluation recommended",
            withoutTreatment: "Symptoms should be evaluated by a doctor",
          },
          suggestedTests: ["Complete medical examination"],
          urgency: "Consult healthcare provider",

          foodRecommendations: [],
          foodsToAvoid: [],
          medicines: [],
          remedies: [],
        },
      },
      { status: 500 },
    );
  }
}
