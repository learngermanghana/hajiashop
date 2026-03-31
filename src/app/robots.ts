import { MetadataRoute } from "next";
import { siteConfig } from "@/data/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/", "/_next/"]
      }
    ],
    sitemap: [`${siteConfig.baseUrl}/sitemap.xml`],
    host: siteConfig.baseUrl
  };
}
