import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const analysis = await prisma.videoAnalysis.findFirst({
    where: { id, userId: session.user.id },
  });
  if (!analysis)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({
    id: analysis.id,
    videoPath: analysis.videoPath,
    status: analysis.status,
    overallScore: analysis.overallScore,
    subScores: analysis.subScores ? JSON.parse(analysis.subScores) : null,
    feedback: analysis.feedback ? JSON.parse(analysis.feedback) : null,
    frameRefs: analysis.frameRefs ? JSON.parse(analysis.frameRefs) : null,
    createdAt: analysis.createdAt,
    completedAt: analysis.completedAt,
  });
}
