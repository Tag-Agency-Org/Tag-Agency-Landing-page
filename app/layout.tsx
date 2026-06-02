import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import { leadSiteUrl, metaPixelId } from "@/lib/site-data";
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
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-KFK7V8JH');
            `
          }}
        />
        {/* End Google Tag Manager */}
        {/* Base Meta Pixel, installed globally so every page view is tracked once. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${metaPixelId}');
              fbq('track', 'PageView');
            `
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src={`https://www.facebook.com/tr?id=${metaPixelId}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>
      </head>
      <body style={{ fontFamily: "var(--font-inter)" }}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-KFK7V8JH"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        {children}
      </body>
    </html>
  );
}
