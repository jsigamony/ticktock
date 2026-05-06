import type { Timesheet } from "@/types";

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function formatDate(isoDate: string): string {
  const date = new Date(`${isoDate}T00:00:00`);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatWeekRange(weekStart: string, weekEnd: string): string {
  const start = new Date(`${weekStart}T00:00:00`);
  const end = new Date(`${weekEnd}T00:00:00`);
  const startStr = start.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  const endStr = end.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  return `${startStr} – ${endStr}`;
}

export function capitalise(str: string): string {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : "";
}

export function getTimesheetStatus(totalHours: number): Timesheet["status"] {
  if (totalHours >= 40) return "completed";
  if (totalHours > 0) return "incomplete";
  return "missing";
}

export function getPageNumbers(currentPage: number, totalPages: number) {
  const pages = new Set([1, totalPages]);

  for (let page = currentPage - 1; page <= currentPage + 1; page += 1) {
    if (page >= 1 && page <= totalPages) {
      pages.add(page);
    }
  }

  return Array.from(pages).sort((a, b) => a - b);
}

export function formatStatus(status: Timesheet["status"]) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export function getNormalizedDateRange(startDate: string, endDate: string) {
  if (!startDate && !endDate) return null;
  if (!startDate || !endDate) return { startDate, endDate };
  if (startDate <= endDate) return { startDate, endDate };
  return { startDate: endDate, endDate: startDate };
}

export function weekOverlapsDateRange(
  timesheet: Timesheet,
  dateRange: {
    startDate: string;
    endDate: string;
  },
) {
  const startsBeforeRangeEnds =
    !dateRange.endDate || timesheet.weekStart <= dateRange.endDate;
  const endsAfterRangeStarts =
    !dateRange.startDate || timesheet.weekEnd >= dateRange.startDate;

  return startsBeforeRangeEnds && endsAfterRangeStarts;
}
