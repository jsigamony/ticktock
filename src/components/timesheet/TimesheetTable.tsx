"use client";

import { useState } from "react";
import { useTimesheets } from "@/hooks/useTimesheets";
import { formatWeekRange, capitalise } from "@/lib/utils";
import type { Timesheet } from "@/types";
import TimesheetModal from "./TimesheetModal";

const STATUS_STYLES: Record<Timesheet["status"], string> = {
  draft:     "bg-gray-100 text-gray-700",
  submitted: "bg-blue-100 text-blue-700",
  approved:  "bg-green-100 text-green-700",
  rejected:  "bg-red-100 text-red-700",
};

export default function TimesheetTable() {
  const { timesheets, loading, error } = useTimesheets();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-gray-500 text-sm">
        Loading timesheets…
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 border border-red-200 p-4 text-sm text-red-700">
        Error: {error}
      </div>
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Week</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Total Hours</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Status</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {timesheets.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-400">
                  No timesheets found.
                </td>
              </tr>
            ) : (
              timesheets.map((ts) => (
                <tr
                  key={ts.id}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => setSelectedId(ts.id)}
                >
                  <td className="px-4 py-3 text-gray-900">
                    {formatWeekRange(ts.weekStart, ts.weekEnd)}
                  </td>
                  <td className="px-4 py-3 text-gray-700 tabular-nums">{ts.totalHours}h</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[ts.status]}`}
                    >
                      {capitalise(ts.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={(e) => { e.stopPropagation(); setSelectedId(ts.id); }}
                      className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <TimesheetModal timesheetId={selectedId} onClose={() => setSelectedId(null)} />
    </>
  );
}
