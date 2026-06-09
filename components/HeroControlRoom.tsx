"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { phoneHref } from "@/lib/site-data";

export function HeroControlRoom() {
  return (
    <section id="top" className="relative overflow-hidden bg-[#09111A] pt-28">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_20%,rgba(62,134,245,0.18),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.04),transparent)]" />
      <div className="container relative grid items-center gap-10 py-12 md:min-h-[760px] md:py-16 lg:grid-cols-[0.92fr_1.08fr] lg:gap-12">
        <div className="max-w-3xl">
          <p className="eyebrow">META ADS • GOOGLE ADS • LEAD GENERATION FUNNELS</p>
          <h1 className="mt-5 font-[var(--font-manrope)] text-4xl font-extrabold leading-[1.05] text-[#F5F3EE] sm:text-5xl md:text-7xl">
            Tired of Spending on Ads Without Getting Qualified Leads?
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-[#AFBAC7] md:text-lg md:leading-8">
            TAG Agency helps real estate, automobile, education, healthcare and local businesses generate better
            enquiries through Meta Ads, Google Ads and conversion-focused funnels.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href={phoneHref}
              className="button button-primary attention-pulse"
              aria-label="Call TAG Agency to get a free ad account audit"
            >
              Get a Free Ad account Audit <ArrowRight size={18} />
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
          whileHover={{ y: -4 }}
          className="relative"
          aria-label="TAG Agency Meta Business Partner creative"
        >
          <div className="absolute -inset-8 rounded-full bg-[#3E86F5]/10 blur-3xl" />
          <div className="relative overflow-hidden rounded-lg border border-white/10 bg-[#F7F5F0] shadow-2xl md:rounded-[1.5rem]">
            <Image
              src="/assets/tag-agency/hero-bus-head.png"
              alt="TAG Agency Meta Business Partner performance marketing creative"
              width={1200}
              height={1200}
              priority
              className="h-auto w-full object-contain"
            />
          </div>
          <div className="pointer-events-none absolute inset-0 rounded-lg ring-1 ring-white/10 md:rounded-[1.5rem]" />
        </motion.div>
      </div>
    </section>
  );
}
