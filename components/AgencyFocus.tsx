import { ScrollReveal } from "./ScrollReveal";
import { BarChart3, Crosshair, Gauge, Radar } from "lucide-react";

type Props = {
  assets: Record<string, boolean>;
};

export function AgencyFocus({ assets }: Props) {
  void assets;

  return (
    <section id="about" className="section relative overflow-hidden bg-[#F7F5F0] text-[#14202B]">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D6A64F]/60 to-transparent" />
      <div className="container">
        <ScrollReveal className="mx-auto max-w-4xl text-center">
          <p className="eyebrow">About TAG Agency</p>
          <h2 className="mt-4 font-[var(--font-manrope)] text-3xl font-extrabold leading-tight md:text-5xl">
            A Performance Agency Built Around Focus
          </h2>
          <p className="mt-6 text-base leading-7 text-[#465464] md:text-lg md:leading-8">
            TAG Agency is a digital marketing agency focused on helping businesses grow through specialised paid
            advertising strategies. Our approach combines campaign execution, audience understanding, controlled testing
            and conversion-focused thinking to support real business growth.
          </p>
          <p className="mx-auto mt-8 max-w-3xl border-l-2 border-[#D6A64F] pl-5 text-left font-[var(--font-manrope)] text-xl font-extrabold md:text-2xl">
            Less noise. Better targeting. Smarter growth.
          </p>
          <div className="mt-8 grid gap-3 text-left sm:grid-cols-2 lg:grid-cols-4">
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
