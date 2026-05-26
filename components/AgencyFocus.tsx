import Image from "next/image";
import { MissingAssetPlaceholder } from "./MissingAssetPlaceholder";
import { ScrollReveal } from "./ScrollReveal";

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
    <section id="about" className="section bg-[#F7F5F0] text-[#14202B]">
      <div className="container grid gap-10 lg:grid-cols-2 lg:items-center">
        <ScrollReveal className="overflow-hidden rounded-lg border border-[#14202B]/12">
          {image ? (
            <Image
              src={`/assets/tag-agency/${image}`}
              alt="TAG Agency strategy session"
              width={900}
              height={680}
              className="h-full w-full object-cover"
            />
          ) : (
            <MissingAssetPlaceholder filename="tag-agency-strategy-session.webp or tag-agency-team.webp" tone="light" label="About image pending" />
          )}
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
        </ScrollReveal>
      </div>
    </section>
  );
}
