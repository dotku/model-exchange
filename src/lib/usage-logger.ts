import { prisma } from "./prisma";

export interface UsageLogInput {
  userId?: string;
  apiKeyId?: string;
  modelName: string;
  providerName: string;
  inputTokens: number;
  outputTokens: number;
  latencyMs: number;
  ttftMs?: number;
  statusCode: number;
  isSuccess: boolean;
  errorMessage?: string;
  source?: "gateway" | "benchmark";
}

/**
 * Log a gateway API call. Fire-and-forget — does not throw.
 */
export async function logUsage(input: UsageLogInput) {
  try {
    await prisma.usageLog.create({
      data: {
        userId: input.userId ?? null,
        apiKeyId: input.apiKeyId ?? null,
        modelName: input.modelName,
        providerName: input.providerName,
        inputTokens: input.inputTokens,
        outputTokens: input.outputTokens,
        totalTokens: input.inputTokens + input.outputTokens,
        latencyMs: input.latencyMs,
        ttftMs: input.ttftMs ?? null,
        statusCode: input.statusCode,
        isSuccess: input.isSuccess,
        errorMessage: input.errorMessage ?? null,
        source: input.source ?? "gateway",
      },
    });
  } catch (err) {
    console.error("[UsageLog] Failed to log:", err);
  }
}

export interface UsageStats {
  totalCalls: number;
  successRate: number;
  totalTokens: number;
  avgLatencyMs: number;
  avgTtftMs: number;
  byModel: { modelName: string; calls: number; tokens: number; avgLatency: number }[];
  byProvider: { providerName: string; calls: number; tokens: number; avgLatency: number }[];
  recentLogs: {
    id: string;
    modelName: string;
    providerName: string;
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
    latencyMs: number;
    ttftMs: number | null;
    statusCode: number;
    isSuccess: boolean;
    errorMessage: string | null;
    source: string;
    createdAt: string;
  }[];
}

/**
 * Get usage stats for a user within a date range.
 */
export async function getUserUsageStats(
  userId: string,
  daysBack: number = 30
): Promise<UsageStats> {
  const since = new Date();
  since.setDate(since.getDate() - daysBack);

  const logs = await prisma.usageLog.findMany({
    where: { userId, createdAt: { gte: since } },
    orderBy: { createdAt: "desc" },
  });

  const totalCalls = logs.length;
  const successCount = logs.filter((l) => l.isSuccess).length;
  const successRate = totalCalls > 0 ? Math.round((successCount / totalCalls) * 100) : 0;
  const totalTokens = logs.reduce((sum, l) => sum + l.totalTokens, 0);
  const avgLatencyMs =
    totalCalls > 0 ? Math.round(logs.reduce((sum, l) => sum + l.latencyMs, 0) / totalCalls) : 0;
  const ttftLogs = logs.filter((l) => l.ttftMs != null);
  const avgTtftMs =
    ttftLogs.length > 0
      ? Math.round(ttftLogs.reduce((sum, l) => sum + l.ttftMs!, 0) / ttftLogs.length)
      : 0;

  // Group by model
  const modelMap = new Map<string, { calls: number; tokens: number; totalLatency: number }>();
  for (const l of logs) {
    const existing = modelMap.get(l.modelName) ?? { calls: 0, tokens: 0, totalLatency: 0 };
    existing.calls++;
    existing.tokens += l.totalTokens;
    existing.totalLatency += l.latencyMs;
    modelMap.set(l.modelName, existing);
  }
  const byModel = [...modelMap.entries()]
    .map(([modelName, v]) => ({
      modelName,
      calls: v.calls,
      tokens: v.tokens,
      avgLatency: Math.round(v.totalLatency / v.calls),
    }))
    .sort((a, b) => b.calls - a.calls);

  // Group by provider
  const providerMap = new Map<string, { calls: number; tokens: number; totalLatency: number }>();
  for (const l of logs) {
    const existing = providerMap.get(l.providerName) ?? { calls: 0, tokens: 0, totalLatency: 0 };
    existing.calls++;
    existing.tokens += l.totalTokens;
    existing.totalLatency += l.latencyMs;
    providerMap.set(l.providerName, existing);
  }
  const byProvider = [...providerMap.entries()]
    .map(([providerName, v]) => ({
      providerName,
      calls: v.calls,
      tokens: v.tokens,
      avgLatency: Math.round(v.totalLatency / v.calls),
    }))
    .sort((a, b) => b.calls - a.calls);

  // Recent logs (last 50)
  const recentLogs = logs.slice(0, 50).map((l) => ({
    id: l.id,
    modelName: l.modelName,
    providerName: l.providerName,
    inputTokens: l.inputTokens,
    outputTokens: l.outputTokens,
    totalTokens: l.totalTokens,
    latencyMs: l.latencyMs,
    ttftMs: l.ttftMs,
    statusCode: l.statusCode,
    isSuccess: l.isSuccess,
    errorMessage: l.errorMessage,
    source: l.source,
    createdAt: l.createdAt.toISOString(),
  }));

  return {
    totalCalls,
    successRate,
    totalTokens,
    avgLatencyMs,
    avgTtftMs,
    byModel,
    byProvider,
    recentLogs,
  };
}
