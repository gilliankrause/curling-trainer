import Link from "next/link";
import { Nav } from "@/components/Nav";

export default function HomePage() {
  return (
    <>
      <Nav />
      <main id="main" className="max-w-4xl mx-auto px-4 py-14 text-center" role="main">
        <h1 className="font-display text-4xl sm:text-5xl font-bold mb-3 text-zinc-900 dark:text-white tracking-tight">
          Curling Coach
        </h1>
        <p className="text-zinc-500 dark:text-slate-400 text-lg mb-12 max-w-xl mx-auto">
          Your guide to better sliding, clearer strategy, and smarter practice.
        </p>

        <section className="mb-12 text-left max-w-2xl mx-auto">
          <p className="text-zinc-600 dark:text-slate-300 mb-4 text-lg leading-relaxed">
            Curling is a sport of precision and technique—from the slide and release to reading the ice and calling the game. Whether you&apos;re new to the sport or refining your form, this app helps you improve.
          </p>
          <p className="text-zinc-600 dark:text-slate-300 mb-4 leading-relaxed">
            <strong className="text-zinc-800 dark:text-slate-200">Curling Coach</strong> lets you upload slide videos for form feedback, learn terms and rules with the glossary and quiz, and work through drills to build consistency. Sign in to save your progress and track your practice over time.
          </p>
        </section>

        <section className="mb-12 flex flex-col items-center">
          <h2 className="font-display text-xl font-semibold text-zinc-900 dark:text-white mb-4">Watch: Intro to curling</h2>
          <div className="aspect-video w-full max-w-2xl rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700 bg-black shadow-lg">
            <iframe
              src="https://www.youtube.com/embed/WXHh_wadqPw"
              title="Intro to curling (YouTube)"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        </section>

        <section className="flex flex-col items-center">
          <h2 className="font-display text-lg font-semibold text-zinc-800 dark:text-slate-200 mb-4">Get started</h2>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/glossary"
              className="rounded-lg bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/20 text-zinc-900 dark:text-white px-5 py-2.5 font-medium hover:bg-slate-200 dark:hover:bg-white/20 transition-colors"
            >
              Glossary
            </Link>
            <Link
              href="/quiz"
              className="rounded-lg bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/20 text-zinc-900 dark:text-white px-5 py-2.5 font-medium hover:bg-slate-200 dark:hover:bg-white/20 transition-colors"
            >
              Quiz
            </Link>
            <Link
              href="/drills"
              className="rounded-lg bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/20 text-zinc-900 dark:text-white px-5 py-2.5 font-medium hover:bg-slate-200 dark:hover:bg-white/20 transition-colors"
            >
              Drills
            </Link>
            <a
              href="/login"
              className="rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-2.5 font-medium hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
            >
              Log in
            </a>
          </div>
        </section>
      </main>
    </>
  );
}
