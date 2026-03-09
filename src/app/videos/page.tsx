"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Nav } from "@/components/Nav";

type VideoItem = {
  id: string;
  videoPath: string;
  status: string;
  overallScore: number | null;
  createdAt: string;
  completedAt: string | null;
};

export default function VideosPage() {
  const { status } = useSession();
  const router = useRouter();
  const [list, setList] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/videos");
      return;
    }
    if (status !== "authenticated") return;
    fetch("/api/videos")
      .then((r) => r.json())
      .then((data) => setList(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, [status, router]);

  async function handleUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const form = e.currentTarget;
    const input = form.querySelector('input[type="file"]') as HTMLInputElement;
    if (!input?.files?.length) {
      setError("Select a video file (MP4, MOV, AVI, or WebM).");
      return;
    }
    setUploading(true);
    const formData = new FormData();
    formData.set("video", input.files[0]);
    const res = await fetch("/api/videos/upload", { method: "POST", body: formData });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error || "Upload failed");
      setUploading(false);
      return;
    }
    setList((prev) => [{ ...data, createdAt: new Date().toISOString(), completedAt: null }, ...prev]);
    setUploading(false);
    form.reset();
  }

  if (status === "loading" || (status === "authenticated" && loading && list.length === 0)) {
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
        <h1 className="text-2xl font-bold mb-6">Video Analysis</h1>
        <p className="text-zinc-600 dark:text-zinc-400 mb-6">
          Upload a video of your curling slide. We&apos;ll analyze your form and give feedback. For best results, film from the side with your full body in frame.
        </p>

        <form onSubmit={handleUpload} className="mb-8">
          <input
            type="file"
            accept="video/mp4,video/quicktime,video/x-msvideo,video/webm"
            className="block w-full text-sm text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-zinc-100 dark:file:bg-zinc-800 file:text-zinc-900 dark:file:text-zinc-100"
          />
          {error && <p className="text-red-600 dark:text-red-400 text-sm mt-2">{error}</p>}
          <button
            type="submit"
            disabled={uploading}
            className="mt-4 rounded-md bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-4 py-2 font-medium disabled:opacity-50"
          >
            {uploading ? "Uploading..." : "Upload video"}
          </button>
        </form>

        <h2 className="text-lg font-semibold mb-4">Your videos</h2>
        {list.length === 0 ? (
          <p className="text-zinc-500">No videos yet. Upload one above.</p>
        ) : (
          <ul className="space-y-3">
            {list.map((v) => (
              <li key={v.id}>
                <Link
                  href={`/videos/${v.id}`}
                  className="block rounded-lg border border-zinc-200 dark:border-zinc-700 p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition"
                >
                  <span className="font-medium">{v.videoPath}</span>
                  <span className="text-zinc-500 text-sm ml-2">({v.status})</span>
                  {v.overallScore != null && (
                    <span className="text-zinc-600 dark:text-zinc-400 text-sm ml-2">
                      Score: {v.overallScore.toFixed(1)}
                    </span>
                  )}
                  <p className="text-zinc-500 text-xs mt-1">
                    {new Date(v.createdAt).toLocaleString()}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </>
  );
}
