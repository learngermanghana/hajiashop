"use client";

import { useState } from "react";
import Link from "next/link";
import { Product } from "@/data/products";
import { formatCurrency } from "@/lib/helpers";

export default function ProductCard({ product }: { product: Product }) {
  const [qty, setQty] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const createCheckout = async () => {
    if (!name || !email) {
      setStatus("Please add your name and email to continue.");
      return;
    }

    setSubmitting(true);
    setStatus("Preparing secure checkout...");

    try {
      const clientOrderId = `WEB-${product.id}-${Date.now()}`;
      const response = await fetch("/api/sedifex/checkout/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientOrderId,
          orderType: "product",
          currency: product.currency,
          items: [{ id: product.id, name: product.name, unitPrice: product.price, qty }],
          amount: product.price * qty,
          customer: { email, name },
          returnUrl: `${window.location.origin}/shop?checkout_return=1`,
          metadata: { channel: "client-website", purchase_source: "product-card" }
        })
      });

      const data = await response.json();
      if (!response.ok || !data.authorizationUrl) {
        setStatus(data.error ?? "Unable to create hosted checkout.");
        return;
      }

      window.location.href = data.authorizationUrl;
    } catch {
      setStatus("Unable to create hosted checkout.");
    } finally {
      setSubmitting(false);
    }
  };

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

      <div className="mt-4 border-t border-pink-100 pt-4">
        <p className="text-sm font-semibold text-brand-900">Buy now</p>
        <div className="mt-2 grid gap-2">
          <input
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
          />
          <input
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
          />
          <input
            type="number"
            min={1}
            value={qty}
            onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
          />
          <button
            onClick={createCheckout}
            disabled={submitting || !product.inStock}
            className="rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {product.inStock ? (submitting ? "Redirecting..." : "Buy now") : "Out of stock"}
          </button>
        </div>
        {status ? <p className="mt-2 text-xs text-gray-600">{status}</p> : null}
      </div>
    </article>
  );
}
