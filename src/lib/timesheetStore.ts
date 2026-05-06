import { mockTimesheetEntries, mockTimesheets } from "@/lib/mockData";
import { getTimesheetStatus } from "@/lib/utils";
import type { Timesheet, TimesheetEntry } from "@/types";

export const TARGET_HOURS = 40;

const timesheets: Timesheet[] = [...mockTimesheets];
const entries: TimesheetEntry[] = [...mockTimesheetEntries];

export function getTimesheetHours(timesheetId: string) {
  return entries
    .filter((entry) => entry.timesheetId === timesheetId)
    .reduce((sum, entry) => sum + entry.hours, 0);
}

export function hydrateTimesheet(timesheet: Timesheet): Timesheet {
  const totalHours = getTimesheetHours(timesheet.id);

  return {
    ...timesheet,
    totalHours,
    status: getTimesheetStatus(totalHours),
  };
}

export function getTimesheets(userId?: string) {
  const filteredTimesheets = userId
    ? timesheets.filter((timesheet) => timesheet.userId === userId)
    : timesheets;

  return filteredTimesheets.map(hydrateTimesheet);
}

export function getTimesheet(timesheetId: string) {
  const timesheet = timesheets.find((ts) => ts.id === timesheetId);
  return timesheet ? hydrateTimesheet(timesheet) : null;
}

export function getTimesheetEntries(timesheetId: string) {
  return entries.filter((entry) => entry.timesheetId === timesheetId);
}

export function addTimesheet(timesheet: Timesheet) {
  timesheets.push(timesheet);
  return hydrateTimesheet(timesheet);
}

export function addTimesheetEntry(entry: TimesheetEntry) {
  entries.push(entry);
  return entry;
}

export function updateTimesheetEntry(
  timesheetId: string,
  entryId: string,
  updates: Pick<TimesheetEntry, "date" | "task" | "project" | "hours" | "description">,
) {
  const entryIndex = entries.findIndex(
    (entry) => entry.id === entryId && entry.timesheetId === timesheetId,
  );

  if (entryIndex === -1) return null;

  const updatedEntry = {
    ...entries[entryIndex],
    ...updates,
  };

  entries[entryIndex] = updatedEntry;
  return updatedEntry;
}

export function deleteTimesheetEntry(timesheetId: string, entryId: string) {
  const entryIndex = entries.findIndex(
    (entry) => entry.id === entryId && entry.timesheetId === timesheetId,
  );

  if (entryIndex === -1) return null;

  const [deletedEntry] = entries.splice(entryIndex, 1);
  return deletedEntry;
}
