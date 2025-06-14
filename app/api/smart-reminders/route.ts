import { type NextRequest, NextResponse } from "next/server"
import { openai } from "@/lib/openai"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { medications, healthConditions, userPreferences } = body

    const prompt = `You are an AI medication and health reminder assistant. Based on the following information, create intelligent reminders and health tips:

MEDICATIONS: ${JSON.stringify(medications)}
HEALTH CONDITIONS: ${healthConditions.join(", ") || "None"}
USER PREFERENCES: ${JSON.stringify(userPreferences)}

Please provide smart reminders and tips in the following JSON format:
{
  "medicationReminders": [
    {
      "medication": "Medication name",
      "time": "HH:MM",
      "message": "Personalized reminder message",
      "tips": ["Tip 1", "Tip 2"]
    }
  ],
  "healthTips": [
    {
      "category": "Category (e.g., Diet, Exercise, Sleep)",
      "tip": "Specific health tip",
      "timing": "When to apply this tip"
    }
  ],
  "dailyCheckins": [
    {
      "time": "HH:MM",
      "question": "Health check-in question",
      "purpose": "Why this check-in is important"
    }
  ],
  "warnings": [
    {
      "condition": "What to watch for",
      "action": "What to do if this occurs"
    }
  ]
}`

    const completion = await openai.chat.completions.create({
      model: "deepseek/deepseek-r1-0528:free",
      messages: [
        {
          role: "system",
          content:
            "You are a healthcare AI assistant specializing in medication management and health reminders. Provide personalized, actionable advice. Respond only with valid JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.3,
      max_tokens: 1200,
    })

    const response = completion.choices[0].message.content

    let remindersResult
    try {
      const jsonMatch = response?.match(/\{[\s\S]*\}/)
      const jsonString = jsonMatch ? jsonMatch[0] : response
      remindersResult = JSON.parse(jsonString || "{}")
    } catch (error) {
      remindersResult = {
        medicationReminders: [
          {
            medication: "Morning Medications",
            time: "08:00",
            message: "Time to take your morning medications. Remember to take with food if required.",
            tips: ["Take with a full glass of water", "Don't skip doses"],
          },
          {
            medication: "Evening Medications",
            time: "20:00",
            message: "Evening medication reminder. Consistency is key for effectiveness.",
            tips: ["Take at the same time daily", "Store medications properly"],
          },
        ],
        healthTips: [
          {
            category: "Hydration",
            tip: "Drink a glass of water every 2 hours",
            timing: "Throughout the day",
          },
          {
            category: "Exercise",
            tip: "Take a 10-minute walk after meals",
            timing: "After breakfast, lunch, and dinner",
          },
          {
            category: "Sleep",
            tip: "Maintain a consistent bedtime routine",
            timing: "1 hour before bed",
          },
        ],
        dailyCheckins: [
          {
            time: "09:00",
            question: "How are you feeling today? Rate your energy level from 1-10.",
            purpose: "Monitor overall wellbeing and energy levels",
          },
          {
            time: "21:00",
            question: "Did you take all your medications today?",
            purpose: "Ensure medication compliance",
          },
        ],
        warnings: [
          {
            condition: "Unusual side effects from medications",
            action: "Contact your healthcare provider immediately",
          },
          {
            condition: "Persistent symptoms or worsening condition",
            action: "Schedule an appointment with your doctor",
          },
        ],
      }
    }

    return NextResponse.json(remindersResult)
  } catch (error) {
    console.error("Error generating smart reminders:", error)
    return NextResponse.json(
      {
        error: "Failed to generate reminders",
        fallback: {
          medicationReminders: [],
          healthTips: [
            {
              category: "General",
              tip: "Stay hydrated throughout the day",
              timing: "Every 2-3 hours",
            },
          ],
          dailyCheckins: [
            {
              time: "09:00",
              question: "How are you feeling today?",
              purpose: "Monitor overall wellbeing",
            },
          ],
          warnings: [
            {
              condition: "Unusual symptoms",
              action: "Contact your healthcare provider",
            },
          ],
        },
      },
      { status: 500 },
    )
  }
}
