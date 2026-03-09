"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Nav } from "@/components/Nav";

type Drill = {
  id: string;
  name: string;
  description: string;
  focusArea: string;
  difficulty: string;
  steps: string;
  videoLink: string | null;
};

export default function DrillsPage() {
  const { status } = useSession();
  const [drills, setDrills] = useState<Drill[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    focusArea: "balance",
    difficulty: "beginner",
    steps: "",
    videoLink: "",
  });
  const [saving, setSaving] = useState(false);
  const [focusFilter, setFocusFilter] = useState("");
  const [favouriteIds, setFavouriteIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch("/api/drills")
      .then((r) => r.json())
      .then((data) => setDrills(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/favourites/drills", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => setFavouriteIds(new Set(data.drillIds ?? [])))
      .catch(() => {});
  }, [status]);

  async function toggleFavourite(drillId: string) {
    if (status !== "authenticated") return;
    const isFav = favouriteIds.has(drillId);
    // Optimistic update so the star responds immediately
    if (isFav) {
      setFavouriteIds((prev) => {
        const next = new Set(prev);
        next.delete(drillId);
        return next;
      });
      const res = await fetch(`/api/favourites/drills?drillId=${encodeURIComponent(drillId)}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        setFavouriteIds((prev) => new Set(prev).add(drillId));
      }
    } else {
      setFavouriteIds((prev) => new Set(prev).add(drillId));
      const res = await fetch("/api/favourites/drills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ drillId }),
        credentials: "include",
      });
      if (!res.ok) {
        setFavouriteIds((prev) => {
          const next = new Set(prev);
          next.delete(drillId);
          return next;
        });
      }
    }
  }

  const filteredDrills = focusFilter ? drills.filter((d) => d.focusArea === focusFilter) : drills;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status !== "authenticated") return;
    setSaving(true);
    const res = await fetch("/api/drills", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        videoLink: form.videoLink || null,
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      setDrills((prev) => [...prev, data]);
      setForm({ name: "", description: "", focusArea: "balance", difficulty: "beginner", steps: "", videoLink: "" });
      setShowForm(false);
    }
    setSaving(false);
  }

  return (
    <>
      <Nav />
      <main id="main" className="max-w-4xl mx-auto px-4 py-8" role="main">
        <h1 className="text-2xl font-bold mb-6">Practice drills</h1>
        <p className="text-zinc-600 dark:text-zinc-400 mb-6">
          Browse drills from the Curling Drills Handbook and custom drills. Logged-in users can create drills.
        </p>

        <div className="mb-6">
          <label htmlFor="focus-filter" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Filter by focus</label>
          <select
            id="focus-filter"
            value={focusFilter}
            onChange={(e) => setFocusFilter(e.target.value)}
            className="rounded-md border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-3 py-2"
          >
            <option value="">All focus areas</option>
            <option value="balance">Balance</option>
            <option value="brushing">Brushing</option>
            <option value="weight_control">Weight control</option>
            <option value="line_of_delivery">Line of delivery</option>
            <option value="take_outs">Take outs</option>
            <option value="strategy">Strategy</option>
            <option value="mental_toughness">Mental toughness</option>
            <option value="slideLeg">Slide leg</option>
            <option value="release">Release</option>
            <option value="consistency">Consistency</option>
          </select>
        </div>

        {status === "authenticated" && (
          <div className="mb-6">
            <button
              type="button"
              onClick={() => setShowForm((v) => !v)}
              className="rounded-md bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-4 py-2 font-medium"
            >
              {showForm ? "Cancel" : "Create drill"}
            </button>
            {showForm && (
              <form onSubmit={handleSubmit} className="mt-4 p-4 rounded-lg border border-zinc-200 dark:border-zinc-700 space-y-4">
                <input
                  placeholder="Drill name"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  required
                  className="w-full rounded-md border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-3 py-2"
                />
                <textarea
                  placeholder="Description"
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  required
                  rows={2}
                  className="w-full rounded-md border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-3 py-2"
                />
                <div className="flex gap-4">
                  <select
                    value={form.focusArea}
                    onChange={(e) => setForm((f) => ({ ...f, focusArea: e.target.value }))}
                    className="rounded-md border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-3 py-2"
                  >
                    <option value="balance">Balance</option>
                    <option value="brushing">Brushing</option>
                    <option value="weight_control">Weight control</option>
                    <option value="line_of_delivery">Line of delivery</option>
                    <option value="take_outs">Take outs</option>
                    <option value="strategy">Strategy</option>
                    <option value="mental_toughness">Mental toughness</option>
                    <option value="slideLeg">Slide leg</option>
                    <option value="release">Release</option>
                    <option value="consistency">Consistency</option>
                  </select>
                  <select
                    value={form.difficulty}
                    onChange={(e) => setForm((f) => ({ ...f, difficulty: e.target.value }))}
                    className="rounded-md border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-3 py-2"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
                <textarea
                  placeholder="Steps (one per line or numbered)"
                  value={form.steps}
                  onChange={(e) => setForm((f) => ({ ...f, steps: e.target.value }))}
                  required
                  rows={4}
                  className="w-full rounded-md border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-3 py-2"
                />
                <input
                  placeholder="Video URL (optional)"
                  value={form.videoLink}
                  onChange={(e) => setForm((f) => ({ ...f, videoLink: e.target.value }))}
                  type="url"
                  className="w-full rounded-md border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-3 py-2"
                />
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-md bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-4 py-2 font-medium disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Create"}
                </button>
              </form>
            )}
          </div>
        )}

        {loading ? (
          <p className="text-zinc-500">Loading drills...</p>
        ) : filteredDrills.length === 0 ? (
          <p className="text-zinc-500">{focusFilter ? "No drills in this focus area." : "No drills yet. Create one above or run the database seed."}</p>
        ) : (
          <ul className="space-y-4">
            {filteredDrills.map((d) => (
              <li
                key={d.id}
                id={d.id}
                className="rounded-lg border border-zinc-200 dark:border-zinc-700 p-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <h2 className="font-semibold text-lg">{d.name}</h2>
                  {status === "authenticated" && (
                    <button
                      type="button"
                      onClick={() => toggleFavourite(d.id)}
                      className="shrink-0 p-1 rounded text-amber-500 hover:bg-amber-500/10"
                      title={favouriteIds.has(d.id) ? "Remove from favourites" : "Add to favourites"}
                      aria-label={favouriteIds.has(d.id) ? "Remove from favourites" : "Add to favourites"}
                    >
                      {favouriteIds.has(d.id) ? (
                        <span className="text-xl" aria-hidden>★</span>
                      ) : (
                        <span className="text-xl text-zinc-400 hover:text-amber-500" aria-hidden>☆</span>
                      )}
                    </button>
                  )}
                </div>
                <p className="text-sm text-zinc-500 capitalize">{d.focusArea} · {d.difficulty}</p>
                <p className="text-zinc-700 dark:text-zinc-300 mt-2">{d.description}</p>
                <div className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap">
                  {d.steps}
                </div>
                {d.videoLink && (
                  <a
                    href={d.videoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-zinc-600 dark:text-zinc-400 hover:underline mt-2 inline-block"
                  >
                    Watch video
                  </a>
                )}
              </li>
            ))}
          </ul>
        )}
      </main>
    </>
  );
}
