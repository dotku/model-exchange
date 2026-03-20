"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import type { UsageStats } from "@/lib/usage-logger";

export default function UsageContent({ stats }: { stats: UsageStats }) {
  const t = useTranslations("usage");
  const locale = useLocale();

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">
          {t("title")}
        </h1>
        <Link
          href={`/${locale}/dashboard`}
          className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
        >
          {t("backToDashboard")}
        </Link>
      </div>
      <p className="text-zinc-600 dark:text-zinc-400 mb-8">{t("subtitle")}</p>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
        <StatCard label={t("totalCalls")} value={stats.totalCalls.toLocaleString()} />
        <StatCard label={t("successRate")} value={`${stats.successRate}%`} color={stats.successRate >= 95 ? "emerald" : stats.successRate >= 80 ? "amber" : "red"} />
        <StatCard label={t("totalTokens")} value={formatNum(stats.totalTokens)} />
        <StatCard label={t("avgLatency")} value={`${stats.avgLatencyMs}ms`} />
        <StatCard label={t("avgTtft")} value={`${stats.avgTtftMs}ms`} />
      </div>

      {/* By Model + By Provider side-by-side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* By Model */}
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-white mb-4">{t("byModel")}</h2>
          {stats.byModel.length === 0 ? (
            <p className="text-sm text-zinc-400">{t("noData")}</p>
          ) : (
            <div className="space-y-3">
              {stats.byModel.map((m) => (
                <div key={m.modelName} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-zinc-900 dark:text-white">{m.modelName}</p>
                    <p className="text-xs text-zinc-400">{m.calls} {t("calls")} · {formatNum(m.tokens)} tokens</p>
                  </div>
                  <span className="text-sm font-mono text-zinc-600 dark:text-zinc-400">{m.avgLatency}ms</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* By Provider */}
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-white mb-4">{t("byProvider")}</h2>
          {stats.byProvider.length === 0 ? (
            <p className="text-sm text-zinc-400">{t("noData")}</p>
          ) : (
            <div className="space-y-3">
              {stats.byProvider.map((p) => (
                <div key={p.providerName} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-zinc-900 dark:text-white">{p.providerName}</p>
                    <p className="text-xs text-zinc-400">{p.calls} {t("calls")} · {formatNum(p.tokens)} tokens</p>
                  </div>
                  <span className="text-sm font-mono text-zinc-600 dark:text-zinc-400">{p.avgLatency}ms</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Logs */}
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-200 dark:border-zinc-800">
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-white">{t("recentLogs")}</h2>
        </div>
        {stats.recentLogs.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm text-zinc-400">{t("noLogs")}</p>
            <p className="text-xs text-zinc-400 mt-1">{t("noLogsHint")}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-zinc-50 dark:bg-zinc-800/50 text-xs">
                  <th className="text-left py-2.5 px-4 font-medium text-zinc-500 dark:text-zinc-400">{t("colTime")}</th>
                  <th className="text-left py-2.5 px-4 font-medium text-zinc-500 dark:text-zinc-400">{t("colModel")}</th>
                  <th className="text-left py-2.5 px-4 font-medium text-zinc-500 dark:text-zinc-400">{t("colProvider")}</th>
                  <th className="text-right py-2.5 px-4 font-medium text-zinc-500 dark:text-zinc-400">{t("colTokens")}</th>
                  <th className="text-right py-2.5 px-4 font-medium text-zinc-500 dark:text-zinc-400">{t("colLatency")}</th>
                  <th className="text-center py-2.5 px-4 font-medium text-zinc-500 dark:text-zinc-400">{t("colStatus")}</th>
                  <th className="text-left py-2.5 px-4 font-medium text-zinc-500 dark:text-zinc-400">{t("colSource")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {stats.recentLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                    <td className="py-2.5 px-4 text-xs text-zinc-400 whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="py-2.5 px-4 font-medium text-zinc-900 dark:text-white whitespace-nowrap">
                      {log.modelName}
                    </td>
                    <td className="py-2.5 px-4 text-zinc-500 dark:text-zinc-400 whitespace-nowrap">
                      {log.providerName}
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono text-zinc-600 dark:text-zinc-400">
                      {log.inputTokens}/{log.outputTokens}
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono text-zinc-900 dark:text-white">
                      {log.latencyMs}ms
                    </td>
                    <td className="py-2.5 px-4 text-center">
                      {log.isSuccess ? (
                        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/40">
                          <svg className="h-3 w-3 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                        </span>
                      ) : (
                        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/40" title={log.errorMessage ?? ""}>
                          <svg className="h-3 w-3 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-4 text-xs text-zinc-400">
                      {log.source}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: string; color?: string }) {
  const colorClass =
    color === "emerald" ? "text-emerald-600 dark:text-emerald-400" :
    color === "amber" ? "text-amber-600 dark:text-amber-400" :
    color === "red" ? "text-red-600 dark:text-red-400" :
    "text-zinc-900 dark:text-white";
  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
      <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">{label}</p>
      <p className={`text-xl font-bold font-mono ${colorClass}`}>{value}</p>
    </div>
  );
}

function formatNum(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}
