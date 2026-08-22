import type { MetadataRoute } from "next";
import { leadSiteUrl } from "@/lib/site-data";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/"
    },
    sitemap: `${leadSiteUrl}/sitemap.xml`
  };
}
