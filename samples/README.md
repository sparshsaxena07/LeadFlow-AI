# LeadFlow AI — Sample Datasets

This directory contains representative dummy datasets designed to demonstrate the versatility of the **LeadFlow AI** and its **Header Intelligence Engine**.

## Datasets Overview

- **`facebook_leads.csv`**: Demonstrates parsing standard output exports from Facebook/Meta Lead Ads. Highlights extraction of deep platform metadata.
- **`google_ads.csv`**: Demonstrates imports from Google Ads forms, focusing on search keyword parsing, broad ad group categorization, and basic contact extraction.
- **`real_estate.csv`**: Demonstrates domain-specific mapping. Extracts `Possession` (Possession Time), `Unit Description` (Description), and `Project`/`Tower` data accurately.
- **`marketing_agency.csv`**: Standard CRM B2B import. Shows extraction of `Firm` (Company), `Assigned To` (Lead Owner), and complex `Notes`.
- **`messy_headers.csv`**: A stress-test dataset containing extreme typographical errors, heavy punctuation, and excessive spacing. Proves the robustness of the Header Intelligence Engine's normalization and similarity matching.
- **`multiple_emails.csv`**: Tests the AI extractor's capability to intelligently choose the best, primary email out of multiple confusing columns (`Work Email`, `Personal Email`, `Backup Email`).
- **`multiple_phones.csv`**: Tests the AI extractor's ability to choose the best primary phone number, ignoring extraneous columns.
- **`invalid_rows.csv`**: Tests the batching engine and CRM Validation pipeline. Contains rows with missing critical information (no email/phone) and badly formatted emails to verify they are skipped gracefully without crashing the import.
- **`large_dataset.csv`**: Demonstrates the batching pipeline by importing multiple records with consistent CRM structuring. Used to test limits and retry thresholds on the AI Provider.
