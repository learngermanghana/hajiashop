import { NextResponse } from "next/server";
import { createSedifexCheckoutSession } from "@/lib/sedifex";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const storeId = process.env.SEDIFEX_STORE_ID;

    if (!storeId) {
      return NextResponse.json({ ok: false, error: "SEDIFEX_STORE_ID is missing." }, { status: 500 });
    }

    const payload = {
      ...body,
      storeId,
      // pre-checkout identifier must use bookingId, not sedifexOrderId
      bookingId: body.bookingId ?? body.clientOrderId,
      syncStatus: "pending",
      syncRequestedAt: new Date().toISOString()
    };

    const result = await createSedifexCheckoutSession(payload);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Checkout create failed." },
      { status: 500 }
    );
  }
}
