import { NextResponse } from "next/server";
import { getCatalogData } from "@/lib/catalog";

const cleanText = (value: unknown, max = 300) => (typeof value === "string" ? value.trim().slice(0, max) : "");
const cleanQuantity = (value: unknown) => {
  const parsed = Math.floor(Number(value));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
};

function normalizeBaseUrl(baseUrl: string) {
  return baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
}

async function sendSedifexOrder(payload: Record<string, unknown>) {
  const baseUrl = process.env.SEDIFEX_API_BASE_URL ?? process.env.SEDIFEX_BASE_URL;
  const apiKey = process.env.SEDIFEX_INTEGRATION_KEY ?? process.env.SEDIFEX_API_KEY;
  if (!baseUrl || !apiKey) {
    throw new Error("Sedifex integration is not configured. Missing SEDIFEX_API_BASE_URL or SEDIFEX_INTEGRATION_KEY.");
  }

  const response = await fetch(`${normalizeBaseUrl(baseUrl)}/integration/orders/request`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "x-api-key": apiKey,
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-Sedifex-Contract-Version": process.env.SEDIFEX_CONTRACT_VERSION ?? "2026-04-13",
    },
    body: JSON.stringify(payload),
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : {};
  if (!response.ok) {
    throw new Error(data?.error ?? `Sedifex order request failed (${response.status})`);
  }
  return data;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const storeId = process.env.SEDIFEX_STORE_ID;
    if (!storeId) return NextResponse.json({ ok: false, error: "SEDIFEX_STORE_ID is missing." }, { status: 500 });

    const productId = cleanText(body.productId, 180);
    const quantity = cleanQuantity(body.quantity);
    const customer = (body.customer ?? {}) as Record<string, unknown>;
    const delivery = (body.delivery ?? {}) as Record<string, unknown>;
    const customerName = cleanText(customer.name, 160);
    const customerEmail = cleanText(customer.email, 180).toLowerCase();
    const customerPhone = cleanText(customer.phone, 80);
    const deliveryLocation = cleanText(delivery.location, 300);
    const notes = cleanText(delivery.notes, 1000);

    if (!productId) return NextResponse.json({ ok: false, error: "productId is required." }, { status: 400 });
    if (!customerName) return NextResponse.json({ ok: false, error: "Customer name is required." }, { status: 400 });
    if (!customerPhone) return NextResponse.json({ ok: false, error: "Customer phone is required." }, { status: 400 });
    if (!deliveryLocation) return NextResponse.json({ ok: false, error: "Delivery location is required." }, { status: 400 });

    const { products } = await getCatalogData();
    const product = products.find((item) => item.id === productId || item.slug === productId);
    if (!product) return NextResponse.json({ ok: false, error: "Product not found in Sedifex catalog." }, { status: 404 });
    if (!product.inStock) return NextResponse.json({ ok: false, error: "This product is out of stock." }, { status: 400 });

    const clientOrderId = cleanText(body.clientOrderId, 180) || `HAJ-POD-${Date.now()}`;
    const payload = {
      merchantId: storeId,
      storeId,
      productId: product.id,
      productName: product.name,
      quantity,
      unitPrice: product.price,
      currency: product.currency,
      sourceChannel: "client_website",
      source_channel: "client_website",
      sourceLabel: "Hajia Slay Shop Website",
      source_label: "Hajia Slay Shop Website",
      clientOrderId,
      client_order_id: clientOrderId,
      customer: {
        name: customerName,
        email: customerEmail || null,
        phone: customerPhone,
      },
      delivery: {
        location: deliveryLocation,
        notes: notes || null,
      },
    };

    const result = await sendSedifexOrder(payload);
    return NextResponse.json({ ok: true, ...result, clientOrderId });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "Order request failed." }, { status: 500 });
  }
}
