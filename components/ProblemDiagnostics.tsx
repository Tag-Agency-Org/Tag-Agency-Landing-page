import { ArrowRight } from "lucide-react";

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
        <div>
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
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {diagnostics.map((item, index) => (
            <article key={item.title} className="light-panel rounded-md p-6">
              <div className="flex items-center justify-between border-b border-[#14202B]/10 pb-5">
                <span className="text-xs font-extrabold tracking-[0.14em] text-[#3E86F5]">{item.label}</span>
                <span className="font-[var(--font-manrope)] text-sm font-extrabold text-[#D6A64F]">0{index + 1}</span>
              </div>
              <h3 className="mt-6 font-[var(--font-manrope)] text-2xl font-extrabold">{item.title}</h3>
              <p className="mt-3 leading-7 text-[#465464]">{item.copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
