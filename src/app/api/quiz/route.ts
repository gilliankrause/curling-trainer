import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limit = Math.min(20, Math.max(5, parseInt(searchParams.get("limit") ?? "10", 10) || 10));
  const category = searchParams.get("category"); // glossary | rules | null = mixed
  const difficulty = searchParams.get("difficulty");

  const where: { sourceType?: string; difficulty?: string } = {};
  if (category) where.sourceType = category;
  if (difficulty) where.difficulty = difficulty;

  const all = await prisma.quizQuestion.findMany({ where });
  const shuffled = [...all].sort(() => Math.random() - 0.5);
  const questions = shuffled.slice(0, limit).map((q) => ({
    id: q.id,
    questionText: q.questionText,
    type: q.type,
    options: JSON.parse(q.options) as string[],
    correctAnswer: q.correctAnswer,
    difficulty: q.difficulty,
  }));
  return NextResponse.json(questions);
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await request.json();
    const { score, total, category } = body as { score: number; total: number; category?: string };
    if (typeof score !== "number" || typeof total !== "number" || total < 1)
      return NextResponse.json({ error: "Invalid score or total" }, { status: 400 });
    const attempt = await prisma.quizAttempt.create({
      data: {
        userId: session.user.id,
        score: Math.min(score, total),
        total,
        category: category ?? null,
      },
    });
    return NextResponse.json(attempt);
  } catch {
    return NextResponse.json({ error: "Failed to save attempt" }, { status: 500 });
  }
}
