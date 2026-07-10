/**
 * Common type definitions and interface declarations for the frontend.
 */
export interface LeadRecord {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  [key: string]: unknown;
}

export interface ValidationError {
  row: number;
  column: string;
  message: string;
}
