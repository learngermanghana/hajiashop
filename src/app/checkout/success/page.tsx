"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { siteConfig } from "@/data/site";

type OrderDetails = {
  ok?: boolean;
  error?: string;
  reference?: string;
  paymentReference?: string;
  payment_reference?: string;
  paystackReference?: string;
  customer?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  amountPaid?: number | string;
  amount_paid?: number | string;
  amount?: number | string;
  currency?: string;
  paymentStatus?: string;
  payment_status?: string;
  orderStatus?: string;
  order_status?: string;
  syncStatus?: string;
  sync_status?: string;
  status?: string;
};

type CheckoutCustomerSnapshot = {
  name?: string;
  email?: string;
  phone?: string;
  deliveryLocation?: string;
};

function firstValue<T>(...values: Array<T | null | undefined | "">) {
  return values.find((value): value is T => value !== undefined && value !== null && value !== "");
}

function formatAmount(value: number | string | undefined, currency = "GHS") {
  if (value === undefined || value === null || value === "") return "Pending";
  if (typeof value === "number" && Number.isFinite(value)) {
    return new Intl.NumberFormat("en-GH", { style: "currency", currency }).format(value);
  }
  return value;
}

function formatStatus(value: string | undefined) {
  if (!value) return "Syncing";
  const normalized = value.trim().toLowerCase();
  if (["success", "paid", "confirmed", "captured"].includes(normalized)) return "Confirmed";
  if (["pending", "pending_payment", "syncing"].includes(normalized)) return "Syncing";
  if (["failed", "payment_failed"].includes(normalized)) return "Payment failed";
  return value.replace(/_/g, " ");
}

export default function SuccessPage() {
  const [details, setDetails] = useState<OrderDetails | null>(null);
  const [customerSnapshot, setCustomerSnapshot] = useState<CheckoutCustomerSnapshot | null>(null);
  const [urlReference, setUrlReference] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("reference") ?? params.get("trxref");
    setUrlReference(ref);
    if (!ref) return;

    fetch(`/api/sedifex/orders/${encodeURIComponent(ref)}`)
      .then((r) => r.json())
      .then((data: OrderDetails) => setDetails(data))
      .catch((error) => {
        console.error("checkout_success_status_failed", error);
        setDetails({ ok: false, reference: ref, error: "Unable to load order status." });
      });
  }, []);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("checkout:last_customer");
      if (!raw) return;
      setCustomerSnapshot(JSON.parse(raw) as CheckoutCustomerSnapshot);
    } catch {
      setCustomerSnapshot(null);
    }
  }, []);

  const customerName = firstValue(details?.customer?.name, details?.customerName, customerSnapshot?.name, "Customer");
  const customerEmail = firstValue(details?.customer?.email, details?.customerEmail, customerSnapshot?.email, "Pending");
  const customerPhone = firstValue(details?.customer?.phone, details?.customerPhone, customerSnapshot?.phone, "Pending");
  const receiptReference = firstValue(
    details?.reference,
    details?.paymentReference,
    details?.payment_reference,
    details?.paystackReference,
    urlReference,
    "Pending"
  );
  const amountPaid = firstValue(details?.amountPaid, details?.amount_paid, details?.amount);
  const amountPaidLabel = formatAmount(amountPaid, details?.currency ?? "GHS");

  const status = useMemo(
    () =>
      formatStatus(
        firstValue(
          details?.status,
          details?.orderStatus,
          details?.order_status,
          details?.paymentStatus,
          details?.payment_status,
          details?.syncStatus,
          details?.sync_status
        )
      ),
    [
      details?.orderStatus,
      details?.order_status,
      details?.paymentStatus,
      details?.payment_status,
      details?.status,
      details?.syncStatus,
      details?.sync_status
    ]
  );

  return (
    <section className="container-shell py-12">
      <h1 className="text-3xl font-bold">Payment successful 🎉</h1>
      <p className="mt-3 text-lg">Thank you, {customerName}. Your order has been received.</p>
      <p className="mt-2 text-gray-700">Our team will confirm your order and arrange delivery within 24 hours.</p>

      <div className="mt-6 space-y-1 rounded-2xl border border-pink-100 bg-white p-4">
        <p>Receipt: {receiptReference}</p>
        <p>Email: {customerEmail}</p>
        <p>Phone: {customerPhone}</p>
        <p>Amount paid: {amountPaidLabel}</p>
        <p>Status: {status}</p>
      </div>

      <div className="mt-5 rounded-2xl bg-pink-50 p-4 text-sm text-gray-800">
        <p className="font-semibold">Need help with your order?</p>
        <p>Call/WhatsApp: {siteConfig.phone}</p>
        <p>Email: {siteConfig.supportEmail}</p>
      </div>

      <Link href="/shop" className="mt-5 inline-block underline">
        Continue shopping
      </Link>
    </section>
  );
}
