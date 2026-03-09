import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();
  const category = searchParams.get("category");
  const random = searchParams.get("random") === "true";

  if (random) {
    const terms = await prisma.glossaryTerm.findMany();
    const term = terms[Math.floor(Math.random() * terms.length)] ?? null;
    return NextResponse.json(term);
  }

  const where: { term?: { contains: string }; category?: string } = {};
  if (q) where.term = { contains: q };
  if (category) where.category = category;

  const terms = await prisma.glossaryTerm.findMany({
    where,
    orderBy: { term: "asc" },
  });
  return NextResponse.json(terms);
}
