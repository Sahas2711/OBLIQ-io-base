"use client";

import { useState, use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  CreditCard,
  Users,
  FileText,
  Clock,
  Activity,
  StickyNote,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Send,
  Calendar,
  Edit3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useClientDetail } from "@/lib/hooks/use-data";
import { TaskStatusBadge, PriorityBadge, CategoryBadge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";

function daysUntil(dateStr: string): number {
  const now = new Date("2025-08-22");
  const due = new Date(dateStr);
  return Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

const tabs = [
  { key: "overview", label: "Overview", icon: Building2 },
  { key: "tasks", label: "Tasks", icon: CheckCircle2 },
  { key: "documents", label: "Documents", icon: FileText },
  { key: "activity", label: "Activity", icon: Activity },
  { key: "notes", label: "Notes", icon: StickyNote },
];

const statusStyles: Record<string, { bg: string; text: string; dot: string }> = {
  active: { bg: "bg-success-light", text: "text-success", dot: "bg-success" },
  inactive: { bg: "bg-neutral-100", text: "text-neutral-500", dot: "bg-neutral-400" },
  onboarding: { bg: "bg-brand-50", text: "text-brand-700", dot: "bg-brand-500" },
};

const docStatusStyles: Record<string, { bg: string; text: string }> = {
  requested: { bg: "bg-warning-light", text: "text-warning" },
  uploaded: { bg: "bg-brand-50", text: "text-brand-700" },
  approved: { bg: "bg-success-light", text: "text-success" },
  rejected: { bg: "bg-danger-light", text: "text-danger" },
};

export default function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [activeTab, setActiveTab] = useState("overview");
  const [noteText, setNoteText] = useState("");

  const { client, tasks, documents, activities, loading } = useClientDetail(id);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-6 w-6 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!client) {
    return (
      <div>
        <Link href="/app/clients" className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 mb-4">
          <ArrowLeft className="h-4 w-4" /> Back to clients
        </Link>
        <EmptyState
          icon={<Building2 className="h-7 w-7" />}
          title="Client not found"
          description="This client may have been removed or you don't have access."
          action={
            <Link href="/app/clients" className="text-sm font-medium text-brand-600 hover:text-brand-700">
              Go back to clients
            </Link>
          }
        />
      </div>
    );
  }

  const ss = statusStyles[client.status] || statusStyles.active;
  const overdueTasks = tasks.filter((t) => t.status === "overdue");
  const pendingDocs = documents.filter((d) => d.status === "requested");

  return (
    <div>
      {/* Back link */}
      <Link
        href="/app/clients"
        className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 mb-4 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to clients
      </Link>

      {/* Client Header */}
      <div className="bg-white rounded-xl border border-neutral-200 p-5 sm:p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="h-14 w-14 rounded-xl bg-brand-50 flex items-center justify-center shrink-0">
              <span className="text-lg font-bold text-brand-700">
                {client.name
                  .split(" ")
                  .slice(0, 2)
                  .map((w) => w[0])
                  .join("")}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-xl font-bold text-neutral-900">{client.name}</h1>
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium",
                    ss.bg,
                    ss.text
                  )}
                >
                  <span className={cn("h-1.5 w-1.5 rounded-full", ss.dot)} />
                  {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                </span>
              </div>
              <p className="text-sm text-neutral-500 mt-1 capitalize">
                {client.entityType}
                {client.firmName && ` · ${client.firmName}`}
              </p>
            </div>
          </div>
          <button className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 px-3.5 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors shrink-0">
            <Edit3 className="h-4 w-4" />
            Edit Client
          </button>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-5 border-t border-neutral-200">
          <div className="text-center sm:text-left">
            <p className="text-2xl font-bold text-neutral-900">{tasks.length}</p>
            <p className="text-xs text-neutral-500">Total Tasks</p>
          </div>
          <div className="text-center sm:text-left">
            <p className="text-2xl font-bold text-danger">{overdueTasks.length}</p>
            <p className="text-xs text-neutral-500">Overdue</p>
          </div>
          <div className="text-center sm:text-left">
            <p className="text-2xl font-bold text-warning">{pendingDocs.length}</p>
            <p className="text-xs text-neutral-500">Pending Docs</p>
          </div>
          <div className="text-center sm:text-left">
            <p className="text-2xl font-bold text-neutral-900">
              {tasks.filter((t) => t.status === "completed").length}
            </p>
            <p className="text-xs text-neutral-500">Completed</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 overflow-x-auto pb-1 scrollbar-none border-b border-neutral-200">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
              activeTab === tab.key
                ? "border-brand-600 text-brand-700"
                : "border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300"
            )}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
            {tab.key === "tasks" && (
              <span className="text-[11px] bg-neutral-100 text-neutral-500 px-1.5 py-0.5 rounded-full">
                {tasks.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Contact Details */}
          <div className="bg-white rounded-xl border border-neutral-200 p-5">
            <h3 className="text-sm font-semibold text-neutral-900 mb-4">Contact Details</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-neutral-400 shrink-0" />
                <span className="text-neutral-900">{client.email || "No email"}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-neutral-400 shrink-0" />
                <span className="text-neutral-900">{client.phone || "No phone"}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <CreditCard className="h-4 w-4 text-neutral-400 shrink-0" />
                <span className="text-neutral-900">{client.pan || "No PAN"}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Users className="h-4 w-4 text-neutral-400 shrink-0" />
                <span className="text-neutral-900">{client.assignedTo}</span>
              </div>
            </div>
          </div>

          {/* Compliance Health */}
          <div className="bg-white rounded-xl border border-neutral-200 p-5">
            <h3 className="text-sm font-semibold text-neutral-900 mb-4">Compliance Health</h3>
            <div className="space-y-3">
              {client.complianceTypes.map((type) => (
                <div key={type} className="flex items-center justify-between">
                  <span className="text-sm text-neutral-700 capitalize">{type.replace(/_/g, " ")}</span>
                  <span className="text-xs font-medium text-success">Active</span>
                </div>
              ))}
              {client.complianceTypes.length === 0 && (
                <p className="text-sm text-neutral-500">No compliance types assigned</p>
              )}
            </div>
          </div>

          {/* Upcoming Deadlines */}
          <div className="bg-white rounded-xl border border-neutral-200 p-5 lg:col-span-2">
            <h3 className="text-sm font-semibold text-neutral-900 mb-4">Upcoming Deadlines</h3>
            {tasks.filter((t) => t.status !== "completed").length === 0 ? (
              <p className="text-sm text-neutral-500">No upcoming deadlines</p>
            ) : (
              <div className="space-y-2">
                {tasks
                  .filter((t) => t.status !== "completed")
                  .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                  .slice(0, 5)
                  .map((task) => {
                    const days = daysUntil(task.dueDate);
                    return (
                      <div key={task.id} className="flex items-center gap-3 py-2">
                        <Calendar className="h-4 w-4 text-neutral-400 shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-neutral-900 truncate">{task.title}</p>
                        </div>
                        <CategoryBadge category={task.category} />
                        <TaskStatusBadge status={task.status} />
                        <span
                          className={cn(
                            "text-xs font-medium shrink-0",
                            days < 0 ? "text-danger" : days <= 3 ? "text-danger" : days <= 7 ? "text-warning" : "text-neutral-500"
                          )}
                        >
                          {days < 0 ? `${Math.abs(days)}d overdue` : days === 0 ? "Today" : `${days}d`}
                        </span>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "tasks" && (
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
          {tasks.length === 0 ? (
            <div className="p-12">
              <EmptyState
                icon={<CheckCircle2 className="h-7 w-7" />}
                title="No tasks for this client"
                description="Create the first compliance task to get started."
                action={
                  <Link
                    href="/app/tasks"
                    className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
                  >
                    <Plus className="h-4 w-4" />
                    Create Task
                  </Link>
                }
              />
            </div>
          ) : (
            <div className="divide-y divide-neutral-100">
              {tasks.map((task) => {
                const days = daysUntil(task.dueDate);
                return (
                  <div key={task.id} className="px-5 py-4 hover:bg-neutral-50/50 transition-colors">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-neutral-900">{task.title}</p>
                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                          <CategoryBadge category={task.category} />
                          <PriorityBadge priority={task.priority} />
                          <span className="text-xs text-neutral-400">·</span>
                          <span className="text-xs text-neutral-500">{task.assignedTo}</span>
                        </div>
                        {task.documentRequired && task.documentsTotal > 0 && (
                          <div className="mt-2 max-w-xs">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[11px] text-neutral-500">Documents</span>
                              <span className="text-[11px] text-neutral-500">
                                {task.documentsUploaded}/{task.documentsTotal}
                              </span>
                            </div>
                            <div className="h-1 bg-neutral-100 rounded-full overflow-hidden">
                              <div
                                className={cn(
                                  "h-full rounded-full",
                                  task.documentsUploaded === task.documentsTotal
                                    ? "bg-success"
                                    : "bg-brand-500"
                                )}
                                style={{
                                  width: `${(task.documentsUploaded / task.documentsTotal) * 100}%`,
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <TaskStatusBadge status={task.status} />
                        <span
                          className={cn(
                            "text-xs font-medium",
                            days < 0 ? "text-danger" : days <= 3 ? "text-danger" : "text-neutral-500"
                          )}
                        >
                          {days < 0 ? `${Math.abs(days)}d overdue` : `Due ${task.dueDate}`}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {activeTab === "documents" && (
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
          {documents.length === 0 ? (
            <div className="p-12">
              <EmptyState
                icon={<FileText className="h-7 w-7" />}
                title="No documents yet"
                description="Request or upload documents for this client."
                action={
                  <button className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700">
                    <Send className="h-4 w-4" />
                    Request Documents
                  </button>
                }
              />
            </div>
          ) : (
            <div className="divide-y divide-neutral-100">
              {documents.map((doc) => {
                const ds = docStatusStyles[doc.status] || docStatusStyles.requested;
                return (
                  <div key={doc.id} className="px-5 py-3.5 hover:bg-neutral-50/50 transition-colors flex items-center gap-4">
                    <FileText className="h-4 w-4 text-neutral-400 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-neutral-900 truncate">{doc.name}</p>
                      <p className="text-xs text-neutral-500">
                        {doc.type} {doc.size && `· ${doc.size}`}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium",
                        ds.bg,
                        ds.text
                      )}
                    >
                      {doc.status}
                    </span>
                    <span className="text-xs text-neutral-500 shrink-0">Due {doc.dueDate}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {activeTab === "activity" && (
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
          {activities.length === 0 ? (
            <div className="p-12">
              <EmptyState
                icon={<Activity className="h-7 w-7" />}
                title="No activity yet"
                description="Activity will appear as tasks are completed and documents are managed."
              />
            </div>
          ) : (
            <div className="divide-y divide-neutral-100">
              {activities.map((activity) => (
                <div key={activity.id} className="px-5 py-3.5 hover:bg-neutral-50/50 transition-colors">
                  <p className="text-sm text-neutral-700">
                    <span className="font-medium text-neutral-900">{activity.userName}</span>
                    {activity.isAI && (
                      <span className="inline-flex items-center gap-0.5 ml-1 text-[10px] font-medium text-brand-600 bg-brand-50 px-1.5 py-0.5 rounded-full">
                        AI
                      </span>
                    )}{" "}
                    {activity.description}{" "}
                    <span className="font-medium text-neutral-900">{activity.clientName}</span>
                  </p>
                  <p className="text-[11px] text-neutral-400 mt-0.5">
                    {new Date(activity.timestamp).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "notes" && (
        <div className="bg-white rounded-xl border border-neutral-200 p-5">
          <h3 className="text-sm font-semibold text-neutral-900 mb-4">Client Notes</h3>
          <div className="flex gap-3">
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Add a note about this client..."
              rows={3}
              className="flex-1 rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 resize-none"
            />
            <button
              disabled={!noteText.trim()}
              className="self-end inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-6 text-center py-8 text-neutral-500">
            <StickyNote className="h-8 w-8 mx-auto mb-2 text-neutral-300" />
            <p className="text-sm">No notes yet. Add the first note above.</p>
          </div>
        </div>
      )}
    </div>
  );
}
