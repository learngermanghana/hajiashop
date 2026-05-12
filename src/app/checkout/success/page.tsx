"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type OrderDetails = {
  reference?: string;
  customer?: {
    email?: string;
  };
  amount_paid?: number | string;
  amount?: number | string;
  sync_status?: string;
  status?: string;
};

export default function SuccessPage() {
  const [details, setDetails] = useState<OrderDetails | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("reference") ?? params.get("trxref");
    if (!ref) return;

    fetch(`/api/sedifex/orders/${encodeURIComponent(ref)}`)
      .then((r) => r.json())
      .then((data: OrderDetails) => setDetails(data));
  }, []);

  return (
    <section className="container-shell py-12">
      <h1 className="text-3xl font-bold">Payment successful</h1>
      <p className="mt-3">Receipt: {details?.reference ?? "Pending"}</p>
      <p>Email: {details?.customer?.email ?? "Pending"}</p>
      <p>Amount paid: {details?.amount_paid ?? details?.amount ?? "Pending"}</p>
      <p>Status: {details?.sync_status ?? details?.status ?? "Syncing"}</p>
      <Link href="/shop" className="mt-4 inline-block underline">
        Continue shopping
      </Link>
    </section>
  );
}
