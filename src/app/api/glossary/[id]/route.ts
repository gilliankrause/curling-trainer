import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const term = await prisma.glossaryTerm.findUnique({
    where: { id },
  });
  if (!term) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(term);
}
