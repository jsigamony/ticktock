"use client";

import { useEffect, useReducer, useState } from "react";
import type { Timesheet, TimesheetEntry } from "@/types";
import { formatWeekRange } from "@/lib/utils";
import AddTimeModal from "./AddTimeModal";

interface TimeSheetDetailsProps {
  timesheetId: string | null;
  onBack: () => void;
}

interface DayGroup {
  date: string;
  entries: TimesheetEntry[];
}

interface TimesheetDetailData {
  timesheet: Timesheet;
  days: DayGroup[];
  loggedHours: number;
  targetHours: number;
}

type FetchState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; data: TimesheetDetailData };

type ReducerAction =
  | FetchState
  | { type: "add_entry"; date: string; entry: TimesheetEntry }
  | { type: "update_entry"; entry: TimesheetEntry }
  | { type: "delete_entry"; entry: TimesheetEntry };

function removeEntryFromDays(days: DayGroup[], entryId: string) {
  return days
    .map((day) => ({
      ...day,
      entries: day.entries.filter((entry) => entry.id !== entryId),
    }))
    .filter((day) => day.entries.length > 0);
}

function addEntryToDays(days: DayGroup[], entry: TimesheetEntry) {
  const dayExists = days.some((day) => day.date === entry.date);

  const updatedDays = dayExists
    ? days.map((day) =>
        day.date === entry.date
          ? { ...day, entries: [...day.entries, entry] }
          : day,
      )
    : [...days, { date: entry.date, entries: [entry] }];

  return updatedDays.sort((a, b) => a.date.localeCompare(b.date));
}

function fetchReducer(prev: FetchState, action: ReducerAction): FetchState {
  if ("type" in action) {
    if (action.type === "add_entry" && prev.status === "success") {
      return {
        status: "success",
        data: {
          ...prev.data,
          days: addEntryToDays(prev.data.days, action.entry),
          loggedHours: prev.data.loggedHours + action.entry.hours,
        },
      };
    }
    if (action.type === "update_entry" && prev.status === "success") {
      const previousEntry = prev.data.days
        .flatMap((day) => day.entries)
        .find((entry) => entry.id === action.entry.id);

      if (!previousEntry) return prev;

      return {
        status: "success",
        data: {
          ...prev.data,
          days: addEntryToDays(
            removeEntryFromDays(prev.data.days, action.entry.id),
            action.entry,
          ),
          loggedHours:
            prev.data.loggedHours - previousEntry.hours + action.entry.hours,
        },
      };
    }
    if (action.type === "delete_entry" && prev.status === "success") {
      return {
        status: "success",
        data: {
          ...prev.data,
          days: removeEntryFromDays(prev.data.days, action.entry.id),
          loggedHours: prev.data.loggedHours - action.entry.hours,
        },
      };
    }
    return prev;
  }
  return action;
}

const TaskRow = ({
  entry,
  timesheetId,
  onEntryUpdated,
  onEntryDeleted,
}: {
  entry: TimesheetEntry;
  timesheetId: string;
  onEntryUpdated: (entry: TimesheetEntry) => void;
  onEntryDeleted: (entry: TimesheetEntry) => void;
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    if (!window.confirm("Delete this entry?")) return;

    setDeleting(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/timesheets/${encodeURIComponent(timesheetId)}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ entryId: entry.id }),
        },
      );

      if (!res.ok) throw new Error("Failed to delete entry");

      const deletedEntry = (await res.json()) as TimesheetEntry;
      onEntryDeleted(deletedEntry);
      setMenuOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete entry");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="relative">
      <div className="flex items-center justify-between border rounded-md px-3 py-2 bg-white hover:bg-gray-50">
        <span className="text-sm text-gray-700">{entry?.task}</span>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400">{entry?.hours} hrs</span>
          <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
            {entry?.project}
          </span>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="text-gray-400 hover:text-gray-600 px-1"
            aria-expanded={menuOpen}
            aria-haspopup="menu"
            aria-label="Entry actions"
          >
            ...
          </button>
        </div>
      </div>

      {menuOpen && (
        <div
          role="menu"
          className="absolute right-0 top-9 z-10 w-32 overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg"
        >
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setEditOpen(true);
              setMenuOpen(false);
            }}
            className="block w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
          >
            Edit
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={handleDelete}
            disabled={deleting}
            className="block w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      )}

      {error && (
        <p className="mt-1 text-xs text-red-600">
          {error}
        </p>
      )}

      {editOpen && (
        <AddTimeModal
          isOpen={editOpen}
          onClose={() => setEditOpen(false)}
          timesheetId={timesheetId}
          date={entry.date}
          entryToEdit={entry}
          onAdded={() => undefined}
          onUpdated={(updatedEntry) => {
            onEntryUpdated(updatedEntry);
            setEditOpen(false);
          }}
        />
      )}
    </div>
  );
};

