"use client";

import { motion } from "framer-motion";
import {
  UserPlus,
  Workflow,
  Zap,
  BarChart3,
  ArrowRight,
} from "lucide-react";

const steps = [
  {
    number: "01",
    icon: <UserPlus className="h-6 w-6" />,
    title: "Set up your firm",
    description:
      "Create your firm profile, invite team members, and import your existing client list. Takes about 5 minutes.",
  },
  {
    number: "02",
    icon: <Workflow className="h-6 w-6" />,
    title: "Map compliance workflows",
    description:
      "Select compliance types for each client — GST, ITR, TDS, ROC, and more. OBLIQ auto-generates your compliance calendar.",
  },
  {
    number: "03",
    icon: <Zap className="h-6 w-6" />,
    title: "Automate the operations",
    description:
      "Tasks are created, assigned, and tracked automatically. Document requests go out. Reminders fire. Your team focuses on the work.",
  },
  {
    number: "04",
    icon: <BarChart3 className="h-6 w-6" />,
    title: "Monitor and optimize",
    description:
      "Track completion rates, spot bottlenecks, and ensure zero missed deadlines. AI surfaces risks before they become problems.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-neutral-50 py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center mb-14 lg:mb-16">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.4 }}
            className="text-sm font-semibold text-brand-600 uppercase tracking-wider mb-3"
          >
            How It Works
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl lg:text-[2.75rem] leading-tight"
          >
            Up and running in four steps
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-4 text-lg text-neutral-600 leading-relaxed"
          >
            No complex implementation. No data migration headaches. Start
            seeing results from day one.
          </motion.p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Vertical connector line (desktop) */}
          <div className="hidden lg:block absolute left-[52px] top-0 bottom-0 w-px bg-neutral-200" />

          <div className="space-y-6 lg:space-y-0">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: i * 0.1, duration: 0.45 }}
                className="relative lg:grid lg:grid-cols-[80px_1fr] lg:gap-8 lg:pb-12 last:pb-0"
              >
                {/* Step number circle */}
                <div className="hidden lg:flex relative z-10 h-[105px] w-[105px] items-center justify-center">
                  <div className="flex h-[105px] w-[105px] items-center justify-center rounded-full bg-white border-2 border-brand-200 shadow-sm">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-600 text-white">
                      {step.icon}
                    </div>
                  </div>
                </div>

                {/* Mobile step indicator */}
                <div className="lg:hidden flex items-center gap-3 mb-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white text-xs font-bold">
                    {step.number}
                  </div>
                  <div className="h-px flex-1 bg-neutral-200" />
                </div>

                {/* Content */}
                <div className="rounded-xl border border-neutral-200 bg-white p-6 lg:p-7 transition-all duration-200 hover:border-brand-200 hover:shadow-[var(--shadow-card-hover)]">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="hidden lg:inline text-xs font-mono font-medium text-brand-500">
                      Step {step.number}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-neutral-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
