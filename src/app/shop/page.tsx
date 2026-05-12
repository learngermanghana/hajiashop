import ProductGrid from "@/components/ProductGrid";
import ShopCheckout from "@/components/ShopCheckout";
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
      <ShopCheckout products={products} />
      <ProductGrid products={products} categories={categories} />
    </section>
  );
}
