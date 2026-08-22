"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  Calendar,
  ChevronDown,
  MoreHorizontal,
  X,
  Send,
  Loader2,
  Target,
  Bell,
  Eye,
  Edit3,
  Trash2,
  ArrowUpRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTasks, useClients } from "@/lib/hooks/use-data";
import { complianceTasks, clients } from "@/lib/data/mock-data";
import {
  TaskStatusBadge,
  PriorityBadge,
  CategoryBadge,
} from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { ConfirmDialog } from "@/components/ui/Dialog";
import { useToast } from "@/components/ui/Toast";

function daysUntil(dateStr: string): number {
  const now = new Date("2025-08-22");
  const due = new Date(dateStr);
  return Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

const quickFilters = [
  { key: "", label: "All Tasks", count: null },
  { key: "overdue", label: "Overdue", icon: AlertTriangle, color: "text-danger" },
  { key: "today", label: "Due Today", icon: Clock, color: "text-warning" },
  { key: "this_week", label: "This Week", icon: Calendar, color: "text-brand-600" },
  { key: "waiting", label: "Waiting for Client", icon: FileText, color: "text-warning" },
  { key: "high_priority", label: "High Priority", icon: Target, color: "text-danger" },
  { key: "completed", label: "Completed", icon: CheckCircle2, color: "text-success" },
];

const statusOptions = [
  { value: "", label: "All Statuses" },
  { value: "not_started", label: "Not Started" },
  { value: "in_progress", label: "In Progress" },
  { value: "awaiting_documents", label: "Awaiting Documents" },
  { value: "under_review", label: "Under Review" },
  { value: "completed", label: "Completed" },
  { value: "overdue", label: "Overdue" },
];

const priorityOptions = [
  { value: "", label: "All Priorities" },
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" },
];

const categoryOptions = [
  { value: "", label: "All Categories" },
  { value: "gst", label: "GST" },
  { value: "income_tax", label: "Income Tax" },
  { value: "tds", label: "TDS" },
  { value: "roc", label: "ROC" },
  { value: "audit", label: "Audit" },
  { value: "kyc", label: "KYC" },
  { value: "financial_statements", label: "Financial Statements" },
];

/* ─── Create Task Modal ─── */

function CreateTaskModal({
  open,
  onClose,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [form, setForm] = useState({
    clientId: "",
    title: "",
    description: "",
    category: "",
    priority: "medium",
    dueDate: "",
    financialYear: "2025-26",
    period: "",
    documentRequired: false,
    documentsTotal: 0,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!form.clientId) newErrors.clientId = "Select a client";
    if (!form.title.trim()) newErrors.title = "Title is required";
    if (!form.category) newErrors.category = "Select a category";
    if (!form.dueDate) newErrors.dueDate = "Due date is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));
    setSubmitting(false);
    onSuccess();
    onClose();
  };

  const updateField = (field: string, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-neutral-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg bg-white rounded-xl border border-neutral-200 shadow-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
          <h2 className="text-lg font-semibold text-neutral-900">Create Task</h2>
          <button onClick={onClose} className="p-1 rounded-md text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Client */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Client *</label>
            <select
              value={form.clientId}
              onChange={(e) => updateField("clientId", e.target.value)}
              className={cn(
                "w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-brand-500",
                errors.clientId ? "border-danger" : "border-neutral-300"
              )}
            >
              <option value="">Select a client</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            {errors.clientId && <p className="text-xs text-danger mt-1">{errors.clientId}</p>}
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => updateField("title", e.target.value)}
              placeholder="e.g. GST 3B Filing — August 2025"
              className={cn(
                "w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-500",
                errors.title ? "border-danger" : "border-neutral-300"
              )}
            />
            {errors.title && <p className="text-xs text-danger mt-1">{errors.title}</p>}
          </div>

          {/* Category + Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Category *</label>
              <select
                value={form.category}
                onChange={(e) => updateField("category", e.target.value)}
                className={cn(
                  "w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-brand-500",
                  errors.category ? "border-danger" : "border-neutral-300"
                )}
              >
                <option value="">Select</option>
                {categoryOptions.filter((o) => o.value).map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              {errors.category && <p className="text-xs text-danger mt-1">{errors.category}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Priority</label>
              <select
                value={form.priority}
                onChange={(e) => updateField("priority", e.target.value)}
                className="w-full rounded-lg border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                {priorityOptions.filter((o) => o.value).map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Due Date + FY */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Due Date *</label>
              <input
                type="date"
                value={form.dueDate}
                onChange={(e) => updateField("dueDate", e.target.value)}
                className={cn(
                  "w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-brand-500",
                  errors.dueDate ? "border-danger" : "border-neutral-300"
                )}
              />
              {errors.dueDate && <p className="text-xs text-danger mt-1">{errors.dueDate}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Financial Year</label>
              <input
                type="text"
                value={form.financialYear}
                onChange={(e) => updateField("financialYear", e.target.value)}
                placeholder="2025-26"
                className="w-full rounded-lg border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder="Optional details about this task..."
              rows={2}
              className="w-full rounded-lg border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
            />
          </div>

          {/* Document toggle */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.documentRequired}
              onChange={(e) => updateField("documentRequired", e.target.checked)}
              className="h-4 w-4 rounded border-neutral-300 text-brand-600 focus:ring-brand-500"
            />
            <span className="text-sm text-neutral-700">Requires documents from client</span>
          </label>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-neutral-700 rounded-lg border border-neutral-300 hover:bg-neutral-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-brand-600 text-white hover:bg-brand-700 transition-colors disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Create Task
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─── Main Tasks Page ─── */

export default function TasksPage() {
  const [search, setSearch] = useState("");
  const [quickFilter, setQuickFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [sortBy, setSortBy] = useState<"dueDate" | "priority" | "client">("dueDate");
  const [confirmStatus, setConfirmStatus] = useState<{ id: string; status: string } | null>(null);

  const { tasks } = useTasks({
    search,
    status: statusFilter || undefined,
    priority: priorityFilter || undefined,
    category: categoryFilter || undefined,
    filter: quickFilter || undefined,
  });

  const sortedTasks = useMemo(() => {
    const sorted = [...tasks];
    const pOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
    sorted.sort((a, b) => {
      if (sortBy === "dueDate") return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      if (sortBy === "priority") return (pOrder[a.priority] ?? 4) - (pOrder[b.priority] ?? 4);
      return a.clientName.localeCompare(b.clientName);
    });
    return sorted;
  }, [tasks, sortBy]);

  const taskCounts = useMemo(() => ({
    all: complianceTasks.filter((t) => t.status !== "completed").length,
    overdue: complianceTasks.filter((t) => t.status === "overdue").length,
    today: complianceTasks.filter((t) => t.dueDate === "2025-08-22" && t.status !== "completed").length,
    thisWeek: complianceTasks.filter((t) => {
      const d = daysUntil(t.dueDate);
      return d >= 0 && d <= 7 && t.status !== "completed";
    }).length,
    waiting: complianceTasks.filter((t) => t.status === "awaiting_documents").length,
    highPriority: complianceTasks.filter((t) => (t.priority === "high" || t.priority === "urgent") && t.status !== "completed").length,
    completed: complianceTasks.filter((t) => t.status === "completed").length,
  }), []);

  const handleStatusChange = useCallback((taskId: string, newStatus: string) => {
    setConfirmStatus({ id: taskId, status: newStatus });
  }, []);

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Compliance Tasks</h1>
          <p className="text-sm text-neutral-500 mt-1">
            {taskCounts.overdue > 0 && (
              <span className="text-danger font-medium">{taskCounts.overdue} overdue</span>
            )}
            {taskCounts.overdue > 0 && " · "}
            {taskCounts.all} active tasks
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-brand-700 shrink-0"
        >
          <Plus className="h-4 w-4" />
          Create Task
        </button>
      </div>

      {/* Quick Filters */}
      <div className="flex gap-1.5 mb-4 overflow-x-auto pb-1 scrollbar-none">
        {quickFilters.map((f) => {
          const count = f.key ? taskCounts[f.key as keyof typeof taskCounts] : null;
          return (
            <button
              key={f.key}
              onClick={() => {
                setQuickFilter(f.key);
                setStatusFilter("");
              }}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap border",
                quickFilter === f.key
                  ? "bg-brand-50 text-brand-700 border-brand-200"
                  : "bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50"
              )}
            >
              {f.icon && <f.icon className={cn("h-3.5 w-3.5", f.color)} />}
              {f.label}
              {count !== null && count > 0 && (
                <span
                  className={cn(
                    "text-[10px] px-1.5 py-0.5 rounded-full font-bold",
                    f.color === "text-danger" ? "bg-danger/10 text-danger" : "bg-neutral-100 text-neutral-500"
                  )}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Search + Advanced Filters */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-neutral-200 bg-white pl-10 pr-4 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
          />
        </div>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={cn(
            "inline-flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors",
            showAdvanced
              ? "border-brand-200 bg-brand-50 text-brand-700"
              : "border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50"
          )}
        >
          <Filter className="h-4 w-4" />
          <span className="hidden sm:inline">Filters</span>
        </button>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          <option value="dueDate">Sort: Due Date</option>
          <option value="priority">Sort: Priority</option>
          <option value="client">Sort: Client</option>
        </select>
      </div>

      {showAdvanced && (
        <div className="flex flex-wrap gap-3 p-4 bg-white rounded-xl border border-neutral-200 mb-4">
          <div>
            <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block mb-1.5">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setQuickFilter(""); }}
              className="rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              {statusOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block mb-1.5">Priority</label>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              {priorityOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block mb-1.5">Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              {categoryOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Task List */}
      {sortedTasks.length === 0 ? (
        <EmptyState
          icon={<CheckCircle2 className="h-7 w-7" />}
          title={
            search || quickFilter || statusFilter || priorityFilter || categoryFilter
              ? "No tasks match your filters"
              : "No tasks yet"
          }
          description={
            search || quickFilter || statusFilter || priorityFilter || categoryFilter
              ? "Try adjusting your search or filter criteria."
              : "Create the first compliance task to start tracking."
          }
          action={
            search || quickFilter || statusFilter || priorityFilter || categoryFilter ? (
              <button
                onClick={() => {
                  setSearch("");
                  setQuickFilter("");
                  setStatusFilter("");
                  setPriorityFilter("");
                  setCategoryFilter("");
                }}
                className="text-sm font-medium text-brand-600 hover:text-brand-700"
              >
                Clear all filters
              </button>
            ) : (
              <button
                onClick={() => setShowCreate(true)}
                className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
              >
                <Plus className="h-4 w-4" />
                Create Task
              </button>
            )
          }
        />
      ) : (
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
          <div className="divide-y divide-neutral-100">
            {sortedTasks.map((task) => {
              const days = daysUntil(task.dueDate);
              const docProgress =
                task.documentRequired && task.documentsTotal > 0
                  ? (task.documentsUploaded / task.documentsTotal) * 100
                  : 0;

              return (
                <div
                  key={task.id}
                  className="px-4 sm:px-5 py-4 hover:bg-neutral-50/50 transition-colors group"
                >
                  <div className="flex items-start gap-3">
                    {/* Quick status toggle */}
                    <button
                      onClick={() =>
                        handleStatusChange(
                          task.id,
                          task.status === "completed" ? "not_started" : "completed"
                        )
                      }
                      className={cn(
                        "mt-0.5 h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors",
                        task.status === "completed"
                          ? "bg-success border-success text-white"
                          : "border-neutral-300 hover:border-brand-500"
                      )}
                      title={task.status === "completed" ? "Mark incomplete" : "Mark complete"}
                    >
                      {task.status === "completed" && (
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      )}
                    </button>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p
                            className={cn(
                              "text-sm font-medium",
                              task.status === "completed"
                                ? "text-neutral-400 line-through"
                                : "text-neutral-900"
                            )}
                          >
                            {task.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <Link
                              href={`/app/clients/${task.clientId}`}
                              className="text-xs text-neutral-500 hover:text-brand-600 transition-colors"
                            >
                              {task.clientName}
                            </Link>
                            <CategoryBadge category={task.category} />
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <PriorityBadge priority={task.priority} />
                          <TaskStatusBadge status={task.status} />
                        </div>
                      </div>

                      {/* Document progress */}
                      {task.documentRequired && task.documentsTotal > 0 && (
                        <div className="mt-2.5 max-w-xs">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[11px] text-neutral-500">Documents</span>
                            <span className="text-[11px] text-neutral-500">
                              {task.documentsUploaded}/{task.documentsTotal}
                            </span>
                          </div>
                          <div className="h-1 bg-neutral-100 rounded-full overflow-hidden">
                            <div
                              className={cn(
                                "h-full rounded-full transition-all",
                                docProgress === 100
                                  ? "bg-success"
                                  : docProgress >= 50
                                  ? "bg-brand-500"
                                  : "bg-warning"
                              )}
                              style={{ width: `${docProgress}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Due date + assignee + actions */}
                      <div className="flex items-center justify-between mt-2.5">
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              "text-xs font-medium",
                              days < 0 ? "text-danger" : days <= 3 ? "text-danger" : days <= 7 ? "text-warning" : "text-neutral-500"
                            )}
                          >
                            {days < 0
                              ? `${Math.abs(days)}d overdue`
                              : days === 0
                              ? "Due today"
                              : days === 1
                              ? "Due tomorrow"
                              : `Due in ${days}d`}
                          </span>
                          <span className="text-neutral-300">·</span>
                          <span className="text-xs text-neutral-400">{task.assignedTo}</span>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {task.status !== "completed" && (
                            <button
                              onClick={() => handleStatusChange(task.id, "in_progress")}
                              className="p-1.5 rounded text-neutral-400 hover:text-brand-600 hover:bg-brand-50 transition-colors"
                              title="Start task"
                            >
                              <Clock className="h-3.5 w-3.5" />
                            </button>
                          )}
                          <button
                            className="p-1.5 rounded text-neutral-400 hover:text-brand-600 hover:bg-brand-50 transition-colors"
                            title="View details"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Create Task Modal */}
      <CreateTaskModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onSuccess={() => {}}
      />

      {/* Status Change Confirmation */}
      <ConfirmDialog
        open={!!confirmStatus}
        onClose={() => setConfirmStatus(null)}
        onConfirm={() => {
          if (confirmStatus) {
            const task = complianceTasks.find((t) => t.id === confirmStatus.id);
            // In real app, this would call the API
            setConfirmStatus(null);
          }
        }}
        title="Update Task Status"
        description={`Mark this task as ${confirmStatus?.status?.replace(/_/g, " ")}?`}
        confirmLabel="Update"
      />
    </div>
  );
}
