"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Product } from "@/data/products";
import { CART_STORAGE_KEY, type CartItem, writeCartToStorage } from "@/lib/cart";
import { formatCurrency } from "@/lib/helpers";

type Props = { products: Product[] };
type PaymentMethod = "online" | "pay_on_delivery";

export default function CheckoutPageClient({ products }: Props) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [status, setStatus] = useState("Totals updated when cart changes.");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [deliveryLocation, setDeliveryLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("online");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (raw) {
      try {
        setCart(JSON.parse(raw));
      } catch {
        setCart([]);
      }
    }
  }, []);

  const details = useMemo(
    () => cart.map((cartItem) => ({ ...cartItem, product: products.find((product) => product.id === cartItem.id) })).filter((item) => item.product),
    [cart, products]
  );
  const subtotal = details.reduce((sum, item) => sum + (item.product?.price ?? 0) * item.qty, 0);
  const currency = details[0]?.product?.currency ?? "GHS";
  const isOnline = paymentMethod === "online";
  const canSubmit = Boolean(details.length && name.trim() && phone.trim() && deliveryLocation.trim() && (!isOnline || email.trim()));

  const persistCart = (next: CartItem[]) => {
    setCart(next);
    writeCartToStorage(next);
    window.dispatchEvent(new Event("cart:updated"));
  };

  const updateQty = (id: string, qty: number) => {
    const next = cart.map((item) => (item.id === id ? { ...item, qty: Math.max(1, qty) } : item));
    persistCart(next);
  };

  const removeItem = (id: string) => {
    const next = cart.filter((item) => item.id !== id);
    persistCart(next);
    setStatus("Item removed from cart.");
  };

  const removeAll = () => {
    persistCart([]);
    setStatus("Cart cleared.");
  };

  const checkout = async () => {
    setIsSubmitting(true);
    setStatus("");

    try {
      const endpoint = isOnline ? "/api/sedifex/checkout/create" : "/api/sedifex/orders/request";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientOrderId: `HAJ-${isOnline ? "PAY" : "POD"}-${Date.now()}`,
          items: details.map((item) => ({ id: item.id, qty: item.qty })),
          customer: { name: name.trim(), email: email.trim(), phone: phone.trim() },
          delivery: { location: deliveryLocation.trim(), notes: notes.trim() },
          returnUrl: `${window.location.origin}/checkout/success`,
          cancelUrl: `${window.location.origin}/checkout/failed`,
        }),
      });
      const data = await response.json();
      if (!response.ok || data.ok === false) throw new Error(data.error ?? "Unable to checkout.");

      const checkoutUrl = data.authorizationUrl ?? data.checkoutUrl;
      if (isOnline && checkoutUrl) {
        window.location.href = checkoutUrl;
        return;
      }

      persistCart([]);
      setStatus(`Pay-on-delivery order received. Reference: ${data.reference ?? data.clientOrderId ?? "N/A"}`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to checkout.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return <section className="container-shell py-10">
    <h1 className="text-3xl font-bold">Checkout</h1>
    <p aria-live="polite" className="mt-2 text-sm text-gray-700">{status}</p>
    <div className="mt-6 grid gap-6 md:grid-cols-[minmax(0,1fr)_420px]">
      <div>
        {details.length === 0 ? (
          <div className="rounded-2xl border border-pink-100 bg-white p-6">
            <p className="font-semibold text-brand-900">Your cart is empty.</p>
            <p className="mt-2 text-sm text-gray-600">Add products from the shop before checking out.</p>
          </div>
        ) : details.map((item) => <div key={item.id} className="mb-3 rounded-2xl border border-pink-100 bg-white p-4 shadow-sm">
          <div className="flex gap-4">
            {item.product?.image ? <img src={item.product.image} alt={item.product.name} className="h-20 w-20 rounded-xl object-cover" /> : null}
            <div className="flex-1">
              <p className="font-semibold text-brand-900">{item.product?.name}</p>
              <p className="text-sm text-gray-600">{formatCurrency(item.product?.price ?? 0, item.product?.currency ?? currency)} each</p>
              <label htmlFor={`qty-${item.id}`} className="mt-3 block text-sm font-medium">Quantity</label>
              <input id={`qty-${item.id}`} type="number" min={1} value={item.qty} onChange={(event) => updateQty(item.id, Number(event.target.value) || 1)} className="mt-1 block min-h-11 w-28 rounded border px-3 py-2" />
            </div>
            <button type="button" onClick={() => removeItem(item.id)} className="h-fit rounded-full border border-red-200 px-3 py-2 text-sm text-red-700">Remove</button>
          </div>
        </div>)}
        <div className="flex flex-wrap gap-3">
          <Link href="/shop" className="rounded-full border px-4 py-3 min-h-11">Continue shopping</Link>
          {details.length ? <button type="button" onClick={removeAll} className="rounded-full border px-4 py-3 min-h-11">Remove all</button> : null}
        </div>
      </div>
      <aside className="h-fit rounded-2xl border border-pink-100 bg-white p-5 shadow-sm md:sticky md:top-24">
        <h2 className="font-semibold text-brand-900">Order summary</h2>
        <p className="mt-2 text-lg font-bold">Subtotal: {formatCurrency(subtotal, currency)}</p>

        <label htmlFor="paymentMethod" className="mt-4 block text-sm font-semibold">Payment method</label>
        <select id="paymentMethod" value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value as PaymentMethod)} className="mt-1 min-h-11 w-full rounded border px-3 py-2">
          <option value="online">Pay online with Paystack</option>
          <option value="pay_on_delivery">Pay on delivery</option>
        </select>

        <label htmlFor="fullName" className="mt-3 block text-sm font-semibold">Full name</label>
        <input id="fullName" value={name} onChange={(event) => setName(event.target.value)} className="min-h-11 w-full rounded border px-3 py-2" />
        <label htmlFor="phone" className="mt-3 block text-sm font-semibold">Phone</label>
        <input id="phone" type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} className="min-h-11 w-full rounded border px-3 py-2" placeholder="+233 20 000 0000" />
        <label htmlFor="email" className="mt-3 block text-sm font-semibold">Email {isOnline ? "" : "(optional)"}</label>
        <input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="min-h-11 w-full rounded border px-3 py-2" />
        <label htmlFor="deliveryLocation" className="mt-3 block text-sm font-semibold">Delivery location</label>
        <input id="deliveryLocation" value={deliveryLocation} onChange={(event) => setDeliveryLocation(event.target.value)} className="min-h-11 w-full rounded border px-3 py-2" placeholder="Town / area / landmark" />
        <label htmlFor="notes" className="mt-3 block text-sm font-semibold">Order notes</label>
        <textarea id="notes" rows={3} value={notes} onChange={(event) => setNotes(event.target.value)} className="w-full rounded border px-3 py-2" />
        <button disabled={!canSubmit || isSubmitting} onClick={checkout} className="mt-4 min-h-11 w-full rounded-full bg-brand-600 px-4 py-3 text-white disabled:bg-gray-300">
          {isSubmitting ? "Submitting..." : isOnline ? "Pay now" : "Place pay-on-delivery order"}
        </button>
      </aside>
    </div>
  </section>;
}