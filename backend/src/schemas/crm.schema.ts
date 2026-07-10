import { z } from "zod";
import { CRMStatus } from "../shared/enums/CRMStatus";
import { DataSource } from "../shared/enums/DataSource";

/**
 * Zod validation schema for GrowEasy CRM records.
 * Checks email formatting, mobile expressions, date times, and enum values.
 */
export const crmRecordSchema = z.object({
  rowNumber: z.number().nullable().optional(),
  confidence: z.number().min(0).max(1).nullable().optional(),
  created_at: z
    .string()
    .datetime({ message: "created_at must be a valid ISO 8601 date string" })
    .nullable()
    .optional(),
  name: z.string().nullable().optional(),
  email: z
    .string()
    .email({ message: "Invalid email format" })
    .nullable()
    .optional(),
  country_code: z
    .string()
    .regex(/^\+\d{1,4}$/, { message: "country_code must match country dialing code prefix (e.g. +91)" })
    .nullable()
    .optional(),
  mobile_without_country_code: z
    .string()
    .regex(/^\d{8,12}$/, { message: "mobile_without_country_code must be a digit sequence of length 8 to 12" })
    .nullable()
    .optional(),
  company: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  state: z.string().nullable().optional(),
  country: z.string().nullable().optional(),
  lead_owner: z.string().nullable().optional(),
  crm_status: z.nativeEnum(CRMStatus, { message: "Invalid CRM Status value" }).nullable().optional(),
  crm_note: z.string().nullable().optional(),
  data_source: z.nativeEnum(DataSource, { message: "Invalid Data Source value" }).nullable().optional(),
  possession_time: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
});

export type CRMRecordInput = z.infer<typeof crmRecordSchema>;
