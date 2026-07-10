import dotenv from "dotenv";
import path from "path";

// Locate and load the environment variables from the .env file
dotenv.config({ path: path.resolve(__dirname, "../.env") });

export const env = {
  PORT: parseInt(process.env.PORT || "5000", 10),
  NODE_ENV: process.env.NODE_ENV || "development",
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:3000",
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || "",
  isDev: (process.env.NODE_ENV || "development") === "development",
  isProd: (process.env.NODE_ENV || "development") === "production",
} as const;

// Proactively log warning if API key is missing
if (!env.GEMINI_API_KEY || env.GEMINI_API_KEY === "your_gemini_api_key_here") {
  console.warn("[Config Warning]: GEMINI_API_KEY is not configured or uses placeholder.");
}
