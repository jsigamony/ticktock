import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import TimesheetTable from "@/components/timesheet/TimesheetTable";

export const metadata: Metadata = {
  title: "Dashboard — TickTock",
};

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <main className="flex-1 p-6 bg-gray-50">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Your Timesheets
            </h1>
          </div>
        </div>

        <TimesheetTable userId={session.user.id} />
      </div>
    </main>
  );
}
