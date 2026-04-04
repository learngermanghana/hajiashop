import ProductCard from "@/components/ProductCard";
import SectionTitle from "@/components/SectionTitle";
import { getCatalogData } from "@/lib/catalog";

export default async function FeaturedProducts() {
  const { products } = await getCatalogData();
  const featured = products.filter((product) => product.featured).slice(0, 4);

  return (
    <section className="container-shell py-16">
      <SectionTitle
        eyebrow="Best Sellers"
        title="Featured products"
        description="Discover customer favorites from our trusted beauty collection."
      />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {featured.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
