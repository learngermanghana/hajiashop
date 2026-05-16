"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import type { Product } from "@/data/products";
import { addItemToCart } from "@/lib/cart";
import { formatCurrency } from "@/lib/helpers";

type CheckoutMode = "online" | "pay_on_delivery";
type SubmitState = "idle" | "submitting" | "success" | "error";

export default function ProductCheckoutPanel({ product }: { product: Product }) {
  const [mode, setMode] = useState<CheckoutMode>("online");
  const [qty, setQty] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [deliveryLocation, setDeliveryLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");
  const [reference, setReference] = useState("");
  const [cartMessage, setCartMessage] = useState("");

  const total = product.price * qty;
  const isOnline = mode === "online";
  const canSubmit = Boolean(product.inStock && name.trim() && phone.trim() && deliveryLocation.trim() && (!isOnline || email.trim()));

  const addToCart = () => {
    addItemToCart({ id: product.id, qty });
    window.dispatchEvent(new Event("cart:updated"));
    setCartMessage(`${product.name} added to cart.`);
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("submitting");
    setMessage("");
    setReference("");

    try {
      const endpoint = isOnline ? "/api/sedifex/checkout/create" : "/api/sedifex/orders/request";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientOrderId: `HAJ-${isOnline ? "PAY" : "POD"}-${Date.now()}`,
          productId: product.id,
          quantity: qty,
          customer: { name: name.trim(), email: email.trim(), phone: phone.trim() },
          delivery: { location: deliveryLocation.trim(), notes: notes.trim() },
          returnUrl: `${window.location.origin}/shop/${product.slug}?checkout_return=1`,
          cancelUrl: `${window.location.origin}/shop/${product.slug}?checkout_cancelled=1`,
        }),
      });

      const data = await response.json();
      if (!response.ok || data.ok === false) throw new Error(data.error ?? "Unable to submit order.");

      const checkoutUrl = data.authorizationUrl ?? data.checkoutUrl;
      if (isOnline && checkoutUrl) {
        window.location.href = checkoutUrl;
        return;
      }

      setReference(data.reference ?? data.clientOrderId ?? "");
      setStatus("success");
      setMessage(isOnline ? "Checkout created. Continue with the payment link." : "Your pay-on-delivery order has been received. We will follow up before delivery.");
      setQty(1);
      setNotes("");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Unable to submit order.");
    }
  };

  return (
    <aside className="rounded-2xl border border-pink-100 bg-white p-5 shadow-sm">
      <h2 className="text-xl font-semibold text-brand-900">Order this product</h2>
      <p className="mt-1 text-sm text-gray-600">Add this item to cart, or buy it now with online payment/pay on delivery.</p>

      <div className="mt-4 rounded-xl bg-pink-50 p-4">
        <p className="text-sm text-gray-600">Selected product</p>
        <p className="font-semibold text-brand-900">{product.name}</p>
        <p className="text-sm text-gray-700">{formatCurrency(product.price, product.currency)} each</p>
      </div>

      <div className="mt-5 grid gap-3">
        <label htmlFor="checkout-qty" className="text-sm font-semibold text-brand-900">Quantity</label>
        <input id="checkout-qty" type="number" min={1} value={qty} onChange={(event) => setQty(Math.max(1, Number(event.target.value) || 1))} className="min-h-11 rounded-lg border border-gray-200 px-3 py-2" />
        <div className="grid gap-2 sm:grid-cols-2">
          <button type="button" onClick={addToCart} disabled={!product.inStock} className="min-h-11 rounded-full border border-brand-600 px-5 py-3 font-semibold text-brand-700 disabled:border-gray-200 disabled:text-gray-400">
            Add to cart
          </button>
          <Link href="/checkout" className="inline-flex min-h-11 items-center justify-center rounded-full bg-brand-600 px-5 py-3 font-semibold text-white">
            Go to checkout
          </Link>
        </div>
        {cartMessage ? <p className="rounded-xl bg-green-50 p-3 text-sm text-green-700">{cartMessage}</p> : null}
      </div>

      <form className="mt-6 grid gap-3 border-t border-pink-100 pt-5" onSubmit={submit}>
        <p className="text-sm font-semibold text-brand-900">Buy this item now</p>
        <label htmlFor="checkout-mode" className="text-sm font-semibold text-brand-900">Payment method</label>
        <select id="checkout-mode" value={mode} onChange={(event) => setMode(event.target.value as CheckoutMode)} className="min-h-11 rounded-lg border border-gray-200 px-3 py-2">
          <option value="online">Pay online with Paystack</option>
          <option value="pay_on_delivery">Pay on delivery</option>
        </select>

        <label htmlFor="checkout-name" className="text-sm font-semibold text-brand-900">Full name</label>
        <input id="checkout-name" value={name} onChange={(event) => setName(event.target.value)} className="min-h-11 rounded-lg border border-gray-200 px-3 py-2" required />

        <label htmlFor="checkout-phone" className="text-sm font-semibold text-brand-900">Phone number</label>
        <input id="checkout-phone" type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} className="min-h-11 rounded-lg border border-gray-200 px-3 py-2" placeholder="+233 20 000 0000" required />

        <label htmlFor="checkout-email" className="text-sm font-semibold text-brand-900">Email {isOnline ? "" : "(optional)"}</label>
        <input id="checkout-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="min-h-11 rounded-lg border border-gray-200 px-3 py-2" placeholder="name@example.com" required={isOnline} />

        <label htmlFor="checkout-location" className="text-sm font-semibold text-brand-900">Delivery location</label>
        <input id="checkout-location" value={deliveryLocation} onChange={(event) => setDeliveryLocation(event.target.value)} className="min-h-11 rounded-lg border border-gray-200 px-3 py-2" placeholder="Town / area / landmark" required />

        <label htmlFor="checkout-notes" className="text-sm font-semibold text-brand-900">Order notes (optional)</label>
        <textarea id="checkout-notes" rows={3} value={notes} onChange={(event) => setNotes(event.target.value)} className="rounded-lg border border-gray-200 px-3 py-2" placeholder="Preferred color, delivery instructions, etc." />

        <div className="rounded-xl bg-gray-50 p-4 text-sm">
          <p className="font-semibold text-brand-900">Total: {formatCurrency(total, product.currency)}</p>
          {mode === "pay_on_delivery" ? <p className="mt-1 text-gray-600">You will pay when the product is delivered.</p> : <p className="mt-1 text-gray-600">You will be redirected to Paystack to complete payment.</p>}
        </div>

        <button type="submit" disabled={!canSubmit || status === "submitting"} className="min-h-11 rounded-full bg-brand-600 px-5 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:bg-gray-300">
          {status === "submitting" ? "Submitting..." : isOnline ? "Pay online" : "Place pay-on-delivery order"}
        </button>
      </form>

      {message ? <p className={`mt-4 rounded-xl p-3 text-sm ${status === "error" ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>{message}{reference ? ` Reference: ${reference}` : ""}</p> : null}
    </aside>
  );
}
