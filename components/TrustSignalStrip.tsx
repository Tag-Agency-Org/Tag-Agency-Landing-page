import type { ClientLogo } from "@/lib/client-logos";
import { ScrollReveal } from "./ScrollReveal";

type Props = {
  logos: ClientLogo[];
};

export function TrustSignalStrip({ logos }: Props) {
  return (
    <section className="border-y border-white/10 bg-[#101B27] py-12">
      <div className="container">
        <ScrollReveal className="text-center">
          <h2 className="font-[var(--font-manrope)] text-3xl font-extrabold text-[#F5F3EE] md:text-4xl">
            Our Clients
          </h2>
          <div
            className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
            aria-label="TAG Agency client logo showcase"
          >
            {logos.map((logo) => (
              <LogoTile key={logo.filename} logo={logo} />
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

function LogoTile({ logo }: { logo: ClientLogo }) {
  return (
    <div className="logo-tile flex h-24 items-center justify-center rounded-md border border-white/10 bg-white p-5">
      <img
        src={`/client-logos/${logo.filename}`}
        alt={logo.alt}
        width={150}
        height={70}
        loading="lazy"
        decoding="async"
        className="h-auto max-h-16 w-auto max-w-full object-contain"
      />
    </div>
  );
}
