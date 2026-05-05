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
  status: "draft" | "submitted" | "approved" | "rejected";
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
