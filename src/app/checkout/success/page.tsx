"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { siteConfig } from "@/data/site";

type OrderDetails = {
  reference?: string;
  customer?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  amount_paid?: number | string;
  amount?: number | string;
  sync_status?: string;
  status?: string;
};

type CheckoutCustomerSnapshot = {
  name?: string;
  email?: string;
  phone?: string;
  deliveryLocation?: string;
};

export default function SuccessPage() {
  const [details, setDetails] = useState<OrderDetails | null>(null);
  const [customerSnapshot, setCustomerSnapshot] = useState<CheckoutCustomerSnapshot | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("reference") ?? params.get("trxref");
    if (!ref) return;

    fetch(`/api/sedifex/orders/${encodeURIComponent(ref)}`)
      .then((r) => r.json())
      .then((data: OrderDetails) => setDetails(data));
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

  const customerName = details?.customer?.name ?? customerSnapshot?.name ?? "Customer";
  const customerEmail = details?.customer?.email ?? customerSnapshot?.email ?? "Pending";
  const customerPhone = details?.customer?.phone ?? customerSnapshot?.phone ?? "Pending";

  const status = useMemo(() => details?.sync_status ?? details?.status ?? "Syncing", [details?.status, details?.sync_status]);

  return (
    <section className="container-shell py-12">
      <h1 className="text-3xl font-bold">Payment successful 🎉</h1>
      <p className="mt-3 text-lg">Thank you, {customerName}. Your order has been received.</p>
      <p className="mt-2 text-gray-700">Our team will confirm your order and arrange delivery within 24 hours.</p>

      <div className="mt-6 space-y-1 rounded-2xl border border-pink-100 bg-white p-4">
        <p>Receipt: {details?.reference ?? "Pending"}</p>
        <p>Email: {customerEmail}</p>
        <p>Phone: {customerPhone}</p>
        <p>Amount paid: {details?.amount_paid ?? details?.amount ?? "Pending"}</p>
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
