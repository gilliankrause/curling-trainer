import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

const UPLOAD_DIR = path.join(process.cwd(), "uploads");

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

  const filepath = path.join(UPLOAD_DIR, analysis.videoPath);
  try {
    const buffer = await readFile(filepath);
    const ext = path.extname(analysis.videoPath).toLowerCase();
    const mime = { ".mp4": "video/mp4", ".mov": "video/quicktime", ".avi": "video/x-msvideo", ".webm": "video/webm" }[ext] ?? "video/mp4";
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": mime,
        "Content-Disposition": `inline; filename="${analysis.videoPath}"`,
      },
    });
  } catch {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}
