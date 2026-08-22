"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Sparkles,
  Send,
  Loader2,
  X,
  MessageSquare,
  AlertTriangle,
  Users,
  Clock,
  FileText,
  Target,
  ChevronDown,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { AIAssistantMessage } from "@/lib/ai/types";

/* ─── Suggested Prompts ─── */

const suggestedPrompts = [
  {
    id: "risk",
    label: "Why is L&T Finance at risk?",
    prompt: "Why is L&T Finance Holdings at risk this week? What needs immediate attention?",
    icon: <AlertTriangle className="h-4 w-4" />,
    category: "client",
  },
  {
    id: "priority",
    label: "What should I prioritize today?",
    prompt: "Based on upcoming deadlines and overdue items, what should I prioritize working on today?",
    icon: <Target className="h-4 w-4" />,
    category: "task",
  },
  {
    id: "followup",
    label: "Draft a follow-up for TCS",
    prompt: "Draft a professional follow-up message to Tata Consultancy Services about their pending TDS Q1 documents.",
    icon: <MessageSquare className="h-4 w-4" />,
    category: "document",
  },
  {
    id: "missing",
    label: "What documents are missing?",
    prompt: "Which clients are missing documents needed for their upcoming compliance deadlines?",
    icon: <FileText className="h-4 w-4" />,
    category: "document",
  },
  {
    id: "gst",
    label: "GST 3B batch filing status",
    prompt: "Give me an overview of all pending GST 3B filings for this month. Which clients have all documents ready?",
    icon: <Users className="h-4 w-4" />,
    category: "general",
  },
  {
    id: "overdue",
    label: "Explain overdue penalties",
    prompt: "What are the penalty implications for the overdue ROC filing and statutory audit? What should be my immediate next steps?",
    icon: <Clock className="h-4 w-4" />,
    category: "general",
  },
];

/* ─── Typing Indicator ─── */

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 px-4 py-3">
      <div className="flex gap-1">
        <span className="h-2 w-2 rounded-full bg-brand-400 animate-bounce" style={{ animationDelay: "0ms" }} />
        <span className="h-2 w-2 rounded-full bg-brand-400 animate-bounce" style={{ animationDelay: "150ms" }} />
        <span className="h-2 w-2 rounded-full bg-brand-400 animate-bounce" style={{ animationDelay: "300ms" }} />
      </div>
      <span className="text-xs text-neutral-500 ml-1">Thinking...</span>
    </div>
  );
}

/* ─── Markdown-like Renderer ─── */

function renderContent(text: string) {
  // Simple markdown-like rendering
  const lines = text.split("\n");
  return lines.map((line, i) => {
    // Bold
    line = line.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-neutral-900">$1</strong>');
    // Inline code
    line = line.replace(/`(.*?)`/g, '<code class="text-xs bg-neutral-100 px-1.5 py-0.5 rounded text-brand-700">$1</code>');

    if (line.startsWith("- ") || line.startsWith("• ")) {
      return (
        <div key={i} className="flex gap-2 ml-2 my-0.5">
          <span className="text-brand-500 mt-1 shrink-0">•</span>
          <span dangerouslySetInnerHTML={{ __html: line.slice(2) }} />
        </div>
      );
    }
    if (/^\d+\.\s/.test(line)) {
      const match = line.match(/^(\d+\.\s)(.*)/);
      if (match) {
        return (
          <div key={i} className="flex gap-2 ml-2 my-0.5">
            <span className="font-semibold text-brand-600 shrink-0">{match[1]}</span>
            <span dangerouslySetInnerHTML={{ __html: match[2] }} />
          </div>
        );
      }
    }
    if (line.startsWith("**") && line.endsWith("**")) {
      return (
        <p key={i} className="font-semibold text-neutral-900 mt-3 mb-1" dangerouslySetInnerHTML={{ __html: line }} />
      );
    }
    if (line.startsWith("## ")) {
      return (
        <h3 key={i} className="font-semibold text-neutral-900 mt-4 mb-1 text-sm">
          {line.slice(3)}
        </h3>
      );
    }
    if (line.trim() === "") {
      return <div key={i} className="h-2" />;
    }
    return (
      <p key={i} className="my-0.5" dangerouslySetInnerHTML={{ __html: line }} />
    );
  });
}

/* ─── Main AI Assistant Panel ─── */

interface AIAssistantProps {
  open: boolean;
  onClose: () => void;
}

