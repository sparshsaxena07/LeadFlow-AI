import { aiConfig } from "../../../../config/ai";
import { AIProvider } from "./AIProvider";
import { GeminiProvider } from "./GeminiProvider";
import { OpenAIProvider } from "./OpenAIProvider";

export class AIProviderFactory {
  static create(): AIProvider {
    const provider = aiConfig.provider.toLowerCase();
    if (provider === "openai") {
      return new OpenAIProvider();
    }
    return new GeminiProvider();
  }
}
