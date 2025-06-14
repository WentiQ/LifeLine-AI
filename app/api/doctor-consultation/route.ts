import { type NextRequest, NextResponse } from "next/server"
import { openai } from "@/lib/openai"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { symptoms, medicalHistory, urgency, preferredSpecialty } = body

    const prompt = `You are a medical triage AI assistant. Based on the patient information provided, recommend the most appropriate type of doctor and urgency level:

SYMPTOMS: ${symptoms.join(", ")}
MEDICAL HISTORY: ${medicalHistory}
PATIENT URGENCY CONCERN: ${urgency}
PREFERRED SPECIALTY: ${preferredSpecialty || "None specified"}

Please provide recommendations in the following JSON format:
{
  "recommendedSpecialty": "Most appropriate medical specialty",
  "urgencyLevel": "Low/Medium/High/Emergency",
  "reasoning": "Explanation for the recommendation",
  "alternativeSpecialties": ["Alternative 1", "Alternative 2"],
  "questionsForDoctor": ["Question 1", "Question 2", "Question 3"],
  "preparationTips": ["Tip 1", "Tip 2", "Tip 3"],
  "redFlags": ["Warning sign 1", "Warning sign 2"],
  "timeframe": "How soon to seek care",
  "telemedicineAppropriate": true/false
}`

    const completion = await openai.chat.completions.create({
      model: "deepseek/deepseek-r1-0528:free",
      messages: [
        {
          role: "system",
          content:
            "You are a medical triage assistant helping patients find the right healthcare provider. Provide clear, helpful guidance while emphasizing the importance of professional medical care. Respond only with valid JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.2,
      max_tokens: 1000,
    })

    const response = completion.choices[0].message.content

    let consultationResult
    try {
      const jsonMatch = response?.match(/\{[\s\S]*\}/)
      const jsonString = jsonMatch ? jsonMatch[0] : response
      consultationResult = JSON.parse(jsonString || "{}")
    } catch (error) {
      consultationResult = {
        recommendedSpecialty: "General Practitioner",
        urgencyLevel: "Medium",
        reasoning: "A general practitioner can provide initial assessment and refer to specialists if needed",
        alternativeSpecialties: ["Internal Medicine", "Family Medicine"],
        questionsForDoctor: [
          "What could be causing these symptoms?",
          "What tests might be needed for diagnosis?",
          "What treatment options are available?",
          "When should I follow up?",
          "Are there any warning signs to watch for?",
        ],
        preparationTips: [
          "List all current medications and supplements",
          "Note when symptoms started and their progression",
          "Prepare questions in advance",
          "Bring any relevant medical records",
          "Write down your symptoms and their severity",
        ],
        redFlags: [
          "Severe or worsening pain",
          "Difficulty breathing",
          "High fever (over 103°F)",
          "Signs of infection",
          "Sudden onset of severe symptoms",
        ],
        timeframe: "Within 1-2 weeks, sooner if symptoms worsen",
        telemedicineAppropriate: true,
      }
    }

    return NextResponse.json(consultationResult)
  } catch (error) {
    console.error("Error generating consultation recommendation:", error)
    return NextResponse.json(
      {
        error: "Failed to generate consultation recommendation",
        fallback: {
          recommendedSpecialty: "General Practitioner",
          urgencyLevel: "Medium",
          reasoning: "Professional medical evaluation recommended",
          alternativeSpecialties: ["Internal Medicine"],
          questionsForDoctor: ["What could be causing these symptoms?"],
          preparationTips: ["List current medications", "Note symptom timeline"],
          redFlags: ["Severe symptoms", "Worsening condition"],
          timeframe: "Within 1-2 weeks",
          telemedicineAppropriate: true,
        },
      },
      { status: 500 },
    )
  }
}
