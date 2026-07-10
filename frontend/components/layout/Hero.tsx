import React from "react";
import { Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section className="border-b border-slate-200/60 bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-top-4 duration-250">
        <div className="flex items-center space-x-2 text-indigo-650 font-semibold text-xs tracking-wider uppercase mb-3">
          <Sparkles className="w-4 h-4 animate-pulse text-indigo-500" />
          <span>AI-Driven Data Pipeline</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-3">
          AI CSV Importer
        </h1>
        <p className="text-slate-500 text-sm sm:text-base max-w-3xl leading-relaxed">
          Import customer leads from any CSV format. The AI automatically understands different column names and converts them into standardized GrowEasy CRM records.
        </p>
      </div>
    </section>
  );
}
