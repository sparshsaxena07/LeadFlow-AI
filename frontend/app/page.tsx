"use client";

import React, { useState, useMemo } from "react";
import toast from "react-hot-toast";
import { RotateCcw, AlertTriangle, RefreshCw } from "lucide-react";
import { apiClient } from "@/services/api/client";
import { API_ROUTES } from "@/constants";

// Import modular components
import { Hero } from "@/components/layout/Hero";
import { UploadCard } from "@/components/upload/UploadCard";
import { FileSummary } from "@/components/preview/FileSummary";
import { AIAnalysis } from "@/components/preview/AIAnalysis";
import { PreviewTable } from "@/components/preview/PreviewTable";
import { ConfirmCard } from "@/components/preview/ConfirmCard";
import { ProcessingTimeline } from "@/components/process/ProcessingTimeline";
import { ResultsDashboard } from "@/components/results/ResultsDashboard";
import { ImportedRecordsTable } from "@/components/results/ImportedRecordsTable";
import { SkippedRecordsTable } from "@/components/results/SkippedRecordsTable";

// --- TYPES ---
interface HeaderMapping {
  originalHeader: string;
  normalizedHeader: string;
  mappedField: string;
  confidence: number;
  matchingMethod: "dictionary" | "similarity" | "ai_assisted" | "unknown";
  reason: string;
}

interface UploadResponse {
  success: boolean;
  headers: string[];
  preview: Array<{
    rowNumber: number;
    normalized: Record<string, string | null>;
  }>;
  totalRows: number;
  headerMappings: HeaderMapping[];
}

interface CRMRecord {
  created_at: string | null;
  name: string | null;
  email: string | null;
  country_code: string | null;
  mobile_without_country_code: string | null;
  company: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  lead_owner: string | null;
  crm_status: string | null;
  crm_note: string | null;
  data_source: string | null;
  possession_time: string | null;
  description: string | null;
}

interface SkippedRecord {
  rowNumber: number;
  reason: string;
}

interface ProcessResponse {
  success: boolean;
  imported: number;
  skipped: SkippedRecord[];
  records: CRMRecord[];
}

type WorkflowState = "idle" | "preview" | "processing" | "completed" | "error";

interface ProcessingStep {
  id: number;
  label: string;
  description: string;
  status: "idle" | "loading" | "complete" | "failed";
}

interface ErrorDetails {
  code: string;
  message: string;
}

