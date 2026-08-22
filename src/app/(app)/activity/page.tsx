"use client";

import { useState, useMemo } from "react";
import { Activity, Filter, Sparkles, CheckCircle2, Clock, FileText, Users, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { activities } from "@/lib/data/mock-data";
import { EmptyState } from "@/components/ui/EmptyState";

const actionIcons: Record<string, React.ReactNode> = {
  task_completed: <CheckCircle2 className="h-4 w-4 text-success" />,
  task_created: <Clock className="h-4 w-4 text-brand-600" />,
  task_assigned: <Users className="h-4 w-4 text-neutral-500" />,
  task_status_changed: <Activity className="h-4 w-4 text-brand-600" />,
  document_uploaded: <FileText className="h-4 w-4 text-success" />,
  document_requested: <FileText className="h-4 w-4 text-warning" />,
  document_approved: <CheckCircle2 className="h-4 w-4 text-success" />,
  client_added: <Users className="h-4 w-4 text-brand-600" />,
  reminder_sent: <Activity className="h-4 w-4 text-info" />,
  ai_recommendation: <Sparkles className="h-4 w-4 text-brand-600" />,
  ai_flagged: <AlertTriangle className="h-4 w-4 text-danger" />,
};

function formatTimestamp(ts: string): string {
  const date = new Date(ts);
  const now = new Date("2025-08-22T12:00:00");
  const diffMs = now.getTime() - date.getTime();
  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffHrs < 1) return "Just now";
  if (diffHrs < 24) return `${diffHrs}h ago`;
  if (diffDays === 1) return "Yesterday";
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

function groupByDate(items: typeof activities) {
  const groups: Record<string, typeof activities> = {};
  items.forEach((a) => {
    const date = new Date(a.timestamp).toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    if (!groups[date]) groups[date] = [];
    groups[date].push(a);
  });
  return groups;
}

export default function ActivityPage() {
  const [filter, setFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    let result = [...activities];
    if (filter === "ai") result = result.filter((a) => a.isAI);
    if (filter === "tasks") result = result.filter((a) => a.action.startsWith("task_"));
    if (filter === "documents") result = result.filter((a) => a.action.startsWith("document_"));
    return result.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [filter]);

  const grouped = useMemo(() => groupByDate(filtered), [filtered]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Activity Feed</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Complete audit trail of all actions across your firm
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-1.5 mb-6 overflow-x-auto pb-1">
        {[
          { key: "all", label: "All Activity" },
          { key: "tasks", label: "Tasks" },
          { key: "documents", label: "Documents" },
          { key: "ai", label: "AI Actions" },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap border",
              filter === f.key
                ? "bg-brand-50 text-brand-700 border-brand-200"
                : "bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Activity className="h-7 w-7" />}
          title="No activity yet"
          description="Activity will appear as your team completes tasks, uploads documents, and manages clients."
        />
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([date, items]) => (
            <div key={date}>
              <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3 px-1">
                {date}
              </h3>
              <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
                <div className="divide-y divide-neutral-100">
                  {items.map((activity) => (
                    <div
                      key={activity.id}
                      className="px-4 sm:px-5 py-3.5 hover:bg-neutral-50/50 transition-colors flex items-start gap-3"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 shrink-0 mt-0.5">
                        {actionIcons[activity.action] || <Activity className="h-4 w-4 text-neutral-400" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-neutral-700 leading-relaxed">
                          <span className="font-medium text-neutral-900">{activity.userName}</span>
                          {activity.isAI && (
                            <Sparkles className="h-3 w-3 text-brand-400 inline mx-0.5 -mt-0.5" />
                          )}{" "}
                          {activity.description}{" "}
                          <span className="font-medium text-neutral-900">{activity.clientName}</span>
                        </p>
                        <p className="text-[11px] text-neutral-400 mt-0.5">
                          {formatTimestamp(activity.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
