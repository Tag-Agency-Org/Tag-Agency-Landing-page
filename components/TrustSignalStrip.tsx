import Image from "next/image";

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
  const logos = Array.from({ length: 12 }, (_, index) => `client-logo-${String(index + 1).padStart(2, "0")}.svg`).filter(
    (filename) => assets[filename]
  );

  return (
    <section className="border-y border-white/10 bg-[#101B27] py-12">
      <div className="container">
        <h2 className="font-[var(--font-manrope)] text-2xl font-extrabold">
          Specialised Performance Marketing for Growth-Focused Businesses
        </h2>
        <div className="mt-7 grid gap-3 md:grid-cols-4">
          {signals.map((signal) => (
            <div key={signal} className="rounded-md border border-white/10 bg-white/[0.035] p-4 text-sm font-bold text-[#F5F3EE]">
              {signal}
            </div>
          ))}
        </div>
        <div className="mt-10">
          <p className="text-sm font-bold uppercase tracking-[0.12em] text-[#AFBAC7]">
            Businesses Featured in Our Current Portfolio
          </p>
          {logos.length ? (
            <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {logos.map((logo) => (
                <div key={logo} className="flex h-24 items-center justify-center rounded-md border border-white/10 bg-white/[0.03] p-5 grayscale transition hover:grayscale-0">
                  <Image src={`/assets/tag-agency/${logo}`} alt="Approved TAG Agency client logo" width={140} height={56} />
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 rounded-md border border-white/10 bg-white/[0.03] p-5 text-sm text-[#AFBAC7]">
              Approved client logos are pending. No client logos are displayed until supplied and approved.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
