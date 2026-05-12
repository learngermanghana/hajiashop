import { NextResponse } from "next/server";
import { fetchSedifexOrderByReference } from "@/lib/sedifex";

export async function GET(_: Request, context: { params: Promise<{ reference: string }> }) {
  try {
    const { reference } = await context.params;
    const result = await fetchSedifexOrderByReference(reference);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Unable to fetch order status." },
      { status: 500 }
    );
  }
}
