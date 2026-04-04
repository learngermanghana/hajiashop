import ProductGrid from "@/components/ProductGrid";
import SectionTitle from "@/components/SectionTitle";
import { getCatalogData } from "@/lib/catalog";

export default async function ShopPage() {
  const { products, categories } = await getCatalogData();

  return (
    <section className="container-shell py-14">
      <SectionTitle
        eyebrow="Shop"
        title="Find your perfect beauty essentials"
        description="Search products by name, type, and category."
      />
      <ProductGrid products={products} categories={categories} />
    </section>
  );
}
