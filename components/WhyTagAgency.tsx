const differentiators = [
  ["Specialist Focus", "Our focus is centred on Meta Ads, Google Ads and lead generation pathways rather than spreading attention across every possible service."],
  ["Strategy Before Spending", "Campaign recommendations should begin with customer intent, business goals and conversion pathways."],
  ["Testing With Purpose", "Creative, targeting and campaign testing are useful only when they improve decision making and enquiry quality."],
  ["Transparent Improvement", "Reporting should help businesses understand what changed, why it changed and what should happen next."]
];

export function WhyTagAgency() {
  return (
    <section className="section bg-[#09111A]">
      <div className="container grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="eyebrow">Agency focus</p>
          <h2 className="mt-4 font-[var(--font-manrope)] text-4xl font-extrabold leading-tight md:text-5xl">
            Why a Specialist Agency Matters
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {differentiators.map(([title, copy]) => (
            <article key={title} className="panel rounded-md p-6">
              <h3 className="font-[var(--font-manrope)] text-xl font-extrabold">{title}</h3>
              <p className="mt-3 leading-7 text-[#AFBAC7]">{copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
