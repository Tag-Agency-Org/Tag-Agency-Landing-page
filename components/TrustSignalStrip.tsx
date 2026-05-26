import Image from "next/image";
import { suppliedClientLogoFiles } from "@/lib/site-data";
import { ScrollReveal } from "./ScrollReveal";

type Props = {
  assets: Record<string, boolean>;
};

const signals = [
  "Meta Ads and Google Ads Focus",
  "Lead Generation Funnel Strategy",
  "Campaign Testing and Optimisation",
  "Conversion-Focused Decision Making"
];

export function TrustSignalStrip({ assets }: Props) {
  const logos = suppliedClientLogoFiles.filter((filename) => assets[filename]);

  return (
    <section className="border-y border-white/10 bg-[#101B27] py-12">
      <div className="container">
        <ScrollReveal>
        <h2 className="font-[var(--font-manrope)] text-2xl font-extrabold">
          Specialised Performance Marketing for Growth-Focused Businesses
        </h2>
        </ScrollReveal>
        <div className="mt-7 grid gap-3 md:grid-cols-4">
          {signals.map((signal, index) => (
            <ScrollReveal key={signal} delay={index * 0.05}>
            <div className="rounded-md border border-white/10 bg-white/[0.035] p-4 text-sm font-bold text-[#F5F3EE] transition hover:border-[#D6A64F]/30 hover:bg-white/[0.06]">
              {signal}
            </div>
            </ScrollReveal>
          ))}
        </div>
        <ScrollReveal className="mt-10">
          <p className="text-sm font-bold uppercase tracking-[0.12em] text-[#AFBAC7]">
            Businesses Featured in Our Current Portfolio
          </p>
          {logos.length ? (
            <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {logos.map((logo) => (
                <div
                  key={logo}
                  className="logo-tile flex h-24 items-center justify-center rounded-md border border-white/10 bg-white p-5"
                >
                  <Image
                    src={`/assets/tag-agency/${logo}`}
                    alt="TAG Agency client logo"
                    width={150}
                    height={70}
                    className="max-h-16 w-auto object-contain"
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 rounded-md border border-white/10 bg-white/[0.03] p-5 text-sm text-[#AFBAC7]">
              Approved client logos are pending. No client logos are displayed until supplied and approved.
            </p>
          )}
        </ScrollReveal>
      </div>
    </section>
  );
}
