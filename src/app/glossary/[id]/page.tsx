"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Nav } from "@/components/Nav";

type Term = {
  id: string;
  term: string;
  definition: string;
  category: string;
  sourceUrl: string | null;
  imageUrl: string | null;
};

export default function GlossaryTermPage() {
  const params = useParams();
  const id = params.id as string;
  const [term, setTerm] = useState<Term | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/glossary/${id}`)
      .then((r) => {
        if (!r.ok) return null;
        return r.json();
      })
      .then(setTerm)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <>
        <Nav />
        <main id="main" className="max-w-2xl mx-auto px-4 py-8" role="main">
          <p className="text-zinc-500">Loading...</p>
        </main>
      </>
    );
  }

  if (!term) {
    return (
      <>
        <Nav />
        <main id="main" className="max-w-2xl mx-auto px-4 py-8" role="main">
          <p className="text-zinc-500">Term not found.</p>
          <Link href="/glossary" className="text-zinc-900 dark:text-white underline mt-4 inline-block">
            Back to glossary
          </Link>
        </main>
      </>
    );
  }

  return (
    <>
      <Nav />
      <main id="main" className="max-w-2xl mx-auto px-4 py-8" role="main">
        <Link href="/glossary" className="text-zinc-600 dark:text-zinc-400 hover:underline text-sm mb-4 inline-block">
          Back to glossary
        </Link>
        <h1 className="text-2xl font-bold mb-2">{term.term}</h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-4 capitalize">{term.category}</p>
        <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">{term.definition}</p>
        {term.sourceUrl && (
          <a
            href={term.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-zinc-600 dark:text-zinc-400 hover:underline mt-4 inline-block"
          >
            Source: Curling Canada
          </a>
        )}
      </main>
    </>
  );
}
