import { GoogleGenAI } from "@google/genai";
import { env } from "../../../../config/env";
import { geminiConfig } from "../../../../config/gemini";
import { AIProvider } from "./AIProvider";
import { logger } from "@/utils/logger";

export class GeminiProvider implements AIProvider {
  private ai: GoogleGenAI | null = null;
  private modelName: string;

  constructor() {
    const apiKey = geminiConfig.apiKey;
    if (apiKey && apiKey !== "your_gemini_api_key_here" && apiKey !== "") {
      this.ai = new GoogleGenAI({ apiKey });
    }
    this.modelName = process.env.GEMINI_MODEL || geminiConfig.defaultModel;
  }

  async generate(prompt: string): Promise<string> {
    if (!this.ai) {
      throw new Error("GEMINI_API_KEY is not configured in the environment.");
    }

    const temperature = process.env.GEMINI_TEMPERATURE
      ? parseFloat(process.env.GEMINI_TEMPERATURE)
      : geminiConfig.generationConfig.temperature;
    const topP = process.env.GEMINI_TOP_P
      ? parseFloat(process.env.GEMINI_TOP_P)
      : 0.1;
    const maxOutputTokens = process.env.GEMINI_MAX_OUTPUT_TOKENS
      ? parseInt(process.env.GEMINI_MAX_OUTPUT_TOKENS, 10)
      : 4000;

    const startTime = Date.now();
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
      throw new Error("Received empty response from Gemini API.");
    }

    console.log("\n========== RAW AI RESPONSE ==========");
    console.log(text);
    console.log("=====================================\n");

    if (env.isDev) {
      const latency = Date.now() - startTime;
      const promptTokens = response.usageMetadata?.promptTokenCount;
      const candidatesTokens = response.usageMetadata?.candidatesTokenCount;
      const totalTokens = response.usageMetadata?.totalTokenCount;

      logger.info(`[AI Log]
Provider: Gemini
Model: ${this.modelName}
Latency: ${latency}ms
Token usage: ${promptTokens ? `Prompt: ${promptTokens}, Completion: ${candidatesTokens}, Total: ${totalTokens}` : "N/A"}
Prompt length: ${prompt.length} chars
Response length: ${text.length} chars`);
    }

    return text;
  }
}
