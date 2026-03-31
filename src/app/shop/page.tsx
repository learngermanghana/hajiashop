import ProductGrid from "@/components/ProductGrid";
import SectionTitle from "@/components/SectionTitle";
import { productCategories, products } from "@/data/products";

export default function ShopPage() {
  return (
    <section className="container-shell py-14">
      <SectionTitle
        eyebrow="Shop"
        title="Find your perfect beauty essentials"
        description="Search products by name, type, and category."
      />
      <ProductGrid products={products} categories={productCategories} />
    </section>
  );
}
