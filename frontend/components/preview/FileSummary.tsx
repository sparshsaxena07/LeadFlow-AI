import React from "react";

interface FileSummaryProps {
  filename: string;
  rows: number;
  columns: number;
  fileSizeStr: string;
}

export function FileSummary({ filename, rows, columns, fileSizeStr }: FileSummaryProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col">
        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1">
          File Name
        </span>
        <span className="text-xs font-semibold text-slate-800 truncate" title={filename}>
          {filename}
        </span>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col">
        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1">
          Total Rows
        </span>
        <span className="text-xs font-semibold text-slate-800">
          {rows} leads
        </span>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col">
        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1">
          Total Columns
        </span>
        <span className="text-xs font-semibold text-slate-800">
          {columns} fields
        </span>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col">
        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1">
          File Size
        </span>
        <span className="text-xs font-semibold text-slate-800">
          {fileSizeStr}
        </span>
      </div>
    </div>
  );
}
