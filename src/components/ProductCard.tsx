"use client";

import { useState } from "react";
import Link from "next/link";
import { Product } from "@/data/products";
import { formatCurrency } from "@/lib/helpers";
import { addItemToCart } from "@/lib/cart";

export default function ProductCard({ product }: { product: Product }) {
  const [qty, setQty] = useState(1);
  const [status, setStatus] = useState("");

  const addToCart = () => {
    addItemToCart({ id: product.id, qty });
    window.dispatchEvent(new Event("cart:updated"));
    setStatus("Added to cart. Continue shopping or checkout.");
  };

  return (
    <article className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm hover:shadow-md">
      <img src={product.image} alt={product.name} className="h-56 w-full rounded-xl object-cover" />
      <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-brand-700">{product.type}</p>
      <h3 className="mt-1 text-lg font-semibold">{product.name}</h3>
      <p className="mt-2 text-sm text-gray-600">{product.shortDescription}</p>
      <div className="mt-4 flex items-center justify-between"><p className="font-semibold text-brand-900">{formatCurrency(product.price, product.currency)}</p><Link href={`/shop/${product.slug}`} className="text-sm font-medium text-brand-700">View details</Link></div>
      <div className="mt-4 border-t border-pink-100 pt-4">
        <label htmlFor={`qty-${product.id}`} className="text-sm font-semibold text-brand-900">Quantity</label>
        <input id={`qty-${product.id}`} type="number" min={1} value={qty} onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))} className="mt-2 rounded-lg border border-gray-200 px-3 py-3 text-sm min-h-11 w-full" />
        <div className="mt-3 flex gap-2">
          <button onClick={addToCart} disabled={!product.inStock} className="rounded-full bg-brand-600 px-4 py-3 text-sm font-semibold text-white min-h-11">{product.inStock ? "Add to cart" : "Out of stock"}</button>
          <Link href="/checkout" className="rounded-full border px-4 py-3 text-sm min-h-11">Checkout</Link>
        </div>
        {status ? <p className="mt-2 text-xs text-gray-600">{status}</p> : null}
      </div>
    </article>
  );
}
