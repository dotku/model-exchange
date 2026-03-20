export interface ProviderOffering {
  providerName: string;
  inputPrice: number;
  outputPrice: number;
  speed: "fast" | "standard" | "economy";
  freeTokens?: number | null;
  note?: string;
}

export interface Model {
  id: string;
  name: string;
  provider: string;
  description: string;
  contextWindow: string;
  inputPrice: number;
  outputPrice: number;
  tags: string[];
  freeTokens?: number | null;
  offerings?: ProviderOffering[];
}

export const models: Model[] = [
  {
    id: "claude-opus-4",
    name: "Claude Opus 4",
    provider: "Anthropic",
    description:
      "Most powerful model for complex reasoning, analysis, and nuanced content generation with extended thinking capabilities.",
    contextWindow: "200K",
    inputPrice: 15,
    outputPrice: 75,
    tags: ["Reasoning", "Analysis", "Code"],
    freeTokens: null,
    offerings: [
      { providerName: "Anthropic", inputPrice: 15, outputPrice: 75, speed: "standard" },
      { providerName: "AWS Bedrock", inputPrice: 15, outputPrice: 75, speed: "standard", note: "Cross-region inference" },
      { providerName: "Google Vertex AI", inputPrice: 15, outputPrice: 75, speed: "standard" },
    ],
  },
  {
    id: "gpt-4o",
    name: "GPT-4o",
    provider: "OpenAI",
    description:
      "Multimodal flagship model with strong performance across text, vision, and audio understanding tasks.",
    contextWindow: "128K",
    inputPrice: 2.5,
    outputPrice: 10,
    tags: ["Multimodal", "General", "Vision"],
    freeTokens: 1_000_000,
    offerings: [
      { providerName: "OpenAI", inputPrice: 2.5, outputPrice: 10, speed: "fast", freeTokens: 1_000_000 },
      { providerName: "Azure OpenAI", inputPrice: 2.5, outputPrice: 10, speed: "standard", note: "Enterprise SLA" },
      { providerName: "OpenRouter", inputPrice: 3.0, outputPrice: 12, speed: "fast", freeTokens: 500_000 },
    ],
  },
  {
    id: "gemini-2.5-pro",
    name: "Gemini 2.5 Pro",
    provider: "Google",
    description:
      "Advanced model excelling at long-context understanding, code generation, and multimodal reasoning.",
    contextWindow: "1M",
    inputPrice: 1.25,
    outputPrice: 10,
    tags: ["Long Context", "Code", "Multimodal"],
    freeTokens: 5_000_000,
    offerings: [
      { providerName: "Google AI Studio", inputPrice: 1.25, outputPrice: 10, speed: "standard", freeTokens: 5_000_000 },
      { providerName: "Google Vertex AI", inputPrice: 1.25, outputPrice: 10, speed: "standard", note: "Enterprise" },
      { providerName: "OpenRouter", inputPrice: 1.5, outputPrice: 12, speed: "fast" },
    ],
  },
  {
    id: "llama-4-maverick",
    name: "Llama 4 Maverick",
    provider: "Meta",
    description:
      "Open-weight mixture-of-experts model delivering excellent quality for its size, ideal for enterprise deployment.",
    contextWindow: "1M",
    inputPrice: 0.2,
    outputPrice: 0.6,
    tags: ["Open Weight", "Enterprise", "Efficient"],
    freeTokens: 10_000_000,
    offerings: [
      { providerName: "Together AI", inputPrice: 0.2, outputPrice: 0.6, speed: "fast", freeTokens: 10_000_000 },
      { providerName: "Fireworks AI", inputPrice: 0.22, outputPrice: 0.88, speed: "fast" },
      { providerName: "AWS Bedrock", inputPrice: 0.32, outputPrice: 0.97, speed: "standard", note: "Managed deployment" },
      { providerName: "Groq", inputPrice: 0.18, outputPrice: 0.5, speed: "fast", note: "LPU inference" },
    ],
  },
  {
    id: "claude-sonnet-4",
    name: "Claude Sonnet 4",
    provider: "Anthropic",
    description:
      "Balanced model offering strong reasoning and coding performance at an accessible price point.",
    contextWindow: "200K",
    inputPrice: 3,
    outputPrice: 15,
    tags: ["Balanced", "Code", "Reasoning"],
    freeTokens: 1_000_000,
    offerings: [
      { providerName: "Anthropic", inputPrice: 3, outputPrice: 15, speed: "standard", freeTokens: 1_000_000 },
      { providerName: "AWS Bedrock", inputPrice: 3, outputPrice: 15, speed: "standard" },
      { providerName: "Google Vertex AI", inputPrice: 3, outputPrice: 15, speed: "standard" },
      { providerName: "OpenRouter", inputPrice: 3, outputPrice: 15, speed: "fast" },
    ],
  },
  {
    id: "deepseek-r1",
    name: "DeepSeek R1",
    provider: "DeepSeek",
    description:
      "Specialized reasoning model with chain-of-thought capabilities, competitive with top-tier models at lower cost.",
    contextWindow: "128K",
    inputPrice: 0.55,
    outputPrice: 2.19,
    tags: ["Reasoning", "Cost-Effective", "Open Weight"],
    freeTokens: 5_000_000,
    offerings: [
      { providerName: "DeepSeek", inputPrice: 0.55, outputPrice: 2.19, speed: "standard", freeTokens: 5_000_000 },
      { providerName: "Together AI", inputPrice: 3, outputPrice: 7, speed: "fast" },
      { providerName: "Fireworks AI", inputPrice: 2.4, outputPrice: 8, speed: "fast", note: "FP8 quantized" },
    ],
  },
];
