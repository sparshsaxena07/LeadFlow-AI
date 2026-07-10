import React from "react";
import { Columns, User, Mail, Phone, FileText, Briefcase } from "lucide-react";

interface AIAnalysisProps {
  headers: string[];
}

export function AIAnalysis({ headers }: AIAnalysisProps) {
  // Categorization logic matching standard HeaderAnalyzer keywords
  const getCrmCategory = (header: string): "name" | "email" | "phone" | "company" | "note" | "unknown" => {
    const lower = header.toLowerCase().trim();
    if (lower.includes("email") || lower.includes("mail") || lower.includes("gmail")) return "email";
    if (
      lower.includes("phone") ||
      lower.includes("mobile") ||
      lower.includes("contact") ||
      lower.includes("tel") ||
      lower.includes("cell") ||
      lower.includes("whatsapp")
    ) {
      return "phone";
    }
    if (
      lower.includes("name") ||
      lower.includes("customer") ||
      lower.includes("client") ||
      lower.includes("lead")
    ) {
      return "name";
    }
    if (
      lower.includes("company") ||
      lower.includes("firm") ||
      lower.includes("organization") ||
      lower.includes("employer") ||
      lower.includes("business") ||
      lower.includes("org")
    ) {
      return "company";
    }
    if (
      lower.includes("note") ||
      lower.includes("remark") ||
      lower.includes("comment") ||
      lower.includes("desc") ||
      lower.includes("feedback")
    ) {
      return "note";
    }
    return "unknown";
  };

  const nameCols: string[] = [];
  const emailCols: string[] = [];
  const phoneCols: string[] = [];
  const noteCols: string[] = [];
  const companyCols: string[] = [];

  headers.forEach((h) => {
    const cat = getCrmCategory(h);
    if (cat === "name") nameCols.push(h);
    else if (cat === "email") emailCols.push(h);
    else if (cat === "phone") phoneCols.push(h);
    else if (cat === "company") companyCols.push(h);
    else if (cat === "note") noteCols.push(h);
  });

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col h-full animate-in fade-in slide-in-from-left-2 duration-200">
      <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
        <div className="flex items-center space-x-2">
          <Columns className="w-4 h-4 text-indigo-500" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Detected AI Mapping Categories
          </h3>
        </div>
        <span className="text-[10px] font-semibold bg-indigo-50 text-indigo-750 border border-indigo-150 px-2 py-0.5 rounded uppercase">
          AI Pre-Analysis
        </span>
      </div>

      <p className="text-slate-550 text-[11px] mb-4 leading-relaxed">
        The preprocessor has organized your file columns by standard target entities to help Gemini accurately parse rows:
      </p>

      <div className="space-y-4">
        {/* Names */}
        <div className="flex flex-col space-y-1">
          <div className="flex items-center space-x-1.5 text-[10px] uppercase font-bold text-slate-450">
            <User className="w-3.5 h-3.5 text-blue-500" />
            <span>Detected Name Columns</span>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {nameCols.length === 0 ? (
              <span className="text-[10px] text-slate-400 italic">None detected</span>
            ) : (
              nameCols.map((h, i) => (
                <span key={i} className="text-[10px] bg-blue-50 text-blue-750 border border-blue-150 rounded px-2 py-0.5 font-medium">
                  {h}
                </span>
              ))
            )}
          </div>
        </div>

        {/* Emails */}
        <div className="flex flex-col space-y-1">
          <div className="flex items-center space-x-1.5 text-[10px] uppercase font-bold text-slate-450">
            <Mail className="w-3.5 h-3.5 text-emerald-500" />
            <span>Detected Email Columns</span>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {emailCols.length === 0 ? (
              <span className="text-[10px] text-slate-400 italic">None detected</span>
            ) : (
              emailCols.map((h, i) => (
                <span key={i} className="text-[10px] bg-emerald-50 text-emerald-750 border border-emerald-150 rounded px-2 py-0.5 font-medium">
                  {h}
                </span>
              ))
            )}
          </div>
        </div>

        {/* Phones */}
        <div className="flex flex-col space-y-1">
          <div className="flex items-center space-x-1.5 text-[10px] uppercase font-bold text-slate-450">
            <Phone className="w-3.5 h-3.5 text-indigo-550" />
            <span>Detected Phone Columns</span>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {phoneCols.length === 0 ? (
              <span className="text-[10px] text-slate-400 italic">None detected</span>
            ) : (
              phoneCols.map((h, i) => (
                <span key={i} className="text-[10px] bg-indigo-50 text-indigo-750 border border-indigo-150 rounded px-2 py-0.5 font-medium">
                  {h}
                </span>
              ))
            )}
          </div>
        </div>

        {/* Company */}
        <div className="flex flex-col space-y-1">
          <div className="flex items-center space-x-1.5 text-[10px] uppercase font-bold text-slate-450">
            <Briefcase className="w-3.5 h-3.5 text-purple-550" />
            <span>Detected Company Columns</span>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {companyCols.length === 0 ? (
              <span className="text-[10px] text-slate-400 italic">None detected</span>
            ) : (
              companyCols.map((h, i) => (
                <span key={i} className="text-[10px] bg-purple-50 text-purple-750 border border-purple-150 rounded px-2 py-0.5 font-medium">
                  {h}
                </span>
              ))
            )}
          </div>
        </div>

        {/* Notes */}
        <div className="flex flex-col space-y-1">
          <div className="flex items-center space-x-1.5 text-[10px] uppercase font-bold text-slate-450">
            <FileText className="w-3.5 h-3.5 text-slate-500" />
            <span>Detected Notes</span>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {noteCols.length === 0 ? (
              <span className="text-[10px] text-slate-400 italic">None detected</span>
            ) : (
              noteCols.map((h, i) => (
                <span key={i} className="text-[10px] bg-slate-100 text-slate-700 border border-slate-200 rounded px-2 py-0.5 font-medium">
                  {h}
                </span>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
