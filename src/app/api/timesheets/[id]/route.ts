import { mockTimesheets, mockTimesheetEntries } from "@/lib/mockData";
import type { TimesheetEntry } from "@/types";

const TARGET_HOURS = 40;

// Module-level mutable copy so POST appends are visible to subsequent GETs
const allEntries: TimesheetEntry[] = [...mockTimesheetEntries];

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<Response> {
  const { id } = await params;

  const timesheet = mockTimesheets.find((ts) => ts.id === id);

  if (!timesheet) {
    return Response.json({ error: "Timesheet not found" }, { status: 404 });
  }

  const entries = allEntries.filter((e) => e.timesheetId === id);
  const loggedHours = entries.reduce((sum, e) => sum + e.hours, 0);

  // Group entries by date, preserving chronological order
  const dayMap = new Map<string, TimesheetEntry[]>();
  entries.forEach((entry) => {
    const bucket = dayMap.get(entry.date) ?? [];
    bucket.push(entry);
    dayMap.set(entry.date, bucket);
  });

  const days = Array.from(dayMap, ([date, dayEntries]) => ({
    date,
    entries: dayEntries,
  })).sort((a, b) => a.date.localeCompare(b.date));

  return Response.json({
    timesheet,
    days,
    loggedHours,
    targetHours: TARGET_HOURS,
  });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<Response> {
  const { id } = await params;

  const timesheet = mockTimesheets.find((ts) => ts.id === id);
  if (!timesheet) {
    return Response.json({ error: "Timesheet not found" }, { status: 404 });
  }

  const body = await request.json() as {
    date?: string;
    task?: string;
    project?: string;
    hours?: number;
    description?: string;
  };

  if (!body.date || !body.task || !body.project || body.hours == null) {
    return Response.json(
      { error: "date, task, project, and hours are required" },
      { status: 400 },
    );
  }

  const newEntry: TimesheetEntry = {
    id: `e-${Date.now()}`,
    timesheetId: id,
    date: body.date,
    task: body.task,
    project: body.project,
    hours: body.hours,
    description: body.description ?? "",
  };

  allEntries.push(newEntry);
  return Response.json(newEntry, { status: 201 });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<Response> {
  const { id } = await params;

  const timesheet = mockTimesheets.find((ts) => ts.id === id);
  if (!timesheet) {
    return Response.json({ error: "Timesheet not found" }, { status: 404 });
  }

  const body = await request.json() as {
    entryId?: string;
    date?: string;
    task?: string;
    project?: string;
    hours?: number;
    description?: string;
  };

  if (!body.entryId) {
    return Response.json({ error: "entryId is required" }, { status: 400 });
  }

  if (!body.date || !body.task || !body.project || body.hours == null) {
    return Response.json(
      { error: "date, task, project, and hours are required" },
      { status: 400 },
    );
  }

  const entryIndex = allEntries.findIndex(
    (entry) => entry.id === body.entryId && entry.timesheetId === id,
  );

  if (entryIndex === -1) {
    return Response.json({ error: "Entry not found" }, { status: 404 });
  }

  const updatedEntry: TimesheetEntry = {
    ...allEntries[entryIndex],
    date: body.date,
    task: body.task,
    project: body.project,
    hours: body.hours,
    description: body.description ?? "",
  };

  allEntries[entryIndex] = updatedEntry;
  return Response.json(updatedEntry);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<Response> {
  const { id } = await params;

  const timesheet = mockTimesheets.find((ts) => ts.id === id);
  if (!timesheet) {
    return Response.json({ error: "Timesheet not found" }, { status: 404 });
  }

  const body = await request.json() as { entryId?: string };

  if (!body.entryId) {
    return Response.json({ error: "entryId is required" }, { status: 400 });
  }

  const entryIndex = allEntries.findIndex(
    (entry) => entry.id === body.entryId && entry.timesheetId === id,
  );

  if (entryIndex === -1) {
    return Response.json({ error: "Entry not found" }, { status: 404 });
  }

  const [deletedEntry] = allEntries.splice(entryIndex, 1);
  return Response.json(deletedEntry);
}
