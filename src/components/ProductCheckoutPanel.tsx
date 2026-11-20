"use client";
import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/data/products";
import { formatCurrency } from "@/lib/helpers";
import { buildWhatsAppLink } from "@/lib/whatsapp";
export default function ProductCheckoutPanel({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const message = `Hello Hajia Slay Shop, I would like to enquire about ${quantity} × ${product.name} (listed at ${formatCurrency(product.price, product.currency)} each). Please confirm availability, price and delivery options.`;
  return <aside id="order-panel" className="rounded-3xl border-2 border-brand-200 bg-white p-6 shadow-lg lg:sticky lg:top-24">
    <p className="text-xs font-bold uppercase tracking-widest text-brand-700">WhatsApp enquiries</p>
    <h2 className="mt-2 text-2xl font-bold text-brand-900">Ask about this product</h2>
    <p className="mt-3 text-sm text-gray-600">There is no online checkout. Message us on WhatsApp to confirm the latest price, availability and delivery.</p>
    <p className="mt-5 font-semibold text-brand-900">{product.name}</p>
    <p className="mt-2 text-lg font-bold">{formatCurrency(product.price, product.currency)} <span className="text-xs font-normal text-gray-500">listed price, confirm before ordering</span></p>
    <label htmlFor="quantity" className="mt-5 block text-sm font-semibold">Quantity</label>
    <input id="quantity" type="number" min={1} value={quantity} onChange={e => setQuantity(Math.max(1, Number(e.target.value) || 1))} className="mt-2 w-24 rounded-xl border border-gray-200 px-3 py-2" />
    <a href={buildWhatsAppLink(message)} target="_blank" rel="noopener noreferrer" className="mt-6 flex min-h-14 items-center justify-center rounded-full bg-green-600 px-5 py-3 text-center font-bold text-white hover:bg-green-700">Enquire on WhatsApp</a>
    <Link href="/shop" className="mt-3 block text-center text-sm font-semibold text-brand-700">Continue browsing</Link>
  </aside>;
}
