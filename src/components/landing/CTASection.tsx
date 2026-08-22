"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

export function CTASection() {
  return (
    <section className="relative bg-neutral-50 py-20 sm:py-24 lg:py-28 overflow-hidden">
      {/* Subtle background accent */}
      <div className="absolute inset-0 hero-grid-pattern pointer-events-none opacity-50" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-brand-50/40 rounded-full blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50/80 px-4 py-1.5 text-xs font-medium text-brand-700 mb-6">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Start your free trial today</span>
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl lg:text-5xl leading-tight">
            Stop chasing compliance.
            <br />
            <span className="text-brand-600">Start running it.</span>
          </h2>

          <p className="mt-5 text-lg text-neutral-600 max-w-xl mx-auto leading-relaxed">
            Join 200+ Indian CA firms that have replaced spreadsheets and
            WhatsApp with a real compliance operations platform.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-7 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-brand-700 hover:shadow-md active:bg-brand-800 w-full sm:w-auto justify-center"
            >
              Get Started Free
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-7 py-3.5 text-sm font-medium text-neutral-700 shadow-sm transition-all hover:bg-neutral-50 hover:border-neutral-300 w-full sm:w-auto justify-center"
            >
              Schedule a Demo
            </Link>
          </div>

          <p className="mt-5 text-xs text-neutral-500">
            No credit card required · Free for up to 10 clients · Setup in 5 minutes
          </p>
        </motion.div>
      </div>
    </section>
  );
}
