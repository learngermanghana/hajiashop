"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Product } from "@/data/products";
import { addItemToCart } from "@/lib/cart";
import { formatCurrency } from "@/lib/helpers";

export default function ProductCheckoutPanel({ product }: { product: Product }) {
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const [cartMessage, setCartMessage] = useState("");
  const [addedToCart, setAddedToCart] = useState(false);

  const addSelectedItemToCart = () => {
    addItemToCart({ id: product.id, qty });
    window.dispatchEvent(new Event("cart:updated"));
    setCartMessage(`${product.name} added to cart.`);
    setAddedToCart(true);
  };

  const addToCart = () => {
    if (!product.inStock) return;
    addSelectedItemToCart();
  };

  const buyNow = () => {
    if (!product.inStock) return;
    addSelectedItemToCart();
    router.push("/checkout");
  };

  const total = product.price * qty;

  return (
    <aside
      id="order-panel"
      className="rounded-3xl border-2 border-brand-200 bg-white p-5 shadow-2xl shadow-pink-100/70 ring-4 ring-pink-50 lg:sticky lg:top-24"
    >
      <div className="rounded-2xl bg-gradient-to-br from-brand-900 to-brand-600 p-5 text-white">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-pink-100">Ready to buy?</p>
        <h2 className="mt-2 text-2xl font-bold">Order this product</h2>
        <p className="mt-2 text-sm text-pink-50">
          Choose quantity, then checkout now or add it to your cart and continue shopping.
        </p>
      </div>

      <div className="mt-4 rounded-2xl border border-pink-100 bg-pink-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">Selected product</p>
        <p className="mt-1 font-semibold text-brand-950">{product.name}</p>
        <div className="mt-3 flex items-center justify-between gap-3 rounded-xl bg-white px-4 py-3">
          <span className="text-sm text-gray-600">Price each</span>
          <span className="text-lg font-bold text-brand-900">{formatCurrency(product.price, product.currency)}</span>
        </div>
      </div>

      <div className="mt-5 grid gap-4">
        <label htmlFor="checkout-qty" className="text-sm font-semibold text-brand-950">
          Quantity
        </label>
        <div className="grid grid-cols-[48px_1fr_48px] overflow-hidden rounded-2xl border border-brand-200 bg-white">
          <button
            type="button"
            onClick={() => setQty((current) => Math.max(1, current - 1))}
            className="min-h-12 bg-pink-50 text-xl font-bold text-brand-800"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <input
            id="checkout-qty"
            type="number"
            min={1}
            value={qty}
            onChange={(event) => setQty(Math.max(1, Number(event.target.value) || 1))}
            className="min-h-12 border-x border-brand-100 px-3 py-2 text-center text-lg font-bold text-brand-950 outline-none"
          />
          <button
            type="button"
            onClick={() => setQty((current) => current + 1)}
            className="min-h-12 bg-pink-50 text-xl font-bold text-brand-800"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>

        <div className="rounded-2xl bg-gray-50 p-4">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-semibold text-gray-600">Estimated total</span>
            <span className="text-2xl font-extrabold text-brand-950">{formatCurrency(total, product.currency)}</span>
          </div>
          <p className="mt-1 text-xs text-gray-500">Delivery and payment details continue on the checkout page.</p>
        </div>

        {!product.inStock ? (
          <p className="rounded-2xl bg-red-50 p-3 text-sm font-semibold text-red-700">
            This product is currently out of stock.
          </p>
        ) : null}

        <button
          type="button"
          onClick={buyNow}
          disabled={!product.inStock}
          className="min-h-14 rounded-full bg-brand-700 px-6 py-4 text-base font-extrabold text-white shadow-lg shadow-brand-200 transition hover:bg-brand-900 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:shadow-none"
        >
          Buy now / Checkout
        </button>

        <button
          type="button"
          onClick={addToCart}
          disabled={!product.inStock}
          className="min-h-12 rounded-full border-2 border-brand-600 bg-white px-5 py-3 font-bold text-brand-800 transition hover:bg-pink-50 disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-400"
        >
          Add to cart
        </button>

        <div className="grid gap-2 sm:grid-cols-2">
          <Link
            href="/shop"
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-gray-200 px-5 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50"
          >
            Continue shopping
          </Link>
          <Link
            href="/checkout"
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-gray-900 px-5 py-3 text-sm font-bold text-white hover:bg-black"
          >
            View cart / Checkout
          </Link>
        </div>

        {cartMessage ? (
          <p className="rounded-2xl bg-green-50 p-3 text-sm font-semibold text-green-700">
            {cartMessage} You can checkout now or keep shopping.
          </p>
        ) : null}
      </div>

      <div className="mt-5 rounded-2xl border border-gray-100 bg-gray-50 p-4 text-xs text-gray-600">
        <p className="font-bold text-brand-900">Secure checkout</p>
        <p className="mt-1">Your order continues through Sedifex checkout with clear payment and delivery details.</p>
      </div>
    </aside>
  );
}
