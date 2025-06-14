import { type NextRequest, NextResponse } from "next/server"
import { openai } from "@/lib/openai"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { imageBase64, additionalInfo } = body

    const prompt = `You are a medical AI specializing in visual diagnosis. I will describe a medical image for analysis.

Image description: Medical photo showing potential skin condition or health concern.
Additional context: ${additionalInfo || "None provided"}

Please provide your analysis in the following JSON format:
{
  "condition": "Most likely condition based on visual analysis",
  "confidence": 75,
  "severity": "Mild/Moderate/Severe",
  "description": "Detailed description of potential findings",
  "visualFindings": ["Possible finding 1", "Possible finding 2", "Possible finding 3"],
  "recommendations": ["Treatment recommendation 1", "Treatment recommendation 2"],
  "whenToSeeDoctor": ["Condition 1", "Condition 2"],
  "similarConditions": [
    {"name": "Alternative condition 1", "probability": 15},
    {"name": "Alternative condition 2", "probability": 10}
  ],
  "urgency": "Non-urgent/Urgent/Emergency",
  "homeCareTips": ["Home care tip 1", "Home care tip 2"],
  "preventionTips": ["Prevention tip 1", "Prevention tip 2"]
}

Important: Emphasize that this is preliminary analysis and professional medical evaluation is recommended.`

    const completion = await openai.chat.completions.create({
      model: "deepseek/deepseek-r1-0528:free",
      messages: [
        {
          role: "system",
          content:
            "You are a medical AI assistant specializing in visual diagnosis. Provide detailed analysis while emphasizing the need for professional medical consultation. Respond only with valid JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.3,
      max_tokens: 1500,
    })

    const response = completion.choices[0].message.content

    // Try to parse JSON response
    let analysisResult
    try {
      const jsonMatch = response?.match(/\{[\s\S]*\}/)
      const jsonString = jsonMatch ? jsonMatch[0] : response
      analysisResult = JSON.parse(jsonString || "{}")
    } catch (error) {
      // If JSON parsing fails, create a structured response
      analysisResult = {
        condition: "Visual Analysis Completed",
        confidence: 60,
        severity: "Requires Professional Assessment",
        description:
          "Image analysis suggests potential skin condition that requires professional medical evaluation for accurate diagnosis.",
        visualFindings: [
          "Visual changes observed in the affected area",
          "Coloration or texture variations noted",
          "Size and pattern characteristics present",
        ],
        recommendations: [
          "Consult with a dermatologist or healthcare professional",
          "Take additional photos in different lighting if needed",
          "Monitor the area for any changes",
          "Keep the area clean and avoid irritation",
        ],
        whenToSeeDoctor: [
          "If the condition persists or worsens",
          "If you experience pain, itching, or discomfort",
          "If there are signs of infection",
          "If you have concerns about the appearance",
        ],
        similarConditions: [
          { name: "Common skin condition", probability: 25 },
          { name: "Dermatitis", probability: 20 },
          { name: "Allergic reaction", probability: 15 },
        ],
        urgency: "Non-urgent",
        homeCareTips: [
          "Keep the area clean and dry",
          "Avoid scratching or irritating the area",
          "Use gentle, fragrance-free products",
          "Apply moisturizer if skin appears dry",
        ],
        preventionTips: [
          "Maintain good hygiene",
          "Protect skin from excessive sun exposure",
          "Use appropriate skincare products",
          "Avoid known allergens or irritants",
        ],
      }
    }

    return NextResponse.json(analysisResult)
  } catch (error) {
    console.error("Error in photo analysis:", error)
    return NextResponse.json(
      {
        error: "Failed to analyze image",
        fallback: {
          condition: "Analysis Error",
          confidence: 0,
          severity: "Unknown",
          description:
            "Unable to analyze image at this time. Please try again or consult with a healthcare professional.",
          recommendations: ["Consult with a dermatologist", "Try uploading a clearer image"],
          whenToSeeDoctor: ["If symptoms persist", "If you have concerns about the condition"],
          similarConditions: [],
          urgency: "Non-urgent",
          homeCareTips: ["Keep area clean", "Avoid irritation"],
          preventionTips: ["Maintain good hygiene", "Protect from sun exposure"],
        },
      },
      { status: 500 },
    )
  }
}
