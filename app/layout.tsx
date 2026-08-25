import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import { leadSiteUrl } from "@/lib/site-data";
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

const ogPreviewImageUrl = `${leadSiteUrl}/assets/tag-agency/og-preview.jpg`;

export const metadata: Metadata = {
  title: "TAG Agency | Meta Ads and Google Ads Lead Generation Agency",
  description:
    "TAG Agency helps businesses generate qualified leads through specialised Meta Ads, Google Ads and conversion-focused digital marketing strategies.",
  metadataBase: new URL(leadSiteUrl),
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "TAG Agency | Meta Ads and Google Ads Lead Generation Agency",
    description:
      "TAG Agency helps businesses generate qualified leads through specialised Meta Ads, Google Ads and conversion-focused digital marketing strategies.",
    url: leadSiteUrl,
    siteName: "TAG Agency",
    images: [
      {
        url: ogPreviewImageUrl,
        width: 1200,
        height: 630,
        alt: "TAG Agency logo social preview"
      }
    ],
    locale: "en_IN",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "TAG Agency | Meta Ads and Google Ads Lead Generation Agency",
    description:
      "TAG Agency helps businesses generate qualified leads through specialised Meta Ads, Google Ads and conversion-focused digital marketing strategies.",
    images: [
      {
        url: ogPreviewImageUrl,
        alt: "TAG Agency logo social preview"
      }
    ]
  },
  icons: {
    icon: [
      {
        url: "/favicon.ico?v=2",
        type: "image/x-icon"
      },
      {
        url: "/favicons/favicon-16x16.png?v=2",
        sizes: "16x16",
        type: "image/png"
      },
      {
        url: "/favicons/favicon-32x32.png?v=2",
        sizes: "32x32",
        type: "image/png"
      }
    ],
    shortcut: "/favicon.ico?v=2",
    apple: [
      {
        url: "/favicons/apple-touch-icon.png?v=2",
        sizes: "180x180",
        type: "image/png"
      }
    ]
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "TAG Agency",
    url: leadSiteUrl,
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
      <head>
        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=AW-18159720115" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'AW-18159720115');
              gtag('config', 'G-M2H0B2WHVD');
            `
          }}
        />
      </head>
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
