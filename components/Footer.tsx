import Image from "next/image";
import { phoneHref, phoneNumber, whatsAppHref } from "@/lib/site-data";

type Props = {
  hasLogo: boolean;
};

const company = ["About", "Results", "Contact"];
const services = ["Meta Ads Management", "Google Ads Management", "Lead Generation Funnels", "Campaign Audit"];

export function Footer({ hasLogo }: Props) {
  return (
    <footer className="bg-[#F7F5F0] py-12 text-[#14202B]">
      <div className="container grid gap-8 lg:grid-cols-[1.1fr_0.7fr_0.8fr_0.7fr]">
        <div>
          {hasLogo ? (
            <span className="inline-flex rounded-md bg-[#14202B] p-3">
              <Image
                src="/assets/tag-agency/tag-agency-logo-cropped.png"
                alt="TAG Agency"
                width={180}
                height={44}
                className="max-h-9 w-auto object-contain"
              />
            </span>
          ) : (
            <p className="font-[var(--font-manrope)] text-xl font-extrabold">TAG Agency</p>
          )}
          <p className="mt-5 max-w-sm leading-7 text-[#465464]">
            Specialised Meta Ads, Google Ads and lead generation strategy for growth-focused businesses.
          </p>
          <div className="mt-5 grid gap-2 text-sm font-bold">
            <a href={phoneHref}>Call: {phoneNumber}</a>
            <a href={whatsAppHref} target="_blank" rel="noreferrer">
              WhatsApp: {phoneNumber}
            </a>
          </div>
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
