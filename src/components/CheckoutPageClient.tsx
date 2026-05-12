"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Product } from "@/data/products";

type Props = { products: Product[] };
type CartItem = { id: string; qty: number };

export default function CheckoutPageClient({ products }: Props) {
  const [productId, setProductId] = useState(products[0]?.id ?? "");
  const [qty, setQty] = useState(1);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [preview, setPreview] = useState<Record<string, number> | null>(null);
  const [reference, setReference] = useState("");
  const [status, setStatus] = useState("");
  const [isBusy, setIsBusy] = useState(false);

  const cartDetails = useMemo(
    () =>
      cart
        .map((item) => {
          const product = products.find((entry) => entry.id === item.id);
          if (!product) return null;
          return {
            product,
            qty: item.qty,
            lineTotal: product.price * item.qty
          };
        })
        .filter(Boolean) as { product: Product; qty: number; lineTotal: number }[],
    [cart, products]
  );

  const subtotal = useMemo(() => cartDetails.reduce((sum, item) => sum + item.lineTotal, 0), [cartDetails]);

  const addToCart = () => {
    if (!productId || qty < 1) return;
    setCart((current) => {
      const existing = current.find((item) => item.id === productId);
      if (existing) {
        return current.map((item) =>
          item.id === productId ? { ...item, qty: item.qty + qty } : item
        );
      }
      return [...current, { id: productId, qty }];
    });
    setQty(1);
    setPreview(null);
    setStatus("Item added to checkout cart.");
  };

  const updateQty = (id: string, nextQty: number) => {
    if (nextQty < 1) return;
    setCart((current) => current.map((item) => (item.id === id ? { ...item, qty: nextQty } : item)));
    setPreview(null);
  };

  const removeItem = (id: string) => {
    setCart((current) => current.filter((item) => item.id !== id));
    setPreview(null);
  };

  const runPreview = async () => {
    if (!cartDetails.length) {
      setStatus("Add at least one item to continue.");
      return;
    }
    setIsBusy(true);
    setStatus("Syncing totals with Sedifex...");

    const response = await fetch("/api/sedifex/checkout/preview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currency: cartDetails[0].product.currency,
        fulfillment_type: "PICKUP",
        items: cartDetails.map((item) => ({ type: "PRODUCT", item_id: item.product.id, qty: item.qty }))
      })
    });

    const data = await response.json();
    setIsBusy(false);
    if (!response.ok) {
      setStatus(data.error ?? "Unable to preview checkout.");
      return;
    }

    setPreview(data);
    setReference(String(data.reference ?? ""));
    setStatus("Totals updated and synced to Sedifex.");
  };

  const createCheckout = async () => {
    if (!name || !email || !cartDetails.length) {
      setStatus("Please enter your full name, email, and at least one cart item.");
      return;
    }

    setIsBusy(true);
    setStatus("Creating secure checkout session...");
    const clientOrderId = `WEB-${Date.now()}`;
    const response = await fetch("/api/sedifex/checkout/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clientOrderId,
        orderType: "product",
        currency: cartDetails[0].product.currency,
        items: cartDetails.map((item) => ({
          id: item.product.id,
          name: item.product.name,
          unitPrice: item.product.price,
          qty: item.qty
        })),
        amount: preview?.final_total ?? subtotal,
        customer: { name, email },
        returnUrl: `${window.location.origin}/checkout?checkout_return=1`,
        metadata: { channel: "client-website", checkout_flow: "cart_checkout" }
      })
    });

    const data = await response.json();
    setIsBusy(false);
    if (!response.ok || !data.authorizationUrl) {
      setStatus(data.error ?? "Unable to create hosted checkout.");
      return;
    }

    setReference(String(data.reference ?? data.orderReference ?? clientOrderId));
    window.location.href = data.authorizationUrl;
  };

  return (
    <section className="container-shell py-14">
      <h1 className="text-3xl font-bold text-brand-900">Professional checkout</h1>
      <p className="mt-2 text-gray-700">Add products to cart, auto-calculate totals, and pay with Paystack. Your order is synced to Sedifex with a reference receipt.</p>

      <div className="mt-8 grid gap-4 rounded-2xl border border-pink-100 bg-pink-50 p-5 md:grid-cols-[2fr,1fr]">
        <div className="grid gap-3 sm:grid-cols-3">
          <select value={productId} onChange={(event) => setProductId(event.target.value)} className="rounded-lg border p-2 sm:col-span-2">
            {products.map((product) => (
              <option key={product.id} value={product.id}>{product.name}</option>
            ))}
          </select>
          <input type="number" min={1} value={qty} onChange={(event) => setQty(Number(event.target.value))} className="rounded-lg border p-2" />
        </div>
        <button onClick={addToCart} className="rounded-full bg-brand-600 px-4 py-2 text-sm text-white">Add to cart</button>
      </div>

      <div className="mt-8 rounded-2xl border p-5">
        <h2 className="text-lg font-semibold">Cart summary</h2>
        {!cartDetails.length ? <p className="mt-2 text-sm text-gray-600">Your checkout cart is empty.</p> : null}
        <ul className="mt-3 space-y-3">
          {cartDetails.map(({ product, qty: lineQty, lineTotal }) => (
            <li key={product.id} className="flex flex-wrap items-center justify-between gap-3 border-b pb-3">
              <div>
                <p className="font-medium">{product.name}</p>
                <p className="text-sm text-gray-600">{product.currency} {product.price} each</p>
              </div>
              <div className="flex items-center gap-2">
                <input type="number" min={1} value={lineQty} onChange={(event) => updateQty(product.id, Number(event.target.value))} className="w-20 rounded-lg border p-2" />
                <span className="text-sm font-medium">{product.currency} {lineTotal}</span>
                <button onClick={() => removeItem(product.id)} className="text-sm text-red-600 underline">Remove</button>
              </div>
            </li>
          ))}
        </ul>

        <p className="mt-4 text-base font-semibold">Subtotal: {cartDetails[0]?.product.currency ?? "NGN"} {subtotal}</p>
        {preview ? (
          <p className="mt-1 text-sm text-gray-700">Auto total: {preview.final_total} (fee: {preview.processing_fee_to_add ?? 0})</p>
        ) : null}
      </div>

      <div className="mt-8 grid gap-3 md:grid-cols-2">
        <input placeholder="Full name" value={name} onChange={(event) => setName(event.target.value)} className="rounded-lg border p-2" />
        <input type="email" placeholder="Email" value={email} onChange={(event) => setEmail(event.target.value)} className="rounded-lg border p-2" />
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button disabled={isBusy} onClick={runPreview} className="rounded-full bg-white px-4 py-2 text-sm border">Auto calculate</button>
        <button disabled={isBusy} onClick={createCheckout} className="rounded-full bg-brand-600 px-4 py-2 text-sm text-white">Checkout with Paystack</button>
      </div>

      {reference ? <p className="mt-3 text-sm">Reference receipt: <span className="font-semibold">{reference}</span></p> : null}
      {status ? <p className="mt-2 text-sm text-gray-700">{status}</p> : null}
      <p className="mt-4 text-xs text-gray-600">After payment, order data is synced to Sedifex and can be verified with your reference. Need products first? <Link href="/shop" className="underline">Continue shopping</Link>.</p>
    </section>
  );
}
