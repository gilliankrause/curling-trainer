"use client";

import { useState, useEffect } from "react";

/** Renders children only after mount to avoid hydration issues with session-dependent UI. */
export function ClientShell({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center text-zinc-500">
        Loading...
      </div>
    );
  }
  return <>{children}</>;
}
