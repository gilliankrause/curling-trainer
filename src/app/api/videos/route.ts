import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const list = await prisma.videoAnalysis.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(
    list.map((v) => ({
      id: v.id,
      videoPath: v.videoPath,
      status: v.status,
      overallScore: v.overallScore,
      createdAt: v.createdAt,
      completedAt: v.completedAt,
    }))
  );
}
