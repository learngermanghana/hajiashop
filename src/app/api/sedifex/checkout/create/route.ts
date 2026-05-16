import { NextResponse } from "next/server";
import { getCatalogData } from "@/lib/catalog";
import { createSedifexCheckoutSession } from "@/lib/sedifex";

const cleanText = (value: unknown, max = 300) => (typeof value === "string" ? value.trim().slice(0, max) : "");
const cleanQuantity = (value: unknown) => {
  const parsed = Math.floor(Number(value));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
};

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
    if (!customerEmail) return NextResponse.json({ ok: false, error: "Customer email is required for online payment." }, { status: 400 });
    if (!customerPhone) return NextResponse.json({ ok: false, error: "Customer phone is required." }, { status: 400 });
    if (!deliveryLocation) return NextResponse.json({ ok: false, error: "Delivery location is required." }, { status: 400 });

    const { products } = await getCatalogData();
    const product = products.find((item) => item.id === productId || item.slug === productId);
    if (!product) return NextResponse.json({ ok: false, error: "Product not found in Sedifex catalog." }, { status: 404 });
    if (!product.inStock) return NextResponse.json({ ok: false, error: "This product is out of stock." }, { status: 400 });

    const clientOrderId = cleanText(body.clientOrderId, 180) || `HAJ-${Date.now()}`;
    const returnUrl = cleanText(body.returnUrl, 500);
    const cancelUrl = cleanText(body.cancelUrl, 500);

    const payload = {
      storeId,
      merchantId: storeId,
      clientOrderId,
      client_order_id: clientOrderId,
      sourceChannel: "client_website",
      source_channel: "client_website",
      sourceLabel: "Hajia Slay Shop Website",
      source_label: "Hajia Slay Shop Website",
      orderType: "product",
      currency: product.currency,
      cart: [{ productId: product.id, merchantId: storeId, quantity, type: "PRODUCT" }],
      items: [{ id: product.id, name: product.name, unitPrice: product.price, qty: quantity, quantity, type: "PRODUCT" }],
      amount: product.price * quantity,
      customer: { name: customerName, email: customerEmail, phone: customerPhone },
      delivery: { location: deliveryLocation, notes: notes || null },
      returnUrl: returnUrl || undefined,
      cancelUrl: cancelUrl || undefined,
      metadata: {
        channel: "client_website",
        sourceChannel: "client_website",
        sourceLabel: "Hajia Slay Shop Website",
        productId: product.id,
        productName: product.name,
        deliveryLocation,
      },
      syncStatus: "pending",
      syncRequestedAt: new Date().toISOString(),
    };

    const result = await createSedifexCheckoutSession(payload);
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

    console.info("checkout_reconcile", { clientOrderId, sedifexReference: reference });
    return NextResponse.json({ ok: true, ...result, checkoutUrl, authorizationUrl: checkoutUrl, reference, clientOrderId });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "Checkout create failed." }, { status: 500 });
  }
}
