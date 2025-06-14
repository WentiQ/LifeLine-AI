import { type NextRequest, NextResponse } from "next/server"
import { openai } from "@/lib/openai"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userProfile, healthGoals, currentConditions } = body

    const prompt = `You are a health and wellness AI coach. Based on the following user profile, provide personalized health recommendations:

USER PROFILE:
Age: ${userProfile.age}
Gender: ${userProfile.gender}
Activity Level: ${userProfile.activityLevel}
Current Health Conditions: ${currentConditions.join(", ") || "None"}
Health Goals: ${healthGoals.join(", ") || "General wellness"}

Please provide comprehensive health recommendations in the following JSON format:
{
  "dailyRoutine": {
    "morning": ["Morning routine item 1", "Morning routine item 2"],
    "afternoon": ["Afternoon routine item 1", "Afternoon routine item 2"],
    "evening": ["Evening routine item 1", "Evening routine item 2"]
  },
  "nutrition": {
    "recommendations": ["Nutrition tip 1", "Nutrition tip 2"],
    "foodsToInclude": ["Food 1", "Food 2", "Food 3"],
    "foodsToAvoid": ["Food 1", "Food 2"]
  },
  "exercise": {
    "weeklyPlan": ["Exercise 1: 3x/week", "Exercise 2: 2x/week"],
    "duration": "30-45 minutes per session",
    "intensity": "Moderate"
  },
  "lifestyle": {
    "sleepRecommendations": ["Sleep tip 1", "Sleep tip 2"],
    "stressManagement": ["Stress tip 1", "Stress tip 2"],
    "habits": ["Healthy habit 1", "Healthy habit 2"]
  },
  "monitoring": {
    "vitalsToTrack": ["Vital 1", "Vital 2"],
    "frequency": "Daily/Weekly/Monthly",
    "warningSigns": ["Warning sign 1", "Warning sign 2"]
  }
}`

    const completion = await openai.chat.completions.create({
      model: "deepseek/deepseek-r1-0528:free",
      messages: [
        {
          role: "system",
          content:
            "You are a certified health and wellness coach providing personalized recommendations based on individual health profiles. Respond only with valid JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.4,
      max_tokens: 1500,
    })

    const response = completion.choices[0].message.content

    let recommendationsResult
    try {
      const jsonMatch = response?.match(/\{[\s\S]*\}/)
      const jsonString = jsonMatch ? jsonMatch[0] : response
      recommendationsResult = JSON.parse(jsonString || "{}")
    } catch (error) {
      recommendationsResult = {
        dailyRoutine: {
          morning: [
            "Start with 5-10 minutes of light stretching",
            "Drink a glass of water to hydrate",
            "Take 5 deep breaths for mindfulness",
            "Eat a nutritious breakfast",
          ],
          afternoon: [
            "Take a 10-15 minute walk",
            "Practice good posture if working at a desk",
            "Stay hydrated with water",
            "Have a healthy snack if needed",
          ],
          evening: [
            "Wind down with relaxing activities",
            "Limit screen time 1 hour before bed",
            "Prepare for quality sleep",
            "Reflect on the day's positive moments",
          ],
        },
        nutrition: {
          recommendations: [
            "Eat balanced meals with protein, healthy carbs, and fats",
            "Stay hydrated with 8-10 glasses of water daily",
            "Include colorful fruits and vegetables",
            "Practice portion control",
          ],
          foodsToInclude: ["Leafy greens", "Lean proteins", "Whole grains", "Fresh fruits", "Nuts and seeds", "Fish"],
          foodsToAvoid: ["Processed foods", "Excessive sugar", "Trans fats", "Excessive sodium"],
        },
        exercise: {
          weeklyPlan: [
            "Cardio: 150 minutes moderate intensity per week",
            "Strength training: 2-3 sessions per week",
            "Flexibility: Daily stretching or yoga",
            "Balance exercises: 2-3 times per week",
          ],
          duration: "30-45 minutes per session",
          intensity: "Moderate to vigorous",
        },
        lifestyle: {
          sleepRecommendations: [
            "Maintain consistent sleep schedule",
            "Create a relaxing bedtime routine",
            "Aim for 7-9 hours of sleep",
            "Keep bedroom cool and dark",
          ],
          stressManagement: [
            "Practice meditation or deep breathing",
            "Engage in hobbies you enjoy",
            "Connect with friends and family",
            "Take regular breaks during work",
          ],
          habits: [
            "Regular physical activity",
            "Healthy eating patterns",
            "Adequate sleep",
            "Stress management techniques",
            "Regular health check-ups",
          ],
        },
        monitoring: {
          vitalsToTrack: ["Weight", "Blood pressure", "Heart rate", "Sleep quality", "Energy levels"],
          frequency: "Daily for sleep and energy, weekly for weight, monthly for blood pressure",
          warningSigns: [
            "Persistent fatigue",
            "Unusual weight changes",
            "Sleep disturbances",
            "Persistent stress or anxiety",
            "Changes in appetite",
          ],
        },
      }
    }

    return NextResponse.json(recommendationsResult)
  } catch (error) {
    console.error("Error generating health recommendations:", error)
    return NextResponse.json(
      {
        error: "Failed to generate recommendations",
        fallback: {
          dailyRoutine: {
            morning: ["Start with light stretching", "Drink water"],
            afternoon: ["Take a short walk", "Stay hydrated"],
            evening: ["Wind down", "Prepare for sleep"],
          },
          nutrition: {
            recommendations: ["Eat balanced meals", "Stay hydrated"],
            foodsToInclude: ["Fruits", "Vegetables", "Whole grains"],
            foodsToAvoid: ["Processed foods", "Excessive sugar"],
          },
        },
      },
      { status: 500 },
    )
  }
}
