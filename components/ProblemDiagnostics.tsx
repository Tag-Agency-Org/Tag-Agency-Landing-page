"use client";

import { ArrowRight, CornerDownLeft } from "lucide-react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { ScrollReveal } from "./ScrollReveal";

const diagnostics = [
  {
    label: "BUDGET EFFICIENCY",
    title: "High Spend, Low Confidence",
    copy: "You are investing in advertising without clear visibility into what is producing meaningful enquiries."
  },
  {
    label: "LEAD QUALITY",
    title: "Too Many Junk Leads",
    copy: "A high enquiry count means little when your sales team spends time filtering weak or irrelevant leads."
  },
  {
    label: "FUNNEL STRUCTURE",
    title: "No Clear Conversion Path",
    copy: "Campaigns struggle when ads, landing experiences and follow-up journeys operate without a connected strategy."
  },
  {
    label: "DECISION MAKING",
    title: "Reports Without Direction",
    copy: "Data becomes valuable only when it leads to practical campaign decisions and stronger business outcomes."
  }
];

export function ProblemDiagnostics() {
  return (
    <section className="section bg-[#F7F5F0] text-[#14202B]">
      <div className="container grid gap-12 lg:grid-cols-[0.72fr_1.28fr]">
        <ScrollReveal>
          <p className="eyebrow">Diagnostic review</p>
          <h2 className="mt-4 font-[var(--font-manrope)] text-4xl font-extrabold leading-tight md:text-5xl">
            Running Ads Is Easy. Generating the Right Leads Is Not.
          </h2>
          <p className="mt-5 text-lg leading-8 text-[#465464]">
            Advertising becomes expensive when campaigns generate activity without creating dependable business
            opportunities. The problem is rarely one setting. It is usually the connection between targeting, creative,
            intent, tracking and follow-up.
          </p>
          <a href="#contact" className="button button-dark mt-7">
            Talk to a Performance Strategist <ArrowRight size={18} />
          </a>
        </ScrollReveal>
        <motion.div
          className="diagnostic-flow grid gap-4 md:grid-cols-2"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.28 }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.22,
                delayChildren: 0.12
              }
            }
          }}
        >
          {diagnostics.map((item, index) => (
            <motion.article
              key={item.title}
              className="diagnostic-card light-panel rounded-md p-6"
              variants={{
                hidden: { opacity: 0, y: 26, scale: 0.97 },
                visible: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: { duration: 0.52, ease: [0.22, 1, 0.36, 1] }
                }
              }}
            >
              <div className="flex items-center justify-between border-b border-[#14202B]/10 pb-5">
                <span className="text-xs font-extrabold tracking-[0.14em] text-[#3E86F5]">{item.label}</span>
                <span className="font-[var(--font-manrope)] text-sm font-extrabold text-[#D6A64F]">0{index + 1}</span>
              </div>
              <h3 className="mt-6 font-[var(--font-manrope)] text-2xl font-extrabold">{item.title}</h3>
              <p className="mt-3 leading-7 text-[#465464]">{item.copy}</p>
            </motion.article>
          ))}
          <motion.span
            className="diagnostic-flow-arrow diagnostic-flow-arrow-1"
            aria-hidden="true"
            variants={arrowVariants}
          >
            <ArrowRight size={22} />
          </motion.span>
          <motion.span
            className="diagnostic-flow-arrow diagnostic-flow-arrow-2"
            aria-hidden="true"
            variants={arrowVariants}
          >
            <CornerDownLeft size={22} />
          </motion.span>
          <motion.span
            className="diagnostic-flow-arrow diagnostic-flow-arrow-3"
            aria-hidden="true"
            variants={arrowVariants}
          >
            <ArrowRight size={22} />
          </motion.span>
        </motion.div>
      </div>
    </section>
  );
}

const easing = [0.22, 1, 0.36, 1] as const;

const arrowVariants: Variants = {
  hidden: { opacity: 0, scale: 0.78 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.35, ease: easing, delay: 0.22 }
  }
};
