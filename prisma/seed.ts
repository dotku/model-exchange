import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const today = new Date();
today.setHours(0, 0, 0, 0);

const leaderboardData = [
  // Scale SEAL — Coding
  { modelName: "claude-opus-4-6", provider: "Anthropic", source: "scale_seal", category: "coding", rank: 1, score: 45.89 },
  { modelName: "gpt-5.4-codex", provider: "OpenAI", source: "scale_seal", category: "coding", rank: 2, score: 43.60 },
  { modelName: "gemini-3-pro", provider: "Google", source: "scale_seal", category: "coding", rank: 3, score: 40.12 },
  { modelName: "deepseek-r1", provider: "DeepSeek", source: "scale_seal", category: "coding", rank: 4, score: 38.55 },
  { modelName: "llama-4-maverick", provider: "Meta", source: "scale_seal", category: "coding", rank: 5, score: 35.20 },
  // Scale SEAL — Reasoning
  { modelName: "gpt-5.4-codex", provider: "OpenAI", source: "scale_seal", category: "reasoning", rank: 1, score: 37.52 },
  { modelName: "claude-opus-4-6", provider: "Anthropic", source: "scale_seal", category: "reasoning", rank: 2, score: 36.24 },
  { modelName: "gemini-3-pro", provider: "Google", source: "scale_seal", category: "reasoning", rank: 3, score: 34.80 },
  { modelName: "deepseek-r1", provider: "DeepSeek", source: "scale_seal", category: "reasoning", rank: 4, score: 33.10 },
  { modelName: "claude-sonnet-4-6", provider: "Anthropic", source: "scale_seal", category: "reasoning", rank: 5, score: 31.50 },
  // Scale SEAL — Agentic
  { modelName: "claude-opus-4-6", provider: "Anthropic", source: "scale_seal", category: "agentic", rank: 1, score: 62.30 },
  { modelName: "gpt-5.2", provider: "OpenAI", source: "scale_seal", category: "agentic", rank: 2, score: 60.57 },
  { modelName: "gemini-3-pro", provider: "Google", source: "scale_seal", category: "agentic", rank: 3, score: 55.40 },
  // Chatbot Arena — Overall (ELO)
  { modelName: "gpt-5.4", provider: "OpenAI", source: "chatbot_arena", category: "overall", rank: 1, score: 1380, eloRating: 1380 },
  { modelName: "claude-opus-4-6", provider: "Anthropic", source: "chatbot_arena", category: "overall", rank: 2, score: 1365, eloRating: 1365 },
  { modelName: "gemini-3-pro", provider: "Google", source: "chatbot_arena", category: "overall", rank: 3, score: 1350, eloRating: 1350 },
  { modelName: "claude-sonnet-4-6", provider: "Anthropic", source: "chatbot_arena", category: "overall", rank: 4, score: 1320, eloRating: 1320 },
  { modelName: "gpt-4o", provider: "OpenAI", source: "chatbot_arena", category: "overall", rank: 5, score: 1310, eloRating: 1310 },
  { modelName: "deepseek-r1", provider: "DeepSeek", source: "chatbot_arena", category: "overall", rank: 6, score: 1295, eloRating: 1295 },
  { modelName: "llama-4-maverick", provider: "Meta", source: "chatbot_arena", category: "overall", rank: 7, score: 1280, eloRating: 1280 },
  { modelName: "mistral-large-3", provider: "Mistral", source: "chatbot_arena", category: "overall", rank: 8, score: 1265, eloRating: 1265 },
  { modelName: "qwen-3-72b", provider: "Alibaba", source: "chatbot_arena", category: "overall", rank: 9, score: 1255, eloRating: 1255 },
  { modelName: "grok-3", provider: "xAI", source: "chatbot_arena", category: "overall", rank: 10, score: 1245, eloRating: 1245 },
];

async function main() {
  console.log("Seeding leaderboard data...");

  for (const entry of leaderboardData) {
    await prisma.leaderboardEntry.upsert({
      where: {
        modelName_source_category_scrapedAt: {
          modelName: entry.modelName,
          source: entry.source,
          category: entry.category,
          scrapedAt: today,
        },
      },
      update: { rank: entry.rank, score: entry.score, provider: entry.provider, eloRating: entry.eloRating ?? null },
      create: {
        modelName: entry.modelName,
        provider: entry.provider,
        source: entry.source,
        category: entry.category,
        rank: entry.rank,
        score: entry.score,
        eloRating: entry.eloRating ?? null,
        scrapedAt: today,
      },
    });
  }

  // Seed speed benchmark sample
  await prisma.speedBenchmark.deleteMany({
    where: { modelName: "sienovo/smollm", providerName: "JY Tech Cloud", testDate: today, source: "system" },
  });
  await prisma.speedBenchmark.create({
    data: {
      modelName: "sienovo/smollm",
      providerName: "JY Tech Cloud",
      latencyMs: 320,
      tokensPerSecond: 85.2,
      ttftMs: 120,
      testDate: today,
      source: "system",
    },
  });

  console.log(`Seeded ${leaderboardData.length} leaderboard entries + 1 speed benchmark.`);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
