import React from "react";
import { Activity, Check } from "lucide-react";

interface ProcessingStep {
  id: number;
  label: string;
  description: string;
  status: "idle" | "loading" | "complete" | "failed";
}

interface ProcessingTimelineProps {
  steps: ProcessingStep[];
}

export function ProcessingTimeline({ steps }: ProcessingTimelineProps) {
  return (
    <div className="w-full max-w-xl mx-auto bg-white border border-slate-200 rounded-xl p-8 shadow-sm flex flex-col animate-in zoom-in-95 duration-250">
      <div className="text-center mb-8">
        <Activity className="w-8 h-8 text-indigo-650 animate-pulse mx-auto mb-3" />
        <h3 className="text-base font-bold text-slate-850">Processing Ingestion Pipeline</h3>
        <p className="text-slate-500 text-xs max-w-sm mx-auto mt-1 leading-relaxed">
          Gemini is analyzing the header semantics, extracting data fields, parsing formats, and enforcing validations.
        </p>
      </div>

      <div className="space-y-6 pl-4 border-l-2 border-slate-100 relative">
        {steps.map((step) => {
          const isLoading = step.status === "loading";
          const isComplete = step.status === "complete";
          const isFailed = step.status === "failed";

          return (
            <div key={step.id} className="relative pl-6">
              {/* Status Indicator Circle */}
              <div
                className={`absolute -left-[31px] top-0.5 w-[14px] h-[14px] rounded-full border-2 flex items-center justify-center transition-colors duration-250 ${
                  isComplete
                    ? "bg-slate-900 border-slate-900"
                    : isLoading
                    ? "bg-indigo-50 border-indigo-600 animate-pulse"
                    : isFailed
                    ? "bg-rose-105 border-rose-600"
                    : "bg-white border-slate-200"
                }`}
              >
                {isComplete && <Check className="w-2 h-2 text-white" />}
              </div>

              <div className="flex flex-col">
                <span
                  className={`text-xs font-semibold ${
                    isLoading ? "text-indigo-650" : isComplete ? "text-slate-800" : "text-slate-400"
                  }`}
                >
                  {step.label}
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5">
                  {step.description}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
