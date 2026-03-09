import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const attempts = await prisma.quizAttempt.findMany({
    where: { userId: session.user.id },
    select: { score: true, total: true },
  });

  const count = attempts.length;
  const averageScore =
    count > 0
      ? attempts.reduce((sum, a) => sum + (a.total > 0 ? (a.score / a.total) * 100 : 0), 0) / count
      : null;

  return NextResponse.json({
    quizCount: count,
    averageScore: averageScore != null ? Math.round(averageScore * 10) / 10 : null,
  });
}
