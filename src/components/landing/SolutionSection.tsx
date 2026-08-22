"use client";

import { motion } from "framer-motion";
import {
  LayoutDashboard,
  FolderOpen,
  Bell,
  BarChart3,
  ArrowRight,
} from "lucide-react";

const steps = [
  {
    step: "01",
    icon: <LayoutDashboard className="h-5 w-5" />,
    title: "One system for everything",
    description:
      "All your clients, compliance types, deadlines, and documents in a single platform. No more switching between apps.",
  },
  {
    step: "02",
    icon: <FolderOpen className="h-5 w-5" />,
    title: "Automated workflows",
    description:
      "OBLIQ generates tasks from your compliance calendar — GST, ITR, TDS, ROC — and assigns them to your team automatically.",
  },
  {
    step: "03",
    icon: <Bell className="h-5 w-5" />,
    title: "Smart follow-ups",
    description:
      "AI tracks document submissions and sends timely reminders to clients. Your team stops chasing, starts doing.",
  },
  {
    step: "04",
    icon: <BarChart3 className="h-5 w-5" />,
    title: "Complete visibility",
    description:
      "Partners see real-time dashboards of what's done, what's pending, and what's at risk — across every client and every filing.",
  },
];

export function SolutionSection() {
  return (
    <section className="bg-neutral-50 py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center mb-14 lg:mb-16">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.4 }}
            className="text-sm font-semibold text-brand-600 uppercase tracking-wider mb-3"
          >
            The Solution
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl lg:text-[2.75rem] leading-tight"
          >
            From scattered chaos to orchestrated compliance
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-4 text-lg text-neutral-600 leading-relaxed"
          >
            OBLIQ converts fragmented compliance work into an organized,
            trackable, and automated workflow — so your firm runs compliance
            operations instead of chasing them.
          </motion.p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.1, duration: 0.45 }}
              className="group relative rounded-xl border border-neutral-200 bg-white p-6 lg:p-7 transition-all duration-200 hover:border-brand-200 hover:shadow-[var(--shadow-card-hover)]"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-600 text-white">
                  {step.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs font-mono font-medium text-brand-500">
                      {step.step}
                    </span>
                    <ArrowRight className="h-3 w-3 text-neutral-300 hidden sm:block" />
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-neutral-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
