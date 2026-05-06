import {
  addTimesheetEntry,
  deleteTimesheetEntry,
  getTimesheet,
  getTimesheetEntries,
  TARGET_HOURS,
  updateTimesheetEntry,
} from "@/lib/timesheetStore";
import type { TimesheetEntry } from "@/types";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<Response> {
  const { id } = await params;

  const timesheet = getTimesheet(id);

  if (!timesheet) {
    return Response.json({ error: "Timesheet not found" }, { status: 404 });
  }

  const entries = getTimesheetEntries(id);
  const loggedHours = entries.reduce((sum, e) => sum + e.hours, 0);

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

  const timesheet = getTimesheet(id);
  if (!timesheet) {
    return Response.json({ error: "Timesheet not found" }, { status: 404 });
  }

  const body = (await request.json()) as {
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

  return Response.json(addTimesheetEntry(newEntry), { status: 201 });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<Response> {
  const { id } = await params;

  const timesheet = getTimesheet(id);
  if (!timesheet) {
    return Response.json({ error: "Timesheet not found" }, { status: 404 });
  }

  const body = (await request.json()) as {
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

  const updatedEntry = updateTimesheetEntry(id, body.entryId, {
    date: body.date,
    task: body.task,
    project: body.project,
    hours: body.hours,
    description: body.description ?? "",
  });

  if (!updatedEntry) {
    return Response.json({ error: "Entry not found" }, { status: 404 });
  }

  return Response.json(updatedEntry);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<Response> {
  const { id } = await params;

  const timesheet = getTimesheet(id);
  if (!timesheet) {
    return Response.json({ error: "Timesheet not found" }, { status: 404 });
  }

  const body = (await request.json()) as { entryId?: string };

  if (!body.entryId) {
    return Response.json({ error: "entryId is required" }, { status: 400 });
  }

  const deletedEntry = deleteTimesheetEntry(id, body.entryId);
  if (!deletedEntry) {
    return Response.json({ error: "Entry not found" }, { status: 404 });
  }

  return Response.json(deletedEntry);
}
