/**
 * RAG (Retrieval-Augmented Generation) Pipeline
 *
 * Embeds and retrieves domain knowledge for grounded AI responses:
 * - NCAA bylaws and interpretations
 * - State NIL legislation (50 states)
 * - Historical deal data and market trends
 * - Athlete profiles and performance data
 */

import { AIProvider, createProvider } from "./providers";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface RAGConfig {
  /** Embedding model */
  embeddingModel?: string;
  /** Number of chunks to retrieve */
  topK?: number;
  /** Minimum similarity threshold (0-1) */
  similarityThreshold?: number;
  /** Provider for generation step */
  generationProvider?: AIProvider;
}

export interface RAGDocument {
  id: string;
  content: string;
  metadata: {
    source: string;
    category: "ncaa_bylaw" | "state_law" | "deal_record" | "athlete_profile" | "news" | "other";
    sport?: string;
    state?: string;
    date?: string;
    url?: string;
  };
}

export interface RAGChunk {
  documentId: string;
  content: string;
  embedding?: number[];
  metadata: RAGDocument["metadata"];
  similarity?: number;
}

export interface RAGResult {
  answer: string;
  sources: Array<{
    documentId: string;
    content: string;
    similarity: number;
    metadata: RAGDocument["metadata"];
  }>;
  confidence: number;
  tokensUsed: number;
}

// ---------------------------------------------------------------------------
// Pipeline
// ---------------------------------------------------------------------------

export class RAGPipeline {
  private config: RAGConfig;
  private chunks: RAGChunk[] = [];
  private provider: AIProvider;

  constructor(config: RAGConfig = {}) {
    this.config = {
      embeddingModel: config.embeddingModel ?? "text-embedding-3-small",
      topK: config.topK ?? 5,
      similarityThreshold: config.similarityThreshold ?? 0.7,
      ...config,
    };

    this.provider =
      config.generationProvider ??
      createProvider({
        provider: "openai",
        model: "gpt-4o-mini",
        temperature: 0.3,
      });
  }

  /**
   * Ingest documents into the RAG store.
   * In production, this would use a vector database (Pinecone, Weaviate, pgvector).
   * This in-memory implementation is for development/demo purposes.
   */
  async ingest(documents: RAGDocument[]): Promise<{ ingested: number }> {
    for (const doc of documents) {
      const docChunks = this.chunkDocument(doc);
      this.chunks.push(...docChunks);
    }

    return { ingested: documents.length };
  }

  /**
   * Query the RAG pipeline with a natural language question.
   */
  async query(question: string): Promise<RAGResult> {
    // 1. Retrieve relevant chunks
    const relevant = await this.retrieve(question);

    if (relevant.length === 0) {
      return {
        answer:
          "I don't have enough information in my knowledge base to answer this question accurately. Please try a more specific query or check our documentation.",
        sources: [],
        confidence: 0,
        tokensUsed: 0,
      };
    }

    // 2. Build context from retrieved chunks
    const context = relevant
      .map(
        (chunk, i) =>
          `[Source ${i + 1}: ${chunk.metadata.source} (${chunk.metadata.category})]:\n${chunk.content}`
      )
      .join("\n\n");

    // 3. Generate grounded response
    const response = await this.provider.complete({
      messages: [
        {
          role: "system",
          content: `You are an NIL (Name, Image, Likeness) expert assistant for the NIL33 platform. 
Answer questions using ONLY the provided context. If the context doesn't contain enough information, say so.
Always cite your sources using [Source N] notation.
Be precise about legal and compliance matters — never speculate on regulatory questions.`,
        },
        {
          role: "user",
          content: `Context:\n${context}\n\nQuestion: ${question}`,
        },
      ],
      temperature: 0.3,
      maxTokens: 1024,
    });

    return {
      answer: response.content,
      sources: relevant.map((chunk) => ({
        documentId: chunk.documentId,
        content: chunk.content,
        similarity: chunk.similarity ?? 0,
        metadata: chunk.metadata,
      })),
      confidence: this.calculateConfidence(relevant),
      tokensUsed: response.usage.totalTokens,
    };
  }

