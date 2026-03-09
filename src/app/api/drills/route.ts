import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const createSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  focusArea: z.string(),
  difficulty: z.string(),
  steps: z.string(),
  videoLink: z.string().url().optional().nullable(),
});

export async function GET() {
  const drills = await prisma.drill.findMany({
    orderBy: { name: "asc" },
  });
  return NextResponse.json(drills);
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await request.json();
    const data = createSchema.parse(body);
    const drill = await prisma.drill.create({
      data: {
        name: data.name,
        description: data.description,
        focusArea: data.focusArea,
        difficulty: data.difficulty,
        steps: data.steps,
        videoLink: data.videoLink ?? null,
      },
    });
    return NextResponse.json(drill);
  } catch (e) {
    if (e instanceof z.ZodError)
      return NextResponse.json({ error: e.flatten().fieldErrors }, { status: 400 });
    return NextResponse.json({ error: "Failed to create drill" }, { status: 500 });
  }
}
