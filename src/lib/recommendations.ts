import { prisma } from "./db";

const FOCUS_TO_GLOSSARY: Record<string, string[]> = {
  balance: ["Slide", "Release", "House"],
  slideLeg: ["Slide", "Hack", "Draw"],
  release: ["Release", "Draw", "Stone"],
  consistency: ["Slide", "Release", "Sweeping"],
};

export type Recommendation = {
  type: "focus" | "drill" | "glossary";
  title: string;
  description?: string;
  id?: string;
  url?: string;
};

export async function getRecommendationsForUser(userId: string): Promise<Recommendation[]> {
  const recs: Recommendation[] = [];
  const analyses = await prisma.videoAnalysis.findMany({
    where: { userId, status: "completed" },
    orderBy: { completedAt: "desc" },
    take: 5,
  });
  const lowAreas = new Set<string>();
  for (const a of analyses) {
    if (!a.subScores) continue;
    const sub = JSON.parse(a.subScores) as Record<string, number>;
    for (const [k, v] of Object.entries(sub)) {
      if (typeof v === "number" && v < 75) lowAreas.add(k);
    }
  }
  for (const area of Array.from(lowAreas)) {
    recs.push({
      type: "focus",
      title: area === "balance" ? "Balance and core stability" : area === "slideLeg" ? "Slide leg extension" : area === "release" ? "Release consistency" : "Overall consistency",
      description: `Focus on improving your ${area} during practice.`,
    });
    const terms = FOCUS_TO_GLOSSARY[area];
    if (terms?.length) {
      const found = await prisma.glossaryTerm.findMany({
        where: { term: { in: terms } },
        take: 2,
      });
      for (const t of found) {
        recs.push({ type: "glossary", title: t.term, description: t.definition.slice(0, 80) + "...", id: t.id, url: `/glossary/${t.id}` });
      }
    }
    const drills = await prisma.drill.findMany({
      where: { focusArea: area },
      take: 2,
    });
    for (const d of drills) {
      recs.push({ type: "drill", title: d.name, description: d.description.slice(0, 80) + "...", id: d.id, url: `/drills#${d.id}` });
    }
  }
  return recs.slice(0, 8);
}

export async function getRecommendationsForAnalysis(analysisId: string, userId: string): Promise<Recommendation[]> {
  const analysis = await prisma.videoAnalysis.findFirst({
    where: { id: analysisId, userId },
  });
  if (!analysis || analysis.status !== "completed" || !analysis.subScores) return [];
  const sub = JSON.parse(analysis.subScores) as Record<string, number>;
  const lowAreas = Object.entries(sub)
    .filter(([, v]) => typeof v === "number" && v < 75)
    .map(([k]) => k);
  const recs: Recommendation[] = [];
  for (const area of Array.from(lowAreas)) {
    recs.push({
      type: "focus",
      title: area === "balance" ? "Balance and core stability" : area === "slideLeg" ? "Slide leg extension" : area === "release" ? "Release consistency" : "Overall consistency",
      description: `Your ${area} score was below target. Practice this area.`,
    });
    const terms = FOCUS_TO_GLOSSARY[area];
    if (terms?.length) {
      const found = await prisma.glossaryTerm.findMany({ where: { term: { in: terms } }, take: 1 });
      for (const t of found) {
        recs.push({ type: "glossary", title: t.term, id: t.id, url: `/glossary/${t.id}` });
      }
    }
    const drills = await prisma.drill.findMany({ where: { focusArea: area }, take: 1 });
    for (const d of drills) {
      recs.push({ type: "drill", title: d.name, id: d.id, url: `/drills` });
    }
  }
  return recs;
}
