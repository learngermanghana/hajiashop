import Link from "next/link";
import { Product } from "@/data/products";
import { formatCurrency } from "@/lib/helpers";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <article className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm hover:shadow-md">
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
    </article>
  );
}
