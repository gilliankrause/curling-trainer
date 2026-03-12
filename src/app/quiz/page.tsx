"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Nav } from "@/components/Nav";

type QuizQuestion = {
  id: string;
  questionText: string;
  type: string;
  options: string[];
  correctAnswer: string;
  difficulty: string;
};

export default function QuizPage() {
  const { status } = useSession();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [category, setCategory] = useState("");
  const [saved, setSaved] = useState(false);
  const [answerHistory, setAnswerHistory] = useState<{ questionText: string; selected: string; correctAnswer: string }[]>([]);

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ limit: "10" });
    if (category) params.set("category", category);
    const res = await fetch(`/api/quiz?${params}`);
    const data = await res.json();
    setQuestions(Array.isArray(data) ? data : []);
    setLoading(false);
    setStarted(Array.isArray(data) && data.length > 0);
    setIndex(0);
    setSelected(null);
    setScore(0);
    setDone(false);
    setSaved(false);
    setAnswerHistory([]);
  }, [category]);

  const current = questions[index];

  function handleSubmit() {
    if (!current || selected == null) return;
    const correct = selected === current.correctAnswer;
    setAnswerHistory((prev) => [
      ...prev,
      { questionText: current.questionText, selected, correctAnswer: current.correctAnswer },
    ]);
    if (correct) setScore((s) => s + 1);
    if (index + 1 >= questions.length) {
      setDone(true);
      if (status === "authenticated" && !saved) {
        const finalScore = score + (correct ? 1 : 0);
        fetch("/api/quiz", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            score: finalScore,
            total: questions.length,
            category: category || null,
          }),
        }).then(() => setSaved(true));
      }
    } else {
      setIndex((i) => i + 1);
      setSelected(null);
    }
  }

  if (done && questions.length > 0) {
    const displayScore = score;
    const wrongAnswers = answerHistory.filter((a) => a.selected !== a.correctAnswer);
    return (
      <>
        <Nav />
        <main id="main" className="max-w-2xl mx-auto px-4 py-8" role="main">
          <h1 className="text-2xl font-bold mb-4">Quiz complete</h1>
          <p className="text-lg">
            You got {displayScore} out of {questions.length} correct.
          </p>
          {status === "authenticated" && saved && (
            <p className="text-zinc-500 text-sm mt-2">Result saved to your profile.</p>
          )}
          {wrongAnswers.length > 0 && (
            <div className="mt-6 rounded-lg border border-zinc-200 dark:border-zinc-700 p-4 bg-zinc-50 dark:bg-zinc-800/50">
              <h2 className="font-semibold mb-3">Questions you got wrong</h2>
              <ul className="space-y-4">
                {wrongAnswers.map((a, i) => (
                  <li key={i} className="text-sm">
                    <p className="font-medium text-zinc-900 dark:text-zinc-100 mb-1">{a.questionText}</p>
                    <p className="text-red-600 dark:text-red-400">
                      Your answer: {a.selected}
                    </p>
                    <p className="text-green-600 dark:text-green-400">
                      Correct answer: {a.correctAnswer}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="mt-6 flex gap-4">
            <button
              type="button"
              onClick={() => fetchQuestions()}
              className="rounded-md bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-4 py-2 font-medium"
            >
              Try again
            </button>
            <Link
              href="/glossary"
              className="rounded-md border border-zinc-300 dark:border-zinc-600 px-4 py-2 font-medium"
            >
              Review glossary
            </Link>
          </div>
        </main>
      </>
    );
  }

  if (!started) {
    return (
      <>
        <Nav />
        <main id="main" className="max-w-2xl mx-auto px-4 py-8" role="main">
          <h1 className="text-2xl font-bold mb-4">Curling Quiz</h1>
          <p className="text-zinc-600 dark:text-zinc-400 mb-6">
            Test your knowledge with randomized questions from the glossary and rules of play.
          </p>
          <div className="mb-6">
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Category (optional)
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-md border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-3 py-2"
            >
              <option value="">Mixed</option>
              <option value="glossary">Glossary</option>
              <option value="rules">Rules</option>
              <option value="strategy">Strategy</option>
            </select>
          </div>
          <button
            type="button"
            onClick={fetchQuestions}
            disabled={loading}
            className="rounded-md bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-4 py-2 font-medium disabled:opacity-50"
          >
            {loading ? "Loading..." : "Start quiz"}
          </button>
          {loading && <p className="text-zinc-500 mt-2">Loading questions...</p>}
        </main>
      </>
    );
  }

  if (!current) {
    return (
      <>
        <Nav />
        <main id="main" className="max-w-2xl mx-auto px-4 py-8" role="main">
          <p className="text-zinc-500">No questions available. Try a different category.</p>
          <button
            type="button"
            onClick={() => setStarted(false)}
            className="mt-4 text-zinc-900 dark:text-white underline"
          >
            Back
          </button>
        </main>
      </>
    );
  }

  const options = current.options;

  return (
    <>
      <Nav />
      <main id="main" className="max-w-2xl mx-auto px-4 py-8" role="main">
        <p className="text-sm text-zinc-500 mb-2">
          Question {index + 1} of {questions.length}
        </p>
        <h2 className="text-xl font-semibold mb-6">{current.questionText}</h2>
        <div className="space-y-2">
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => setSelected(opt)}
              className={`w-full text-left rounded-lg border px-4 py-3 transition ${
                selected === opt
                  ? "border-zinc-900 dark:border-zinc-100 bg-zinc-100 dark:bg-zinc-800"
                  : "border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={selected == null}
          className="mt-6 rounded-md bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-4 py-2 font-medium disabled:opacity-50"
        >
          Submit
        </button>
      </main>
    </>
  );
}
