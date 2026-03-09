"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-slate-900 text-white">
      <h1 className="text-xl font-semibold mb-2">Something went wrong</h1>
      <p className="text-slate-300 text-sm mb-6 max-w-md text-center">
        {error.message || "An unexpected error occurred."}
      </p>
      <div className="flex gap-4">
        <button
          type="button"
          onClick={reset}
          className="rounded-md bg-white text-slate-900 px-4 py-2 text-sm font-medium hover:bg-slate-100"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-md border border-white/30 px-4 py-2 text-sm font-medium hover:bg-white/10"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