  /**
   * Retrieve relevant chunks using keyword matching.
   * In production, replace with vector similarity search.
   */
  private async retrieve(query: string): Promise<RAGChunk[]> {
    const queryTerms = query
      .toLowerCase()
      .split(/\s+/)
      .filter((t) => t.length > 2);

    const scored = this.chunks.map((chunk) => {
      const content = chunk.content.toLowerCase();
      const matchCount = queryTerms.filter((term) =>
        content.includes(term)
      ).length;
      const similarity = queryTerms.length > 0 ? matchCount / queryTerms.length : 0;
      return { ...chunk, similarity };
    });

    return scored
      .filter((c) => c.similarity >= (this.config.similarityThreshold ?? 0.3))
      .sort((a, b) => (b.similarity ?? 0) - (a.similarity ?? 0))
      .slice(0, this.config.topK ?? 5);
  }

  /**
   * Split a document into overlapping chunks.
   */
  private chunkDocument(doc: RAGDocument, chunkSize = 512, overlap = 64): RAGChunk[] {
    const words = doc.content.split(/\s+/);
    const chunks: RAGChunk[] = [];

    for (let i = 0; i < words.length; i += chunkSize - overlap) {
      const slice = words.slice(i, i + chunkSize);
      if (slice.length < 20) continue; // Skip tiny tail chunks

      chunks.push({
        documentId: doc.id,
        content: slice.join(" "),
        metadata: doc.metadata,
      });
    }

    // If document is short enough, keep as single chunk
    if (chunks.length === 0) {
      chunks.push({
        documentId: doc.id,
        content: doc.content,
        metadata: doc.metadata,
      });
    }

    return chunks;
  }

  private calculateConfidence(chunks: RAGChunk[]): number {
    if (chunks.length === 0) return 0;
    const avgSimilarity =
      chunks.reduce((sum, c) => sum + (c.similarity ?? 0), 0) / chunks.length;
    return Math.round(avgSimilarity * 100) / 100;
  }

  /** Get stats about the current knowledge base */
  stats(): { totalChunks: number; categories: Record<string, number> } {
    const categories: Record<string, number> = {};
    for (const chunk of this.chunks) {
      const cat = chunk.metadata.category;
      categories[cat] = (categories[cat] ?? 0) + 1;
    }
    return { totalChunks: this.chunks.length, categories };
  }
}

// ---------------------------------------------------------------------------
// Pre-built Knowledge Sources
// ---------------------------------------------------------------------------

/**
 * NCAA NIL Bylaw reference documents for RAG ingestion.
 * These are simplified summaries — production would ingest full bylaw text.
 */
export const NCAA_NIL_BYLAWS: RAGDocument[] = [
  {
    id: "ncaa-nil-policy-2024",
    content: `NCAA NIL Policy (Effective July 2021, Updated 2024): Student-athletes may engage in NIL activities 
without jeopardizing their eligibility. Athletes can use professional service providers for NIL activities. 
Institutions may not provide NIL compensation as a recruiting inducement. Boosters and collectives must 
operate independently from institutional athletic departments. State laws may provide additional protections 
or restrictions beyond NCAA policy.`,
    metadata: {
      source: "NCAA Manual",
      category: "ncaa_bylaw",
      date: "2024-01-01",
    },
  },
  {
    id: "ncaa-nil-disclosure",
    content: `NCAA NIL Disclosure Requirements: Student-athletes must disclose NIL activities to their institution 
in a manner consistent with institutional, conference, and state law requirements. Institutions are responsible 
for educating student-athletes on NIL policies. Disclosure must include the nature of the activity, compensation 
amount, and involved third parties. Failure to disclose may result in eligibility implications.`,
    metadata: {
      source: "NCAA Manual",
      category: "ncaa_bylaw",
      date: "2024-01-01",
    },
  },
];
