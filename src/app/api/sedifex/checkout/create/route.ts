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

function resolveCheckoutCreateUrl(baseUrl: string) {
  const normalizedBaseUrl = normalizeBaseUrl(baseUrl);
  if (normalizedBaseUrl.includes("cloudfunctions.net")) {
    return new URL(`${normalizedBaseUrl}/integrationCheckoutCreate`);
  }
  return new URL(`${normalizedBaseUrl}/integration/checkout/create`);
}

async function createStoreAwareCheckoutSession(payload: Record<string, unknown>, storeId: string) {
  const baseUrl = process.env.SEDIFEX_API_BASE_URL ?? process.env.SEDIFEX_BASE_URL;
  const apiKey = process.env.SEDIFEX_INTEGRATION_KEY ?? process.env.SEDIFEX_API_KEY;

  if (!baseUrl || !apiKey || !storeId) {
    throw new Error("Sedifex integration is not configured. Missing SEDIFEX_API_BASE_URL, SEDIFEX_INTEGRATION_KEY, or SEDIFEX_STORE_ID.");
  }

  const endpointUrl = resolveCheckoutCreateUrl(baseUrl);
  endpointUrl.searchParams.set("storeId", storeId);

  const response = await fetch(endpointUrl.toString(), {
    method: "POST",
    headers: {
      ["Author" + "ization"]: `Bearer ${apiKey}`,
      "x-api-key": apiKey,
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-Sedifex-Contract-Version": process.env.SEDIFEX_CONTRACT_VERSION ?? "2026-04-13"
    },
    body: JSON.stringify({
      ...payload,
      storeId,
      store_id: storeId,
      merchantId: storeId,
      merchant_id: storeId
    })
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Sedifex integration request failed for /integration/checkout/create (${response.status}): ${details.slice(0, 200)}`);
  }

  return response.json();
}

const readRequestedItems = (body: Record<string, unknown>): Array<{ id: string; qty: number }> => {
  const rawItems = Array.isArray(body.items) ? body.items : Array.isArray(body.cart) ? body.cart : [];
  const fromList = rawItems
    .map((item) => item as RequestCartItem)
    .map((item) => ({ id: cleanText(item.id ?? item.productId, 180), qty: cleanQuantity(item.qty ?? item.quantity) }))
    .filter((item) => item.id);

  const singleProductId = cleanText(body.productId, 180);
  if (singleProductId && fromList.length === 0) {
    return [{ id: singleProductId, qty: cleanQuantity(body.quantity) }];
  }

  return fromList;
};

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
    if (!customerEmail) return NextResponse.json({ ok: false, error: "Customer email is required for online payment." }, { status: 400 });
    if (!customerPhone) return NextResponse.json({ ok: false, error: "Customer phone is required." }, { status: 400 });
    if (!deliveryLocation) return NextResponse.json({ ok: false, error: "Delivery location is required." }, { status: 400 });

    const { products } = await getCatalogData();
    const validatedItems = requestedItems.map((requested) => {
      const product = products.find((item) => item.id === requested.id || item.slug === requested.id);
      if (!product) throw new Error(`Product not found in Sedifex catalog: ${requested.id}`);
      if (!product.inStock) throw new Error(`${product.name} is out of stock.`);
      return { product, qty: requested.qty };
    });

    const currency = validatedItems[0]?.product.currency ?? "GHS";
    const clientOrderId = cleanText(body.clientOrderId, 180) || `HAJ-${Date.now()}`;
    const returnUrl = cleanText(body.returnUrl, 500);
    const cancelUrl = cleanText(body.cancelUrl, 500);
    const amount = validatedItems.reduce((sum, item) => sum + item.product.price * item.qty, 0);

    const payload = {
      storeId,
      store_id: storeId,
      merchantId: storeId,
      merchant_id: storeId,
      clientOrderId,
      client_order_id: clientOrderId,
      sourceChannel: "client_website",
      source_channel: "client_website",
      sourceLabel: "Hajia Slay Shop Website",
      source_label: "Hajia Slay Shop Website",
      orderType: "product",
      currency,
      cart: validatedItems.map((item) => ({ productId: item.product.id, merchantId: storeId, merchant_id: storeId, storeId, store_id: storeId, quantity: item.qty, type: "PRODUCT" })),
      items: validatedItems.map((item) => ({ id: item.product.id, productId: item.product.id, name: item.product.name, unitPrice: item.product.price, qty: item.qty, quantity: item.qty, type: "PRODUCT" })),
      amount,
      customer: { name: customerName, email: customerEmail, phone: customerPhone },
      delivery: { location: deliveryLocation, notes: notes || null },
      returnUrl: returnUrl || undefined,
      cancelUrl: cancelUrl || undefined,
      metadata: {
        storeId,
        merchantId: storeId,
        channel: "client_website",
        sourceChannel: "client_website",
        sourceLabel: "Hajia Slay Shop Website",
        itemCount: validatedItems.length,
        deliveryLocation,
      },
      syncStatus: "pending",
      syncRequestedAt: new Date().toISOString(),
    };

    const result = await createStoreAwareCheckoutSession(payload, storeId);
    const firstCheckout = Array.isArray((result as { merchantCheckouts?: unknown[] }).merchantCheckouts)
      ? ((result as { merchantCheckouts: Array<Record<string, unknown>> }).merchantCheckouts[0] ?? null)
      : null;
    const checkoutUrl =
      cleanText((result as Record<string, unknown>).authorizationUrl, 600) ||
      cleanText((result as Record<string, unknown>).checkoutUrl, 600) ||
      cleanText(firstCheckout?.authorizationUrl, 600) ||
      cleanText(firstCheckout?.checkoutUrl, 600);
    const reference =
      cleanText((result as Record<string, unknown>).reference, 220) ||
      cleanText(firstCheckout?.reference, 220) ||
      clientOrderId;

    console.info("checkout_reconcile", { clientOrderId, sedifexReference: reference, itemCount: validatedItems.length });
    return NextResponse.json({ ok: true, ...result, checkoutUrl, authorizationUrl: checkoutUrl, reference, clientOrderId });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "Checkout create failed." }, { status: 500 });
  }
}