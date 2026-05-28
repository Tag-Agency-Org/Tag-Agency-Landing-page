import Image from "next/image";
import { MissingAssetPlaceholder } from "./MissingAssetPlaceholder";
import { ScrollReveal } from "./ScrollReveal";

type Props = {
  assets: Record<string, boolean>;
};

const teamPhoto = "tag-agency-team-photo.jpeg";

export function TeamPhotoSection({ assets }: Props) {
  return (
    <section id="team" className="section bg-[#101B27] text-[#F5F3EE]">
      <div className="container">
        <ScrollReveal className="mx-auto max-w-3xl text-center">
          <p className="eyebrow text-[#D6A64F]">The team</p>
          <h2 className="mt-4 font-[var(--font-manrope)] text-3xl font-extrabold leading-tight md:text-5xl">
            The Growth Team Behind TAG Agency
          </h2>
        </ScrollReveal>
        <ScrollReveal delay={0.08} className="mt-10 overflow-hidden rounded-lg border border-white/12 bg-[#09111A] shadow-2xl">
          <div className="relative aspect-[12/5] min-h-[150px] bg-[#09111A] md:min-h-[240px]">
            {assets[teamPhoto] ? (
              <Image
                src={`/assets/tag-agency/${teamPhoto}`}
                alt="TAG Agency team"
                fill
                sizes="(min-width: 1280px) 1180px, 100vw"
                className="object-contain md:object-cover"
                priority={false}
              />
            ) : (
              <MissingAssetPlaceholder filename={teamPhoto} tone="dark" label="Team photo pending" />
            )}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
