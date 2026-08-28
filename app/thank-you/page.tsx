import { ArrowLeft, MessageCircle, PhoneCall } from "lucide-react";
import Link from "next/link";
import Script from "next/script";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { WhatsAppWidget } from "@/components/WhatsAppWidget";
import { collectAssetStatus } from "@/lib/assets";
import { assetFilenames, phoneHref, phoneNumber, suppliedClientLogoFiles, whatsAppHref } from "@/lib/site-data";

export const metadata = {
  title: "Thank You | TAG Agency",
  description: "Thank you for requesting a TAG Agency strategy call."
};

export default function ThankYouPage() {
  const assets = collectAssetStatus([...assetFilenames, ...suppliedClientLogoFiles]);

  return (
    <>
      <Script id="google-ads-submit-lead-conversion" strategy="afterInteractive">
        {`
          gtag('event', 'conversion', {
            'send_to': 'AW-18159720115/VG4ICPnOteccELOtndND',
            'value': 1.0,
            'currency': 'INR'
          });
        `}
      </Script>
      <Header />
      <main className="min-h-screen bg-[#09111A] pt-20">
        <section className="section">
          <div className="container grid gap-10 lg:grid-cols-[0.88fr_0.72fr] lg:items-center">
            <div>
              <p className="eyebrow">Enquiry received</p>
              <h1 className="mt-5 max-w-4xl font-[var(--font-manrope)] text-4xl font-extrabold leading-tight text-[#F5F3EE] md:text-6xl">
                Thank you. Our team will contact you shortly.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-[#AFBAC7]">
                We have received your strategy call request. TAG Agency will review your details and get back to you
                with the next steps.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <a href={phoneHref} className="button button-primary">
                  <PhoneCall size={18} />
                  Call {phoneNumber}
                </a>
                <a href={whatsAppHref} target="_blank" rel="noreferrer" className="button button-secondary">
                  <MessageCircle size={18} />
                  Message on WhatsApp
                </a>
              </div>
              <Link href="/" className="mt-8 inline-flex items-center gap-2 text-sm font-extrabold text-[#D6A64F]">
                <ArrowLeft size={17} />
                Back to homepage
              </Link>
            </div>

            <aside className="panel rounded-lg p-6 md:p-8">
              <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#D6A64F]">What happens next</p>
              <div className="mt-6 grid gap-4">
                {[
                  "Your enquiry details are reviewed by the TAG Agency team.",
                  "We identify the right discussion points for your business and campaign goals.",
                  "A team member contacts you to schedule or continue the strategy conversation."
                ].map((item, index) => (
                  <div key={item} className="rounded-md border border-white/10 bg-white/[0.035] p-4">
                    <p className="text-sm font-extrabold text-[#3E86F5]">Step {index + 1}</p>
                    <p className="mt-2 leading-7 text-[#F5F3EE]">{item}</p>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </section>
      </main>
      <Footer hasLogo={assets["tag-agency-logo-cropped.png"]} />
      <WhatsAppWidget />
    </>
  );
}
