"use client";

import { useMemo, useState } from "react";
import { useTimesheets } from "@/hooks/useTimesheets";
import { formatWeekRange } from "@/lib/utils";
import type { Timesheet } from "@/types";
import TimesheetDetails from "./TimesheetDetails";

const STATUS_STYLES: Record<Timesheet["status"], string> = {
  completed: "bg-green-100 text-green-700",
  incomplete: "bg-yellow-100 text-yellow-700",
  missing: "bg-pink-100 text-pink-700",
};

const PAGE_SIZE_OPTIONS = [5, 10, 25];
const ALL_DATE_RANGES = "all";
const ALL_STATUSES = "all";

function getPageNumbers(currentPage: number, totalPages: number) {
  const pages = new Set([1, totalPages]);

  for (let page = currentPage - 1; page <= currentPage + 1; page += 1) {
    if (page >= 1 && page <= totalPages) {
      pages.add(page);
    }
  }

  return Array.from(pages).sort((a, b) => a - b);
}

function formatStatus(status: Timesheet["status"]) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

interface TimesheetTableProps {
  userId: string;
}

export default function TimesheetTable({ userId }: TimesheetTableProps) {
  const { timesheets, loading, error } = useTimesheets({ userId });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0]);
  const [dateRangeFilter, setDateRangeFilter] = useState(ALL_DATE_RANGES);
  const [statusFilter, setStatusFilter] = useState<
    Timesheet["status"] | typeof ALL_STATUSES
  >(ALL_STATUSES);

  const dateRangeOptions = useMemo(() => {
    const ranges = new Map<string, string>();

    timesheets.forEach((timesheet) => {
      const key = `${timesheet.weekStart}|${timesheet.weekEnd}`;
      ranges.set(key, formatWeekRange(timesheet.weekStart, timesheet.weekEnd));
    });

    return Array.from(ranges, ([value, label]) => ({ value, label }));
  }, [timesheets]);

  const statusOptions = useMemo(
    () => Array.from(new Set(timesheets.map((timesheet) => timesheet.status))),
    [timesheets],
  );

  const filteredTimesheets = useMemo(
    () =>
      timesheets.filter((timesheet) => {
        const matchesDateRange =
          dateRangeFilter === ALL_DATE_RANGES ||
          dateRangeFilter === `${timesheet.weekStart}|${timesheet.weekEnd}`;
        const matchesStatus =
          statusFilter === ALL_STATUSES || statusFilter === timesheet.status;

        return matchesDateRange && matchesStatus;
      }),
    [dateRangeFilter, statusFilter, timesheets],
  );

  const hasActiveFilters =
    dateRangeFilter !== ALL_DATE_RANGES || statusFilter !== ALL_STATUSES;
  const totalPages = Math.max(
    1,
    Math.ceil(filteredTimesheets.length / pageSize),
  );
  const effectivePage = Math.min(currentPage, totalPages);
  const startIndex = (effectivePage - 1) * pageSize;
  const paginatedTimesheets = useMemo(
    () => filteredTimesheets.slice(startIndex, startIndex + pageSize),
    [filteredTimesheets, pageSize, startIndex],
  );
  const pageNumbers = getPageNumbers(effectivePage, totalPages);
  const showingStart = filteredTimesheets.length === 0 ? 0 : startIndex + 1;
  const showingEnd = Math.min(startIndex + pageSize, filteredTimesheets.length);

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

  if (selectedId) {
    return (
      <TimesheetDetails
        timesheetId={selectedId}
        onBack={() => setSelectedId(null)}
      />
    );
  }

  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={dateRangeFilter}
          onChange={(e) => {
            setDateRangeFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-600 bg-white"
          aria-label="Filter by date range"
        >
          <option value={ALL_DATE_RANGES}>All date ranges</option>
          {dateRangeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(
              e.target.value as Timesheet["status"] | typeof ALL_STATUSES,
            );
            setCurrentPage(1);
          }}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-600 bg-white"
          aria-label="Filter by status"
        >
          <option value={ALL_STATUSES}>All statuses</option>
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {formatStatus(status)}
            </option>
          ))}
        </select>

        {hasActiveFilters && (
          <button
            onClick={() => {
              setDateRangeFilter(ALL_DATE_RANGES);
              setStatusFilter(ALL_STATUSES);
              setCurrentPage(1);
            }}
            className="text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            Clear filters
          </button>
        )}
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="text-left px-4 py-3">Week #</th>
              <th className="text-left px-4 py-3">Date</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-right px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredTimesheets.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-400">
                  {hasActiveFilters
                    ? "No timesheets match these filters."
                    : "No timesheets found."}
                </td>
              </tr>
            ) : (
              paginatedTimesheets.map((ts, idx) => (
                <tr
                  key={ts.id}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => setSelectedId(ts.id)}
                >
                  <td className="px-4 py-3 text-gray-900">
                    {startIndex + idx + 1}
                  </td>
                  <td className="px-4 py-3 text-gray-700 tabular-nums">
                    {formatWeekRange(ts.weekStart, ts.weekEnd)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[ts.status]}`}
                    >
                      {formatStatus(ts.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {ts.status === "completed" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedId(ts.id);
                        }}
                        className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                      >
                        View
                      </button>
                    )}
                    {ts.status === "incomplete" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedId(ts.id);
                        }}
                        className="text-yellow-600 hover:text-yellow-800 text-xs font-medium"
                      >
                        Update
                      </button>
                    )}
                    {ts.status === "missing" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedId(ts.id);
                        }}
                        className="text-pink-600 hover:text-pink-800 text-xs font-medium"
                      >
                        Create
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-600 bg-white"
            aria-label="Rows per page"
          >
            {PAGE_SIZE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option} per page
              </option>
            ))}
          </select>
          <span>
            Showing {showingStart}-{showingEnd} of {filteredTimesheets.length}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <button
            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
            disabled={effectivePage === 1}
            className="px-3 py-1 border rounded-md text-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>

          {pageNumbers.map((page, idx) => {
            const previousPage = pageNumbers[idx - 1];
            const hasGap = previousPage && page - previousPage > 1;

            return (
              <div key={page} className="flex items-center gap-2">
                {hasGap && <span className="px-1 text-gray-500">...</span>}
                <button
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded-md ${
                    page === effectivePage
                      ? "bg-blue-600 text-white"
                      : "border text-gray-600"
                  }`}
                  aria-current={page === effectivePage ? "page" : undefined}
                >
                  {page}
                </button>
              </div>
            );
          })}

          <button
            onClick={() =>
              setCurrentPage((page) => Math.min(totalPages, page + 1))
            }
            disabled={effectivePage === totalPages}
            className="px-3 py-1 border rounded-md text-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      <footer className="w-full bg-white border border-gray-300 px-6 py-6 rounded-lg">
        <div className="flex items-center justify-center text-gray-400 text-sm">
          © 2024 tentwenty. All rights reserved.
        </div>
      </footer>
    </>
  );
}
