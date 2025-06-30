import { type NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// --- OpenRouter AI Client Configuration ---
// It's recommended to store your API key in an environment variable for security.
// For example, in a .env.local file: OPENROUTER_API_KEY="your-key-here"
// Then access it with: process.env.OPENROUTER_API_KEY
const openrouter = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: "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",
  defaultHeaders: {
    // Replace with your actual site URL and app name
    "HTTP-Referer": "http://localhost:3000",
    "X-Title": "Emergency Guide AI",
  },
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { condition, severity, location, availableResources } = body;

    const prompt = `You are an emergency medical guide AI. Provide immediate do's and don'ts for the following medical emergency or condition(note : dont forget to give "warningSignsigns"):

CONDITION/EMERGENCY: ${condition}
SEVERITY: ${severity}
LOCATION: ${location}
AVAILABLE RESOURCES: ${availableResources.join(", ")}

Please provide comprehensive emergency guidance in the following JSON format:
{
  "immediateActions": {
    "dos": [
      {
        "action": "Specific action to take",
        "priority": "Critical/High/Medium",
        "timing": "Immediately/Within 5 minutes/ASAP",
        "reason": "Why this action is important"
      }
    ],
    "donts": [
      {
        "action": "What NOT to do",
        "priority": "Critical/High/Medium", 
        "reason": "Why this should be avoided",
        "consequence": "What could happen if done"
      }
    ]
  },
  "stepByStep": [
    {
      "step": 1,
      "instruction": "Detailed step-by-step instruction",
      "duration": "How long this step should take",
      "signs": "What to look for during this step"
    }
  ],
  "warningSignsigns": {
    "deterioration": ["Sign 1(eg : Loss of consciousness)", "Sign 2"],
    "improvement": ["Sign 1(eg : Stable breathing)", "Sign 2"],
    "whenToCall911": ["Condition 1(eg : Severe injury)", "Condition 2"]
  },
  "prevention": {
    "futureAvoidance": ["Prevention tip 1", "Prevention tip 2"],
    "riskFactors": ["Risk factor 1", "Risk factor 2"],
    "preparedness": ["Preparation tip 1", "Preparation tip 2"]
  },
  "followUp": {
    "immediateNext": "What to do after immediate care",
    "monitoring": "What to monitor in coming hours/days",
    "medicalCare": "When and what type of medical care to seek"
  },
  "commonMistakes": [
    {
      "mistake": "Common error people make",
      "whyBad": "Why this is problematic",
      "instead": "What to do instead"
    }
  ]
}`;

    const completion = await openrouter.chat.completions.create({
      model: "deepseek/deepseek-r1-0528:free",
      messages: [
        {
          role: "system",
          content:
            "You are an emergency medical guide AI providing life-saving information. Be precise, clear, and prioritize safety. Always emphasize calling emergency services when appropriate. Respond only with valid JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.1,
      max_tokens: 2000,
    });

    const response = completion.choices[0].message.content;

    let guideResult;
    try {
      const jsonMatch = response?.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : response;
      guideResult = JSON.parse(jsonString || "{}");
    } catch (error) {
      // Fallback emergency guide
      guideResult = {
        immediateActions: {
          dos: [
            {
              action: "Call emergency services (911) immediately",
              priority: "Critical",
              timing: "Immediately",
              reason: "Professional medical help is essential",
            },
            {
              action: "Stay calm and assess the situation",
              priority: "High",
              timing: "Immediately",
              reason: "Clear thinking helps make better decisions",
            },
          ],
          donts: [
            {
              action: "Don't panic or make hasty decisions",
              priority: "Critical",
              reason: "Panic can lead to poor judgment",
              consequence: "May worsen the situation",
            },
            {
              action: "Don't move the person unless absolutely necessary",
              priority: "High",
              reason: "Movement could cause additional injury",
              consequence: "Potential spinal or internal injuries",
            },
          ],
        },
        stepByStep: [
          {
            step: 1,
            instruction: "Ensure scene safety for yourself and others",
            duration: "30 seconds",
            signs: "No immediate dangers present",
          },
          {
            step: 2,
            instruction: "Call for professional medical help",
            duration: "1-2 minutes",
            signs: "Emergency services contacted",
          },
          {
            step: 3,
            instruction: "Provide basic first aid if trained",
            duration: "Until help arrives",
            signs: "Person is stable and breathing",
          },
        ],
        warningSignsigns: {
          deterioration: ["Loss of consciousness", "Difficulty breathing", "Severe bleeding"],
          improvement: ["Stable breathing", "Responsive to voice", "Color returning to normal"],
          whenToCall911: ["Any life-threatening emergency", "Severe injury", "Unconsciousness"],
        },
        prevention: {
          futureAvoidance: ["Learn basic first aid", "Keep emergency numbers handy"],
          riskFactors: ["Lack of preparation", "Unfamiliarity with emergency procedures"],
          preparedness: ["Take first aid course", "Maintain emergency kit"],
        },
        followUp: {
          immediateNext: "Wait for emergency services and follow their instructions",
          monitoring: "Watch for changes in condition",
          medicalCare: "Follow up with healthcare provider as recommended",
        },
        commonMistakes: [
          {
            mistake: "Trying to handle serious emergencies alone",
            whyBad: "Delays professional care",
            instead: "Call emergency services immediately",
          },
        ],
      };
    }

    return NextResponse.json(guideResult);
  } catch (error) {
    console.error("Error generating emergency guide:", error);
    return NextResponse.json({ error: "Failed to generate emergency guide" }, { status: 500 });
  }
}