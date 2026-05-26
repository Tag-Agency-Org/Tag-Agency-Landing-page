import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { MissingAssetPlaceholder } from "./MissingAssetPlaceholder";
import { ScrollReveal } from "./ScrollReveal";

type Props = {
  assets: Record<string, boolean>;
};

const industries = [
  ["Real Estate", "industry-real-estate.webp", "Generate location-focused enquiries for plots, apartments, projects and site visits through structured targeting and conversion journeys."],
  ["Automobile Dealerships", "industry-automobile.webp", "Capture buyer intent for vehicle enquiries, test drives and local dealership opportunities."],
  ["Education", "industry-education.webp", "Connect prospective students and parents with course, admission and counselling opportunities."],
  ["Healthcare and Wellness", "industry-healthcare.webp", "Create responsible, trust-led enquiry pathways for services that require careful decision making."],
  ["Consumer Brands", "industry-consumer-brand.webp", "Support product discovery and purchase intent through campaign creatives and measurable customer journeys."],
  ["Local and Regional Businesses", "industry-local-business.webp", "Help businesses reach the right audience in the right geography with focused lead-generation campaigns."]
];

export function IndustryUseCases({ assets }: Props) {
  return (
    <section id="industries" className="section bg-[#F7F5F0] text-[#14202B]">
      <div className="container">
        <ScrollReveal className="max-w-3xl">
          <p className="eyebrow">Industry use cases</p>
          <h2 className="mt-4 font-[var(--font-manrope)] text-4xl font-extrabold leading-tight md:text-5xl">
            Lead Generation Challenges Differ by Industry
          </h2>
          <p className="mt-5 text-lg leading-8 text-[#465464]">
            Different businesses need different enquiry journeys. Our campaign approach begins with how your customers
            research, compare and take action.
          </p>
        </ScrollReveal>
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {industries.map(([title, filename, copy], index) => (
            <ScrollReveal key={title} delay={index * 0.04}>
            <article className="h-full overflow-hidden rounded-md border border-[#14202B]/12 bg-white transition hover:-translate-y-1 hover:shadow-xl">
              <div className="relative aspect-[16/10]">
                {assets[filename] ? (
                  <Image src={`/assets/tag-agency/${filename}`} alt={`${title} lead generation use case`} fill className="object-cover" />
                ) : (
                  <MissingAssetPlaceholder filename={filename} tone="light" label="Industry image pending" />
                )}
              </div>
              <div className="p-6">
                <h3 className="font-[var(--font-manrope)] text-xl font-extrabold">{title}</h3>
                <p className="mt-3 leading-7 text-[#465464]">{copy}</p>
              </div>
            </article>
            </ScrollReveal>
          ))}
        </div>
        <a href="#contact" className="button button-dark mt-9">
          See How We Can Help Your Business <ArrowRight size={18} />
        </a>
      </div>
    </section>
  );
}
