import type { Metadata } from "next";
import TimesheetTable from "@/components/timesheet/TimesheetTable";

export const metadata: Metadata = {
  title: "Dashboard — TickTock",
};

export default function DashboardPage() {
  return (
    <main className="flex-1 p-6 bg-gray-50">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Timesheets</h1>
            <p className="text-sm text-gray-500 mt-1">
              View and manage your weekly timesheets
            </p>
          </div>
          <button
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white
                       hover:bg-blue-700 transition-colors"
          >
            New Timesheet
          </button>
        </div>

        <TimesheetTable />
      </div>
    </main>
  );
}
