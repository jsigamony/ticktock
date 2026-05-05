import type { NextRequest } from "next/server";
import { mockTimesheets, mockTimesheetEntries } from "@/lib/mockData";
import type { Timesheet, TimesheetEntry } from "@/types";

const timesheets: Timesheet[] = [...mockTimesheets];
const entries: TimesheetEntry[] = [...mockTimesheetEntries];

export async function GET(request: NextRequest): Promise<Response> {
  const { searchParams } = request.nextUrl;
  const userId = searchParams.get("userId");
  const timesheetId = searchParams.get("timesheetId");

  if (timesheetId) {
    return Response.json(entries.filter((e) => e.timesheetId === timesheetId));
  }

  if (userId) {
    return Response.json(timesheets.filter((t) => t.userId === userId));
  }

  return Response.json(timesheets);
}

export async function POST(request: Request): Promise<Response> {
  const body = (await request.json()) as Partial<Timesheet>;

  if (!body.userId || !body.weekStart || !body.weekEnd) {
    return Response.json(
      { error: "userId, weekStart, and weekEnd are required" },
      { status: 400 },
    );
  }

  const newTimesheet: Timesheet = {
    id: `ts-${Date.now()}`,
    userId: body.userId,
    weekStart: body.weekStart,
    weekEnd: body.weekEnd,
    totalHours: body.totalHours ?? 0,
    status: "missing",
  };

  timesheets.push(newTimesheet);
  return Response.json(newTimesheet, { status: 201 });
}
