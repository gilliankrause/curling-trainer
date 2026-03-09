"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Nav } from "@/components/Nav";

type Term = {
  id: string;
  term: string;
  definition: string;
  category: string;
  sourceUrl: string | null;
};

export default function RandomGlossaryPage() {
  const router = useRouter();
  const [term, setTerm] = useState<Term | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/glossary?random=true")
      .then((r) => r.json())
      .then((data) => {
        setTerm(data);
        if (data?.id) router.replace(`/glossary/${data.id}`, { scroll: false });
      })
      .finally(() => setLoading(false));
  }, [router]);

  if (loading || !term) {
    return (
      <>
        <Nav />
        <main id="main" className="max-w-2xl mx-auto px-4 py-8" role="main">
          <p className="text-zinc-500">Loading random term...</p>
          <Link href="/glossary" className="text-zinc-600 dark:text-zinc-400 hover:underline mt-4 inline-block">
            Back to glossary
          </Link>
        </main>
      </>
    );
  }

  return null;
}
