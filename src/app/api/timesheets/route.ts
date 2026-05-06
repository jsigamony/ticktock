import type { NextRequest } from "next/server";
import {
  addTimesheet,
  getTimesheetEntries,
  getTimesheets,
} from "@/lib/timesheetStore";
import type { Timesheet } from "@/types";

export async function GET(request: NextRequest): Promise<Response> {
  const { searchParams } = request.nextUrl;
  const userId = searchParams.get("userId");
  const timesheetId = searchParams.get("timesheetId");

  if (timesheetId) {
    return Response.json(getTimesheetEntries(timesheetId));
  }

  if (userId) {
    return Response.json(getTimesheets(userId));
  }

  return Response.json(getTimesheets());
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

  return Response.json(addTimesheet(newTimesheet), { status: 201 });
}
