import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "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",
  baseURL: "https://api.openrouter.ai/api/v1",
})

export { openai }
