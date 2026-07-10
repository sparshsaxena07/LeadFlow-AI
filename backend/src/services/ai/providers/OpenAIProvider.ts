import OpenAI from "openai";
import { env } from "../../../../config/env";
import { openaiConfig } from "../../../../config/openai";
import { AIProvider } from "./AIProvider";
import { logger } from "@/utils/logger";

export class OpenAIProvider implements AIProvider {
  private openai: OpenAI | null = null;
  private modelName: string;

  constructor() {
    const apiKey = openaiConfig.apiKey;
    if (apiKey && apiKey !== "") {
      this.openai = new OpenAI({ apiKey });
    }
    this.modelName = openaiConfig.defaultModel;
  }

  async generate(prompt: string): Promise<string> {
    if (!this.openai) {
      throw new Error("OPENAI_API_KEY is not configured in the environment.");
    }

    const temperature = openaiConfig.generationConfig.temperature;
    const maxTokens = openaiConfig.generationConfig.maxOutputTokens;
    const topP = openaiConfig.generationConfig.topP;

    const startTime = Date.now();
    const response = await this.openai.chat.completions.create({
      model: this.modelName,
      messages: [{ role: "user", content: prompt }],
      temperature,
      max_tokens: maxTokens,
      top_p: topP,
      response_format: { type: "json_object" },
    });

    const text = response.choices[0]?.message?.content;
    if (!text) {
      throw new Error("Received empty response from OpenAI API.");
    }

    console.log("\n========== RAW AI RESPONSE ==========");
    console.log(text);
    console.log("=====================================\n");

    if (env.isDev) {
      const latency = Date.now() - startTime;
      const usage = response.usage;
      logger.info(`[AI Log]
Provider: OpenAI
Model: ${this.modelName}
Latency: ${latency}ms
Token usage: ${usage ? `Prompt: ${usage.prompt_tokens}, Completion: ${usage.completion_tokens}, Total: ${usage.total_tokens}` : "N/A"}
Prompt length: ${prompt.length} chars
Response length: ${text.length} chars`);
    }

    return text;
  }
}
