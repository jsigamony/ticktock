"use client";

import { useState } from "react";
import type { TimesheetEntry } from "@/types";

const PROJECTS = [
  "Project Alpha",
  "Project Beta",
  "Project Gamma",
  "Project Delta",
];

const TASK_TYPES = [
  "Bug fixes",
  "Frontend development",
  "Backend development",
  "Code review",
  "Testing",
  "Documentation",
  "Meetings",
  "Deployment",
  "Research",
  "UI design",
];

interface AddTimeModalProps {
  isOpen: boolean;
  onClose: () => void;
  timesheetId: string;
  date: string;
  onAdded: (entry: TimesheetEntry) => void;
  entryToEdit?: TimesheetEntry | null;
  onUpdated?: (entry: TimesheetEntry) => void;
}

const InfoIcon = () => (
  <span className="inline-flex items-center justify-center w-3 h-3 text-[10px] bg-gray-400 text-white font-bold border border-gray-300 rounded-full ml-2">
    i
  </span>
);

const AddTimeModal = ({
  isOpen,
  onClose,
  timesheetId,
  date,
  onAdded,
  entryToEdit,
  onUpdated,
}: AddTimeModalProps) => {
  const [project, setProject] = useState(entryToEdit?.project ?? PROJECTS[0]);
  const [task, setTask] = useState(entryToEdit?.task ?? TASK_TYPES[0]);
  const [description, setDescription] = useState(
    entryToEdit?.description ?? "",
  );
  const [hours, setHours] = useState(entryToEdit?.hours ?? 1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isEditing = Boolean(entryToEdit);
  const projectOptions =
    entryToEdit?.project && !PROJECTS.includes(entryToEdit.project)
      ? [entryToEdit.project, ...PROJECTS]
      : PROJECTS;
  const taskOptions =
    entryToEdit?.task && !TASK_TYPES.includes(entryToEdit.task)
      ? [entryToEdit.task, ...TASK_TYPES]
      : TASK_TYPES;

  function handleClose() {
    setProject(PROJECTS[0]);
    setTask(TASK_TYPES[0]);
    setDescription("");
    setHours(1);
    setError(null);
    onClose();
  }

  async function handleSubmit() {
    setSaving(true);
    setError(null);
    try {
      const payload = {
        date,
        task,
        project,
        hours,
        description,
        ...(entryToEdit ? { entryId: entryToEdit.id } : {}),
      };
      const res = await fetch(
        `/api/timesheets/${encodeURIComponent(timesheetId)}`,
        {
          method: isEditing ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      if (!res.ok) {
        throw new Error(
          isEditing ? "Failed to update entry" : "Failed to add entry",
        );
      }
      const entry = (await res.json()) as TimesheetEntry;
      if (isEditing) {
        onUpdated?.(entry);
      } else {
        onAdded(entry);
      }
      handleClose();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : isEditing
            ? "Failed to update entry"
            : "Failed to add entry",
      );
    } finally {
      setSaving(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={handleClose} />

      <div className="relative bg-white w-full max-w-lg rounded-xl shadow-lg">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-gray-900 text-lg font-semibold">
            {isEditing ? "Edit Entry" : "Add New Entry"}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 text-xl"
          >
            ×
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
              {error}
            </p>
          )}

          <div>
            <label className="text-sm text-gray-600 mb-1 block">
              Select Project *
              <InfoIcon />
            </label>
            <select
              value={project}
              onChange={(e) => setProject(e.target.value)}
              className="w-full border rounded-md px-3 py-2 text-sm text-gray-700"
            >
              {projectOptions.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-600 mb-1 block">
              Type of Work *
              <InfoIcon />
            </label>
            <select
              value={task}
              onChange={(e) => setTask(e.target.value)}
              className="w-full border rounded-md px-3 py-2 text-sm text-gray-700"
            >
              {taskOptions.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-600 mb-1 block">
              Task description *
            </label>
            <textarea
              placeholder="Write text here ..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border rounded-md px-3 py-2 text-sm h-28 resize-none text-gray-700"
            />
            <p className="text-xs text-gray-400 mt-1">A note for extra info</p>
          </div>

          <div>
            <label className="text-sm text-gray-600 mb-1 block">Hours *</label>

            <div className="flex items-center w-fit border rounded-md overflow-hidden">
              <button
                type="button"
                onClick={() => setHours((h) => Math.max(0.5, h - 0.5))}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600"
              >
                −
              </button>

              <div className="px-4 text-sm text-gray-600">{hours}</div>

              <button
                type="button"
                onClick={() => setHours((h) => Math.min(24, h + 0.5))}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-between gap-3 px-6 py-4 border-t">
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? "Saving..." : isEditing ? "Save changes" : "Add entry"}
          </button>

          <button
            onClick={handleClose}
            className="flex-1 border py-2 rounded-md text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTimeModal;
