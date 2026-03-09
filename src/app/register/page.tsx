"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [yearStartedCurling, setYearStartedCurling] = useState("");
  const [club, setClub] = useState("");
  const [teamsText, setTeamsText] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const teams = teamsText
      ? teamsText.split(",").map((t) => t.trim()).filter(Boolean)
      : [];
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
        name,
        yearStartedCurling: yearStartedCurling ? parseInt(yearStartedCurling, 10) : null,
        club: club || null,
        teams,
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error || "Registration failed");
      return;
    }
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm space-y-6">
        <h1 className="text-2xl font-bold text-center">Create account</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/50 px-3 py-2 rounded">
              {typeof error === "string" ? error : JSON.stringify(error)}
            </p>
          )}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-md border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-3 py-2 text-zinc-900 dark:text-zinc-100"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-md border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-3 py-2 text-zinc-900 dark:text-zinc-100"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Password (min 8 characters)
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="w-full rounded-md border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-3 py-2 text-zinc-900 dark:text-zinc-100"
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
              value={yearStartedCurling}
              onChange={(e) => setYearStartedCurling(e.target.value)}
              placeholder="e.g. 2015"
              className="w-full rounded-md border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-3 py-2 text-zinc-900 dark:text-zinc-100"
            />
          </div>
          <div>
            <label htmlFor="club" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Club
            </label>
            <input
              id="club"
              type="text"
              value={club}
              onChange={(e) => setClub(e.target.value)}
              placeholder="e.g. Ottawa Curling Club"
              className="w-full rounded-md border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-3 py-2 text-zinc-900 dark:text-zinc-100"
            />
          </div>
          <div>
            <label htmlFor="teams" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Team(s) (comma-separated)
            </label>
            <input
              id="teams"
              type="text"
              value={teamsText}
              onChange={(e) => setTeamsText(e.target.value)}
              placeholder="e.g. Team Smith, Mixed Doubles"
              className="w-full rounded-md border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-3 py-2 text-zinc-900 dark:text-zinc-100"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-md bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 py-2 font-medium"
          >
            Sign up
          </button>
        </form>
        <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
          Already have an account?{" "}
          <Link href="/login" className="text-zinc-900 dark:text-white font-medium hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
