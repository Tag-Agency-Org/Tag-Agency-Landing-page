import Image from "next/image";

type Props = {
  hasDarkLogo: boolean;
};

const company = ["About", "Results", "Contact"];
const services = ["Meta Ads Management", "Google Ads Management", "Lead Generation Funnels", "Campaign Audit"];

export function Footer({ hasDarkLogo }: Props) {
  return (
    <footer className="bg-[#F7F5F0] py-12 text-[#14202B]">
      <div className="container grid gap-8 lg:grid-cols-[1.1fr_0.7fr_0.8fr_0.7fr]">
        <div>
          {hasDarkLogo ? (
            <Image src="/assets/tag-agency/tag-logo-dark.svg" alt="TAG Agency" width={132} height={42} />
          ) : (
            <p className="font-[var(--font-manrope)] text-xl font-extrabold">TAG Agency</p>
          )}
          <p className="mt-5 max-w-sm leading-7 text-[#465464]">
            Specialised Meta Ads, Google Ads and lead generation strategy for growth-focused businesses.
          </p>
        </div>
        <FooterColumn title="Company" items={company} />
        <FooterColumn title="Services" items={services} />
        <FooterColumn title="Legal" items={["Privacy Policy", "Terms of Use"]} />
      </div>
      <div className="container mt-10 border-t border-[#14202B]/12 pt-6 text-sm text-[#465464]">
        © {new Date().getFullYear()} TAG Agency. All Rights Reserved.
      </div>
    </footer>
  );
}

function FooterColumn({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="text-sm font-extrabold uppercase tracking-[0.12em]">{title}</h3>
      <ul className="mt-4 grid gap-3 text-sm font-semibold text-[#465464]">
        {items.map((item) => (
          <li key={item}>
            <a href={item === "Contact" ? "#contact" : item === "About" ? "#about" : item === "Results" ? "#results" : "#services"}>
              {item}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
