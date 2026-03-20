import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Link from "next/link";
import { auth0 } from "@/lib/auth0";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LeaderboardTabs from "@/components/LeaderboardTabs";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "leaderboard" });
  return { title: t("metaTitle") };
}

export default async function LeaderboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await auth0.getSession();
  const t = await getTranslations({ locale, namespace: "leaderboard" });

  // Get latest scraped date
  const latestEntry = await prisma.leaderboardEntry.findFirst({
    orderBy: { scrapedAt: "desc" },
    select: { scrapedAt: true },
  });
  const latestDate = latestEntry?.scrapedAt ?? new Date();

  // Fetch latest leaderboard entries grouped by source
  const entries = await prisma.leaderboardEntry.findMany({
    where: { scrapedAt: latestDate },
    orderBy: [{ category: "asc" }, { rank: "asc" }],
  });

  // Fetch latest 7 days of speed benchmarks
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const benchmarks = await prisma.speedBenchmark.findMany({
    where: {
      testDate: { gte: sevenDaysAgo },
      OR: [{ source: "system" }, { isPublished: true }],
    },
    orderBy: [{ testDate: "desc" }, { modelName: "asc" }],
  });

  // Serialize dates
  const serializedEntries = entries.map((e) => ({
    ...e,
    scrapedAt: e.scrapedAt.toISOString(),
    createdAt: e.createdAt.toISOString(),
  }));

  const serializedBenchmarks = benchmarks.map((b) => ({
    ...b,
    testDate: b.testDate.toISOString(),
    createdAt: b.createdAt.toISOString(),
  }));

  return (
    <>
      <Navbar user={session?.user ?? null} />
      <main className="flex-1 bg-zinc-50 dark:bg-zinc-950">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white mb-3">
              {t("title")}
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
              {t("subtitle")}
            </p>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-2">
              {t("lastUpdated")}: {latestDate.toLocaleDateString()}
              {" · "}
              {t("sources")}
            </p>
          </div>

          <LeaderboardTabs
            entries={serializedEntries}
            benchmarks={serializedBenchmarks}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
