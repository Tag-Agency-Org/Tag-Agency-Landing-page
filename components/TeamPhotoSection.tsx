import Image from "next/image";
import { ScrollReveal } from "./ScrollReveal";

const teamPhotoPath = "/team-image.jpeg";

export function TeamPhotoSection() {
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
            <Image
              src={teamPhotoPath}
              alt="TAG Agency team"
              fill
              sizes="(min-width: 1280px) 1180px, 100vw"
              className="object-contain md:object-cover"
              priority={false}
            />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
