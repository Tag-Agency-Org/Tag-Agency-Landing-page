import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap"
});

export const metadata: Metadata = {
  title: "TAG Agency | Meta Ads and Google Ads Lead Generation Agency",
  description:
    "TAG Agency helps businesses generate qualified leads through specialised Meta Ads, Google Ads and conversion-focused digital marketing strategies.",
  metadataBase: new URL("https://www.tagagency.in"),
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "TAG Agency | Meta Ads and Google Ads Lead Generation Agency",
    description:
      "TAG Agency helps businesses generate qualified leads through specialised Meta Ads, Google Ads and conversion-focused digital marketing strategies.",
    url: "https://www.tagagency.in/",
    siteName: "TAG Agency",
    images: [
      {
        url: "/assets/tag-agency/hero-performance-dashboard.webp",
        width: 1200,
        height: 630,
        alt: "Illustrative campaign signal dashboard for TAG Agency"
      }
    ],
    type: "website"
  },
  icons: {
    icon: "/assets/tag-agency/tag-favicon.png"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "TAG Agency",
    url: "https://www.tagagency.in/",
    telephone: "+91 7411110987",
    address: {
      "@type": "PostalAddress",
      streetAddress: "#1117, 2nd Floor, 5th Gate, Manyata Tech Park",
      addressLocality: "Bengaluru North",
      postalCode: "560077",
      addressCountry: "IN"
    },
    description:
      "TAG Agency is focused on Meta Ads, Google Ads and lead generation funnels."
  };

  return (
    <html lang="en-IN" className={`${inter.variable} ${manrope.variable}`}>
      <body style={{ fontFamily: "var(--font-inter)" }}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        {children}
      </body>
    </html>
  );
}