export function AIAssistant({ open, onClose }: AIAssistantProps) {
  const [messages, setMessages] = useState<AIAssistantMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, streaming, scrollToBottom]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || loading) return;

      const userMessage: AIAssistantMessage = {
        id: `msg_${Date.now()}`,
        role: "user",
        content: content.trim(),
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setInput("");
      setLoading(true);
      setStreaming("");

      try {
        const response = await fetch("/api/ai/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [
              ...messages.map((m) => ({ role: m.role, content: m.content })),
              { role: "user", content: content.trim() },
            ],
            stream: true,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to get response");
        }

        const reader = response.body?.getReader();
        if (!reader) throw new Error("No response body");

        const decoder = new TextDecoder();
        let fullText = "";
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
                const data = JSON.parse(line.slice(6));
                if (data.error) {
                  throw new Error(data.error);
                }
                if (data.text) {
                  fullText += data.text;
                  setStreaming(fullText);
                }
                if (data.done) {
                  // Finalize
                  const assistantMessage: AIAssistantMessage = {
                    id: `msg_${Date.now()}`,
                    role: "assistant",
                    content: fullText || "I couldn't generate a response. Please try again.",
                    timestamp: new Date().toISOString(),
                    disclaimer: true,
                  };
                  setMessages((prev) => [...prev, assistantMessage]);
                  setStreaming("");
                }
              } catch {
                // Skip malformed chunks
              }
            }
          }
        }

        // If streaming didn't produce a final message
        if (fullText && !messages.find((m) => m.content === fullText)) {
          const assistantMessage: AIAssistantMessage = {
            id: `msg_${Date.now()}`,
            role: "assistant",
            content: fullText,
            timestamp: new Date().toISOString(),
            disclaimer: true,
          };
          setMessages((prev) => [...prev, assistantMessage]);
          setStreaming("");
        }
      } catch (error) {
        const errorMessage: AIAssistantMessage = {
          id: `msg_${Date.now()}`,
          role: "assistant",
          content: `I encountered an error: ${error instanceof Error ? error.message : "Unknown error"}. Please try again or rephrase your question.`,
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, errorMessage]);
        setStreaming("");
      } finally {
        setLoading(false);
      }
    },
    [messages, loading]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setStreaming("");
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end sm:items-center sm:justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-neutral-900/30 backdrop-blur-sm sm:bg-transparent" onClick={onClose} />

      {/* Panel */}
      <div className="relative z-10 w-full sm:w-[440px] h-[100dvh] sm:h-[680px] sm:max-h-[85vh] bg-white sm:rounded-2xl border border-neutral-200 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600">
              <Sparkles className="h-4.5 w-4.5 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-neutral-900">Obliq AI</h2>
              <p className="text-[11px] text-neutral-500">Compliance Operations Assistant</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {messages.length > 0 && (
              <button
                onClick={clearChat}
                className="p-2 rounded-lg text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-colors"
                title="Clear chat"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-colors"
              title="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {messages.length === 0 && !streaming && (
            <div className="space-y-4">
              {/* Welcome */}
              <div className="text-center py-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 mx-auto mb-3">
                  <Sparkles className="h-6 w-6 text-brand-600" />
                </div>
                <h3 className="text-base font-semibold text-neutral-900 mb-1">
                  How can I help today?
                </h3>
                <p className="text-sm text-neutral-500 max-w-xs mx-auto">
                  I can analyze your compliance data, prioritize tasks, and draft follow-ups.
                </p>
              </div>

              {/* Suggested prompts */}
              <div className="space-y-2">
                {suggestedPrompts.map((sp) => (
                  <button
                    key={sp.id}
                    onClick={() => sendMessage(sp.prompt)}
                    className="w-full text-left p-3 rounded-xl border border-neutral-200 hover:border-brand-200 hover:bg-brand-50/50 transition-all group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100 group-hover:bg-brand-100 text-neutral-500 group-hover:text-brand-600 transition-colors shrink-0">
                        {sp.icon}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-neutral-900">{sp.label}</p>
                        <p className="text-xs text-neutral-500 mt-0.5 truncate">{sp.prompt}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Rendered messages */}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex",
                msg.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[85%] rounded-2xl px-4 py-3",
                  msg.role === "user"
                    ? "bg-brand-600 text-white rounded-br-md"
                    : "bg-neutral-100 text-neutral-900 rounded-bl-md"
                )}
              >
                {msg.role === "assistant" ? (
                  <div className="text-sm leading-relaxed space-y-0.5">
                    {renderContent(msg.content)}
                  </div>
                ) : (
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                )}
                {msg.disclaimer && (
                  <div className="mt-3 pt-2 border-t border-neutral-200/60">
                    <p className="text-[11px] text-neutral-500 flex items-start gap-1.5">
                      <AlertTriangle className="h-3 w-3 shrink-0 mt-0.5" />
                      AI-generated. Please verify with qualified professionals before acting.
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Streaming response */}
          {streaming && (
            <div className="flex justify-start">
              <div className="max-w-[85%] rounded-2xl rounded-bl-md bg-neutral-100 text-neutral-900 px-4 py-3">
                <div className="text-sm leading-relaxed space-y-0.5">
                  {renderContent(streaming)}
                  <span className="inline-block h-4 w-0.5 bg-brand-500 animate-pulse ml-0.5" />
                </div>
              </div>
            </div>
          )}

          {/* Loading indicator */}
          {loading && !streaming && <TypingIndicator />}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="px-5 py-4 border-t border-neutral-200 shrink-0">
          <form onSubmit={handleSubmit} className="flex items-end gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about clients, tasks, deadlines..."
              rows={1}
              className="flex-1 resize-none rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 max-h-24"
              style={{ minHeight: "42px" }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = "auto";
                target.style.height = Math.min(target.scrollHeight, 96) + "px";
              }}
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="flex h-[42px] w-[42px] items-center justify-center rounded-xl bg-brand-600 text-white transition-colors hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </button>
          </form>
          <p className="text-[10px] text-neutral-400 mt-2 text-center">
            Obliq AI provides operational guidance, not legal advice. Always verify with qualified professionals.
          </p>
        </div>
      </div>
    </div>
  );
}
