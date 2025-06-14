import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, conversationHistory = [], userContext } = body

    const userMessage = message.toLowerCase().trim()
    const isFirstUserMessage = conversationHistory.filter((msg: any) => msg.role === "user").length === 0
    const currentMode = userContext?.mode || null

    // Initial greeting
    if (isFirstUserMessage) {
      return NextResponse.json({
        response: `Welcome! Please choose an option:\n\n1️⃣ App Help & Guide\n2️⃣ Chat for Medical Help\n\nReply with “App Help” or “Medical Help” to continue.`,
        timestamp: new Date().toISOString(),
      })
    }

    // App Help flow
    if (userMessage.includes("app help")) {
      return NextResponse.json({
        response: `You've selected App Help. Please choose an option:\n\n📘 Guide\n🛠 Troubleshoot\n📞 Contact Support`,
        timestamp: new Date().toISOString(),
      })
    }

    // Medical Help mode activation
    if (userMessage.includes("medical help")) {
      return NextResponse.json({
        response: `You're now in Medical Chat mode. Ask me any health-related questions, and I’ll do my best to assist you.`,
        timestamp: new Date().toISOString(),
      })
    }

    // 🔄 AI Filtering Prompt
    const medicalModePrompt = `
You are LifeLine AI, a medical assistant. Your job is to ONLY answer health-related questions (symptoms, diagnosis, prevention, wellness, medicine, diseases, treatments, exercise, mental health, etc).

If the user's question is NOT related to health or medicine, reply strictly with:
"I'm a medical assistant, so I can't answer the question you asked."

If the question IS related to health, answer helpfully and medically responsibly. Use plain, conversational English, and keep it concise.

User Context (if any): ${JSON.stringify(userContext)}
`

    const messages = [
      { role: "system", content: medicalModePrompt },
      ...conversationHistory,
      { role: "user", content: message },
    ]

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer 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`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-r1-0528:free", // You can change to another OpenRouter-supported model
        messages,
        temperature: 0.7,
        max_tokens: 800,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("OpenRouter API Error:", errorText)
      return NextResponse.json({ error: "OpenRouter API call failed", details: errorText }, { status: 500 })
    }

    const data = await response.json()
    const responseText = data.choices?.[0]?.message?.content || "No response generated."

    return NextResponse.json({
      response: responseText,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error in chat assistant:", error)
    return NextResponse.json(
      {
        error: "Failed to process message",
        response:
          "I'm sorry, I'm having trouble processing your request right now. Please try again or consult with a healthcare professional if you have urgent medical concerns.",
      },
      { status: 500 },
    )
  }
}
