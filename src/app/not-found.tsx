import Link from "next/link";
import { Nav } from "@/components/Nav";

export default function NotFound() {
  return (
    <>
      <Nav />
      <main id="main" className="max-w-4xl mx-auto px-4 py-12" role="main">
        <h1 className="text-2xl font-bold mb-2">Page not found</h1>
        <p className="text-zinc-600 dark:text-zinc-400 mb-6">
          The page you’re looking for doesn’t exist or has been moved.
        </p>
        <Link
          href="/"
          className="rounded-md bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-4 py-2 font-medium inline-block"
        >
          Go to home
        </Link>
      </main>
    </>
  );
}
