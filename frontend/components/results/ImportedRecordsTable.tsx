import React, { useMemo } from "react";
import { Search, Download, ClipboardCheck } from "lucide-react";

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

interface ImportedRecordsTableProps {
  records: CRMRecord[];
  searchQuery: string;
  onSearchChange: (val: string) => void;
  onExport: () => void;
}

export function ImportedRecordsTable({
  records,
  searchQuery,
  onSearchChange,
  onExport
}: ImportedRecordsTableProps) {
  // Memoize table rows generation for performance optimization
  const tableRows = useMemo(() => {
    if (records.length === 0) return null;
    return records.map((r, i) => (
      <tr key={i} className="hover:bg-slate-50/40 transition">
        <td className="py-2 px-3 border-r border-slate-200 font-medium text-slate-800 truncate max-w-[120px]" title={r.name || ""}>
          {r.name || "-"}
        </td>
        <td className="py-2 px-3 border-r border-slate-200 truncate max-w-[150px]" title={r.email || ""}>
          {r.email || "-"}
        </td>
        <td className="py-2 px-3 border-r border-slate-200 font-mono text-[11px] text-center">
          {r.country_code || "-"}
        </td>
        <td className="py-2 px-3 border-r border-slate-200 font-mono text-[11px]">
          {r.mobile_without_country_code || "-"}
        </td>
        <td className="py-2 px-3 border-r border-slate-200 truncate max-w-[120px]" title={r.company || ""}>
          {r.company || "-"}
        </td>
        <td className="py-2 px-3 border-r border-slate-200 text-center">
          {r.crm_status ? (
            <span className="text-[10px] bg-indigo-50 text-indigo-750 px-1.5 py-0.5 rounded border border-indigo-100 font-medium uppercase tracking-wide">
              {r.crm_status.replace(/_/g, " ")}
            </span>
          ) : (
            "-"
          )}
        </td>
        <td className="py-2 px-3 border-r border-slate-200 text-center">
          {r.data_source ? (
            <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded border border-slate-200 font-medium uppercase tracking-wide">
              {r.data_source.replace(/_/g, " ")}
            </span>
          ) : (
            "-"
          )}
        </td>
        <td className="py-2 px-3 border-r border-slate-200 truncate max-w-[100px]" title={r.possession_time || ""}>
          {r.possession_time || "-"}
        </td>
        <td className="py-2 px-3 border-r border-slate-200 truncate max-w-[180px]" title={r.crm_note || ""}>
          {r.crm_note || "-"}
        </td>
      </tr>
    ));
  }, [records]);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between border-b border-slate-100 pb-4 mb-4 gap-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
          Imported CRM Records ({records.length})
        </h3>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search leads..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full sm:w-64 pl-9 pr-4 py-2 border border-slate-200 focus:border-slate-350 focus:outline-none rounded-lg text-xs bg-white text-slate-700 shadow-sm"
              aria-label="Search imported leads list"
            />
          </div>

          {/* Export Results button */}
          <button
            type="button"
            onClick={onExport}
            disabled={records.length === 0}
            className="px-4 py-2 border border-slate-200 hover:bg-slate-50 disabled:bg-slate-50 disabled:text-slate-400 text-slate-700 rounded-lg text-xs font-semibold shadow-sm flex items-center justify-center space-x-1.5 transition disabled:cursor-not-allowed"
            aria-label="Export results to CSV file"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {records.length === 0 ? (
        <div className="text-center py-16 border border-slate-150 border-dashed rounded-lg bg-slate-50/50 flex flex-col items-center justify-center">
          <ClipboardCheck className="w-8 h-8 text-slate-300 mb-3" />
          <span className="text-slate-700 text-xs font-semibold">No CRM Records Found</span>
          <p className="text-[11px] text-slate-400 mt-1 max-w-xs leading-normal">
            No successfully processed leads met the filter criteria.
          </p>
        </div>
      ) : (
        <div className="relative border border-slate-200 rounded-lg overflow-hidden max-h-[320px] overflow-y-auto overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-semibold text-[10px] tracking-wider sticky top-0 z-10">
              <tr>
                <th className="py-2.5 px-3 border-r border-slate-200 bg-slate-50">Name</th>
                <th className="py-2.5 px-3 border-r border-slate-200 bg-slate-50">Email</th>
                <th className="py-2.5 px-3 border-r border-slate-200 bg-slate-50 text-center">Dialing</th>
                <th className="py-2.5 px-3 border-r border-slate-200 bg-slate-50">Mobile</th>
                <th className="py-2.5 px-3 border-r border-slate-200 bg-slate-50">Company</th>
                <th className="py-2.5 px-3 border-r border-slate-200 bg-slate-50 text-center">Status</th>
                <th className="py-2.5 px-3 border-r border-slate-200 bg-slate-50 text-center">Source</th>
                <th className="py-2.5 px-3 border-r border-slate-200 bg-slate-50">Possession</th>
                <th className="py-2.5 px-3 border-r border-slate-200 bg-slate-50">Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-650 bg-white">
              {tableRows}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
