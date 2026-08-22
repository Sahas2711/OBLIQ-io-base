"use client";

import { motion } from "framer-motion";
import {
  CalendarCheck,
  FileSearch,
  BrainCircuit,
  Send,
  Users,
  BarChart3,
} from "lucide-react";

const features = [
  {
    icon: <CalendarCheck className="h-5 w-5" />,
    title: "Compliance Tracking",
    description:
      "Track every filing — GST, ITR, TDS, ROC — across all clients with automated status updates and deadline alerts.",
    tag: "Core",
  },
  {
    icon: <FileSearch className="h-5 w-5" />,
    title: "Document Collection",
    description:
      "Request, track, and manage client document submissions. Know exactly who submitted what, and who hasn't.",
    tag: "Core",
  },
  {
    icon: <BrainCircuit className="h-5 w-5" />,
    title: "Deadline Intelligence",
    description:
      "AI-powered risk scoring flags at-risk filings before they become overdue. Prioritize what matters.",
    tag: "AI",
  },
  {
    icon: <Send className="h-5 w-5" />,
    title: "Automated Follow-ups",
    description:
      "Smart reminders sent to clients and team members based on compliance urgency and submission status.",
    tag: "AI",
  },
  {
    icon: <Users className="h-5 w-5" />,
    title: "Client Management",
    description:
      "Complete client profiles with compliance history, documents, communication logs, and entity details.",
    tag: "Core",
  },
  {
    icon: <BarChart3 className="h-5 w-5" />,
    title: "Firm Dashboard",
    description:
      "Real-time visibility into team workload, pending tasks, completion rates, and upcoming deadlines.",
    tag: "Core",
  },
];

export function Features() {
  return (
    <section id="features" className="bg-white py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="max-w-2xl mx-auto text-center mb-14 lg:mb-16">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.4 }}
            className="text-sm font-semibold text-brand-600 uppercase tracking-wider mb-3"
          >
            Features
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl lg:text-[2.75rem] leading-tight"
          >
            Everything your firm needs,
            <br className="hidden sm:block" />
            nothing it doesn&rsquo;t
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-4 text-lg text-neutral-600 leading-relaxed"
          >
            Built specifically for the compliance workflows of Indian CA
            firms. Every feature addresses a real operational need.
          </motion.p>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.07, duration: 0.45 }}
              className="group relative rounded-xl border border-neutral-200 bg-white p-6 transition-all duration-200 hover:border-brand-200 hover:shadow-[var(--shadow-card-hover)]"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600 group-hover:bg-brand-600 group-hover:text-white transition-colors duration-200">
                  {feature.icon}
                </div>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium ${
                    feature.tag === "AI"
                      ? "bg-brand-50 text-brand-600 border border-brand-100"
                      : "bg-neutral-100 text-neutral-600"
                  }`}
                >
                  {feature.tag}
                </span>
              </div>
              <h3 className="text-base font-semibold text-neutral-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
