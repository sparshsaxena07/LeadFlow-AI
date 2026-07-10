import { env } from "./env";

/**
 * Configuration options placeholder for Google Gemini API client.
 * The Google GenAI client (`@google/genai`) will be initialized using these parameters.
 */
export const geminiConfig = {
  apiKey: env.GEMINI_API_KEY,
  defaultModel: "gemini-2.5-flash",
  generationConfig: {
    temperature: 0.1,
    responseMimeType: "application/json",
  },
};
