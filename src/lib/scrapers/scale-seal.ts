/**
 * Scraper for Scale AI SEAL Leaderboard
 * https://labs.scale.com/leaderboard
 *
 * Extracts model rankings from the embedded Next.js data.
 */

export interface ScaleLeaderboardResult {
  modelName: string;
  provider: string;
  category: string;
  rank: number;
  score: number;
}

// Map known model prefixes to providers
function inferProvider(modelName: string): string {
  const lower = modelName.toLowerCase();
  if (lower.includes("claude") || lower.includes("anthropic")) return "Anthropic";
  if (lower.includes("gpt") || lower.includes("openai") || lower.includes("o1") || lower.includes("o3") || lower.includes("o4")) return "OpenAI";
  if (lower.includes("gemini") || lower.includes("google")) return "Google";
  if (lower.includes("llama") || lower.includes("meta")) return "Meta";
  if (lower.includes("deepseek")) return "DeepSeek";
  if (lower.includes("mistral")) return "Mistral";
  if (lower.includes("qwen")) return "Alibaba";
  if (lower.includes("command")) return "Cohere";
  if (lower.includes("grok")) return "xAI";
  return "Unknown";
}

// Map benchmark names to our categories
function mapCategory(benchmarkName: string): string | null {
  const lower = benchmarkName.toLowerCase();
  if (lower.includes("swe") || lower.includes("code")) return "coding";
  if (lower.includes("math") || lower.includes("enigma")) return "math";
  if (lower.includes("reason") || lower.includes("challenge") || lower.includes("humanity")) return "reasoning";
  if (lower.includes("safety") || lower.includes("fortress") || lower.includes("mask") || lower.includes("propensity")) return "safety";
  if (lower.includes("mcp") || lower.includes("agent") || lower.includes("rli")) return "agentic";
  if (lower.includes("tutor") || lower.includes("instruct")) return "instruction";
  return "overall";
}

export async function scrapeScaleSeal(): Promise<ScaleLeaderboardResult[]> {
  const results: ScaleLeaderboardResult[] = [];

  try {
    const res = await fetch("https://labs.scale.com/leaderboard", {
      headers: {
        "User-Agent": "ModelExchange/1.0 (leaderboard-aggregator)",
      },
      next: { revalidate: 0 },
    });

    if (!res.ok) {
      console.error(`Scale SEAL fetch failed: ${res.status}`);
      return results;
    }

    const html = await res.text();

    // Extract JSON chunks from Next.js streaming data
    const jsonChunks: string[] = [];
    const regex = /self\.__next_f\.push\(\[[\d,]*"([^]*?)"\]\)/g;
    let match;
    while ((match = regex.exec(html)) !== null) {
      jsonChunks.push(match[1]);
    }

    const fullText = jsonChunks.join("");

    // Find score arrays in the data — pattern: "scores":[{...}]
    const scoreBlockRegex = /"name":"([^"]+)"[^}]*?"scores":\[((?:\{[^[\]]*\}(?:,(?=\{))?)+)\]/g;
    let scoreMatch;

    while ((scoreMatch = scoreBlockRegex.exec(fullText)) !== null) {
      const benchmarkName = scoreMatch[1];
      const category = mapCategory(benchmarkName);
      if (!category) continue;

      // Parse individual score entries
      const entryRegex = /\{"model":"([^"]+)"[^}]*?"rank":(\d+)[^}]*?"score":([\d.]+)/g;
      let entryMatch;
      const scoresText = scoreMatch[2];

      while ((entryMatch = entryRegex.exec(scoresText)) !== null) {
        const modelName = entryMatch[1];
        const rank = parseInt(entryMatch[2], 10);
        const score = parseFloat(entryMatch[3]);

        if (rank <= 20 && score > 0) {
          results.push({
            modelName,
            provider: inferProvider(modelName),
            category,
            rank,
            score,
          });
        }
      }
    }
  } catch (err) {
    console.error("Scale SEAL scrape error:", err);
  }

  return results;
}
