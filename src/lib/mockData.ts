import type { User, Timesheet, TimesheetEntry } from "@/types";

export const mockUsers: User[] = [
  { id: "user-1", name: "Alice Johnson", email: "alice@ticktock.dev", password: "password123", role: "admin" },
  { id: "user-2", name: "Bob Smith",     email: "bob@ticktock.dev",   password: "password123", role: "employee" },
  { id: "user-3", name: "Carol White",   email: "carol@ticktock.dev", password: "password123", role: "employee" },
];

export const mockTimesheets: Timesheet[] = [
  { id: "ts-1", userId: "user-1", weekStart: "2025-04-28", weekEnd: "2025-05-04", totalHours: 38,   status: "approved" },
  { id: "ts-2", userId: "user-1", weekStart: "2025-05-05", weekEnd: "2025-05-11", totalHours: 40,   status: "submitted" },
  { id: "ts-3", userId: "user-2", weekStart: "2025-04-28", weekEnd: "2025-05-04", totalHours: 35,   status: "approved" },
  { id: "ts-4", userId: "user-2", weekStart: "2025-05-05", weekEnd: "2025-05-11", totalHours: 32,   status: "draft" },
  { id: "ts-5", userId: "user-3", weekStart: "2025-04-28", weekEnd: "2025-05-04", totalHours: 40,   status: "rejected" },
  { id: "ts-6", userId: "user-3", weekStart: "2025-05-05", weekEnd: "2025-05-11", totalHours: 37,   status: "draft" },
];

export const mockTimesheetEntries: TimesheetEntry[] = [
  // ts-1 — Alice, week 1
  { id: "e-1",  timesheetId: "ts-1", date: "2025-04-28", project: "Project Alpha", task: "Frontend development",  hours: 8,   description: "Built login page components" },
  { id: "e-2",  timesheetId: "ts-1", date: "2025-04-29", project: "Project Alpha", task: "Code review",           hours: 6,   description: "Reviewed PRs for sprint 3" },
  { id: "e-3",  timesheetId: "ts-1", date: "2025-04-30", project: "Project Beta",  task: "API integration",       hours: 7.5, description: "Connected dashboard to REST API" },
  { id: "e-4",  timesheetId: "ts-1", date: "2025-05-01", project: "Project Beta",  task: "Testing",               hours: 8,   description: "Wrote unit tests for utils" },
  { id: "e-5",  timesheetId: "ts-1", date: "2025-05-02", project: "Project Alpha", task: "Bug fixes",             hours: 8.5, description: "Fixed layout issues on mobile" },

  // ts-2 — Alice, week 2
  { id: "e-6",  timesheetId: "ts-2", date: "2025-05-05", project: "Project Alpha", task: "Feature development",   hours: 8,   description: "Implemented timesheet table" },
  { id: "e-7",  timesheetId: "ts-2", date: "2025-05-06", project: "Project Beta",  task: "Documentation",         hours: 7,   description: "Wrote API documentation" },
  { id: "e-8",  timesheetId: "ts-2", date: "2025-05-07", project: "Project Alpha", task: "Meetings",              hours: 8,   description: "Sprint planning and retrospective" },
  { id: "e-9",  timesheetId: "ts-2", date: "2025-05-08", project: "Project Beta",  task: "Deployment",            hours: 9,   description: "Deployed staging environment" },
  { id: "e-10", timesheetId: "ts-2", date: "2025-05-09", project: "Project Alpha", task: "Code review",           hours: 8,   description: "Reviewed team PRs" },

  // ts-3 — Bob, week 1
  { id: "e-11", timesheetId: "ts-3", date: "2025-04-28", project: "Project Gamma", task: "Backend development",   hours: 8,   description: "Built REST endpoints" },
  { id: "e-12", timesheetId: "ts-3", date: "2025-04-29", project: "Project Gamma", task: "Database schema",       hours: 7,   description: "Designed timesheet DB tables" },
  { id: "e-13", timesheetId: "ts-3", date: "2025-04-30", project: "Project Gamma", task: "Testing",               hours: 7,   description: "Integration tests for API" },
  { id: "e-14", timesheetId: "ts-3", date: "2025-05-01", project: "Project Delta", task: "Meetings",              hours: 6,   description: "Client sync calls" },
  { id: "e-15", timesheetId: "ts-3", date: "2025-05-02", project: "Project Delta", task: "Research",              hours: 7,   description: "Evaluated authentication options" },

  // ts-4 — Bob, week 2
  { id: "e-16", timesheetId: "ts-4", date: "2025-05-05", project: "Project Gamma", task: "Backend development",   hours: 8,   description: "Implemented user service" },
  { id: "e-17", timesheetId: "ts-4", date: "2025-05-06", project: "Project Delta", task: "API integration",       hours: 8,   description: "Third-party calendar integration" },
  { id: "e-18", timesheetId: "ts-4", date: "2025-05-07", project: "Project Gamma", task: "Bug fixes",             hours: 8,   description: "Fixed session expiry bug" },
  { id: "e-19", timesheetId: "ts-4", date: "2025-05-08", project: "Project Delta", task: "Documentation",         hours: 8,   description: "Updated technical specs" },

  // ts-5 — Carol, week 1
  { id: "e-20", timesheetId: "ts-5", date: "2025-04-28", project: "Project Alpha", task: "UI design",             hours: 8,   description: "Designed dashboard mockups" },
  { id: "e-21", timesheetId: "ts-5", date: "2025-04-29", project: "Project Alpha", task: "Component development", hours: 9,   description: "Built reusable UI components" },
  { id: "e-22", timesheetId: "ts-5", date: "2025-04-30", project: "Project Beta",  task: "Accessibility",         hours: 8,   description: "ARIA attributes and keyboard nav" },
  { id: "e-23", timesheetId: "ts-5", date: "2025-05-01", project: "Project Beta",  task: "Testing",               hours: 7,   description: "Cross-browser testing" },
  { id: "e-24", timesheetId: "ts-5", date: "2025-05-02", project: "Project Alpha", task: "Code review",           hours: 8,   description: "Reviewed design system PRs" },

  // ts-6 — Carol, week 2
  { id: "e-25", timesheetId: "ts-6", date: "2025-05-05", project: "Project Beta",  task: "Frontend development",  hours: 8,   description: "Built modal components" },
  { id: "e-26", timesheetId: "ts-6", date: "2025-05-06", project: "Project Alpha", task: "Meetings",              hours: 7,   description: "Design system sync" },
  { id: "e-27", timesheetId: "ts-6", date: "2025-05-07", project: "Project Beta",  task: "Documentation",         hours: 7,   description: "Component storybook docs" },
  { id: "e-28", timesheetId: "ts-6", date: "2025-05-08", project: "Project Alpha", task: "Bug fixes",             hours: 7.5, description: "Responsive layout fixes" },
  { id: "e-29", timesheetId: "ts-6", date: "2025-05-09", project: "Project Beta",  task: "Code review",           hours: 7.5, description: "Reviewed accessibility PRs" },
];
