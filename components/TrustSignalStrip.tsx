import type { ClientLogo } from "@/lib/client-logos";
import { ScrollReveal } from "./ScrollReveal";

type Props = {
  logos: ClientLogo[];
};

export function TrustSignalStrip({ logos }: Props) {
  const logoRows = [logos, logos, logos];

  return (
    <section className="border-y border-white/10 bg-[#101B27] py-12">
      <div className="container">
        <ScrollReveal className="text-center">
          <h2 className="font-[var(--font-manrope)] text-3xl font-extrabold text-[#F5F3EE] md:text-4xl">
            Our Clients
          </h2>
          <div className="mt-5 grid gap-4" aria-label="TAG Agency client logo showcase">
            {logoRows.map((row, rowIndex) => (
              <div key={rowIndex} className="logo-marquee">
                <div className={`logo-marquee-track ${rowIndex === 1 ? "reverse" : ""}`}>
                  {[...row, ...row].map((logo, index) => (
                    <LogoTile key={`${rowIndex}-${logo.filename}-${index}`} logo={logo} />
                  ))}
                </div>
              </div>
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
