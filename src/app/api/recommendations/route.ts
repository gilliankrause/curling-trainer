import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { getRecommendationsForUser } from "@/lib/recommendations";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const recs = await getRecommendationsForUser(session.user.id);
  return NextResponse.json(recs);
}
