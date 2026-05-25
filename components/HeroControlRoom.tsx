"use client";

import { motion } from "framer-motion";
import { ArrowRight, Gauge, LineChart, Search, ShieldCheck } from "lucide-react";

export function HeroControlRoom() {
  const modules = ["Lead Quality Monitoring", "Creative Testing", "Search Intent Review", "Conversion Tracking"];
  const icons = [Gauge, LineChart, Search, ShieldCheck];

  return (
    <section id="top" className="relative overflow-hidden bg-[#09111A] pt-28">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_20%,rgba(62,134,245,0.18),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.04),transparent)]" />
      <div className="container relative grid min-h-[760px] items-center gap-12 py-16 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="max-w-3xl">
          <p className="eyebrow">META ADS • GOOGLE ADS • LEAD GENERATION FUNNELS</p>
          <h1 className="mt-5 font-[var(--font-manrope)] text-5xl font-extrabold leading-[1.02] text-[#F5F3EE] md:text-7xl">
            Turn Ad Spend Into Qualified Business Opportunities
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#AFBAC7]">
            TAG Agency helps growth-focused businesses improve lead quality, campaign efficiency and acquisition
            strategy through specialised Meta Ads, Google Ads and conversion-focused funnels.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="#contact" className="button button-primary">
              Book a Strategy Call <ArrowRight size={18} />
            </a>
            <a href="#process" className="button button-secondary">
              Explore Our Approach
            </a>
          </div>
          <p className="mt-7 border-l border-[#D6A64F] pl-4 text-sm font-semibold text-[#F5F3EE]">
            Performance marketing built around strategy, testing and measurable decisions.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="panel relative rounded-lg p-4 sm:p-6"
          aria-label="Illustrative campaign signal overview"
        >
          <div className="flex flex-col gap-4 rounded-md border border-white/10 bg-[#101B27]/95 p-4 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#D6A64F]">Campaign Signal Overview</p>
                <h2 className="mt-2 font-[var(--font-manrope)] text-2xl font-extrabold">Quality signal dashboard</h2>
              </div>
              <div className="flex gap-2 text-xs font-bold">
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2">Meta Ads</span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2">Google Ads</span>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {["Enquiry", "Qualified Review", "Sales Follow-up"].map((stage, index) => (
                <motion.div
                  key={stage}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + index * 0.1 }}
                  className="rounded-md border border-white/10 bg-white/[0.04] p-4"
                >
                  <span className="text-xs font-bold text-[#3E86F5]">0{index + 1}</span>
                  <p className="mt-2 text-sm font-bold">{stage}</p>
                </motion.div>
              ))}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {modules.map((module, index) => {
                const Icon = icons[index];
                return (
                  <motion.div
                    key={module}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.08 }}
                    className="flex items-center gap-3 rounded-md border border-white/10 bg-[#09111A] p-4"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-md bg-[#3E86F5]/12 text-[#3E86F5]">
                      <Icon size={18} />
                    </span>
                    <span className="text-sm font-bold">{module}</span>
                  </motion.div>
                );
              })}
            </div>

            <div className="rounded-md border border-white/10 bg-[#07101A] p-4">
              <div className="mb-5 flex items-center justify-between gap-4">
                <p className="text-sm font-bold">Illustrative Campaign View</p>
                <span className="text-xs text-[#AFBAC7]">Sample UI labels only</span>
              </div>
              <div className="flex h-32 items-end gap-2">
                {[36, 52, 44, 68, 58, 78, 72, 88].map((height, index) => (
                  <span
                    key={index}
                    className="flex-1 rounded-t bg-[#3E86F5]/80"
                    style={{ height: `${height}%`, opacity: 0.46 + index * 0.05 }}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
