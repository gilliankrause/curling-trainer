"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Nav } from "@/components/Nav";

type Rec = { type: string; title: string; description?: string; url?: string };

function RecommendationsBlock({ analysisId }: { analysisId: string }) {
  const [recs, setRecs] = useState<Rec[]>([]);
  useEffect(() => {
    fetch(`/api/recommendations/video/${analysisId}`)
      .then((r) => r.json())
      .then((data) => setRecs(Array.isArray(data) ? data : []));
  }, [analysisId]);
  if (recs.length === 0) return null;
  return (
    <div className="rounded-lg border border-zinc-200 dark:border-zinc-700 p-4 bg-zinc-50 dark:bg-zinc-800/50">
      <h2 className="font-semibold mb-2">Recommendations</h2>
      <ul className="space-y-1 text-sm">
        {recs.map((r, i) => (
          <li key={i}>
            {r.url ? (
              <Link href={r.url} className="text-zinc-700 dark:text-zinc-300 hover:underline">{r.title}</Link>
            ) : (
              <span className="text-zinc-700 dark:text-zinc-300">{r.title}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

type Analysis = {
  id: string;
  videoPath: string;
  status: string;
  overallScore: number | null;
  subScores: { balance?: number; slideLeg?: number; release?: number; consistency?: number } | null;
  feedback: string[] | null;
  frameRefs: unknown;
  createdAt: string;
  completedAt: string | null;
};

export default function VideoDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { status } = useSession();
  const id = params.id as string;
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  const refresh = () => {
    if (!id) return;
    fetch(`/api/videos/${id}`)
      .then((r) => r.json())
      .then((data) => !data.error && setAnalysis(data));
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/videos");
      return;
    }
    if (status !== "authenticated" || !id) return;
    fetch(`/api/videos/${id}`)
      .then((r) => r.json())
      .then((data) => (data.error ? null : setAnalysis(data)))
      .finally(() => setLoading(false));
  }, [id, status, router]);

  if (loading || !analysis) {
    return (
      <>
        <Nav />
        <main id="main" className="max-w-2xl mx-auto px-4 py-8" role="main">
          {!analysis && !loading && <p className="text-zinc-500">Video not found.</p>}
          {loading && <p className="text-zinc-500">Loading...</p>}
          <Link href="/videos" className="text-zinc-600 dark:text-zinc-400 hover:underline mt-4 inline-block">
            Back to videos
          </Link>
        </main>
      </>
    );
  }

  const videoUrl = `/api/videos/${id}/file`;

  return (
    <>
      <Nav />
      <main id="main" className="max-w-2xl mx-auto px-4 py-8" role="main">
        <Link href="/videos" className="text-zinc-600 dark:text-zinc-400 hover:underline text-sm mb-4 inline-block">
          Back to videos
        </Link>
        <h1 className="text-2xl font-bold mb-4">Slide analysis</h1>
        <p className="text-sm text-zinc-500 mb-4">
          Uploaded {new Date(analysis.createdAt).toLocaleString()} · Status: {analysis.status}
        </p>

        <div className="rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-700 bg-black mb-6">
          <video src={videoUrl} controls className="w-full aspect-video" />
        </div>

        {analysis.status === "completed" && (
          <div className="space-y-4">
            <RecommendationsBlock analysisId={id} />
            {analysis.overallScore != null && (
              <p className="text-lg font-semibold">
                Overall score: {analysis.overallScore.toFixed(1)} / 100
              </p>
            )}
            {analysis.subScores && (
              <div className="grid grid-cols-2 gap-2 text-sm">
                {analysis.subScores.balance != null && (
                  <p>Balance: {analysis.subScores.balance.toFixed(0)}</p>
                )}
                {analysis.subScores.slideLeg != null && (
                  <p>Slide leg: {analysis.subScores.slideLeg.toFixed(0)}</p>
                )}
                {analysis.subScores.release != null && (
                  <p>Release: {analysis.subScores.release.toFixed(0)}</p>
                )}
                {analysis.subScores.consistency != null && (
                  <p>Consistency: {analysis.subScores.consistency.toFixed(0)}</p>
                )}
              </div>
            )}
            {analysis.feedback && analysis.feedback.length > 0 && (
              <div>
                <h2 className="font-semibold mb-2">Feedback</h2>
                <ul className="list-disc list-inside space-y-1 text-zinc-700 dark:text-zinc-300">
                  {analysis.feedback.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {analysis.status === "pending" && (
          <div>
            <p className="text-zinc-500 mb-4">
              Analysis is pending. Click below to run slide form analysis (this may take a moment).
            </p>
            <button
              type="button"
              disabled={analyzing}
              onClick={async () => {
                setAnalyzing(true);
                const res = await fetch(`/api/videos/${id}/analyze`, { method: "POST" });
                setAnalyzing(false);
                if (res.ok) refresh();
              }}
              className="rounded-md bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-4 py-2 font-medium disabled:opacity-50"
            >
              {analyzing ? "Analyzing..." : "Run analysis"}
            </button>
          </div>
        )}
        {analysis.status === "processing" && (
          <p className="text-zinc-500">Analysis in progress...</p>
        )}
        {analysis.status === "failed" && (
          <p className="text-red-600 dark:text-red-400">Analysis failed. Try uploading again.</p>
        )}
      </main>
    </>
  );
}
