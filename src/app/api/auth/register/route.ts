import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/db";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(1, "Name is required"),
  yearStartedCurling: z.number().int().min(1900).max(2100).optional().nullable(),
  club: z.string().optional().nullable(),
  teams: z.array(z.string()).optional().default([]),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = schema.parse(body);
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing)
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    const passwordHash = await hash(data.password, 12);
    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        profile: {
          create: {
            name: data.name,
            yearStartedCurling: data.yearStartedCurling ?? null,
            club: data.club ?? null,
            teams: JSON.stringify(data.teams),
          },
        },
      },
      include: { profile: true },
    });
    return NextResponse.json({
      id: user.id,
      email: user.email,
      profile: user.profile,
    });
  } catch (e) {
    if (e instanceof z.ZodError)
      return NextResponse.json({ error: e.flatten().fieldErrors }, { status: 400 });
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
