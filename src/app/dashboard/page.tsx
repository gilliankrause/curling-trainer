"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Nav } from "@/components/Nav";

type Rec = { type: string; title: string; description?: string; url?: string };
type FavouriteDrill = { id: string; name: string; focusArea: string; difficulty: string };
type PracticeSession = {
  id: string;
  date: string;
  durationMinutes: number;
  focusAreas: string[];
  notes: string | null;
};

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [recs, setRecs] = useState<Rec[]>([]);
  const [favouriteDrills, setFavouriteDrills] = useState<FavouriteDrill[]>([]);
  const [sessions, setSessions] = useState<PracticeSession[]>([]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/dashboard");
      return;
    }
    if (status !== "authenticated") return;
    Promise.all([
      fetch("/api/recommendations", { credentials: "include" }).then((r) => r.json()).catch(() => []),
      fetch("/api/favourites/drills", { credentials: "include" }).then(async (r) => {
        if (!r.ok) return { drills: [] };
        const data = await r.json();
        return Array.isArray(data.drills) ? data : { drills: [] };
      }).catch(() => ({ drills: [] })),
      fetch("/api/sessions", { credentials: "include" }).then((r) => r.json()).catch(() => []),
    ]).then(([recsData, favData, sessionsData]) => {
      setRecs(Array.isArray(recsData) ? recsData : []);
      setFavouriteDrills(Array.isArray(favData.drills) ? favData.drills : []);
      const list = Array.isArray(sessionsData) ? sessionsData : [];
      setSessions(list);
    });
  }, [status, session?.user?.id, router]);

  const lastPracticeDate = sessions.length > 0 ? new Date(sessions[0].date) : null;
  const now = new Date();
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, 1);
  const sessionsLast6Months = sessions.filter((s) => new Date(s.date) >= sixMonthsAgo);
  const monthsWithData = 6;
  const avgPracticesPerMonth = monthsWithData > 0
    ? (sessionsLast6Months.length / monthsWithData).toFixed(1)
    : "0";
  const focusCounts: Record<string, number> = {};
  sessions.forEach((s) => {
    s.focusAreas.forEach((f: string) => {
      focusCounts[f] = (focusCounts[f] || 0) + 1;
    });
  });
  const topFocus = Object.keys(focusCounts).length > 0
    ? Object.entries(focusCounts).sort((a, b) => b[1] - a[1])[0]
    : null;

  if (status === "loading" || status === "unauthenticated") {
    return (
      <>
        <Nav />
        <main id="main" className="max-w-4xl mx-auto px-4 py-8" role="main">
          <p className="text-zinc-500">
            {status === "loading" ? "Loading..." : "Redirecting to log in..."}
          </p>
        </main>
      </>
    );
  }

  return (
    <>
      <Nav />
      <main id="main" className="max-w-4xl mx-auto px-4 py-8" role="main">
        <h1 className="text-2xl font-bold mb-6">
          Dashboard {session?.user?.name && `– ${session.user.name}`}
        </h1>

        <div className="grid gap-4 sm:grid-cols-2 mb-10">
          <Link
            href="/videos"
            className="rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-800/70 p-6 hover:bg-slate-200 dark:hover:bg-slate-700/80 transition shadow-sm"
          >
            <h2 className="font-semibold text-lg">Video Analysis</h2>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm mt-1">
              Upload slide videos and get AI feedback on your form.
            </p>
          </Link>
          <Link
            href="/sessions"
            className="rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-800/70 p-6 hover:bg-slate-200 dark:hover:bg-slate-700/80 transition shadow-sm"
          >
            <h2 className="font-semibold text-lg">Practice Sessions</h2>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm mt-1">
              Log and track your practice sessions and focus areas.
            </p>
          </Link>
          <Link
            href="/quiz"
            className="rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-800/70 p-6 hover:bg-slate-200 dark:hover:bg-slate-700/80 transition shadow-sm"
          >
            <h2 className="font-semibold text-lg">Quiz</h2>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm mt-1">
              Test your curling knowledge with randomized quizzes.
            </p>
          </Link>
          <Link
            href="/drills"
            className="rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-800/70 p-6 hover:bg-slate-200 dark:hover:bg-slate-700/80 transition shadow-sm"
          >
            <h2 className="font-semibold text-lg">Drills</h2>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm mt-1">
              Browse and create practice drills.
            </p>
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <section className="rounded-lg border border-zinc-200 dark:border-zinc-700 p-4 bg-zinc-50/50 dark:bg-zinc-800/30">
            <h2 className="text-lg font-semibold mb-3">Recommendations</h2>
            {recs.length > 0 ? (
              <ul className="space-y-2 text-sm">
                {recs.slice(0, 5).map((r, i) => (
                  <li key={i}>
                    {r.url ? (
                      <Link href={r.url} className="text-zinc-700 dark:text-zinc-300 hover:underline">
                        {r.type === "focus" && "Focus: "}
                        {r.type === "drill" && "Drill: "}
                        {r.type === "glossary" && "Read: "}
                        {r.title}
                      </Link>
                    ) : (
                      <span className="text-zinc-700 dark:text-zinc-300">{r.title}</span>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-zinc-500 text-sm">Complete a video analysis to get recommendations.</p>
            )}
          </section>

          <section className="rounded-lg border border-zinc-200 dark:border-zinc-700 p-4 bg-zinc-50/50 dark:bg-zinc-800/30">
            <h2 className="text-lg font-semibold mb-3">Favourite Drills</h2>
            {favouriteDrills.length > 0 ? (
              <ul className="space-y-2 text-sm">
                {favouriteDrills.slice(0, 5).map((d) => (
                  <li key={d.id}>
                    <Link href={`/drills#${d.id}`} className="text-zinc-700 dark:text-zinc-300 hover:underline">
                      {d.name}
                    </Link>
                  </li>
                ))}
                {favouriteDrills.length > 5 && (
                  <li>
                    <Link href="/drills" className="text-zinc-500 hover:underline">
                      View all ({favouriteDrills.length})
                    </Link>
                  </li>
                )}
              </ul>
            ) : (
              <p className="text-zinc-500 text-sm">
                <Link href="/drills" className="hover:underline">Browse drills</Link> and star your favourites.
              </p>
            )}
          </section>

          <section className="rounded-lg border border-zinc-200 dark:border-zinc-700 p-4 bg-zinc-50/50 dark:bg-zinc-800/30">
            <h2 className="text-lg font-semibold mb-3">Practice Summary</h2>
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="text-zinc-500 dark:text-zinc-400">Last practice</dt>
                <dd className="font-medium text-zinc-900 dark:text-zinc-100">
                  {lastPracticeDate
                    ? lastPracticeDate.toLocaleDateString(undefined, { dateStyle: "medium" })
                    : "—"}
                </dd>
              </div>
              <div>
                <dt className="text-zinc-500 dark:text-zinc-400">Avg. per month (last 6 months)</dt>
                <dd className="font-medium text-zinc-900 dark:text-zinc-100">{avgPracticesPerMonth}</dd>
              </div>
              <div>
                <dt className="text-zinc-500 dark:text-zinc-400">Top focus</dt>
                <dd className="font-medium text-zinc-900 dark:text-zinc-100 capitalize">
                  {topFocus ? topFocus[0].replace(/_/g, " ") : "—"}
                </dd>
              </div>
            </dl>
            <Link href="/sessions" className="text-sm text-zinc-600 dark:text-zinc-400 hover:underline mt-2 inline-block">
              Log session
            </Link>
          </section>
        </div>
      </main>
    </>
  );
}
