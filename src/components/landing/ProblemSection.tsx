"use client";

import { motion } from "framer-motion";
import {
  AlertTriangle,
  Clock,
  MessageSquare,
  FileSpreadsheet,
  Eye,
  RefreshCw,
} from "lucide-react";

const problems = [
  {
    icon: <Clock className="h-5 w-5" />,
    title: "Missed deadlines",
    description:
      "GST, ITR, TDS, ROC — dozens of recurring deadlines across hundreds of clients. One missed date can mean penalties and reputational damage.",
  },
  {
    icon: <MessageSquare className="h-5 w-5" />,
    title: "Chasing documents",
    description:
      "Endless WhatsApp messages and phone calls to collect PANs, bank statements, and investment proofs. No tracking on what's been sent or received.",
  },
  {
    icon: <FileSpreadsheet className="h-5 w-5" />,
    title: "Excel-driven operations",
    description:
      "Compliance tracking spreadsheets shared via email, with no version control, no alerts, and no single source of truth for the team.",
  },
  {
    icon: <Eye className="h-5 w-5" />,
    title: "Zero visibility",
    description:
      "Partners discover problems when clients call angry. No real-time view of what's pending, what's overdue, or who's responsible.",
  },
  {
    icon: <RefreshCw className="h-5 w-5" />,
    title: "Repetitive workflows",
    description:
      "The same compliance checklist copied for every client, every quarter. Manual work that scales linearly with client count.",
  },
  {
    icon: <AlertTriangle className="h-5 w-5" />,
    title: "Scattered communication",
    description:
      "Work instructions, client conversations, and status updates scattered across email, WhatsApp, phone calls, and verbal notes.",
  },
];

export function ProblemSection() {
  return (
    <section className="bg-white py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="max-w-2xl mx-auto text-center mb-14 lg:mb-16">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.4 }}
            className="text-sm font-semibold text-danger uppercase tracking-wider mb-3"
          >
            The Problem
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl lg:text-[2.75rem] leading-tight"
          >
            Compliance shouldn&rsquo;t feel like firefighting
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-4 text-lg text-neutral-600 leading-relaxed"
          >
            Indian CA firms manage hundreds of compliance obligations per client
            per year. Most still run this on spreadsheets, WhatsApp, and memory.
          </motion.p>
        </div>

        {/* Problem grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {problems.map((problem, i) => (
            <motion.div
              key={problem.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.07, duration: 0.45 }}
              className="group rounded-xl border border-neutral-200 bg-white p-6 transition-all duration-200 hover:border-neutral-300 hover:shadow-[var(--shadow-card-hover)]"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-danger-light text-danger mb-4">
                {problem.icon}
              </div>
              <h3 className="text-base font-semibold text-neutral-900 mb-2">
                {problem.title}
              </h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                {problem.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
