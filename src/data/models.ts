export interface Model {
  id: string;
  name: string;
  provider: string;
  description: string;
  contextWindow: string;
  inputPrice: number;
  outputPrice: number;
  tags: string[];
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
  },
];
