import { NextResponse } from "next/server";
import { createSedifexCheckoutSession } from "@/lib/sedifex";
import { products } from "@/data/products";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const storeId = process.env.SEDIFEX_STORE_ID;
    if (!storeId) return NextResponse.json({ ok: false, error: "SEDIFEX_STORE_ID is missing." }, { status: 500 });

    const rawItems = Array.isArray(body.items) ? body.items : [];
    if (!rawItems.length) return NextResponse.json({ ok: false, error: "Cart empty." }, { status: 400 });

    const authoritativeItems = rawItems.map((item) => {
      const product = products.find((p) => p.id === item.id);
      const qty = Number(item.qty);
      if (!product || !Number.isFinite(qty) || qty < 1) throw new Error("Invalid item in cart.");
      return { id: product.id, name: product.name, unitPrice: product.price, qty: Math.floor(qty) };
    });

    const amount = authoritativeItems.reduce((sum, i) => sum + i.unitPrice * i.qty, 0);

    const payload = {
      ...body,
      amount,
      items: authoritativeItems,
      storeId,
      bookingId: body.bookingId ?? body.clientOrderId,
      syncStatus: "pending",
      syncRequestedAt: new Date().toISOString()
    };

    const result = await createSedifexCheckoutSession(payload);
    console.info("checkout_reconcile", { clientOrderId: body.clientOrderId, sedifexReference: result?.reference, paystackReference: result?.paystackReference });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "Checkout create failed." }, { status: 500 });
  }
}
