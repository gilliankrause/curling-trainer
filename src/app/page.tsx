import Link from "next/link";
import { Nav } from "@/components/Nav";

export default function HomePage() {
  return (
    <>
      <Nav />
      <main id="main" className="max-w-4xl mx-auto px-4 py-12" role="main">
        <h1 className="text-3xl font-bold mb-4 text-zinc-900 dark:text-white">
          Curling Trainer
        </h1>
        <p className="text-zinc-600 dark:text-slate-300 mb-8">
          Improve your slide form, build curling knowledge, and track your
          practice.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/glossary"
            className="rounded-md bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/20 text-zinc-900 dark:text-white px-4 py-2 font-medium hover:bg-slate-200 dark:hover:bg-white/20"
          >
            Glossary
          </Link>
          <Link
            href="/quiz"
            className="rounded-md bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/20 text-zinc-900 dark:text-white px-4 py-2 font-medium hover:bg-slate-200 dark:hover:bg-white/20"
          >
            Quiz
          </Link>
          <Link
            href="/drills"
            className="rounded-md bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/20 text-zinc-900 dark:text-white px-4 py-2 font-medium hover:bg-slate-200 dark:hover:bg-white/20"
          >
            Drills
          </Link>
          <a
            href="/login"
            className="rounded-md bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2 font-medium hover:bg-slate-800 dark:hover:bg-slate-100"
          >
            Log in
          </a>
        </div>
      </main>
    </>
  );
}