export default function HomePage() {
  // --- STATE MACHINE ---
  const [workflowState, setWorkflowState] = useState<WorkflowState>("idle");
  const [file, setFile] = useState<File | null>(null);
  const [fileSizeStr, setFileSizeStr] = useState<string>("");
  const [uploadData, setUploadData] = useState<UploadResponse | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [processData, setProcessData] = useState<ProcessResponse | null>(null);
  
  // Custom Error holder state
  const [errorDetails, setErrorDetails] = useState<ErrorDetails | null>(null);

  // Quota exceeded state holder
  const [quotaExceededInfo, setQuotaExceededInfo] = useState<{ retryAfter: number } | null>(null);

  // Countdown timer for quota retryAfter
  React.useEffect(() => {
    if (!quotaExceededInfo) return;
    if (quotaExceededInfo.retryAfter <= 0) return;

    const timer = setInterval(() => {
      setQuotaExceededInfo((prev) => {
        if (!prev) return null;
        if (prev.retryAfter <= 1) {
          clearInterval(timer);
          return { retryAfter: 0 };
        }
        return { retryAfter: prev.retryAfter - 1 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quotaExceededInfo]);

  // Search filter query
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Processing timeline steps mapping
  const [steps, setSteps] = useState<ProcessingStep[]>([
    { id: 1, label: "Upload", description: "Buffered and uploaded file payload", status: "complete" },
    { id: 2, label: "Parsing", description: "Parsed raw lines from CSV formatting", status: "complete" },
    { id: 3, label: "Header Analysis", description: "Detecting likely semantic columns", status: "idle" },
    { id: 4, label: "Prompt Generation", description: "Assembling system prompt payload", status: "idle" },
    { id: 5, label: "AI Extraction", description: "Executing Gemini mapping models", status: "idle" },
    { id: 6, label: "Validation", description: "Verifying outputs against CRM schema", status: "idle" },
    { id: 7, label: "Finalizing", description: "Writing results database summary", status: "idle" }
  ]);

  // --- ACTIONS ---
  const handleFileUploaded = (data: UploadResponse, uploadedFile: File) => {
    setFile(uploadedFile);
    setUploadData(data);

    // Format size
    const kb = uploadedFile.size / 1024;
    if (kb < 1024) {
      setFileSizeStr(`${kb.toFixed(1)} KB`);
    } else {
      setFileSizeStr(`${(kb / 1024).toFixed(1)} MB`);
    }

    setWorkflowState("preview");
    toast.success("Preview ready for column mapping.");
  };

  const handleConfirmImport = async () => {
    if (!file) return;
    setWorkflowState("processing");
    toast.loading("Import started. Mapping leads...", { id: "import-process" });

    // Initiate progress stepper timeline simulation
    setSteps((prev) =>
      prev.map((s) => (s.id === 3 ? { ...s, status: "loading" } : s))
    );

    const timeouts: NodeJS.Timeout[] = [];

    // Step 3 -> 4
    timeouts.push(
      setTimeout(() => {
        setSteps((prev) =>
          prev.map((s) => {
            if (s.id === 3) return { ...s, status: "complete" };
            if (s.id === 4) return { ...s, status: "loading" };
            return s;
          })
        );
      }, 800)
    );

    // Step 4 -> 5
    timeouts.push(
      setTimeout(() => {
        setSteps((prev) =>
          prev.map((s) => {
            if (s.id === 4) return { ...s, status: "complete" };
            if (s.id === 5) return { ...s, status: "loading" };
            return s;
          })
        );
      }, 2000)
    );

    // Step 5 -> 6
    timeouts.push(
      setTimeout(() => {
        setSteps((prev) =>
          prev.map((s) => {
            if (s.id === 5) return { ...s, status: "complete" };
            if (s.id === 6) return { ...s, status: "loading" };
            return s;
          })
        );
      }, 4500)
    );

    // Step 6 -> 7
    timeouts.push(
      setTimeout(() => {
        setSteps((prev) =>
          prev.map((s) => {
            if (s.id === 6) return { ...s, status: "complete" };
            if (s.id === 7) return { ...s, status: "loading" };
            return s;
          })
        );
      }, 6000)
    );

    // Fire processing request
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await apiClient.post<ProcessResponse>(API_ROUTES.PROCESS, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      // Clear timers
      timeouts.forEach((t) => clearTimeout(t));

      // Mark everything as complete
      setSteps((prev) => prev.map((s) => ({ ...s, status: "complete" })));

      setTimeout(() => {
        setProcessData(response.data);
        setWorkflowState("completed");
        toast.success("Import completed successfully!", { id: "import-process" });
      }, 600);
    } catch (err: any) {
      console.error(err);
      timeouts.forEach((t) => clearTimeout(t));

      // Check if it is a Gemini rate limit error
      const quotaError = err.response?.data?.error;
      if (quotaError && quotaError.code === "GEMINI_QUOTA_EXCEEDED") {
        setSteps((prev) =>
          prev.map((s) => (s.status === "loading" ? { ...s, status: "idle" } : s))
        );
        setQuotaExceededInfo({ retryAfter: quotaError.retryAfter || 60 });
        setWorkflowState("preview"); // Set back to preview to retain data!
        toast.error("Gemini API rate limit exceeded.", { id: "import-process" });
        return;
      }

      // Mark active loaders as failed
      setSteps((prev) =>
        prev.map((s) => (s.status === "loading" ? { ...s, status: "failed" } : s))
      );

      const code = err.response?.data?.errors?.[0]?.code || "PROCESSING_FAILED";
      const message = err.response?.data?.errors?.[0]?.message || "Backend service mapping failed or Gemini API timed out. Please check logs.";
      
      setErrorDetails({ code, message });
      setWorkflowState("error");
      toast.error("Import failed.", { id: "import-process" });
    }
  };

  const handleReset = () => {
    setFile(null);
    setFileSizeStr("");
    setUploadData(null);
    setProcessData(null);
    setSearchQuery("");
    setErrorDetails(null);
    setWorkflowState("idle");

    // Reset checklist timeline states
    setSteps([
      { id: 1, label: "Upload", description: "Buffered and uploaded file payload", status: "complete" },
      { id: 2, label: "Parsing", description: "Parsed raw lines from CSV formatting", status: "complete" },
      { id: 3, label: "Header Analysis", description: "Detecting likely semantic columns", status: "idle" },
      { id: 4, label: "Prompt Generation", description: "Assembling system prompt payload", status: "idle" },
      { id: 5, label: "AI Extraction", description: "Executing Gemini mapping models", status: "idle" },
      { id: 6, label: "Validation", description: "Verifying outputs against CRM schema", status: "idle" },
      { id: 7, label: "Finalizing", description: "Writing results database summary", status: "idle" }
    ]);
  };

  // --- EXPORT TO CSV CONTROLS ---
  const handleExportCSV = () => {
    if (!processData || processData.records.length === 0) return;

    const headers = [
      "created_at",
      "name",
      "email",
      "country_code",
      "mobile_without_country_code",
      "company",
      "city",
      "state",
      "country",
      "lead_owner",
      "crm_status",
      "crm_note",
      "data_source",
      "possession_time",
      "description"
    ];

    const csvContent = [
      headers.join(","),
      ...processData.records.map((r) =>
        headers
          .map((headerName) => {
            const rawVal = r[headerName as keyof CRMRecord];
            let valStr = rawVal === null || rawVal === undefined ? "" : String(rawVal);
            
            // CSV Injection Protection: prefix cells starting with =, +, -, @ with a single quote
            if (headerName !== "country_code") {
              const trimmed = valStr.trim();
              if (
                (trimmed.startsWith("=") ||
                 trimmed.startsWith("+") ||
                 trimmed.startsWith("-") ||
                 trimmed.startsWith("@")) &&
                !trimmed.startsWith("'")
              ) {
                valStr = `'${valStr}`;
              }
            }

            const escaped = valStr.replace(/"/g, '""');
            return escaped.includes(",") || escaped.includes('"') || escaped.includes("\n")
              ? `"${escaped}"`
              : escaped;
          })
          .join(",")
      )
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `groweasy_imported_leads_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV exported successfully.");
  };

  // --- SUMMARY STATS & INSIGHTS ---
  const headerMappings = useMemo(() => {
    if (!uploadData || !uploadData.headerMappings) return [];
    return uploadData.headerMappings;
  }, [uploadData]);

  const unknownColumns = useMemo(() => {
    return headerMappings
      .filter((m) => m.mappedField === "UNKNOWN")
      .map((m) => m.originalHeader);
  }, [headerMappings]);

  const stats = useMemo(() => {
    if (!processData || !uploadData) return { imported: 0, skipped: 0, rate: 0, batches: 0 };
    const imported = processData.imported;
    const total = uploadData.totalRows;
    const skipped = processData.skipped ? processData.skipped.length : total - imported;
    const rate = total > 0 ? Math.round((imported / total) * 100) : 0;
    const batches = Math.ceil(total / 20);

    return { imported, skipped, rate, batches };
  }, [processData, uploadData]);

  const insights = useMemo(() => {
    if (!processData) return { sources: [], commonStatus: "N/A" };

    const sources = Array.from(
      new Set(
        processData.records
          .map((r) => r.data_source)
          .filter((s): s is string => !!s)
      )
    );

    const statuses = processData.records
      .map((r) => r.crm_status)
      .filter((s): s is string => !!s);

    let commonStatus = "N/A";
    if (statuses.length > 0) {
      const freq: Record<string, number> = {};
      statuses.forEach((st) => {
        freq[st] = (freq[st] || 0) + 1;
      });
      commonStatus = Object.keys(freq).reduce((a, b) => (freq[a] > freq[b] ? a : b));
    }

    return { sources, commonStatus };
  }, [processData]);

  // Filters imported records list using memoized logic
  const filteredRecords = useMemo(() => {
    if (!processData) return [];
    if (!searchQuery.trim()) return processData.records;

    const q = searchQuery.toLowerCase();
    return processData.records.filter((r) => {
      const nameMatch = r.name?.toLowerCase().includes(q);
      const emailMatch = r.email?.toLowerCase().includes(q);
      const companyMatch = r.company?.toLowerCase().includes(q);
      const phoneMatch = r.mobile_without_country_code?.toLowerCase().includes(q);
      return nameMatch || emailMatch || companyMatch || phoneMatch;
    });
  }, [processData, searchQuery]);

  return (
    <div className="flex-grow flex flex-col bg-slate-50/50">
      {/* Hero Title */}
      <Hero />

      {/* Main Orchestrator Workspace */}
      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 w-full flex-grow flex flex-col justify-start">
        
        {/* ==================== STAGE: IDLE ==================== */}
        {workflowState === "idle" && (
          <UploadCard
            onFileUploaded={handleFileUploaded}
            isUploading={isUploading}
            setIsUploading={setIsUploading}
          />
        )}

        {/* ==================== STAGE: PREVIEW ==================== */}
        {workflowState === "preview" && uploadData && (
          <div className="flex flex-col space-y-8 w-full">
            <FileSummary
              filename={file?.name || "leads_list.csv"}
              rows={uploadData.totalRows}
              columns={uploadData.headers.length}
              fileSizeStr={fileSizeStr}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
              <div className="h-full">
                <AIAnalysis headers={uploadData.headers} />
              </div>

              <div className="lg:col-span-2 h-full">
                <PreviewTable
                  headers={uploadData.headers}
                  previewRows={uploadData.preview}
                />
              </div>
            </div>

            <ConfirmCard
              totalRows={uploadData.totalRows}
              onConfirm={handleConfirmImport}
              onCancel={handleReset}
              disabled={false}
            />
          </div>
        )}

        {/* ==================== STAGE: PROCESSING ==================== */}
        {workflowState === "processing" && (
          <div className="w-full flex-grow flex items-center justify-center py-10">
            <ProcessingTimeline steps={steps} />
          </div>
        )}

        {/* ==================== STAGE: COMPLETED ==================== */}
        {workflowState === "completed" && processData && uploadData && (
          <div className="flex flex-col space-y-8 w-full">
            <ResultsDashboard
              stats={stats}
              insights={insights}
              headerMappings={headerMappings}
            />

            <ImportedRecordsTable
              records={filteredRecords}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onExport={handleExportCSV}
            />

            <SkippedRecordsTable
              skipped={processData.skipped || []}
            />

            {/* Back to upload controls */}
            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={handleReset}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-850 text-white rounded-lg text-xs font-semibold shadow-sm flex items-center space-x-2 transition"
                aria-label="Import another CSV spreadsheet"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Import Another File</span>
              </button>
            </div>
          </div>
        )}

        {/* ==================== STAGE: ERROR SCREEN ==================== */}
        {workflowState === "error" && errorDetails && (
          <div className="w-full max-w-xl mx-auto bg-white border border-slate-200 rounded-xl p-8 shadow-sm flex flex-col items-center text-center animate-in zoom-in-95 duration-200 my-auto">
            <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-slate-850">Import Pipeline Failed</h3>
            <span className="text-[10px] bg-rose-50 text-rose-700 px-2 py-0.5 rounded border border-rose-150 uppercase font-semibold mt-2">
              Error Code: {errorDetails.code}
            </span>

            <p className="text-slate-550 text-xs mt-4 leading-relaxed max-w-sm">
              {errorDetails.message}
            </p>

            <div className="mt-8 flex items-center space-x-3 w-full">
              <button
                type="button"
                onClick={handleReset}
                className="flex-1 px-4 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold shadow-sm transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmImport}
                className="flex-1 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-sm flex items-center justify-center space-x-1.5 transition"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry Import</span>
              </button>
            </div>
          </div>
        )}

        {/* Friendly Quota Exceeded Modal */}
        {quotaExceededInfo !== null && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-lg max-w-md w-full flex flex-col items-center text-center animate-in zoom-in-95 duration-200">
              <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 mb-4 animate-pulse">
                <AlertTriangle className="w-6 h-6" />
              </div>

              <h3 className="text-sm font-bold text-slate-850">AI Service Quota Exceeded</h3>
              <p className="text-slate-550 text-xs mt-3 leading-relaxed">
                We've hit Gemini's API rate limits. Please wait for the countdown timer to finish before retrying the lead mapping.
              </p>

              {/* Countdown Display */}
              <div className="my-6 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-mono text-xs font-semibold">
                {quotaExceededInfo.retryAfter > 0 ? (
                  <span>Retry available in {quotaExceededInfo.retryAfter}s</span>
                ) : (
                  <span className="text-emerald-700">Ready to retry!</span>
                )}
              </div>

              <div className="flex items-center space-x-3 w-full mt-2">
                <button
                  type="button"
                  onClick={() => {
                    setQuotaExceededInfo(null);
                    setSteps((prev) =>
                      prev.map((s) => (s.id >= 3 ? { ...s, status: "idle" } : s))
                    );
                  }}
                  className="flex-1 px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold shadow-sm transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={quotaExceededInfo.retryAfter > 0}
                  onClick={() => {
                    setQuotaExceededInfo(null);
                    handleConfirmImport();
                  }}
                  className="flex-1 px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-350 disabled:text-slate-450 disabled:cursor-not-allowed text-white rounded-lg text-xs font-semibold shadow-sm transition flex items-center justify-center"
                >
                  Retry Import
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
