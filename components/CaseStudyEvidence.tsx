import { ArrowRight } from "lucide-react";
import { ScrollReveal } from "./ScrollReveal";

export function CaseStudyEvidence() {
  return (
    <section id="results" className="section bg-[#101B27]">
      <div className="container grid gap-10 lg:grid-cols-[0.82fr_1.18fr]">
        <ScrollReveal>
          <p className="eyebrow">Verified evidence only</p>
          <h2 className="mt-4 font-[var(--font-manrope)] text-4xl font-extrabold leading-tight md:text-5xl">
            Performance Should Be Measured, Not Assumed
          </h2>
          <p className="mt-5 text-lg leading-8 text-[#AFBAC7]">
            Strong advertising decisions begin with clear objectives, reliable measurement and an honest review of what
            the numbers mean for the business.
          </p>
          <a href="#contact" className="button button-primary mt-8">
            Discuss a Similar Growth Challenge <ArrowRight size={18} />
          </a>
        </ScrollReveal>
        <ScrollReveal delay={0.08}>
        <article className="panel rounded-lg p-6 md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#D6A64F]">Lead Generation Campaign</p>
              <h3 className="mt-3 font-[var(--font-manrope)] text-3xl font-extrabold">Featured case-study template</h3>
            </div>
            <span className="rounded-full border border-[#D6A64F]/30 bg-[#D6A64F]/10 px-4 py-2 text-xs font-bold text-[#D6A64F]">
              Needs approval
            </span>
          </div>
          <dl className="mt-7 grid gap-4 md:grid-cols-2">
            {[
              ["Industry", "[VERIFY BEFORE PUBLISHING]"],
              ["Platform", "[VERIFY BEFORE PUBLISHING]"],
              ["Objective", "Generate enquiries through paid advertising"]
            ].map(([label, value]) => (
              <div key={label} className="rounded-md border border-white/10 bg-white/[0.035] p-4">
                <dt className="text-xs font-bold uppercase tracking-[0.12em] text-[#AFBAC7]">{label}</dt>
                <dd className="mt-2 font-bold">{value}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {["Leads Generated", "Advertising Spend", "Cost Per Lead"].map((label) => (
              <div key={label} className="rounded-md border border-white/10 bg-[#09111A] p-4">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#AFBAC7]">{label}</p>
                <p className="mt-3 text-sm font-extrabold text-[#D6A64F]">[VERIFY BEFORE PUBLISHING]</p>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-md border border-white/10 bg-white/[0.035] p-5">
            <p className="text-sm font-bold text-[#F5F3EE]">Strategy Summary</p>
            <p className="mt-3 leading-7 text-[#AFBAC7]">
              This case-study area should explain the targeting direction, campaign approach and conversion objective
              only after the business details and numbers have been approved for publication.
            </p>
          </div>
        </article>
        </ScrollReveal>
      </div>
    </section>
  );
}
