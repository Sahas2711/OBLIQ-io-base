import type { AIProvider, AIService, AICompletionRequest, AICompletionResponse, CAWorkflowContext } from "../types";

/* ─── System Prompt for CA Workflow ─── */

export function buildSystemPrompt(context?: CAWorkflowContext): string {
  let prompt = `You are Obliq AI, an intelligent compliance operations assistant built specifically for Indian Chartered Accountant (CA) firms.

Your role is to help CA firm partners, managers, and team members manage their compliance operations effectively. You have deep knowledge of:

- Indian tax compliance: GST (GSTR-1, GSTR-3B, GSTR-9), Income Tax (ITR filing, advance tax, TDS)
- TDS compliance: Form 24Q, 26Q, 27Q, Form 16/16A, Form 26AS reconciliation
- ROC compliance: Annual returns, DIR-3 KYC, board resolutions, financial statement filing
- Audit procedures: Statutory audit, tax audit, internal audit
- Indian regulatory deadlines and penalty provisions
- Client document management and follow-up workflows

IMPORTANT RULES:
1. Always clarify that your recommendations are for operational guidance, not legal advice. Actual compliance decisions should be made by qualified CAs.
2. Be specific and actionable. Reference actual deadlines, penalty amounts, and form numbers when relevant.
3. Use structured formatting: bullet points, numbered lists, and clear sections.
4. When analyzing a client's situation, consider: task statuses, document completeness, deadline proximity, and priority levels.
5. If you don't have enough context, ask clarifying questions rather than making assumptions.
6. Never fabricate compliance data or make claims about legal requirements you're uncertain about.
7. Always recommend human review for any AI-generated suggestions.`;

  if (context) {
    prompt += `\n\nCURRENT CONTEXT:`;
    if (context.clientName) {
      prompt += `\nClient: ${context.clientName}`;
      if (context.clientPan) prompt += ` (PAN: ${context.clientPan})`;
      if (context.entityType) prompt += ` [${context.entityType}]`;
    }
    if (context.tasks && context.tasks.length > 0) {
      prompt += `\n\nActive Compliance Tasks:`;
      context.tasks.forEach((t) => {
        const urgency = t.daysUntilDue < 0
          ? `OVERDUE by ${Math.abs(t.daysUntilDue)} days`
          : t.daysUntilDue <= 3
          ? `URGENT - due in ${t.daysUntilDue} days`
          : `due in ${t.daysUntilDue} days`;
        prompt += `\n- ${t.title} [${t.status}] [Priority: ${t.priority}] — ${urgency}`;
      });
    }
    if (context.documents && context.documents.length > 0) {
      prompt += `\n\nDocument Status:`;
      context.documents.forEach((d) => {
        prompt += `\n- ${d.name} [${d.status}] — Due: ${d.dueDate}`;
      });
    }
    if (context.overdueCount && context.overdueCount > 0) {
      prompt += `\n\n⚠️ ${context.overdueCount} overdue items requiring immediate attention.`;
    }
    if (context.pendingDocCount && context.pendingDocCount > 0) {
      prompt += `\n📄 ${context.pendingDocCount} documents pending from clients.`;
    }
  }

  return prompt;
}

/* ─── OpenAI Provider ─── */

export class OpenAIService implements AIService {
  private apiKey: string;
  private model: string;

  constructor(apiKey: string, model = "gpt-4o-mini") {
    this.apiKey = apiKey;
    this.model = model;
  }

  async complete(request: AICompletionRequest): Promise<AICompletionResponse> {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: request.model || this.model,
        messages: request.messages,
        temperature: request.temperature ?? 0.7,
        max_tokens: request.maxTokens ?? 2048,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error?.message || "OpenAI API error");
    }

    const data = await response.json();
    return {
      text: data.choices[0].message.content,
      usage: data.usage
        ? {
            promptTokens: data.usage.prompt_tokens,
            completionTokens: data.usage.completion_tokens,
          }
        : undefined,
    };
  }

  async *stream(request: AICompletionRequest): AsyncGenerator<{ text: string; done: boolean }> {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: request.model || this.model,
        messages: request.messages,
        temperature: request.temperature ?? 0.7,
        max_tokens: request.maxTokens ?? 2048,
        stream: true,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error?.message || "OpenAI API error");
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error("No response body");

    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.slice(6);
          if (data === "[DONE]") {
            yield { text: "", done: true };
            return;
          }
          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              yield { text: content, done: false };
            }
          } catch {
            // Skip malformed chunks
          }
        }
      }
    }
  }
}

