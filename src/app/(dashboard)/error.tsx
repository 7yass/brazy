"use client";

import { useEffect } from "react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard error:", error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="text-center p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm max-w-md">
        <h2 className="text-xl font-bold text-white mb-2">Something went wrong</h2>
        <p className="text-sm text-white/60 mb-6">
          {error.message || "An unexpected error occurred in the dashboard."}
        </p>
        <button
          onClick={reset}
          className="px-5 py-2 rounded-full bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold transition cursor-pointer"
        >
          Try again
        </button>
      </div>
    </div>
  );
}