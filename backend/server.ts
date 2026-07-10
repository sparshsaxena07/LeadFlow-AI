import app from "./app";
import { env } from "./config/env";
import { logger } from "@/utils/logger";

const PORT = env.PORT;

const server = app.listen(PORT, () => {
  logger.info(`GrowEasy CSV Importer backend running in ${env.NODE_ENV} mode on port ${PORT}`);
});

// Graceful Shutdown Handler
const gracefulShutdown = (signal: string) => {
  logger.info(`Received ${signal}. Shutting down gracefully...`);
  server.close(() => {
    logger.info("Closed out remaining connections.");
    process.exit(0);
  });

  // Force close after 10 seconds
  setTimeout(() => {
    logger.error("Could not close connections in time, forcefully shutting down");
    process.exit(1);
  }, 10000);
};

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

