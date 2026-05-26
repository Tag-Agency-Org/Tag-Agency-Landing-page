"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const steps = [
  ["Understand", "We study your business, audience, margins, current lead challenges and sales process before recommending a direction."],
  ["Strategise", "We identify the right platforms, campaign structure, creative direction and conversion journey for your objective."],
  ["Launch", "Campaigns begin with measurable conversion actions, controlled testing and a clear performance foundation."],
  ["Optimise", "We review campaign patterns and lead quality signals to make practical, evidence-led improvements."],
  ["Scale", "When a campaign system demonstrates consistency, we expand the strongest opportunities responsibly."]
];

export function ProcessTimeline() {
  return (
    <section id="process" className="section bg-[#F7F5F0] text-[#14202B]">
      <div className="container">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-3xl">
            <p className="eyebrow">Decision system</p>
            <h2 className="mt-4 font-[var(--font-manrope)] text-4xl font-extrabold leading-tight md:text-5xl">
              A Clear Process Built Around Better Decisions
            </h2>
          </div>
          <a href="#contact" className="button button-dark">
            Start With a Strategy Discussion <ArrowRight size={18} />
          </a>
        </div>
        <div className="relative mt-14 grid gap-5 lg:grid-cols-5">
          <div className="absolute left-0 top-8 hidden h-px w-full bg-[#14202B]/14 lg:block" />
          {steps.map(([title, copy], index) => (
            <motion.article
              key={title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: index * 0.06 }}
              className="relative rounded-md border border-[#14202B]/12 bg-white p-6"
            >
              <span className="flex h-16 w-16 items-center justify-center rounded-full border border-[#14202B]/14 bg-[#F7F5F0] font-[var(--font-manrope)] text-xl font-extrabold text-[#3E86F5]">
                0{index + 1}
              </span>
              <span className="signal-pulse mt-5 block h-px w-full origin-left bg-gradient-to-r from-[#3E86F5] via-[#D6A64F] to-transparent lg:hidden" />
              <h3 className="mt-8 font-[var(--font-manrope)] text-xl font-extrabold">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-[#465464]">{copy}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
