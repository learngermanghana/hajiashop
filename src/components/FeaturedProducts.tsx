import Link from "next/link";
import SectionTitle from "@/components/SectionTitle";
import { formatCurrency } from "@/lib/helpers";
import { getCatalogData } from "@/lib/catalog";
import { fetchSedifexTopSelling } from "@/lib/sedifex";

export default async function FeaturedProducts() {
  const { products } = await getCatalogData();
  const topSelling = await fetchSedifexTopSelling(30, 10);
  const topSellingById = new Map(topSelling.map((item) => [item.productId, item]));
  const topSellingByName = new Map(topSelling.map((item) => [item.name.toLowerCase(), item]));

  const bestSellers = products
    .map((product) => {
      const metrics = topSellingById.get(product.id) ?? topSellingByName.get(product.name.toLowerCase());
      return {
        product,
        qtySold: metrics?.qtySold ?? 0,
        grossSales: metrics?.grossSales ?? 0,
        lastSoldAt: metrics?.lastSoldAt
      };
    })
    .sort((a, b) => b.qtySold - a.qtySold || b.grossSales - a.grossSales)
    .slice(0, 4);

  const hasLiveSales = topSelling.length > 0;

  return (
    <section className="container-shell py-16">
      <SectionTitle
        eyebrow="Best Sellers"
        title="Top selling products"
        description={
          hasLiveSales
            ? "Live sales from the last 30 days, updated from your Sedifex store."
            : "Popular customer favorites from our trusted beauty collection."
        }
      />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {bestSellers.map(({ product, lastSoldAt }) => (
          <article key={product.id} className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm hover:shadow-md">
            <img src={product.image} alt={product.name} className="h-56 w-full rounded-xl object-cover" />
            <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-brand-700">{product.type}</p>
            <h3 className="mt-1 text-lg font-semibold">{product.name}</h3>
            <p className="mt-2 text-sm text-gray-600">{product.shortDescription}</p>
            <div className="mt-4 flex items-center justify-between">
              <p className="font-semibold text-brand-900">{formatCurrency(product.price, product.currency)}</p>
              <Link href={`/shop/${product.slug}`} className="text-sm font-medium text-brand-700">
                View details
              </Link>
            </div>
            {lastSoldAt ? (
              <dl className="mt-4 space-y-1 rounded-xl bg-pink-50 p-3 text-xs text-gray-700">
                <div className="flex items-center justify-between">
                  <dt>Last sold</dt>
                  <dd className="font-semibold">{new Date(lastSoldAt).toLocaleDateString("en-US")}</dd>
                </div>
              </dl>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}
