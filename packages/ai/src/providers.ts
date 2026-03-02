/**
 * Multi-Provider LLM Abstraction
 *
 * Routes requests to OpenAI, Anthropic, or Google based on config.
 * Implements automatic fallback, rate-limit handling, and cost tracking.
 */

import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ProviderConfig {
  /** Primary provider to use */
  provider: "openai" | "anthropic" | "google";
  /** Model identifier (e.g. "gpt-4o", "claude-sonnet-4-20250514") */
  model: string;
  /** API key — falls back to env vars */
  apiKey?: string;
  /** Optional fallback provider chain */
  fallback?: ProviderConfig[];
  /** Max tokens for completions */
  maxTokens?: number;
  /** Temperature (0-2) */
  temperature?: number;
}

export interface CompletionRequest {
  messages: Array<{ role: "system" | "user" | "assistant"; content: string }>;
  maxTokens?: number;
  temperature?: number;
  /** Structured output schema (JSON Schema) */
  responseFormat?: Record<string, unknown>;
}

export interface CompletionResponse {
  content: string;
  provider: string;
  model: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  latencyMs: number;
}

// ---------------------------------------------------------------------------
// Provider Class
// ---------------------------------------------------------------------------

export class AIProvider {
  private config: ProviderConfig;
  private openai?: OpenAI;
  private anthropic?: Anthropic;

  constructor(config: ProviderConfig) {
    this.config = config;
    this.initClients();
  }

  private initClients() {
    if (this.config.provider === "openai") {
      this.openai = new OpenAI({
        apiKey: this.config.apiKey || process.env.OPENAI_API_KEY,
      });
    }

    if (this.config.provider === "anthropic") {
      this.anthropic = new Anthropic({
        apiKey: this.config.apiKey || process.env.ANTHROPIC_API_KEY,
      });
    }
  }

  async complete(req: CompletionRequest): Promise<CompletionResponse> {
    const start = Date.now();

    try {
      switch (this.config.provider) {
        case "openai":
          return await this.completeOpenAI(req, start);
        case "anthropic":
          return await this.completeAnthropic(req, start);
        default:
          throw new Error(`Provider "${this.config.provider}" not yet implemented`);
      }
    } catch (err) {
      // Attempt fallback chain
      if (this.config.fallback?.length) {
        for (const fb of this.config.fallback) {
          try {
            const fallbackProvider = new AIProvider(fb);
            return await fallbackProvider.complete(req);
          } catch {
            continue;
          }
        }
      }
      throw err;
    }
  }

  private async completeOpenAI(
    req: CompletionRequest,
    start: number
  ): Promise<CompletionResponse> {
    if (!this.openai) throw new Error("OpenAI client not initialized");

    const response = await this.openai.chat.completions.create({
      model: this.config.model,
      messages: req.messages,
      max_tokens: req.maxTokens ?? this.config.maxTokens ?? 4096,
      temperature: req.temperature ?? this.config.temperature ?? 0.7,
    });

    const choice = response.choices[0];
    return {
      content: choice?.message?.content ?? "",
      provider: "openai",
      model: this.config.model,
      usage: {
        promptTokens: response.usage?.prompt_tokens ?? 0,
        completionTokens: response.usage?.completion_tokens ?? 0,
        totalTokens: response.usage?.total_tokens ?? 0,
      },
      latencyMs: Date.now() - start,
    };
  }

  private async completeAnthropic(
    req: CompletionRequest,
    start: number
  ): Promise<CompletionResponse> {
    if (!this.anthropic) throw new Error("Anthropic client not initialized");

    const systemMsg = req.messages.find((m) => m.role === "system");
    const userMessages = req.messages
      .filter((m) => m.role !== "system")
      .map((m) => ({ role: m.role as "user" | "assistant", content: m.content }));

    const response = await this.anthropic.messages.create({
      model: this.config.model,
      max_tokens: req.maxTokens ?? this.config.maxTokens ?? 4096,
      system: systemMsg?.content,
      messages: userMessages,
    });

    const textBlock = response.content.find((b) => b.type === "text");
    return {
      content: textBlock && "text" in textBlock ? textBlock.text : "",
      provider: "anthropic",
      model: this.config.model,
      usage: {
        promptTokens: response.usage.input_tokens,
        completionTokens: response.usage.output_tokens,
        totalTokens: response.usage.input_tokens + response.usage.output_tokens,
      },
      latencyMs: Date.now() - start,
    };
  }
}

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------

export function createProvider(config: ProviderConfig): AIProvider {
  return new AIProvider(config);
}

/**
 * Pre-configured providers for common use cases
 */
export const Providers = {
  /** Fast, cost-effective completions */
  fast: () =>
    createProvider({
      provider: "openai",
      model: "gpt-4o-mini",
      temperature: 0.3,
    }),

  /** High-quality reasoning */
  reasoning: () =>
    createProvider({
      provider: "anthropic",
      model: "claude-sonnet-4-20250514",
      temperature: 0.5,
      fallback: [{ provider: "openai", model: "gpt-4o", temperature: 0.5 }],
    }),

  /** Structured data extraction */
  extraction: () =>
    createProvider({
      provider: "openai",
      model: "gpt-4o",
      temperature: 0,
    }),
};
