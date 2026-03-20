import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface BenchmarkTarget {
  modelName: string;
  providerName: string;
  endpoint: string;
  modelId: string;
  apiKeyEnv?: string;
  requiresAuth: boolean;
}

// Models and endpoints to benchmark daily
// To add JY Tech Cloud back, set JYTECH_ENDPOINT env var when the API is live
const BENCHMARK_TARGETS: BenchmarkTarget[] = [
  ...(process.env.JYTECH_ENDPOINT
    ? [
        {
          modelName: "sienovo/smollm",
          providerName: "JY Tech Cloud",
          endpoint: process.env.JYTECH_ENDPOINT,
          modelId: "sienovo/smollm",
          apiKeyEnv: "JYTECH_API_KEY",
          requiresAuth: false,
        },
      ]
    : []),
  {
    modelName: "deepseek-r1",
    providerName: "DeepSeek",
    endpoint: "https://api.deepseek.com/v1/chat/completions",
    modelId: "deepseek-reasoner",
    apiKeyEnv: "DEEPSEEK_API_KEY",
    requiresAuth: true,
  },
  {
    modelName: "llama-4-maverick",
    providerName: "Groq",
    endpoint: "https://api.groq.com/openai/v1/chat/completions",
    modelId: "meta-llama/llama-4-maverick-17b-128e-instruct",
    apiKeyEnv: "GROQ_API_KEY",
    requiresAuth: true,
  },
];

const BENCHMARK_PROMPT = "Explain what a neural network is in exactly two sentences.";

async function benchmarkEndpoint(target: BenchmarkTarget) {
  const apiKey = target.apiKeyEnv ? process.env[target.apiKeyEnv] : undefined;

  // Skip only if auth is required and no key is available
  if (target.requiresAuth && !apiKey) {
    console.log(`[Benchmark] Skipping ${target.providerName} — requires auth but no key configured (${target.apiKeyEnv})`);
    return null;
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (apiKey) {
    headers["Authorization"] = `Bearer ${apiKey}`;
  }

  const startTime = performance.now();

  try {
    const res = await fetch(target.endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model: target.modelId,
        messages: [{ role: "user", content: BENCHMARK_PROMPT }],
        max_tokens: 100,
        stream: false,
      }),
      signal: AbortSignal.timeout(30_000),
    });

    const ttftMs = Math.round(performance.now() - startTime);

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error(`[Benchmark] ${target.providerName} returned ${res.status}: ${body.slice(0, 200)}`);
      return null;
    }

    const data = await res.json();
    const latencyMs = Math.round(performance.now() - startTime);
    const completionTokens = data.usage?.completion_tokens ?? 0;
    const tokensPerSecond =
      completionTokens > 0 && latencyMs > 0
        ? Math.round((completionTokens / (latencyMs / 1000)) * 100) / 100
        : 0;

    console.log(
      `[Benchmark] ${target.providerName} — ${latencyMs}ms latency, ${tokensPerSecond} tok/s, ${ttftMs}ms TTFT`
    );

    return { latencyMs, tokensPerSecond, ttftMs };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[Benchmark] ${target.providerName} error: ${msg}`);
    return null;
  }
}

export async function GET(req: NextRequest) {
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
  const results: Record<string, unknown>[] = [];
  const skipped: string[] = [];

  for (const target of BENCHMARK_TARGETS) {
    console.log(`[Benchmark] Testing ${target.providerName} / ${target.modelName}...`);
    const result = await benchmarkEndpoint(target);

    if (result) {
      try {
        // Delete existing system benchmark for today, then create fresh
        await prisma.speedBenchmark.deleteMany({
          where: {
            modelName: target.modelName,
            providerName: target.providerName,
            testDate: today,
            source: "system",
          },
        });
        await prisma.speedBenchmark.create({
          data: {
            modelName: target.modelName,
            providerName: target.providerName,
            latencyMs: result.latencyMs,
            tokensPerSecond: result.tokensPerSecond,
            ttftMs: result.ttftMs,
            testDate: today,
            source: "system",
          },
        });

        results.push({
          model: target.modelName,
          provider: target.providerName,
          ...result,
        });
      } catch {
        // Skip DB errors
      }
    } else {
      skipped.push(`${target.providerName}/${target.modelName}`);
    }
  }

  return NextResponse.json({
    success: true,
    date: today.toISOString(),
    benchmarked: results.length,
    skipped,
    results,
  });
}
