"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Product } from "@/data/products";
import { CART_STORAGE_KEY, type CartItem, writeCartToStorage } from "@/lib/cart";

type Props = { products: Product[] };

export default function CheckoutPageClient({ products }: Props) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [status, setStatus] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (raw) setCart(JSON.parse(raw));
  }, []);

  const details = useMemo(() => cart.map((c) => ({ ...c, product: products.find((p) => p.id === c.id) })).filter((i) => i.product), [cart, products]);
  const subtotal = details.reduce((s, i) => s + (i.product?.price ?? 0) * i.qty, 0);

  const updateQty = (id: string, qty: number) => {
    const next = cart.map((i) => (i.id === id ? { ...i, qty: Math.max(1, qty) } : i));
    setCart(next); writeCartToStorage(next); window.dispatchEvent(new Event("cart:updated"));
  };
  const removeAll = () => { setCart([]); writeCartToStorage([]); setStatus("Cart cleared."); window.dispatchEvent(new Event("cart:updated")); };

  const checkout = async () => {
    const r = await fetch("/api/sedifex/checkout/create", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({
      clientOrderId: `HAJ-${Date.now()}`,
      currency: "NGN",
      items: details.map((i) => ({ id: i.id, qty: i.qty })),
      customer: { name, email },
      returnUrl: `${window.location.origin}/checkout/success`,
      cancelUrl: `${window.location.origin}/checkout/failed`
    })});
    const data = await r.json();
    if (!r.ok || !data.authorizationUrl) return setStatus(data.error ?? "Unable to checkout.");
    window.location.href = data.authorizationUrl;
  };

  return <section className="container-shell py-10">
    <h1 className="text-3xl font-bold">Checkout</h1>
    <p aria-live="polite" className="mt-2 text-sm text-gray-700">{status || "Totals updated when cart changes."}</p>
    <div className="mt-6 grid gap-6 md:grid-cols-2">
      <div>
        {details.map((item) => <div key={item.id} className="mb-3 rounded border p-3"><p>{item.product?.name}</p><label htmlFor={`qty-${item.id}`} className="text-sm">Quantity</label><input id={`qty-${item.id}`} type="number" min={1} value={item.qty} onChange={(e) => updateQty(item.id, Number(e.target.value) || 1)} className="block min-h-11 rounded border px-3 py-2" /></div>)}
        <div className="flex gap-3">
          <Link href="/shop" className="rounded-full border px-4 py-3 min-h-11">Continue shopping</Link>
          <button onClick={removeAll} className="rounded-full border px-4 py-3 min-h-11">Remove all</button>
        </div>
      </div>
      <aside className="md:sticky md:top-24 h-fit rounded-xl border p-4">
        <h2 className="font-semibold">Order summary</h2>
        <p className="mt-2">Subtotal: ₦{subtotal.toLocaleString()}</p>
        <label htmlFor="fullName" className="mt-3 block text-sm">Full name</label>
        <input id="fullName" value={name} onChange={(e) => setName(e.target.value)} className="min-h-11 w-full rounded border px-3 py-2" />
        <label htmlFor="email" className="mt-3 block text-sm">Email</label>
        <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="min-h-11 w-full rounded border px-3 py-2" />
        <button onClick={checkout} className="mt-4 min-h-11 w-full rounded-full bg-brand-600 px-4 py-3 text-white">Pay now</button>
      </aside>
    </div>
  </section>;
}
