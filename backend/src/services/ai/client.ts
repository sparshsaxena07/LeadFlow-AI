import { GoogleGenAI } from "@google/genai";
import { env } from "../../../config/env";

/**
 * Client wrapper responsible for calling the Google GenAI models.
 * Defer api key checks to generator execution to allow clean server startups.
 */
export class AIClient {
  private ai: GoogleGenAI | null = null;
  private modelName: string;

  constructor() {
    const apiKey = env.GEMINI_API_KEY;
    if (apiKey && apiKey !== "your_gemini_api_key_here" && apiKey !== "") {
      this.ai = new GoogleGenAI({ apiKey });
    }
    // Configurable model name through environment, defaulting to gemini-2.5-flash
    this.modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  }

  /**
   * Generates content using the configured Gemini model and prompt.
   * Throws configuration failures on call-time if key is absent.
   */
  async generate(prompt: string): Promise<string> {
    if (!this.ai) {
      throw new Error("GEMINI_API_KEY is not configured in the environment.");
    }

    const temperature = process.env.GEMINI_TEMPERATURE
      ? parseFloat(process.env.GEMINI_TEMPERATURE)
      : 0;
    const topP = process.env.GEMINI_TOP_P
      ? parseFloat(process.env.GEMINI_TOP_P)
      : 0.1;
    const maxOutputTokens = process.env.GEMINI_MAX_OUTPUT_TOKENS
      ? parseInt(process.env.GEMINI_MAX_OUTPUT_TOKENS, 10)
      : 4000;

    const response = await this.ai.models.generateContent({
      model: this.modelName,
      contents: prompt,
      config: {
        temperature,
        topP,
        maxOutputTokens,
        responseMimeType: "application/json",
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("Received empty text response from Gemini API.");
    }

    console.log("\n========== RAW AI RESPONSE ==========");
    console.log(text);
    console.log("=====================================\n");

    return text;
  }
}
