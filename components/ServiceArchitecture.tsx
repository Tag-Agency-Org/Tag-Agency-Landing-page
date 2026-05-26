import { CheckCircle2 } from "lucide-react";
import { ScrollReveal } from "./ScrollReveal";

const services = [
  {
    title: "Meta Ads Management",
    copy: "Strategic Facebook and Instagram campaigns designed to test the right messages, reach relevant audiences and generate stronger enquiry opportunities.",
    capabilities: ["Audience strategy", "Creative testing", "Retargeting pathways", "Lead form campaigns", "Performance optimisation"]
  },
  {
    title: "Google Ads Management",
    copy: "Intent-driven advertising designed to capture active demand through structured search campaigns, call-focused actions and conversion tracking.",
    capabilities: ["Search campaign structure", "Keyword strategy", "Call-focused campaigns", "Conversion measurement", "Search-term optimisation"]
  },
  {
    title: "Lead Generation Funnels",
    copy: "A connected enquiry journey that aligns your ads, landing experience and conversion actions around qualified lead generation.",
    capabilities: ["Funnel mapping", "Landing-page planning", "CTA improvement", "Lead-capture strategy", "Enquiry quality review"]
  },
  {
    title: "Campaign Audit and Strategy",
    copy: "A structured review of targeting, creative direction, tracking, funnel logic and budget allocation to uncover missed opportunities.",
    capabilities: ["Account review", "Targeting review", "Funnel diagnosis", "Budget observations", "Recommended roadmap"]
  },
  {
    title: "Creative Production",
    copy: "Campaign-focused visual production designed to help communicate value clearly across digital advertising placements.",
    capabilities: ["[VERIFY BEFORE PUBLISHING]", "Product photography", "Video production", "Ad creative direction"]
  }
];

export function ServiceArchitecture() {
  return (
    <section id="services" className="section bg-[#09111A]">
      <div className="container">
        <ScrollReveal className="max-w-3xl">
          <p className="eyebrow">Performance architecture</p>
          <h2 className="mt-4 font-[var(--font-manrope)] text-4xl font-extrabold leading-tight md:text-5xl">
            Specialised Services Built Around Lead Generation
          </h2>
          <p className="mt-5 text-lg leading-8 text-[#AFBAC7]">
            We combine platform expertise with conversion thinking so advertising decisions are connected to the quality
            of opportunities your business receives.
          </p>
        </ScrollReveal>
        <div className="mt-12 grid gap-5 lg:grid-cols-12">
          {services.slice(0, 2).map((service) => (
            <ServicePanel key={service.title} service={service} featured />
          ))}
          {services.slice(2).map((service) => (
            <ServicePanel key={service.title} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ServicePanel({
  service,
  featured = false
}: {
  service: { title: string; copy: string; capabilities: string[] };
  featured?: boolean;
}) {
  return (
    <ScrollReveal className={featured ? "lg:col-span-6" : "lg:col-span-4"}>
    <article className="panel h-full rounded-lg p-6">
      <div className="flex h-full flex-col">
        <span className="h-1 w-16 rounded-full bg-[#D6A64F]" />
        <h3 className="mt-6 font-[var(--font-manrope)] text-2xl font-extrabold">{service.title}</h3>
        <p className="mt-4 leading-7 text-[#AFBAC7]">{service.copy}</p>
        <ul className="mt-6 grid gap-3 text-sm">
          {service.capabilities.map((capability) => (
            <li key={capability} className="flex gap-3">
              <CheckCircle2 className="mt-0.5 shrink-0 text-[#269B71]" size={17} />
              <span>{capability}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
    </ScrollReveal>
  );
}
