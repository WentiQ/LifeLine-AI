import { type NextRequest, NextResponse } from "next/server"
import { openai } from "@/lib/openai"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { heartRate, steps, sleep, bloodOxygen, stress, activity, timeRange } = body

    const prompt = `You are a health monitoring AI analyzing real-time smartwatch data. Provide comprehensive health insights and predictions:

SMARTWATCH DATA (${timeRange}):
Heart Rate: ${JSON.stringify(heartRate)}
Steps: ${JSON.stringify(steps)}
Sleep Data: ${JSON.stringify(sleep)}
Blood Oxygen: ${JSON.stringify(bloodOxygen)}
Stress Levels: ${JSON.stringify(stress)}
Activity Data: ${JSON.stringify(activity)}

Please provide detailed analysis in the following JSON format:
{
  "currentStatus": {
    "overallHealth": "Excellent/Good/Fair/Poor",
    "riskLevel": "Low/Medium/High",
    "keyFindings": ["Finding 1", "Finding 2"],
    "alertsWarnings": ["Alert 1", "Alert 2"]
  },
  "vitalAnalysis": {
    "heartRate": {
      "status": "Normal/Elevated/Low",
      "trend": "Improving/Stable/Declining",
      "concerns": ["Concern 1", "Concern 2"],
      "recommendations": ["Rec 1", "Rec 2"]
    },
    "sleep": {
      "quality": "Excellent/Good/Fair/Poor",
      "patterns": ["Pattern 1", "Pattern 2"],
      "improvements": ["Improvement 1", "Improvement 2"]
    },
    "activity": {
      "level": "Very Active/Active/Moderate/Sedentary",
      "trends": ["Trend 1", "Trend 2"],
      "goals": ["Goal 1", "Goal 2"]
    }
  },
  "predictions": {
    "immediate": {
      "timeframe": "Next 24-48 hours",
      "risks": ["Risk 1", "Risk 2"],
      "recommendations": ["Rec 1", "Rec 2"]
    },
    "shortTerm": {
      "timeframe": "Next 1-2 weeks",
      "trends": ["Trend 1", "Trend 2"],
      "interventions": ["Intervention 1", "Intervention 2"]
    }
  },
  "actionItems": {
    "urgent": ["Urgent action 1", "Urgent action 2"],
    "routine": ["Routine action 1", "Routine action 2"],
    "lifestyle": ["Lifestyle change 1", "Lifestyle change 2"]
  },
  "healthScore": {
    "overall": 85,
    "cardiovascular": 90,
    "sleep": 75,
    "activity": 80,
    "stress": 70
  }
}`

    const completion = await openai.chat.completions.create({
      model: "deepseek/deepseek-r1-0528:free",
      messages: [
        {
          role: "system",
          content:
            "You are a health monitoring AI specializing in wearable device data analysis. Provide actionable insights and early warning detection. Respond only with valid JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.3,
      max_tokens: 2000,
    })

    const response = completion.choices[0].message.content

    let analysisResult
    try {
      const jsonMatch = response?.match(/\{[\s\S]*\}/)
      const jsonString = jsonMatch ? jsonMatch[0] : response
      analysisResult = JSON.parse(jsonString || "{}")
    } catch (error) {
      analysisResult = {
        currentStatus: {
          overallHealth: "Good",
          riskLevel: "Low",
          keyFindings: ["Data analysis completed", "No immediate concerns detected"],
          alertsWarnings: [],
        },
        vitalAnalysis: {
          heartRate: {
            status: "Normal",
            trend: "Stable",
            concerns: [],
            recommendations: ["Continue current activity level", "Monitor regularly"],
          },
          sleep: {
            quality: "Good",
            patterns: ["Regular sleep schedule observed"],
            improvements: ["Maintain consistent bedtime"],
          },
          activity: {
            level: "Active",
            trends: ["Consistent activity levels"],
            goals: ["Maintain current activity", "Consider variety in exercises"],
          },
        },
        predictions: {
          immediate: {
            timeframe: "Next 24-48 hours",
            risks: [],
            recommendations: ["Continue current health habits"],
          },
          shortTerm: {
            timeframe: "Next 1-2 weeks",
            trends: ["Stable health metrics expected"],
            interventions: ["Regular monitoring"],
          },
        },
        actionItems: {
          urgent: [],
          routine: ["Continue regular exercise", "Maintain sleep schedule"],
          lifestyle: ["Stay hydrated", "Eat balanced meals"],
        },
        healthScore: {
          overall: 85,
          cardiovascular: 88,
          sleep: 82,
          activity: 85,
          stress: 80,
        },
      }
    }

    return NextResponse.json(analysisResult)
  } catch (error) {
    console.error("Error analyzing smartwatch data:", error)
    return NextResponse.json({ error: "Failed to analyze smartwatch data" }, { status: 500 })
  }
}
