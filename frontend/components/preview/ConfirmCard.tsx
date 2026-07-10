import React from "react";
import { FileSpreadsheet, Sparkles, Loader2 } from "lucide-react";

interface ConfirmCardProps {
  totalRows: number;
  onConfirm: () => void;
  onCancel: () => void;
  disabled?: boolean;
}

export function ConfirmCard({ totalRows, onConfirm, onCancel, disabled = false }: ConfirmCardProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-3 duration-250">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-650">
          <FileSpreadsheet className="w-5 h-5 text-indigo-600" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-slate-800">Ready to Import</h4>
          <p className="text-xs text-slate-550">
            Detected {totalRows} lead records in files context. Press confirm to run the AI mapping client.
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-3 w-full sm:w-auto">
        <button
          type="button"
          onClick={onCancel}
          disabled={disabled}
          className="flex-1 sm:flex-none px-4 py-2 border border-slate-200 hover:bg-slate-50 disabled:bg-slate-50 disabled:text-slate-400 text-slate-700 rounded-lg text-xs font-semibold shadow-sm transition disabled:cursor-not-allowed"
          aria-label="Cancel and start over"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={disabled}
          className="flex-1 sm:flex-none px-5 py-2 bg-slate-900 hover:bg-slate-850 disabled:bg-slate-400 text-white rounded-lg text-xs font-semibold shadow-sm flex items-center justify-center space-x-2 transition disabled:cursor-not-allowed"
          aria-label="Confirm import process"
        >
          {disabled ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Sparkles className="w-3.5 h-3.5" />
          )}
          <span>{disabled ? "Starting Ingestion..." : "Confirm Import"}</span>
        </button>
      </div>
    </div>
  );
}
