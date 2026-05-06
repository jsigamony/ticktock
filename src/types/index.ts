export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "admin" | "employee";
}

export interface Timesheet {
  id: string;
  userId: string;
  weekStart: string;
  weekEnd: string;
  totalHours: number;
  status: "completed" | "incomplete" | "missing";
}

export interface TimesheetEntry {
  id: string;
  timesheetId: string;
  date: string;
  project: string;
  task: string;
  hours: number;
  description: string;
}

export interface DayGroup {
  date: string;
  entries: TimesheetEntry[];
}

export interface TimesheetDetailData {
  timesheet: Timesheet;
  days: DayGroup[];
  loggedHours: number;
  targetHours: number;
}
