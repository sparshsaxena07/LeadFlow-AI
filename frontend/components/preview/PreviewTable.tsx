import React from "react";

interface PreviewTableProps {
  headers: string[];
  previewRows: Array<{
    rowNumber: number;
    normalized: Record<string, string | null>;
  }>;
}

export function PreviewTable({ headers, previewRows }: PreviewTableProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col h-full animate-in fade-in slide-in-from-right-2 duration-200">
      <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
          CSV Preview Grid
        </h3>
        <span className="text-[10px] text-slate-400">
          Showing up to 10 rows
        </span>
      </div>

      <div className="relative border border-slate-200 rounded-lg overflow-hidden flex-grow max-h-[360px] overflow-y-auto overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-semibold text-[10px] tracking-wider sticky top-0 z-10">
            <tr>
              <th className="py-2.5 px-3 border-r border-slate-200 bg-slate-50 w-16 text-center">Row</th>
              {headers.map((h, i) => (
                <th key={i} className="py-2.5 px-3 border-r border-slate-200 bg-slate-50 truncate max-w-[160px]" title={h}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-650 bg-white">
            {previewRows.map((row) => (
              <tr key={row.rowNumber} className="hover:bg-slate-50/50 transition">
                <td className="py-2 px-3 border-r border-slate-200 text-[10px] font-bold text-slate-400 text-center bg-slate-50/30">
                  {row.rowNumber}
                </td>
                {headers.map((h, colIdx) => (
                  <td key={colIdx} className="py-2 px-3 border-r border-slate-200 truncate max-w-[160px]">
                    {row.normalized[h] === null ? (
                      <span className="text-slate-300 font-mono italic">null</span>
                    ) : (
                      String(row.normalized[h])
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
