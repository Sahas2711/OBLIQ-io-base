"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  Users,
  FileText,
  ArrowUpRight,
  Sparkles,
  Calendar,
  Bell,
  TrendingUp,
  ArrowRight,
  AlertCircle,
  Target,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  complianceTasks,
  activities,
  documents,
  complianceCalendar,
  aiRecommendations,
  clients,
} from "@/lib/data/mock-data";
import { TaskStatusBadge, PriorityBadge, CategoryBadge } from "@/components/ui/Badge";
import { ConfirmDialog } from "@/components/ui/Dialog";
import { useToast } from "@/components/ui/Toast";

/* ─── Helpers ─── */

function daysUntil(dateStr: string): number {
  const now = new Date("2025-08-22");
  const due = new Date(dateStr);
  return Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

function formatRelativeTime(dateStr: string): string {
  const now = new Date("2025-08-22T12:00:00");
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffHrs < 1) return "Just now";
  if (diffHrs < 24) return `${diffHrs}h ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

const categoryColors: Record<string, string> = {
  gst: "bg-brand-100 text-brand-700",
  income_tax: "bg-success-light text-success",
  tds: "bg-warning-light text-warning",
  roc: "bg-danger-light text-danger",
  audit: "bg-neutral-100 text-neutral-700",
  kyc: "bg-neutral-100 text-neutral-600",
  financial_statements: "bg-brand-50 text-brand-600",
};

const priorityDot: Record<string, string> = {
  low: "bg-neutral-400",
  medium: "bg-brand-500",
  high: "bg-warning",
  urgent: "bg-danger",
};

/* ─── KPI Data ─── */

function getKPIData() {
  const activeClients = clients.filter((c) => c.status === "active").length;
  const tasksThisWeek = complianceTasks.filter((t) => {
    const days = daysUntil(t.dueDate);
    return days >= 0 && days <= 7 && t.status !== "completed";
  }).length;
  const pendingDocs = documents.filter((d) => d.status === "requested").length;
  const overdue = complianceTasks.filter((t) => t.status === "overdue").length;

  return [
    {
      label: "Active Clients",
      value: activeClients,
      change: "+2 this month",
      changeType: "positive" as const,
      icon: <Users className="h-4 w-4" />,
      color: "text-brand-600",
      bgColor: "bg-brand-100",
    },
    {
      label: "Due This Week",
      value: tasksThisWeek,
      change: `${tasksThisWeek} need attention`,
      changeType: tasksThisWeek > 5 ? "negative" : ("neutral" as const),
      icon: <Clock className="h-4 w-4" />,
      color: "text-warning",
      bgColor: "bg-warning-light",
    },
    {
      label: "Pending Documents",
      value: pendingDocs,
      change: "Across 8 clients",
      changeType: "neutral" as const,
      icon: <FileText className="h-4 w-4" />,
      color: "text-info",
      bgColor: "bg-brand-50",
    },
    {
      label: "Overdue Items",
      value: overdue,
      change: overdue > 0 ? "Needs immediate action" : "All on track",
      changeType: overdue > 0 ? "negative" : ("positive" as const),
      icon: <AlertTriangle className="h-4 w-4" />,
      color: overdue > 0 ? "text-danger" : "text-success",
      bgColor: overdue > 0 ? "bg-danger-light" : "bg-success-light",
    },
  ];
}

/* ─── Calendar Helpers ─── */

function getCalendarWeeks() {
  const now = new Date("2025-08-22");
  const weeks: { date: number; isToday: boolean; events: typeof complianceCalendar }[][] = [];
  let currentWeek: { date: number; isToday: boolean; events: typeof complianceCalendar }[] = [];

  // Start from Aug 18 (Monday of current week)
  const start = new Date(2025, 7, 18);
  for (let i = 0; i < 42; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const dateStr = d.toISOString().split("T")[0];
    const events = complianceCalendar.filter((e) => e.date === dateStr);
    currentWeek.push({
      date: d.getDate(),
      isToday: dateStr === "2025-08-22",
      events,
    });
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }
  return weeks;
}

/* ─── Dashboard Page ─── */

export default function DashboardPage() {
  const { toast } = useToast();
  const [taskFilter, setTaskFilter] = useState<string>("all");
  const [taskSortBy, setTaskSortBy] = useState<"dueDate" | "priority" | "client">("dueDate");
  const [confirmAction, setConfirmAction] = useState<{
    taskId: string;
    newStatus: string;
  } | null>(null);

  const kpis = getKPIData();
  const calendarWeeks = getCalendarWeeks();

  // Filtered & sorted tasks
  const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };

  const filteredTasks = useMemo(() => {
    let tasks = complianceTasks.filter((t) => t.status !== "completed");

    if (taskFilter !== "all") {
      tasks = tasks.filter((t) => t.status === taskFilter);
    }

    tasks.sort((a, b) => {
      if (taskSortBy === "dueDate") return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      if (taskSortBy === "priority") return (priorityOrder[a.priority] ?? 4) - (priorityOrder[b.priority] ?? 4);
      return a.clientName.localeCompare(b.clientName);
    });

    return tasks;
  }, [taskFilter, taskSortBy]);

  const handleStatusChange = useCallback((taskId: string, newStatus: string) => {
    setConfirmAction({ taskId, newStatus });
  }, []);

  const confirmStatusChange = useCallback(() => {
    if (!confirmAction) return;
    const task = complianceTasks.find((t) => t.id === confirmAction.taskId);
    toast({
      message: `Task "${task?.title}" marked as ${confirmAction.newStatus.replace("_", " ")}`,
      type: "success",
    });
    setConfirmAction(null);
  }, [confirmAction, toast]);

  const handleReminder = useCallback((clientName: string) => {
    toast({
      message: `Reminder queued for ${clientName}. Will be sent during next business hour.`,
      type: "info",
    });
  }, [toast]);

  const taskCounts = useMemo(() => ({
    all: complianceTasks.filter((t) => t.status !== "completed").length,
    overdue: complianceTasks.filter((t) => t.status === "overdue").length,
    in_progress: complianceTasks.filter((t) => t.status === "in_progress").length,
    awaiting_documents: complianceTasks.filter((t) => t.status === "awaiting_documents").length,
    not_started: complianceTasks.filter((t) => t.status === "not_started").length,
  }), []);

  return (
    <div>
      {/* ─── 1. Greeting / Header ─── */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl font-bold text-neutral-900">
          Good afternoon, Rajesh
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          FY 2025-26 · Q2 Compliance Overview · {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </p>
      </div>

      {/* ─── 2. KPI Cards ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="bg-white rounded-xl border border-neutral-200 p-4 sm:p-5 hover:shadow-[var(--shadow-card-hover)] transition-shadow"
          >
            <div className="flex items-center gap-2 mb-3">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-lg",
                  kpi.bgColor,
                  kpi.color
                )}
              >
                {kpi.icon}
              </div>
              <span className="text-xs sm:text-sm font-medium text-neutral-500">
                {kpi.label}
              </span>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-neutral-900">
              {kpi.value}
            </p>
            <p
              className={cn(
                "text-xs mt-1",
                kpi.changeType === "positive" && "text-success",
                kpi.changeType === "negative" && "text-danger",
                kpi.changeType === "neutral" && "text-neutral-500"
              )}
            >
              {kpi.change}
            </p>
          </div>
        ))}
      </div>

      {/* ─── 3. Compliance Timeline / Calendar ─── */}
      <div className="bg-white rounded-xl border border-neutral-200 mb-6 sm:mb-8 overflow-hidden">
        <div className="px-4 sm:px-5 py-3.5 sm:py-4 border-b border-neutral-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-neutral-400" />
            <h2 className="text-sm font-semibold text-neutral-900">
              Compliance Calendar
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex gap-2 text-[11px]">
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-brand-500" />
                GST
              </span>
              <span className="flex items-center gap-1 hidden sm:flex">
                <span className="h-2 w-2 rounded-full bg-success" />
                ITR
              </span>
              <span className="flex items-center gap-1 hidden sm:flex">
                <span className="h-2 w-2 rounded-full bg-warning" />
                TDS
              </span>
              <span className="flex items-center gap-1 hidden sm:flex">
                <span className="h-2 w-2 rounded-full bg-danger" />
                ROC
              </span>
            </div>
          </div>
        </div>

        {/* Mini calendar grid */}
        <div className="p-4 sm:p-5">
          <div className="grid grid-cols-7 gap-px text-center mb-2">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
              <div key={day} className="text-[11px] font-medium text-neutral-400 py-1">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-px">
            {calendarWeeks.flat().map((day, i) => (
              <div
                key={i}
                className={cn(
                  "min-h-[40px] sm:min-h-[52px] p-1 rounded-md text-xs",
                  day.isToday
                    ? "bg-brand-50 ring-1 ring-brand-200"
                    : "hover:bg-neutral-50"
                )}
              >
                <span
                  className={cn(
                    "font-medium",
                    day.isToday ? "text-brand-700" : "text-neutral-700"
                  )}
                >
                  {day.date}
                </span>
                <div className="mt-0.5 space-y-0.5">
                  {day.events.slice(0, 2).map((evt) => (
                    <div
                      key={evt.id}
                      className={cn(
                        "text-[9px] sm:text-[10px] font-medium px-1 py-0.5 rounded truncate",
                        categoryColors[evt.category]
                      )}
                      title={`${evt.title} (${evt.clientCount} clients)`}
                    >
                      <span className="hidden sm:inline">{evt.title}</span>
                      <span className="sm:hidden">{evt.category.toUpperCase().slice(0, 3)}</span>
                    </div>
                  ))}
                  {day.events.length > 2 && (
                    <div className="text-[9px] text-neutral-400 font-medium">
                      +{day.events.length - 2}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming deadlines strip */}
        <div className="px-4 sm:px-5 py-3 border-t border-neutral-200 bg-neutral-50/50">
          <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-[11px] font-semibold text-neutral-500 shrink-0">
              Upcoming:
            </span>
            {complianceCalendar
              .filter((e) => e.isDeadline)
              .slice(0, 5)
              .map((evt) => {
                const days = daysUntil(evt.date);
                return (
                  <span
                    key={evt.id}
                    className={cn(
                      "inline-flex items-center gap-1.5 shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium border",
                      days <= 3
                        ? "bg-danger-light text-danger border-danger/20"
                        : days <= 7
                        ? "bg-warning-light text-warning border-warning/20"
                        : "bg-white text-neutral-600 border-neutral-200"
                    )}
                  >
                    <span className={cn("h-1.5 w-1.5 rounded-full", days <= 3 ? "bg-danger" : days <= 7 ? "bg-warning" : "bg-neutral-400")} />
                    {evt.title}
                    <span className="text-neutral-400 font-normal">
                      {days === 0 ? "Today" : days === 1 ? "Tomorrow" : `${days}d`}
                    </span>
                  </span>
                );
              })}
          </div>
        </div>
      </div>

      {/* ─── Main Content Grid ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6 sm:mb-8">
        {/* ─── 4. Priority Task List ─── */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-neutral-200 overflow-hidden">
          <div className="px-4 sm:px-5 py-3.5 border-b border-neutral-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-neutral-400" />
                <h2 className="text-sm font-semibold text-neutral-900">
                  Priority Tasks
                </h2>
                <span className="text-[11px] font-medium text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded-full">
                  {taskCounts.all}
                </span>
              </div>
              <Link
                href="/app/tasks"
                className="text-xs font-medium text-brand-600 hover:text-brand-700 transition-colors flex items-center gap-1"
              >
                View all <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>

            {/* Filter tabs */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
              {[
                { key: "all", label: "All" },
                { key: "overdue", label: "Overdue", count: taskCounts.overdue },
                { key: "in_progress", label: "In Progress" },
                { key: "awaiting_documents", label: "Awaiting Docs" },
                { key: "not_started", label: "Not Started" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setTaskFilter(tab.key)}
                  className={cn(
                    "inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors whitespace-nowrap",
                    taskFilter === tab.key
                      ? "bg-brand-50 text-brand-700"
                      : "text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100"
                  )}
                >
                  {tab.label}
                  {"count" in tab && tab.count !== undefined && tab.count > 0 && (
                    <span className="text-[10px] bg-danger/10 text-danger px-1.5 py-0.5 rounded-full">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
              <div className="ml-auto">
                <select
                  value={taskSortBy}
                  onChange={(e) => setTaskSortBy(e.target.value as typeof taskSortBy)}
                  className="text-[11px] font-medium text-neutral-500 bg-transparent border border-neutral-200 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-brand-500"
                >
                  <option value="dueDate">Sort: Due Date</option>
                  <option value="priority">Sort: Priority</option>
                  <option value="client">Sort: Client</option>
                </select>
              </div>
            </div>
          </div>

          <div className="divide-y divide-neutral-100 max-h-[480px] overflow-y-auto">
            {filteredTasks.length === 0 ? (
              <div className="p-8 text-center">
                <CheckCircle2 className="h-8 w-8 text-success mx-auto mb-2" />
                <p className="text-sm font-medium text-neutral-900">All clear!</p>
                <p className="text-xs text-neutral-500">No tasks match this filter.</p>
              </div>
            ) : (
              filteredTasks.map((task) => {
                const days = daysUntil(task.dueDate);
                const docProgress =
                  task.documentRequired && task.documentsTotal > 0
                    ? (task.documentsUploaded / task.documentsTotal) * 100
                    : 0;

                return (
                  <div
                    key={task.id}
                    className="px-4 sm:px-5 py-3.5 hover:bg-neutral-50/50 transition-colors group"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          "h-2 w-2 rounded-full mt-2 shrink-0",
                          priorityDot[task.priority]
                        )}
                        title={`${task.priority} priority`}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-neutral-900 truncate">
                              {task.title}
                            </p>
                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                              <span className="text-xs text-neutral-500">
                                {task.clientName}
                              </span>
                              <CategoryBadge category={task.category} />
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <TaskStatusBadge status={task.status} />
                          </div>
                        </div>

                        {/* Progress bar for document-dependent tasks */}
                        {task.documentRequired && task.documentsTotal > 0 && (
                          <div className="mt-2.5">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[11px] text-neutral-500">
                                Documents
                              </span>
                              <span className="text-[11px] text-neutral-500">
                                {task.documentsUploaded}/{task.documentsTotal}
                              </span>
                            </div>
                            <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
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

                        {/* Due date + actions */}
                        <div className="flex items-center justify-between mt-2.5">
                          <div className="flex items-center gap-2">
                            <span
                              className={cn(
                                "text-xs font-medium",
                                days < 0
                                  ? "text-danger"
                                  : days <= 3
                                  ? "text-danger"
                                  : days <= 7
                                  ? "text-warning"
                                  : "text-neutral-500"
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
                            <span className="text-xs text-neutral-400">
                              {task.assignedTo}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleReminder(task.clientName)}
                              className="p-1 rounded text-neutral-400 hover:text-brand-600 hover:bg-brand-50 transition-colors"
                              title="Send reminder"
                            >
                              <Bell className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() =>
                                handleStatusChange(
                                  task.id,
                                  task.status === "in_progress"
                                    ? "completed"
                                    : "in_progress"
                                )
                              }
                              className="p-1 rounded text-neutral-400 hover:text-success hover:bg-success-light transition-colors"
                              title={
                                task.status === "in_progress"
                                  ? "Mark complete"
                                  : "Start task"
                              }
                            >
                              <CheckCircle2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ─── 5. Client Activity + 6. Document Collection ─── */}
        <div className="lg:col-span-2 space-y-6">
          {/* Client Activity */}
          <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
            <div className="px-4 sm:px-5 py-3.5 border-b border-neutral-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-neutral-400" />
                <h2 className="text-sm font-semibold text-neutral-900">
                  Recent Activity
                </h2>
              </div>
              <Link
                href="/app/activity"
                className="text-xs font-medium text-brand-600 hover:text-brand-700 flex items-center gap-1"
              >
                View all <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="divide-y divide-neutral-100 max-h-[320px] overflow-y-auto">
              {activities.slice(0, 8).map((activity) => (
                <div
                  key={activity.id}
                  className="px-4 sm:px-5 py-3 hover:bg-neutral-50/50 transition-colors"
                >
                  <p className="text-sm text-neutral-700 leading-relaxed">
                    <span className="font-medium text-neutral-900">
                      {activity.userName}
                    </span>
                    {activity.isAI && (
                      <Sparkles className="h-3 w-3 text-brand-400 inline mx-0.5 -mt-0.5" />
                    )}{" "}
                    {activity.description}{" "}
                    <span className="font-medium text-neutral-900">
                      {activity.clientName}
                    </span>
                  </p>
                  <p className="text-[11px] text-neutral-400 mt-0.5">
                    {formatRelativeTime(activity.timestamp)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Document Collection Status */}
          <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
            <div className="px-4 sm:px-5 py-3.5 border-b border-neutral-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-neutral-400" />
                <h2 className="text-sm font-semibold text-neutral-900">
                  Document Status
                </h2>
              </div>
              <Link
                href="/app/documents"
                className="text-xs font-medium text-brand-600 hover:text-brand-700 flex items-center gap-1"
              >
                View all <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="p-4 sm:p-5 space-y-3">
              {(() => {
                const requestedDocs = documents.filter((d) => d.status === "requested");
                const clientDocCounts: Record<string, { requested: number; total: number }> = {};
                requestedDocs.forEach((d) => {
                  if (!clientDocCounts[d.clientName]) {
                    clientDocCounts[d.clientName] = { requested: 0, total: 0 };
                  }
                  clientDocCounts[d.clientName].requested++;
                });
                // Also count uploaded for total
                documents.forEach((d) => {
                  if (!clientDocCounts[d.clientName]) {
                    clientDocCounts[d.clientName] = { requested: 0, total: 0 };
                  }
                  clientDocCounts[d.clientName].total++;
                });

                return Object.entries(clientDocCounts)
                  .filter(([, v]) => v.requested > 0)
                  .sort((a, b) => b[1].requested - a[1].requested)
                  .slice(0, 5)
                  .map(([clientName, counts]) => {
                    const progress =
                      counts.total > 0
                        ? ((counts.total - counts.requested) / counts.total) * 100
                        : 0;
                    return (
                      <div key={clientName}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-sm font-medium text-neutral-900 truncate">
                            {clientName}
                          </span>
                          <span className="text-[11px] text-danger font-medium shrink-0">
                            {counts.requested} pending
                          </span>
                        </div>
                        <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-brand-500 rounded-full transition-all"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    );
                  });
              })()}
            </div>
            <div className="px-4 sm:px-5 py-3 border-t border-neutral-200">
              <button
                onClick={() =>
                  toast({
                    message: "Batch document reminder sent to 8 clients.",
                    type: "success",
                  })
                }
                className="w-full flex items-center justify-center gap-2 py-2 text-xs font-medium text-brand-600 hover:text-brand-700 hover:bg-brand-50 rounded-lg transition-colors"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Send batch reminders
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ─── 7. AI Recommendations Panel ─── */}
      <div className="bg-white rounded-xl border border-neutral-200 mb-6 sm:mb-8 overflow-hidden">
        <div className="px-4 sm:px-5 py-3.5 border-b border-neutral-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-brand-100">
              <Sparkles className="h-3.5 w-3.5 text-brand-600" />
            </div>
            <h2 className="text-sm font-semibold text-neutral-900">
              AI Recommendations
            </h2>
            <span className="text-[11px] font-medium text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full">
              {aiRecommendations.length}
            </span>
          </div>
        </div>
        <div className="divide-y divide-neutral-100">
          {aiRecommendations.map((rec) => (
            <div
              key={rec.id}
              className="px-4 sm:px-5 py-4 hover:bg-neutral-50/50 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "h-2 w-2 rounded-full mt-2 shrink-0",
                    rec.priority === "urgent"
                      ? "bg-danger"
                      : rec.priority === "high"
                      ? "bg-warning"
                      : "bg-brand-500"
                  )}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium text-neutral-900">
                      {rec.title}
                    </p>
                    <PriorityBadge priority={rec.priority} />
                  </div>
                  <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                    {rec.description}
                  </p>
                  <div className="flex items-center gap-3 mt-2.5">
                    <button
                      onClick={() =>
                        toast({
                          message: `Action taken: ${rec.actionLabel}`,
                          type: "success",
                        })
                      }
                      className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700 transition-colors"
                    >
                      {rec.actionLabel}
                      <ArrowRight className="h-3 w-3" />
                    </button>
                    {rec.clientName && (
                      <Link
                        href={`/app/clients`}
                        className="text-xs text-neutral-400 hover:text-neutral-600 transition-colors"
                      >
                        {rec.clientName}
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── 8. Recent Activity (Full-width) ─── */}
      <div className="bg-white rounded-xl border border-neutral-200 mb-6 sm:mb-8 overflow-hidden">
        <div className="px-4 sm:px-5 py-3.5 border-b border-neutral-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-neutral-400" />
            <h2 className="text-sm font-semibold text-neutral-900">
              Upcoming Deadlines
            </h2>
          </div>
          <Link
            href="/app/tasks"
            className="text-xs font-medium text-brand-600 hover:text-brand-700 flex items-center gap-1"
          >
            View all <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-100">
                <th className="text-left text-[11px] font-semibold text-neutral-500 uppercase tracking-wider px-4 sm:px-5 py-2.5">
                  Client
                </th>
                <th className="text-left text-[11px] font-semibold text-neutral-500 uppercase tracking-wider px-4 sm:px-5 py-2.5 hidden sm:table-cell">
                  Task
                </th>
                <th className="text-left text-[11px] font-semibold text-neutral-500 uppercase tracking-wider px-4 sm:px-5 py-2.5 hidden md:table-cell">
                  Category
                </th>
                <th className="text-left text-[11px] font-semibold text-neutral-500 uppercase tracking-wider px-4 sm:px-5 py-2.5">
                  Status
                </th>
                <th className="text-left text-[11px] font-semibold text-neutral-500 uppercase tracking-wider px-4 sm:px-5 py-2.5">
                  Due
                </th>
                <th className="text-left text-[11px] font-semibold text-neutral-500 uppercase tracking-wider px-4 sm:px-5 py-2.5 hidden lg:table-cell">
                  Assigned
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {complianceTasks
                .filter((t) => t.status !== "completed")
                .sort(
                  (a, b) =>
                    new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
                )
                .slice(0, 8)
                .map((task) => {
                  const days = daysUntil(task.dueDate);
                  return (
                    <tr
                      key={task.id}
                      className="hover:bg-neutral-50/50 transition-colors"
                    >
                      <td className="px-4 sm:px-5 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 rounded-full bg-neutral-100 flex items-center justify-center shrink-0">
                            <span className="text-[10px] font-semibold text-neutral-600">
                              {task.clientName
                                .split(" ")
                                .slice(0, 2)
                                .map((w) => w[0])
                                .join("")}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-neutral-900 truncate max-w-[160px] sm:max-w-none">
                              {task.clientName}
                            </p>
                            <p className="text-[11px] text-neutral-500 sm:hidden truncate max-w-[160px]">
                              {task.title}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 sm:px-5 py-3 hidden sm:table-cell">
                        <p className="text-sm text-neutral-700 truncate max-w-[200px]">
                          {task.title}
                        </p>
                      </td>
                      <td className="px-4 sm:px-5 py-3 hidden md:table-cell">
                        <CategoryBadge category={task.category} />
                      </td>
                      <td className="px-4 sm:px-5 py-3">
                        <TaskStatusBadge status={task.status} />
                      </td>
                      <td className="px-4 sm:px-5 py-3">
                        <span
                          className={cn(
                            "text-sm font-medium",
                            days < 0
                              ? "text-danger"
                              : days <= 3
                              ? "text-danger"
                              : days <= 7
                              ? "text-warning"
                              : "text-neutral-700"
                          )}
                        >
                          {days < 0
                            ? `${Math.abs(days)}d overdue`
                            : days === 0
                            ? "Today"
                            : days === 1
                            ? "Tomorrow"
                            : `${days}d`}
                        </span>
                      </td>
                      <td className="px-4 sm:px-5 py-3 hidden lg:table-cell">
                        <span className="text-sm text-neutral-500">
                          {task.assignedTo}
                        </span>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── 9. Upcoming Deadlines Summary ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-neutral-200 p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-100">
              <Calendar className="h-4 w-4 text-brand-600" />
            </div>
            <h3 className="text-sm font-semibold text-neutral-900">
              Next 7 Days
            </h3>
          </div>
          <p className="text-2xl font-bold text-neutral-900">
            {complianceTasks.filter((t) => {
              const d = daysUntil(t.dueDate);
              return d >= 0 && d <= 7 && t.status !== "completed";
            }).length}
          </p>
          <p className="text-xs text-neutral-500 mt-1">tasks due</p>
        </div>
        <div className="bg-white rounded-xl border border-neutral-200 p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-success-light">
              <CheckCircle2 className="h-4 w-4 text-success" />
            </div>
            <h3 className="text-sm font-semibold text-neutral-900">
              Completed This Month
            </h3>
          </div>
          <p className="text-2xl font-bold text-neutral-900">18</p>
          <p className="text-xs text-neutral-500 mt-1">tasks completed</p>
        </div>
        <div className="bg-white rounded-xl border border-neutral-200 p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-warning-light">
              <AlertCircle className="h-4 w-4 text-warning" />
            </div>
            <h3 className="text-sm font-semibold text-neutral-900">
              Compliance Score
            </h3>
          </div>
          <p className="text-2xl font-bold text-success">94%</p>
          <p className="text-xs text-neutral-500 mt-1">on-time completion rate</p>
        </div>
      </div>

      {/* ─── Confirmation Dialog ─── */}
      <ConfirmDialog
        open={!!confirmAction}
        onClose={() => setConfirmAction(null)}
        onConfirm={confirmStatusChange}
        title="Update Task Status"
        description={`Are you sure you want to mark this task as ${confirmAction?.newStatus.replace(/_/g, " ")}?`}
        confirmLabel="Update Status"
      />
    </div>
  );
}
