"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Clock,
  FileText,
  AlertTriangle,
  TrendingUp,
  Users,
  ArrowRight,
  Sparkles,
  ChevronRight,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-white pt-24 pb-16 sm:pt-32 sm:pb-20 lg:pt-36 lg:pb-24">
      {/* Subtle grid background */}
      <div className="hero-grid-pattern absolute inset-0 pointer-events-none" />

      {/* Subtle gradient orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-b from-brand-50/40 via-transparent to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          {/* Badge */}
          <motion.div
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50/80 px-4 py-1.5 text-xs font-medium text-brand-700 mb-6"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI-powered compliance for Indian CA firms</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl leading-[1.1]"
          >
            Run compliance operations.
            <br />
            <span className="text-brand-600">
              Don&rsquo;t chase them.
            </span>
          </motion.h1>

          {/* Supporting copy */}
          <motion.p
            custom={2}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="mt-6 text-lg text-neutral-600 sm:text-xl max-w-2xl mx-auto leading-relaxed"
          >
            OBLIQ gives CA firms a single system to track deadlines, collect
            client documents, assign tasks, and manage compliance — so nothing
            falls through the cracks.
          </motion.p>

          {/* CTAs */}
          <motion.div
            custom={3}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-brand-700 hover:shadow-md active:bg-brand-800 w-full sm:w-auto justify-center"
            >
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-6 py-3 text-sm font-medium text-neutral-700 shadow-sm transition-all hover:bg-neutral-50 hover:border-neutral-300 w-full sm:w-auto justify-center"
            >
              See How It Works
              <ChevronRight className="h-4 w-4" />
            </a>
          </motion.div>
        </div>

        {/* Dashboard Mockup */}
        <motion.div
          custom={4}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mt-16 lg:mt-20 mx-auto max-w-5xl"
        >
          <div className="dashboard-mockup p-4 sm:p-6 lg:p-8">
            {/* Top bar */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-brand-600 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">O</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-neutral-900">Compliance Dashboard</p>
                  <p className="text-xs text-neutral-500">FY 2025-26</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-success-light px-2.5 py-1 text-xs font-medium text-success">
                  <span className="h-1.5 w-1.5 rounded-full bg-success" />
                  All systems active
                </span>
              </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
              <DashboardKPICard
                icon={<CheckCircle2 className="h-4 w-4" />}
                label="Completed"
                value="127"
                sub="This quarter"
                color="text-success"
                bgColor="bg-success-light"
              />
              <DashboardKPICard
                icon={<Clock className="h-4 w-4" />}
                label="In Progress"
                value="23"
                sub="6 due this week"
                color="text-brand-600"
                bgColor="bg-brand-100"
              />
              <DashboardKPICard
                icon={<AlertTriangle className="h-4 w-4" />}
                label="Overdue"
                value="3"
                sub="Needs attention"
                color="text-danger"
                bgColor="bg-danger-light"
              />
              <DashboardKPICard
                icon={<Users className="h-4 w-4" />}
                label="Active Clients"
                value="84"
                sub="12 pending docs"
                color="text-warning"
                bgColor="bg-warning-light"
              />
            </div>

            {/* Task List */}
            <div className="border border-neutral-200 rounded-lg overflow-hidden">
              <div className="bg-neutral-50 px-4 py-2.5 border-b border-neutral-200 flex items-center justify-between">
                <p className="text-xs font-semibold text-neutral-700 uppercase tracking-wider">Upcoming Deadlines</p>
                <p className="text-xs text-neutral-500">Next 7 days</p>
              </div>
              <div className="divide-y divide-neutral-100">
                <DashboardTaskRow
                  client="Reliance Industries Ltd"
                  task="GST 3B Filing"
                  due="Aug 26"
                  status="in-progress"
                  ai
                />
                <DashboardTaskRow
                  client="Tata Consultancy Services"
                  task="TDS Return Q1"
                  due="Aug 31"
                  status="pending"
                />
                <DashboardTaskRow
                  client="Infosys Ltd"
                  task="ROC Annual Filing"
                  due="Sep 5"
                  status="pending"
                />
                <DashboardTaskRow
                  client="Wipro Ltd"
                  task="ITR Filing"
                  due="Sep 7"
                  status="documents-needed"
                  ai
                />
              </div>
            </div>

            {/* AI Activity */}
            <div className="mt-4 flex items-start gap-3 rounded-lg border border-brand-100 bg-brand-50/50 p-3.5">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-brand-100">
                <Sparkles className="h-3.5 w-3.5 text-brand-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-brand-800">AI Insight</p>
                <p className="text-xs text-brand-700/80 mt-0.5">
                  12 clients have pending document submissions for Q1 compliance. Auto-reminders scheduled for tomorrow.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function DashboardKPICard({
  icon,
  label,
  value,
  sub,
  color,
  bgColor,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  color: string;
  bgColor: string;
}) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-3.5 sm:p-4">
      <div className="flex items-center gap-2 mb-2">
        <div className={cn("flex h-6 w-6 items-center justify-center rounded-md", bgColor, color)}>
          {icon}
        </div>
        <span className="text-xs font-medium text-neutral-500">{label}</span>
      </div>
      <p className="text-2xl font-bold text-neutral-900">{value}</p>
      <p className="text-xs text-neutral-500 mt-0.5">{sub}</p>
    </div>
  );
}

function DashboardTaskRow({
  client,
  task,
  due,
  status,
  ai = false,
}: {
  client: string;
  task: string;
  due: string;
  status: "in-progress" | "pending" | "documents-needed" | "completed";
  ai?: boolean;
}) {
  const statusStyles = {
    "in-progress": { bg: "bg-brand-100", text: "text-brand-700", label: "In Progress" },
    pending: { bg: "bg-neutral-100", text: "text-neutral-600", label: "Pending" },
    "documents-needed": { bg: "bg-warning-light", text: "text-warning", label: "Docs Needed" },
    completed: { bg: "bg-success-light", text: "text-success", label: "Completed" },
  };
  const s = statusStyles[status];

  return (
    <div className="flex items-center gap-3 px-4 py-3 hover:bg-neutral-50/50 transition-colors">
      <FileText className="h-4 w-4 text-neutral-400 shrink-0" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-neutral-900 truncate">{client}</p>
          {ai && (
            <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-medium text-brand-600 border border-brand-100">
              <Sparkles className="h-2.5 w-2.5" />
              AI
            </span>
          )}
        </div>
        <p className="text-xs text-neutral-500 mt-0.5">{task}</p>
      </div>
      <span className={cn("hidden sm:inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium", s.bg, s.text)}>
        {s.label}
      </span>
      <span className="text-xs font-medium text-neutral-500 shrink-0">{due}</span>
    </div>
  );
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}
