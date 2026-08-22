"use client";

import { motion } from "framer-motion";
import {
  BrainCircuit,
  AlertTriangle,
  Send,
  FileSearch,
  ArrowRight,
} from "lucide-react";

const capabilities = [
  {
    icon: <AlertTriangle className="h-5 w-5" />,
    title: "Deadline Risk Scoring",
    description:
      "AI analyzes submission status, document completeness, and historical patterns to score each filing's risk of missing the deadline. Your team knows what to prioritize.",
    metric: "Flags at-risk filings 7 days early",
  },
  {
    icon: <Send className="h-5 w-5" />,
    title: "Smart Follow-up Timing",
    description:
      "Instead of fixed reminders, AI learns which clients respond faster to email vs. SMS, and adjusts follow-up timing and channel accordingly.",
    metric: "40% faster document collection",
  },
  {
    icon: <FileSearch className="h-5 w-5" />,
    title: "Document Completeness Check",
    description:
      "AI scans uploaded documents for completeness — checks if all required fields are filled, identifies missing pages, and flags inconsistencies before filing.",
    metric: "Reduces resubmission requests by 60%",
  },
  {
    icon: <BrainCircuit className="h-5 w-5" />,
    title: "Workload Distribution",
    description:
      "Analyzes team capacity, expertise, and current workload to suggest optimal task assignments. Partners make the final call, but the recommendations are data-driven.",
    metric: "Balances team load across 200+ filings",
  },
];

export function AICapabilities() {
  return (
    <section id="ai" className="bg-neutral-900 py-20 sm:py-24 lg:py-28 overflow-hidden relative">
      {/* Subtle gradient accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-brand-600/10 via-brand-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center mb-14 lg:mb-16">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.4 }}
            className="text-sm font-semibold text-brand-400 uppercase tracking-wider mb-3"
          >
            AI Capabilities
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-[2.75rem] leading-tight"
          >
            AI that works for compliance,
            <br className="hidden sm:block" />
            not against it
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-4 text-lg text-neutral-400 leading-relaxed"
          >
            No generic &ldquo;AI-powered everything&rdquo; promises. Every AI
            feature in OBLIQ solves a specific compliance operation problem.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
          {capabilities.map((cap, i) => (
            <motion.div
              key={cap.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.1, duration: 0.45 }}
              className="group rounded-xl border border-neutral-800 bg-neutral-800/50 p-6 lg:p-7 transition-all duration-200 hover:border-brand-600/40 hover:bg-neutral-800/80"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-600/15 text-brand-400 mb-4">
                {cap.icon}
              </div>
              <h3 className="text-base font-semibold text-white mb-2">
                {cap.title}
              </h3>
              <p className="text-sm text-neutral-400 leading-relaxed mb-4">
                {cap.description}
              </p>
              <div className="flex items-center gap-2">
                <ArrowRight className="h-3 w-3 text-brand-400" />
                <span className="text-xs font-medium text-brand-400">
                  {cap.metric}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
