import express, { Express, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env";
import { logger } from "@/utils/logger";

const app: Express = express();

// Configure Middleware
app.use(helmet());
app.use(cors({
  origin: env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
}));
app.use(morgan(env.isDev ? "dev" : "combined"));
app.use(express.json());

// Health Check Route
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "LeadFlow AI Backend Running",
  });
});

import importRouter from "@/routes/import.route";

// Register Routes
app.use("/api", importRouter);

// 404 Handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Endpoint not found",
  });
});

// Global Error Handler
app.use((err: Error, _req: Request, res: Response, _next: express.NextFunction) => {
  logger.error("Global Error Handler caught error", err);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

export default app;
