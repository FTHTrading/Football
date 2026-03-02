/**
 * Agentic Task Execution Framework
 *
 * Autonomous agents that monitor, analyze, and act on NIL data:
 * - Deal monitoring agent (watches for new deals, price changes)
 * - Compliance agent (validates deals against regulations)
 * - Valuation agent (tracks athlete value changes)
 * - Market intelligence agent (trend detection, reports)
 */

import { AIProvider, createProvider } from "./providers";
import { MCPToolRegistry, type ToolResult } from "./mcp";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface AgentConfig {
  /** Agent name */
  name: string;
  /** System prompt defining agent behavior */
  systemPrompt: string;
  /** AI provider for reasoning */
  provider?: AIProvider;
  /** Tool registry the agent can access */
  tools?: MCPToolRegistry;
  /** Maximum reasoning steps before stopping */
  maxSteps?: number;
  /** Enable verbose logging */
  verbose?: boolean;
}

export interface AgentTask {
  /** Task description */
  description: string;
  /** Input data for the task */
  input: Record<string, unknown>;
  /** Expected output format */
  outputFormat?: "text" | "json" | "structured";
}

export interface AgentStep {
  stepNumber: number;
  thought: string;
  action?: string;
  toolCall?: { tool: string; input: unknown; result: ToolResult };
  observation?: string;
}

export interface AgentResult {
  success: boolean;
  output: string;
  steps: AgentStep[];
  totalTokens: number;
  executionMs: number;
}

// ---------------------------------------------------------------------------
// Agent
// ---------------------------------------------------------------------------

export class Agent {
  private config: AgentConfig;
  private provider: AIProvider;

  constructor(config: AgentConfig) {
    this.config = {
      maxSteps: 10,
      verbose: false,
      ...config,
    };

    this.provider =
      config.provider ??
      createProvider({
        provider: "openai",
        model: "gpt-4o",
        temperature: 0.3,
      });
  }

  /**
   * Execute a task using the ReAct (Reason + Act) loop.
   */
  async execute(task: AgentTask): Promise<AgentResult> {
    const start = Date.now();
    const steps: AgentStep[] = [];
    let totalTokens = 0;
    let conversationHistory: Array<{
      role: "system" | "user" | "assistant";
      content: string;
    }> = [];

    // Build system prompt with available tools
    const toolManifest = this.config.tools?.manifest() ?? [];
    const toolsDescription =
      toolManifest.length > 0
        ? `\n\nAvailable tools:\n${toolManifest
            .map((t) => `- ${t.name}: ${t.description}`)
            .join("\n")}`
        : "";

    conversationHistory.push({
      role: "system",
      content: `${this.config.systemPrompt}${toolsDescription}

When you need to use a tool, respond with:
TOOL: <tool_name>
INPUT: <json_input>

When you have a final answer, respond with:
ANSWER: <your_answer>

Think step by step. After each tool result, reflect on the observation before deciding next action.`,
    });

    conversationHistory.push({
      role: "user",
      content: `Task: ${task.description}\n\nInput: ${JSON.stringify(task.input, null, 2)}`,
    });

    // ReAct loop
    for (let step = 1; step <= (this.config.maxSteps ?? 10); step++) {
      const response = await this.provider.complete({
        messages: conversationHistory,
        maxTokens: 1024,
      });

      totalTokens += response.usage.totalTokens;
      const content = response.content;

      if (this.config.verbose) {
        console.log(`[Agent:${this.config.name}] Step ${step}:`, content);
      }

      // Check for final answer
      const answerMatch = content.match(/ANSWER:\s*([\s\S]*)/);
      if (answerMatch) {
        steps.push({
          stepNumber: step,
          thought: content,
          action: "final_answer",
        });

        return {
          success: true,
          output: answerMatch[1].trim(),
          steps,
          totalTokens,
          executionMs: Date.now() - start,
        };
      }

      // Check for tool call
      const toolMatch = content.match(/TOOL:\s*(\S+)\s*\nINPUT:\s*([\s\S]*?)(?:\n\n|$)/);
      if (toolMatch && this.config.tools) {
        const toolName = toolMatch[1];
        let toolInput: unknown;
        try {
          toolInput = JSON.parse(toolMatch[2].trim());
        } catch {
          toolInput = toolMatch[2].trim();
        }

        const result = await this.config.tools.execute(toolName, toolInput);

        const agentStep: AgentStep = {
          stepNumber: step,
          thought: content,
          action: `call_tool:${toolName}`,
          toolCall: { tool: toolName, input: toolInput, result },
          observation: JSON.stringify(result.data ?? result.error),
        };
        steps.push(agentStep);

        // Feed observation back
        conversationHistory.push({ role: "assistant", content });
        conversationHistory.push({
          role: "user",
          content: `Observation from ${toolName}: ${JSON.stringify(result.data ?? result.error)}`,
        });
      } else {
        // Pure reasoning step
        steps.push({
          stepNumber: step,
          thought: content,
        });

        conversationHistory.push({ role: "assistant", content });
        conversationHistory.push({
          role: "user",
          content: "Continue reasoning or provide a final ANSWER.",
        });
      }
    }

    // Max steps reached
    return {
      success: false,
      output: "Agent reached maximum reasoning steps without a final answer.",
      steps,
      totalTokens,
      executionMs: Date.now() - start,
    };
  }
}

// ---------------------------------------------------------------------------
// Pre-built NIL33 Agents
// ---------------------------------------------------------------------------

/**
 * Create a Deal Monitoring Agent that watches for new NIL deals
 * and analyzes market trends.
 */
export function createDealMonitorAgent(tools?: MCPToolRegistry): Agent {
  return new Agent({
    name: "DealMonitor",
    systemPrompt: `You are the NIL33 Deal Monitoring Agent. Your job is to:
1. Monitor incoming NIL deal data across all sports
2. Identify notable deals (high value, unusual terms, first-of-kind)
3. Detect market trends and shifts
4. Flag potential compliance concerns
5. Generate deal summaries and alerts

You have deep knowledge of the NIL landscape across all collegiate sports.
Always cite specific data points and provide actionable insights.`,
    tools,
    maxSteps: 8,
  });
}

/**
 * Create a Compliance Agent that validates NIL activities
 * against NCAA bylaws and state legislation.
 */
export function createComplianceAgent(tools?: MCPToolRegistry): Agent {
  return new Agent({
    name: "ComplianceChecker",
    systemPrompt: `You are the NIL33 Compliance Agent. Your job is to:
1. Validate NIL deals against NCAA bylaws
2. Check deals against applicable state legislation
3. Verify institutional and conference rules
4. Identify disclosure requirements
5. Flag potential violations with severity levels

Be extremely precise about compliance matters. Never speculate — cite specific rules.
When unsure, recommend consulting with compliance officers.`,
    tools,
    maxSteps: 6,
  });
}

/**
 * Create a Valuation Agent that estimates and tracks
 * athlete NIL market values.
 */
export function createValuationAgent(tools?: MCPToolRegistry): Agent {
  return new Agent({
    name: "ValuationEngine",
    systemPrompt: `You are the NIL33 Valuation Agent. Your job is to:
1. Estimate NIL market value for athletes across all sports
2. Factor in performance metrics, social presence, and market conditions
3. Compare against historical deal data
4. Project future value trajectories
5. Identify undervalued athletes and emerging opportunities

Use quantitative analysis wherever possible. Provide confidence intervals.
Consider sport-specific valuation factors (e.g., QB visibility vs. swimmer visibility).`,
    tools,
    maxSteps: 8,
  });
}
