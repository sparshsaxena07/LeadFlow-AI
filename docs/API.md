# LeadFlow AI API Documentation

The backend exposes two primary endpoints to facilitate the ingestion, preview, and AI extraction of CSV files.

---

## 1. Upload & Preview CSV

**Endpoint:** `POST /api/import/upload`  
**Content-Type:** `multipart/form-data`

Uploads a raw CSV file. The backend parses the structure, analyzes the headers deterministically, and returns a preview and explainability metrics.

### Request Body
Must be formatted as `multipart/form-data`.
- **`file`**: The raw `.csv` file.

### Successful Response (200 OK)
```json
{
  "success": true,
  "headers": ["Project", "Email", "Unknown Col"],
  "preview": [
    { "rowNumber": 1, "record": { "Project": "Alpha", "Email": "a@x.com", "Unknown Col": "val" } }
  ],
  "totalRows": 150,
  "headerMappings": [
    {
      "originalHeader": "Project",
      "normalizedHeader": "project",
      "mappedField": "data_source",
      "confidence": 1,
      "matchingMethod": "dictionary",
      "reason": "Matched known project synonym."
    }
  ]
}
```

### Error Responses

**400 Bad Request** (e.g., File is empty, wrong format, or too large)
```json
{
  "success": false,
  "errors": [
    {
      "code": "EMPTY_FILE",
      "message": "The uploaded CSV file is empty."
    }
  ]
}
```

---

## 2. Process & Extract CSV via AI

**Endpoint:** `POST /api/import/process`  
**Content-Type:** `multipart/form-data`

Executes the full pipeline: parsing, preprocessing, batching, LLM extraction (via Gemini/OpenAI), JSON decoding, and rigorous CRM validation.

### Request Body
Must be formatted as `multipart/form-data`.
- **`file`**: The raw `.csv` file.

### Successful Response (200 OK)
```json
{
  "success": true,
  "imported": 1,
  "skipped": [],
  "records": [
    {
      "name": "Eren Yeager",
      "email": "eren@surveycorps.gov",
      "mobile_without_country_code": "5551001",
      "data_source": "Recruitment Drive",
      "company": "Survey Corps",
      "crm_status": "Active",
      "created_at": "2026-01-01T00:00:00.000Z",
      "rowNumber": 1
    }
  ]
}
```

### Error Responses

**429 Too Many Requests** (AI Provider Quota Exceeded)
```json
{
  "success": false,
  "error": {
    "code": "GEMINI_QUOTA_EXCEEDED",
    "message": "Gemini API quota exceeded. Please retry later.",
    "retryAfter": 60
  }
}
```

**400 Bad Request** (Data Validation or Extractor Error)
```json
{
  "success": false,
  "errors": [
    {
      "code": "PROCESSING_ERROR",
      "message": "An unexpected error occurred while processing lead records."
    }
  ]
}
```

---

## Headers & Authentication
Currently, no authentication is strictly enforced on the endpoints themselves beyond typical CORS checks. However, in production environments:
- The backend ensures requests originate from `FRONTEND_URL`.
- The backend interfaces with external AI services using internal secret keys (`GEMINI_API_KEY` / `OPENAI_API_KEY`) safely abstracted from the client.
