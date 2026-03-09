import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { randomUUID } from "crypto";

const UPLOAD_DIR = path.join(process.cwd(), "uploads");

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await request.formData();
  const file = formData.get("video") as File | null;
  if (!file || !file.size) {
    return NextResponse.json({ error: "No video file provided" }, { status: 400 });
  }
  const allowed = ["video/mp4", "video/quicktime", "video/x-msvideo", "video/webm"];
  if (!allowed.includes(file.type)) {
    return NextResponse.json({ error: "Invalid file type. Use MP4, MOV, AVI, or WebM." }, { status: 400 });
  }
  const maxSize = 100 * 1024 * 1024; // 100 MB
  if (file.size > maxSize) {
    return NextResponse.json({ error: "File too large (max 100 MB)" }, { status: 400 });
  }

  await mkdir(UPLOAD_DIR, { recursive: true });
  const ext = path.extname(file.name) || ".mp4";
  const filename = `${randomUUID()}${ext}`;
  const filepath = path.join(UPLOAD_DIR, filename);
  const bytes = await file.arrayBuffer();
  await writeFile(filepath, Buffer.from(bytes));

  const analysis = await prisma.videoAnalysis.create({
    data: {
      userId: session.user.id,
      videoPath: filename,
      status: "pending",
    },
  });

  return NextResponse.json({
    id: analysis.id,
    videoPath: analysis.videoPath,
    status: analysis.status,
  });
}
