"use client";

import { useEffect, useRef } from "react";
import { useTimesheets, useTimesheetEntries } from "@/hooks/useTimesheets";
import { formatDate, formatWeekRange } from "@/lib/utils";

interface TimesheetModalProps {
  timesheetId: string | null;
  onClose: () => void;
}

export default function TimesheetModal({ timesheetId, onClose }: TimesheetModalProps) {
  const { timesheets } = useTimesheets();
  const { entries, loading, error } = useTimesheetEntries(timesheetId);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const timesheet = timesheets.find((ts) => ts.id === timesheetId) ?? null;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (timesheetId) {
      if (!dialog.open) dialog.showModal();
    } else {
      if (dialog.open) dialog.close();
    }
  }, [timesheetId]);

  function handleBackdropClick(e: React.MouseEvent<HTMLDialogElement>) {
    const rect = dialogRef.current?.getBoundingClientRect();
    if (!rect) return;
    const { clientX, clientY } = e;
    if (clientX < rect.left || clientX > rect.right || clientY < rect.top || clientY > rect.bottom) {
      onClose();
    }
  }

  if (!timesheetId) return null;

  return (
    <dialog
      ref={dialogRef}
      onClick={handleBackdropClick}
      onClose={onClose}
      className="w-full max-w-2xl rounded-xl bg-white shadow-xl p-0 backdrop:bg-black/40"
    >
      <div className="flex items-start justify-between border-b border-gray-200 px-6 py-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Timesheet Details</h2>
          {timesheet && (
            <p className="text-sm text-gray-500 mt-0.5">
              {formatWeekRange(timesheet.weekStart, timesheet.weekEnd)}
              {" — "}
              <span className="font-medium">{timesheet.totalHours}h total</span>
            </p>
          )}
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors text-xl leading-none"
          aria-label="Close modal"
        >
          ×
        </button>
      </div>

      <div className="px-6 py-4 max-h-[60vh] overflow-y-auto">
        {loading && (
          <p className="text-sm text-gray-500 py-4 text-center">Loading entries…</p>
        )}
        {error && (
          <p className="text-sm text-red-600 py-4 text-center">Error: {error}</p>
        )}
        {!loading && !error && entries.length === 0 && (
          <p className="text-sm text-gray-400 py-4 text-center">No entries for this timesheet.</p>
        )}
        {!loading && entries.length > 0 && (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="py-2 text-left font-medium text-gray-500">Date</th>
                <th className="py-2 text-left font-medium text-gray-500">Project</th>
                <th className="py-2 text-left font-medium text-gray-500">Task</th>
                <th className="py-2 text-right font-medium text-gray-500">Hours</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {entries.map((entry) => (
                <tr key={entry.id}>
                  <td className="py-2 text-gray-600">{formatDate(entry.date)}</td>
                  <td className="py-2 text-gray-900 font-medium">{entry.project}</td>
                  <td className="py-2 text-gray-600">{entry.task}</td>
                  <td className="py-2 text-right tabular-nums text-gray-700">{entry.hours}h</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="border-t border-gray-200 px-6 py-4 flex justify-end">
        <button
          onClick={onClose}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium
                     text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Close
        </button>
      </div>
    </dialog>
  );
}
