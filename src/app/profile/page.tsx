"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Nav } from "@/components/Nav";

type ProfileData = {
  id: string;
  name: string;
  yearStartedCurling: number | null;
  club: string | null;
  teams: string[];
};

type FavouriteDrill = {
  id: string;
  name: string;
  focusArea: string;
  difficulty: string;
};

export default function ProfilePage() {
  const { status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", yearStartedCurling: "", club: "", teamsText: "" });
  const [favouriteDrills, setFavouriteDrills] = useState<FavouriteDrill[]>([]);
  const [quizCount, setQuizCount] = useState<number | null>(null);
  const [averageQuizScore, setAverageQuizScore] = useState<number | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/profile");
      return;
    }
    if (status !== "authenticated") return;
    Promise.all([
      fetch("/api/profile", { credentials: "include" }).then((r) => r.json()),
      fetch("/api/favourites/drills", { credentials: "include" }).then((r) => r.json()).catch(() => ({ drills: [] })),
      fetch("/api/quiz/stats", { credentials: "include" }).then((r) => r.json()).catch(() => ({ quizCount: 0, averageScore: null })),
    ]).then(([profileData, favouritesData, statsData]) => {
      if (!profileData.error) {
        setProfile(profileData);
        setForm({
          name: profileData.name ?? "",
          yearStartedCurling: profileData.yearStartedCurling != null ? String(profileData.yearStartedCurling) : "",
          club: profileData.club ?? "",
          teamsText: Array.isArray(profileData.teams) ? profileData.teams.join(", ") : "",
        });
      }
      setFavouriteDrills(favouritesData.drills ?? []);
      setQuizCount(statsData.quizCount ?? 0);
      setAverageQuizScore(statsData.averageScore ?? null);
    }).finally(() => setLoading(false));
  }, [status, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    const teams = form.teamsText ? form.teamsText.split(",").map((t) => t.trim()).filter(Boolean) : [];
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        yearStartedCurling: form.yearStartedCurling ? parseInt(form.yearStartedCurling, 10) : null,
        club: form.club || null,
        teams,
      }),
    });
    const data = await res.json();
    if (res.ok && data.teams) {
      setProfile({ ...profile, ...data });
    }
    setSaving(false);
  }

  if (status === "loading" || loading) {
    return (
      <>
        <Nav />
        <main id="main" className="max-w-2xl mx-auto px-4 py-8" role="main">
          <p className="text-zinc-500">Loading profile...</p>
        </main>
      </>
    );
  }

  return (
    <>
      <Nav />
      <main id="main" className="max-w-2xl mx-auto px-4 py-8" role="main">
        <h1 className="text-2xl font-bold mb-6">Profile</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              required
              className="w-full rounded-md border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-3 py-2"
            />
          </div>
          <div>
            <label htmlFor="yearStartedCurling" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Year started curling
            </label>
            <input
              id="yearStartedCurling"
              type="number"
              min={1900}
              max={2100}
              value={form.yearStartedCurling}
              onChange={(e) => setForm((f) => ({ ...f, yearStartedCurling: e.target.value }))}
              className="w-full rounded-md border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-3 py-2"
            />
          </div>
          <div>
            <label htmlFor="club" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Club
            </label>
            <input
              id="club"
              type="text"
              value={form.club}
              onChange={(e) => setForm((f) => ({ ...f, club: e.target.value }))}
              className="w-full rounded-md border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-3 py-2"
            />
          </div>
          <div>
            <label htmlFor="teams" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Team(s) (comma-separated)
            </label>
            <input
              id="teams"
              type="text"
              value={form.teamsText}
              onChange={(e) => setForm((f) => ({ ...f, teamsText: e.target.value }))}
              placeholder="e.g. Team Smith, Mixed Doubles"
              className="w-full rounded-md border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-3 py-2"
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="rounded-md bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-4 py-2 font-medium disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save profile"}
          </button>
        </form>

        <section className="mt-8 pt-8 border-t border-zinc-200 dark:border-zinc-700">
          <h2 className="text-lg font-semibold mb-3">Quiz stats</h2>
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-zinc-500 dark:text-zinc-400">Quizzes taken</dt>
              <dd className="font-medium text-zinc-900 dark:text-zinc-100">{quizCount ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-zinc-500 dark:text-zinc-400">Average score</dt>
              <dd className="font-medium text-zinc-900 dark:text-zinc-100">
                {averageQuizScore != null ? `${averageQuizScore}%` : "—"}
              </dd>
            </div>
          </dl>
          <p className="text-zinc-500 text-sm mt-2">
            <Link href="/quiz" className="text-zinc-700 dark:text-zinc-300 hover:underline">Take a quiz</Link>
          </p>
        </section>

        {favouriteDrills.length > 0 && (
          <section className="mt-8 pt-8 border-t border-zinc-200 dark:border-zinc-700">
            <h2 className="text-lg font-semibold mb-3">Favourite drills</h2>
            <ul className="space-y-2">
              {favouriteDrills.map((d) => (
                <li key={d.id}>
                  <a
                    href={`/drills#${d.id}`}
                    className="text-zinc-700 dark:text-zinc-300 hover:underline"
                  >
                    {d.name}
                  </a>
                  <span className="text-zinc-500 text-sm ml-2 capitalize">
                    {d.focusArea.replace(/_/g, " ")} · {d.difficulty}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </>
  );
}
