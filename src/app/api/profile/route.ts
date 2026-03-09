import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  yearStartedCurling: z.number().int().min(1900).max(2100).optional().nullable(),
  club: z.string().optional().nullable(),
  teams: z.array(z.string()).optional(),
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
  });
  if (!profile)
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  return NextResponse.json({
    ...profile,
    teams: JSON.parse(profile.teams || "[]") as string[],
  });
}

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await request.json();
    const data = updateSchema.parse(body);
    const profile = await prisma.profile.update({
      where: { userId: session.user.id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.yearStartedCurling !== undefined && { yearStartedCurling: data.yearStartedCurling }),
        ...(data.club !== undefined && { club: data.club }),
        ...(data.teams !== undefined && { teams: JSON.stringify(data.teams) }),
      },
    });
    return NextResponse.json({
      ...profile,
      teams: JSON.parse(profile.teams || "[]") as string[],
    });
  } catch (e) {
    if (e instanceof z.ZodError)
      return NextResponse.json({ error: e.flatten().fieldErrors }, { status: 400 });
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
