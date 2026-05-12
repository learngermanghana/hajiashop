"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/data/products";
import { buildWhatsAppLink } from "@/lib/whatsapp";

type Props = { products: Product[] };

export default function ShopCheckout({ products }: Props) {
  const [productId, setProductId] = useState(products[0]?.id ?? "");
  const [qty, setQty] = useState(1);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [fulfillmentType, setFulfillmentType] = useState<"PICKUP" | "DELIVERY">("PICKUP");
  const [deliveryAddressId, setDeliveryAddressId] = useState("");
  const [preview, setPreview] = useState<Record<string, number> | null>(null);
  const [status, setStatus] = useState("");

  const selected = useMemo(() => products.find((product) => product.id === productId), [products, productId]);

  const runPreview = async () => {
    if (!selected) return;
    const response = await fetch("/api/sedifex/checkout/preview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currency: selected.currency,
        fulfillment_type: fulfillmentType,
        delivery_address_id: fulfillmentType === "DELIVERY" ? deliveryAddressId || null : null,
        items: [{ type: "PRODUCT", item_id: selected.id, qty }]
      })
    });
    const data = await response.json();
    if (!response.ok) {
      setStatus(data.error ?? "Unable to preview checkout");
      return;
    }
    setPreview(data);
    setStatus("Pricing updated from Sedifex.");
  };

  const createCheckout = async () => {
    if (!selected || !email || !name) return;
    const clientOrderId = `WEB-${Date.now()}`;
    const response = await fetch("/api/sedifex/checkout/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clientOrderId,
        orderType: "product",
        currency: selected.currency,
        items: [{ id: selected.id, name: selected.name, unitPrice: selected.price, qty }],
        amount: preview?.final_total ?? selected.price * qty,
        customer: { email, name },
        returnUrl: `${window.location.origin}/shop?checkout_return=1`,
        metadata: { channel: "client-website", fulfillment_type: fulfillmentType }
      })
    });
    const data = await response.json();
    if (!response.ok || !data.authorizationUrl) {
      setStatus(data.error ?? "Unable to create hosted checkout.");
      return;
    }
    window.location.href = data.authorizationUrl;
  };

  return (
    <div className="mb-10 rounded-2xl border border-pink-100 bg-pink-50 p-5">
      <h3 className="text-lg font-semibold text-brand-900">Fast checkout</h3>
      <p className="mt-1 text-sm text-gray-700">Preview totals from Sedifex and pay immediately with Paystack.</p>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <select value={productId} onChange={(e) => setProductId(e.target.value)} className="rounded-lg border p-2">
          {products.map((product) => (
            <option key={product.id} value={product.id}>{product.name}</option>
          ))}
        </select>
        <input type="number" min={1} value={qty} onChange={(e) => setQty(Number(e.target.value))} className="rounded-lg border p-2" />
        <input placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} className="rounded-lg border p-2" />
        <input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-lg border p-2" />
      </div>
      <div className="mt-3 flex gap-3 text-sm">
        <button onClick={() => setFulfillmentType("PICKUP")} className="underline">Pickup</button>
        <button onClick={() => setFulfillmentType("DELIVERY")} className="underline">Delivery</button>
      </div>
      {fulfillmentType === "DELIVERY" && (
        <input
          placeholder="Delivery address ID"
          value={deliveryAddressId}
          onChange={(e) => setDeliveryAddressId(e.target.value)}
          className="mt-3 w-full rounded-lg border p-2"
        />
      )}
      <div className="mt-4 flex gap-3">
        <button onClick={runPreview} className="rounded-full bg-white px-4 py-2 text-sm">Refresh totals</button>
        <button onClick={createCheckout} className="rounded-full bg-brand-600 px-4 py-2 text-sm text-white">Pay now</button>
      </div>
      {preview && <p className="mt-3 text-sm">Total: {preview.final_total} (includes processing fee: {preview.processing_fee_to_add ?? 0})</p>}
      {status && <p className="mt-2 text-xs text-gray-600">{status}</p>}
      <p className="mt-3 text-xs text-gray-600">After return, our team confirms payment via webhook before final fulfillment. Need help? <a className="underline" href={buildWhatsAppLink()} target="_blank">WhatsApp</a> or email support.</p>
    </div>
  );
}
