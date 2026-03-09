import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const createSchema = z.object({
  date: z.string(),
  durationMinutes: z.number().int().min(1).max(480),
  focusAreas: z.array(z.string()).default([]),
  notes: z.string().optional().nullable(),
  videoAnalysisId: z.string().optional().nullable(),
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const sessions = await prisma.practiceSession.findMany({
    where: { userId: session.user.id },
    orderBy: { date: "desc" },
    take: 50,
  });
  return NextResponse.json(
    sessions.map((s) => ({
      id: s.id,
      date: s.date,
      durationMinutes: s.durationMinutes,
      focusAreas: JSON.parse(s.focusAreas || "[]") as string[],
      notes: s.notes,
      videoAnalysisId: s.videoAnalysisId,
      createdAt: s.createdAt,
    }))
  );
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await request.json();
    const data = createSchema.parse({
      ...body,
      date: body.date ?? new Date().toISOString(),
    });
    const date = new Date(data.date);
    const sessionRecord = await prisma.practiceSession.create({
      data: {
        userId: session.user.id,
        date,
        durationMinutes: data.durationMinutes,
        focusAreas: JSON.stringify(data.focusAreas),
        notes: data.notes ?? null,
        videoAnalysisId: data.videoAnalysisId ?? null,
      },
    });
    return NextResponse.json({
      id: sessionRecord.id,
      date: sessionRecord.date,
      durationMinutes: sessionRecord.durationMinutes,
      focusAreas: JSON.parse(sessionRecord.focusAreas || "[]"),
      notes: sessionRecord.notes,
      videoAnalysisId: sessionRecord.videoAnalysisId,
    });
  } catch (e) {
    if (e instanceof z.ZodError)
      return NextResponse.json({ error: e.flatten().fieldErrors }, { status: 400 });
    return NextResponse.json({ error: "Failed to create session" }, { status: 500 });
  }
}
