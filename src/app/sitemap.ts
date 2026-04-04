import { MetadataRoute } from "next";
import { getCatalogData } from "@/lib/catalog";
import { siteConfig } from "@/data/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { products } = await getCatalogData();
  const lastModified = new Date();

  const routes: MetadataRoute.Sitemap = [
    {
      url: siteConfig.baseUrl,
      lastModified,
      changeFrequency: "daily",
      priority: 1
    },
    {
      url: `${siteConfig.baseUrl}/shop`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9
    },
    {
      url: `${siteConfig.baseUrl}/about`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8
    },
    {
      url: `${siteConfig.baseUrl}/gallery`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8
    },
    {
      url: `${siteConfig.baseUrl}/faq`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7
    },
    {
      url: `${siteConfig.baseUrl}/contact`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7
    }
  ];

  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${siteConfig.baseUrl}/shop/${product.slug}`,
    lastModified,
    changeFrequency: "weekly",
    priority: 0.85
  }));

  return [...routes, ...productRoutes];
}
