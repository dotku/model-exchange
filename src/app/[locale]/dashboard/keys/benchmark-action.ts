"use server";

import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/user";
import { logUsage } from "@/lib/usage-logger";
import { redirect } from "next/navigation";

const BENCHMARK_PROMPT = "Explain what a neural network is in exactly two sentences.";

export interface BenchmarkResult {
  success: boolean;
  latencyMs?: number;
  tokensPerSecond?: number;
  ttftMs?: number;
  error?: string;
}

export async function runBenchmark(
  providerKeyId: string,
  modelId: string
): Promise<BenchmarkResult> {
  const user = await getOrCreateUser();
  if (!user) redirect("/auth/login");

  // Get the provider key
  const providerKey = await prisma.providerKey.findFirst({
    where: { id: providerKeyId, userId: user.id, isActive: true },
  });
  if (!providerKey) return { success: false, error: "Key not found or disabled" };

  // Decrypt the key (empty string = no auth needed for free services)
  let apiKey = "";
  if (providerKey.encryptedKey) {
    const crypto = await import("node:crypto");
    const ENCRYPTION_KEY = (process.env.AUTH0_SECRET ?? "fallback-key-for-dev")
      .slice(0, 32)
      .padEnd(32, "0");
    const [ivHex, data] = providerKey.encryptedKey.split(":");
    const iv = Buffer.from(ivHex, "hex");
    const decipher = crypto.createDecipheriv("aes-256-cbc", ENCRYPTION_KEY, iv);
    apiKey = decipher.update(data, "hex", "utf8");
    apiKey += decipher.final("utf8");
  }

  // Determine endpoint
  const endpoint =
    providerKey.endpointUrl || inferEndpoint(providerKey.providerName);
  if (!endpoint) {
    return { success: false, error: "No endpoint configured for this provider" };
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (apiKey) {
    headers["Authorization"] = `Bearer ${apiKey}`;
  }

  const startTime = performance.now();

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model: modelId,
        messages: [{ role: "user", content: BENCHMARK_PROMPT }],
        max_tokens: 100,
        stream: false,
      }),
      signal: AbortSignal.timeout(30_000),
    });

    const ttftMs = Math.round(performance.now() - startTime);

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      const errorLatency = Math.round(performance.now() - startTime);
      logUsage({
        userId: user.id,
        modelName: modelId,
        providerName: providerKey.providerName,
        inputTokens: 0,
        outputTokens: 0,
        latencyMs: errorLatency,
        statusCode: res.status,
        isSuccess: false,
        errorMessage: body.slice(0, 500),
        source: "benchmark",
      });
      return {
        success: false,
        error: `Provider returned ${res.status}: ${body.slice(0, 200)}`,
      };
    }

    const responseData = await res.json();
    const latencyMs = Math.round(performance.now() - startTime);
    const inputTokens = responseData.usage?.prompt_tokens ?? 0;
    const completionTokens = responseData.usage?.completion_tokens ?? 0;
    const tokensPerSecond =
      completionTokens > 0 && latencyMs > 0
        ? Math.round((completionTokens / (latencyMs / 1000)) * 100) / 100
        : 0;

    logUsage({
      userId: user.id,
      modelName: modelId,
      providerName: providerKey.providerName,
      inputTokens,
      outputTokens: completionTokens,
      latencyMs,
      ttftMs,
      statusCode: 200,
      isSuccess: true,
      source: "benchmark",
    });

    return { success: true, latencyMs, tokensPerSecond, ttftMs };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

export async function runAndPublishBenchmark(
  providerKeyId: string,
  modelId: string
) {
  const user = await getOrCreateUser();
  if (!user) redirect("/auth/login");

  const providerKey = await prisma.providerKey.findFirst({
    where: { id: providerKeyId, userId: user.id },
  });
  if (!providerKey) return { success: false, error: "Key not found" };

  const result = await runBenchmark(providerKeyId, modelId);
  if (!result.success) return result;

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  await prisma.speedBenchmark.create({
    data: {
      modelName: modelId,
      providerName: providerKey.providerName,
      latencyMs: result.latencyMs!,
      tokensPerSecond: result.tokensPerSecond!,
      ttftMs: result.ttftMs!,
      testDate: today,
      testedBy: user.id,
      testedByName: user.name ?? user.email,
      isPublished: true,
      source: "community",
    },
  });

  return result;
}

function inferEndpoint(providerName: string): string | null {
  const lower = providerName.toLowerCase();
  if (lower.includes("openai")) return "https://api.openai.com/v1/chat/completions";
  if (lower.includes("anthropic")) return "https://api.anthropic.com/v1/messages";
  if (lower.includes("deepseek")) return "https://api.deepseek.com/v1/chat/completions";
  if (lower.includes("groq")) return "https://api.groq.com/openai/v1/chat/completions";
  if (lower.includes("together")) return "https://api.together.xyz/v1/chat/completions";
  if (lower.includes("fireworks")) return "https://api.fireworks.ai/inference/v1/chat/completions";
  if (lower.includes("jy tech") || lower.includes("jytech")) return "https://api.jytech.us/v1/chat/completions";
  return null;
}
