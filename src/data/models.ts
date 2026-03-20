export interface ProviderOffering {
  providerName: string;
  inputPrice: number;
  outputPrice: number;
  speed: "fast" | "standard" | "economy";
  freeTokens?: number | null;
  apiDocsUrl?: string;
  billingType?: "platform" | "external";
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
  billingType?: "platform" | "external";
  isPartner?: boolean;
  maintainedBy?: string;
  offerings?: ProviderOffering[];
}

export const models: Model[] = [
  {
    id: "sienovo-smollm",
    name: "sienovo/smollm",
    provider: "Sienovo",
    description:
      "A compact yet capable language model optimized for edge deployment and resource-constrained environments. Delivers strong performance on reasoning and instruction-following tasks at a fraction of the cost of larger models. Free to use — provided by Sienovo for the community.",
    contextWindow: "8K",
    inputPrice: 0,
    outputPrice: 0,
    tags: ["Compact", "Edge", "Free", "Instruction"],
    freeTokens: null,
    billingType: "external",
    isPartner: true,
    maintainedBy: "JY Tech Cloud",
    offerings: [
      { providerName: "JY Tech Cloud", inputPrice: 0, outputPrice: 0, speed: "fast", apiDocsUrl: "https://jytech.us", note: "Free — official hosting" },
    ],
  },
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
      { providerName: "Anthropic", inputPrice: 15, outputPrice: 75, speed: "standard", apiDocsUrl: "https://docs.anthropic.com/en/api" },
      { providerName: "AWS Bedrock", inputPrice: 15, outputPrice: 75, speed: "standard", apiDocsUrl: "https://docs.aws.amazon.com/bedrock/", note: "Cross-region inference" },
      { providerName: "Google Vertex AI", inputPrice: 15, outputPrice: 75, speed: "standard", apiDocsUrl: "https://cloud.google.com/vertex-ai/docs" },
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
      { providerName: "OpenAI", inputPrice: 2.5, outputPrice: 10, speed: "fast", freeTokens: 1_000_000, apiDocsUrl: "https://platform.openai.com/docs" },
      { providerName: "Azure OpenAI", inputPrice: 2.5, outputPrice: 10, speed: "standard", apiDocsUrl: "https://learn.microsoft.com/en-us/azure/ai-services/openai/", note: "Enterprise SLA" },
      { providerName: "OpenRouter", inputPrice: 3.0, outputPrice: 12, speed: "fast", freeTokens: 500_000, apiDocsUrl: "https://openrouter.ai/docs" },
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
      { providerName: "Google AI Studio", inputPrice: 1.25, outputPrice: 10, speed: "standard", freeTokens: 5_000_000, apiDocsUrl: "https://ai.google.dev/docs" },
      { providerName: "Google Vertex AI", inputPrice: 1.25, outputPrice: 10, speed: "standard", apiDocsUrl: "https://cloud.google.com/vertex-ai/docs", note: "Enterprise" },
      { providerName: "OpenRouter", inputPrice: 1.5, outputPrice: 12, speed: "fast", apiDocsUrl: "https://openrouter.ai/docs" },
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
      { providerName: "Together AI", inputPrice: 0.2, outputPrice: 0.6, speed: "fast", freeTokens: 10_000_000, apiDocsUrl: "https://docs.together.ai" },
      { providerName: "Fireworks AI", inputPrice: 0.22, outputPrice: 0.88, speed: "fast", apiDocsUrl: "https://docs.fireworks.ai" },
      { providerName: "AWS Bedrock", inputPrice: 0.32, outputPrice: 0.97, speed: "standard", apiDocsUrl: "https://docs.aws.amazon.com/bedrock/", note: "Managed deployment" },
      { providerName: "Groq", inputPrice: 0.18, outputPrice: 0.5, speed: "fast", apiDocsUrl: "https://console.groq.com/docs", note: "LPU inference" },
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
      { providerName: "Anthropic", inputPrice: 3, outputPrice: 15, speed: "standard", freeTokens: 1_000_000, apiDocsUrl: "https://docs.anthropic.com/en/api" },
      { providerName: "AWS Bedrock", inputPrice: 3, outputPrice: 15, speed: "standard", apiDocsUrl: "https://docs.aws.amazon.com/bedrock/" },
      { providerName: "Google Vertex AI", inputPrice: 3, outputPrice: 15, speed: "standard", apiDocsUrl: "https://cloud.google.com/vertex-ai/docs" },
      { providerName: "OpenRouter", inputPrice: 3, outputPrice: 15, speed: "fast", apiDocsUrl: "https://openrouter.ai/docs" },
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
      { providerName: "DeepSeek", inputPrice: 0.55, outputPrice: 2.19, speed: "standard", freeTokens: 5_000_000, apiDocsUrl: "https://api-docs.deepseek.com" },
      { providerName: "Together AI", inputPrice: 3, outputPrice: 7, speed: "fast", apiDocsUrl: "https://docs.together.ai" },
      { providerName: "Fireworks AI", inputPrice: 2.4, outputPrice: 8, speed: "fast", apiDocsUrl: "https://docs.fireworks.ai", note: "FP8 quantized" },
    ],
  },
];
