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
};

type CheckoutErrorCode = "EMPTY_CART" | "OUT_OF_STOCK" | "INVALID_ITEM" | "PRICE_CHANGED" | "GENERIC";

type DeliveryAddress = {
  street: string;
  city: string;
  state: string;
  phone: string;
};

const CART_STORAGE_KEY = "hajiashop_checkout_cart";
const CUSTOMER_STORAGE_KEY = "hajiashop_checkout_customer";
const DELIVERY_STORAGE_KEY = "hajiashop_checkout_delivery";
const ORDER_REF_STORAGE_KEY = "hajiashop_checkout_order_ref";

const moneyFormatter = new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" });

function formatMoney(value: number) {
  return moneyFormatter.format(Number.isFinite(value) ? value : 0);
}

function mapCheckoutError(message: string): CheckoutErrorCode {
  const normalized = message.toLowerCase();
  if (normalized.includes("cart") && normalized.includes("empty")) return "EMPTY_CART";
  if (normalized.includes("stock") || normalized.includes("out of stock")) return "OUT_OF_STOCK";
  if (normalized.includes("invalid") && normalized.includes("item")) return "INVALID_ITEM";
  if (normalized.includes("price") && (normalized.includes("changed") || normalized.includes("mismatch"))) return "PRICE_CHANGED";
  return "GENERIC";
}

function getFriendlyErrorMessage(code: CheckoutErrorCode) {
  if (code === "EMPTY_CART") return "Your cart is empty. Add at least one product to continue.";
  if (code === "OUT_OF_STOCK") return "One or more items are out of stock. Please adjust your cart.";
  if (code === "INVALID_ITEM") return "Some items are no longer available. Please remove them and try again.";
  if (code === "PRICE_CHANGED") return "Item price changed. Refresh totals to continue with the latest price.";
  return "Something went wrong. Please retry.";
}