/* ─── Gemini Provider ─── */

export class GeminiService implements AIService {
  private apiKey: string;
  private model: string;

  constructor(apiKey: string, model = "gemini-1.5-flash") {
    this.apiKey = apiKey;
    this.model = model;
  }

  async complete(request: AICompletionRequest): Promise<AICompletionResponse> {
    const contents = request.messages
      .filter((m) => m.role !== "system")
      .map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }));

    const systemInstruction = request.messages.find((m) => m.role === "system");

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents,
          ...(systemInstruction && {
            systemInstruction: { parts: [{ text: systemInstruction.content }] },
          }),
          generationConfig: {
            temperature: request.temperature ?? 0.7,
            maxOutputTokens: request.maxTokens ?? 2048,
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error?.message || "Gemini API error");
    }

    const data = await response.json();
    return {
      text: data.candidates?.[0]?.content?.parts?.[0]?.text || "",
    };
  }

  async *stream(request: AICompletionRequest): AsyncGenerator<{ text: string; done: boolean }> {
    // Gemini streaming via streamGenerateContent
    const contents = request.messages
      .filter((m) => m.role !== "system")
      .map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }));

    const systemInstruction = request.messages.find((m) => m.role === "system");

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:streamGenerateContent?alt=sse&key=${this.apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents,
          ...(systemInstruction && {
            systemInstruction: { parts: [{ text: systemInstruction.content }] },
          }),
          generationConfig: {
            temperature: request.temperature ?? 0.7,
            maxOutputTokens: request.maxTokens ?? 2048,
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error?.message || "Gemini API error");
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error("No response body");

    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          try {
            const parsed = JSON.parse(line.slice(6));
            const content = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
            if (content) yield { text: content, done: false };
          } catch {
            // Skip
          }
        }
      }
    }
    yield { text: "", done: true };
  }
}

/* ─── Groq Provider ─── */

export class GroqService implements AIService {
  private apiKey: string;
  private model: string;

  constructor(apiKey: string, model = "llama-3.1-70b-versatile") {
    this.apiKey = apiKey;
    this.model = model;
  }

  async complete(request: AICompletionRequest): Promise<AICompletionResponse> {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: request.model || this.model,
        messages: request.messages,
        temperature: request.temperature ?? 0.7,
        max_tokens: request.maxTokens ?? 2048,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error?.message || "Groq API error");
    }

    const data = await response.json();
    return {
      text: data.choices[0].message.content,
      usage: data.usage
        ? {
            promptTokens: data.usage.prompt_tokens,
            completionTokens: data.usage.completion_tokens,
          }
        : undefined,
    };
  }

  async *stream(request: AICompletionRequest): AsyncGenerator<{ text: string; done: boolean }> {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: request.model || this.model,
        messages: request.messages,
        temperature: request.temperature ?? 0.7,
        max_tokens: request.maxTokens ?? 2048,
        stream: true,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error?.message || "Groq API error");
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error("No response body");

    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.slice(6);
          if (data === "[DONE]") {
            yield { text: "", done: true };
            return;
          }
          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) yield { text: content, done: false };
          } catch {
            // Skip
          }
        }
      }
    }
  }
}

/* ─── Factory ─── */

export function createAIService(provider?: AIProvider): AIService {
  const p = provider || (process.env.AI_PROVIDER as AIProvider) || "openai";

  switch (p) {
    case "gemini": {
      const key = process.env.GEMINI_API_KEY;
      if (!key) throw new Error("GEMINI_API_KEY not configured");
      return new GeminiService(key);
    }
    case "groq": {
      const key = process.env.GROQ_API_KEY;
      if (!key) throw new Error("GROQ_API_KEY not configured");
      return new GroqService(key);
    }
    case "openai":
    default: {
      const key = process.env.OPENAI_API_KEY;
      if (!key) throw new Error("OPENAI_API_KEY not configured");
      return new OpenAIService(key);
    }
  }
}
