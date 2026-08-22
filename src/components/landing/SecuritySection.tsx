"use client";

import { motion } from "framer-motion";
import {
  Shield,
  Lock,
  Server,
  Key,
  FileCheck,
  Clock,
} from "lucide-react";

const securityFeatures = [
  {
    icon: <Lock className="h-5 w-5" />,
    title: "End-to-end encryption",
    description:
      "All data encrypted at rest and in transit using AES-256 and TLS 1.3. Your client data never leaves Indian infrastructure.",
  },
  {
    icon: <Shield className="h-5 w-5" />,
    title: "SOC 2 Type II",
    description:
      "Audited security controls covering availability, processing integrity, confidentiality, and privacy.",
  },
  {
    icon: <Key className="h-5 w-5" />,
    title: "Role-based access",
    description:
      "Granular permissions ensure team members only see what they need. Partners control firm-wide access.",
  },
  {
    icon: <Server className="h-5 w-5" />,
    title: "India-hosted",
    description:
      "Data residency in India. Compliant with Indian data protection requirements. No cross-border data transfer.",
  },
  {
    icon: <FileCheck className="h-5 w-5" />,
    title: "Audit trail",
    description:
      "Every action logged with timestamp, user, and IP address. Complete compliance history for regulatory requirements.",
  },
  {
    icon: <Clock className="h-5 w-5" />,
    title: "99.9% uptime SLA",
    description:
      "Enterprise-grade infrastructure with redundant systems. Your compliance operations never go offline.",
  },
];

export function SecuritySection() {
  return (
    <section id="security" className="bg-white py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center mb-14 lg:mb-16">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.4 }}
            className="text-sm font-semibold text-brand-600 uppercase tracking-wider mb-3"
          >
            Security & Trust
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl lg:text-[2.75rem] leading-tight"
          >
            Enterprise-grade security,
            <br className="hidden sm:block" />
            built for compliance
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-4 text-lg text-neutral-600 leading-relaxed"
          >
            Your clients trust you with sensitive financial data. We take that
            trust seriously.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {securityFeatures.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.07, duration: 0.45 }}
              className="rounded-xl border border-neutral-200 bg-white p-6 transition-all duration-200 hover:border-brand-200 hover:shadow-[var(--shadow-card-hover)]"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100 text-neutral-600 mb-4">
                {feature.icon}
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

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-6 lg:gap-10"
        >
          {[
            "SOC 2 Type II",
            "ISO 27001",
            "GDPR Ready",
            "India Data Residency",
            "PCI DSS",
          ].map((badge) => (
            <div
              key={badge}
              className="flex items-center gap-2 text-neutral-400"
            >
              <Shield className="h-4 w-4" />
              <span className="text-sm font-medium">{badge}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
