"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { Product } from "@/data/products";

type Props = { products: Product[] };
type CartItem = { id: string; qty: number };
type FulfillmentType = "PICKUP" | "DELIVERY";
type CheckoutPreview = {
  subtotal?: number;
  discount?: number;
  delivery_fee?: number;
  processing_fee_to_add?: number;
  final_total?: number;
  reference?: string;
};

const CART_STORAGE_KEY = "hajiashop_checkout_cart";
const CUSTOMER_STORAGE_KEY = "hajiashop_checkout_customer";
const DELIVERY_STORAGE_KEY = "hajiashop_checkout_delivery";

const moneyFormatter = new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" });

function formatMoney(value: number) {
  return moneyFormatter.format(Number.isFinite(value) ? value : 0);
}

export default function CheckoutPageClient({ products }: Props) {
  const [productId, setProductId] = useState(products[0]?.id ?? "");
  const [qty, setQty] = useState(1);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [fulfillmentType, setFulfillmentType] = useState<FulfillmentType>("PICKUP");
  const [preview, setPreview] = useState<CheckoutPreview | null>(null);
  const [reference, setReference] = useState("");
  const [status, setStatus] = useState("");
  const [isBusy, setIsBusy] = useState(false);
  const [validation, setValidation] = useState<Record<string, string>>({});
  const [hasHydrated, setHasHydrated] = useState(false);

  const clearPersistedCheckout = () => {
    setCart([]);
    setPreview(null);
    setReference("");
    localStorage.removeItem(CART_STORAGE_KEY);
    localStorage.removeItem(CUSTOMER_STORAGE_KEY);
    localStorage.removeItem(DELIVERY_STORAGE_KEY);
  };

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

  useEffect(() => {
    const storedCart = localStorage.getItem(CART_STORAGE_KEY);
    const storedCustomer = localStorage.getItem(CUSTOMER_STORAGE_KEY);
    const storedDelivery = localStorage.getItem(DELIVERY_STORAGE_KEY);

    if (storedCart) {
      try {
        const parsed = JSON.parse(storedCart) as CartItem[];
        setCart(parsed.filter((item) => typeof item.id === "string" && Number(item.qty) > 0));
      } catch {
        localStorage.removeItem(CART_STORAGE_KEY);
      }
    }

    if (storedCustomer) {
      try {
        const parsed = JSON.parse(storedCustomer) as { name?: string; email?: string; phone?: string };
        setName(parsed.name ?? "");
        setEmail(parsed.email ?? "");
        setPhone(parsed.phone ?? "");
      } catch {
        localStorage.removeItem(CUSTOMER_STORAGE_KEY);
      }
    }

    if (storedDelivery) {
      try {
        const parsed = JSON.parse(storedDelivery) as { fulfillmentType?: FulfillmentType; address?: string };
        setFulfillmentType(parsed.fulfillmentType === "DELIVERY" ? "DELIVERY" : "PICKUP");
        setAddress(parsed.address ?? "");
      } catch {
        localStorage.removeItem(DELIVERY_STORAGE_KEY);
      }
    }

    setHasHydrated(true);
  }, []);

  useEffect(() => {
    if (!hasHydrated) return;
    const params = new URLSearchParams(window.location.search);
    const isCheckoutReturn = params.get("checkout_return") === "1";
    const paymentReference = params.get("reference") ?? params.get("trxref") ?? "";
    if (!isCheckoutReturn || !paymentReference) return;

    const verifyPayment = async () => {
      const response = await fetch(`/api/sedifex/orders/${encodeURIComponent(paymentReference)}`);
      const data = await response.json();
      if (!response.ok) {
        setStatus(data.error ?? "Unable to verify payment confirmation.");
        return;
      }

      if (data?.payment_status === "PAID" || data?.status === "PAID" || data?.is_paid === true) {
        clearPersistedCheckout();
        setStatus("Payment confirmed. Cart has been cleared.");
      } else {
        setStatus("Payment is not confirmed yet. Cart has been kept.");
      }
    };

    verifyPayment();
  }, [hasHydrated]);

  useEffect(() => {
    if (!hasHydrated) return;
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart, hasHydrated]);

  useEffect(() => {
    if (!hasHydrated) return;
    localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify({ name, email, phone }));
  }, [name, email, phone, hasHydrated]);

  useEffect(() => {
    if (!hasHydrated) return;
    localStorage.setItem(DELIVERY_STORAGE_KEY, JSON.stringify({ fulfillmentType, address }));
  }, [fulfillmentType, address, hasHydrated]);

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
    setStatus("Item added to checkout cart.");
  };

  const updateQty = (id: string, nextQty: number) => {
    if (nextQty < 1) return;
    setCart((current) => current.map((item) => (item.id === id ? { ...item, qty: nextQty } : item)));
  };

  const removeItem = (id: string) => {
    setCart((current) => current.filter((item) => item.id !== id));
  };

  const runPreview = useCallback(async () => {
    if (!cartDetails.length) {
      setPreview(null);
      return;
    }

    const response = await fetch("/api/sedifex/checkout/preview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currency: cartDetails[0].product.currency,
        fulfillment_type: fulfillmentType,
        items: cartDetails.map((item) => ({ type: "PRODUCT", item_id: item.product.id, qty: item.qty }))
      })
    });

    const data = await response.json();
    if (!response.ok) {
      setStatus(data.error ?? "Unable to preview checkout.");
      setPreview(null);
      return;
    }

    setPreview(data);
    setReference(String(data.reference ?? ""));
    setStatus("Totals updated and synced to Sedifex.");
  }, [cartDetails, fulfillmentType]);

  useEffect(() => {
    if (!hasHydrated) return;
    setPreview(null);
    setReference("");
    if (!cartDetails.length) return;

    const timer = setTimeout(() => {
      runPreview();
    }, 300);

    return () => clearTimeout(timer);
  }, [cartDetails, fulfillmentType, name, email, phone, address, hasHydrated, runPreview]);

  const validate = () => {
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = "Please enter your full name.";
    if (!/^\S+@\S+\.\S+$/.test(email)) next.email = "Please enter a valid email address.";
    if (!/^\+?[\d\s()-]{7,}$/.test(phone)) next.phone = "Please enter a valid phone number.";
    if (fulfillmentType === "DELIVERY" && !address.trim()) next.address = "Address is required for delivery.";
    if (!cartDetails.length) next.cart = "Add at least one cart item to continue.";
    setValidation(next);
    return Object.keys(next).length === 0;
  };

  const createCheckout = async () => {
    if (!validate()) {
      setStatus("Please fix the highlighted fields before checkout.");
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
        customer: { name, email, phone, address, fulfillmentType },
        returnUrl: `${window.location.origin}/checkout?checkout_return=1`,
        metadata: { channel: "client-website", checkout_flow: "cart_checkout", fulfillmentType }
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

  const discount = preview?.discount ?? 0;
  const deliveryFee = preview?.delivery_fee ?? 0;
  const processingFee = preview?.processing_fee_to_add ?? 0;
  const grandTotal = preview?.final_total ?? subtotal - discount + deliveryFee + processingFee;

  return (
    <section className="container-shell py-14">
      <h1 className="text-3xl font-bold text-brand-900">Professional checkout</h1>
      <p className="mt-2 text-gray-700">Add products to cart, auto-calculate totals, and pay with Paystack. Your order is synced to Sedifex with a reference receipt.</p>

      <div className="mt-8 space-y-6">
        <div className="rounded-2xl border p-5">
          <h2 className="text-lg font-semibold">1) Cart items</h2>
          <div className="mt-4 grid gap-4 rounded-2xl border border-pink-100 bg-pink-50 p-5 md:grid-cols-[2fr,1fr]">
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

          {!cartDetails.length ? <p className="mt-2 text-sm text-gray-600">Your checkout cart is empty.</p> : null}
          {validation.cart ? <p className="mt-2 text-sm text-red-600">{validation.cart}</p> : null}
          <ul className="mt-3 space-y-3">
            {cartDetails.map(({ product, qty: lineQty, lineTotal }) => (
              <li key={product.id} className="flex flex-wrap items-center justify-between gap-3 border-b pb-3">
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-gray-600">{formatMoney(product.price)} each</p>
                </div>
                <div className="flex items-center gap-2">
                  <input type="number" min={1} value={lineQty} onChange={(event) => updateQty(product.id, Number(event.target.value))} className="w-20 rounded-lg border p-2" />
                  <span className="text-sm font-medium">{formatMoney(lineTotal)}</span>
                  <button onClick={() => removeItem(product.id)} className="text-sm text-red-600 underline">Remove</button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border p-5">
          <h2 className="text-lg font-semibold">2) Customer details</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div>
              <input placeholder="Full name" value={name} onChange={(event) => setName(event.target.value)} className="w-full rounded-lg border p-2" />
              {validation.name ? <p className="mt-1 text-sm text-red-600">{validation.name}</p> : null}
            </div>
            <div>
              <input type="email" placeholder="Email" value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded-lg border p-2" />
              {validation.email ? <p className="mt-1 text-sm text-red-600">{validation.email}</p> : null}
            </div>
            <div className="md:col-span-2">
              <input placeholder="Phone number" value={phone} onChange={(event) => setPhone(event.target.value)} className="w-full rounded-lg border p-2" />
              {validation.phone ? <p className="mt-1 text-sm text-red-600">{validation.phone}</p> : null}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border p-5">
          <h2 className="text-lg font-semibold">3) Delivery / pickup</h2>
          <div className="mt-4 space-y-3">
            <div className="flex gap-4">
              <label className="flex items-center gap-2"><input type="radio" checked={fulfillmentType === "PICKUP"} onChange={() => setFulfillmentType("PICKUP")} /> Pickup</label>
              <label className="flex items-center gap-2"><input type="radio" checked={fulfillmentType === "DELIVERY"} onChange={() => setFulfillmentType("DELIVERY")} /> Delivery</label>
            </div>
            {fulfillmentType === "DELIVERY" ? (
              <div>
                <textarea placeholder="Delivery address" value={address} onChange={(event) => setAddress(event.target.value)} className="w-full rounded-lg border p-2" rows={3} />
                {validation.address ? <p className="mt-1 text-sm text-red-600">{validation.address}</p> : null}
              </div>
            ) : null}
          </div>
        </div>

        <div className="rounded-2xl border p-5">
          <h2 className="text-lg font-semibold">4) Payment summary</h2>
          <div className="mt-4 space-y-2 text-sm">
            <p className="flex justify-between"><span>Subtotal</span><span>{formatMoney(subtotal)}</span></p>
            <p className="flex justify-between"><span>Discount</span><span>-{formatMoney(discount)}</span></p>
            <p className="flex justify-between"><span>Delivery fee</span><span>{formatMoney(deliveryFee)}</span></p>
            <p className="flex justify-between"><span>Processing fee</span><span>{formatMoney(processingFee)}</span></p>
            <p className="flex justify-between border-t pt-2 text-base font-semibold"><span>Grand total</span><span>{formatMoney(grandTotal)}</span></p>
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button disabled={isBusy} onClick={createCheckout} className="rounded-full bg-brand-600 px-4 py-2 text-sm text-white">Checkout with Paystack</button>
      </div>

      {reference ? <p className="mt-3 text-sm">Reference receipt: <span className="font-semibold">{reference}</span></p> : null}
      {status ? <p className="mt-2 text-sm text-gray-700">{status}</p> : null}
      <p className="mt-4 text-xs text-gray-600">Cart details are persisted locally and only cleared after confirmed payment. Need products first? <Link href="/shop" className="underline">Continue shopping</Link>.</p>
    </section>
  );
}
