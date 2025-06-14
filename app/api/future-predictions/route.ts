import { type NextRequest, NextResponse } from "next/server"
import { openai } from "@/lib/openai"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { badHabits, currentHealth, lifestyle, timeframe } = body

    const prompt = `You are a predictive health AI. Based on the following information, predict future health outcomes and provide actionable advice:

BAD HABITS: ${badHabits.join(", ")}
CURRENT HEALTH STATUS: ${currentHealth}
LIFESTYLE FACTORS: ${JSON.stringify(lifestyle)}
PREDICTION TIMEFRAME: ${timeframe} (1 year, 5 years, 10 years)

Please provide comprehensive future health predictions in the following JSON format:
{
  "shortTerm": {
    "timeframe": "1-2 years",
    "predictions": [
      {
        "condition": "Potential health issue",
        "probability": 75,
        "severity": "Mild/Moderate/Severe",
        "description": "Detailed explanation",
        "preventionSteps": ["Step 1", "Step 2"]
      }
    ]
  },
  "mediumTerm": {
    "timeframe": "3-5 years", 
    "predictions": [
      {
        "condition": "Potential health issue",
        "probability": 60,
        "severity": "Mild/Moderate/Severe",
        "description": "Detailed explanation",
        "preventionSteps": ["Step 1", "Step 2"]
      }
    ]
  },
  "longTerm": {
    "timeframe": "5-10 years",
    "predictions": [
      {
        "condition": "Potential health issue",
        "probability": 45,
        "severity": "Mild/Moderate/Severe", 
        "description": "Detailed explanation",
        "preventionSteps": ["Step 1", "Step 2"]
      }
    ]
  },
  "habitImpact": {
    "mostDangerous": "Most harmful habit",
    "immediateRisks": ["Risk 1", "Risk 2"],
    "cumulativeEffects": ["Long-term effect 1", "Long-term effect 2"]
  },
  "interventionPlan": {
    "priorityChanges": ["Change 1", "Change 2"],
    "timeline": "Recommended timeline for changes",
    "expectedBenefits": ["Benefit 1", "Benefit 2"]
  },
  "riskReduction": {
    "ifQuitNow": "Benefits of stopping bad habits immediately",
    "ifContinue": "Consequences of continuing current habits",
    "reversibility": "Which effects can be reversed"
  }
}`

    const completion = await openai.chat.completions.create({
      model: "deepseek/deepseek-r1-0528:free",
      messages: [
        {
          role: "system",
          content:
            "You are a predictive health AI specializing in long-term health outcomes based on lifestyle factors. Provide evidence-based predictions while emphasizing prevention and positive change. Respond only with valid JSON.",
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

    let predictionsResult
    try {
      const jsonMatch = response?.match(/\{[\s\S]*\}/)
      const jsonString = jsonMatch ? jsonMatch[0] : response
      predictionsResult = JSON.parse(jsonString || "{}")
    } catch (error) {
      predictionsResult = {
        shortTerm: {
          timeframe: "1-2 years",
          predictions: [
            {
              condition: "Increased health risks from current habits",
              probability: 70,
              severity: "Moderate",
              description: "Continued bad habits may lead to various health complications",
              preventionSteps: ["Reduce harmful habits gradually", "Adopt healthier alternatives"],
            },
          ],
        },
        mediumTerm: {
          timeframe: "3-5 years",
          predictions: [
            {
              condition: "Chronic health conditions",
              probability: 50,
              severity: "Moderate to Severe",
              description: "Long-term habits may result in chronic diseases",
              preventionSteps: ["Make significant lifestyle changes", "Regular health monitoring"],
            },
          ],
        },
        longTerm: {
          timeframe: "5-10 years",
          predictions: [
            {
              condition: "Serious health complications",
              probability: 40,
              severity: "Severe",
              description: "Accumulated effects of poor lifestyle choices",
              preventionSteps: ["Complete lifestyle overhaul", "Professional medical support"],
            },
          ],
        },
        habitImpact: {
          mostDangerous: "Combination of multiple bad habits",
          immediateRisks: ["Decreased energy", "Poor sleep quality"],
          cumulativeEffects: ["Increased disease risk", "Reduced life expectancy"],
        },
        interventionPlan: {
          priorityChanges: ["Address most harmful habit first", "Gradual implementation of changes"],
          timeline: "Start immediately, see benefits in 3-6 months",
          expectedBenefits: ["Improved energy", "Better health markers"],
        },
        riskReduction: {
          ifQuitNow: "Significant reduction in health risks within months",
          ifContinue: "Progressive worsening of health outcomes",
          reversibility: "Many effects can be reversed with lifestyle changes",
        },
      }
    }

    return NextResponse.json(predictionsResult)
  } catch (error) {
    console.error("Error generating future predictions:", error)
    return NextResponse.json({ error: "Failed to generate predictions" }, { status: 500 })
  }
}
