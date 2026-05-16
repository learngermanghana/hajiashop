import { NextResponse } from "next/server";
import { getCatalogData } from "@/lib/catalog";

const cleanText = (value: unknown, max = 300) => (typeof value === "string" ? value.trim().slice(0, max) : "");
const cleanQuantity = (value: unknown) => {
  const parsed = Math.floor(Number(value));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
};

type RequestCartItem = { id?: unknown; productId?: unknown; qty?: unknown; quantity?: unknown };

function normalizeBaseUrl(baseUrl: string) {
  return baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
}

const readRequestedItems = (body: Record<string, unknown>): Array<{ id: string; qty: number }> => {
  const rawItems = Array.isArray(body.items) ? body.items : Array.isArray(body.cart) ? body.cart : [];
  const fromList = rawItems
    .map((item) => item as RequestCartItem)
    .map((item) => ({ id: cleanText(item.id ?? item.productId, 180), qty: cleanQuantity(item.qty ?? item.quantity) }))
    .filter((item) => item.id);

  const singleProductId = cleanText(body.productId, 180);
  if (singleProductId && fromList.length === 0) return [{ id: singleProductId, qty: cleanQuantity(body.quantity) }];
  return fromList;
};

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

    const customer = (body.customer ?? {}) as Record<string, unknown>;
    const delivery = (body.delivery ?? {}) as Record<string, unknown>;
    const customerName = cleanText(customer.name, 160);
    const customerEmail = cleanText(customer.email, 180).toLowerCase();
    const customerPhone = cleanText(customer.phone, 80);
    const deliveryLocation = cleanText(delivery.location, 300);
    const notes = cleanText(delivery.notes, 1000);
    const requestedItems = readRequestedItems(body);

    if (requestedItems.length === 0) return NextResponse.json({ ok: false, error: "Cart is empty." }, { status: 400 });
    if (!customerName) return NextResponse.json({ ok: false, error: "Customer name is required." }, { status: 400 });
    if (!customerPhone) return NextResponse.json({ ok: false, error: "Customer phone is required." }, { status: 400 });
    if (!deliveryLocation) return NextResponse.json({ ok: false, error: "Delivery location is required." }, { status: 400 });

    const { products } = await getCatalogData();
    const validatedItems = requestedItems.map((requested) => {
      const product = products.find((item) => item.id === requested.id || item.slug === requested.id);
      if (!product) throw new Error(`Product not found in Sedifex catalog: ${requested.id}`);
      if (!product.inStock) throw new Error(`${product.name} is out of stock.`);
      return { product, qty: requested.qty };
    });

    const clientOrderId = cleanText(body.clientOrderId, 180) || `HAJ-POD-${Date.now()}`;
    const first = validatedItems[0];
    const productNames = validatedItems.map((item) => `${item.product.name} x${item.qty}`).join(", ");
    const total = validatedItems.reduce((sum, item) => sum + item.product.price * item.qty, 0);
    const payload = {
      merchantId: storeId,
      storeId,
      productId: first.product.id,
      productName: validatedItems.length === 1 ? first.product.name : productNames,
      quantity: validatedItems.reduce((sum, item) => sum + item.qty, 0),
      unitPrice: validatedItems.length === 1 ? first.product.price : total,
      currency: first.product.currency,
      sourceChannel: "client_website",
      source_channel: "client_website",
      sourceLabel: "Hajia Slay Shop Website",
      source_label: "Hajia Slay Shop Website",
      clientOrderId,
      client_order_id: clientOrderId,
      items: validatedItems.map((item) => ({ id: item.product.id, name: item.product.name, unitPrice: item.product.price, qty: item.qty, quantity: item.qty, type: "PRODUCT" })),
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