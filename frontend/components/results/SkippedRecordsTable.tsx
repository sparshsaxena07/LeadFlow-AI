import React from "react";
import { CheckCircle } from "lucide-react";

interface SkippedRecord {
  rowNumber: number;
  reason: string;
}

interface SkippedRecordsTableProps {
  skipped: SkippedRecord[];
}

export function SkippedRecordsTable({ skipped }: SkippedRecordsTableProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col animate-in fade-in duration-200">
      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-3 mb-4">
        Skipped Records ({skipped.length})
      </h3>

      {skipped.length === 0 ? (
        <div className="text-center py-10 border border-emerald-150 border-dashed rounded-lg bg-emerald-50/20 flex flex-col items-center justify-center">
          <CheckCircle className="w-8 h-8 text-emerald-500 mb-2.5" />
          <span className="text-emerald-850 text-xs font-semibold">All Leads Processed Successfully</span>
          <p className="text-[11px] text-emerald-600/80 mt-1 max-w-xs leading-normal">
            No rows were skipped or rejected during this AI extraction phase.
          </p>
        </div>
      ) : (
        <div className="relative border border-slate-200 rounded-lg overflow-hidden max-h-[250px] overflow-y-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-semibold text-[10px] tracking-wider sticky top-0 z-10">
              <tr>
                <th className="py-2 px-3 border-r border-slate-200 bg-slate-50 w-24 text-center">Row Number</th>
                <th className="py-2 px-3 border-r border-slate-200 bg-slate-50">Failure / Skip Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-650 bg-white">
              {skipped.map((item, i) => (
                <tr key={i} className="hover:bg-slate-50/40 transition">
                  <td className="py-2 px-3 border-r border-slate-200 font-bold text-slate-450 text-center bg-slate-50/30">
                    {item.rowNumber}
                  </td>
                  <td className="py-2 px-3 text-rose-600 font-medium">
                    {item.reason}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
