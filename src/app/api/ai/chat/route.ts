import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAIService, buildSystemPrompt } from "@/lib/ai/providers/base";
import type { AIMessage, CAWorkflowContext } from "@/lib/ai/types";
import { complianceTasks, documents, clients } from "@/lib/data/mock-data";

function daysUntil(dateStr: string): number {
  const now = new Date("2025-08-22");
  const due = new Date(dateStr);
  return Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

function buildContextFromData(clientName?: string): CAWorkflowContext | undefined {
  if (!clientName) return undefined;

  const client = clients.find(
    (c) => c.name.toLowerCase().includes(clientName.toLowerCase())
  );
  if (!client) return undefined;

  const clientTasks = complianceTasks
    .filter((t) => t.clientId === client.id)
    .map((t) => ({
      title: t.title,
      status: t.status,
      priority: t.priority,
      dueDate: t.dueDate,
      category: t.category,
      daysUntilDue: daysUntil(t.dueDate),
    }));

  const clientDocs = documents
    .filter((d) => d.clientId === client.id)
    .map((d) => ({
      name: d.name,
      status: d.status,
      dueDate: d.dueDate,
    }));

  return {
    clientName: client.name,
    clientPan: client.pan,
    entityType: client.entityType,
    tasks: clientTasks,
    documents: clientDocs,
    overdueCount: clientTasks.filter((t) => t.status === "overdue").length,
    pendingDocCount: clientDocs.filter((d) => d.status === "requested").length,
  };
}

export async function POST(request: Request) {
  try {
    // Verify authentication
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { messages, clientName } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Messages are required" }, { status: 400 });
    }

    // Build context
    const context = buildContextFromData(clientName);
    const systemPrompt = buildSystemPrompt(context);

    // Build message array
    const aiMessages: AIMessage[] = [
      { role: "system", content: systemPrompt },
      ...messages.map((m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    ];

    // Check if streaming is requested
    const wantsStream = body.stream !== false;

    const aiService = createAIService();

    if (wantsStream) {
      // Streaming response
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of aiService.stream({
              messages: aiMessages,
              temperature: 0.7,
              maxTokens: 2048,
            })) {
              if (chunk.text) {
                controller.enqueue(
                  encoder.encode(`data: ${JSON.stringify({ text: chunk.text, done: false })}\n\n`)
                );
              }
              if (chunk.done) {
                controller.enqueue(
                  encoder.encode(`data: ${JSON.stringify({ text: "", done: true })}\n\n`)
                );
              }
            }
            controller.close();
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "AI service error";
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ error: errorMessage, done: true })}\n\n`
              )
            );
            controller.close();
          }
        },
      });

      return new Response(stream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
    } else {
      // Non-streaming response
      const response = await aiService.complete({
        messages: aiMessages,
        temperature: 0.7,
        maxTokens: 2048,
      });

      return NextResponse.json({
        text: response.text,
        context: context
          ? {
              clientName: context.clientName,
              taskCount: context.tasks?.length || 0,
              overdueCount: context.overdueCount || 0,
            }
          : undefined,
      });
    }
  } catch (error) {
    console.error("AI chat error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";

    // If API key not configured, return a helpful fallback
    if (message.includes("not configured")) {
      return NextResponse.json({
        text: `I'm Obliq AI, your compliance operations assistant. I can help you with:

**Client Analysis**
- Summarize a client's compliance situation
- Identify pending items and overdue tasks
- Explain why a task is urgent

**Task Management**
- Prioritize tasks based on deadlines and risk
- Suggest optimal task sequencing
- Identify bottlenecks in your workflow

**Document Tracking**
- Identify missing documents
- Suggest follow-up messages for clients
- Track document collection progress

**Operational Guidance**
- Explain GST/TDS/ITR filing deadlines
- Clarify penalty provisions
- Recommend next steps for compliance workflows

To get started, ask me something like:
- "Why is Reliance at risk this week?"
- "What should I prioritize today?"
- "Draft a follow-up message for TCS about their pending TDS return"

*Note: AI recommendations are for operational guidance only. Always verify compliance decisions with qualified professionals.*`,
        provider: "fallback",
        configured: false,
      });
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
