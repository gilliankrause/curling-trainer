import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const favourites = await prisma.favouriteDrill.findMany({
      where: { userId: session.user.id },
      include: { drill: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({
      drillIds: favourites.map((f) => f.drillId),
      drills: favourites.map((f) => f.drill),
    });
  } catch (e) {
    console.error("GET /api/favourites/drills", e);
    return NextResponse.json({ error: "Failed to load favourites", drills: [] }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = await request.json().catch(() => ({}));
    const drillId = body?.drillId as string | undefined;
    if (!drillId)
      return NextResponse.json({ error: "drillId required" }, { status: 400 });
    const drill = await prisma.drill.findUnique({ where: { id: drillId } });
    if (!drill)
      return NextResponse.json({ error: "Drill not found" }, { status: 404 });
    await prisma.favouriteDrill.upsert({
      where: {
        userId_drillId: { userId: session.user.id, drillId },
      },
      create: { userId: session.user.id, drillId },
      update: {},
    });
    return NextResponse.json({ ok: true, drillId });
  } catch (e) {
    console.error("POST /api/favourites/drills", e);
    return NextResponse.json({ error: "Failed to save favourite" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { searchParams } = new URL(request.url);
    const drillId = searchParams.get("drillId");
    if (!drillId)
      return NextResponse.json({ error: "drillId required" }, { status: 400 });
    await prisma.favouriteDrill.deleteMany({
      where: { userId: session.user.id, drillId },
    });
    return NextResponse.json({ ok: true, drillId });
  } catch (e) {
    console.error("DELETE /api/favourites/drills", e);
    return NextResponse.json({ error: "Failed to remove favourite" }, { status: 500 });
  }
}
