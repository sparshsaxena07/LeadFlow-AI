import React from "react";
import { CheckCircle2, AlertCircle, TrendingUp, BarChart3, Sparkles, ArrowRight, Info } from "lucide-react";

export interface HeaderMapping {
  originalHeader: string;
  normalizedHeader: string;
  mappedField: string;
  confidence: number;
  matchingMethod: "dictionary" | "similarity" | "ai_assisted" | "unknown";
  reason: string;
}

interface ResultsDashboardProps {
  stats: {
    imported: number;
    skipped: number;
    rate: number;
    batches: number;
  };
  insights: {
    sources: string[];
    commonStatus: string;
  };
  headerMappings: HeaderMapping[];
}

export function ResultsDashboard({ stats, insights, headerMappings }: ResultsDashboardProps) {
  const dictionaryMatches = headerMappings.filter(m => m.matchingMethod === "dictionary").length;
  const similarityMatches = headerMappings.filter(m => m.matchingMethod === "similarity").length;
  const aiAssistedMatches = headerMappings.filter(m => m.matchingMethod === "ai_assisted").length;
  
  const methodOrder = {
    dictionary: 1,
    similarity: 2,
    ai_assisted: 3,
    unknown: 4
  };

  const sortedMappings = [...headerMappings].sort((a, b) => {
    if (methodOrder[a.matchingMethod] !== methodOrder[b.matchingMethod]) {
      return methodOrder[a.matchingMethod] - methodOrder[b.matchingMethod];
    }
    return b.confidence - a.confidence;
  });

  const unknownHeaders = sortedMappings.filter(m => m.matchingMethod === "unknown");
  const mappedHeaders = sortedMappings.filter(m => m.mappedField !== "UNKNOWN");

  const avgConfidence = headerMappings.length > 0
    ? Math.round((headerMappings.reduce((sum, m) => sum + m.confidence, 0) / headerMappings.length) * 100)
    : 0;

  const detectedCrmFields = Array.from(
    new Set(
      mappedHeaders.map(m => m.mappedField)
    )
  );

  const getConfidenceColor = (conf: number) => {
    const percent = Math.round(conf * 100);
    if (percent >= 95) return "text-emerald-600";
    if (percent >= 80) return "text-blue-600";
    if (percent >= 60) return "text-orange-600";
    return "text-red-600";
  };

  const getMethodBadge = (method: string) => {
    switch (method) {
      case "dictionary":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "similarity":
        return "bg-blue-50 text-blue-700 border-blue-100";
      case "ai_assisted":
        return "bg-purple-50 text-purple-700 border-purple-100";
      default:
        return "bg-orange-50 text-orange-700 border-orange-100";
    }
  };

  return (
    <div className="flex flex-col space-y-8 animate-in fade-in duration-300">
      {/* Top Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Imported Leads</span>
            <span className="text-2xl font-bold text-slate-800 mt-1">{stats.imported}</span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Skipped Leads</span>
            <span className="text-2xl font-bold text-slate-800 mt-1">{stats.skipped}</span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Success Rate</span>
            <span className="text-2xl font-bold text-slate-800 mt-1">{stats.rate}%</span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-750 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-indigo-650" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Processed Batches</span>
            <span className="text-2xl font-bold text-slate-800 mt-1">{stats.batches}</span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-slate-50 text-slate-700 flex items-center justify-center">
            <BarChart3 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* AI Ingestion Insights */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col h-full justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-3 mb-4 flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-indigo-500 animate-pulse" />
              <span>AI Ingestion Insights</span>
            </h3>

            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <span className="text-xs font-medium text-slate-500">Dictionary Matches</span>
                <span className="text-xs font-bold text-slate-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                  {dictionaryMatches}
                </span>
              </div>

              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <span className="text-xs font-medium text-slate-500">Similarity Matches</span>
                <span className="text-xs font-bold text-slate-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                  {similarityMatches}
                </span>
              </div>

              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <span className="text-xs font-medium text-slate-500">AI Assisted Matches</span>
                <span className="text-xs font-bold text-slate-800 bg-purple-50 px-2 py-0.5 rounded border border-purple-100">
                  {aiAssistedMatches}
                </span>
              </div>

              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <span className="text-xs font-medium text-slate-500">Unknown Headers</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded border ${
                  unknownHeaders.length > 0
                    ? "bg-amber-50 text-amber-700 border-amber-100"
                    : "bg-slate-50 text-slate-650 border-slate-200"
                }`}>
                  {unknownHeaders.length}
                </span>
              </div>

              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <span className="text-xs font-medium text-slate-500">Average Mapping Confidence</span>
                <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                  {avgConfidence}%
                </span>
              </div>

              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <span className="text-xs font-medium text-slate-500">Total Headers Analysed</span>
                <span className="text-xs font-bold text-slate-800 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                  {headerMappings.length}
                </span>
              </div>

              <div className="flex flex-col border-b border-slate-100 pb-3">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Detected CRM Fields</span>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {detectedCrmFields.length === 0 ? (
                    <span className="text-[11px] text-slate-400 italic">None detected</span>
                  ) : (
                    detectedCrmFields.map((field, idx) => (
                      <span key={idx} className="text-[10px] bg-indigo-50/50 text-indigo-650 border border-indigo-100 rounded px-1.5 py-0.5 font-medium uppercase">
                        {field}
                      </span>
                    ))
                  )}
                </div>
              </div>

              <div className="flex flex-col border-b border-slate-100 pb-3">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Detected Sources</span>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {insights.sources.length === 0 ? (
                    <span className="text-[11px] text-slate-400 italic">None detected (defaults to empty)</span>
                  ) : (
                    insights.sources.map((src, i) => (
                      <span key={i} className="text-[10px] bg-slate-100 text-slate-700 border border-slate-200 rounded px-1.5 py-0.5 font-medium">
                        {src}
                      </span>
                    ))
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-slate-500">Most Common Status</span>
                <span className="text-xs font-bold text-slate-800">
                  {insights.commonStatus === "N/A" ? (
                    <span className="italic text-slate-400">N/A</span>
                  ) : (
                    insights.commonStatus
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Headers Without Reliable Mapping */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col justify-between h-full">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-3 mb-4">
              Headers Without Reliable Mapping
            </h3>
            
            <div className="space-y-2.5 max-h-[400px] overflow-y-auto pr-1">
              {unknownHeaders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <span className="text-xs text-slate-450 italic">All headers successfully mapped or sent to AI Assist.</span>
                </div>
              ) : (
                unknownHeaders.map((m, idx) => (
                  <div key={idx} className="flex flex-col p-3 rounded-lg border border-orange-100 bg-orange-50/20 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-700 truncate max-w-[150px]" title={m.originalHeader}>
                        {m.originalHeader}
                      </span>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-orange-100 text-orange-800 uppercase border border-orange-200">
                        UNKNOWN
                      </span>
                    </div>
                    <div className="flex items-start space-x-1.5 text-orange-700/80 mt-1 bg-orange-50 p-1.5 rounded">
                      <Info className="w-3 h-3 mt-0.5 shrink-0" />
                      <span className="text-[10px] leading-tight">
                        {m.reason}
                      </span>
                    </div>
                    <div className="flex justify-end pt-1 border-t border-orange-100/50">
                      <span className={`text-[10px] font-bold ${getConfidenceColor(m.confidence)}`}>
                        Confidence: {Math.round(m.confidence * 100)}%
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-4 text-[11px] font-semibold text-slate-500">
            <span>Deterministic Threshold: <span className="text-slate-700 font-bold">60%</span></span>
          </div>
        </div>

        {/* Mapped Headers */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col h-full justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-3 mb-4">
              Mapped Headers
            </h3>
            
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
              {mappedHeaders.length === 0 ? (
                <span className="text-xs text-slate-450 italic">No headers mapped.</span>
              ) : (
                mappedHeaders.map((m, idx) => (
                  <div key={idx} className="flex flex-col p-3 rounded-lg border border-slate-100 bg-slate-50/50 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-700 truncate max-w-[150px]" title={m.originalHeader}>
                        {m.originalHeader}
                      </span>
                      <div className="flex items-center space-x-1">
                        <ArrowRight className="w-3 h-3 text-slate-350" />
                        <span className="text-[10px] font-bold bg-indigo-50 text-indigo-750 px-1.5 py-0.5 rounded border border-indigo-100 uppercase tracking-wider truncate max-w-[120px]" title={m.mappedField}>
                          {m.mappedField}
                        </span>
                      </div>
                    </div>
                    
                    {/* Explainability Section */}
                    <div className="flex items-start space-x-1.5 text-slate-500 mt-1 bg-white p-1.5 rounded border border-slate-100">
                      <Info className="w-3 h-3 mt-0.5 shrink-0 text-slate-400" />
                      <span className="text-[10px] leading-tight text-slate-600">
                        {m.reason}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100/60 pt-1.5">
                      <div className="flex items-center space-x-1">
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold border uppercase tracking-wider ${getMethodBadge(m.matchingMethod)}`}>
                          {m.matchingMethod.replace("_", " ")}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className={`font-bold text-[10px] ${getConfidenceColor(m.confidence)}`}>
                          {Math.round(m.confidence * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

