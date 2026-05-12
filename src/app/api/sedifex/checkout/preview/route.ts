import { NextResponse } from "next/server";

function normalizeBaseUrl(baseUrl: string) {
  return baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const baseUrl = process.env.SEDIFEX_API_BASE_URL ?? process.env.SEDIFEX_BASE_URL;
    const apiKey = process.env.SEDIFEX_INTEGRATION_KEY ?? process.env.SEDIFEX_API_KEY;
    const storeId = process.env.SEDIFEX_STORE_ID;

    if (!baseUrl || !apiKey || !storeId) {
      return NextResponse.json({ ok: false, error: "Sedifex preview is not configured." }, { status: 500 });
    }

    const response = await fetch(`${normalizeBaseUrl(baseUrl)}/checkout/preview`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "x-api-key": apiKey,
        "Content-Type": "application/json",
        "X-Sedifex-Contract-Version": process.env.SEDIFEX_CONTRACT_VERSION ?? "2026-04-13"
      },
      body: JSON.stringify({ ...body, merchant_id: storeId })
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Checkout preview failed." },
      { status: 500 }
    );
  }
}
