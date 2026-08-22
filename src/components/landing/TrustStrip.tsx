"use client";

import { motion } from "framer-motion";
import { Shield, Award, Building2, Users } from "lucide-react";

const trustItems = [
  {
    icon: <Building2 className="h-5 w-5" />,
    text: "Built for Indian CA firms",
  },
  {
    icon: <Shield className="h-5 w-5" />,
    text: "SOC 2 compliant",
  },
  {
    icon: <Award className="h-5 w-5" />,
    text: "GST & ITR ready",
  },
  {
    icon: <Users className="h-5 w-5" />,
    text: "Trusted by 200+ firms",
  },
];

export function TrustStrip() {
  return (
    <section className="border-y border-neutral-200/60 bg-neutral-50/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 sm:gap-x-12">
          {trustItems.map((item, i) => (
            <motion.div
              key={item.text}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="flex items-center gap-2.5 text-neutral-500"
            >
              <span className="text-neutral-400">{item.icon}</span>
              <span className="text-sm font-medium">{item.text}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
