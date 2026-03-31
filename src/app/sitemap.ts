import { MetadataRoute } from "next";
import { products } from "@/data/products";
import { siteConfig } from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/about", "/shop", "/gallery", "/contact", "/faq"].map((route) => ({
    url: `${siteConfig.baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const
  }));

  const productRoutes = products.map((product) => ({
    url: `${siteConfig.baseUrl}/shop/${product.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const
  }));

  return [...routes, ...productRoutes];
}
