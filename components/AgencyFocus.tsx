import Image from "next/image";
import { MissingAssetPlaceholder } from "./MissingAssetPlaceholder";
import { ScrollReveal } from "./ScrollReveal";
import { BarChart3, Crosshair, Gauge, Radar } from "lucide-react";

type Props = {
  assets: Record<string, boolean>;
};

export function AgencyFocus({ assets }: Props) {
  const image = assets["tag-agency-strategy-session.webp"]
    ? "tag-agency-strategy-session.webp"
    : assets["tag-agency-team.webp"]
      ? "tag-agency-team.webp"
      : "";

  return (
    <section id="about" className="section relative overflow-hidden bg-[#F7F5F0] text-[#14202B]">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D6A64F]/60 to-transparent" />
      <div className="container grid gap-10 lg:grid-cols-[1.04fr_0.96fr] lg:items-center">
        <ScrollReveal className="relative overflow-hidden rounded-lg border border-[#14202B]/12 bg-[#101B27] p-4 shadow-2xl">
          <div className="absolute left-5 top-5 z-10 rounded-full border border-white/15 bg-[#09111A]/80 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.14em] text-[#D6A64F] backdrop-blur">
            Focus System
          </div>
          <div className="relative overflow-hidden rounded-md">
            {image ? (
              <Image
                src={`/assets/tag-agency/${image}`}
                alt="TAG Agency strategy session"
                width={900}
                height={680}
                className="h-full min-h-[440px] w-full object-cover opacity-75 grayscale"
              />
            ) : (
              <MissingAssetPlaceholder filename="tag-agency-strategy-session.webp or tag-agency-team.webp" tone="dark" label="About image pending" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#09111A] via-[#09111A]/28 to-transparent" />
          </div>
          <div className="absolute bottom-6 left-6 right-6 grid gap-3 sm:grid-cols-3">
            {[
              ["01", "Audience"],
              ["02", "Testing"],
              ["03", "Conversion"]
            ].map(([number, label]) => (
              <div key={label} className="rounded-md border border-white/10 bg-[#09111A]/86 p-4 text-[#F5F3EE] backdrop-blur">
                <span className="text-xs font-extrabold text-[#3E86F5]">{number}</span>
                <p className="mt-1 text-sm font-extrabold">{label}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
        <ScrollReveal delay={0.08}>
          <p className="eyebrow">About TAG Agency</p>
          <h2 className="mt-4 font-[var(--font-manrope)] text-4xl font-extrabold leading-tight md:text-5xl">
            A Performance Agency Built Around Focus
          </h2>
          <p className="mt-6 text-lg leading-8 text-[#465464]">
            TAG Agency is a digital marketing agency focused on helping businesses grow through specialised paid
            advertising strategies. Our approach combines campaign execution, audience understanding, controlled testing
            and conversion-focused thinking to support real business growth.
          </p>
          <p className="mt-8 border-l-2 border-[#D6A64F] pl-5 font-[var(--font-manrope)] text-2xl font-extrabold">
            Less noise. Better targeting. Smarter growth.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {[
              [Crosshair, "Sharper targeting decisions"],
              [Radar, "Signal-led campaign review"],
              [Gauge, "Controlled optimisation rhythm"],
              [BarChart3, "Performance conversations with context"]
            ].map(([Icon, label], index) => {
              const TypedIcon = Icon as typeof Crosshair;
              return (
                <div
                  key={label as string}
                  className="group rounded-md border border-[#14202B]/12 bg-white p-4 transition hover:-translate-y-1 hover:border-[#D6A64F]/50 hover:shadow-xl"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-md bg-[#3E86F5]/10 text-[#3E86F5] transition group-hover:bg-[#D6A64F]/15 group-hover:text-[#14202B]">
                    <TypedIcon size={18} />
                  </span>
                  <p className="mt-3 text-sm font-extrabold">{label as string}</p>
                  <span
                    className="signal-pulse mt-4 block h-px origin-left bg-gradient-to-r from-[#3E86F5] via-[#D6A64F] to-transparent"
                    style={{ animationDelay: `${index * 180}ms` }}
                  />
                </div>
              );
            })}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
