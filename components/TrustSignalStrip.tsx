import Image from "next/image";
import { suppliedClientLogoFiles } from "@/lib/site-data";
import { ScrollReveal } from "./ScrollReveal";

type Props = {
  assets: Record<string, boolean>;
};

export function TrustSignalStrip({ assets }: Props) {
  const logos = suppliedClientLogoFiles.filter((filename) => assets[filename]);
  const logoRows = [logos, logos, logos];

  return (
    <section className="border-y border-white/10 bg-[#101B27] py-12">
      <div className="container">
        <ScrollReveal className="text-center">
          <h2 className="font-[var(--font-manrope)] text-3xl font-extrabold text-[#F5F3EE] md:text-4xl">
            Our Clients
          </h2>
          {logos.length ? (
            <div className="mt-5 grid gap-4" aria-label="TAG Agency client logo showcase">
              {logoRows.map((row, rowIndex) => (
                <div key={rowIndex} className="logo-marquee">
                  <div className={`logo-marquee-track ${rowIndex === 1 ? "reverse" : ""}`}>
                    {[...row, ...row].map((logo, index) => (
                      <LogoTile key={`${rowIndex}-${logo}-${index}`} logo={logo} />
                    ))}
                  </div>
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

function LogoTile({ logo }: { logo: string }) {
  return (
    <div className="logo-tile flex h-24 items-center justify-center rounded-md border border-white/10 bg-white p-5">
      <Image
        src={`/assets/tag-agency/${logo}`}
        alt="TAG Agency client logo"
        width={150}
        height={70}
        className="max-h-16 w-auto object-contain"
      />
    </div>
  );
}