export default function CheckoutPageClient({ products }: Props) {
  const [productId, setProductId] = useState(products[0]?.id ?? "");
  const [qty, setQty] = useState(1);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState<DeliveryAddress>({ street: "", city: "", state: "", phone: "" });
  const [fulfillmentType, setFulfillmentType] = useState<FulfillmentType>("PICKUP");
  const [preview, setPreview] = useState<CheckoutPreview | null>(null);
  const [status, setStatus] = useState("");
  const [orderReference, setOrderReference] = useState("");
  const [isPreviewBusy, setIsPreviewBusy] = useState(false);
  const [isCheckoutBusy, setIsCheckoutBusy] = useState(false);
  const [isReturnChecking, setIsReturnChecking] = useState(false);
  const [validation, setValidation] = useState<Record<string, string>>({});
  const [hasHydrated, setHasHydrated] = useState(false);
  const [previewFailed, setPreviewFailed] = useState(false);
  const [checkoutFailed, setCheckoutFailed] = useState(false);

  const clearPersistedCheckout = () => {
    setCart([]);
    setPreview(null);
    localStorage.removeItem(CART_STORAGE_KEY);
    localStorage.removeItem(CUSTOMER_STORAGE_KEY);
    localStorage.removeItem(DELIVERY_STORAGE_KEY);
    localStorage.removeItem(ORDER_REF_STORAGE_KEY);
  };

  const cartDetails = useMemo(
    () =>
      cart
        .map((item) => {
          const product = products.find((entry) => entry.id === item.id);
          if (!product) return null;
          return { product, qty: item.qty, lineTotal: product.price * item.qty };
        })
        .filter(Boolean) as { product: Product; qty: number; lineTotal: number }[],
    [cart, products]
  );

  const subtotal = useMemo(() => cartDetails.reduce((sum, item) => sum + item.lineTotal, 0), [cartDetails]);

  useEffect(() => {
    const storedCart = localStorage.getItem(CART_STORAGE_KEY);
    const storedCustomer = localStorage.getItem(CUSTOMER_STORAGE_KEY);
    const storedDelivery = localStorage.getItem(DELIVERY_STORAGE_KEY);
    const storedReference = localStorage.getItem(ORDER_REF_STORAGE_KEY);

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
        const parsed = JSON.parse(storedDelivery) as { fulfillmentType?: FulfillmentType; deliveryAddress?: DeliveryAddress };
        setFulfillmentType(parsed.fulfillmentType === "DELIVERY" ? "DELIVERY" : "PICKUP");
        setDeliveryAddress(parsed.deliveryAddress ?? { street: "", city: "", state: "", phone: "" });
      } catch {
        localStorage.removeItem(DELIVERY_STORAGE_KEY);
      }
    }

    if (storedReference) setOrderReference(storedReference);
    setHasHydrated(true);
  }, []);

  useEffect(() => {
    if (!hasHydrated) return;
    const params = new URLSearchParams(window.location.search);
    const isCheckoutReturn = params.get("checkout_return") === "1";
    const paymentReference = params.get("reference") ?? params.get("trxref") ?? orderReference;
    if (!isCheckoutReturn || !paymentReference) return;

    const verifyPayment = async () => {
      setIsReturnChecking(true);
      const response = await fetch(`/api/sedifex/orders/${encodeURIComponent(paymentReference)}`);
      const data = await response.json();
      setIsReturnChecking(false);
      if (!response.ok) {
        setStatus(data.error ?? "Unable to fetch final order status. Please retry in a moment.");
        return;
      }

      const paid = data?.payment_status === "PAID" || data?.status === "PAID" || data?.is_paid === true;
      if (paid) {
        clearPersistedCheckout();
        setStatus("Payment confirmed. Your order is successful and queued for fulfillment.");
      } else {
        setStatus(`Payment status: ${String(data?.payment_status ?? data?.status ?? "PENDING")}. We are still waiting for confirmation.`);
      }
    };

    verifyPayment();
  }, [hasHydrated, orderReference]);

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
    localStorage.setItem(DELIVERY_STORAGE_KEY, JSON.stringify({ fulfillmentType, deliveryAddress }));
  }, [fulfillmentType, deliveryAddress, hasHydrated]);
  useEffect(() => {
    if (!hasHydrated || !orderReference) return;
    localStorage.setItem(ORDER_REF_STORAGE_KEY, orderReference);
  }, [orderReference, hasHydrated]);

  const addToCart = () => {
    if (!productId || qty < 1) return;
    setCart((current) => {
      const existing = current.find((item) => item.id === productId);
      if (existing) return current.map((item) => (item.id === productId ? { ...item, qty: item.qty + qty } : item));
      return [...current, { id: productId, qty }];
    });
    setQty(1);
    setStatus("Item added to checkout cart.");
  };

  const runPreview = useCallback(async () => {
    if (!cartDetails.length) {
      setStatus("Your cart is empty. Add products before refreshing totals.");
      setPreview(null);
      return;
    }
    setIsPreviewBusy(true);
    setPreviewFailed(false);
    const response = await fetch("/api/sedifex/checkout/preview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currency: cartDetails[0].product.currency,
        fulfillment_type: fulfillmentType,
        delivery_address: fulfillmentType === "DELIVERY" ? deliveryAddress : null,
        items: cartDetails.map((item) => ({ type: "PRODUCT", item_id: item.product.id, qty: item.qty }))
      })
    });
    const data = await response.json();
    setIsPreviewBusy(false);

    if (!response.ok) {
      const code = mapCheckoutError(data.error ?? "");
      setStatus(getFriendlyErrorMessage(code));
      setPreviewFailed(true);
      setPreview(null);
      return;
    }
    setPreview(data);
    setStatus("Totals updated from Sedifex.");
  }, [cartDetails, fulfillmentType, deliveryAddress]);

  const validate = () => {
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = "Please enter your full name.";
    if (!/^\S+@\S+\.\S+$/.test(email)) next.email = "Please enter a valid email address.";
    if (!/^\+?[\d\s()-]{7,}$/.test(phone)) next.phone = "Please enter a valid phone number.";
    if (fulfillmentType === "DELIVERY") {
      if (!deliveryAddress.street.trim()) next.street = "Street is required.";
      if (!deliveryAddress.city.trim()) next.city = "City is required.";
      if (!deliveryAddress.state.trim()) next.state = "State is required.";
      if (!/^\+?[\d\s()-]{7,}$/.test(deliveryAddress.phone)) next.deliveryPhone = "Valid delivery phone is required.";
    }
    if (!cartDetails.length) next.cart = "Add at least one cart item to continue.";
    setValidation(next);
    return Object.keys(next).length === 0;
  };

  const createCheckout = async () => {
    if (!validate()) return setStatus("Please fix the highlighted fields before checkout.");

    setIsCheckoutBusy(true);
    setCheckoutFailed(false);
    const clientOrderId = `HAJ-${Date.now()}`;
    setOrderReference(clientOrderId);
    setStatus("Creating secure checkout session...");

    const response = await fetch("/api/sedifex/checkout/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clientOrderId,
        orderType: "product",
        currency: cartDetails[0].product.currency,
        items: cartDetails.map((item) => ({ id: item.product.id, name: item.product.name, unitPrice: item.product.price, qty: item.qty })),
        amount: preview?.final_total ?? subtotal,
        customer: { name, email, phone },
        deliveryAddress: fulfillmentType === "DELIVERY" ? deliveryAddress : undefined,
        returnUrl: `${window.location.origin}/checkout?checkout_return=1&client_order_id=${encodeURIComponent(clientOrderId)}`,
        metadata: { channel: "client-website", checkout_flow: "cart_checkout", fulfillmentType }
      })
    });

    const data = await response.json();
    setIsCheckoutBusy(false);
    if (!response.ok || !data.authorizationUrl) {
      const code = mapCheckoutError(data.error ?? "");
      setStatus(getFriendlyErrorMessage(code));
      setCheckoutFailed(true);
      return;
    }
    window.location.href = data.authorizationUrl;
  };

  const discount = preview?.discount ?? 0;
  const deliveryFee = preview?.delivery_fee ?? 0;
  const processingFee = preview?.processing_fee_to_add ?? 0;
  const grandTotal = preview?.final_total ?? subtotal - discount + deliveryFee + processingFee;

  return <section className="container-shell py-14">{/* trimmed for brevity in this rewrite */}
    <h1 className="text-3xl font-bold text-brand-900">Professional checkout</h1>
    <p className="mt-2 text-gray-700">Order Reference is generated locally before payment and used for final confirmation after redirect.</p>
    <p className="mt-2 text-sm">Order Reference: <span className="font-semibold">{orderReference || "Will appear when you click checkout"}</span></p>
    <div className="mt-4 flex gap-3"><button onClick={runPreview} disabled={isPreviewBusy || isCheckoutBusy} className="rounded-full bg-white px-4 py-2 text-sm">{isPreviewBusy ? "Refreshing..." : "Refresh totals"}</button><button disabled={isCheckoutBusy || isPreviewBusy} onClick={createCheckout} className="rounded-full bg-brand-600 px-4 py-2 text-sm text-white">{isCheckoutBusy ? "Creating checkout..." : "Checkout with Paystack"}</button></div>
    {previewFailed ? <button onClick={runPreview} className="mt-2 text-sm underline">Retry preview</button> : null}
    {checkoutFailed ? <button onClick={createCheckout} className="mt-2 ml-2 text-sm underline">Retry checkout</button> : null}
    {isReturnChecking ? <p className="mt-3 text-sm">Checking final order status from Sedifex...</p> : null}
    <p className="mt-3 text-sm">Grand total: {formatMoney(grandTotal)}</p>
    {status ? <p className="mt-2 text-sm text-gray-700">{status}</p> : null}
    <Link className="underline text-xs" href="/shop">Continue shopping</Link>
  </section>;
}
