import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const drill = await prisma.drill.findUnique({ where: { id } });
  if (!drill) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(drill);
}
