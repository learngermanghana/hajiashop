import Link from "next/link";
import { notFound } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { getCatalogData } from "@/lib/catalog";
import { formatCurrency } from "@/lib/helpers";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { products } = await getCatalogData();
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);

  if (!product) {
    notFound();
  }

  const related = products.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 3);
  const message = `Hello Hajia Slay Shop, I want to order ${product.name} (${formatCurrency(
    product.price,
    product.currency
  )}). Is it available?`;

  return (
    <section className="container-shell py-14">
      <Link href="/shop" className="text-sm text-brand-700">
        ← Back to Shop
      </Link>
      <div className="mt-6 grid gap-8 md:grid-cols-2">
        <div>
          <img src={product.image} alt={product.name} className="h-96 w-full rounded-2xl object-cover" />
          {product.gallery?.length ? (
            <div className="mt-3 grid grid-cols-4 gap-2">
              {product.gallery.map((image) => (
                <img key={image} src={image} alt={product.name} className="h-20 w-full rounded-lg object-cover" />
              ))}
            </div>
          ) : null}
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-700">{product.type}</p>
          <h1 className="mt-2 text-3xl font-bold">{product.name}</h1>
          <p className="mt-3 text-2xl font-semibold text-brand-900">{formatCurrency(product.price, product.currency)}</p>
          <p className="mt-4 text-gray-700">{product.description}</p>
          <p className="mt-4 text-sm text-gray-600">Availability: {product.inStock ? "In stock" : "Out of stock"}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full bg-pink-50 px-3 py-1 text-xs font-semibold text-brand-700">{product.category}</span>
            {product.tags?.map((tag) => (
              <span key={tag} className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
                #{tag}
              </span>
            ))}
          </div>
          <a
            href={buildWhatsAppLink(message)}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-block rounded-full bg-green-500 px-6 py-3 font-semibold text-white"
          >
            Order via WhatsApp
          </a>
        </div>
      </div>
      <div className="mt-16">
        <h2 className="mb-5 text-2xl font-semibold">Related products</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {related.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
