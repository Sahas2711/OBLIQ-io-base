"use client";

import { motion } from "framer-motion";
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  Users,
  Calendar,
  TrendingUp,
  Bell,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";

export function DashboardShowcase() {
  return (
    <section className="bg-white py-20 sm:py-24 lg:py-28 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center mb-14 lg:mb-16">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.4 }}
            className="text-sm font-semibold text-brand-600 uppercase tracking-wider mb-3"
          >
            Dashboard
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl lg:text-[2.75rem] leading-tight"
          >
            Your compliance command center
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-4 text-lg text-neutral-600 leading-relaxed"
          >
            See the full picture at a glance. Every client, every filing, every
            deadline — one view.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto max-w-5xl"
        >
          <div className="dashboard-mockup p-1 sm:p-2">
            <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden">
              {/* Mockup browser chrome */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-neutral-200 bg-neutral-50">
                <div className="flex gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-neutral-300" />
                  <div className="h-2.5 w-2.5 rounded-full bg-neutral-300" />
                  <div className="h-2.5 w-2.5 rounded-full bg-neutral-300" />
                </div>
                <div className="flex-1 mx-4">
                  <div className="h-6 rounded-md bg-neutral-200/60 max-w-md mx-auto flex items-center justify-center">
                    <span className="text-[10px] text-neutral-500 font-medium">
                      app.obliq.io/dashboard
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex">
                {/* Sidebar mockup */}
                <div className="hidden md:block w-52 border-r border-neutral-200 bg-neutral-50/50 p-4 shrink-0">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="h-7 w-7 rounded-md bg-brand-600 flex items-center justify-center">
                      <span className="text-white text-[10px] font-bold">O</span>
                    </div>
                    <span className="text-xs font-semibold text-neutral-900">OBLIQ</span>
                  </div>
                  <div className="space-y-1">
                    {["Dashboard", "Clients", "Tasks", "Documents", "Activity"].map(
                      (item, i) => (
                        <div
                          key={item}
                          className={`flex items-center gap-2 rounded-md px-2.5 py-2 text-xs font-medium ${
                            i === 0
                              ? "bg-brand-50 text-brand-700"
                              : "text-neutral-500 hover:text-neutral-700"
                          }`}
                        >
                          <div className="h-3.5 w-3.5 rounded bg-current/20" />
                          {item}
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* Main content mockup */}
                <div className="flex-1 p-4 sm:p-6 min-w-0">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-sm font-semibold text-neutral-900">Dashboard</h3>
                      <p className="text-xs text-neutral-500 mt-0.5">
                        FY 2025-26 · Q2 Compliance Overview
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-full bg-brand-100 flex items-center justify-center">
                        <span className="text-[10px] font-semibold text-brand-700">RS</span>
                      </div>
                    </div>
                  </div>

                  {/* KPI Row */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                    <MiniKPI
                      label="Completed"
                      value="127"
                      change="+18%"
                      positive
                      icon={<CheckCircle2 className="h-3.5 w-3.5" />}
                    />
                    <MiniKPI
                      label="In Progress"
                      value="23"
                      change="6 due this week"
                      icon={<Clock className="h-3.5 w-3.5" />}
                    />
                    <MiniKPI
                      label="Overdue"
                      value="3"
                      change="-2 vs last month"
                      positive
                      icon={<AlertTriangle className="h-3.5 w-3.5" />}
                    />
                    <MiniKPI
                      label="Clients"
                      value="84"
                      change="12 pending docs"
                      icon={<Users className="h-3.5 w-3.5" />}
                    />
                  </div>

                  {/* Two column: Tasks + Activity */}
                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                    {/* Tasks */}
                    <div className="lg:col-span-3 border border-neutral-200 rounded-lg overflow-hidden">
                      <div className="px-3.5 py-2.5 border-b border-neutral-200 bg-neutral-50/50 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3.5 w-3.5 text-neutral-400" />
                          <span className="text-xs font-semibold text-neutral-700">
                            Upcoming Deadlines
                          </span>
                        </div>
                        <ArrowUpRight className="h-3.5 w-3.5 text-neutral-400" />
                      </div>
                      <div className="divide-y divide-neutral-100">
                        {[
                          {
                            client: "Reliance Industries Ltd",
                            task: "GST 3B Filing",
                            due: "Aug 26",
                            badge: "In Progress",
                            badgeClass: "bg-brand-50 text-brand-700",
                            ai: true,
                          },
                          {
                            client: "TCS Ltd",
                            task: "TDS Return Q1",
                            due: "Aug 31",
                            badge: "Pending",
                            badgeClass: "bg-neutral-100 text-neutral-600",
                          },
                          {
                            client: "Infosys Ltd",
                            task: "ROC Annual Filing",
                            due: "Sep 5",
                            badge: "Pending",
                            badgeClass: "bg-neutral-100 text-neutral-600",
                          },
                          {
                            client: "Wipro Ltd",
                            task: "ITR Filing",
                            due: "Sep 7",
                            badge: "Docs Needed",
                            badgeClass: "bg-warning-light text-warning",
                            ai: true,
                          },
                        ].map((task) => (
                          <div
                            key={task.client + task.task}
                            className="flex items-center gap-3 px-3.5 py-2.5 hover:bg-neutral-50/50"
                          >
                            <FileText className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-medium text-neutral-900 truncate">
                                  {task.client}
                                </span>
                                {task.ai && (
                                  <Sparkles className="h-2.5 w-2.5 text-brand-400 shrink-0" />
                                )}
                              </div>
                              <span className="text-[11px] text-neutral-500">
                                {task.task}
                              </span>
                            </div>
                            <span
                              className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${task.badgeClass}`}
                            >
                              {task.badge}
                            </span>
                            <span className="text-[11px] font-medium text-neutral-500 shrink-0">
                              {task.due}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Activity */}
                    <div className="lg:col-span-2 border border-neutral-200 rounded-lg overflow-hidden">
                      <div className="px-3.5 py-2.5 border-b border-neutral-200 bg-neutral-50/50 flex items-center gap-2">
                        <TrendingUp className="h-3.5 w-3.5 text-neutral-400" />
                        <span className="text-xs font-semibold text-neutral-700">
                          Recent Activity
                        </span>
                      </div>
                      <div className="divide-y divide-neutral-100">
                        {[
                          {
                            user: "Priya M.",
                            action: "completed GST 3B for",
                            target: "HDFC Bank",
                            time: "2h ago",
                          },
                          {
                            user: "AI",
                            action: "sent reminder to",
                            target: "ITC Ltd",
                            time: "4h ago",
                            ai: true,
                          },
                          {
                            user: "Rajesh K.",
                            action: "uploaded docs for",
                            target: "Bajaj Auto",
                            time: "6h ago",
                          },
                          {
                            user: "AI",
                            action: "flagged overdue:",
                            target: "L&T Finance",
                            time: "1d ago",
                            ai: true,
                          },
                        ].map((activity, i) => (
                          <div
                            key={i}
                            className="px-3.5 py-2.5 hover:bg-neutral-50/50"
                          >
                            <p className="text-[11px] text-neutral-700 leading-relaxed">
                              <span className="font-medium text-neutral-900">
                                {activity.user}
                              </span>
                              {activity.ai && (
                                <Sparkles className="h-2.5 w-2.5 text-brand-400 inline mx-0.5 -mt-0.5" />
                              )}{" "}
                              {activity.action}{" "}
                              <span className="font-medium text-neutral-900">
                                {activity.target}
                              </span>
                            </p>
                            <p className="text-[10px] text-neutral-400 mt-0.5">
                              {activity.time}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function MiniKPI({
  label,
  value,
  change,
  positive,
  icon,
}: {
  label: string;
  value: string;
  change: string;
  positive?: boolean;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-neutral-200 p-3">
      <div className="flex items-center gap-1.5 mb-1.5">
        <span className="text-neutral-400">{icon}</span>
        <span className="text-[11px] font-medium text-neutral-500">{label}</span>
      </div>
      <p className="text-xl font-bold text-neutral-900">{value}</p>
      <p
        className={`text-[11px] mt-0.5 ${
          positive ? "text-success" : "text-neutral-500"
        }`}
      >
        {change}
      </p>
    </div>
  );
}
