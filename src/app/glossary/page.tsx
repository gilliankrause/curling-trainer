"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Nav } from "@/components/Nav";

type GlossaryTerm = {
  id: string;
  term: string;
  definition: string;
  category: string;
  sourceUrl: string | null;
};

export default function GlossaryPage() {
  const [terms, setTerms] = useState<GlossaryTerm[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set("q", search);
    if (category) params.set("category", category);
    fetch(`/api/glossary?${params}`)
      .then((r) => r.json())
      .then(setTerms)
      .finally(() => setLoading(false));
  }, [search, category]);

  return (
    <>
      <Nav />
      <main id="main" className="max-w-4xl mx-auto px-4 py-8" role="main">
        <h1 className="text-2xl font-bold mb-6">Glossary of Curling Terms</h1>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            type="search"
            placeholder="Search terms..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 rounded-md border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-3 py-2"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-md border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-3 py-2"
          >
            <option value="">All categories</option>
            <option value="equipment">Equipment</option>
            <option value="ice">Ice</option>
            <option value="gameplay">Gameplay</option>
          </select>
          <Link
            href="/glossary/random"
            className="rounded-md bg-zinc-200 dark:bg-zinc-700 px-4 py-2 font-medium hover:bg-zinc-300 dark:hover:bg-zinc-600 text-center"
          >
            Random term
          </Link>
        </div>
        {loading ? (
          <p className="text-zinc-500">Loading...</p>
        ) : (
          <ul className="space-y-2">
            {terms.map((t) => (
              <li key={t.id}>
                <Link
                  href={`/glossary/${t.id}`}
                  className="block rounded-lg border border-zinc-200 dark:border-zinc-700 p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition"
                >
                  <span className="font-semibold">{t.term}</span>
                  <span className="text-zinc-500 dark:text-zinc-400 text-sm ml-2">({t.category})</span>
                  <p className="text-zinc-600 dark:text-zinc-400 text-sm mt-1 line-clamp-2">{t.definition}</p>
                </Link>
              </li>
            ))}
          </ul>
        )}
        {!loading && terms.length === 0 && (
          <p className="text-zinc-500">No terms found.</p>
        )}
      </main>
    </>
  );
}
