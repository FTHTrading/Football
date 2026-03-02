/**
 * MCP (Model Context Protocol) Tool Registry
 *
 * Provides a framework for registering, discovering, and executing
 * AI-callable tools following the MCP specification.
 */

import { z, type ZodType } from "zod";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface MCPTool<TInput = unknown, TOutput = unknown> {
  /** Unique tool name (e.g. "nil33.valuation.estimate") */
  name: string;
  /** Human-readable description for the LLM */
  description: string;
  /** Zod schema for input validation */
  inputSchema: ZodType<TInput>;
  /** Tool handler function */
  execute: (input: TInput) => Promise<TOutput>;
  /** Optional tags for discovery */
  tags?: string[];
  /** Rate limit (calls per minute) */
  rateLimit?: number;
}

export interface ToolResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  executionMs: number;
  toolName: string;
}

export interface ToolManifest {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  tags: string[];
}

// ---------------------------------------------------------------------------
// Registry
// ---------------------------------------------------------------------------

export class MCPToolRegistry {
  private tools = new Map<string, MCPTool>();
  private callCounts = new Map<string, { count: number; resetAt: number }>();

  /** Register a tool with the registry */
  register<TInput, TOutput>(tool: MCPTool<TInput, TOutput>): void {
    if (this.tools.has(tool.name)) {
      throw new Error(`Tool "${tool.name}" is already registered`);
    }
    this.tools.set(tool.name, tool as unknown as MCPTool);
  }

  /** Unregister a tool */
  unregister(name: string): boolean {
    return this.tools.delete(name);
  }

  /** Get a tool by name */
  get(name: string): MCPTool | undefined {
    return this.tools.get(name);
  }

  /** List all registered tools as manifests (for LLM context) */
  manifest(): ToolManifest[] {
    return Array.from(this.tools.values()).map((tool) => ({
      name: tool.name,
      description: tool.description,
      inputSchema: tool.inputSchema._def
        ? (tool.inputSchema as z.ZodObject<z.ZodRawShape>).shape
          ? this.zodToJsonSchema(tool.inputSchema)
          : {}
        : {},
      tags: tool.tags ?? [],
    }));
  }

  /** Find tools by tag */
  findByTag(tag: string): MCPTool[] {
    return Array.from(this.tools.values()).filter((t) =>
      t.tags?.includes(tag)
    );
  }

  /** Execute a tool by name with input validation */
  async execute<T = unknown>(
    name: string,
    input: unknown
  ): Promise<ToolResult<T>> {
    const tool = this.tools.get(name);
    if (!tool) {
      return {
        success: false,
        error: `Tool "${name}" not found`,
        executionMs: 0,
        toolName: name,
      };
    }

    // Rate limiting
    if (tool.rateLimit) {
      const now = Date.now();
      const state = this.callCounts.get(name);
      if (state && now < state.resetAt) {
        if (state.count >= tool.rateLimit) {
          return {
            success: false,
            error: `Rate limit exceeded for "${name}" (${tool.rateLimit}/min)`,
            executionMs: 0,
            toolName: name,
          };
        }
        state.count++;
      } else {
        this.callCounts.set(name, { count: 1, resetAt: now + 60_000 });
      }
    }

    // Validate input
    const parsed = tool.inputSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: `Invalid input: ${parsed.error.message}`,
        executionMs: 0,
        toolName: name,
      };
    }

    // Execute
    const start = Date.now();
    try {
      const data = await tool.execute(parsed.data);
      return {
        success: true,
        data: data as T,
        executionMs: Date.now() - start,
        toolName: name,
      };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : String(err),
        executionMs: Date.now() - start,
        toolName: name,
      };
    }
  }

  /** Convert Zod schema to JSON Schema (simplified) */
  private zodToJsonSchema(schema: ZodType): Record<string, unknown> {
    // Simplified conversion — in production use zod-to-json-schema
    return {
      type: "object",
      description: schema.description ?? "",
    };
  }
}

// ---------------------------------------------------------------------------
// Built-in NIL33 Tools
// ---------------------------------------------------------------------------

/** Create the default NIL33 tool registry with built-in tools */
export function createNIL33Registry(): MCPToolRegistry {
  const registry = new MCPToolRegistry();

  // Athlete lookup tool
  registry.register({
    name: "nil33.athlete.lookup",
    description:
      "Look up an athlete by name, sport, and school. Returns profile data including NIL valuation, social metrics, and compliance status.",
    inputSchema: z.object({
      name: z.string().describe("Athlete name"),
      sport: z.string().optional().describe("Sport filter"),
      school: z.string().optional().describe("School/university filter"),
    }),
    tags: ["athlete", "search"],
    execute: async (input) => {
      // Placeholder — connects to database in production
      return {
        query: input,
        results: [],
        message: "Athlete lookup requires database connection",
      };
    },
  });

  // Deal search tool
  registry.register({
    name: "nil33.deals.search",
    description:
      "Search national NIL deals by sport, value range, brand, or school. Returns matching deal records.",
    inputSchema: z.object({
      sport: z.string().optional(),
      minValue: z.number().optional(),
      maxValue: z.number().optional(),
      brand: z.string().optional(),
      school: z.string().optional(),
      limit: z.number().default(20),
    }),
    tags: ["deals", "search"],
    rateLimit: 30,
    execute: async (input) => {
      return {
        query: input,
        deals: [],
        message: "Deal search requires scraping pipeline connection",
      };
    },
  });

  // Compliance check tool
  registry.register({
    name: "nil33.compliance.check",
    description:
      "Check NIL compliance for a deal against NCAA bylaws and state legislation. Returns compliance status and any violations.",
    inputSchema: z.object({
      athleteId: z.string(),
      dealValue: z.number(),
      dealType: z.enum(["endorsement", "appearance", "social_media", "merchandise", "camp", "other"]),
      state: z.string().length(2).describe("Two-letter state code"),
      schoolConference: z.string().optional(),
    }),
    tags: ["compliance", "legal"],
    execute: async (input) => {
      return {
        input,
        compliant: true,
        warnings: [],
        message: "Full compliance check requires state law database",
      };
    },
  });

  // Valuation tool
  registry.register({
    name: "nil33.valuation.estimate",
    description:
      "Estimate NIL market value for an athlete based on sport, performance metrics, social following, and market factors.",
    inputSchema: z.object({
      sport: z.string(),
      performanceScore: z.number().min(0).max(100),
      socialFollowing: z.number().min(0),
      engagementRate: z.number().min(0).max(100),
      school: z.string(),
      position: z.string().optional(),
      conference: z.string().optional(),
    }),
    tags: ["valuation", "analytics"],
    execute: async (input) => {
      // Simplified valuation model
      const base = input.performanceScore * 500;
      const socialMultiplier = Math.log10(Math.max(input.socialFollowing, 1)) * 0.3;
      const engagementBonus = input.engagementRate * 100;
      const estimated = Math.round(base * (1 + socialMultiplier) + engagementBonus);

      return {
        estimatedValue: estimated,
        confidence: 0.72,
        factors: {
          performanceWeight: 0.4,
          socialWeight: 0.3,
          engagementWeight: 0.2,
          marketWeight: 0.1,
        },
        currency: "USD",
      };
    },
  });

  return registry;
}
