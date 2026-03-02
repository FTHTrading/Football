/**
 * @nil33/ai — Multi-Provider AI Engine
 *
 * Provides a unified interface for AI operations across the NIL33 platform:
 * - Multi-provider LLM access (OpenAI, Anthropic, Google)
 * - MCP (Model Context Protocol) tool framework
 * - RAG (Retrieval-Augmented Generation) pipeline
 * - Agentic task execution
 */

export { AIProvider, createProvider, type ProviderConfig } from "./providers";
export { MCPToolRegistry, type MCPTool, type ToolResult } from "./mcp";
export { RAGPipeline, type RAGConfig, type RAGResult } from "./rag";
export { Agent, type AgentConfig, type AgentTask } from "./agents";
export { NILValuationEngine, type ValuationInput, type ValuationResult } from "./valuation";
