import { ScrollReveal } from "./ScrollReveal";

const results = [
  {
    value: "₹2+ CRORE",
    label: "Ad Spend Managed",
    copy: "Built with strategic campaigns across Meta & Google."
  },
  {
    value: "1,00,000+",
    label: "Leads Generated for Real Estate",
    copy: ""
  },
  {
    value: "₹50+ CRORE",
    label: "Business Generated",
    copy: "Performance-driven marketing that delivers measurable growth.",
    featured: true
  },
  {
    value: "6,00,000+ SQ. FT.",
    label: "Successfully Sold",
    copy: "Turning projects into high-converting opportunities."
  },
  {
    value: "60+",
    label: "Trusted Clients",
    copy: "Real estate brands that trusted TAG to scale their business."
  }
];

export function RealEstateResults() {
  return (
    <section id="results" className="section relative overflow-hidden bg-[#09111A]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(62,134,245,0.18),transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.035),transparent_45%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#3E86F5]/70 to-transparent" />
      <div className="container relative">
        <ScrollReveal className="mx-auto max-w-4xl text-center">
          <p className="eyebrow">Real Estate Performance</p>
          <h2 className="mt-4 font-[var(--font-manrope)] text-3xl font-extrabold leading-tight text-[#F5F3EE] md:text-5xl">
            Performance Marketing for Modern Real Estate Brands
          </h2>
          <p className="mt-5 text-base leading-7 text-[#AFBAC7] md:text-lg md:leading-8">
            Know what we achieved in Hubballi over the last few months?
          </p>
        </ScrollReveal>
        <div className="mt-12 grid gap-5 lg:grid-cols-6">
          {results.map((result, index) => (
            <ScrollReveal key={result.label} delay={index * 0.05} className={result.featured ? "lg:col-span-2 lg:row-span-2" : "lg:col-span-2"}>
              <article
                className={`panel group relative h-full min-h-[210px] overflow-hidden rounded-lg p-5 md:p-6 ${
                  result.featured ? "border-[#3E86F5]/40 bg-[#3E86F5]/10 shadow-[0_28px_90px_rgba(62,134,245,0.18)] md:p-8" : ""
                }`}
              >
                <span className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-[#3E86F5]/80 to-transparent opacity-80" />
                <span className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-[#3E86F5]/10 blur-3xl transition group-hover:bg-[#3E86F5]/16" />
                <div className="relative flex h-full flex-col">
                  <p
                    className={`font-[var(--font-manrope)] font-extrabold leading-none text-[#F5F3EE] ${
                      result.featured ? "text-[2.75rem] md:text-6xl" : "text-[2.35rem] md:text-5xl"
                    }`}
                  >
                    {result.value}
                  </p>
                  <h3 className={`mt-5 font-[var(--font-manrope)] font-extrabold text-[#F5F3EE] ${result.featured ? "text-2xl" : "text-xl"}`}>
                    {result.label}
                  </h3>
                  {result.copy ? <p className="mt-4 leading-7 text-[#AFBAC7]">{result.copy}</p> : null}
                  <span className="signal-pulse mt-auto block h-px origin-left bg-gradient-to-r from-[#3E86F5] via-[#D6A64F] to-transparent" />
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
