"use client";

import Link from "next/link";
import { useEffect } from "react";

interface ErrorProps {
  error: Error;
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground px-4 py-10">
      <div className="w-full max-w-lg rounded-3xl border border-gray-200 bg-white/95 p-8 shadow-xl backdrop-blur-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-pink-600">
          Something went wrong
        </p>
        <h1 className="mt-4 text-3xl font-semibold text-gray-900">
          Unable to load TickTock
        </h1>
        <p className="mt-3 text-sm leading-6 text-gray-600">
          An unexpected error occurred while rendering the app. Refresh the page
          or try again.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Return home
          </Link>
        </div>
      </div>
    </div>
  );
}