const DaySection = ({
  day,
  timesheetId,
  onEntryAdded,
  onEntryUpdated,
  onEntryDeleted,
}: {
  day: DayGroup;
  timesheetId: string;
  onEntryAdded: (date: string, entry: TimesheetEntry) => void;
  onEntryUpdated: (entry: TimesheetEntry) => void;
  onEntryDeleted: (entry: TimesheetEntry) => void;
}) => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="flex gap-4">
      <div className="w-16 text-sm text-gray-600 pt-2">{day.date}</div>

      <div className="flex-1 space-y-2">
        {day.entries.map((entry) => (
          <TaskRow
            key={entry.id}
            entry={entry}
            timesheetId={timesheetId}
            onEntryUpdated={onEntryUpdated}
            onEntryDeleted={onEntryDeleted}
          />
        ))}

        <div
          onClick={() => setModalOpen(true)}
          className="border border-dashed rounded-md px-3 py-2 text-center text-sm text-blue-600 cursor-pointer hover:bg-blue-50"
        >
          + Add new task
        </div>

        <AddTimeModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          timesheetId={timesheetId}
          date={day.date}
          onAdded={(entry) => {
            onEntryAdded(day.date, entry);
            setModalOpen(false);
          }}
        />
      </div>
    </div>
  );
};

const ProgressBar = ({
  loggedHours,
  targetHours,
}: {
  loggedHours: number;
  targetHours: number;
}) => {
  const pct = Math.min(Math.round((loggedHours / targetHours) * 100), 100);
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-gray-500">
        {loggedHours}/{targetHours} hrs
      </span>
      <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full bg-orange-500" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-gray-500">{pct}%</span>
    </div>
  );
};
const TimesheetDetail = ({ timesheetId, onBack }: TimeSheetDetailsProps) => {
  const [state, dispatch] = useReducer(fetchReducer, { status: "idle" });

  useEffect(() => {
    if (!timesheetId) return;

    dispatch({ status: "loading" });

    fetch(`/api/timesheets/${encodeURIComponent(timesheetId)}`)
      .then(async (res) => {
        if (!res.ok)
          throw new Error(`Failed to load timesheet (${res.status})`);
        return res.json() as Promise<TimesheetDetailData>;
      })
      .then((data) => dispatch({ status: "success", data }))
      .catch((err: unknown) => {
        dispatch({
          status: "error",
          message: err instanceof Error ? err.message : "Unknown error",
        });
      });
  }, [timesheetId]);

  if (!timesheetId) return null;

  return (
    <>
      {state.status === "loading" && (
        <div className="flex items-center justify-center py-16 text-gray-500 text-sm">
          Loading…
        </div>
      )}

      {state.status === "error" && (
        <div className="rounded-md bg-red-50 border border-red-200 p-4 text-sm text-red-700">
          {state.message}
        </div>
      )}

      <div className="min-h-screen bg-gray-100 ">
        <div className="flex justify-start mt-4 mb-4">
          <button
            onClick={onBack}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
          >
            ←
          </button>
        </div>
        <div className="bg-white rounded-xl border shadow-sm p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                This week’s timesheet
              </h2>
              <p className="text-sm text-gray-500">
                {state.status === "success" &&
                  formatWeekRange(
                    state.data.timesheet.weekStart,
                    state.data.timesheet.weekEnd,
                  )}
              </p>
            </div>

            {state.status === "success" && (
              <ProgressBar
                loggedHours={state.data.loggedHours}
                targetHours={state.data.targetHours}
              />
            )}
          </div>

          <div className="space-y-6">
            {state.status === "success" &&
              state.data.days.map((day) => (
                <DaySection
                  key={day.date}
                  day={day}
                  timesheetId={timesheetId}
                  onEntryAdded={(date, entry) =>
                    dispatch({ type: "add_entry", date, entry })
                  }
                  onEntryUpdated={(entry) =>
                    dispatch({ type: "update_entry", entry })
                  }
                  onEntryDeleted={(entry) =>
                    dispatch({ type: "delete_entry", entry })
                  }
                />
              ))}
          </div>
        </div>
      </div>

      <footer className="w-full bg-white border border-gray-300 px-6 py-6 rounded-lg">
        <div className="flex items-center justify-center text-gray-400 text-sm">
          © 2024 tentwenty. All rights reserved.
        </div>
      </footer>
    </>
  );
};

export default TimesheetDetail;
