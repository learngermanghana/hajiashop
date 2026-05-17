"use client";

import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/data/products";
import { addItemToCart } from "@/lib/cart";
import { formatCurrency } from "@/lib/helpers";

export default function ProductCheckoutPanel({ product }: { product: Product }) {
  const [qty, setQty] = useState(1);
  const [cartMessage, setCartMessage] = useState("");
  const [addedToCart, setAddedToCart] = useState(false);

  const addToCart = () => {
    addItemToCart({ id: product.id, qty });
    window.dispatchEvent(new Event("cart:updated"));
    setCartMessage(`${product.name} added to cart.`);
    setAddedToCart(true);
  };

  return (
    <aside className="rounded-2xl border border-pink-100 bg-white p-5 shadow-sm">
      <h2 className="text-xl font-semibold text-brand-900">Order this product</h2>
      <p className="mt-1 text-sm text-gray-600">
        Use Add to cart first. Then add more items or checkout from the cart icon at the top right.
      </p>

      <div className="mt-4 rounded-xl bg-pink-50 p-4">
        <p className="text-sm text-gray-600">Selected product</p>
        <p className="font-semibold text-brand-900">{product.name}</p>
        <p className="text-sm text-gray-700">{formatCurrency(product.price, product.currency)} each</p>
      </div>

      <div className="mt-5 grid gap-3">
        <label htmlFor="checkout-qty" className="text-sm font-semibold text-brand-900">Quantity</label>
        <input
          id="checkout-qty"
          type="number"
          min={1}
          value={qty}
          onChange={(event) => setQty(Math.max(1, Number(event.target.value) || 1))}
          className="min-h-11 rounded-lg border border-gray-200 px-3 py-2"
        />

        {!addedToCart ? (
          <button
            type="button"
            onClick={addToCart}
            disabled={!product.inStock}
            className="min-h-11 rounded-full bg-brand-600 px-5 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            Add to cart
          </button>
        ) : (
          <div className="grid gap-2 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setAddedToCart(false)}
              className="min-h-11 rounded-full border border-brand-600 px-5 py-3 font-semibold text-brand-700"
            >
              Add more items
            </button>
            <Link
              href="/checkout"
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-brand-600 px-5 py-3 font-semibold text-white"
            >
              Checkout now
            </Link>
          </div>
        )}

        {cartMessage ? <p className="rounded-xl bg-green-50 p-3 text-sm text-green-700">{cartMessage}</p> : null}
      </div>
    </aside>
  );
}
