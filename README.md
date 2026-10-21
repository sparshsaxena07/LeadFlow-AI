# LeadFlow AI

An intelligent, robust, and explainable AI-powered CSV ingestion engine designed to transform messy, unstructured lead data into pristine CRM records.

---

## Overview

The **LeadFlow AI** bridges the gap between chaotic real-world data exports (like Facebook Leads, Google Ads, or custom marketing platforms) and strict CRM schemas. Instead of relying on brittle manual column mapping, LeadFlow AI utilizes a deterministic **Header Intelligence Engine** alongside an **AI Extraction Pipeline** (powered by Gemini/OpenAI) to intelligently parse, normalize, and validate lead data with absolute transparency.

## Problem Statement

Sales and marketing teams frequently export lead data from disparate platforms. These CSVs inevitably contain:
- Unpredictable or messy header names (e.g., `wh3re d1d y0u h3ar ab0ut us?`)
- Extraneous metadata columns
- Multiple ambiguous fields (e.g., `Work Email` vs `Personal Email`)
- Formatting anomalies (e.g., phone numbers as `+1 (555) 000-1111`)
- Missing critical CRM requirements

Traditional importers fail because they rely on exact string matching or force users to manually map every single column, which is tedious and error-prone.

## Challenges

1. **Unpredictability**: CSVs have no standard schema.
2. **AI Hallucinations**: Large Language Models can creatively "invent" data or misformat JSON, breaking automated pipelines.
3. **Data Loss**: If a column isn't mapped, its context might be lost entirely.
4. **Validation Strictness**: CRMs require pristine ISO dates, exact enums, and sanitized text.

## Key Features

- **Automated AI Extraction**: Intelligently identifies names, emails, phones, and complex statuses using contextual LLM evaluation.
- **Deterministic Explainability Layer**: Explains exactly *how* and *why* a CSV column was mapped.
- **Smart Date Normalization**: Automatically converts various date formats (DD/MM/YYYY, MM/DD/YYYY, timestamps) into strict ISO 8601 strings.
- **Robust Zod Validation**: Ensures the final output complies perfectly with the target CRM schema.
- **Batch Processing**: Efficiently chunks massive CSV files to stay within AI provider token and rate limits.
- **Auto-Retries**: Gracefully handles AI API rate limits (e.g., HTTP 429) using Google RPC RetryInfo exponential backoffs.

---

## Architecture

The system operates on a dual-engine architecture:

```text
                CSV Upload
                     │
                     ▼
             CSV Validation
                     │
                     ▼
          Header Intelligence
       ┌──────────┴──────────┐
       ▼                     ▼
Deterministic Mapping   Explainability
       │
       ▼
 Prompt Builder
       │
       ▼
  AI Provider
(OpenAI / Gemini)
       │
       ▼
 Response Parser
       │
       ▼
  CRM Validator
       │
       ▼
  Normalization
       │
       ▼
 Final CRM Records
```

### Header Intelligence Engine
Analyzes raw CSV headers and deterministically assigns them to CRM fields through a 4-stage pipeline:
1. **Normalization**: Strips spaces, casing, and punctuation.
2. **Dictionary**: Matches against extensive known CRM/Sales dictionaries.
3. **Similarity**: Uses Jaro-Winkler distance to evaluate strings dynamically.
4. **Fallback**: Leaves unmappable headers as `UNKNOWN` so the AI can still use their contextual values during extraction.

### Explainability Engine
Serves as the Single Source of Truth for the UI. It returns structured confidence metrics (0.0 to 1.0), matched fields, and human-readable explanation strings detailing *why* the engine made its decision.

### AI Extraction Pipeline
Chunks records, builds the context payload, and interfaces with `gemini-1.5-pro` (or OpenAI). It instructs the model to return strict, sanitized JSON arrays.

### Prompt Engineering Strategy
Utilizes highly specific, constraint-driven system prompts. It injects the detected headers to focus the LLM's attention and enforces strict schema compliance (e.g., "Do not hallucinate data. If a field cannot be reliably inferred, return null").

