"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

interface LeaderboardEntry {
  id: string;
  modelName: string;
  provider: string;
  source: string;
  category: string;
  rank: number;
  score: number;
  eloRating: number | null;
  scrapedAt: string;
}

interface SpeedBenchmark {
  id: string;
  modelName: string;
  providerName: string;
  latencyMs: number;
  tokensPerSecond: number;
  ttftMs: number;
  testDate: string;
  testedByName: string | null;
  source: string;
  isPublished: boolean;
}

const CATEGORIES = ["overall", "coding", "reasoning", "math", "agentic", "safety"] as const;

export default function LeaderboardTabs({
  entries,
  benchmarks,
}: {
  entries: LeaderboardEntry[];
  benchmarks: SpeedBenchmark[];
}) {
  const t = useTranslations("leaderboard");
  const [activeTab, setActiveTab] = useState<"rankings" | "speed">("rankings");
  const [activeCategory, setActiveCategory] = useState<string>("overall");
  const [activeSource, setActiveSource] = useState<string>("all");

  // Get unique sources
  const sources = [...new Set(entries.map((e) => e.source))];

  // Filter entries
  const filteredEntries = entries.filter((e) => {
    if (activeCategory !== "all" && e.category !== activeCategory) return false;
    if (activeSource !== "all" && e.source !== activeSource) return false;
    return true;
  });

  // Deduplicate by model name (keep best rank per model)
  const deduped = new Map<string, LeaderboardEntry>();
  for (const entry of filteredEntries) {
    const key = `${entry.modelName}-${entry.category}`;
    const existing = deduped.get(key);
    if (!existing || entry.rank < existing.rank) {
      deduped.set(key, entry);
    }
  }
  const sortedEntries = [...deduped.values()].sort((a, b) => a.rank - b.rank);

  // Group benchmarks by date
  const latestBenchmarks = new Map<string, SpeedBenchmark>();
  for (const b of benchmarks) {
    const key = `${b.modelName}-${b.providerName}`;
    if (!latestBenchmarks.has(key)) {
      latestBenchmarks.set(key, b);
    }
  }
  const benchmarkList = [...latestBenchmarks.values()].sort(
    (a, b) => b.tokensPerSecond - a.tokensPerSecond
  );

  return (
    <div>
      {/* Tab Switcher */}
      <div className="flex items-center gap-1 rounded-lg border border-zinc-200 dark:border-zinc-700 p-1 bg-white dark:bg-zinc-900 mb-6 w-fit">
        <button
          onClick={() => setActiveTab("rankings")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "rankings"
              ? "bg-indigo-600 text-white"
              : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
          }`}
        >
          {t("tabRankings")}
        </button>
        <button
          onClick={() => setActiveTab("speed")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "speed"
              ? "bg-indigo-600 text-white"
              : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
          }`}
        >
          {t("tabSpeed")}
        </button>
      </div>

      {activeTab === "rankings" ? (
        <div>
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            {/* Category filter */}
            <div className="flex items-center gap-1 rounded-lg border border-zinc-200 dark:border-zinc-700 p-0.5 bg-white dark:bg-zinc-900">
              {["all", ...CATEGORIES].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    activeCategory === cat
                      ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900"
                      : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                  }`}
                >
                  {t(`cat_${cat}`)}
                </button>
              ))}
            </div>

            {/* Source filter */}
            <div className="flex items-center gap-1 rounded-lg border border-zinc-200 dark:border-zinc-700 p-0.5 bg-white dark:bg-zinc-900">
              <button
                onClick={() => setActiveSource("all")}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  activeSource === "all"
                    ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900"
                    : "text-zinc-500 dark:text-zinc-400"
                }`}
              >
                {t("allSources")}
              </button>
              {sources.map((src) => (
                <button
                  key={src}
                  onClick={() => setActiveSource(src)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    activeSource === src
                      ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900"
                      : "text-zinc-500 dark:text-zinc-400"
                  }`}
                >
                  {t(`source_${src}`)}
                </button>
              ))}
            </div>
          </div>

          {/* Rankings Table */}
          {sortedEntries.length === 0 ? (
            <div className="rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-12 text-center">
              <p className="text-zinc-500 dark:text-zinc-400">{t("noData")}</p>
              <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">{t("noDataHint")}</p>
            </div>
          ) : (
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50">
                      <th className="text-left py-3 px-4 font-medium text-zinc-500 dark:text-zinc-400 w-16">{t("colRank")}</th>
                      <th className="text-left py-3 px-4 font-medium text-zinc-500 dark:text-zinc-400">{t("colModel")}</th>
                      <th className="text-left py-3 px-4 font-medium text-zinc-500 dark:text-zinc-400">{t("colProvider")}</th>
                      <th className="text-right py-3 px-4 font-medium text-zinc-500 dark:text-zinc-400">{t("colScore")}</th>
                      {activeCategory === "all" && (
                        <th className="text-left py-3 px-4 font-medium text-zinc-500 dark:text-zinc-400">{t("colCategory")}</th>
                      )}
                      <th className="text-left py-3 px-4 font-medium text-zinc-500 dark:text-zinc-400">{t("colSource")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {sortedEntries.slice(0, 50).map((entry, idx) => (
                      <tr key={entry.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center justify-center h-7 w-7 rounded-full text-xs font-bold ${
                            entry.rank === 1
                              ? "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300"
                              : entry.rank === 2
                              ? "bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300"
                              : entry.rank === 3
                              ? "bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300"
                              : "text-zinc-500 dark:text-zinc-400"
                          }`}>
                            {entry.rank}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-medium text-zinc-900 dark:text-white">
                          {entry.modelName}
                        </td>
                        <td className="py-3 px-4 text-zinc-500 dark:text-zinc-400">
                          {entry.provider}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span className="font-mono font-semibold text-zinc-900 dark:text-white">
                            {entry.eloRating ?? entry.score.toFixed(2)}
                          </span>
                        </td>
                        {activeCategory === "all" && (
                          <td className="py-3 px-4">
                            <span className="rounded-full bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 text-xs text-zinc-600 dark:text-zinc-400">
                              {t(`cat_${entry.category}`)}
                            </span>
                          </td>
                        )}
                        <td className="py-3 px-4">
                          <span className="text-xs text-zinc-400 dark:text-zinc-500">
                            {t(`source_${entry.source}`)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* ── Speed Benchmarks Tab ── */
        <div>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
            {t("speedDesc")}
          </p>

          {benchmarkList.length === 0 ? (
            <div className="rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-12 text-center">
              <p className="text-zinc-500 dark:text-zinc-400">{t("noSpeedData")}</p>
              <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">{t("noSpeedDataHint")}</p>
            </div>
          ) : (
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50">
                      <th className="text-left py-3 px-4 font-medium text-zinc-500 dark:text-zinc-400">{t("colModel")}</th>
                      <th className="text-left py-3 px-4 font-medium text-zinc-500 dark:text-zinc-400">{t("colProvider")}</th>
                      <th className="text-right py-3 px-4 font-medium text-zinc-500 dark:text-zinc-400">{t("colTps")}</th>
                      <th className="text-right py-3 px-4 font-medium text-zinc-500 dark:text-zinc-400">{t("colLatency")}</th>
                      <th className="text-right py-3 px-4 font-medium text-zinc-500 dark:text-zinc-400">{t("colTtft")}</th>
                      <th className="text-left py-3 px-4 font-medium text-zinc-500 dark:text-zinc-400">{t("colTestedBy")}</th>
                      <th className="text-left py-3 px-4 font-medium text-zinc-500 dark:text-zinc-400">{t("colDate")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {benchmarkList.map((b) => (
                      <tr key={b.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                        <td className="py-3 px-4 font-medium text-zinc-900 dark:text-white">{b.modelName}</td>
                        <td className="py-3 px-4 text-zinc-500 dark:text-zinc-400">{b.providerName}</td>
                        <td className="py-3 px-4 text-right">
                          <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                            {b.tokensPerSecond.toFixed(1)}
                          </span>
                          <span className="text-xs text-zinc-400 ml-1">tok/s</span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span className="font-mono text-zinc-900 dark:text-white">{b.latencyMs}</span>
                          <span className="text-xs text-zinc-400 ml-1">ms</span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span className="font-mono text-zinc-900 dark:text-white">{b.ttftMs}</span>
                          <span className="text-xs text-zinc-400 ml-1">ms</span>
                        </td>
                        <td className="py-3 px-4">
                          {b.source === "community" ? (
                            <span className="inline-flex items-center gap-1 text-xs">
                              <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                              <span className="text-zinc-600 dark:text-zinc-400">{b.testedByName ?? t("communityUser")}</span>
                            </span>
                          ) : (
                            <span className="text-xs text-zinc-400 dark:text-zinc-500">{t("systemTest")}</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-xs text-zinc-400 dark:text-zinc-500">
                          {new Date(b.testDate).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
