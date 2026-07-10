import { Router } from "express";
import multer from "multer";
import rateLimit from "express-rate-limit";
import { ImportController } from "@/controllers/import.controller";

const router = Router();
const controller = new ImportController();

// Limit each IP to 30 requests per 15 minutes window for the CPU/API-heavy process route
const processLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 30, // Limit each IP to 30 requests
  message: {
    success: false,
    errors: [
      {
        code: "RATE_LIMIT_EXCEEDED",
        message: "Too many import requests from this IP. Please try again after 15 minutes.",
      },
    ],
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Configure multer to parse multipart/form-data using memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// Map endpoint POST /import/upload (mounted relative to /api base)
router.post("/import/upload", upload.single("file"), controller.uploadCSV);

// Map endpoint POST /import/process (mounted relative to /api base) with rate limiting
router.post("/import/process", processLimiter, upload.single("file"), controller.processCSV);

export default router;
