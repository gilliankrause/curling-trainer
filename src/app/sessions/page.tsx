"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Nav } from "@/components/Nav";

type SessionItem = {
  id: string;
  date: string;
  durationMinutes: number;
  focusAreas: string[];
  notes: string | null;
  videoAnalysisId: string | null;
  createdAt: string;
};

const FOCUS_OPTIONS = ["balance", "release", "slideLeg", "consistency"];

export default function SessionsPage() {
  const { status } = useSession();
  const router = useRouter();
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 16),
    durationMinutes: 30,
    focusAreas: [] as string[],
    notes: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/sessions");
      return;
    }
    if (status !== "authenticated") return;
    fetch("/api/sessions")
      .then((r) => r.json())
      .then((data) => setSessions(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, [status, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date: new Date(form.date).toISOString(),
        durationMinutes: form.durationMinutes,
        focusAreas: form.focusAreas,
        notes: form.notes || null,
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      setSessions((prev) => [{ ...data, createdAt: new Date().toISOString() }, ...prev]);
      setForm({ date: new Date().toISOString().slice(0, 16), durationMinutes: 30, focusAreas: [], notes: "" });
    }
    setSaving(false);
  }

  function toggleFocus(area: string) {
    setForm((f) => ({
      ...f,
      focusAreas: f.focusAreas.includes(area) ? f.focusAreas.filter((x) => x !== area) : [...f.focusAreas, area],
    }));
  }

  if (status === "loading" || (status === "authenticated" && loading && sessions.length === 0)) {
    return (
      <>
        <Nav />
        <main id="main" className="max-w-2xl mx-auto px-4 py-8" role="main">
          <p className="text-zinc-500">Loading...</p>
        </main>
      </>
    );
  }

  return (
    <>
      <Nav />
      <main id="main" className="max-w-2xl mx-auto px-4 py-8" role="main">
        <h1 className="text-2xl font-bold mb-6">Practice sessions</h1>
        <p className="text-zinc-600 dark:text-zinc-400 mb-6">
          Log your practice sessions to track focus areas and progress.
        </p>

        <form onSubmit={handleSubmit} className="mb-8 p-4 rounded-lg border border-zinc-200 dark:border-zinc-700 space-y-4">
          <h2 className="font-semibold">Log a session</h2>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Date & time</label>
            <input
              type="datetime-local"
              value={form.date}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
              className="w-full rounded-md border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Duration (minutes)</label>
            <input
              type="number"
              min={1}
              max={480}
              value={form.durationMinutes}
              onChange={(e) => setForm((f) => ({ ...f, durationMinutes: parseInt(e.target.value, 10) || 30 }))}
              className="w-full rounded-md border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Focus areas</label>
            <div className="flex flex-wrap gap-2">
              {FOCUS_OPTIONS.map((area) => (
                <button
                  key={area}
                  type="button"
                  onClick={() => toggleFocus(area)}
                  className={`rounded-md px-3 py-1 text-sm ${
                    form.focusAreas.includes(area)
                      ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
                      : "border border-zinc-300 dark:border-zinc-600"
                  }`}
                >
                  {area}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              rows={2}
              className="w-full rounded-md border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-3 py-2"
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="rounded-md bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-4 py-2 font-medium disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save session"}
          </button>
        </form>

        <h2 className="text-lg font-semibold mb-4">Recent sessions</h2>
        {sessions.length === 0 ? (
          <p className="text-zinc-500">No sessions yet.</p>
        ) : (
          <ul className="space-y-3">
            {sessions.map((s) => (
              <li
                key={s.id}
                className="rounded-lg border border-zinc-200 dark:border-zinc-700 p-4"
              >
                <p className="font-medium">{new Date(s.date).toLocaleString()}</p>
                <p className="text-sm text-zinc-500">{s.durationMinutes} min</p>
                {s.focusAreas.length > 0 && (
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    Focus: {s.focusAreas.join(", ")}
                  </p>
                )}
                {s.notes && <p className="text-sm mt-1">{s.notes}</p>}
              </li>
            ))}
          </ul>
        )}
      </main>
    </>
  );
}
