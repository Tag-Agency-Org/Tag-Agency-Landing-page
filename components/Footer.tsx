import Image from "next/image";
import { facebookProfileUrl, instagramProfileUrl, phoneHref, phoneNumber, whatsAppHref } from "@/lib/site-data";

type Props = {
  hasLogo: boolean;
};

const company = ["About", "Results", "Contact"];
const services = ["Meta Ads Management", "Google Ads Management", "Lead Generation Funnels", "Campaign Audit"];

export function Footer({ hasLogo }: Props) {
  void hasLogo;

  return (
    <footer className="bg-[#F7F5F0] py-12 text-[#14202B]">
      <div className="container grid gap-8 lg:grid-cols-[1.1fr_0.7fr_0.8fr_0.7fr_1fr]">
        <div>
          <p className="max-w-sm leading-7 text-[#465464]">
            Specialised Meta Ads, Google Ads and lead generation strategy for growth-focused businesses.
          </p>
          <div className="mt-5 grid gap-2 text-sm font-bold">
            <a href={phoneHref}>Call: {phoneNumber}</a>
            <a href={whatsAppHref} target="_blank" rel="noreferrer">
              WhatsApp: {phoneNumber}
            </a>
            <div className="mt-3 flex items-center gap-3">
              <a
                href={facebookProfileUrl}
                target="_blank"
                rel="noreferrer"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-[#14202B]/10 bg-white p-2 shadow-sm transition hover:-translate-y-0.5 hover:border-[#3E86F5]/40 hover:shadow-md"
                aria-label="TAG Agency Facebook profile"
              >
                <Image src="/assets/tag-agency/facebook.png" alt="" width={28} height={28} className="h-7 w-7 object-contain" />
              </a>
              <a
                href={instagramProfileUrl}
                target="_blank"
                rel="noreferrer"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-[#14202B]/10 bg-white p-2 shadow-sm transition hover:-translate-y-0.5 hover:border-[#3E86F5]/40 hover:shadow-md"
                aria-label="TAG Agency Instagram profile"
              >
                <Image src="/assets/tag-agency/instagram.png" alt="" width={28} height={28} className="h-7 w-7 object-contain" />
              </a>
            </div>
          </div>
        </div>
        <FooterColumn title="Company" items={company} />
        <FooterColumn title="Services" items={services} />
        <FooterColumn title="Legal" items={["Privacy Policy", "Terms of Use"]} />
        <div>
          <h3 className="text-sm font-extrabold uppercase tracking-[0.12em]">Branches</h3>
          <div className="mt-4 grid gap-4 text-sm leading-6 text-[#465464]">
            <address className="not-italic">
              <p className="font-extrabold text-[#14202B]">Bangalore Branch</p>
              <p>#1117, 2nd Floor, 5th Gate, Manyata Tech Park, Bengaluru North - 560077</p>
            </address>
            <address className="not-italic">
              <p className="font-extrabold text-[#14202B]">Hubli Branch</p>
              <p>Marvel Artiza Opp KMC hospital Shop No 126 Vidyanagar Hubbbali - 580021</p>
            </address>
          </div>
        </div>
      </div>
      <div className="container mt-10 border-t border-[#14202B]/12 pt-6 text-sm text-[#465464]">
        &copy; {new Date().getFullYear()} TAG Agency. All Rights Reserved.
      </div>
    </footer>
  );
}

function FooterColumn({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="min-w-0">
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
