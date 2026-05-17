import type { Metadata } from "next";
import ProductGrid from "@/components/ProductGrid";
import SectionTitle from "@/components/SectionTitle";
import { siteConfig } from "@/data/site";
import { getCatalogData } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Shop Cosmetics, Skincare & Body Wash in Accra",
  description:
    "Browse Hajia Slay Shop products in Accra: skincare, body wash, glow products, makeup and premium beauty essentials. Verified on Sedifex Market with secure checkout.",
  alternates: {
    canonical: `${siteConfig.baseUrl}/shop`
  },
  openGraph: {
    title: "Shop Beauty Products in Accra | Hajia Slay Shop",
    description:
      "Find cosmetics, skincare, body wash and beauty essentials from Hajia Slay Shop, verified on Sedifex Market.",
    url: `${siteConfig.baseUrl}/shop`,
    type: "website"
  }
};

export default async function ShopPage() {
  const { products, categories } = await getCatalogData();

  return (
    <section className="container-shell py-14">
      <SectionTitle
        eyebrow="Shop Accra beauty essentials"
        title="Find your perfect cosmetics, skincare and body care products"
        description="Search trusted Hajia Slay Shop products by name, type and category. Verified on Sedifex Market with secure online checkout."
      />
      <ProductGrid products={products} categories={categories} />
    </section>
  );
}