### CRM Validation Layer
Leverages `Zod` schemas to guarantee data structure. Automatically sanitizes CSV Injection artifacts (`=`, `+`, `-`, `@`) and strips unreadable phone formatting.

### Date Normalization
A dedicated sub-system intercepts dates before Zod validation. It intercepts common DD/MM/YYYY and unix timestamps, shielding the system from fatal `z.datetime()` parsing errors.

---

## Engineering Decisions

- **Why deterministic header matching before AI?** To save tokens, improve extraction latency, and anchor the LLM with definitive guidance, severely reducing hallucination probability.
- **Why confidence scoring?** So users can visually trust green/dictionary matches implicitly, while paying closer attention to orange/similarity matches.
- **Why normalize dates before validation?** LLMs output dates in unpredictable formats based on regional biases. Pre-normalization provides resilience against these format shifts.
- **Why Zod?** Type-safety and exhaustive runtime validation.
- **Why batch processing & retries?** LLMs have strict context windows and rate limits. Chunking the CSV into batches and natively parsing Google RPC `RetryInfo` guarantees enterprise-scale stability.
- **Why single source of truth?** By generating reason strings natively in the backend, we guarantee that the frontend dashboard strictly reflects backend logic, avoiding duplicate logic drift.

---

## Technology Stack

- **Frontend**: Next.js 15, React, Tailwind CSS, Lucide React
- **Backend**: Node.js, Express, TypeScript
- **Validation**: Zod
- **Parsing**: PapaParse
- **AI Integration**: Google Gemini SDK (`@google/genai`), OpenAI SDK

---

## Project Structure

```text
├── backend
│   ├── src/
│   │   ├── controllers/      # Route handlers
│   │   ├── models/           # Types and DTOs
│   │   ├── prompts/          # System instructions for LLM
│   │   ├── routes/           # Express routers
│   │   ├── schemas/          # Zod CRM schema
│   │   ├── services/         # Core logic (CSV, AI, Validation)
│   │   └── utils/            # Logging
├── frontend
│   ├── app/                  # Next.js app router
│   ├── components/           # React UI components (Dashboard, Preview)
│   ├── lib/                  # Shared utilities
│   └── services/             # Axios API client
├── docs/                     # Detailed technical documentation
├── samples/                  # Example CSV datasets
└── tests/                    # Integration and unit tests
```

---

## Running Locally

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment Variables**:
   Copy the example files and supply your AI Keys.
   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   ```

3. **Start the Backend**:
   ```bash
   npm run dev -w backend
   ```

4. **Start the Frontend**:
   ```bash
   npm run dev -w frontend
   ```

## Deployment Guide

### Frontend (Vercel)
The Next.js application requires zero configuration for Vercel. Ensure `NEXT_PUBLIC_API_URL` is configured in the Vercel dashboard.

### Backend (Railway / Render)
The backend is completely container-ready. 
- **Railway**: A native `railway.toml` is included. It uses Nixpacks to automatically detect and build the Node environment.
- **Environment**: Supply `PORT`, `FRONTEND_URL`, and your chosen `AI_PROVIDER` + `API_KEY`.
- **Production Safety**: Includes `helmet`, dynamic `cors` routing, graceful shutdowns, and unified `morgan` logging.

---

## Testing

Run the full integration test suite across diverse real-world datasets:
```bash
npm run test:datasets
```

Run specific unit tests for the Header Intelligence engine:
```bash
npx tsx tests/backend/headerIntelligence.test.ts
```

## Sample CSV Datasets
A full suite of dummy data is available in the [`/samples`](./samples) directory representing Facebook Leads, Google Ads, Real Estate CRMs, and deeply messy exports.

## Screenshots
A comprehensive list of required UI screenshots is referenced in [`README_ASSETS.md`](./README_ASSETS.md).

## License
MIT

## Contributors
LeadFlow AI Team
