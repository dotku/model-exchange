import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { scrapeScaleSeal } from "@/lib/scrapers/scale-seal";
import { scrapeChatbotArena } from "@/lib/scrapers/chatbot-arena";

// Vercel Cron or manual trigger — secured by CRON_SECRET
export async function GET(req: NextRequest) {
  // Verify cron secret (skip in dev)
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (
    cronSecret &&
    process.env.NODE_ENV === "production" &&
    authHeader !== `Bearer ${cronSecret}`
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  let totalInserted = 0;

  try {
    // ── 1. Scale SEAL Leaderboard ──
    console.log("[Cron] Scraping Scale SEAL leaderboard...");
    const scaleResults = await scrapeScaleSeal();
    console.log(`[Cron] Scale SEAL: ${scaleResults.length} entries found`);

    for (const entry of scaleResults) {
      try {
        await prisma.leaderboardEntry.upsert({
          where: {
            modelName_source_category_scrapedAt: {
              modelName: entry.modelName,
              source: "scale_seal",
              category: entry.category,
              scrapedAt: today,
            },
          },
          update: {
            rank: entry.rank,
            score: entry.score,
            provider: entry.provider,
          },
          create: {
            modelName: entry.modelName,
            provider: entry.provider,
            source: "scale_seal",
            category: entry.category,
            rank: entry.rank,
            score: entry.score,
            scrapedAt: today,
          },
        });
        totalInserted++;
      } catch {
        // Skip duplicates or constraint errors
      }
    }

    // ── 2. Chatbot Arena ──
    console.log("[Cron] Scraping Chatbot Arena...");
    const arenaResults = await scrapeChatbotArena();
    console.log(`[Cron] Chatbot Arena: ${arenaResults.length} entries found`);

    for (const entry of arenaResults) {
      try {
        await prisma.leaderboardEntry.upsert({
          where: {
            modelName_source_category_scrapedAt: {
              modelName: entry.modelName,
              source: "chatbot_arena",
              category: entry.category,
              scrapedAt: today,
            },
          },
          update: {
            rank: entry.rank,
            score: entry.score,
            eloRating: entry.eloRating,
            provider: entry.provider,
          },
          create: {
            modelName: entry.modelName,
            provider: entry.provider,
            source: "chatbot_arena",
            category: entry.category,
            rank: entry.rank,
            score: entry.score,
            eloRating: entry.eloRating,
            scrapedAt: today,
          },
        });
        totalInserted++;
      } catch {
        // Skip duplicates
      }
    }

    console.log(`[Cron] Done. ${totalInserted} entries upserted.`);

    return NextResponse.json({
      success: true,
      date: today.toISOString(),
      scaleResults: scaleResults.length,
      arenaResults: arenaResults.length,
      totalInserted,
    });
  } catch (error) {
    console.error("[Cron] Scrape failed:", error);
    return NextResponse.json(
      { error: "Scrape failed", details: String(error) },
      { status: 500 }
    );
  }
}
