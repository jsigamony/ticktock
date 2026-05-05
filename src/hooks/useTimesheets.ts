"use client";

import { useState, useEffect, useCallback } from "react";
import type { Timesheet, TimesheetEntry } from "@/types";

interface UseTimesheetsOptions {
  userId?: string;
}

interface UseTimesheetsResult {
  timesheets: Timesheet[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useTimesheets({
  userId,
}: UseTimesheetsOptions = {}): UseTimesheetsResult {
  const [timesheets, setTimesheets] = useState<Timesheet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTimesheets = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (userId) params.set("userId", userId);

      const url = `/api/timesheets${params.size > 0 ? `?${params.toString()}` : ""}`;
      const res = await fetch(url);

      if (!res.ok) throw new Error(`Failed to fetch timesheets: ${res.status}`);

      const data = (await res.json()) as Timesheet[];
      setTimesheets(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    void fetchTimesheets();
  }, [fetchTimesheets]);

  return { timesheets, loading, error, refetch: fetchTimesheets };
}

interface UseTimesheetEntriesResult {
  entries: TimesheetEntry[];
  loading: boolean;
  error: string | null;
}

export function useTimesheetEntries(
  timesheetId: string | null,
): UseTimesheetEntriesResult {
  const [entries, setEntries] = useState<TimesheetEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!timesheetId) return;

    setLoading(true);
    setError(null);

    fetch(`/api/timesheets?timesheetId=${encodeURIComponent(timesheetId)}`)
      .then(async (res) => {
        if (!res.ok) throw new Error(`Failed to fetch entries: ${res.status}`);
        return res.json() as Promise<TimesheetEntry[]>;
      })
      .then(setEntries)
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Unknown error");
      })
      .finally(() => setLoading(false));
  }, [timesheetId]);

  return { entries, loading, error };
}
