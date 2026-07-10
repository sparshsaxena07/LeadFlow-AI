export const openaiConfig = {
  apiKey: process.env.OPENAI_API_KEY || "",
  defaultModel: process.env.OPENAI_MODEL || "gpt-4o",
  generationConfig: {
    temperature: process.env.GEMINI_TEMPERATURE ? parseFloat(process.env.GEMINI_TEMPERATURE) : 0,
    topP: process.env.GEMINI_TOP_P ? parseFloat(process.env.GEMINI_TOP_P) : 0.1,
    maxOutputTokens: process.env.GEMINI_MAX_OUTPUT_TOKENS ? parseInt(process.env.GEMINI_MAX_OUTPUT_TOKENS, 10) : 4000,
  },
} as const;
