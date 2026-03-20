/**
 * Scraper for Chatbot Arena (LMSYS) Leaderboard
 * Data available via Hugging Face Spaces API
 */

export interface ArenaResult {
  modelName: string;
  provider: string;
  rank: number;
  eloRating: number;
  score: number;
  category: string;
}

function inferProvider(modelName: string): string {
  const lower = modelName.toLowerCase();
  if (lower.includes("claude")) return "Anthropic";
  if (lower.includes("gpt") || lower.includes("chatgpt") || lower.includes("o1") || lower.includes("o3") || lower.includes("o4")) return "OpenAI";
  if (lower.includes("gemini") || lower.includes("bard")) return "Google";
  if (lower.includes("llama")) return "Meta";
  if (lower.includes("deepseek")) return "DeepSeek";
  if (lower.includes("mistral") || lower.includes("mixtral")) return "Mistral";
  if (lower.includes("qwen")) return "Alibaba";
  if (lower.includes("command")) return "Cohere";
  if (lower.includes("grok")) return "xAI";
  if (lower.includes("phi")) return "Microsoft";
  return "Unknown";
}

export async function scrapeChatbotArena(): Promise<ArenaResult[]> {
  const results: ArenaResult[] = [];

  try {
    // LMSYS publishes leaderboard data in their HF space
    const res = await fetch(
      "https://huggingface.co/spaces/lmsys/chatbot-arena-leaderboard/raw/main/results/latest/elo_results_full.json",
      {
        headers: {
          "User-Agent": "ModelExchange/1.0 (leaderboard-aggregator)",
        },
        next: { revalidate: 0 },
      }
    );

    if (res.ok) {
      const data = await res.json();
      // Try parsing the known format
      if (data && typeof data === "object") {
        const entries = Array.isArray(data) ? data : Object.values(data);
        let rank = 1;
        for (const entry of entries.slice(0, 30)) {
          const e = entry as Record<string, unknown>;
          const modelName = (e.model ?? e.Model ?? e.name ?? "") as string;
          const elo = (e.rating ?? e.elo ?? e.score ?? 0) as number;
          if (modelName && elo > 0) {
            results.push({
              modelName,
              provider: inferProvider(modelName),
              rank: rank++,
              eloRating: Math.round(elo),
              score: Math.round(elo),
              category: "overall",
            });
          }
        }
      }
    }

    // Fallback: try the alternative API format
    if (results.length === 0) {
      const altRes = await fetch(
        "https://huggingface.co/api/spaces/lmsys/chatbot-arena-leaderboard",
        {
          headers: { "User-Agent": "ModelExchange/1.0" },
          next: { revalidate: 0 },
        }
      );
      if (altRes.ok) {
        console.log("Chatbot Arena: space metadata fetched, but no direct data endpoint found.");
      }
    }
  } catch (err) {
    console.error("Chatbot Arena scrape error:", err);
  }

  return results;
}
