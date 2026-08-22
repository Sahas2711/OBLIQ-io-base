/* ─── AI Provider Abstraction ─── */

export type AIProvider = "openai" | "gemini" | "groq";

export interface AIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface AIStreamChunk {
  text: string;
  done: boolean;
}

export interface AICompletionRequest {
  messages: AIMessage[];
  model?: string;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
}

export interface AICompletionResponse {
  text: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
  };
}

export interface AIService {
  complete(request: AICompletionRequest): Promise<AICompletionResponse>;
  stream(request: AICompletionRequest): AsyncGenerator<AIStreamChunk>;
}

/* ─── CA Workflow Context ─── */

export interface CAWorkflowContext {
  clientName?: string;
  clientPan?: string;
  entityType?: string;
  tasks?: Array<{
    title: string;
    status: string;
    priority: string;
    dueDate: string;
    category: string;
    daysUntilDue: number;
  }>;
  documents?: Array<{
    name: string;
    status: string;
    dueDate: string;
  }>;
  overdueCount?: number;
  pendingDocCount?: number;
}

export interface AIAssistantMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  context?: CAWorkflowContext;
  disclaimer?: boolean;
}

/* ─── Suggested Prompts ─── */

export interface SuggestedPrompt {
  id: string;
  label: string;
  prompt: string;
  icon: string;
  category: "client" | "task" | "document" | "general";
}
